import { NextResponse, NextRequest } from "next/server";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import User from "@/models/User";
import { sendEmail } from "@/libs/resend";
import { verifyAdminAuth } from "@/libs/auth";

// GET endpoint to fetch all leads
export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const authError = await verifyAdminAuth();
    if (authError) return authError;

    await connectMongo();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (type === "leads") {
      // Fetch all leads
      const leads = await Lead.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ leads });
    } else if (type === "users") {
      // Fetch all users
      const users = await User.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ users });
    } else {
      return NextResponse.json(
        { error: "Invalid type parameter" },
        { status: 400 },
      );
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// This route is used to store the leads that are generated from the landing page.
// The API call is initiated by <ButtonLead /> component
// Duplicate emails just return 200 OK
export async function POST(req: NextRequest) {
  // For lead creation, we don't need authentication
  await connectMongo();

  const body = await req.json();

  if (!body.email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const lead = await Lead.findOne({ email: body.email });

    if (!lead) {
      await Lead.create({ email: body.email });
      await sendEmail({
        to: body.email,
        subject: "Welcome to Todays-Stocks.com",
        text: "Welcome to TodaysStocks! We're excited to have you on board. We'll keep you updated with our progress. If you have any questions, feel free to reply to this email.",
        html: "<p>Welcome to TodaysStocks! We're excited to have you on board. We'll keep you updated with our progress. If you have any questions, feel free to reply to this email.</p>",
      });
    }

    return NextResponse.json({});
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
