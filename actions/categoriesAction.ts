"use server";

import prisma from "@/lib/prisma";

export async function postCategory(name: string) {
  if (!name) throw new Error("Category name is required!");

  try {
    return await prisma.category.create({ data: { name } });
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error("Category with this name already exists");
    }
    console.error("Failed to add category", error);
    throw new Error("Failed to add category");
  }
}

export async function updateCategory(id: string, name: string) {
  if (!name) throw new Error("Category name is required!");

  try {
    return await prisma.category.update({
      where: { id },
      data: { name },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error("Category with this name already exists");
    }
    console.error("Failed to update category", error);
    throw new Error("Failed to update category");
  }
}

export async function getCategoriesWithProducts() {
  try {
    return await prisma.category.findMany({
      include: { Products: true },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch categories with products", error);
    throw new Error("Failed to fetch categories with products");
  }
}

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch categories", error);
    throw new Error("Failed to fetch categories");
  }
}

export async function deleteCategory(id: string) {
  try {
    return await prisma.category.delete({ where: { id } });
  } catch (error) {
    console.error("Failed to delete category", error);
    throw new Error("Failed to delete category");
  }
}
