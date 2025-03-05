import { NextResponse, NextRequest } from "next/server";
import connectMongo from "@/libs/mongoose";
import Strategy from "@/models/Strategy";
import StrategySubscription from "@/models/StrategySubscription";
import { verifyAuth } from "@/libs/auth";
import { sendEmail } from "@/libs/resend";
import dedent from "dedent";
import { convert } from "html-to-text";

// Helper function to generate text version from HTML using html-to-text library
function htmlToText(html: string): string {
  return convert(html, {
    wordwrap: 80,
    selectors: [
      { selector: "a", options: { hideLinkHrefIfSameAsText: true } },
      { selector: "h1, h2, h3", options: { uppercase: false } },
      { selector: "img", format: "skip" },
    ],
    formatters: {
      // Example custom formatter if needed
      // 'customTag': function(elem, walk, builder, formatOptions) {
      //   builder.openBlock();
      //   walk(elem.children, builder);
      //   builder.closeBlock();
      // }
    },
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectMongo();
    // const { user } = await verifyAuth();

    // if (!user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const id = params.id;

    // Extract date from request body
    const body = await req.json();

    // Verify ownership or admin status
    const strategy = await Strategy.findById(id);

    if (!strategy) {
      return NextResponse.json(
        { error: "Strategy not found" },
        { status: 404 },
      );
    }

    // Get all subscribers to this strategy
    const subscriptions = await StrategySubscription.find({ strategyId: id })
      .populate("userId", "name email") // Populate user details, selecting only name and email
      .lean();

    // Extract subscriber information
    const subscribers = subscriptions.map((sub) => ({
      name: sub.userId.name,
      email: sub.userId.email,
    }));

    const updateUrl = `https://www.todays-stocks.com/analysis/${id}/${body.date}`;

    // Send email to each subscriber
    const emailResults = await Promise.allSettled(
      subscribers.map((subscriber) => {
        // Create the HTML version
        const htmlContent = dedent`
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #333; margin-bottom: 5px;">Daily Trading Update</h2>
              <h3 style="color: #0070f3; margin-top: 0;">${strategy.name}</h3>
            </div>

            <div style="background-color: #f8f9fa; border-left: 4px solid #0070f3; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-size: 16px;">Hello${subscriber.name ? " " + subscriber.name : ""},</p>
              <p style="margin-top: 10px;">Your daily stock analysis and picks for the <strong>${strategy.name}</strong> trading strategy are now available.</p>
            </div>

            <div style="text-align: center; margin: 25px 0;">
              <a href="${updateUrl}" style="display: inline-block; background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">View Today's Analysis</a>
            </div>

            <p style="color: #555; line-height: 1.5;">Check out the latest market insights and stock recommendations based on our proprietary algorithms. Our platform analyzes multiple factors to provide you with actionable trading ideas.</p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea;">
              <p style="margin: 0;">Happy trading!</p>
              <p style="margin: 5px 0 0; font-weight: bold;">The Today's Stocks Team</p>
            </div>

            <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eaeaea; font-size: 12px; color: #777; line-height: 1.5;">
              <p style="margin: 0;"><strong>Disclaimer:</strong> This newsletter is for informational purposes only and does not constitute financial advice. Always conduct your own research before making any investment decisions.</p>
            </div>`;

        // Generate text version from HTML
        const textContent = htmlToText(htmlContent);

        return sendEmail({
          to: subscriber.email,
          subject: `${strategy.name}: Stock Picks & Analysis`,
          text: textContent,
          html: htmlContent,
        });
      }),
    );

    // Check for any failed email deliveries
    const failedEmails = emailResults.filter(
      (result) => result.status === "rejected",
    );

    return NextResponse.json(
      {
        success: true,
        totalSubscribers: subscribers.length,
        emailsSent: subscribers.length - failedEmails.length,
        failedEmails: failedEmails.length,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
