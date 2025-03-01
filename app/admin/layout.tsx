import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { ADMINS } from "@/libs/auth";
import config from "@/config";

// This is a server-side component to ensure the user is an admin.
// If not, it will redirect to the home page.
export default async function LayoutPrivate({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(config.auth.loginUrl);
  }

  // Check if the user is in the ADMINS list
  if (!ADMINS.includes(session.user?.email || "")) {
    redirect("/"); // Redirect non-admin users to home page
  }

  return <>{children}</>;
}
