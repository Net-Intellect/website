"""Publish the site to the live host (Synergy Wholesale cPanel) through the cPanel API.

Needs a cPanel API token in a local file (never in the repo): line 1 the cPanel
URL (https://s241.syd4.hostingplatform.net.au:2083), line 2 the cPanel user,
line 3 the token. Default path C:/Users/ad/cpanel-token.txt, or set CPANEL_TOKEN_FILE.

  python deploy/deploy.py build             # production build + .htaccess, no upload
  python deploy/deploy.py stage             # upload to ~/site-deploy/stage (not public) to test the mechanism
  python deploy/deploy.py live              # upload into public_html (the live site)
  python deploy/deploy.py retire-wordpress  # cutover only: move WordPress out of public_html
  python deploy/deploy.py restore-wordpress # rollback: remove the new site, move WordPress back
  python deploy/deploy.py check             # smoke-test the live site (pages, redirects, headers)

Uploads add and overwrite files; they don't delete files the new build no longer has.
"""
import json
import os
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path
from urllib.parse import urlencode

SITE = Path(__file__).resolve().parent.parent
DIST = SITE / "dist"
TOKEN_FILE = Path(os.environ.get("CPANEL_TOKEN_FILE", "C:/Users/ad/cpanel-token.txt"))

HOME = "/home/netintel"
WEBROOT = f"{HOME}/public_html"
DEPLOY_DIR = f"{HOME}/site-deploy"
RETIRED = f"{HOME}/wordpress-retired-2026-11"
# Things in public_html that aren't WordPress and must stay put.
KEEP = {".well-known", "cgi-bin", "kiss", "netintellect.com.au", "BingSiteAuth.xml"}


def creds():
    lines = [l.strip() for l in TOKEN_FILE.read_text(encoding="utf-8").splitlines()]
    return lines[0].rstrip("/"), lines[1], lines[2]


def curl(args):
    host, user, token = creds()
    out = subprocess.run(
        ["curl", "-sS", "-f", "-H", f"Authorization: cpanel {user}:{token}", *args(host)],
        capture_output=True, encoding="utf-8", errors="replace",
    )
    if out.returncode:
        sys.exit(f"cPanel request failed: {out.stderr.strip()}")
    return json.loads(out.stdout)


def uapi(func, **params):
    data = curl(lambda h: [f"{h}/execute/{func}?{urlencode(params)}"])
    if data.get("errors"):
        sys.exit(f"{func}: {data['errors']}")
    return data.get("data")


def api2(module, func, **params):
    q = {"cpanel_jsonapi_apiversion": 2, "cpanel_jsonapi_module": module, "cpanel_jsonapi_func": func, **params}
    data = curl(lambda h: [f"{h}/json-api/cpanel?{urlencode(q)}"])["cpanelresult"]
    if data.get("error"):
        sys.exit(f"{module}::{func}: {data['error']}")
    for item in data.get("data") or []:
        if isinstance(item, dict) and item.get("result") == 0:
            sys.exit(f"{module}::{func}: {item.get('reason')}")
    return data.get("data")


def mkdir(parent, name):
    if name not in listdir(parent):
        api2("Fileman", "mkdir", path=parent, name=name)


def listdir(path):
    return [f["file"] for f in uapi("Fileman/list_files", dir=path, show_hidden=1) or []]


def build():
    subprocess.run("npm run build", shell=True, cwd=SITE, check=True)
    subprocess.run([sys.executable, str(SITE / "deploy" / "build_htaccess.py"), str(DIST)], check=True)
    # The Decap CMS admin isn't set up; don't publish it.
    shutil.rmtree(DIST / "admin", ignore_errors=True)
    zpath = SITE / "deploy" / "site.zip"
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(DIST.rglob("*")):
            if f.is_file():
                z.write(f, f.relative_to(DIST).as_posix())
    print(f"Built {zpath.name}: {zpath.stat().st_size // 1024} KB")
    return zpath


def upload(target):
    zpath = build()
    mkdir(HOME, "site-deploy")
    curl(lambda h: [
        "-F", f"dir={DEPLOY_DIR}", "-F", "overwrite=1", "-F", f"file-1=@{zpath};filename=site.zip",
        f"{h}/execute/Fileman/upload_files",
    ])
    if target != WEBROOT:
        parent, name = target.rsplit("/", 1)
        mkdir(parent, name)
    api2("Fileman", "fileop", op="extract", sourcefiles=f"{DEPLOY_DIR}/site.zip", destfiles=target, doubledecode=0)
    api2("Fileman", "fileop", op="unlink", sourcefiles=f"{DEPLOY_DIR}/site.zip", doubledecode=0)
    names = listdir(target)
    for must in ("index.html", ".htaccess", "404.html"):
        if must not in names:
            sys.exit(f"Upload finished but {must} is missing from {target}")
    print(f"Published to {target} ({len(names)} top-level items)")


