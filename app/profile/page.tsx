import SidebarProfile from "@/components/profile/Sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { unauthorized } from "next/navigation";
import React from "react";

export default async function ProfilePage() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    return unauthorized();
  }
  return <SidebarProfile />;
}
