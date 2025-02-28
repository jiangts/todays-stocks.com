import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// You are an excellent lawyer.

// I need your help to write a simple Terms & Services for my website. Here is some context:
// - Website: https://todays-stocks.com
// - Name: TodaysStocks
// - Contact information: allan@todays-stocks.com
// - Description: A stock research tool that allows users to get automated fundamental and technical analysis (from the news, etc) using LLMs on pre-defined sets of stocks (e.g. 25 losers or gainers of the day) or user-defined stocks and user-defined alerting criterion.
// - Ownership: usage of tool is not to constitute financial advice, but only for informational purposes. Users change positions in stock according to their own judgement, and we are not responsible for any losses or gains that resulted from using information from our service.
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Link to privacy-policy: https://todays-stocks.com/privacy-policy
// - Governing Law: United States, California
// - Updates to the Terms: users will be updated by email

// Please write a simple Terms & Services for my site. Add the current date (2025-02-27)

export const metadata = getSEOTags({
  title: `Terms and Conditions | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
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
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Terms and Conditions for {config.appName}
        </h1>

        <div
          className="leading-relaxed whitespace-pre-wrap prose"
          style={{ fontFamily: "sans-serif" }}
        >
          <p>
            <strong>Last Updated: February 27, 2025</strong>
          </p>

          <p>
            Welcome to <strong>TodaysStocks</strong> (
            <a href="https://todays-stocks.com" rel="noopener" target="_blank">
              https://todays-stocks.com
            </a>
            ). By accessing or using our services, you agree to these Terms of
            Service (&quot;Terms&quot;). If you do not agree, please do not use
            our website or services.
          </p>

          <h2>
            <strong>1. Overview</strong>
          </h2>
          <p>
            TodaysStocks is a stock research tool that provides automated
            fundamental and technical analysis using large language models
            (LLMs) on pre-defined or user-defined stock sets and alerting
            criteria.
          </p>

          <h2>
            <strong>2. No Financial Advice</strong>
          </h2>
          <p>
            TodaysStocks provides <strong>informational content only</strong>.
            Our service does <strong>not</strong> constitute financial,
            investment, tax, or legal advice. You acknowledge that any financial
            decisions you make based on our content are solely your
            responsibility, and{" "}
            <strong>we are not liable for any losses or gains</strong> arising
            from your use of the service.
          </p>

          <h2>
            <strong>3. User Accounts &amp; Data Collection</strong>
          </h2>
          <p>
            To access certain features, you may need to create an account and
            provide personal information, including:
          </p>
          <ul>
            <li>Name</li>
            <li>Email</li>
            <li>Payment information</li>
          </ul>
          <p>
            We also collect non-personal data through web cookies. For more
            details, please review our{" "}
            <a
              href="https://todays-stocks.com/privacy-policy"
              rel="noopener"
              target="_blank"
            >
              Privacy Policy
            </a>
            .
          </p>

          <h2>
            <strong>4. Payment &amp; Subscription</strong>
          </h2>
          <p>
            If you purchase a subscription or service through TodaysStocks, you
            agree to provide accurate payment information and authorize us to
            charge you according to the selected plan. Refund policies, if
            applicable, will be detailed on the payment page.
          </p>

          <h2>
            <strong>5. User Responsibilities</strong>
          </h2>
          <p>By using our service, you agree:</p>
          <ul>
            <li>
              Not to use the platform for any illegal or fraudulent activities.
            </li>
            <li>
              Not to attempt to manipulate, copy, or reverse-engineer our tools
              or services.
            </li>
            <li>To comply with all applicable laws and regulations.</li>
          </ul>

          <h2>
            <strong>6. Limitation of Liability</strong>
          </h2>
          <p>
            To the fullest extent permitted by law,{" "}
            <strong>
              TodaysStocks is not responsible for any direct, indirect,
              incidental, consequential, or punitive damages
            </strong>{" "}
            resulting from your use of our website or services.
          </p>

          <h2>
            <strong>7. Updates to These Terms</strong>
          </h2>
          <p>
            We may update these Terms from time to time. If we make significant
            changes, we will notify users via email. Continued use of our
            services after updates constitutes acceptance of the revised Terms.
          </p>

          <h2>
            <strong>8. Governing Law</strong>
          </h2>
          <p>
            These Terms are governed by the laws of the{" "}
            <strong>United States, State of California</strong>, without regard
            to conflict of law principles.
          </p>

          <h2>
            <strong>9. Contact Information</strong>
          </h2>
          <p>
            If you have any questions about these Terms, you can contact us at{" "}
            <strong>
              <a href="mailto:allan@todays-stocks.com" rel="noopener">
                allan@todays-stocks.com
              </a>
            </strong>
            .
          </p>
        </div>
      </div>
    </main>
  );
};

export default TOS;
