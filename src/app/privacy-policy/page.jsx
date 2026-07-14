export const metadata = {
  title: "Privacy Policy",
  description:
    "How Outmail collects, uses, and protects your data across cold outreach, job intelligence, and mentorship — including Gmail and resume handling.",
  alternates: { canonical: "https://outmail.in/privacy-policy" },
  openGraph: {
    title: "Privacy Policy | Outmail",
    description:
      "How Outmail collects, uses, and protects your data.",
    url: "https://outmail.in/privacy-policy",
    type: "website",
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#AD46FF]/30">
      <main className="max-w-4xl mx-auto px-6 py-20 lg:py-32">
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-syne tracking-tight text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-[#AD46FF] font-semibold tracking-wide text-sm md:text-base uppercase">
            Effective Date: 5th April 2026
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-12 text-slate-700 leading-relaxed font-geist">
          <section className="space-y-4">
            <p className="text-lg text-slate-800">
              Outmail (“Outmail”, “we”, “our”, or “us”) operates the website <a href="https://outmail.in" className="text-[#AD46FF] hover:underline font-medium">https://outmail.in</a> and provides email outreach and campaign automation services (“Services”).
            </p>
            <p>
              We respect your privacy and are committed to protecting your personal data in compliance with India’s Digital Personal Data Protection Act (DPDP, 2023), industry best practices, and applicable global standards. This Privacy Policy explains how we collect, use, store, and protect your data when you use Outmail.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">1. Company Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Service Name: Outmail (Outmail.in)</li>
              <li>Contact Email: contact@outmail.in</li>
              <li>Jurisdiction: India</li>
              <li>Target Audience: Individuals aged 18 and above, primarily Indian customers</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">2. Information We Collect</h2>
            <p>We collect and process the following categories of information:</p>
            
            <div className="space-y-6 ml-4">
              <div>
                <h3 className="font-bold text-slate-900 mb-2">a. Account Information</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Name, email address, Gmail address</li>
                  <li>Login/authentication tokens (JWT)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-slate-900 mb-2">b. Uploaded Data</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Up to 3 resumes/attachments (stored in AWS S3)</li>
                  <li>Up to 3 email templates (stored securely in our systems)</li>
                  <li>CSV contact files (processed only for campaigns and deleted after campaigns conclude)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">c. Gmail API Tokens</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Access and refresh tokens provided by Google via OAuth</li>
                  <li>Stored in AWS Secrets Manager, encrypted at rest and in transit</li>
                  <li>Used only to send emails on your behalf during campaigns</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">d. Billing Information</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Subscription plan, status, and invoice history</li>
                  <li>Payment processing is handled entirely by Stripe (PCI-DSS compliant)</li>
                  <li>Outmail does not store credit card or sensitive payment data</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">e. Automatically Collected Information</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Device and browser type, IP address</li>
                  <li>Cookies/session tokens for authentication</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">3. How We Use Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and improve our Services</li>
              <li>Authenticate and authorize access to your account</li>
              <li>Automate email outreach campaigns via Gmail API</li>
              <li>Store and manage your resumes, templates, and campaign history</li>
              <li>Track campaign performance (opens, replies)</li>
              <li>Manage billing, subscriptions, and invoices</li>
              <li>Respond to support requests and protect against abuse</li>
            </ul>
            <p className="font-medium text-slate-900 italic">We do not sell or rent user data to advertisers or third parties.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">4. Data Retention</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Resumes & Templates:</strong> Stored until deleted by you, or auto-deleted if unused for &gt;60 days.</li>
              <li><strong>CSV Contacts:</strong> Deleted automatically after campaigns conclude.</li>
              <li><strong>Billing Data:</strong> Retained as required by law for financial records.</li>
              <li><strong>Account Data:</strong> Deleted upon request.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">5. Legal Basis for Processing</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Consent:</strong> When you connect Gmail via OAuth.</li>
              <li><strong>Contractual Necessity:</strong> To deliver the Services you subscribed to.</li>
              <li><strong>Legitimate Interest:</strong> To prevent fraud and ensure security.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">6. Sharing of Information</h2>
            <p>We share information only as necessary with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Stripe:</strong> For payment processing.</li>
              <li><strong>Google APIs:</strong> For Gmail integration.</li>
              <li><strong>AWS:</strong> For storage, secrets management, and hosting.</li>
              <li><strong>Legal:</strong> If required by valid legal process.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">7. Data Security</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Encryption:</strong> All communication uses HTTPS/TLS. Data encrypted at rest in AWS S3 and Postgres.</li>
              <li><strong>Access Control:</strong> Restricted data access and role-based staff permissions.</li>
              <li><strong>Monitoring:</strong> Continuous system monitoring for unauthorized access.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">8. User Rights</h2>
            <p>Under the DPDP, you have the:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Right to Access:</strong> Request a copy of your personal data.</li>
              <li><strong>Right to Deletion:</strong> Request complete deletion of your account and data.</li>
              <li><strong>Right to Stop Campaigns:</strong> Pause or stop campaigns at any time via dashboard.</li>
            </ul>
            <p>Contact <a href="mailto:contact@outmail.in" className="text-[#AD46FF] hover:underline font-medium">contact@outmail.in</a> to exercise these rights.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">9. Cookies & Tracking</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>JWT/Cookies:</strong> Used solely for maintaining login sessions.</li>
              <li><strong>No Third-Party Tracking:</strong> We do not use Google Analytics, Hotjar, or similar tracking services on the app.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">10. Children’s Privacy</h2>
            <p>Outmail is not intended for children under 18. We do not knowingly collect data from minors. Inadvertent data collection will be deleted immediately upon discovery.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">11. International Data Transfers</h2>
            <p>Currently, user data is stored and processed in India-supported AWS regions and Neon.tech Postgres.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">12. Payment Security</h2>
            <p>All payments are processed via Stripe (PCI-DSS compliant). Outmail does not handle or store cardholder data.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">13. Changes to This Policy</h2>
            <p>We may update this policy. Significant changes will be notified via email or website notice. Effectivity is tracked by the date at the top of this page.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">14. Contact Us</h2>
            <ul className="list-none space-y-2">
              <li>Email: <a href="mailto:contact@outmail.in" className="text-[#AD46FF] hover:underline">contact@outmail.in</a></li>
              <li>Website: <a href="https://outmail.in" className="text-[#AD46FF] hover:underline">https://outmail.in</a></li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
