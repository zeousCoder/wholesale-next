import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the terms and conditions for using Wholesale Muradnagar marketplace.",
};

export default function TermsAndConditions() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Terms & Conditions</h1>
        <p className=" text-sm">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Intro */}
      <p className=" leading-relaxed">
        Welcome to <span className="font-semibold">Wholesale Muradnagar</span>.
        By accessing or using our marketplace and services, you agree to the
        following Terms & Conditions. Please read them carefully before using
        our platform.
      </p>

      {/* Section 1 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">1. Eligibility</h2>
        <p className=" leading-relaxed">
          To use our services, you must be at least 18 years old or accessing
          under the supervision of a guardian. Business accounts must provide
          accurate and verifiable details for wholesale transactions.
        </p>
      </section>

      {/* Section 2 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">2. Account Responsibilities</h2>
        <ul className="list-disc list-inside  space-y-1">
          <li>
            You are responsible for maintaining confidentiality of your account
            credentials.
          </li>
          <li>
            Any activity under your account will be considered your
            responsibility.
          </li>
          <li>Please notify us immediately in case of unauthorized use.</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">3. Wholesale Orders</h2>
        <ul className="list-disc list-inside  space-y-1">
          <li>All orders are subject to availability and confirmation.</li>
          <li>Prices may change without prior notice.</li>
          <li>
            Bulk/wholesale discounts apply only as per our pricing policy.
          </li>
        </ul>
      </section>

      {/* Section 4 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">4. Payments</h2>
        <p className=" leading-relaxed">
          Payments must be made through authorized methods only. We do not take
          responsibility for transactions made outside our official platform or
          payment partners.
        </p>
      </section>

      {/* Section 5 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">5. Shipping & Delivery</h2>
        <p className=" leading-relaxed">
          Delivery timelines depend on order volume, location, and courier
          partners. Any delays caused by third-party logistics providers are
          beyond our control.
        </p>
      </section>

      {/* Section 6 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">6. Returns & Refunds</h2>
        <p className=" leading-relaxed">
          Wholesale orders are generally non-returnable. Exceptions apply only
          for defective or damaged items reported within 48 hours of delivery.
          Refunds, if approved, will be processed within 7–10 working days.
        </p>
      </section>

      {/* Section 7 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">7. Prohibited Activities</h2>
        <ul className="list-disc list-inside  space-y-1">
          <li>
            Reselling our products without permission in restricted markets.
          </li>
          <li>
            Using our platform for illegal, fraudulent, or harmful activities.
          </li>
          <li>Violating intellectual property or third-party rights.</li>
        </ul>
      </section>

      {/* Section 8 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">8. Limitation of Liability</h2>
        <p className=" leading-relaxed">
          Wholesale Muradnagar is not liable for indirect, incidental, or
          consequential damages resulting from the use of our platform or
          products, beyond the value of the transaction.
        </p>
      </section>

      {/* Section 9 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">9. Changes to Terms</h2>
        <p className=" leading-relaxed">
          We reserve the right to modify or update these Terms & Conditions at
          any time. Continued use of our platform after changes implies
          acceptance of the new terms.
        </p>
      </section>

      {/* Contact Section */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">10. Contact Us</h2>
        <p className=" leading-relaxed">
          For any questions or concerns about these Terms & Conditions, please
          contact us at: <br />
          📧{" "}
          <span className="font-semibold">
            support@wholesalemuradnagar.com
          </span>{" "}
          <br />
          📍 Muradnagar, Uttar Pradesh, India
        </p>
      </section>
    </div>
  );
}
