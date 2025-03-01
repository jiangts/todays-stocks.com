import { NextResponse, NextRequest } from "next/server";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import { sendEmail } from "@/libs/resend";

// This route is used to store the leads that are generated from the landing page.
// The API call is initiated by <ButtonLead /> component
// Duplicate emails just return 200 OK
export async function POST(req: NextRequest) {
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
