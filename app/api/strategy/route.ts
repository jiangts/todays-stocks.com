import { NextResponse, NextRequest } from "next/server";
import connectMongo from "@/libs/mongoose";
import Strategy from "@/models/Strategy";
import { ADMINS, verifyAuth } from "@/libs/auth";

// GET - Retrieve all strategies or filter by criteria
export async function GET(req: NextRequest) {
  try {
    await connectMongo();
    const searchParams = req.nextUrl.searchParams;
    const visibility = searchParams.get("visibility");
    const createdBy = searchParams.get("createdBy");
    const isAdminRequest = searchParams.get("admin") === "true";

    let query: any = {};

    // Check if admin request and verify admin status
    if (isAdminRequest) {
      const { user } = await verifyAuth();

      if (!user || !ADMINS.includes(user.id)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Admin can see all strategies with applied filters
      if (visibility) {
        query.visibility = visibility;
      }

      if (createdBy) {
        query.createdBy = createdBy;
      }
    } else {
      // For non-admin users, try to get their auth
      const { user } = await verifyAuth().catch(() => ({ user: null as any }));

      if (user) {
        // Authenticated users can see public strategies OR their own strategies
        query = {
          $or: [
            { visibility: "public" },
            { createdBy: user.id }
          ]
        };
      } else {
        // Non-authenticated users can only see public strategies
        query.visibility = "public";
      }

      // Apply createdBy filter if provided (overrides other filters)
      if (createdBy) {
        query.createdBy = createdBy;
      }
    }

    const strategies = await Strategy.find(query);
    return NextResponse.json({ strategies }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create a new strategy
export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    const { user } = await verifyAuth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // Set the creator
    data.createdBy = user.id;

    const strategy = await Strategy.create(data);
    return NextResponse.json({ strategy }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
