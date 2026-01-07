import { NextRequest, NextResponse } from "next/server";
import {
  readTables,
  writeTables,
  findTableById,
  findMenuItemById,
} from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import type { OrderItem, Transaction } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const table = findTableById(id);

  if (!table) {
    return NextResponse.json({ error: "Table not found" }, { status: 404 });
  }

  return NextResponse.json({ table });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const tables = readTables();
  const tableIndex = tables.findIndex((t) => t.id === id);

  if (tableIndex === -1) {
    return NextResponse.json({ error: "Table not found" }, { status: 404 });
  }

  const body = await request.json();

  // Update table label
  if (body.label !== undefined) {
    tables[tableIndex].label = body.label;
  }

  // Reopen table
  if (body.reopen === true) {
    tables[tableIndex].isSettled = false;
    tables[tableIndex].settledAt = undefined;
    tables[tableIndex].orders = [];
    tables[tableIndex].updatedAt = new Date().toISOString();
  }

  // Settle entire table
  if (body.settle === true) {
    tables[tableIndex].isSettled = true;
    tables[tableIndex].settledAt = new Date().toISOString();
    tables[tableIndex].orders.forEach((order) => {
      if (!order.settled) {
        order.settled = true;
        order.settledAt = new Date().toISOString();
      }
    });
    tables[tableIndex].updatedAt = new Date().toISOString();

    // Create income transaction
    const total = tables[tableIndex].orders.reduce(
      (sum, order) => sum + order.price * order.quantity,
      0
    );

    if (total > 0) {
      const { readTransactions, writeTransactions } = await import("@/lib/db");
      const transactions = readTransactions();
      const newTransaction: Transaction = {
        id: uuidv4(),
        type: "income",
        amount: total,
        description: `Table ${tables[tableIndex].label} settlement`,
        tableId: id,
        userId: user.id,
        createdAt: new Date().toISOString(),
      };
      transactions.push(newTransaction);
      writeTransactions(transactions);
    }
  }

  writeTables(tables);
  return NextResponse.json({ table: tables[tableIndex] });
}
