export const API_BASE = "http://localhost:3001/api";
import { User } from "@/types";

export const login = async (
  email: string,
  password: string,
): Promise<{ token: string, user: User }> => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("Invalid credentials.");
  return response.json();
};

export const register = async (
  email: string,
  password: string,
): Promise<void> => {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("Failed to register.");
};
