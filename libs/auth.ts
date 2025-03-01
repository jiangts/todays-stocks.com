import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";

// Whitelist of admin emails that are allowed to access admin endpoints
export const ADMINS = ["admin@todays-stocks.com", "support@todays-stocks.com"];

/**
 * Verifies if the current user session belongs to an admin
 * @returns An object containing session and user if authorized, or a NextResponse error if unauthorized
 */
export async function verifyAdminAuth() {
  const authResult = await verifyAuth();

  // If verifyAuth returned an error response, return it
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // Check if the authenticated user is an admin
  if (!authResult.user.email || !ADMINS.includes(authResult.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return authResult;
}

/**
 * Verifies if the user is authenticated
 * @returns An object containing session and user if authorized, or a NextResponse error if unauthorized
 */
export async function verifyAuth() {
  // Get the session using next-auth
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Return session and user if authentication is successful
  return { session, user: session.user };
}
