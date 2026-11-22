/**
 * Landing page copy, as data.
 *
 * WHY COPY LIVES HERE AND NOT IN THE COMPONENTS
 *   Five separate places described cold outreach in near-identical words, and
 *   nobody noticed because each lived inside a different JSX file. Copy in one
 *   module makes repetition visible, and makes a variant swappable without
 *   touching layout.
 *
 * Variant 0 is ALWAYS the copy currently in production, so the default render
 * is byte-identical to today and the preview lab is the only thing that shows
 * anything else.
 *
 * WHAT THE ALTERNATIVES ARE TRYING TO FIX
 *   · Em-dashes in nearly every sentence — the clearest machine tell.
 *   · The "X, not Y" construction, used six times across the site.
 *   · The same four capabilities re-described on five different pages.
 *   · Numbers (250, 180, four, twelve, 25) recycled with no new meaning.
 */

export const HERO = [
  {
    label: "Current",
    kicker: "Built for your placement year",
    lines: ["Get seen by", "real recruiters."],
    second: { lead: "And find the jobs", accent: "worth applying to." },
    sub: "Cold outreach, matched jobs, one-click autofill and mentorship — one payment, twelve months. Less than a month of LinkedIn Premium.",
    cta: "Start your year",
    micro: "₹999 · full refund within 7 days",
  },
  {
    label: "Mechanism",
    kicker: "For students without a referral",
    lines: ["Your application", "is one of 250."],
    second: { lead: "Your email is", accent: "one of three." },
    sub: "Outmail writes to the people doing the hiring, from your own Gmail, using your own resume. Then it finds the openings worth that effort.",
    cta: "Start your year",
    micro: "₹999 for twelve months. Refundable for 7 days.",
  },
  {
    label: "Reversal",
    kicker: "Built for your placement year",
    lines: ["Applying harder", "is not the answer."],
    second: { lead: "Being reachable", accent: "is." },
    sub: "Four hundred applications and no referrals is not a work-rate problem. It is a reach problem, and reach is the thing Outmail actually changes.",
    cta: "Fix your reach",
    micro: "₹999 for the year. Full refund within 7 days.",
  },
  {
    label: "The gap",
    kicker: "For students without a referral",
    lines: ["Some students have", "a name to drop."],
    second: { lead: "You have", accent: "Outmail." },
    sub: "It puts you in front of the same recruiters a referral would, from your own inbox, with your resume doing the talking. Then it finds the roles worth that introduction.",
    cta: "Start your year",
    micro: "₹999 · one payment · nothing renews",
  },
  {
    label: "One season",
    kicker: "You get one placement season",
    lines: ["Spend it on the", "twelve that can land."],
    second: { lead: "Not the four hundred", accent: "that can't." },
    sub: "Outmail finds the openings that actually match you, emails the people hiring for them from your own Gmail, and fills in the forms you would otherwise retype.",
    cta: "Start your year",
    micro: "₹999 for twelve months · refundable for 7 days",
  },
];

