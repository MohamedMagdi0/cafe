import { NextRequest, NextResponse } from "next/server";
import {
  readTables,
  writeTables,
  findTableById,
  findMenuItemById,
} from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import type { OrderItem } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { menuItemId, quantity } = await request.json();

  const tables = readTables();
  const tableIndex = tables.findIndex((t) => t.id === id);

  if (tableIndex === -1) {
    return NextResponse.json({ error: "Table not found" }, { status: 404 });
  }

  if (tables[tableIndex].isSettled) {
    return NextResponse.json({ error: "Table is settled" }, { status: 400 });
  }

  const menuItem = findMenuItemById(menuItemId);
  if (!menuItem) {
    return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
  }

  const newOrder: OrderItem = {
    id: uuidv4(),
    menuItemId,
    quantity,
    price: menuItem.price,
    settled: false,
  };

  tables[tableIndex].orders.push(newOrder);
  tables[tableIndex].updatedAt = new Date().toISOString();
  writeTables(tables);

  return NextResponse.json({ order: newOrder, table: tables[tableIndex] });
}
