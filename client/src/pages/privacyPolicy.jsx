import React from "react";

const Section = ({ title, children }) => (
  <section className="mt-10">
    <h2 className="text-xl font-semibold text-gray-900 mb-3">
      {title}
    </h2>
    <div className="space-y-3 text-gray-700 leading-relaxed">
      {children}
    </div>
  </section>
);

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-10">

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Privacy Policy for SchedMate
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            <strong>Last updated:</strong> February 10, 2026
          </p>
        </header>

        <p className="text-gray-700 leading-relaxed">
          SchedMate (“we”, “our”, or “us”) is operated by{" "}
          <strong>Shivam Kumar</strong> and provides a web-based scheduling
          service (the “Service”). This Privacy Policy explains how we
          collect, use, and protect information when you use SchedMate,
          including when you sign in using Google.
        </p>

        {/* Sections */}

        <Section title="1. Information We Collect">
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Basic profile information such as your name, email address, and
              Google profile ID
            </li>
            <li>
              Google Calendar data necessary to create, read, and manage
              events on your behalf
            </li>
            <li>
              Authentication tokens required to maintain your login session
            </li>
          </ul>
          <p>
            We only collect information required to provide the core
            functionality of the Service.
          </p>
        </Section>

        <Section title="2. How We Use Your Information">
          <ul className="list-disc pl-6 space-y-2">
            <li>Creating and managing calendar events at your request</li>
            <li>Displaying scheduling information inside the app</li>
            <li>Maintaining secure authentication sessions</li>
          </ul>
          <p>
            We do <strong>not</strong> use your data for advertising or
            marketing purposes.
          </p>
        </Section>

        <Section title="3. Google Calendar Data Usage">
          <p>
            SchedMate requests access to Google Calendar only to perform
            actions that you explicitly initiate. Calendar data is used
            exclusively to support scheduling functionality within the app. We
            do not sell, rent, or share Google user data with third parties.
          </p>
        </Section>

        <Section title="4. Data Storage and Security">
          <p>
            Authentication tokens and user information are stored securely on
            our servers using industry-standard security practices. We
            implement safeguards to protect your information against
            unauthorized access, disclosure, or misuse.
          </p>
        </Section>

        <Section title="5. Data Sharing">
          <p>
            We do not sell or share your personal information with third
            parties. Information may only be disclosed if required by law or
            to protect the security and integrity of the Service.
          </p>
        </Section>

        <Section title="6. Data Retention">
          <p>
            We retain user information only for as long as necessary to
            provide the Service. You may request deletion of your data at any
            time by contacting us.
          </p>
        </Section>

        <Section title="7. Revoking Access">
          <p>
            You may revoke SchedMate’s access to your Google account at any
            time through your Google Account permissions settings. After
            revocation, some features of the Service may no longer function
            properly.
          </p>
        </Section>

        <Section title="8. Your Rights">
          <ul className="list-disc pl-6 space-y-2">
            <li>Request access to your personal data</li>
            <li>Request correction or deletion of your data</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </Section>

        <Section title="9. Children’s Privacy">
          <p>
            SchedMate is not intended for use by children under the age of
            13. We do not knowingly collect personal information from
            children.
          </p>
        </Section>

        <Section title="10. Changes to This Privacy Policy">
          <p>
            We may update this Privacy Policy from time to time. Updates will
            be posted on this page with a revised date.
          </p>
        </Section>

        <Section title="11. Contact Information">
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="font-medium">Shivam Kumar</p>
            <p>Email: shivamkumareng7@gmail.com</p>
            <p>Country: India</p>
          </div>
        </Section>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-400">
          © 2026 SchedMate. All rights reserved.
        </footer>

      </div>
    </div>
  );
};