export const EDITORIAL = [
  {
    label: "Current",
    kicker: "The four things",
    lines: ["Four problems.", "One subscription-free", "year."],
    items: [
      {
        t: "Cold outreach",
        d: "Reach recruiters directly, from your own Gmail, with a message written for that company.",
      },
      {
        t: "Matched jobs",
        d: "See the openings that fit your resume, and why they fit, before you spend an hour on one.",
      },
      {
        t: "One-click autofill",
        d: "Stop retyping your notice period. Save your answers once and reuse them everywhere.",
      },
      {
        t: "Mentorship",
        d: "Ask someone who has already done it, twice a month, in a group of twenty-five.",
      },
    ],
  },
  {
    label: "Previous",
    kicker: "The four things",
    lines: ["Four problems.", "One subscription-free", "year."],
    items: [
      {
        t: "Reach",
        d: "Emails to the person hiring, written from your resume and sent from your inbox.",
      },
      {
        t: "Find",
        d: "Openings pulled from job boards and company sites, ranked against what you can do.",
      },
      {
        t: "Apply",
        d: "A browser extension that completes the form while you read the job description.",
      },
      {
        t: "Close",
        d: "Fortnightly sessions with people who have been through the loop you are entering.",
      },
    ],
  },
  {
    label: "The filter",
    kicker: "What you actually get",
    lines: ["An ATS is a filter.", "It was never meant", "to find you."],
    items: [
      {
        t: "Cold outreach",
        d: "Your Gmail, your resume, one recruiter at a time. We never send as Outmail.",
      },
      {
        t: "Matched jobs",
        d: "Every opening carries a score and the reason for it, so you can disagree with us.",
      },
      {
        t: "One-click autofill",
        d: "Write your answers once. The extension does the retyping for the next fifty forms.",
      },
      {
        t: "Mentorship",
        d: "Twenty-five seats with people who have sat on the other side of that interview.",
      },
    ],
  },
  {
    label: "Four verbs",
    kicker: "How the year runs",
    lines: ["Reach. Find.", "Apply. Close."],
    items: [
      {
        t: "Reach",
        d: "Emails to the person hiring, written from your resume and sent from your inbox.",
      },
      {
        t: "Find",
        d: "Openings pulled from job boards and company sites, ranked against what you can do.",
      },
      {
        t: "Apply",
        d: "A browser extension that completes the form while you read the job description.",
      },
      {
        t: "Close",
        d: "Fortnightly sessions with people who have been through the loop you are entering.",
      },
    ],
  },
  {
    label: "Second person",
    kicker: "What changes",
    lines: ["You are not short", "of effort. You are", "short of reach."],
    items: [
      {
        t: "Cold outreach",
        d: "You email the hiring manager. From your address, in your words, with your resume attached.",
      },
      {
        t: "Matched jobs",
        d: "You see why a role scored 94 and another scored 58, and you decide which is worth the hour.",
      },
      {
        t: "One-click autofill",
        d: "You answer the standard questions once. Every form after that fills itself.",
      },
      {
        t: "Mentorship",
        d: "You ask the questions you have nobody else to ask. Twenty-five seats, twice a month.",
      },
    ],
  },
];

export const CLOSING = [
  {
    label: "Current",
    lines: ["Every week you wait", "is a week of "],
    accent: "openings.",
    priceSuffix: "for the whole season",
    sub: "One payment. Nothing renews, ever. If it is not for you, ask within 7 days and we refund all of it.",
    cta: "Start this week",
  },
  {
    label: "Comparison",
    lines: ["Less than a month", "of LinkedIn "],
    accent: "Premium.",
    priceSuffix: "for twelve months of Outmail",
    sub: "Paid once. No renewal, no upsell, no usage meter. Refunded in full if you ask within 7 days.",
    cta: "Get Outmail",
  },
  {
    label: "Direct",
    lines: ["Ready to be", "one of the "],
    accent: "twelve?",
    priceSuffix: "for the year",
    sub: "One payment, twelve months, nothing renews. Full refund within 7 days if it does not work for you.",
    cta: "Start your year",
  },
  {
    label: "Understated",
    lines: ["That is the", "whole "],
    accent: "product.",
    priceSuffix: "once, for twelve months",
    sub: "No subscription. No renewal. Refundable for 7 days, no questions.",
    cta: "Start your year",
  },
];

/**
 * The product demo behind the hero's "Watch demo" button.
 *
 * The MP4 lives on S3, not in /public: it is ~35 MB, which would bloat the
 * repo and count against Vercel bandwidth on every play. It must use the
 * PATH-style URL — the bucket name has a dot ("outmail.in"), so the
 * virtual-hosted form (outmail.in.s3.…) fails Amazon's TLS wildcard cert.
 * The bucket only serves prefixes its policy makes public (marketing/ here).
 * Poster and captions are small, so they ship with the site (same origin, no
 * CORS needed for the <track>).
 *
 * New cut of the video → upload under a NEW file name and change `src`, so no
 * browser or CDN keeps serving the old one.
 */
export const DEMO_VIDEO = {
  src: "https://s3.ap-south-1.amazonaws.com/outmail.in/marketing/outmail-demo-v3-1080p.mp4",
  poster: "/demo/outmail-demo-poster.jpg",
  captions: "/demo/outmail-demo-en.vtt",
  title: "Outmail in 72 seconds",
  button: "Watch demo",
  length: "1:12",
};
