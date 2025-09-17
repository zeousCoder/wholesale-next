"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function updateUserPhone(phone: string) {
  if (!phone) {
    throw new Error("No phone number provided");
  }

const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { phone },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      image: true,
      role: true,
    },
  });

  return user;
}
