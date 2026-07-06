import { AUTH_CREDENTIALS, AUTH_SESSION_KEY } from "../constants/auth";

export function isAuthenticated() {
  return sessionStorage.getItem(AUTH_SESSION_KEY) === "true";
}

export function login(username, password) {
  const valid =
    username.trim().toLowerCase() === AUTH_CREDENTIALS.username &&
    password === AUTH_CREDENTIALS.password;

  if (valid) {
    sessionStorage.setItem(AUTH_SESSION_KEY, "true");
  }

  return valid;
}

export function logout() {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
}
