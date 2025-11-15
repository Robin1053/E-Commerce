"use client";

import * as React from "react";
import { useState } from "react";
import {
  Typography,
  CardContent,
  Card,
  CardHeader,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Checkbox,
  Button,
  FormControlLabel,
  Divider,
  Box,
  Alert,
  LinearProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import KeyIcon from "@mui/icons-material/Key";
import { AuthClient, type Session } from "@/lib/auth-client";
import SvgIcon from "@mui/material/SvgIcon";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleEmailSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    // Ihre E-Mail-Anmelde-Logik hier
    console.log("E-Mail Registrierung was clicked.");
    setLoading(true);

    if (!email || !password) {
      console.error("E-Mail or Password is missing.");
      setErrorMessage("E-Mail or Password is missing.");
      setLoading(false);

      return;
    }
    try {
      const { data, error } = await AuthClient.signIn.email({
        email: email, // required
        password: password, // required
        rememberMe: rememberMe as boolean,
        callbackURL: "/",
      });
      console.log(`trying to sign in with ${email}...`);
      if (error) {
        console.error("Error signing in with email:", error);
        setErrorMessage("Error signing in with email: " + error.message);
        setLoading(false);
      } else {
        console.log("Email sign-in successful!", data);
        setLoading(false);
      }
    } catch (err) {
      setErrorMessage("Unexpected error signing in with email." + err);
      console.error("Unexpected error signing in with email:", err);
    }
  };
  const handlePasskeySignIn = async (event: React.MouseEvent) => {
    event.preventDefault();
    console.log(`trying to sign in with passkey ...`);
    setLoading(true);

    await AuthClient.signIn.passkey({
      autoFill: false,
      fetchOptions: {
        onSuccess() {
          setLoading(false);
          window.location.href = "/dashboard";
        },
        onError(context) {
          setLoading(false);
          console.error("Authentication failed:", context.error.message);
          setErrorMessage("Authentication failed: " + context.error.message);
        },
      },
    });
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: 440,
          mx: "auto",
          mt: 8,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardHeader title="Bitte melden Sie sich an" />
        <CardContent
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {errorMessage && (
            <Alert
              severity="error"
              variant="outlined"
              sx={{
                width: 300,
                minHeight: 48,
                mb: 2, // Abstand nach unten hinzufügen
              }}
            >
              {errorMessage}
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={handleEmailSignIn}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              width: 300,
            }}
          >
            <TextField
              fullWidth
              id="email"
              label="Max@Musterman.de"
              variant="standard"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FormControl fullWidth variant="standard">
              <InputLabel htmlFor="password">Passwort</InputLabel>
              <Input
                value={password}
                id="password"
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)} // onChange-Handler hinzugefügt
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "Passwort ausblenden"
                          : "Passwort anzeigen"
                      }
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    id="rememberMe"
                    name="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                }
                label="Angemeldet bleiben"
              />
              <Typography
                variant="body2"
                sx={{
                  color: "secondary",
                  textDecoration: "underline dotted",
                }}
              >
                <a href="/auth/forgotpassword">Passwort vergessen</a>
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                width: "100%",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{
                  flexGrow: 1,
                  minHeight: "48px",
                }}
              >
                Anmelden
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                href="/auth/signup"
                sx={{
                  flexGrow: 1,
                  minHeight: "48px",
                }}
              >
                Registrieren
              </Button>
            </Box>
          </Box>
          {loading && (
            <LinearProgress
              style={{
                width: 300,
                marginTop: 3,
                marginBottom: 3,
              }}
            />
          )}
          {!loading && (
            <Divider
              sx={{
                my: 3,
                width: 300,
              }}
            >
              Oder melden Sie sich an mit
            </Divider>
          )}
          <Box
            sx={{
              gap: 2,
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outlined"
              onClick={handlePasskeySignIn}
              startIcon={<KeyIcon />}
              sx={{
                width: 300,
                minHeight: 48,
                font: "Roboto",
              }}
              loading={loading}
            >
              Oder mit Passkey anmelden
            </Button>
            <Button
              startIcon={
                <SvgIcon>
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                </SvgIcon>
              }
              variant="outlined"
              color="primary"
              sx={{
                width: 300,
                minHeight: 48,
                justifyContent: "space-between",
                backgroundColor: "#131314",
                color: "#E3E3E3",
              }}
              disabled={loading}
              loading={loading}
              onClick={async () => {
                await AuthClient.signIn.social(
                  {
                    provider: "google",
                    callbackURL: "/dashboard",
                  },
                  {
                    onRequest: () => {
                      setLoading(true);
                    },
                    onResponse: () => {
                      setLoading(false);
                    },
                  }
                );
              }}
            >
              Mit Google anmelden
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
