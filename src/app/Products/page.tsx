import ProductCard from "@/Components/product";
import * as React from "react";
import { prisma } from "@/lib/DB/Prisma";
import { Alert } from "@mui/material";

export default async function ProductsPage() {
  // Server component: fetch directly from the database using Prisma.
  const products = await prisma.product.findMany();

  return (
    <>
    <Alert severity="error"></Alert>
      {products.map((p) => (
        // Spread product fields so ProductCard receives them as props matching the expected shape
        <ProductCard key={p.id} {...p} />
      ))}
    </>
  );
}
