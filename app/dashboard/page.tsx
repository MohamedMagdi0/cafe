"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Table, MenuItem, User } from "@/types";
import { getTranslation } from "@/lib/i18n";
import LanguageSwitcher, { useLocale } from "@/components/LanguageSwitcher";
import TableCard from "@/components/TableCard";
import OrderModal from "@/components/OrderModal";
import AnalyticsCard from "@/components/AnalyticsCard";

export default function DashboardPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = getTranslation(locale);
  const [user, setUser] = useState<User | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showAddTable, setShowAddTable] = useState(false);
  const [newTableLabel, setNewTableLabel] = useState("");
  const [analytics, setAnalytics] = useState({
    income: 0,
    outcome: 0,
    netProfit: 0,
  });
  const [period, setPeriod] = useState("today");
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
      setUser(data.user);
    } catch {
      router.push("/login");
    }
  };

  const loadData = async () => {
    try {
      const [tablesRes, menuRes, analyticsRes] = await Promise.all([
        fetch("/api/tables"),
        fetch("/api/menu"),
        fetch(`/api/transactions?period=${period}`),
      ]);

      const tablesData = await tablesRes.json();
      const menuData = await menuRes.json();
      const analyticsData = await analyticsRes.json();

      setTables(tablesData.tables || []);
      setMenu(menuData.menu || []);
      setAnalytics({
        income: analyticsData.income || 0,
        outcome: analyticsData.outcome || 0,
        netProfit: analyticsData.netProfit || 0,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handleAddTable = async () => {
    if (!newTableLabel.trim()) return;

    try {
      const res = await fetch("/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newTableLabel }),
      });

      const data = await res.json();
      if (res.ok) {
        setTables([...tables, data.table]);
        setNewTableLabel("");
        setShowAddTable(false);
      }
    } catch (error) {
      console.error("Error adding table:", error);
    }
  };

  const handleAddOrder = async (
    tableId: string,
    menuItemId: string,
    quantity: number
  ) => {
    try {
      const res = await fetch(`/api/tables/${tableId}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuItemId, quantity }),
      });

      const data = await res.json();
      if (res.ok) {
        setTables(tables.map((t) => (t.id === tableId ? data.table : t)));
        if (selectedTable?.id === tableId) {
          setSelectedTable(data.table);
        }
      }
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };

  const handleSettleItem = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/settle`, {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        // Update tables with the returned table data
        if (data.table) {
          setTables((prevTables) =>
            prevTables.map((t) => (t.id === data.table.id ? data.table : t))
          );
          // Update selected table if it matches
          if (selectedTable && selectedTable.id === data.table.id) {
            setSelectedTable(data.table);
          }
        }
        // Reload data to ensure consistency
        await loadData();
      }
    } catch (error) {
      console.error("Error settling item:", error);
    }
  };

  const handleSettleTable = async (tableId: string) => {
    try {
      const res = await fetch(`/api/tables/${tableId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settle: true }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update tables with the returned table data
        if (data.table) {
          setTables((prevTables) =>
            prevTables.map((t) => (t.id === data.table.id ? data.table : t))
          );
        }
        // Reload data to ensure consistency
        await loadData();
        setSelectedTable(null);
      }
    } catch (error) {
      console.error("Error settling table:", error);
    }
  };

  const handleReopen = async (tableId: string) => {
    try {
      const res = await fetch(`/api/tables/${tableId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reopen: true }),
      });

      if (res.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Error reopening table:", error);
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
              <h1 className="text-xl sm:text-2xl font-bold">{t.dashboard}</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {t.welcome}, {user.name} ({user.role})
              </p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <LanguageSwitcher />
              {user.role === "admin" && (
                <>
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
                    onClick={() => router.push("/admin")}
                    className="px-3 sm:px-4 py-2 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 whitespace-nowrap"
                  >
                    {t.analytics}
                  </button>
                </>
              )}
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 whitespace-nowrap"
              >
                {t.logout}
              </button>
            </div>
          </div>
        </header>

        {user.role === "admin" && (
          <div className="mb-6">
            <AnalyticsCard
              income={analytics.income}
              outcome={analytics.outcome}
              netProfit={analytics.netProfit}
              period={period}
            />
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
            <h2 className="text-lg sm:text-xl font-bold">{t.tables}</h2>
            <button
              onClick={() => setShowAddTable(!showAddTable)}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
            >
              {t.addTable}
            </button>
          </div>

          {showAddTable && (
            <div className="mb-4 p-4 border rounded-lg">
              <input
                type="text"
                value={newTableLabel}
                onChange={(e) => setNewTableLabel(e.target.value)}
                placeholder={t.tableLabel}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 mb-2"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddTable}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  {t.save}
                </button>
                <button
                  onClick={() => {
                    setShowAddTable(false);
                    setNewTableLabel("");
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          )}

          {tables.length === 0 ? (
            <p className="text-gray-500 text-center py-8">{t.noTables}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tables.map((table) => (
                <TableCard
                  key={table.id}
                  table={table}
                  onSelect={setSelectedTable}
                  onReopen={handleReopen}
                />
              ))}
            </div>
          )}
        </div>

        {selectedTable && (
          <OrderModal
            table={selectedTable}
            menu={menu}
            onClose={() => setSelectedTable(null)}
            onAddOrder={handleAddOrder}
            onSettleItem={handleSettleItem}
            onSettleTable={handleSettleTable}
          />
        )}
      </div>
    </div>
  );
}
