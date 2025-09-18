"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function updateUserPhone(phone: string) {
  if (!phone || phone.trim().length < 8) { // add your validation logic here
    throw new Error("No valid phone number provided");
  }

  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });



  // Ensure authentication and id
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("Not authenticated");
  }

  // Update user phone
  const user = await prisma.user.update({
    where: { id: userId },
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

export async function getUserDetails() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
    },
  });

  return users;
}