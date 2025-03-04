import { NextResponse, NextRequest } from "next/server";
import connectMongo from "@/libs/mongoose";
import Strategy from "@/models/Strategy";
import StrategySubscription from "@/models/StrategySubscription";
import { verifyAuth } from "@/libs/auth";
import { sendEmail } from "@/libs/resend";

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
    })).filter(subscriber => subscriber.email === 'jiangtsa@gmail.com');


    // Send email to each subscriber
    const emailResults = await Promise.allSettled(subscribers.map(subscriber => {
      return sendEmail({
        to: subscriber.email,
        subject: `New update for ${strategy.name}`,
        text: `Hello ${subscriber.name},\n\nA new update has been posted for the strategy ${strategy.name}. Visit the platform to view the latest content.\n\nRegards,\nTeam`,
        html: `<p>Hello ${subscriber.name},</p><p>A new update has been posted for the strategy ${strategy.name}. Visit the platform to view the latest content.</p><p>Regards,<br>Team</p>`
      })
    }));

    // Check for any failed email deliveries
    const failedEmails = emailResults.filter(result => result.status === 'rejected');

    return NextResponse.json({
      success: true,
      totalSubscribers: subscribers.length,
      emailsSent: subscribers.length - failedEmails.length,
      failedEmails: failedEmails.length
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
