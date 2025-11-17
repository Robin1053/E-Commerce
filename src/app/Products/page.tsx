import ProductCard from "@/Components/product";
import * as React from "react";
import { prisma } from "@/lib/DB/Prisma";
import { Grid } from "@mui/material";

export default async function ProductsPage() {
  // Server component: fetch directly from the database using Prisma.
  const products = await prisma.product.findMany();

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {products.map((p) => (

          <ProductCard key={p.id} {...p} />
        ))}
      </Grid>
    </>
  );
}
