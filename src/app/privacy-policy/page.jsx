export const metadata = {
  title: "Privacy Policy",
  description:
    "How Outmail, operated by PrimeWork Labs LLP, collects, uses and protects personal data under India's DPDP Act 2023 — including resumes, Gmail access and recruiter contact data.",
  alternates: { canonical: "https://outmail.in/privacy-policy" },
  openGraph: {
    title: "Privacy Policy | Outmail",
    description: "How Outmail collects, uses and protects personal data.",
    url: "https://outmail.in/privacy-policy",
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

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#AD46FF]/30">
      <main className="max-w-4xl mx-auto px-6 py-20 lg:py-32">
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-syne tracking-tight text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-[#AD46FF] font-semibold tracking-wide text-sm md:text-base uppercase">
            Effective Date: 31st August 2026
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-12 text-slate-700 leading-relaxed font-geist">
          <Section>
            <p className="text-lg text-slate-800">
              This policy explains what personal data Outmail collects, why, who we share it with, and
              the rights you have over it. It is written to meet India’s{" "}
              <strong className="text-slate-900">Digital Personal Data Protection Act, 2023</strong>{" "}
              (“DPDP Act”).
            </p>
            <p>
              It covers two different groups of people, and their rights are not the same:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong className="text-slate-900">Students</strong> who create an Outmail account and
                use the service.
              </li>
              <li>
                <strong className="text-slate-900">Recruiters and hiring contacts</strong> whose
                business contact details are held in Outmail so that students can write to them. If
                you received an email sent through Outmail and want to know why, or want us to stop,
                go straight to section 6.
              </li>
            </ul>
          </Section>

          <Section>
            <H2>1. Who we are</H2>
            <div className="space-y-2">
              <p>
                Outmail is operated by <strong className="text-slate-900">PrimeWork Labs LLP</strong>,
                a limited liability partnership registered in India. For the purposes of the DPDP Act,
                PrimeWork Labs LLP is the <strong className="text-slate-900">Data Fiduciary</strong>.
              </p>
              <p className="pt-2">LLPIN: ADB-2168</p>
              <p>Registered address: 1/400, UIT, Bhiwadi, Alwar, Rajasthan 301019, India</p>
              <p>
                General contact: <A href="mailto:support@outmail.in">support@outmail.in</A>
              </p>
              <p>Phone: +91 63751 19988</p>
            </div>
          </Section>

          <Section>
            <H2>2. How Outmail works, in plain terms</H2>
            <p>
              You cannot judge a privacy policy without knowing what the product does, so here is the
              mechanism:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                You upload your resume. We read it to understand your skills and experience, and to
                write emails in your name.
              </li>
              <li>
                We hold a pool of recruiter and hiring-team business email addresses, which we source
                and verify ourselves.
              </li>
              <li>
                Each week we choose companies and contacts that fit your profile, and draft
                personalised emails.
              </li>
              <li>
                <strong className="text-slate-900">
                  The emails are sent from your own Gmail account, by you, using our desktop
                  application.
                </strong>{" "}
                They are not sent from Outmail’s servers and do not come from an Outmail address. You
                are the sender.
              </li>
              <li>
                We record which emails were sent so you can see your own history and so we do not
                contact the same person twice.
              </li>
            </ul>
          </Section>

          <Section>
            <H2>3. Your Gmail credentials never reach our servers</H2>
            <div className="space-y-4">
              <p>
                This is the most sensitive part of the product and we want to be exact about it.
              </p>
              <p>
                To send email as you, our desktop application needs a Gmail{" "}
                <strong className="text-slate-900">app password</strong> — a credential you generate
                in your own Google account and can revoke at any time.
              </p>
              <p>
                <strong className="text-slate-900">
                  That password is stored only in your computer’s own operating-system keychain. It is
                  never transmitted to Outmail, never stored on our servers, and never visible to our
                  staff.
                </strong>{" "}
                Our servers receive only the outcome of a send — whether it succeeded, and when.
              </p>
              <p>
                Revoking the app password in your Google account immediately and permanently stops
                Outmail from being able to send anything.
              </p>
            </div>
          </Section>

          <Section>
            <H2>4. What we collect about students, and why</H2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left border-b border-slate-200">
                    <th className="py-3 pr-4 font-semibold text-slate-900">Data</th>
                    <th className="py-3 pr-4 font-semibold text-slate-900">Why</th>
                    <th className="py-3 font-semibold text-slate-900">Lawful basis</th>
                  </tr>
                </thead>
                <tbody className="align-top">
                  {[
                    ["Name, email address and profile photo from Google Sign-In", "To create and secure your account", "Performance of our contract with you"],
                    ["Your resume, and the skills, education and experience we extract from it", "To match you to companies and to write emails in your name", "Your consent, given when you upload it"],
                    ["Profile details you add — phone, LinkedIn, GitHub, portfolio, location, job preferences", "To improve matching and to include in your outreach where relevant", "Your consent"],
                    ["A record of every email sent on your behalf — recipient, subject, body, time, outcome", "So you can see your history, and so the same recruiter is not contacted twice", "Performance of our contract with you"],
                    ["Saved answers you store for the Autofill extension", "To fill application forms on your instruction", "Your consent"],
                    ["Payment records — plan, amount, date, Razorpay reference", "To give you access, issue receipts and meet accounting obligations", "Contract and legal obligation"],
                    ["Technical data — IP address, browser and device type, session tokens", "To keep your account secure and to detect abuse", "Our legitimate interest in securing the service"],
                  ].map(([d, w, b], i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-3 pr-4">{d}</td>
                      <td className="py-3 pr-4">{w}</td>
                      <td className="py-3">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-slate-600">
              We do not collect financial account details. Card and UPI details are entered directly
              with Razorpay and never reach us.
            </p>
          </Section>

          <Section>
            <H2>5. Automated processing and AI</H2>
            <div className="space-y-4">
              <p>
                Outmail uses Google’s Gemini models to read your resume, to score how well a job
                matches your profile, and to draft the text of outreach emails. Your resume content
                and profile are sent to that service for those purposes.
              </p>
              <p>
                <strong className="text-slate-900">
                  Nothing is sent without your approval unless you switch approval off yourself.
                </strong>{" "}
                By default you review and approve your weekly plan before anything is sent. You can
                enable automatic sending, and you can turn it off again at any time.
              </p>
              <p>
                No decision with a legal or similarly significant effect on you is made solely by
                automated means. Matching and drafting are suggestions; you decide whether to send.
              </p>
            </div>
          </Section>

          <Section>
            <H2>6. Recruiter and hiring-contact data</H2>
            <div className="space-y-4">
              <p className="text-lg text-slate-800">
                <strong className="text-slate-900">
                  If you are a recruiter and received an email through Outmail, this section is for
                  you.
                </strong>
              </p>
              <p>
                <strong className="text-slate-900">What we hold.</strong> Business contact details
                only: work email address, name where known, job title, employer, and whether previous
                messages were delivered or bounced. We do not hold personal addresses, personal phone
                numbers or any special category data about recruiters.
              </p>
              <p>
                <strong className="text-slate-900">Where it comes from.</strong> Publicly available
                professional sources and company websites, and information supplied by our team. We
                verify addresses through a third-party verification service before use.
              </p>
              <p>
                <strong className="text-slate-900">Why we hold it.</strong> To let a job-seeking
                student send you a relevant, individually written application. Our lawful basis is
                legitimate interest in connecting candidates with employers, balanced by the limits
                below.
              </p>
              <p>
                <strong className="text-slate-900">Who actually emailed you.</strong> The email came
                from the student’s own Gmail account. Outmail helped them find you and draft it. The
                student is the sender; replying goes to them, not to us.
              </p>
              <p>
                <strong className="text-slate-900">The limits we place on ourselves.</strong> A given
                recruiter is contacted by only a small number of students in any week, and never twice
                by the same student. Every message carries an unsubscribe link.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-3">
                <p className="font-semibold text-slate-900">To stop receiving these emails</p>
                <p>
                  Use the unsubscribe link in any message you received. It works immediately and needs
                  no account or reply. You can also email{" "}
                  <A href="mailto:support@outmail.in">support@outmail.in</A> and we will remove you and
                  confirm.
                </p>
                <p>
                  Once removed, your address is added to a permanent suppression list so that{" "}
                  <strong className="text-slate-900">no student</strong> using Outmail can contact you
                  again. We keep only the minimum needed to enforce that.
                </p>
              </div>
              <p>
                You have the same rights as anyone else under section 9 — access, correction, erasure
                and grievance redressal — and you may exercise them without having an account.
              </p>
            </div>
          </Section>

          <Section>
            <H2>7. Who we share data with</H2>
            <p>
              We do not sell personal data, and we do not share it for advertising. We use the
              following processors, each only for the purpose shown:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left border-b border-slate-200">
                    <th className="py-3 pr-4 font-semibold text-slate-900">Service</th>
                    <th className="py-3 pr-4 font-semibold text-slate-900">Purpose</th>
                    <th className="py-3 font-semibold text-slate-900">Data involved</th>
                  </tr>
                </thead>
                <tbody className="align-top">
                  {[
                    ["Google (Sign-In, Gemini)", "Authentication; resume parsing, matching and email drafting", "Account identity; resume and profile content"],
                    ["Razorpay", "Payment processing", "Name, email, payment amount and reference"],
                    ["Amazon Web Services (S3)", "Resume file storage", "Your uploaded resume"],
                    ["Neon", "Database hosting", "All account and application data"],
                    ["Render, Vercel", "Application and website hosting", "Data in transit and in use"],
                    ["Resend", "Transactional email from Outmail to you", "Your name and email address"],
                    ["MillionVerifier", "Checking that a recruiter address is deliverable", "Recruiter business email addresses only"],
                    ["Adzuna and other job sources", "Sourcing job openings", "No personal data is sent"],
                    ["Upstash (QStash)", "Scheduling background work", "Internal job identifiers"],
                    ["Sentry", "Error monitoring", "Technical diagnostics; configured to redact personal data"],
                  ].map(([s, p, d], i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-3 pr-4 font-medium text-slate-900">{s}</td>
                      <td className="py-3 pr-4">{p}</td>
                      <td className="py-3">{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              We may also disclose data where we are legally required to, or to establish or defend a
              legal claim.
            </p>
          </Section>

          <Section>
            <H2>8. Where data is stored, and for how long</H2>
            <div className="space-y-4">
              <p>
                Our primary database is hosted in Singapore, and some processors listed above operate
                outside India. Transfers are made only to countries not restricted by the Central
                Government under section 16 of the DPDP Act, and are covered by contractual protections
                with each processor.
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong className="text-slate-900">Your resume and profile</strong> — kept while your
                  account is open. Deleted within 30 days of you deleting your account or asking us to
                  remove them.
                </li>
                <li>
                  <strong className="text-slate-900">Your outreach history</strong> — kept while your
                  account is open, so you can see what you sent and we can avoid repeat contacts.
                </li>
                <li>
                  <strong className="text-slate-900">Payment records</strong> — kept for eight years,
                  as required by Indian accounting and tax law. This is the one category we cannot
                  delete on request.
                </li>
                <li>
                  <strong className="text-slate-900">Unsubscribe records</strong> — kept indefinitely,
                  in minimal form. If we deleted these we would be unable to keep honouring the
                  unsubscribe.
                </li>
                <li>
                  <strong className="text-slate-900">Technical logs</strong> — up to 30 days.
                </li>
              </ul>
            </div>
          </Section>

          <Section>
            <H2>9. Your rights</H2>
            <p>Under the DPDP Act you have the right to:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>Ask what personal data we hold about you and get a copy of it.</li>
              <li>Have inaccurate or incomplete data corrected or completed.</li>
              <li>
                Have your data erased, except where we must keep it by law — see the retention table
                above.
              </li>
              <li>
                Withdraw consent at any time, as easily as you gave it. Withdrawing consent for us to
                use your resume means we can no longer generate outreach for you.
              </li>
              <li>Nominate someone to exercise your rights if you die or become incapacitated.</li>
              <li>Raise a grievance with us, and escalate it — see section 10.</li>
            </ul>
            <p>
              To exercise any of these, email{" "}
              <A href="mailto:support@outmail.in">support@outmail.in</A> from the address on your
              account. We will respond within 30 days. There is no charge.
            </p>
          </Section>

          <Section>
            <H2>10. Grievance Officer</H2>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-2">
              <p>
                If you are unhappy with how we have handled your data or your request, contact our
                Grievance Officer:
              </p>
              <p className="pt-2">
                <strong className="text-slate-900">Vishu Tomer</strong>
              </p>
              <p>Designated Partner, PrimeWork Labs LLP</p>
              <p>
                Email: <A href="mailto:admin@outmail.in">admin@outmail.in</A>
              </p>
              <p>Phone: +91 63751 19988</p>
              <p>1/400, UIT, Bhiwadi, Alwar, Rajasthan 301019, India</p>
            </div>
            <p>
              We acknowledge grievances within 48 hours and aim to resolve them within 30 days. If you
              remain dissatisfied, you may complain to the{" "}
              <strong className="text-slate-900">Data Protection Board of India</strong>.
            </p>
          </Section>

          <Section>
            <H2>11. Security</H2>
            <ul className="list-disc pl-6 space-y-3">
              <li>All traffic to and from Outmail is encrypted with TLS.</li>
              <li>Data is encrypted at rest by our database and file-storage providers.</li>
              <li>
                Access to production data is limited to those who need it, and secrets are held in
                managed secret storage rather than in code.
              </li>
              <li>
                Your Gmail app password is not part of any of this, because we never hold it — see
                section 3.
              </li>
            </ul>
            <p>
              No system is perfectly secure. If a breach occurs that is likely to affect you, we will
              notify you and the Data Protection Board of India as the DPDP Act requires.
            </p>
          </Section>

          <Section>
            <H2>12. Age requirement</H2>
            <p>
              <strong className="text-slate-900">Outmail is only for people aged 18 or over.</strong>{" "}
              We do not knowingly collect data about children. If we learn that an account belongs to
              someone under 18 we will close it and delete the associated data.
            </p>
          </Section>

          <Section>
            <H2>13. Cookies</H2>
            <p>
              We use cookies and similar storage only to keep you signed in and to keep your session
              secure. We do not use advertising or cross-site tracking cookies, and we do not run
              third-party advertising trackers. Blocking these cookies will prevent you from staying
              signed in.
            </p>
          </Section>

          <Section>
            <H2>14. Changes to this policy</H2>
            <p>
              We may update this policy. The version in force is the one published here on the date
              you use the service. If a change materially affects your rights we will tell you by
              email before it takes effect.
            </p>
          </Section>

          <Section>
            <H2>15. Contact</H2>
            <div className="space-y-2">
              <p>
                Privacy questions and rights requests:{" "}
                <A href="mailto:support@outmail.in">support@outmail.in</A>
              </p>
              <p>
                Grievances: <A href="mailto:admin@outmail.in">admin@outmail.in</A> (Vishu Tomer,
                Grievance Officer)
              </p>
              <p>
                See also our <A href="/terms-and-conditions">Terms and Conditions</A> and{" "}
                <A href="/refund-and-cancellation">Refund and Cancellation Policy</A>.
              </p>
            </div>
          </Section>
        </div>
      </main>
    </div>
  );
}
