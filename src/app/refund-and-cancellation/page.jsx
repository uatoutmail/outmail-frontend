export const metadata = {
  title: "Refund and Cancellation Policy",
  description:
    "How refunds work at Outmail, what one year of access includes, and what happens when it ends.",
  alternates: { canonical: "https://outmail.in/refund-and-cancellation" },
  openGraph: {
    title: "Refund and Cancellation Policy | Outmail",
    description: "How refunds work at Outmail, and what one year of access includes.",
    url: "https://outmail.in/refund-and-cancellation",
    type: "website",
  },
};

export default function RefundAndCancellation() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-accent-light/30">
      <main className="max-w-4xl mx-auto px-6 py-20 lg:py-32">
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-syne tracking-tight text-slate-900">
            Refund and Cancellation Policy
          </h1>
          <p className="text-accent-light font-semibold tracking-wide text-sm md:text-base uppercase">
            Effective Date: 31st August 2026
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-12 text-slate-700 leading-relaxed font-geist">
          <section className="space-y-4">
            <p className="text-lg text-slate-800">
              This policy explains what you get when you buy Outmail (“Outmail,” “we,” “our,” or
              “us”), when refunds are available, how long they take, and what happens when your year
              ends. It applies to all plans purchased through{" "}
              <a
                href="https://outmail.in"
                className="text-accent-light hover:underline font-medium"
              >
                https://outmail.in
              </a>
              . It should be read alongside our{" "}
              <a href="/terms-and-conditions" className="text-accent-light hover:underline">
                Terms and Conditions
              </a>
              .
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">
              1. What you are buying
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong className="text-slate-900">
                  Outmail is a one-time payment for one year of access.
                </strong>{" "}
                It is not a subscription.
              </li>
              <li>
                <strong className="text-slate-900">Nothing renews automatically.</strong> We will
                never charge your card a second time without you choosing to buy another year. There
                is no recurring payment to cancel.
              </li>
              <li>
                Your year starts on the day your payment is confirmed. The exact end date is shown
                in the Billing section of your dashboard.
              </li>
              <li>
                The price and inclusions of each plan are shown on our{" "}
                <a href="/pricing" className="text-accent-light hover:underline">
                  Pricing
                </a>{" "}
                page before you pay.
              </li>
              <li>
                All prices are in Indian Rupees (INR) and are{" "}
                <strong className="text-slate-900">inclusive of all applicable taxes</strong>. The
                price shown is the total you pay — nothing is added at checkout.
              </li>
              <li>
                Payments are processed by Razorpay. We do not receive or store your card details.
              </li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">
              2. Cancellation
            </h2>
            <div className="space-y-4">
              <p>
                <strong className="text-slate-900">There is nothing to cancel.</strong> Because you
                pay once for a fixed year and nothing renews, there is no ongoing payment to stop.
                Your access simply ends at the end of your year unless you choose to buy another.
              </p>
              <p>
                If you no longer want to use Outmail, you can stop at any time. Within the first 7
                days you may also request a full refund — see section 3.
              </p>
              <p>No cancellation fee is charged, because there is nothing to cancel.</p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">
              3. Refunds
            </h2>
            <div className="space-y-4">
              <p>
                If Outmail is not right for you, you may request a full refund{" "}
                <strong className="text-slate-900">within 7 days</strong> of your first payment on a
                plan. We will not ask you to justify the request.
              </p>
              <p>After that 7-day window, the payment for your year is not refunded.</p>
              <p>
                We do not offer partial refunds for unused time, because your access continues for
                the full year regardless of how much you use it.
              </p>
              <p>
                The 7 days run from the date of your payment, not from when you first use the
                service. Your dashboard shows how many days of the window remain.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">
              4. Emails already sent on your behalf
            </h2>
            <div className="space-y-4">
              <p>
                Outmail sends outreach emails from your own email account, on your instruction.
                Emails that have already been sent cannot be recalled, and the outreach they
                represent has already been delivered.
              </p>
              <p>
                Where a refund is issued under the 7-day window above, we issue it in full and do
                not deduct for emails already sent. We mention this only so the position is clear
                rather than left to interpretation.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">
              5. How to request a refund
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                Email{" "}
                <a href="mailto:support@outmail.in" className="text-accent-light hover:underline">
                  support@outmail.in
                </a>{" "}
                from the address registered to your account, stating the plan and the approximate
                date of payment.
              </li>
              <li>We will acknowledge your request within 2 business days.</li>
              <li>
                Approved refunds are issued to the original payment method. We cannot refund to a
                different account or method.
              </li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">
              6. Refund timelines
            </h2>
            <div className="space-y-4">
              <p>
                Once a refund is approved and initiated, the amount is credited to your original
                payment method within{" "}
                <strong className="text-slate-900">5 to 7 business days</strong>.
              </p>
              <p>
                The exact time depends on your bank or card issuer, which is outside our control. If
                the credit has not appeared after 7 business days, contact us and we will share the
                payment gateway’s refund reference so you can raise it with your bank.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">
              7. Failed and duplicate payments
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                If money is debited but your plan is not activated, the amount is normally reversed
                automatically by your bank within 5 to 7 business days.
              </li>
              <li>
                If it is not, contact us with the transaction reference and we will trace and refund
                it.
              </li>
              <li>
                If you are charged twice for the same year, the duplicate is refunded in full.
              </li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">
              8. What happens when your year ends
            </h2>
            <div className="space-y-4">
              <p>
                When your year ends, outreach sending stops and job openings are no longer shown. We
                will remind you before this happens.
              </p>
              <p>
                <strong className="text-slate-900">
                  Your account and your data are not deleted.
                </strong>{" "}
                Your resume, your outreach history and your saved application answers remain, and
                become available again the moment you buy another year.
              </p>
              <p>
                If you renew before your year ends, the remaining days are added to your new year
                rather than being lost.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">
              9. Accounts suspended for misuse
            </h2>
            <p>
              If we suspend or terminate an account for a breach of our{" "}
              <a href="/terms-and-conditions" className="text-accent-light hover:underline">
                Terms and Conditions
              </a>
              , including sending unsolicited bulk email, no refund is due for the remainder of your
              year.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">
              10. If our prices change
            </h2>
            <div className="space-y-4">
              <p>
                <strong className="text-slate-900">
                  A price change never affects a year you have already paid for.
                </strong>{" "}
                If you buy at our launch price, you keep the full year at that price. We will not
                shorten your access, reduce what it includes, or ask you for the difference.
              </p>
              <p>
                Where a plan is offered at a launch price, that price is a genuine discount against
                the standard price shown alongside it, and it applies for a stated reason — for
                example, to our first group of students. It is not a permanent “sale”.
              </p>
              <p>
                When you renew, the price in force on the day you renew applies. It will be shown to
                you before you pay.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">
              11. Changes to this policy
            </h2>
            <p>
              We may update this policy from time to time. The version in force is the one published
              on this page on the date of your payment. Material changes will be notified by email.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">
              12. Contact us
            </h2>
            <div className="space-y-2">
              <p>For anything relating to billing, cancellation or refunds:</p>
              <p>
                Email:{" "}
                <a href="mailto:support@outmail.in" className="text-accent-light hover:underline">
                  support@outmail.in
                </a>
              </p>
              <p>
                Or use our{" "}
                <a href="/contactus" className="text-accent-light hover:underline">
                  Contact
                </a>{" "}
                page.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
