import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen w-full bg-black text-white px-4 md:px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <Link href="/" className="text-sm text-gray-400 hover:underline">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mt-4">
            Terms of Service
          </h1>
          <p className="text-gray-400 mt-2">
            Last updated: 2026
          </p>
        </header>

        {/* Content */}
        <section className="space-y-8 text-gray-300 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              1. Purpose of the Application
            </h2>
            <p>
              Session Hijacking is an educational and demonstration-based
              security system designed to showcase how session hijacking attacks
              occur and how they can be detected and prevented.
            </p>
            <p className="mt-2">
              This application is not intended to provide guaranteed or
              enterprise-grade security.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              2. Acceptable Use
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>No unauthorized attacks on real systems or users</li>
              <li>No malicious exploitation or abuse of the platform</li>
              <li>No illegal or unethical activities</li>
              <li>Use strictly for learning and defensive research</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              3. Data Collection & Sessions
            </h2>
            <p>
              To detect session hijacking, the system may collect session
              identifiers, device or browser characteristics, IP-related
              metadata, and behavioral signals.
            </p>
            <p className="mt-2">
              Passwords are not stored in plain text, and no biometric or
              sensitive personal data is intentionally collected.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              4. User Responsibility
            </h2>
            <p>
              Users are responsible for protecting their credentials and session
              information. No system is completely secure, and false positives
              or negatives may occur.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              5. No Warranty
            </h2>
            <p>
              This application is provided “AS IS” without warranties of any
              kind. We do not guarantee complete protection against session
              hijacking or other attacks.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              6. Limitation of Liability
            </h2>
            <p>
              Under no circumstances shall the developers be liable for any
              direct or indirect damages, data loss, or security incidents
              arising from the use of this application.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              7. Educational Disclaimer
            </h2>
            <p>
              This project demonstrates defensive cybersecurity concepts. It
              does not promote hacking or illegal activities.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              8. Modifications
            </h2>
            <p>
              We reserve the right to modify or discontinue the service and
              update these Terms at any time. Continued use implies acceptance
              of the updated Terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              9. Governing Law
            </h2>
            <p>
              These Terms shall be governed by applicable laws within the
              relevant jurisdiction.
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
