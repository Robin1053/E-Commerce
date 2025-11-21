"use client";

import { type Session } from "@/lib/auth-client";
import { Box, Divider, IconButton, List, ListItem, ListItemButton, TextField, Typography, Button, Snackbar, Alert } from "@mui/material";
import * as React from "react";
import { useCart } from "@/contexts/CartContext";

// Type für den Warenkorb mit Items und Produkten
type CartWithItems = {
    id: string;
    items: Array<{
        id: string;
        quantity: number;
        product: {
            id: string;
            name: string;
            price: number;
            image: string;
            description: string;
        };
    }>;
} | null;

function CartComponent({ cart }: { session: Session | null, cart: CartWithItems }) {

    const [loading, setLoading] = React.useState(false);
    const { refreshCartCount } = useCart();
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error",
    });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const updateQuantity = async (itemId: string, productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        setLoading(true);
        try {
            const response = await fetch("/api/cart/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cartItemId: itemId,
                    quantity: newQuantity,
                }),
            });
            const data = await response.json();

            if (response.ok) {
                setSnackbar({
                    open: true,
                    message: "Menge aktualisiert",
                    severity: "success",
                });
                await refreshCartCount();
                window.location.reload(); // Reload um die neue Menge anzuzeigen
            } else {
                setSnackbar({
                    open: true,
                    message: data.error || "Fehler beim Aktualisieren",
                    severity: "error",
                });
            }
        } catch (error) {
            console.error("Fehler:", error);
            setSnackbar({
                open: true,
                message: "Netzwerkfehler",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (itemId: string) => {
        setLoading(true);
        try {
            const response = await fetch("/api/cart/remove", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cartItemId: itemId,
                }),
            });
            const data = await response.json();

            if (response.ok) {
                setSnackbar({
                    open: true,
                    message: "Artikel entfernt",
                    severity: "success",
                });
                await refreshCartCount();
                window.location.reload();
            } else {
                setSnackbar({
                    open: true,
                    message: data.error || "Fehler beim Löschen",
                    severity: "error",
                });
            }
        } catch (error) {
            console.error("Fehler:", error);
            setSnackbar({
                open: true,
                message: "Netzwerkfehler",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    }
    // Wenn kein Warenkorb oder leer
    if (!cart || cart.items.length === 0) {
        return (
            <>
                <Typography
                    variant="h4"
                    gutterBottom
                    color="tertiary"
                    sx={{
                        display: "flex",
                        justifyContent: "center"
                    }}>
                    Einkaufswagen
                </Typography>
                <Typography variant="body1" textAlign="center" sx={{ mt: 4 }}>
                    Ihr Einkaufswagen ist leer.
                </Typography>
            </>
        );
    }


    return (
        <>
            <Typography
                variant="h4"
                gutterBottom
                color="tertiary"
                sx={
                    {
                        display: "flex",
                        justifyContent: "center"
                    }
                }>
                Einkaufswagen
            </Typography>
            <Typography variant="body1">
                Dies ist Ihr Einkaufswagen. Hier können Sie die Produkte sehen, die Sie zum Kauf ausgewählt haben.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box>
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {cart.items.map((item) => {
                        return (
                            <ListItem
                                key={item.id}
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => deleteItem(item.id)}
                                        disabled={loading}
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </IconButton>
                                }
                                disablePadding
                            >
                                <ListItemButton role={undefined} dense>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                                        {/* Produktname */}
                                        <Typography variant="h6">
                                            {item.product.name}
                                        </Typography>
                                        {/* Preis */}
                                        <Typography variant="body2" color="text.secondary">
                                            {(item.product.price / 100).toFixed(2)} € × {item.quantity} = {((item.product.price * item.quantity) / 100).toFixed(2)} €
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
                                                onClick={() => updateQuantity(item.id, item.product.id, item.quantity - 1)}
                                                disabled={loading || item.quantity <= 1}
                                                sx={{
                                                    border: 1,
                                                    borderColor: "divider",
                                                }}
                                            >
                                                <span className="material-symbols-outlined">remove</span>
                                            </IconButton>

                                            <TextField
                                                value={item.quantity}
                                                size="small"
                                                type="number"
                                                inputProps={{
                                                    min: 1,
                                                    style: { textAlign: "center" },
                                                    readOnly: true,
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
                                                onClick={() => updateQuantity(item.id, item.product.id, item.quantity + 1)}
                                                disabled={loading}
                                                sx={{
                                                    border: 1,
                                                    borderColor: "divider",
                                                }}
                                            >
                                                <span className="material-symbols-outlined">add</span>
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography>{ }</Typography>
            <Divider sx={{ my: 2 }} />
            <Button
                variant="outlined"
                color="primary"
                disabled={loading}
                fullWidth
                size="large"
            // TODO: Checkout mit stripe 
            >
                {loading ? "Lädt..." : "Zur Kasse"}
            </Button>
            {/* Snackbar für Feedback */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            //anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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
        </>
    )
}

export { CartComponent }