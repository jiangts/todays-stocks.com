import { NextResponse, NextRequest } from "next/server";
import connectMongo from "@/libs/mongoose";
import Strategy from "@/models/Strategy";
import StrategySubscription from "@/models/StrategySubscription";
import { verifyAuth } from "@/libs/auth";
import { sendEmail } from "@/libs/resend";
import dedent from "dedent";

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
        return sendEmail({
          to: subscriber.email,
          subject: `${strategy.name}: Stock Picks & Analysis`,
          text: dedent`Hello ${subscriber.name},

          Here's your daily update for the ${strategy.name} trading strategy.
          ${updateUrl}

          Cheers!
          The Today's Stocks Team

          Note: This newsletter is for informational purposes only and does not constitute financial advice. Please conduct your own research before making any investment decisions.`,
          html: dedent`
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
            <h2 style="color: #333;">Daily Update: ${strategy.name}</h2>
            <p>Hello ${subscriber.name},</p>
            <p>Here's your daily update for the <strong>${strategy.name}</strong> trading strategy.</p>
            <p><a href="${updateUrl}" style="display: inline-block; background-color: #0070f3; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; margin: 15px 0;">View Today's Picks & Analysis</a></p>
            <p>Cheers!<br>The Today's Stocks Team</p>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">Note: This newsletter is for informational purposes only and does not constitute financial advice. Please conduct your own research before making any investment decisions.</p>
          </div>`,
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
