import { NextRequest, NextResponse } from "next/server";
import { readTables, writeTables, findTableById } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import type { Table } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tables = readTables();
  return NextResponse.json({ tables });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { label } = await request.json();
  const tables = readTables();

  const newTable: Table = {
    id: uuidv4(),
    label,
    orders: [],
    isSettled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tables.push(newTable);
  writeTables(tables);

  return NextResponse.json({ table: newTable });
}
