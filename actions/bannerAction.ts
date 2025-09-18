"use server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

export async function uploadBanner(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file) {
    throw new Error("No file uploaded");
  }

  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to Cloudinary
  const result: any = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "banners",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(buffer);
  });

  // Save to database
  await prisma.banner.create({
    data: {
      image: result.secure_url,
      order: (await prisma.banner.count()) + 1,
      active: true,
    },
  });

  return { success: true, message: "Banner uploaded successfully!" };
}

export async function getBanners() {
  return await prisma.banner.findMany({
    orderBy: { order: "asc" },
  });
}

export async function deleteBanner(id: string) {
  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) {
    throw new Error("Banner not found");
  }

  // Delete from Cloudinary
  const publicId = banner.image.split("/").pop()?.split(".")[0];
  if (publicId) {
    await cloudinary.uploader.destroy(`banners/${publicId}`);
  }

  // Delete from database
  await prisma.banner.delete({ where: { id } });

  return { success: true, message: "Banner deleted successfully!" };
}

export async function toggleBannerStatus(id: string) {
  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) {
    throw new Error("Banner not found");
  }

  await prisma.banner.update({
    where: { id },
    data: { active: !banner.active },
  });

  return {
    success: true,
    message: `Banner marked ${!banner.active ? "active" : "inactive"}`,
  };
}

export async function updateBannerOrder(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.banner.update({
        where: { id },
        data: { order: index + 1 },
      })
    )
  );

  return { success: true, message: "Banner order updated!" };
}
