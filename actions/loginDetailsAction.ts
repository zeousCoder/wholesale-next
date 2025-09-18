"use server";

import prisma from "@/lib/prisma";

export async function getLoginDetails() {
  return await prisma.session.findMany({
    select: {
      id: true,
      userId: true,
      token: true,
      expiresAt: true,
      ipAddress: true,
      userAgent: true,
      createdAt: true,
      updatedAt: true,
      impersonatedBy: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
