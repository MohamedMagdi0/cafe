"use client";

import { useState } from "react";
import type { Table } from "@/types";
import { getTranslation } from "@/lib/i18n";
import { useLocale } from "./LanguageSwitcher";

interface TableCardProps {
  table: Table;
  onSelect: (table: Table) => void;
  onReopen: (tableId: string) => void;
}

export default function TableCard({
  table,
  onSelect,
  onReopen,
}: TableCardProps) {
  const locale = useLocale();
  const t = getTranslation(locale);
  const total = table.orders.reduce(
    (sum, order) => sum + order.price * order.quantity,
    0
  );
  const activeOrders = table.orders.filter((o) => !o.settled).length;

  return (
    <div
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        table.isSettled
          ? "border-gray-300 bg-gray-100 dark:bg-gray-800"
          : "border-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:shadow-lg"
      }`}
      onClick={() => !table.isSettled && onSelect(table)}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="flex justify-between items-start mb-2 gap-2">
        <h3 className="text-lg sm:text-xl font-bold truncate flex-1">
          {table.label}
        </h3>
        <span
          className={`px-2 py-1 rounded text-xs sm:text-sm whitespace-nowrap ${
            table.isSettled
              ? "bg-gray-300 dark:bg-gray-700"
              : "bg-green-500 text-white"
          }`}
        >
          {table.isSettled ? t.closed : t.active}
        </span>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <div>
          {t.items}: {table.orders.length}
        </div>
        <div>
          {t.total}: {total.toFixed(2)}
        </div>
        {activeOrders > 0 && (
          <div className="text-orange-600 dark:text-orange-400 font-semibold">
            {activeOrders} {t.active} {t.orders.toLowerCase()}
          </div>
        )}
      </div>
      {table.isSettled && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReopen(table.id);
          }}
          className="mt-2 w-full px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {t.reopen}
        </button>
      )}
    </div>
  );
}
