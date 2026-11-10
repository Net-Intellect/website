// The free Cybersecurity Review booking form (Microsoft Forms). Every "Book Your
// Cybersecurity Review" button links here; FormPopup.astro opens it in a pop-up.
export const REVIEW_FORM_URL =
  "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=yLd1AWdk70iqiXi1pr6OhevVUgY0_ptMosGm8-OYPn1UQUZUWjc2QlJSRlJMWlExRkJOVzVUQzRIUC4u";

// The general enquiry / quote request form (Microsoft Forms). Both Contact page
// cards link here. Leave empty until the form exists: the buttons then open a
// pre-addressed email instead, so the page always works.
export const CONTACT_FORM_URL = "";

// The SupportNet Security estimate form (Microsoft Forms). Switched on 2026-11-10
// on André's instruction, ahead of the Build Instructions go-live gate (he chose
// to override it). Empty would mean no estimate buttons or dialog anywhere.
export const ESTIMATE_FORM_URL: string = "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=yLd1AWdk70iqiXi1pr6Ohco4zGik0YRFszTYhKuzfsZUNFBUWlpMUFlEM01EUVQ4WjQyVEtGTjE2SSQlQCN0PWcu";

// Where the estimate buttons show. The SupportNet Security page always has them
// while ESTIMATE_FORM_URL is set. André wants that page only for now (2026-11-10):
// set this to true to add them to the homepage hero and Cybersecurity & Compliance.
export const ESTIMATE_ON_OTHER_PAGES = false;
