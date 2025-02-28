import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// You are an excellent lawyer.

// I need your help to write a simple privacy policy for my website. Here is some context:
// - Website: https://todays-stocks.com
// - Name: TodaysStocks
// - Contact information: allan@todays-stocks.com
// - Description: A stock research tool that allows users to get automated fundamental and technical analysis (from the news, etc) using LLMs on pre-defined sets of stocks (e.g. 25 losers or gainers of the day) or user-defined stocks and user-defined alerting criterion.
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Purpose of Data Collection: Order processing
// - Data sharing: we do not share the data with any other parties
// - Children's Privacy: we do not collect any data from children
// - Updates to the Privacy Policy: users will be updated by email
// - Contact information: allan@todays-stocks.com

// Please write a simple privacy policy for my site. Add the current date (2025-02-27)

export const metadata = getSEOTags({
  title: `Privacy Policy | ${config.appName}`,
  canonicalUrlRelative: "/privacy-policy",
});

const PrivacyPolicy = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>{" "}
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Privacy Policy for {config.appName}
        </h1>

        <div
          className="leading-relaxed whitespace-pre-wrap prose"
          style={{ fontFamily: "sans-serif" }}
        >
          <p>
            <strong>Effective Date:</strong> February 27, 2025
          </p>

          <p>
            <strong>TodaysStocks</strong> (&quot;we,&quot; &quot;our,&quot; or
            &quot;us&quot;) operates the website{" "}
            <a
              href="https://todays-stocks.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://todays-stocks.com
            </a>{" "}
            (the &quot;Site&quot;). This Privacy Policy explains how we collect,
            use, and protect your information.
          </p>

          <h2>1. Information We Collect</h2>
          <ul>
            <li>
              <strong>Personal Information:</strong> Name, email address, and
              payment information.
            </li>
            <li>
              <strong>Non-Personal Information:</strong> Web cookies to enhance
              user experience.
            </li>
          </ul>

          <h2>2. Purpose of Data Collection</h2>
          <p>
            We collect your personal information to process orders and provide
            services related to stock research and analysis.
          </p>

          <h2>3. Data Sharing</h2>
          <p>
            We do <strong>not</strong> share your personal data with any third
            parties.
          </p>

          <h2>4. Children&apos;s Privacy</h2>
          <p>
            Our services are not intended for children under 13, and we do not
            knowingly collect data from children.
          </p>

          <h2>5. Cookies</h2>
          <p>
            We use cookies to improve your experience on our website. You may
            disable cookies in your browser settings.
          </p>

          <h2>6. Updates to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. If changes
            occur, we will notify users via email.
          </p>

          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, you can contact
            us at:
          </p>
          <p>
            📧{" "}
            <a href="mailto:allan@todays-stocks.com">allan@todays-stocks.com</a>
          </p>

          <p>By using our Site, you agree to this Privacy Policy.</p>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
