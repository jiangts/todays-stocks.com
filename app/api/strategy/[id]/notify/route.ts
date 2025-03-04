import { NextResponse, NextRequest } from "next/server";
import connectMongo from "@/libs/mongoose";
import Strategy from "@/models/Strategy";
import StrategySubscription from "@/models/StrategySubscription";
import { verifyAuth } from "@/libs/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectMongo();
    const { user } = await verifyAuth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    }));

    return NextResponse.json({ subscribers }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
