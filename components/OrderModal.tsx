"use client";

import { useState, useEffect } from "react";
import type { Table, MenuItem, OrderItem } from "@/types";
import { getTranslation } from "@/lib/i18n";
import { useLocale } from "./LanguageSwitcher";

interface OrderModalProps {
  table: Table | null;
  menu: MenuItem[];
  onClose: () => void;
  onAddOrder: (tableId: string, menuItemId: string, quantity: number) => void;
  onSettleItem: (orderId: string) => void;
  onSettleTable: (tableId: string) => void;
}

export default function OrderModal({
  table,
  menu,
  onClose,
  onAddOrder,
  onSettleItem,
  onSettleTable,
}: OrderModalProps) {
  const locale = useLocale();
  const t = getTranslation(locale);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);

  if (!table) return null;

  const total = table.orders.reduce(
    (sum, order) => sum + order.price * order.quantity,
    0
  );
  const unsettledTotal = table.orders
    .filter((o) => !o.settled)
    .reduce((sum, order) => sum + order.price * order.quantity, 0);

  const getMenuItem = (menuItemId: string) => {
    return menu.find((m) => m.id === menuItemId);
  };

  const handleAddOrder = () => {
    if (selectedItem && quantity > 0) {
      onAddOrder(table.id, selectedItem, quantity);
      setSelectedItem("");
      setQuantity(1);
      setShowAddForm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold">{table.label}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-3xl sm:text-2xl leading-none p-1"
            >
              ×
            </button>
          </div>

          {!table.isSettled && (
            <div className="mb-4">
              {!showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  {t.addOrder}
                </button>
              ) : (
                <div className="border p-4 rounded-lg space-y-3">
                  <select
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="">
                      {locale === "ar" ? "اختر العنصر" : "Select Item"}
                    </option>
                    {menu.map((item) => (
                      <option key={item.id} value={item.id}>
                        {locale === "ar" ? item.nameAr : item.nameEn} -{" "}
                        {item.price}
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(parseInt(e.target.value) || 1)
                      }
                      className="w-full sm:flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddOrder}
                        className="flex-1 sm:flex-none px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                      >
                        {t.addOrder}
                      </button>
                      <button
                        onClick={() => {
                          setShowAddForm(false);
                          setSelectedItem("");
                          setQuantity(1);
                        }}
                        className="flex-1 sm:flex-none px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                      >
                        {t.cancel}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2 mb-4">
            <h3 className="font-semibold text-lg">{t.orders}</h3>
            {table.orders.length === 0 ? (
              <p className="text-gray-500">{t.noOrders}</p>
            ) : (
              table.orders.map((order) => {
                const menuItem = getMenuItem(order.menuItemId);
                const isSettled = order.settled;
                return (
                  <div
                    key={order.id}
                    className={`p-3 border rounded flex justify-between items-center ${
                      isSettled
                        ? "bg-gray-100 dark:bg-gray-700 line-through opacity-60"
                        : "bg-white dark:bg-gray-800"
                    }`}
                  >
                    <div>
                      <div className="font-medium">
                        {menuItem
                          ? locale === "ar"
                            ? menuItem.nameAr
                            : menuItem.nameEn
                          : "Unknown"}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {t.quantity}: {order.quantity} × {order.price} ={" "}
                        {order.quantity * order.price}
                      </div>
                    </div>
                    {!isSettled && !table.isSettled && (
                      <button
                        onClick={() => onSettleItem(order.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs sm:text-sm whitespace-nowrap"
                      >
                        {t.markItemSettled}
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">{t.total}:</span>
              <span className="font-bold text-lg">{total.toFixed(2)}</span>
            </div>
            {unsettledTotal > 0 && (
              <div className="flex justify-between text-orange-600 dark:text-orange-400">
                <span>{locale === "ar" ? "غير مسوّى" : "Unsettled"}:</span>
                <span>{unsettledTotal.toFixed(2)}</span>
              </div>
            )}
            {!table.isSettled && table.orders.length > 0 && (
              <button
                onClick={() => onSettleTable(table.id)}
                className="w-full mt-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                {t.markAsSettled}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
