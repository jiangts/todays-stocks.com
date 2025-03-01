import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";

// Whitelist of admin emails that are allowed to access admin endpoints
export const ADMINS = ["admin@todays-stocks.com", "jiangtsa@gmail.com"];

export async function verifyAdminAuth() {
  // Get the session using next-auth
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session?.user || !ADMINS.includes(session?.user?.email)) {
    return { error: "Unauthorized" };
  }

  return { session, user: session.user };
}

export async function verifyAuth() {
  // Get the session using next-auth
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  // Return session and user if authentication is successful
  return { session, user: session.user };
}
