import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { User, Table, MenuItem, Transaction } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const TABLES_FILE = path.join(DATA_DIR, "tables.json");
const MENU_FILE = path.join(DATA_DIR, "menu.json");
const TRANSACTIONS_FILE = path.join(DATA_DIR, "transactions.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize files if they don't exist
function initFile(filePath: string, defaultValue: any) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
  }
}

initFile(USERS_FILE, [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "Admin",
  },
  {
    id: "2",
    username: "waiter1",
    password: "waiter123",
    role: "waiter",
    name: "Waiter 1",
  },
]);

initFile(TABLES_FILE, []);
initFile(MENU_FILE, [
  {
    id: "1",
    nameEn: "Turkish Coffee",
    nameAr: "قهوة تركية",
    price: 15,
    category: "coffee",
  },
  {
    id: "2",
    nameEn: "Espresso",
    nameAr: "إسبريسو",
    price: 12,
    category: "coffee",
  },
  {
    id: "3",
    nameEn: "Black Tea",
    nameAr: "شاي أسود",
    price: 8,
    category: "tea",
  },
  {
    id: "4",
    nameEn: "Green Tea",
    nameAr: "شاي أخضر",
    price: 8,
    category: "tea",
  },
  {
    id: "5",
    nameEn: "Shisha (Single)",
    nameAr: "شيشة (واحدة)",
    price: 50,
    category: "shisha",
  },
  {
    id: "6",
    nameEn: "Shisha (Double)",
    nameAr: "شيشة (مزدوجة)",
    price: 80,
    category: "shisha",
  },
]);
initFile(TRANSACTIONS_FILE, []);

// Read functions
export function readUsers(): User[] {
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
}

export function readTables(): Table[] {
  return JSON.parse(fs.readFileSync(TABLES_FILE, "utf-8"));
}

export function readMenu(): MenuItem[] {
  return JSON.parse(fs.readFileSync(MENU_FILE, "utf-8"));
}

export function readTransactions(): Transaction[] {
  return JSON.parse(fs.readFileSync(TRANSACTIONS_FILE, "utf-8"));
}

// Write functions
export function writeUsers(users: User[]) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export function writeTables(tables: Table[]) {
  fs.writeFileSync(TABLES_FILE, JSON.stringify(tables, null, 2));
}

export function writeMenu(menu: MenuItem[]) {
  fs.writeFileSync(MENU_FILE, JSON.stringify(menu, null, 2));
}

export function writeTransactions(transactions: Transaction[]) {
  fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2));
}

// Helper functions
export function findUserByUsername(username: string): User | undefined {
  return readUsers().find((u) => u.username === username);
}

export function findTableById(id: string): Table | undefined {
  return readTables().find((t) => t.id === id);
}

export function findMenuItemById(id: string): MenuItem | undefined {
  return readMenu().find((m) => m.id === id);
}
