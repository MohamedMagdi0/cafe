import { NextRequest, NextResponse } from "next/server";
import { readMenu, writeMenu } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import type { MenuItem } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const menu = readMenu();
  return NextResponse.json({ menu });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { nameEn, nameAr, price, category } = await request.json();
  const menu = readMenu();

  const newItem: MenuItem = {
    id: uuidv4(),
    nameEn,
    nameAr,
    price,
    category,
  };

  menu.push(newItem);
  writeMenu(menu);

  return NextResponse.json({ item: newItem });
}
