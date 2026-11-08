// The free Cybersecurity Review booking form (Microsoft Forms). Every "Book Your
// Cybersecurity Review" button links here; FormPopup.astro opens it in a pop-up.
export const REVIEW_FORM_URL =
  "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=yLd1AWdk70iqiXi1pr6OhevVUgY0_ptMosGm8-OYPn1UQUZUWjc2QlJSRlJMWlExRkJOVzVUQzRIUC4u";

// The general enquiry / quote request form (Microsoft Forms). Both Contact page
// cards link here. Leave empty until the form exists: the buttons then open a
// pre-addressed email instead, so the page always works.
export const CONTACT_FORM_URL = "";

// The SupportNet Security estimate form (Microsoft Forms). Its link must not be
// public until the go-live gate in the Build Instructions library is ticked, so
// it's kept out of this repo: empty means no estimate buttons or dialog anywhere.
// Local testing reads it from the git-ignored .env.development. At go-live,
// replace this with the link itself.
export const ESTIMATE_FORM_URL: string = import.meta.env.PUBLIC_ESTIMATE_FORM_URL ?? "";