def retire_wordpress():
    names = listdir(WEBROOT)
    if "wp-config.php" not in names:
        sys.exit("No wp-config.php in public_html: WordPress already retired?")
    mkdir(HOME, RETIRED.rsplit("/", 1)[1])
    move = [n for n in names if n not in KEEP]
    for n in move:
        api2("Fileman", "fileop", op="move", sourcefiles=f"{WEBROOT}/{n}", destfiles=RETIRED, doubledecode=0)
    print(f"Moved {len(move)} items to {RETIRED}; kept {sorted(KEEP & set(names))}")


def restore_wordpress():
    retired = listdir(RETIRED)
    if "wp-config.php" not in retired:
        sys.exit(f"No wp-config.php in {RETIRED}: nothing to restore")
    for n in listdir(WEBROOT):
        if n not in KEEP:
            api2("Fileman", "fileop", op="trash", sourcefiles=f"{WEBROOT}/{n}", doubledecode=0)
    for n in retired:
        api2("Fileman", "fileop", op="move", sourcefiles=f"{RETIRED}/{n}", destfiles=WEBROOT, doubledecode=0)
    print(f"WordPress restored to {WEBROOT}; the new site's files are in cPanel's Trash")


CHECKS = [
    # (url, expected status, expected redirect target or None)
    ("https://netintellect.com.au/", 200, None),
    ("https://netintellect.com.au/services/", 200, None),
    ("https://netintellect.com.au/services/voice-voip/", 200, None),
    ("https://netintellect.com.au/contact/", 200, None),
    ("https://netintellect.com.au/privacy/", 200, None),
    ("https://netintellect.com.au/sitemap.xml", 200, None),
    ("https://netintellect.com.au/no-such-page/", 404, None),
    ("http://netintellect.com.au/", 301, "https://netintellect.com.au/"),
    ("https://www.netintellect.com.au/about/", 301, "https://netintellect.com.au/about/"),
    ("https://ssl.netintellect.com.au/", 301, "https://netintellect.com.au/"),
    ("https://netintellect.com.au/contact-us/", 301, "https://netintellect.com.au/contact/"),
    ("https://netintellect.com.au/it-solutions/voice-ip-services/", 301, "https://netintellect.com.au/services/voice-voip/"),
    ("https://netintellect.com.au/product/rapidssl-certificate/", 301, "https://netintellect.com.au/contact/"),
    ("https://netintellect.com.au/10-steps-to-prevent-a-data-breach/", 301, "https://netintellect.com.au/blog/"),
    ("https://netintellect.com.au/wp-login.php", 404, None),
    ("https://domains.netintellect.com.au/", 200, None),
]


def check():
    failed = 0
    for url, status, target in CHECKS:
        out = subprocess.run(
            ["curl", "-s", "-o", os.devnull, "-w", "%{http_code} %{redirect_url}", url],
            capture_output=True, encoding="utf-8",
        ).stdout.split(" ", 1)
        code, loc = int(out[0]), (out[1] if len(out) > 1 else "")
        ok = code == status and (target is None or loc == target)
        failed += not ok
        print(f"{'ok  ' if ok else 'FAIL'} {code} {url}{' -> ' + loc if loc else ''}")
    head = subprocess.run(["curl", "-sI", "https://netintellect.com.au/"], capture_output=True, encoding="utf-8").stdout
    for h in ("strict-transport-security", "content-security-policy", "x-frame-options"):
        ok = h in head.lower()
        failed += not ok
        print(f"{'ok  ' if ok else 'FAIL'} header {h}")
    sys.exit(f"{failed} check(s) failed" if failed else "All checks passed")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "check":
        check()
    elif cmd == "build":
        build()
    elif cmd == "stage":
        upload(f"{DEPLOY_DIR}/stage")
    elif cmd == "live":
        upload(WEBROOT)
    elif cmd == "retire-wordpress":
        retire_wordpress()
    elif cmd == "restore-wordpress":
        restore_wordpress()
    else:
        sys.exit(__doc__)
