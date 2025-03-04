import { NextResponse, NextRequest } from "next/server";
import connectMongo from "@/libs/mongoose";
import Strategy from "@/models/Strategy";
import { verifyAdminAuth } from "@/libs/auth";

// Default strategies to initialize
const DEFAULT_STRATEGIES = [
  {
    name: "Daily Losers",
    frequency: "daily",
    description:
      "List of 25 biggest stock losers each day and AI analysis of why the price moved",
    visibility: "public",
  },
  {
    name: "Daily Winners",
    frequency: "daily",
    description:
      "List of 25 biggest stock gainers each day with AI analysis of the price movement",
    visibility: "public",
  },
  // {
  //   name: "Weekly Market Recap",
  //   frequency: "weekly",
  //   description:
  //     "Comprehensive analysis of market trends and notable stock movements from the week",
  //   visibility: "public",
  // },
  // {
  //   name: 'Monthly Sector Analysis',
  //   frequency: 'monthly',
  //   description: 'Deep dive into sector performance with AI predictions for upcoming month',
  //   visibility: "public",
  // },
  // {
  //   name: 'IPO Alerts',
  //   frequency: 'as available',
  //   description: 'Notifications about upcoming IPOs with company analysis and market predictions',
  //   visibility: "public",
  // }
  // {
  //   name: "Growth Stocks",
  //   description: "Focus on companies with above-average growth potential",
  //   visibility: "public",
  // },
  // {
  //   name: "Dividend Stocks",
  //   description: "Focus on companies that pay regular dividends",
  //   visibility: "public",
  // },
  // {
  //   name: "Value Investing",
  //   description: "Focus on undervalued companies with strong fundamentals",
  //   visibility: "public",
  // },
  // {
  //   name: "Index Fund Strategy",
  //   description: "Focus on market index funds for long-term growth",
  //   visibility: "public",
  // },
  // {
  //   name: "Momentum Strategy",
  //   description: "Focus on stocks showing upward price movement trends",
  //   visibility: "public",
  // }
];

// POST endpoint to upsert initial strategies
export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    const { error } = await verifyAdminAuth();
    if (error) return NextResponse.json({ error }, { status: 401 });

    await connectMongo();

    const results = [];

    // Process each default strategy
    for (const strategy of DEFAULT_STRATEGIES) {
      // Check if strategy already exists by name
      const existingStrategy = await Strategy.findOne({
        name: strategy.name,
        createdBy: null,
      });

      if (existingStrategy) {
        // Update strategy without changing timestamps
        await Strategy.findByIdAndUpdate(
          existingStrategy._id,
          { ...strategy },
          {
            new: true,
            timestamps: false, // Don't update timestamps
          },
        );
        results.push({ name: strategy.name, action: "updated" });
      } else {
        // Create new strategy
        console.log("strategy", strategy);
        const newStrategy = await Strategy.create(strategy);
        console.log("newStrategy", newStrategy);
        results.push({
          name: strategy.name,
          action: "created",
          id: newStrategy._id,
        });
      }
    }

    return NextResponse.json({
      message: "Strategies initialization completed",
      results,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e.message || "Internal server error" },
      { status: 500 },
    );
  }
}
