export default function manifest() {
  return {
    name: "Outmail — Cold Outreach, Jobs & Mentorship",
    short_name: "Outmail",
    description:
      "AI-personalized cold outreach from your own inbox, resume-matched job intelligence, one-click Autofill, and mentorship.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0b14",
    theme_color: "#0a0b14",
    icons: [
      {
        src: "/favicon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
