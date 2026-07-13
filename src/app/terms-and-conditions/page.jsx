export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#AD46FF]/30">
      <main className="max-w-4xl mx-auto px-6 py-20 lg:py-32">
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-syne tracking-tight text-slate-900">
            Terms and Conditions
          </h1>
          <p className="text-[#AD46FF] font-semibold tracking-wide text-sm md:text-base uppercase">
            Effective Date: 5th April 2026
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-12 text-slate-700 leading-relaxed font-geist">
          <section className="space-y-4">
            <p className="text-lg text-slate-800">
              Welcome to Outmail (“Outmail,” “we,” “our,” or “us”). These Terms and Conditions (“Terms”) govern your access to and use of our website <a href="https://outmail.in" className="text-[#AD46FF] hover:underline font-medium">https://outmail.in</a> and services, including email outreach automation, campaign management, and related features (collectively, the “Services”).
            </p>
            <p>
              By accessing or using our Services, you agree to be bound by these Terms. If you do not agree, you must not use our Services.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">1. Eligibility</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>You must be at least 18 years old to use Outmail.</li>
              <li>By using our Services, you represent that you are legally able to enter into binding contracts.</li>
              <li>Outmail is currently intended for Indian customers only.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">2. Account Registration and Security</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>You must create an account to use our Services.</li>
              <li>You agree to provide accurate and complete information when creating your account.</li>
              <li>You are responsible for maintaining the confidentiality of your login credentials (JWT tokens, passwords) and are liable for all activities under your account.</li>
              <li>You must notify us immediately of any unauthorized use of your account.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">3. Use of Services</h2>
            <div className="space-y-4">
              <p>Outmail provides tools to help users send personalized email outreach campaigns via Gmail API.</p>
              <p>You agree to comply with Google API Services User Data Policy, including the Limited Use requirements.</p>
              <p className="font-semibold text-slate-900">You must not:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use our Services to send spam, abusive, or unlawful content.</li>
                <li>Misuse Gmail integration or violate Gmail sending limits.</li>
                <li>Upload malicious code, viruses, or harmful attachments.</li>
              </ul>
              <p>We may suspend or terminate accounts that engage in abuse or violate these Terms.</p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">4. User Content and Data</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>You retain ownership of your uploaded data (resumes, templates, contact lists).</li>
              <li>By using our Services, you grant Outmail a limited license to process and send emails on your behalf as part of campaigns.</li>
              <li>We do not sell or share your uploaded data with third parties.</li>
              <li>CSV contact files are processed only for campaign execution and are deleted once the campaign ends.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">5. Paid Services and Billing</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>Some features of Outmail are provided on a subscription basis.</li>
              <li>Payments are processed securely via Stripe. Outmail does not store credit card details.</li>
              <li>You agree to pay all applicable subscription fees as described at the time of purchase.</li>
              <li>Subscriptions automatically renew unless canceled before the renewal date.</li>
              <li>No refunds are provided for partial subscription periods, except where required by law.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">6. Data Security and Privacy</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>Your use of our Services is subject to our <a href="/privacy-policy" className="text-[#AD46FF] hover:underline">Privacy Policy</a>.</li>
              <li>We use encryption at rest and in transit (TLS/HTTPS) to protect data.</li>
              <li>Gmail access tokens are stored securely in AWS Secrets Manager.</li>
              <li>By using Outmail, you consent to our data practices as outlined in the Privacy Policy.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">7. Intellectual Property</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>Outmail and its content, including branding, design, and software, are protected by copyright, trademark, and other laws.</li>
              <li>You may not copy, modify, distribute, or create derivative works without prior written consent from Outmail.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">8. Service Availability and Modifications</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>We strive to maintain reliable Services but do not guarantee uninterrupted availability.</li>
              <li>We reserve the right to modify, suspend, or discontinue any part of the Services at any time without liability.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">9. Limitation of Liability</h2>
            <div className="space-y-4">
              <p>Outmail is provided on an “AS IS” and “AS AVAILABLE” basis.</p>
              <p>To the maximum extent permitted by law, we disclaim liability for any indirect, incidental, or consequential damages.</p>
              <p className="font-semibold text-slate-900">We are not responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Delivery failures due to Gmail or third-party providers.</li>
                <li>Loss of data due to user error, improper configurations, or unsupported third-party integrations.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">10. Termination</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>We may suspend or terminate your account at any time if you violate these Terms or use the Services unlawfully.</li>
              <li>You may terminate your account at any time by contacting <a href="mailto:contact@outmail.in" className="text-[#AD46FF] hover:underline">contact@outmail.in</a>.</li>
              <li>Upon termination, your right to use the Services will immediately cease.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">11. Compliance with Laws</h2>
            <p>You agree to use Outmail in compliance with all applicable laws and regulations in India. You are solely responsible for the legality of your outreach campaigns.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">12. Indemnification</h2>
            <p>You agree to indemnify and hold harmless Outmail, its affiliates, employees, and partners from any claims, damages, or expenses arising from your misuse of the Services, violation of these Terms, or violation of third-party rights.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">13. Changes to Terms</h2>
            <p>We may update these Terms from time to time. Significant changes will be notified via email or a notice on our website. Continued use after changes take effect constitutes acceptance.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">14. Governing Law</h2>
            <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in [Insert City, India].</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">15. Contact Information</h2>
            <p>For questions regarding these Terms, please contact us at:</p>
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
