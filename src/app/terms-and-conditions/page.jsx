export const metadata = {
  title: "Terms and Conditions",
  description:
    "The terms governing your use of Outmail, operated by PrimeWork Labs LLP — one placement year of recruiter outreach, matched jobs and optional mentorship.",
  alternates: { canonical: "https://outmail.in/terms-and-conditions" },
  openGraph: {
    title: "Terms and Conditions | Outmail",
    description: "The terms governing your use of Outmail.",
    url: "https://outmail.in/terms-and-conditions",
    type: "website",
  },
};

const H2 = ({ children }) => (
  <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">{children}</h2>
);
const Section = ({ children }) => <section className="space-y-6">{children}</section>;
const A = ({ href, children }) => (
  <a href={href} className="text-[#AD46FF] hover:underline">{children}</a>
);

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#AD46FF]/30">
      <main className="max-w-4xl mx-auto px-6 py-20 lg:py-32">
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-syne tracking-tight text-slate-900">
            Terms and Conditions
          </h1>
          <p className="text-[#AD46FF] font-semibold tracking-wide text-sm md:text-base uppercase">
            Effective Date: 31st August 2026
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-12 text-slate-700 leading-relaxed font-geist">
          <Section>
            <p className="text-lg text-slate-800">
              These terms are the agreement between you and{" "}
              <strong className="text-slate-900">PrimeWork Labs LLP</strong> (LLPIN ADB-2168), which
              operates Outmail at{" "}
              <A href="https://outmail.in">https://outmail.in</A> (“Outmail”, “we”, “our”, “us”).
              Registered office: 1/400, UIT, Bhiwadi, Alwar, Rajasthan 301019, India.
            </p>
            <p>
              By creating an account or paying for Outmail you accept these terms. If you do not
              accept them, do not use the service.
            </p>
            <p>
              They should be read with our <A href="/privacy-policy">Privacy Policy</A> and{" "}
              <A href="/refund-and-cancellation">Refund and Cancellation Policy</A>, which form part
              of this agreement.
            </p>
          </Section>

          <Section>
            <H2>1. Who may use Outmail</H2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong className="text-slate-900">You must be 18 or over.</strong> Outmail is not
                offered to children. If we find an account belongs to someone under 18 we will close
                it and refund any unused portion.
              </li>
              <li>You must be able to enter into a binding contract under Indian law.</li>
              <li>
                Outmail is currently offered only to users in India, and the recruiter data and job
                listings are India-focused.
              </li>
              <li>One account per person. Accounts may not be shared, sold or transferred.</li>
            </ul>
          </Section>

          <Section>
            <H2>2. What you are buying</H2>
            <div className="space-y-4">
              <p>
                <strong className="text-slate-900">
                  Outmail is a one-time payment for one year of access — a “placement year”. It is not
                  a subscription and it does not renew automatically.
                </strong>{" "}
                We will never charge you a second time unless you choose to buy another year.
              </p>
              <p>
                Prices are shown on our <A href="/pricing">Pricing</A> page in Indian Rupees and are
                inclusive of all applicable taxes. The price shown is the total you pay.
              </p>
              <p>
                Your year begins when your payment is confirmed. The end date is shown in the Billing
                section of your dashboard. If you buy again before your year ends, the remaining days
                are added to the new year rather than lost.
              </p>
              <p>
                Payments are processed by Razorpay. We never receive or store your card or UPI
                details.
              </p>
            </div>
          </Section>

          <Section>
            <H2>3. What we do and do not promise</H2>
            <div className="space-y-4">
              <p>
                Outmail helps you find relevant companies and contacts, drafts personalised emails,
                and sends them from your own email account. It also shows job openings matched to your
                resume, and — on the plan that includes it — mentorship sessions.
              </p>
              <p className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <strong className="text-slate-900">
                  We do not promise you a job, an interview, or a reply.
                </strong>{" "}
                No tool can. What we provide is reach, relevance and consistency. Any figures we
                publish about typical outcomes are illustrative, not a guarantee, and outcomes depend
                heavily on your own profile and the market.
              </p>
              <p>
                We do not promise that a specific company, recruiter or job will be available to you.
                The pool of contacts and openings changes constantly.
              </p>
            </div>
          </Section>

          <Section>
            <H2>4. You are the sender of your emails</H2>
            <div className="space-y-4">
              <p className="text-lg text-slate-800">
                This is the most important clause in this agreement, so it is stated plainly.
              </p>
              <p>
                <strong className="text-slate-900">
                  Emails sent through Outmail are sent from your own email account, in your name, on
                  your instruction. For every legal purpose, you are the sender — not us.
                </strong>
              </p>
              <p>You are responsible for:</p>
              <ul className="list-disc pl-6 space-y-3">
                <li>the accuracy of what you say about yourself, including your resume;</li>
                <li>reviewing drafts before they are sent, where you have approval enabled;</li>
                <li>complying with the terms of your own email provider, including sending limits;</li>
                <li>anything you add or edit in a message.</li>
              </ul>
              <p>
                <strong className="text-slate-900">On AI-drafted content.</strong> Emails are drafted
                by an automated system using your resume and profile. Automated drafting can produce
                text that is inaccurate or that overstates your experience. You are responsible for
                what is sent in your name. Do not enable automatic sending unless you are comfortable
                with that.
              </p>
            </div>
          </Section>

          <Section>
            <H2>5. Acceptable use</H2>
            <p>You must not use Outmail to:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                send unsolicited bulk email, marketing, promotional or commercial messages of any
                kind. Outmail is for individual job applications only;
              </li>
              <li>
                contact anyone who has unsubscribed, or attempt to circumvent an unsubscribe or our
                contact limits;
              </li>
              <li>misrepresent your identity, qualifications or experience;</li>
              <li>harass, threaten or repeatedly contact anyone who has asked you to stop;</li>
              <li>
                extract, scrape, copy, export, resell or redistribute our recruiter contact data, or
                use it for anything other than your own job applications. We promise recruiters that
                their details go no further, and that promise depends on you;
              </li>
              <li>
                share your account, resell access, or use the service on behalf of anyone other than
                yourself;
              </li>
              <li>
                attempt to gain unauthorised access to the service, disrupt it, or test its security
                without our written permission;
              </li>
              <li>use the service for any unlawful purpose.</li>
            </ul>
            <p>
              We enforce contact limits automatically. If you breach these rules we may suspend or
              close your account. Where the breach is serious — in particular sending unsolicited bulk
              email or misusing recruiter data — no refund is due for the remainder of your year.
            </p>
          </Section>

          <Section>
            <H2>6. The desktop application</H2>
            <div className="space-y-4">
              <p>
                Sending requires our desktop application, which runs on your own computer. We grant
                you a personal, non-exclusive, non-transferable, revocable licence to use it for the
                duration of your access. You may not copy, modify, decompile or redistribute it.
              </p>
              <p>
                The application needs a Gmail app password to send on your behalf. That credential is
                stored only in your computer’s operating-system keychain and is never transmitted to
                us — see section 3 of the <A href="/privacy-policy">Privacy Policy</A>. You may revoke
                it in your Google account at any time, which immediately stops all sending.
              </p>
              <p>
                You are responsible for keeping your own computer and email account secure.
              </p>
            </div>
          </Section>

          <Section>
            <H2>7. Mentorship</H2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                Mentorship is included only in the plan that names it, and the number of places is
                limited. Once places are taken, that plan cannot be bought until one is free.
              </li>
              <li>
                Sessions are scheduled periodically across your year. Mentors are independent
                professionals sharing their own experience.
              </li>
              <li>
                <strong className="text-slate-900">
                  Mentorship is guidance, not professional advice,
                </strong>{" "}
                and is not a promise of a referral, an introduction or a job. Decisions you take on
                the strength of it are your own.
              </li>
              <li>
                If we cannot deliver a scheduled session we will reschedule it. If we cannot deliver
                mentorship at all during your year, we will refund the difference between the plans.
              </li>
            </ul>
          </Section>

          <Section>
            <H2>8. Your content</H2>
            <div className="space-y-4">
              <p>
                You keep ownership of everything you upload — your resume, your profile details and
                your saved answers.
              </p>
              <p>
                You grant us a limited licence to store and process that content solely to operate the
                service for you: to match you to companies, to draft emails in your name, and to fill
                application forms on your instruction. We do not use it to train models for others, we
                do not sell it, and the licence ends when you delete the content or your account.
              </p>
              <p>
                You confirm that you have the right to upload what you upload, and that it is accurate.
              </p>
            </div>
          </Section>

          <Section>
            <H2>9. Our intellectual property</H2>
            <p>
              Outmail, its name, branding, software, matching system and recruiter database are owned
              by PrimeWork Labs LLP and protected by law. Nothing in these terms transfers any of it
              to you. You receive a right to use the service, not a right to its underlying assets.
            </p>
          </Section>

          <Section>
            <H2>10. Availability and changes</H2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                We aim to keep Outmail available but do not guarantee uninterrupted service.
                Maintenance, third-party outages and factors outside our control can interrupt it.
              </li>
              <li>
                Outreach sends on weekdays, within daily limits that start low and increase over time.
                That warm-up protects your email account’s reputation and is deliberate.
              </li>
              <li>
                We may change or improve features during your year. If we remove something material
                that you paid for and cannot provide an equivalent, you may ask for a proportionate
                refund of the unused period.
              </li>
            </ul>
          </Section>

          <Section>
            <H2>11. Refunds</H2>
            <p>
              Full terms are in our{" "}
              <A href="/refund-and-cancellation">Refund and Cancellation Policy</A>. In summary: you
              may request a full refund within 7 days of payment, without giving a reason, and we do
              not deduct for emails already sent. After that the payment for your year is not
              refundable except where these terms or the law say otherwise.
            </p>
          </Section>

          <Section>
            <H2>12. Suspension and closure</H2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                You may stop using Outmail at any time and ask us to delete your account. Because
                nothing renews, there is no recurring charge to cancel.
              </li>
              <li>
                We may suspend or close your account for a breach of section 5, for non-payment, or
                where required by law. Where practical we will tell you first and give you a chance to
                put it right.
              </li>
              <li>
                On closure, sending stops and job openings are no longer shown. Your data is handled
                as set out in the Privacy Policy.
              </li>
            </ul>
          </Section>

          <Section>
            <H2>13. Liability</H2>
            <div className="space-y-4">
              <p>
                Nothing in these terms limits liability that cannot be limited by law, including
                liability for fraud or for death or personal injury caused by negligence.
              </p>
              <p>
                Subject to that:{" "}
                <strong className="text-slate-900">
                  our total liability to you for any and all claims arising out of or relating to
                  Outmail is limited to the amount you actually paid us in the twelve months before
                  the claim arose.
                </strong>
              </p>
              <p>
                We are not liable for indirect or consequential loss, nor for loss of opportunity —
                including a job you did not get, an interview you were not offered, or a reply you did
                not receive. Those outcomes depend on employers, not on us.
              </p>
              <p>
                We are not liable for the acts of your email provider, including suspension or
                rate-limiting of your own account.
              </p>
            </div>
          </Section>

          <Section>
            <H2>14. Indemnity</H2>
            <p>
              You agree to indemnify us against claims, losses and reasonable costs arising from your
              breach of section 5, from content you sent that was unlawful or misleading, or from your
              misuse of recruiter contact data.
            </p>
          </Section>

          <Section>
            <H2>15. Changes to these terms</H2>
            <p>
              We may update these terms. The version in force is the one published here when you buy
              or renew. If a change materially affects your rights during a year you have already paid
              for, we will tell you by email at least 14 days before it takes effect, and you may ask
              for a proportionate refund of the unused period if you do not accept it.
            </p>
          </Section>

          <Section>
            <H2>16. Governing law and disputes</H2>
            <div className="space-y-4">
              <p>
                These terms are governed by the laws of India. The courts at Alwar, Rajasthan have
                exclusive jurisdiction, except that nothing prevents you from bringing a complaint
                before a consumer forum where you are entitled to do so under the Consumer Protection
                Act, 2019.
              </p>
              <p>
                Before starting proceedings, please contact us. Most issues are resolved by email
                within a few days.
              </p>
            </div>
          </Section>

          <Section>
            <H2>17. Contact and grievances</H2>
            <div className="space-y-2">
              <p>
                Support: <A href="mailto:support@outmail.in">support@outmail.in</A>
              </p>
              <p>
                Grievance Officer: <strong className="text-slate-900">Vishu Tomer</strong>, Designated
                Partner — <A href="mailto:admin@outmail.in">admin@outmail.in</A>, +91 63751 19988
              </p>
              <p>PrimeWork Labs LLP, 1/400, UIT, Bhiwadi, Alwar, Rajasthan 301019, India</p>
              <p>
                We acknowledge grievances within 48 hours and aim to resolve them within 30 days.
              </p>
            </div>
          </Section>
        </div>
      </main>
    </div>
  );
}
