import ExtensionWelcome from "@/component/pages/ExtensionWelcome";

// The page the extension opens by itself the moment it is installed, and the
// page the popup's "Connect to Outmail" button opens. Its whole job is to get
// the extension linked to the signed-in account without the user typing
// anything — the code-entry route still exists, folded away, for the cases
// where a browser blocks our content script.
export const metadata = {
  title: "Connect the Outmail Autofill extension",
  description:
    "Link the Outmail Autofill extension to your account so job applications fill from your profile.",
  robots: { index: false, follow: false },
};

export default function ExtensionWelcomePage() {
  return <ExtensionWelcome />;
}
