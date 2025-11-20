"use client";
import type { Product } from "../generated/prisma/client";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useState } from "react";
import * as React from "react";
import { useCart } from "@/contexts/CartContext";


export default function ProductCard(product: Product) {

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const { refreshCartCount } = useCart();

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  async function AddtoShoppingCard() {
    setLoading(true);
    
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbar({
          open: true,
          message: `${quantity}x ${product.name} zum Warenkorb hinzugefügt`,
          severity: "success",
        });
        setQuantity(1); // Zurücksetzen auf 1
        await refreshCartCount(); // Aktualisiere die Badge-Anzeige
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Fehler beim Hinzufügen",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Fehler:", error);
      setSnackbar({
        open: true,
        message: "Netzwerkfehler. Bitte versuchen Sie es erneut.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <Card
      sx={{
        height: "100vh",
        maxHeight: "600px",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 6,
        },
      }}
    >
      {/* Bild Container mit fester Höhe */}
      <Box
        sx={{
          position: "relative",
          paddingTop: "75%",
          overflow: "hidden",
          bgcolor: "grey.100",
        }}
      >
        <CardMedia
          component="img"
          image={product.image}
          alt={product.name}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* Optional: Sale Badge oder Category */}
        <Chip
          label="Neu"
          color="secondary"
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            fontWeight: 600,
          }}
        />
      </Box>

      {/* Content Bereich */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          p: 1.5,
          "&:last-child": {
            pb: 1.5,
          },
        }}
      >
        {/* Produktname */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            lineHeight: 1.3,
            minHeight: "2.6em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.name}
        </Typography>

        {/* Beschreibung */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flexGrow: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            //minHeight: "4.5em",
            maxHeight: "20%",
          }}
        >
          {product.description}
        </Typography>

        {/* Preis und Button Container */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            mt: "auto",
            pt: 2,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          {/* Preis */}
          <Typography
            variant="h5"
            component="span"
            sx={{
              fontWeight: 700,
              color: "primary.main",
            }}
          >
            {(product.price / 100).toFixed(2)} €
          </Typography>

          {/* Anzahl Steuerung */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: "center",
            }}
          >
            <IconButton
              size="small"
              onClick={handleDecrease}
              sx={{
                border: 1,
                borderColor: "divider",
              }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>

            <TextField
              value={quantity}
              onChange={handleChange}
              size="small"
              type="number"
              inputProps={{
                min: 1,
                style: { textAlign: "center" },
              }}
              sx={{
                width: "70px",
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                  display: "none",
                },
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
              }}
            />

            <IconButton
              size="small"
              onClick={handleIncrease}
              sx={{
                border: 1,
                borderColor: "divider",
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Hinzufügen Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<AddShoppingCartIcon />}
            onClick={AddtoShoppingCard}
            loading={loading}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              py: 1,
            }}
          >
            {loading ? "Wird hinzugefügt..." : "Hinzufügen"}
          </Button>
        </Box>
      </CardContent>

      {/* Snackbar für Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}
