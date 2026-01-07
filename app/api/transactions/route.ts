import { NextRequest, NextResponse } from "next/server";
import { readTransactions, writeTransactions } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import type { Transaction } from "@/types";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  parseISO,
} from "date-fns";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "today";

  const transactions = readTransactions();
  const now = new Date();
  let startDate: Date;
  let endDate: Date = endOfDay(now);

  switch (period) {
    case "today":
      startDate = startOfDay(now);
      break;
    case "week":
      startDate = startOfWeek(now);
      endDate = endOfWeek(now);
      break;
    case "month":
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
      break;
    default:
      startDate = startOfDay(now);
  }

  const filtered = transactions.filter((t) => {
    const date = parseISO(t.createdAt);
    return date >= startDate && date <= endDate;
  });

  const income = filtered
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const outcome = filtered
    .filter((t) => t.type === "outcome")
    .reduce((sum, t) => sum + t.amount, 0);

  return NextResponse.json({
    transactions: filtered,
    income,
    outcome,
    netProfit: income - outcome,
    period,
  });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { type, amount, description } = await request.json();

  const transactions = readTransactions();
  const newTransaction: Transaction = {
    id: uuidv4(),
    type,
    amount,
    description,
    userId: user.id,
    createdAt: new Date().toISOString(),
  };

  transactions.push(newTransaction);
  writeTransactions(transactions);

  return NextResponse.json({ transaction: newTransaction });
}
