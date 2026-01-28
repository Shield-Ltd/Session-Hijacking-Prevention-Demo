import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen w-full bg-black text-white px-4 md:px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <Link href="/" className="text-sm text-gray-400 hover:underline">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mt-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 mt-2">
            Last updated: 2026
          </p>
        </header>

        {/* Content */}
        <section className="space-y-8 text-gray-300 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              1. Introduction
            </h2>
            <p>
              This Privacy Policy explains how Session Hijacking collects, uses,
              and protects information when you use this application.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              2. Information We Collect
            </h2>
            <p>
              To detect and prevent session hijacking, we may collect the
              following:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-2">
              <li>Session identifiers and cookies</li>
              <li>Device and browser characteristics (fingerprinting signals)</li>
              <li>IP-related metadata</li>
              <li>Login behavior and anomaly signals</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              3. How We Use Information
            </h2>
            <p>
              Collected information is used solely to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-2">
              <li>Detect unauthorized session activity</li>
              <li>Prevent session hijacking attacks</li>
              <li>Improve system security and reliability</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              4. Data Storage & Security
            </h2>
            <p>
              We implement reasonable security measures to protect collected
              data. Passwords are never stored in plain text, and sensitive
              personal data is not intentionally collected.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              5. Cookies & Sessions
            </h2>
            <p>
              This application uses cookies and session tokens strictly for
              authentication and security monitoring purposes.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              6. Data Sharing
            </h2>
            <p>
              We do not sell, rent, or share collected information with third
              parties, except where required by law.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              7. User Responsibilities
            </h2>
            <p>
              Users are responsible for protecting their credentials and
              understanding that no security system is completely foolproof.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              8. Changes to This Policy
            </h2>
            <p>
              This Privacy Policy may be updated periodically. Continued use of
              the application implies acceptance of the updated policy.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-800 pt-6 text-sm text-gray-500">
          © 2026 Session Hijacking. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
