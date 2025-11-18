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
  Badge,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AuthClient } from "@/lib/auth-client";
import { GoogleButton, PasskeyButton } from "./LoginButtons";


export default function SignIn() {
  // State variables
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  // Error handling states
  const [errorMessage, setErrorMessage] = useState("");
  const [EmailError, setEmailError] = useState(false);
  const [PasswordError, setPasswordError] = useState(false)

  // Form input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);


  // ------------------------
  // Password visibility handlers
  // ------------------------
  //  
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


  // Determine last used login methods
  const wasGoogle = AuthClient.isLastUsedLoginMethod("google")
  const wasEmail = AuthClient.isLastUsedLoginMethod("email")
  const wasPasskey = AuthClient.isLastUsedLoginMethod("passkey")
  //const wasGitHub = AuthClient.isLastUsedLoginMethod("github")

  // ------------------------
  // Validation Helpers
  // ------------------------

  function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPassword(password: string): boolean {
    return password.length >= 8;
  }

  // ------------------------
  // Email Sign-In Handler
  // ------------------------

  const handleEmailSignIn = async (event: React.FormEvent) => {
    event.preventDefault();

    // Fehler zurücksetzen
    setErrorMessage("");
    setEmailError(false);
    setPasswordError(false);
    setLoading(true);

    // Clientseitige Prüfung
    if (!email || !password) {
      setErrorMessage("E-Mail oder Passwort fehlt.");
      setEmailError(!email);
      setPasswordError(!password);
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      setEmailError(true);
      return;
    }

    if (!isValidPassword(password)) {
      setErrorMessage("Das Passwort muss mindestens 8 Zeichen lang sein.");
      setPasswordError(true);
      return;
    }


    // Anmeldung via Better Auth
    try {
      const { data, error } = await AuthClient.signIn.email({
        email,
        password,
        rememberMe,
        callbackURL: "/dashboard",
      });

      if (error) {
        switch (error.code) {
          case "invalid_email":
            setEmailError(true);
            setErrorMessage("Diese E-Mail-Adresse ist ungültig.");
            break;

          case "invalid_password":
            setPasswordError(true);
            setErrorMessage("Falsches Passwort.");
            break;

          case "user_not_found":
            setEmailError(true);
            setErrorMessage("Es wurde kein Benutzer mit dieser E-Mail gefunden.");
            break;

          case "too_many_requests":
            setErrorMessage(
              "Zu viele Anmeldeversuche. Bitte versuchen Sie es später erneut."
            );
            break;

          default:
            setErrorMessage("Unbekannter Fehler: " + error.message);
        }

        console.error("Better Auth Fehler:", error);
        return;
      }

      console.log("Anmeldung erfolgreich:", data);
    } catch (err) {
      console.error("Unerwarteter Fehler:", err);
      setErrorMessage("Ein unerwarteter Fehler ist aufgetreten: " + String(err));
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // JSX Rendering
  // -------------------------

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
        <CardHeader title="PLease sign in" />
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
                mb: 2,
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
              label="Max@Musterman.com"
              variant="standard"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              error={EmailError}
              autoComplete="on"
            />
            <FormControl fullWidth variant="standard">
              <InputLabel htmlFor="password">Passwort</InputLabel>
              <Input
                value={password}
                id="password"
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="on"
                error={PasswordError}
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

              <Badge
                color="secondary"
                badgeContent="Last used"
                invisible={!wasEmail}
              >
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  loading={loading}
                  sx={{
                    flexGrow: 1,
                    minHeight: "48px",
                    width: "48%"
                  }}
                >
                  Anmelden
                </Button>
              </Badge>
              <Button
                variant="outlined"
                color="secondary"
                href="/auth/signup"
                sx={{
                  flexGrow: 1,
                  minHeight: "48px",
                  width: "48%"
                }}
              >
                Registrieren
              </Button>
            </Box>
          </Box>

          {!loading && <Divider sx={{ my: 3, width: 300 }}>Oder melden Sie sich an mit</Divider>}
          {loading && <LinearProgress sx={{ width: 300, my: 3 }} />}

          <Box
            sx={{
              gap: 2,
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Badge
              color="secondary"
              badgeContent="Last used"
              invisible={!wasPasskey}
            >
              <PasskeyButton width={300} />
            </Badge>
            <Badge
              color="secondary"
              badgeContent="Last used"
              invisible={!wasGoogle}
            >
              <GoogleButton width={300} />
            </Badge>
            {/* <Badge
              color="secondary"
              badgeContent="Last used"
              invisible={!wasGitHub}
            >
              <GitHubButton width={300}/>
            </Badge> */}
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
