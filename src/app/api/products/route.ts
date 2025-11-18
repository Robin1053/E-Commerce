import { prisma } from "@/lib/DB/Prisma";
import { NextResponse } from "next/server";
import { SortOrder } from "../../../../generated/prisma/internal/prismaNamespace";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        price: SortOrder.asc,
      },
    });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
