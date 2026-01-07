import { cookies } from "next/headers";
import { findUserByUsername } from "./db";
import type { User } from "@/types";

export async function login(
  username: string,
  password: string
): Promise<User | null> {
  const user = findUserByUsername(username);
  if (user && user.password === password) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  return null;
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");
  if (!userCookie) return null;

  try {
    return JSON.parse(userCookie.value);
  } catch {
    return null;
  }
}

export async function setUserSession(user: User) {
  const cookieStore = await cookies();
  cookieStore.set("user", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("user");
}
