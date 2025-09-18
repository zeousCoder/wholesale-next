"use server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function addAddress(formData: FormData) {
  const session = await getSession();
  if (!session || !session.user) throw new Error("Unauthorized");

  const street = formData.get("street") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const pincode = formData.get("pincode") as string;
  const phone = formData.get("phone") as string;

  if (!street || !city || !state || !pincode || !phone) {
    throw new Error("All fields are required");
  }

  const address = await prisma.address.create({
    data: {
      street,
      city,
      state,
      pincode,
      phone,
      userId: session.user.id,
    },
  });

  return address;
}

export async function deleteAddress(id: string) {
  const session = await getSession();
  if (!session || !session.user) throw new Error("Unauthorized");

  const address = await prisma.address.findUnique({ where: { id } });
  if (!address) throw new Error("Address not found");

  // Allow if user owns it OR user is ADMIN
  if (address.userId !== session.user.id && session.user.role !== "ADMIN") {
    throw new Error("Not allowed to delete this address");
  }

  await prisma.address.delete({ where: { id } });

  revalidatePath("/profile?tab=address");
  revalidatePath("/dashboard/addresses"); // 👈 if admin dashboard exists
  return { success: true };
}

export async function updateAddress(id: string, formData: FormData) {
  const session = await getSession();
  if (!session || !session.user) throw new Error("Unauthorized");

  const address = await prisma.address.findUnique({ where: { id } });
  if (!address) throw new Error("Address not found");

  if (address.userId !== session.user.id && session.user.role !== "ADMIN") {
    throw new Error("Not allowed to update this address");
  }

  const street = formData.get("street") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const pincode = formData.get("pincode") as string;
  const phone = formData.get("phone") as string;

  const updated = await prisma.address.update({
    where: { id },
    data: { street, city, state, pincode, phone },
  });

  revalidatePath("/profile?tab=address");
  revalidatePath("/dashboard");
  return updated;
}

export async function getAddresses({ adminView = false } = {}) {
  try {
    const session = await getSession();

    if (!session || !session.user) throw new Error("Unauthorized");

    // 👤 Normal user → only their own addresses
    if (session.user.role !== "ADMIN" || !adminView) {
      return await prisma.address.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      });
    }

    // 🛠️ Admin & dashboard view → all addresses
    return await prisma.address.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } }, // so admin knows whose address it is
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    throw new Error("Failed to fetch addresses");
  }
}
