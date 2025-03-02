import { NextResponse, NextRequest } from "next/server";
import connectMongo from "@/libs/mongoose";
import Subscription from "@/models/StrategySubscription";
import { verifyAuth } from "@/libs/auth";
import mongoose from "mongoose";

// POST endpoint to subscribe to a strategy
export async function POST(req: NextRequest) {
  try {
    // Verify user authentication
    const { user, error } = await verifyAuth();
    if (error) return NextResponse.json({ error }, { status: 401 });

    await connectMongo();

    const body = await req.json();
    const { strategyId } = body;

    // Validate strategyId
    if (!strategyId || !mongoose.Types.ObjectId.isValid(strategyId)) {
      return NextResponse.json(
        { error: "Valid strategy ID is required" },
        { status: 400 }
      );
    }

    // Create or update subscription
    await Subscription.updateOne(
      { userId: user.id, strategyId },
      { $setOnInsert: { subscribedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json(
      { success: true, message: "Successfully subscribed to strategy" },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    // Handle duplicate key error specifically
    if (e.code === 11000) {
      return NextResponse.json(
        { error: "You are already subscribed to this strategy" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: e.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Verify user authentication
    const { user, error } = await verifyAuth();
    if (error) return NextResponse.json({ error }, { status: 401 });

    await connectMongo();

    const body = await req.json();
    const { strategyId } = body;

    // Validate strategyId
    if (!strategyId || !mongoose.Types.ObjectId.isValid(strategyId)) {
      return NextResponse.json(
        { error: "Valid strategy ID is required" },
        { status: 400 }
      );
    }

    // Remove subscription
    const result = await Subscription.deleteOne({ userId: user.id, strategyId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Successfully unsubscribed from strategy" },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e.message || "Internal server error" },
      { status: 500 }
    );
  }
}
