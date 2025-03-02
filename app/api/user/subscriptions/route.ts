import { NextResponse, NextRequest } from "next/server";
import connectMongo from "@/libs/mongoose";
import StrategySubscription from "@/models/StrategySubscription";
import { verifyAuth } from "@/libs/auth";
import mongoose from "mongoose";

// GET endpoint to retrieve all strategies a user has subscribed to
export async function GET(req: NextRequest) {
  try {
    // Verify user authentication
    const { user, error } = await verifyAuth();
    if (error) return NextResponse.json({ error }, { status: 401 });

    await connectMongo();

    // Get user's subscribed strategies using aggregation pipeline
    const strategies = await StrategySubscription.aggregate([
      {
        $match: {
          // ObjectId conversion is needed!
          userId: new mongoose.Types.ObjectId(user.id),
        },
      },
      {
        $lookup: {
          from: "strategies",
          localField: "strategyId",
          foreignField: "_id",
          as: "strategy",
        },
      },
      { $unwind: "$strategy" },
      { $replaceRoot: { newRoot: "$strategy" } },
    ]);

    return NextResponse.json(
      {
        success: true,
        strategies: strategies.map((strategy) => ({
          ...strategy,
          id: strategy._id,
        })),
      },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Internal server error" },
      { status: 500 },
    );
  }
}
