import type { Product } from "../generated/prisma/client";
import { CardActionArea, CardContent, CardHeader, Card, CardMedia, Button } from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
export default function ProductCard(product: Product) {
  return (
    <>
      <Card sx={
        {
          minHeight: 300,
          padding: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }
      }>
        <CardHeader title={product.name} sx={
          {
            display: "flex",
            flexDirection: "column-reverse"

          }
        } />
        <CardMedia component="img" sx={
          {
            maxHeight: 64
          }
        } image={product.image} alt={product.name} />
        <CardContent>
          {product.description}
          <br />
          Price: {(product.price / 100).toFixed(2)} €

        </CardContent>
        <CardActionArea>
          <Button variant="contained" color="primary" startIcon={<AddShoppingCartIcon />}>
            Add to Card
          </Button>
        </CardActionArea>
      </Card>
    </>
  );
}
