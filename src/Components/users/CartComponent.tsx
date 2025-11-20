"use client";

import { type Session } from "@/lib/auth-client";
import { Box, Divider, IconButton, List, ListItem, ListItemButton, TextField, Typography, Button, } from "@mui/material";
import * as React from "react";

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
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {cart.items.map((item) => {
                        return (
                            <ListItem
                                key={item.id}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="comments">
                                        <span className="material-symbols-outlined">delete</span>
                                    </IconButton>
                                }
                                disablePadding
                            >
                                <ListItemButton role={undefined} dense>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                                        {/* Produktname */}
                                        <Typography variant="h6">{item.product.name}</Typography>
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
                                                // TODO: Implementiere Update-Funktion
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
                                                // TODO: Implementiere Update-Funktion
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
            <Button variant="outlined" color="primary">
                Checkout
            </Button>
        </>
    )
}

export { CartComponent }