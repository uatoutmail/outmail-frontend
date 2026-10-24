/**
 * The setup steps and troubleshooting entries for /getting-started.
 *
 * WHY THIS IS NOT IN THE COMPONENT FILE
 *   GettingStartedSections.jsx is a "use client" module. Importing a constant
 *   from a client module into a server component does not give you the value —
 *   it gives you a client reference, and the first `.map()` over it throws
 *   `a.map is not a function` at build time. That has already cost a debugging
 *   session here once, with FAQS. Data that both the page's JSON-LD (server)
 *   and its sections (client) need has to live in a plain module like this one.
 *
 * THE COPY IS NOT FREE TEXT
 *   It is the approved wording of customer document #3, and outmail-backend's
 *   welcome and setup-stalled emails describe the same steps and quote the same
 *   ramp figures. If the app-password explanation changes here, it changes in
 *   outmail-backend/src/documents/email/templates.js too.
 */

export const STEPS = [
  {
    n: "01",
    id: "resume",
    icon: "resume",
    t: "Upload your resume",
    pill: "2 minutes",
    d: "Everything else is built from it: which openings match you, and what your emails say. A PDF is best. You can replace it later without losing anything.",
    points: ["Used to score every opening", "Used to write every email", "Replaceable any time"],
  },
  {
    n: "02",
    // The welcome and setup-stalled emails link straight to this anchor. It is
    // part of a published URL — renaming it breaks mail already delivered.
    id: "connect-gmail",
    icon: "key",
    t: "Connect your Gmail",
    pill: "5 minutes · the fiddly one",
    d: "Google does not let an outside program sign in with your normal password. Instead it issues an app password, a 16-character code that works for one application and nothing else. It cannot be used to read your email, change your password, or sign in to your Google account.",
    points: [
      "Turn on 2-Step Verification at myaccount.google.com/security",
      "Create an app password named “Outmail” at myaccount.google.com/apppasswords",
      "Paste the 16 characters into the Outmail desktop app, once you've signed in there (see the next step)",
    ],
    note: "keychain",
  },
  {
    n: "03",
    id: "desktop",
    icon: "desktop",
    t: "Install the desktop app",
    pill: "2 minutes",
    d: "This is what actually sends your email, and it is the reason your password never leaves your machine. It runs quietly in the background and sends on the schedule you approve.",
    points: [
      "macOS: it isn't actually damaged, the app just isn't code-signed yet, so macOS blocks it harder than usual and won't offer an “Open Anyway” button in Settings. Open Terminal and run: xattr -cr ~/Downloads/Outmail.app (drag the app into the Terminal window after typing “xattr -cr ” to fill in the path automatically), then open the app normally",
      "Windows: choose “More info”, then “Run anyway”",
      "macOS may ask for your Mac login password at some point (often right after you paste your Gmail app password) to let Outmail use your Mac's Keychain. That's the mechanism that stores the app password securely on your device and is exactly why it's never sent to Outmail's servers. This is expected; enter your normal Mac password to allow it",
      "Open it and click “Sign in with Google”, the same account you use for Outmail. That's what links this device to your account; your dashboard's “Link Desktop Agent” code is only a fallback if sign-in doesn't work",
      "Scheduled mail goes out only while your computer is awake",
    ],
  },
  {
    n: "04",
    id: "extension",
    icon: "extension",
    t: "Add the browser extension",
    pill: "Optional · 1 minute",
    d: "Optional, but it saves the most time. It fills application forms from answers you write once, and you review everything before it submits. Nothing is sent without you clicking.",
    points: ["Answers written once, reused everywhere", "You review before anything submits"],
  },
  {
    n: "05",
    id: "preferences",
    icon: "preferences",
    t: "Set what you are looking for",
    pill: "1 minute",
    d: "Roles, locations, and whether you want internships, full-time, or both. This narrows the openings you see and sharpens the match score against your resume.",
    points: ["Roles and locations", "Internship, full-time, or both"],
  },
];

/** What happens once setup is done. Expectations, set once. */
export const AFTER_SETUP = [
  ["Matched openings", "Appear in your dashboard, each with a score and the reason for it."],
  [
    "Outreach volume",
    "Starts at five emails a day and grows toward forty as your account settles.",
  ],
  ["Replies", "Go to your own inbox. We never see them."],
  [
    "Unsubscribes",
    "Every email carries one. If a recruiter uses it, they are removed for everyone, permanently.",
  ],
];

/**
 * The four things support is actually asked.
 *
 * Rendered as visible text rather than an accordion, because someone searching
 * the page for the error message they are staring at needs Cmd-F to find it —
 * and because Google only credits FAQ markup whose answers are visible.
 */
export const TROUBLESHOOTING = [
  {
    q: "macOS says “Outmail is damaged and can't be opened”",
    a: "It isn't actually damaged, the app isn't code-signed yet, so macOS blocks it harder than usual and skips the normal “Open Anyway” button in Settings. Click Cancel (never “Move to Bin”), open Terminal, and run: xattr -cr ~/Downloads/Outmail.app. Drag the app into the Terminal window right after typing “xattr -cr ” to fill in the exact path, then open the app as usual.",
  },
  {
    q: "Windows: “More info” doesn't appear on the blue warning screen",
    a: 'Rare, but if it happens: open PowerShell, run Unblock-File -Path "$env:USERPROFILE\\Downloads\\Outmail-win-setup.exe", then run the installer again. The normal Windows path (“More info” → “Run anyway”) works for almost everyone, try that first.',
  },
  {
    q: "macOS is asking for my Mac login password while I'm setting up Outmail",
    a: "That's expected. It's macOS asking permission for Outmail to use your Mac's Keychain, which is exactly what stores your Gmail app password securely on your own device (and why it never reaches Outmail's servers). It usually appears right after you paste the app password. Enter your normal Mac login password to allow it.",
  },
  {
    q: "“App passwords” is not in my Google account",
    a: "2-Step Verification is not on yet, or your college has disabled app passwords on a managed account. If it is a college account, use a personal Gmail instead.",
  },
  {
    q: "The desktop app says it cannot connect",
    a: "The app password was probably pasted with spaces. Google shows it in four blocks; type it without them.",
  },
  {
    q: "My dashboard shows the agent as disconnected, even though it worked before",
    a: "Click “Reconnect Gmail” on your dashboard's Mailing Agent card. It reopens the desktop app and reconnects using the password already saved on your computer, you won't need to type it again unless you disconnected it yourself or signed in with a different Google account.",
  },
  {
    q: "Nothing has sent",
    a: "Check the desktop app is running. Scheduled email only goes out while your computer is awake.",
  },
  {
    q: "Still stuck",
    a: "Email support@outmail.in or call +91 90570 26464. A person replies, usually the same day.",
  },
];
