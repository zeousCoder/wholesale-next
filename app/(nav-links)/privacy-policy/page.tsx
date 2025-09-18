import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read our privacy policy for Wholesale Muradnagar to understand how we handle your data responsibly.",
};

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-sm">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Intro */}
      <p className="leading-relaxed">
        At <span className="font-semibold">Wholesale Muradnagar</span>, your
        privacy is very important to us. This Privacy Policy explains how we
        collect, use, and safeguard your information when you interact with our
        wholesale marketplace and services.
      </p>

      {/* Section 1 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">1. Information We Collect</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Personal details such as name, email, phone number when registering.
          </li>
          <li>Business details for wholesale orders and transactions.</li>
          <li>
            Log and device information (IP address, browser type, usage data).
          </li>
        </ul>
      </section>

      {/* Section 2 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc list-inside space-y-1">
          <li>To provide and improve our wholesale services.</li>
          <li>To process and manage orders, invoices, and payments.</li>
          <li>To communicate offers, updates, and support-related messages.</li>
          <li>To comply with legal and regulatory requirements.</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">3. Data Security</h2>
        <p className="leading-relaxed">
          We implement strict security measures to protect your data. However,
          no online transmission is 100% secure, and we cannot guarantee
          absolute protection of your information.
        </p>
      </section>

      {/* Section 4 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">4. Cookies & Tracking</h2>
        <p className="leading-relaxed">
          Our website uses cookies to improve user experience, analyze traffic,
          and personalize content. You can disable cookies in your browser
          settings, but some features may not work properly.
        </p>
      </section>

      {/* Section 5 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">5. Third-Party Services</h2>
        <p className="leading-relaxed">
          We may share limited information with trusted third-party providers
          for payment processing, analytics, and delivery services. These
          providers are obligated to protect your information in accordance with
          their privacy policies.
        </p>
      </section>

      {/* Section 6 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">6. Your Rights</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Access, update, or delete your personal information.</li>
          <li>Opt out of marketing communications.</li>
          <li>Request a copy of your stored data.</li>
        </ul>
      </section>

      {/* Contact Section */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">7. Contact Us</h2>
        <p className="leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us
          at: <br />
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
