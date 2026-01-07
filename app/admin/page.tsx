"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { MenuItem, User, Transaction } from "@/types";
import { getTranslation } from "@/lib/i18n";
import LanguageSwitcher, { useLocale } from "@/components/LanguageSwitcher";
import AnalyticsCard from "@/components/AnalyticsCard";

export default function AdminPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = getTranslation(locale);
  const [user, setUser] = useState<User | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddOutcome, setShowAddOutcome] = useState(false);
  const [newItem, setNewItem] = useState({
    nameEn: "",
    nameAr: "",
    price: 0,
    category: "coffee",
  });
  const [newOutcome, setNewOutcome] = useState({ amount: 0, description: "" });
  const [period, setPeriod] = useState("today");
  const [analytics, setAnalytics] = useState({
    income: 0,
    outcome: 0,
    netProfit: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, period]);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (data.user.role !== "admin") {
        router.push("/dashboard");
        return;
      }
      setUser(data.user);
    } catch {
      router.push("/login");
    }
  };

  const loadData = async () => {
    try {
      const [menuRes, transactionsRes] = await Promise.all([
        fetch("/api/menu"),
        fetch(`/api/transactions?period=${period}`),
      ]);

      const menuData = await menuRes.json();
      const transactionsData = await transactionsRes.json();

      setMenu(menuData.menu || []);
      setTransactions(transactionsData.transactions || []);
      setAnalytics({
        income: transactionsData.income || 0,
        outcome: transactionsData.outcome || 0,
        netProfit: transactionsData.netProfit || 0,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  };

  const handleAddMenuItem = async () => {
    if (!newItem.nameEn || !newItem.nameAr || newItem.price <= 0) return;

    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      const data = await res.json();
      if (res.ok) {
        setMenu([...menu, data.item]);
        setNewItem({ nameEn: "", nameAr: "", price: 0, category: "coffee" });
        setShowAddItem(false);
      }
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
  };

  const handleAddOutcome = async () => {
    if (!newOutcome.description || newOutcome.amount <= 0) return;

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "outcome",
          amount: newOutcome.amount,
          description: newOutcome.description,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        await loadData();
        setNewOutcome({ amount: 0, description: "" });
        setShowAddOutcome(false);
      }
    } catch (error) {
      console.error("Error adding outcome:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto">
        <header className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{t.analytics}</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {user.name}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <LanguageSwitcher />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="today">{t.today}</option>
                <option value="week">{t.thisWeek}</option>
                <option value="month">{t.thisMonth}</option>
              </select>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-3 sm:px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 whitespace-nowrap"
              >
                {t.dashboard}
              </button>
            </div>
          </div>
        </header>

        <AnalyticsCard
          income={analytics.income}
          outcome={analytics.outcome}
          netProfit={analytics.netProfit}
          period={period}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
              <h2 className="text-lg sm:text-xl font-bold">{t.menu}</h2>
              <button
                onClick={() => setShowAddItem(!showAddItem)}
                className="w-full sm:w-auto px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {t.addMenuItem}
              </button>
            </div>

            {showAddItem && (
              <div className="mb-4 p-4 border rounded-lg space-y-3">
                <input
                  type="text"
                  placeholder={
                    locale === "ar" ? "الاسم بالإنجليزية" : "Name (English)"
                  }
                  value={newItem.nameEn}
                  onChange={(e) =>
                    setNewItem({ ...newItem, nameEn: e.target.value })
                  }
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                  type="text"
                  placeholder={
                    locale === "ar" ? "الاسم بالعربية" : "Name (Arabic)"
                  }
                  value={newItem.nameAr}
                  onChange={(e) =>
                    setNewItem({ ...newItem, nameAr: e.target.value })
                  }
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                  type="number"
                  placeholder={t.price}
                  value={newItem.price || ""}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <select
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value as any })
                  }
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="coffee">
                    {locale === "ar" ? "قهوة" : "Coffee"}
                  </option>
                  <option value="tea">{locale === "ar" ? "شاي" : "Tea"}</option>
                  <option value="shisha">
                    {locale === "ar" ? "شيشة" : "Shisha"}
                  </option>
                  <option value="food">
                    {locale === "ar" ? "طعام" : "Food"}
                  </option>
                  <option value="other">
                    {locale === "ar" ? "أخرى" : "Other"}
                  </option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddMenuItem}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    {t.save}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddItem(false);
                      setNewItem({
                        nameEn: "",
                        nameAr: "",
                        price: 0,
                        category: "coffee",
                      });
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {menu.map((item) => (
                <div
                  key={item.id}
                  className="p-3 border rounded flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">
                      {locale === "ar" ? item.nameAr : item.nameEn}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {item.price} - {item.category}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
              <h2 className="text-lg sm:text-xl font-bold">{t.outcome}</h2>
              <button
                onClick={() => setShowAddOutcome(!showAddOutcome)}
                className="w-full sm:w-auto px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                {t.addOutcome}
              </button>
            </div>

            {showAddOutcome && (
              <div className="mb-4 p-4 border rounded-lg space-y-3">
                <input
                  type="text"
                  placeholder={t.description}
                  value={newOutcome.description}
                  onChange={(e) =>
                    setNewOutcome({
                      ...newOutcome,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                  type="number"
                  placeholder={t.amount}
                  value={newOutcome.amount || ""}
                  onChange={(e) =>
                    setNewOutcome({
                      ...newOutcome,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddOutcome}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    {t.save}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddOutcome(false);
                      setNewOutcome({ amount: 0, description: "" });
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {transactions
                .filter((t) => t.type === "outcome")
                .map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-3 border rounded flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-red-600 dark:text-red-400 font-bold">
                      -{transaction.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
