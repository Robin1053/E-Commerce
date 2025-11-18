"use client";

import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  Button,
  Divider,
  Alert,
  LinearProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AuthClient } from "@/lib/auth-client";
import { GoogleButton } from "./LoginButtons";

export default function SignUp() {
  // ------------------------
  // Form Input States
  // ------------------------
  const [birthday, setBirthday] = React.useState<Dayjs>(dayjs());
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [repeatPassword, setRepeatPassword] = React.useState("");

  // ------------------------
  // UI States
  // ------------------------
  const [showPassword, setShowPassword] = React.useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // ------------------------
  // Error Handling States
  // ------------------------
  const [errorMessage, setErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [nameError, setNameError] = React.useState(false);

  // ------------------------
  // Password visibility handlers
  // ------------------------
  const toggleShowPassword = () => setShowPassword((s) => !s);
  const toggleShowRepeatPassword = () => setShowRepeatPassword((s) => !s);
  const preventDefault = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  // ------------------------
  // Validation Helpers
  // ------------------------
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password: string) => password.length >= 8;

  // ------------------------
  // Email Sign-Up Handler
  // ------------------------
  const handleEmailSignUp = async (event: React.FormEvent) => {
    event.preventDefault();

    // Reset Errors
    setErrorMessage("");
    setEmailError(false);
    setPasswordError(false);
    setNameError(false);
    setLoading(true);

    // ------------------------
    // Client-side Validation
    // ------------------------
    if (!name || !email || !password || !repeatPassword) {
      setErrorMessage("Name, E-Mail oder Passwort fehlt");
      setNameError(!name);
      setEmailError(!email);
      setPasswordError(!password);
      setLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage("Bitte geben Sie eine gültige E-Mail-Adresse ein");
      setEmailError(true);
      setLoading(false);
      return;
    }

    if (!isValidPassword(password)) {
      setErrorMessage("Das Passwort muss mindestens 8 Zeichen lang sein");
      setPasswordError(true);
      setLoading(false);
      return;
    }

    if (password !== repeatPassword) {
      setErrorMessage("Passwörter stimmen nicht überein");
      setPasswordError(true);
      setLoading(false);
      return;
    }

    // ------------------------
    // Sign-Up via Better Auth
    // ------------------------
    try {
      const { data, error } = await AuthClient.signUp.email({
        name,
        email,
        password,
        Birthday: birthday.toDate(),
        callbackURL: "/",
      });

      if (error) {
        switch (error.code) {
          case "invalid_email":
            setEmailError(true);
            setErrorMessage("Die E-Mail-Adresse ist ungültig");
            break;
          case "weak_password":
            setPasswordError(true);
            setErrorMessage("Das Passwort ist zu schwach");
            break;
          case "too_many_requests":
            setErrorMessage(
              "Zu viele Registrierungsversuche. Bitte später erneut versuchen"
            );
            break;
          default:
            setErrorMessage("Unbekannter Fehler: " + error.message);
        }
        console.error("Better Auth Fehler:", error);
        return;
      }

      console.log("Registrierung erfolgreich:", data);
    } catch (err) {
      console.error("Unerwarteter Fehler:", err);
      setErrorMessage("Ein unerwarteter Fehler ist aufgetreten: " + String(err));
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // JSX Rendering
  // ------------------------
  return (
    <>
      <Card
        sx={{
          maxWidth: 600,
          mx: "auto",
          mt: 8,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CardHeader title="Bitte registrieren Sie sich" />
        </Box>

        <CardContent
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="form"
            onSubmit={handleEmailSignUp}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            {errorMessage && (
              <Alert
                variant="outlined"
                severity="error"
                sx={{ width: 300, minHeight: 48 }}
              >
                {errorMessage}
              </Alert>
            )}

            {/* Name */}
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Max Mustermann"
              variant="standard"
              required
              error={nameError}
              sx={{ width: 300 }}
            />

            {/* Email */}
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Max@Mustermann.de"
              variant="standard"
              required
              error={emailError}
              helperText={emailError ? "Ungültige E-Mail-Adresse" : ""}
              sx={{ width: 300 }}
            />

            {/* Passwort */}
            <FormControl variant="standard" required sx={{ width: 300 }}>
              <InputLabel htmlFor="password">Passwort</InputLabel>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? "Passwort ausblenden" : "Passwort anzeigen"
                      }
                      onClick={toggleShowPassword}
                      onMouseDown={preventDefault}
                      onMouseUp={preventDefault}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            {/* Passwort wiederholen */}
            <FormControl variant="standard" required sx={{ width: 300 }}>
              <InputLabel htmlFor="repeat-password">Passwort wiederholen</InputLabel>
              <Input
                id="repeat-password"
                type={showRepeatPassword ? "text" : "password"}
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                error={passwordError}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showRepeatPassword
                          ? "Passwort ausblenden"
                          : "Passwort anzeigen"
                      }
                      onClick={toggleShowRepeatPassword}
                      onMouseDown={preventDefault}
                      onMouseUp={preventDefault}
                    >
                      {showRepeatPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            {/* Geburtstag */}
            <DatePicker
              disableFuture
              value={birthday}
              onChange={(newValue) => setBirthday(newValue || dayjs())}
              label="Geburtsdatum"
              sx={{ width: 300, height: 48 }}
            />

            {/* Buttons */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, width: 300 }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{
                  flexGrow: 1,
                  minHeight: 48,
                  "@media (max-width: 600px)": { width: "100%" },
                }}
                disabled={loading}
              >
                Registrieren
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                href="/auth/signin"
                sx={{
                  flexGrow: 1,
                  minHeight: 48,
                  "@media (max-width: 600px)": { width: "100%" },
                }}
                disabled={loading}
              >
                Anmelden
              </Button>
            </Box>
          </Box>

          {/* Ladebalken & Divider */}
          {loading && <LinearProgress sx={{ width: 300, my: 3 }} />}
          {!loading && <Divider sx={{ my: 3, width: 300 }}>Oder registrieren mit</Divider>}

          {/* Google Button */}
          <GoogleButton width={300} />
        </CardContent>
      </Card>
    </>
  );
}
