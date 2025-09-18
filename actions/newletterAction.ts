"use server";

import prisma from "@/lib/prisma";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function postNewsletter(email: string) {
  if (!email) {
    throw new Error("Email is required");
  }

  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  const existing = await prisma.newsletter.findUnique({
    where: { email },
  });
  if (existing) {
    throw new Error("Email is already subscribed");
  }

  try {
    const newsletter = await prisma.newsletter.create({
      data: { email },
    });
    return newsletter;
  } catch (error) {
    console.error("Error creating newsletter", error);
    throw new Error("Failed to subscribe to newsletter");
  }
}

export async function getNewsletters() {
  try {
    return await prisma.newsletter.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching newsletters", error);
    throw new Error("Failed to fetch newsletters");
  }
}

export async function deleteNewsletter(id: string) {
  try {
    await prisma.newsletter.delete({
      where: { id },
    });
  } catch (err) {
    console.error("Error deleting newsletter", err);
    throw new Error("Failed to delete newsletter");
  }
}
