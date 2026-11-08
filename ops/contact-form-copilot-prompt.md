# Contact form — prompt for Copilot in Microsoft Forms

Paste the block below into Copilot in Microsoft Forms. Style it like the other two forms: charcoal background (`../form-assets/form-background-charcoal.jpg`), white logo (`../form-assets/form-logo-white.png`), theme colour #0098D6, "Anyone can respond", "Hide Submit another response" ticked, email notifications on.

Send the form's link to Claude. It goes into `CONTACT_FORM_URL` in `site/src/lib/offers.ts`, and both Contact page buttons (General Enquiry and Request a Quote) then open it in the pop-up. Until then, they open a pre-addressed email to info@.

---

```text
Create a form titled "Contact Net Intellect" for Net Intellect, an IT company in Albury.

Description: "Send us a question or ask for a quote. The right person from our local team will get back to you within one business day."

Questions:
1. What can we help with? (choice, required): General enquiry; Request a quote; Support for an existing service; Other
2. Your name (text, required)
3. Business name (text)
4. Email (text, required)
5. Phone (text)
6. Which service is this about? (choice, multiple answers): Managed IT support; Cybersecurity; Microsoft 365 and cloud; Phone systems and mobile plans; Networking; Broadband; Backup and disaster recovery; Not sure
7. Number of staff (choice): 1-4; 5-19; 20-49; 50-99; 100+
8. Your message (long text, required)
9. Best way to reach you (choice): Phone; Email; Either

Thank-you message: "Thanks. We'll be in touch within one business day. If it's urgent, call us on (02) 6051 0999."
```

Note for existing clients: urgent support should still go to the phone line or Remote Support, not this form.
