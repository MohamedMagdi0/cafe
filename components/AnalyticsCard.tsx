"use client";

import { getTranslation } from "@/lib/i18n";
import { useLocale } from "./LanguageSwitcher";

interface AnalyticsCardProps {
  income: number;
  outcome: number;
  netProfit: number;
  period: string;
}

export default function AnalyticsCard({
  income,
  outcome,
  netProfit,
  period,
}: AnalyticsCardProps) {
  const locale = useLocale();
  const t = getTranslation(locale);

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
          {t.income}
        </h3>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
          +{income.toFixed(2)}
        </p>
      </div>
      <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <h3 className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
          {t.outcome}
        </h3>
        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
          -{outcome.toFixed(2)}
        </p>
      </div>
      <div
        className={`p-6 rounded-lg border ${
          netProfit >= 0
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
        }`}
      >
        <h3 className="text-sm font-medium mb-2">{t.netProfit}</h3>
        <p
          className={`text-2xl font-bold ${
            netProfit >= 0
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {netProfit >= 0 ? "+" : ""}
          {netProfit.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
