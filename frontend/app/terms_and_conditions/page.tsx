export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-gray-700 bg-white rounded-2xl shadow-sm">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold mb-3 text-black">Terms &amp; Conditions</h1>
          <p className="text-sm text-gray-500">Last updated: October 2025</p>
        </header>

        <p className="mb-6 leading-relaxed">
          Welcome to our website. By accessing or using our services, you agree to
          comply with and be bound by the following terms and conditions. Please
          read them carefully before using our website or services.
        </p>

        <ol className="list-decimal pl-6 space-y-6">
          <li>
            <h2 className="text-2xl font-semibold mt-0 mb-2">Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By using our platform, you confirm that you are at least 18 years
              old and capable of entering into a legally binding agreement. If
              you do not agree with these terms, you must not use our
              services.
            </p>
          </li>

          <li>
            <h2 className="text-2xl font-semibold mt-0 mb-2">Use of Services</h2>
            <p className="leading-relaxed">
              You agree to use our website and services only for lawful purposes
              and in accordance with these Terms. You must not misuse or attempt
              to disrupt the operation of the site in any way.
            </p>
          </li>

          <li>
            <h2 className="text-2xl font-semibold mt-0 mb-2">User Accounts</h2>
            <p className="leading-relaxed">
              To access certain features, you may be required to create an
              account. You are responsible for maintaining the confidentiality
              of your login information and for all activities that occur under
              your account.
            </p>
          </li>

          <li>
            <h2 className="text-2xl font-semibold mt-0 mb-2">Intellectual Property</h2>
            <p className="leading-relaxed">
              All content, design, and materials on this website are owned by
              or licensed to us. You may not reproduce, distribute, or create
              derivative works without our written consent.
            </p>
          </li>

          <li>
            <h2 className="text-2xl font-semibold mt-0 mb-2">Limitation of Liability</h2>
            <p className="leading-relaxed">
              To the fullest extent permitted by law, we are not liable for any
              direct, indirect, incidental, special, exemplary, or
              consequential damages arising from your use of our website or
              services.
            </p>
          </li>

          <li>
            <h2 className="text-2xl font-semibold mt-0 mb-2">Changes to Terms</h2>
            <p className="leading-relaxed">
              We reserve the right to modify these Terms at any time. Any
              updates will be posted on this page with a revised effective
              date. Continued use of the site after such changes constitutes
              your acceptance of the new Terms.
            </p>
          </li>

          <li>
            <h2 className="text-2xl font-semibold mt-0 mb-2">Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about these Terms, please contact us at{' '}
              <a
                href="mailto:kariointernship@gmail.com"
                className="text-blue-600 hover:underline"
              >
                kariointernship@gmail.com
              </a>
              .
            </p>
          </li>
        </ol>

        <section className="mt-10 space-y-6">
          <h2 className="text-2xl font-semibold mb-2">Additional provisions</h2>

          <div>
            <h3 className="font-semibold mb-1">Governing Law</h3>
            <p className="leading-relaxed">
              These Terms shall be governed by and interpreted in accordance with
              the laws of India, without regard to its conflict of law
              provisions.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Termination of Access</h3>
            <p className="leading-relaxed">
              We reserve the right to suspend or terminate your access to our
              services at any time, without prior notice, if we reasonably
              believe you have violated these Terms or engaged in harmful
              behavior.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Third‑Party Links</h3>
            <p className="leading-relaxed">
              Our website may contain links to third‑party sites or services.
              We do not control and are not responsible for their content,
              terms, or privacy practices. Links are provided for convenience
              only and do not imply endorsement.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Privacy</h3>
            <p className="leading-relaxed">
              We care about your privacy. Our Privacy Policy explains how we
              collect, use, and protect your personal information. If you do
              not have a separate Privacy Policy yet, consider adding one and
              linking it here.
            </p>
          </div>
        </section>

        <footer className="mt-10 text-sm text-gray-500">
          <p>
            By using this site you acknowledge that you have read and
            understood these Terms and agree to be bound by them.
          </p>
        </footer>
      </article>
    </main>
  );
}
