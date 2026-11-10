// Industry pages at /industries/<slug>. A page marked `draft: true` is built
// only for the GitHub Pages preview, never for netintellect.com.au, so it can be
// reviewed without going live. Remove `draft` to publish it (it then joins the
// Industries page cards and the sitemap on the live site too).
export interface Industry {
  slug: string;
  name: string;
  icon: string;
  draft?: boolean;
  card: string; // one line for the Industries page card
  headline: string;
  summary: string;
  challenges: string[];
  help: { title: string; body: string }[];
  proof?: { client: string; quote: string; attribution: string; href: string };
  proofPlaceholder?: string; // shown on drafts until a real client example is agreed
}

export const industryPages: Industry[] = [
  {
    slug: "manufacturing",
    name: "Manufacturing & Engineering",
    icon: "factory",
    draft: true,
    card: "Production, design and office systems that can't afford to stop, from CAD workstations to the shop floor. Larsen Engineering has been with us for over 20 years.",
    headline: "IT That Keeps Production Moving",
    summary:
      "Reliable support for manufacturers and engineering firms across Albury-Wodonga and the Riverina: the office, the shop floor and the systems that join them up.",
    challenges: [
      "Downtime stops the line. A failed PC, network switch or server can idle staff and push out delivery dates.",
      "Shop-floor computers run machines and production software that can't be updated or rebooted on a whim.",
      "Design files, drawings and customer specifications are valuable, and a favourite target for ransomware.",
      "Specialist software (CAD/CAM, ERP or MRP, production scheduling) depends on licensing, vendors and the right hardware.",
      "Sheds and workshops are hard places for Wi-Fi and cabling, and machines and office PCs often share one flat network.",
      "Customers and supply chains increasingly ask about your cybersecurity before they'll do business.",
    ],
    help: [
      {
        title: "Office to shop floor networks",
        body: "Wired and wireless networks designed for sheds, workshops and multiple buildings, with production machines kept separate from office and guest traffic.",
      },
      {
        title: "Design and engineering workstations",
        body: "Specifying, building and supporting CAD and CAM workstations, licence servers and the large-file storage they rely on.",
      },
      {
        title: "Business systems and vendors",
        body: "We work with your ERP, MRP and production software vendors on upgrades, faults and access, so you don't have to be the go-between.",
      },
      {
        title: "Locked-down shop-floor PCs",
        body: "Application allowlisting and managed patching that suit fixed-purpose machines: only approved software runs, and updates happen when production allows.",
      },
      {
        title: "Backup and recovery for design data",
        body: "Tested backups of drawings, job files and production data, with a recovery plan that gets you running again quickly after a failure or attack.",
      },
      {
        title: "Security your customers will ask about",
        body: "Email security, monitoring and response, and the documentation you need when a customer or supplier sends a security questionnaire.",
      },
    ],
    proof: {
      client: "Larsen Engineering",
      quote:
        "They understand our advanced manufacturing environment, keep pace with rapidly evolving technology, and provide practical, reliable support that keeps our business moving.",
      attribution: "Benjamin Larsen, Managing Director, Larsen Engineering Pty. Ltd.",
      href: "/client-results",
    },
  },
  {
    slug: "automotive",
    name: "Automotive Dealerships & Workshops",
    icon: "car",
    draft: true,
    card: "Dealerships, service workshops and parts businesses, where the dealer system, phones and customer data all have to work from opening time.",
    headline: "IT for Dealerships, Workshops and Parts",
    summary:
      "Support for automotive businesses across Albury-Wodonga and the Riverina, from the sales floor and service desk to the workshop and parts counter.",
    challenges: [
      "The dealer management system (DMS) runs sales, service, parts and finance. When it's slow or down, the whole business feels it.",
      "Service bookings and customer calls come in all day, and missed calls are missed jobs.",
      "Customer records, driver's licences and finance applications are sensitive personal information you're responsible for protecting.",
      "Workshop diagnostic laptops, manufacturer portals and software updates each have their own requirements.",
      "Customer lounge Wi-Fi, CCTV and workshop equipment all share the building's network.",
      "Multiple sites or franchises need the same reliable setup at every location.",
    ],
    help: [
      {
        title: "Dealer and business systems",
        body: "Keeping the computers, network and access your DMS depends on running smoothly, and working with your DMS provider when something goes wrong.",
      },
      {
        title: "Phones that don't miss a booking",
        body: "Business phone systems and Microsoft Teams calling, with call queues for sales, service and parts so customers reach the right person.",
      },
      {
        title: "Protecting customer data",
        body: "Email security, managed antivirus, application control and monitoring that protect the personal and finance information you hold.",
      },
      {
        title: "Workshop technology",
        body: "Support for diagnostic laptops, manufacturer portal access and the network connections workshop equipment needs.",
      },
      {
        title: "Secure, separate networks",
        body: "Customer Wi-Fi, CCTV and workshop equipment kept separate from the systems that hold customer and financial data.",
      },
      {
        title: "Consistent across sites",
        body: "The same setup, security and support at every location, so staff can move between sites and everything just works.",
      },
    ],
    proofPlaceholder:
      "Client example to come. We'll add a quote or short case study from an automotive client once one is agreed.",
  },
];

// Only drafts are hidden, and only from the live build.
export const isPreviewBuild = import.meta.env.BASE_URL !== "/";
export const visibleIndustries = industryPages.filter((i) => !i.draft || isPreviewBuild);
