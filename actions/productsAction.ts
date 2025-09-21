"use server";

import prisma from "@/lib/prisma";

// ✅ Add Product with variants and slug check
export async function addProducts(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const images = formData.getAll("images") as string[];
    const categoryId = formData.get("categoryId") as string;
    const sizes = formData.getAll("sizes") as string[];

    // Variants: colors + stock
    const colors = formData.getAll("color") as string[];
    const stocks = formData.getAll("colorStock") as string[]; // a separate input for stock per color

    if (
      !name ||
      !slug ||
      !description ||
      !price ||
      !categoryId ||
      images.length === 0
    ) {
      throw new Error("Missing required fields");
    }

    // ✅ Check if slug already exists
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) throw new Error("Slug already exists");

    // Create product with variants
    return await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        images,
        sizes,
        categoryId,
        variants: {
          create: colors.map((color, idx) => ({
            color,
            stock: parseInt(stocks[idx] || "0"),
          })),
        },
      },
      include: { variants: true },
    });
  } catch (error) {
    console.error("Error adding products:", error);
    throw new Error("Failed to add product");
  }
}

// ✅ Update Product with variants
export async function updateProduct(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const price = parseFloat((formData.get("price") as string) || "0");
    const images = formData.getAll("images") as string[];
    const categoryId = formData.get("categoryId") as string;
    const sizes = formData.getAll("sizes") as string[];

    const colors = formData.getAll("color") as string[];
    const stocks = formData.getAll("colorStock") as string[];

    // ✅ Check if slug exists on other products
    if (slug) {
      const existing = await prisma.product.findUnique({ where: { slug } });
      if (existing && existing.id !== id)
        throw new Error("Slug already exists");
    }

    // Update product basic info
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(price && { price }),
        ...(images.length > 0 && { images }),
        ...(categoryId && { categoryId }),
        ...(sizes.length > 0 && { sizes }),
      },
      include: { variants: true },
    });

    // ✅ Update variants: remove old variants and add new
    if (colors.length > 0) {
      await prisma.productVariant.deleteMany({ where: { productId: id } });
      await prisma.productVariant.createMany({
        data: colors.map((color, idx) => ({
          productId: id,
          color,
          stock: parseInt(stocks[idx] || "0"),
        })),
      });
    }

    return updatedProduct;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
}

// ✅ Delete Product
export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: (error as Error).message };
  }
}

// ✅ Get All Products (including variants)
export async function getAllProducts() {
  try {
    return await prisma.product.findMany({
      include: { category: true, variants: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}
