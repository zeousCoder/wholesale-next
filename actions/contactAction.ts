"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

export async function submitContactForm(formData: FormData) {
  const data = {
    name: formData.get("name")?.toString(),
    email: formData.get("email")?.toString(),
    message: formData.get("message")?.toString(),
  };

  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.contact.create({
      data: parsed.data,
    });

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return {
      success: false,
      errors: { general: "Something went wrong. Please try again later." },
    };
  }
}

export async function getAllContactUs() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: contacts,
    };
  } catch (error) {
    console.error("Error fetching contact form data:", error);
    return {
      success: false,
      errors: { general: "Something went wrong. Please try again later." },
    };
  }
}

export async function deleteContactMessage(id: string) {
  try {
    await prisma.contact.delete({
      where: { id },
    });

    return { success: true, message: "Contact deleted successfully" };
  } catch (error) {
    console.error("Error deleting contact:", error);
    return {
      success: false,
      errors: { general: "Failed to delete contact" },
    };
  }
}
