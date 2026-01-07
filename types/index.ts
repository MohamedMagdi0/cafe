export type UserRole = "admin" | "waiter";

export interface User {
  id: string;
  username: string;
  password: string; // In production, this should be hashed
  role: UserRole;
  name: string;
}

export interface MenuItem {
  id: string;
  nameEn: string;
  nameAr: string;
  price: number;
  category: "tea" | "coffee" | "shisha" | "food" | "other";
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  price: number;
  settled: boolean;
  settledAt?: string;
}

export interface Table {
  id: string;
  label: string;
  orders: OrderItem[];
  isSettled: boolean;
  settledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  type: "income" | "outcome";
  amount: number;
  description: string;
  tableId?: string;
  userId: string;
  createdAt: string;
}

export interface DailyStats {
  date: string;
  income: number;
  outcome: number;
  netProfit: number;
}
