// app/category/[id]/page.tsx
import { Metadata } from "next";
import prisma from "@/lib/prisma";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Category: ${params.id}` };
}

export default async function CategoryPage({ params }: Props) {
  const products = await prisma.products.findMany({
    where: { categoryId: params.id },
  });

  return (
    <main className=" w-full  px-4 flex flex-col gap-10 py-10 mx-auto">
      <h1 className="text-3xl font-bold mb-6">Products in Category</h1>
      {products.length === 0 ? (
        <p>No products found for this category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((prod) => (
            <div key={prod.id} className="border p-4 rounded shadow">
              <h2 className="font-semibold">{prod.name}</h2>
              {/* Add image, price, and other details as needed */}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
