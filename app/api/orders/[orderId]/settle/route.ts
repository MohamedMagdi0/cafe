import { NextRequest, NextResponse } from "next/server";
import {
  readTables,
  writeTables,
  readTransactions,
  writeTransactions,
} from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import type { Transaction } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;
  const tables = readTables();

  let found = false;
  let updatedTable = null;

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    const orderIndex = table.orders.findIndex((o) => o.id === orderId);
    if (orderIndex !== -1) {
      const order = table.orders[orderIndex];
      if (!order.settled) {
        // Update the order
        table.orders[orderIndex] = {
          ...order,
          settled: true,
          settledAt: new Date().toISOString(),
        };
        table.updatedAt = new Date().toISOString();

        // Create income transaction
        const transactions = readTransactions();
        const newTransaction: Transaction = {
          id: uuidv4(),
          type: "income",
          amount: order.price * order.quantity,
          description: `Order settlement - Table ${table.label}`,
          tableId: table.id,
          userId: user.id,
          createdAt: new Date().toISOString(),
        };
        transactions.push(newTransaction);
        writeTransactions(transactions);

        updatedTable = table;
        found = true;
        break;
      } else {
        // Order already settled, return the table anyway
        updatedTable = table;
        found = true;
        break;
      }
    }
  }

  if (!found) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Write the updated tables
  writeTables(tables);

  return NextResponse.json({
    success: true,
    table: updatedTable,
    orderId,
  });
}
