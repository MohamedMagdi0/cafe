import fs from "fs";
import path from "path";
import type { User, Table, MenuItem, Transaction } from "@/types";

// Use /tmp in serverless environments, otherwise use project data directory
const isVercel = process.env.VERCEL === "1";
const DATA_DIR = isVercel ? "/tmp/data" : path.join(process.cwd(), "data");

const USERS_FILE = path.join(DATA_DIR, "users.json");
const TABLES_FILE = path.join(DATA_DIR, "tables.json");
const MENU_FILE = path.join(DATA_DIR, "menu.json");
const TRANSACTIONS_FILE = path.join(DATA_DIR, "transactions.json");

// Ensure data directory exists
function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (error) {
    console.error("Error creating data directory:", error);
  }
}

// Initialize files if they don't exist
function initFile(filePath: string, defaultValue: unknown) {
  try {
    ensureDataDir();
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
    }
  } catch (error) {
    console.error(`Error initializing file ${filePath}:`, error);
  }
}

// Lazy initialization - only initialize when needed
function initializeDefaults() {
  const defaultUsers = [
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
  ];

  const defaultMenu = [
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
  ];

  try {
    initFile(USERS_FILE, defaultUsers);
    initFile(TABLES_FILE, []);
    initFile(MENU_FILE, defaultMenu);
    initFile(TRANSACTIONS_FILE, []);
  } catch (error) {
    console.error("Error initializing default files:", error);
  }
}

// Read functions with error handling
export function readUsers(): User[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(USERS_FILE)) {
      initializeDefaults();
    }
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading users:", error);
    // Return default users if file doesn't exist
    return [
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
    ];
  }
}

export function readTables(): Table[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(TABLES_FILE)) {
      initFile(TABLES_FILE, []);
      return [];
    }
    const data = fs.readFileSync(TABLES_FILE, "utf-8");
    if (!data || data.trim() === "") {
      return [];
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading tables:", error);
    return [];
  }
}

export function readMenu(): MenuItem[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(MENU_FILE)) {
      initializeDefaults();
    }
    const data = fs.readFileSync(MENU_FILE, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading menu:", error);
    // Return default menu if file doesn't exist
    return [
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
    ];
  }
}

export function readTransactions(): Transaction[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(TRANSACTIONS_FILE)) {
      initFile(TRANSACTIONS_FILE, []);
      return [];
    }
    const data = fs.readFileSync(TRANSACTIONS_FILE, "utf-8");
    if (!data || data.trim() === "") {
      return [];
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading transactions:", error);
    return [];
  }
}

// Write functions with error handling
export function writeUsers(users: User[]) {
  try {
    ensureDataDir();
    const data = JSON.stringify(users, null, 2);
    fs.writeFileSync(USERS_FILE, data, "utf-8");
    // Verify write succeeded
    if (!fs.existsSync(USERS_FILE)) {
      throw new Error("File write verification failed");
    }
  } catch (error) {
    console.error("Error writing users:", error);
    throw error;
  }
}

export function writeTables(tables: Table[]) {
  try {
    ensureDataDir();
    const data = JSON.stringify(tables, null, 2);
    fs.writeFileSync(TABLES_FILE, data, "utf-8");
    // Verify write succeeded
    if (!fs.existsSync(TABLES_FILE)) {
      throw new Error("File write verification failed");
    }
  } catch (error) {
    console.error("Error writing tables:", error);
    throw error;
  }
}

export function writeMenu(menu: MenuItem[]) {
  try {
    ensureDataDir();
    const data = JSON.stringify(menu, null, 2);
    fs.writeFileSync(MENU_FILE, data, "utf-8");
    // Verify write succeeded
    if (!fs.existsSync(MENU_FILE)) {
      throw new Error("File write verification failed");
    }
  } catch (error) {
    console.error("Error writing menu:", error);
    throw error;
  }
}

export function writeTransactions(transactions: Transaction[]) {
  try {
    ensureDataDir();
    const data = JSON.stringify(transactions, null, 2);
    fs.writeFileSync(TRANSACTIONS_FILE, data, "utf-8");
    // Verify write succeeded
    if (!fs.existsSync(TRANSACTIONS_FILE)) {
      throw new Error("File write verification failed");
    }
  } catch (error) {
    console.error("Error writing transactions:", error);
    throw error;
  }
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
