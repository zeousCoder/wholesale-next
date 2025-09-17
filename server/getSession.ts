"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getSession = async () => {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  return session;
};
