/**
 * The FAQ content, as data.
 *
 * WHY IT IS NOT IN THE COMPONENT
 *   /faq publishes FAQPage structured data, and Google requires every
 *   question and answer in that schema to be visible on the page. Generating
 *   the schema from the same array the component renders is what guarantees
 *   that — a second copy would drift, and drifting schema is what earns a
 *   manual penalty.
 *
 *   It cannot live in Faq.jsx because that file is "use client". A server
 *   component importing a constant from a client module receives a client
 *   REFERENCE, not the value — which fails at build time with a message
 *   ("a.map is not a function") that gives no hint of the real cause.
 *
 * Icons are deliberately absent: they are presentation, they cannot cross the
 * server boundary, and the schema has no use for them.
 */
export const FAQS = [
  {
    cat: "Money",
    q: "Is this a subscription? Will I be charged again?",
    a: "No. You pay once for one year of access, and nothing renews automatically. We will never charge your card a second time unless you choose to buy another year.",
  },
  {
    cat: "Money",
    q: "What if it doesn't work for me?",
    a: "Ask for a refund within 7 days of paying and we refund in full, without asking you to justify it. We do not deduct for emails already sent.",
  },
  {
    cat: "Money",
    q: "What happens when my year ends?",
    a: "Outreach stops and job openings are no longer shown, and we remind you before that happens. Nothing is deleted — your resume, history and saved answers stay exactly where they are and come back the moment you renew. Renewing early adds to the days you have left rather than replacing them.",
  },
  {
    cat: "Privacy",
    q: "Do you get access to my Gmail password?",
    a: "No, and this is worth being exact about. Sending uses a Gmail app password that you generate and that is stored only in your own computer's keychain. It is never transmitted to us and never stored on our servers. Revoking it in your Google account stops all sending immediately.",
  },
  {
    cat: "Privacy",
    q: "Are these real recruiters, or scraped emails?",
    a: "Business contact details for people who are hiring, sourced from public listings and commercial contact-data providers, and checked for deliverability before use. Every message carries an unsubscribe link, and one click removes that person permanently across every Outmail user.",
  },
  {
    cat: "Product",
    q: "Will this get my Gmail account banned?",
    a: "Your daily limit starts at five and grows slowly, only if you are actually sending. That warm-up is deliberate — it is what keeps your account inside normal sending behaviour rather than looking like bulk mail.",
  },
  {
    cat: "Product",
    q: "Can you guarantee I'll get a job?",
    a: "No, and anyone who does is lying. What Outmail changes is how many of the right people see you, and how much of your time goes into the applications worth making. The rest is your profile and the market.",
  },
];

/** The three worries people actually arrive with, in the order they ask. */
export const FAQ_CATEGORIES = ["Money", "Privacy", "Product"];
