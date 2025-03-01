import { NextResponse, NextRequest } from "next/server";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import User from "@/models/User";
import { verifyAdminAuth } from "@/libs/auth";

// GET endpoint to fetch all leads
export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const { error } = await verifyAdminAuth();
    if (error) return NextResponse.json({ error }, { status: 401 });

    await connectMongo();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (type === "leads") {
      console.log("HERE!")
      // Fetch all leads
      const leads = await Lead.find({}).sort({ createdAt: -1 }).lean();
      console.log("leads", leads)
      return NextResponse.json({ leads });
    } else if (type === "users") {
      // Fetch all users
      const users = await User.find({}).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ users });
    } else {
      return NextResponse.json(
        { error: "Invalid type parameter" },
        { status: 400 },
      );
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message || "Internal server error" }, { status: 500 });
  }
}
