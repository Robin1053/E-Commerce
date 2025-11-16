import type { Product } from "../../generated/prisma/client";
import { CardActionArea, CardContent, CardHeader, Card, CardMedia } from "@mui/material";

export default function Product(product: Product) {
  return (
    <>
      <Card>
        <CardHeader title={product.name}/>
        <CardMedia component="img" height="194" image={product.image} alt={product.name} />
        <CardContent>
            {product.description}
        </CardContent>
        <CardActionArea>
            Price: {(product.price / 100).toFixed(2)} €
        </CardActionArea>
      </Card>
    </>
  );
}
