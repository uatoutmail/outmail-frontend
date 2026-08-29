export const metadata = {
  title: "Refund and Cancellation Policy",
  description:
    "How subscriptions, cancellations and refunds work at Outmail, including timelines and how to request a refund.",
  alternates: { canonical: "https://outmail.in/refund-and-cancellation" },
  openGraph: {
    title: "Refund and Cancellation Policy | Outmail",
    description:
      "How subscriptions, cancellations and refunds work at Outmail.",
    url: "https://outmail.in/refund-and-cancellation",
    type: "website",
  },
};

export default function RefundAndCancellation() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#AD46FF]/30">
      <main className="max-w-4xl mx-auto px-6 py-20 lg:py-32">
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-syne tracking-tight text-slate-900">
            Refund and Cancellation Policy
          </h1>
          <p className="text-[#AD46FF] font-semibold tracking-wide text-sm md:text-base uppercase">
            Effective Date: 29th August 2026
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-12 text-slate-700 leading-relaxed font-geist">
          <section className="space-y-4">
            <p className="text-lg text-slate-800">
              This policy explains how subscriptions to Outmail (“Outmail,” “we,” “our,” or “us”) can
              be cancelled, when refunds are available, and how long they take. It applies to all
              paid plans purchased through{" "}
              <a href="https://outmail.in" className="text-[#AD46FF] hover:underline font-medium">
                https://outmail.in
              </a>
              . It should be read alongside our{" "}
              <a href="/terms-and-conditions" className="text-[#AD46FF] hover:underline">
                Terms and Conditions
              </a>
              .
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">
              1. Subscriptions
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                Outmail is sold as a subscription. The price, billing period and inclusions of each
                plan are shown on our{" "}
                <a href="/pricing" className="text-[#AD46FF] hover:underline">
                  Pricing
                </a>{" "}
                page before you pay.
              </li>
              <li>Payment is taken at the start of each billing period.</li>
              <li>All prices are in Indian Rupees (INR).</li>
              <li>
                Payments are processed by Razorpay. We do not receive or store your card details.
              </li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">
              2. Cancelling your subscription
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                You may cancel at any time from your account dashboard, or by emailing us at{" "}
                <a href="mailto:support@outmail.in" className="text-[#AD46FF] hover:underline">
                  support@outmail.in
                </a>
                .
              </li>
              <li>
                Cancelling stops any future billing. It does not, by itself, refund the period you
                have already paid for.
              </li>
              <li>
                <strong className="text-slate-900">
                  Your access continues until the end of the billing period you have paid for.
                </strong>{" "}
                You keep full use of the service until that date.
              </li>
              <li>No cancellation fee is charged.</li>
            </ul>
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
              <p>After that 7-day window, payments for the current billing period are not refunded.</p>
              <p>
                We do not offer pro-rata refunds for unused time in a billing period, because your
                access continues to the end of that period.
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
                Where a refund is issued under the 7-day window above, we issue it in full and do not
                deduct for emails already sent. We mention this only so the position is clear rather
                than left to interpretation.
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
                <a href="mailto:support@outmail.in" className="text-[#AD46FF] hover:underline">
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
                If money is debited but your subscription is not activated, the amount is normally
                reversed automatically by your bank within 5 to 7 business days.
              </li>
              <li>
                If it is not, contact us with the transaction reference and we will trace and refund
                it.
              </li>
              <li>Duplicate charges for the same billing period are refunded in full.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">
              8. Accounts suspended for misuse
            </h2>
            <p>
              If we suspend or terminate an account for a breach of our{" "}
              <a href="/terms-and-conditions" className="text-[#AD46FF] hover:underline">
                Terms and Conditions
              </a>
              , including sending unsolicited bulk email, no refund is due for the remainder of the
              billing period.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">
              9. Changes to this policy
            </h2>
            <p>
              We may update this policy from time to time. The version in force is the one published
              on this page on the date of your payment. Material changes will be notified by email.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 font-syne">
              10. Contact us
            </h2>
            <div className="space-y-2">
              <p>For anything relating to billing, cancellation or refunds:</p>
              <p>
                Email:{" "}
                <a href="mailto:support@outmail.in" className="text-[#AD46FF] hover:underline">
                  support@outmail.in
                </a>
              </p>
              <p>
                Or use our{" "}
                <a href="/contactus" className="text-[#AD46FF] hover:underline">
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
