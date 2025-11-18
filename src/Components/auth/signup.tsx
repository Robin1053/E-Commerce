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
  Typography,
  Avatar,
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
  const [profilePic, setProfilePic] = React.useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = React.useState<string>('')

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
  const isValidEmail = (email: string) => {
    // Erweiterter Regex für bessere E-Mail-Validierung
    // Erlaubt: Buchstaben, Zahlen, Punkte, Unterstriche, Plus, Minus im lokalen Teil
    // Erlaubt: Subdomains und internationale Domains
    const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  };

  const isValidPassword = (password: string) => password.length >= 8;

  //------------------------
  // Profile Image Upload Handler
  //------------------------
  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validiere Dateityp
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage('Nur JPEG, PNG und WebP Dateien sind erlaubt');
        return;
      }

      // Validiere Dateigröße (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setErrorMessage('Datei ist zu groß (max 5MB)');
        return;
      }

      setProfilePic(file);

      // Erstelle Preview
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setErrorMessage(''); // Lösche vorherige Fehler
    }
  };

  const uploadProfilePic = async (userId: string): Promise<string | null> => {
    if (!profilePic) return null;

    const formData = new FormData();
    formData.append('profilePic', profilePic);
    formData.append('userId', userId);

    try {
      const response = await fetch('/api/auth/profile-pics', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.imagePath;
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Fehler beim Upload des Profilbildes');
        return null;
      }
    } catch (error) {
      console.error('Fehler beim Upload:', error);
      setErrorMessage('Fehler beim Upload des Profilbildes');
      return null;
    }
  };



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

      // Wenn ein Profilbild ausgewählt wurde, lade es hoch
      if (profilePic && data?.user?.id) {
        console.log("Uploading profile picture...");
        const imagePath = await uploadProfilePic(data.user.id);
        if (imagePath) {
          console.log("Profile picture uploaded successfully:", imagePath);

          // Aktualisiere das Profilbild in der Datenbank
          try {
            const updateResponse = await fetch('/api/auth/update-profile-pic', {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: data.user.id,
                imagePath: imagePath,
              }),
            });

            if (updateResponse.ok) {
              console.log("Profile picture updated in database successfully");
            } else {
              console.error("Failed to update profile picture in database");
            }
          } catch (updateError) {
            console.error("Error updating profile picture in database:", updateError);
          }
        }
      }

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
              noValidate
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
                type="email"
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
              {/* Profilbild Upload */}
              <Box sx={
                {
                  width: 300,
                  textAlign: 'center',
                  mt: 2
                }
              }>
                <Typography
                  variant="body2"
                  sx={
                    {
                      mb: 1
                    }
                  }>
                  Profilbild (optional)
                </Typography>

                {profilePicPreview && (
                  <Avatar
                    src={profilePicPreview}
                    sx={
                      {
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 2
                      }
                    }
                  />
                )}

                <Button
                  variant="outlined"
                  component="label"
                  sx={
                    { width: '100%' }
                  }
                  disabled={loading}
                  loading={loading}
                >
                  {profilePic ? 'Bild ändern' : 'Bild auswählen'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleProfilePicChange}
                  />
                </Button>

                {profilePic && (
                  <Typography
                    variant="caption"
                    sx={
                      {
                        display: 'block',
                        mt: 1
                      }
                    }>
                    {profilePic.name}
                  </Typography>
                )}
              </Box>
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
