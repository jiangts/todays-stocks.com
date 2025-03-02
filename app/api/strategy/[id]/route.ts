import { NextResponse, NextRequest } from "next/server";
import connectMongo from "@/libs/mongoose";
import Strategy from "@/models/Strategy";
import StrategySubscription from "@/models/StrategySubscription";
import { ADMINS, verifyAuth } from "@/libs/auth";

// GET - Retrieve a specific strategy by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongo();
    const id = params.id;

    const strategy = await Strategy.findById(id);

    if (!strategy) {
      return NextResponse.json({ error: "Strategy not found" }, { status: 404 });
    }

    // Check authorization for non-public strategies
    if (!strategy.isPublic) {
      try {
        const { user } = await verifyAuth();

        if (!user) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const isAdmin = ADMINS.includes(user.email);
        const isOwner = strategy.createdBy && strategy.createdBy.toString() === user.id.toString();

        if (!isOwner && !isAdmin) {
          return NextResponse.json({ error: "Unauthorized to view this strategy" }, { status: 401 });
        }
      } catch (error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    return NextResponse.json({ strategy }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH - Update a strategy
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongo();
    const { user } = await verifyAuth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
    const updateData = await req.json();

    // Verify ownership or admin status
    const strategy = await Strategy.findById(id);

    if (!strategy) {
      return NextResponse.json({ error: "Strategy not found" }, { status: 404 });
    }

    const isAdmin = ADMINS.includes(user.email);
    const isOwner = strategy.createdBy && strategy.createdBy.toString() === user.id.toString();

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized to modify this strategy" }, { status: 403 });
    }

    const updatedStrategy = await Strategy.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json({ strategy: updatedStrategy }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Remove a strategy
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
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
      return NextResponse.json({ error: "Strategy not found" }, { status: 404 });
    }

    const isAdmin = ADMINS.includes(user.email);
    const isOwner = strategy.createdBy && strategy.createdBy.toString() === user.id.toString();

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized to delete this strategy" }, { status: 403 });
    }

    // Delete all associated subscriptions
    await StrategySubscription.deleteMany({ strategyId: id });

    // Delete the strategy
    await Strategy.findByIdAndDelete(id);
    return NextResponse.json({ message: "Strategy deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
