import { NextRequest, NextResponse } from "next/server";
import { login, setUserSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    const user = await login(username, password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    await setUserSession(user);
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
