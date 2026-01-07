"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getTranslation } from "@/lib/i18n";
import LanguageSwitcher, { useLocale } from "@/components/LanguageSwitcher";

export default function LoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = getTranslation(locale);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("An error occurred");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-center mb-6">{t.login}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t.username}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              {t.password}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {loading ? "..." : t.login}
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          <p>Admin: admin / admin123</p>
          <p>Waiter: waiter1 / waiter123</p>
        </div>
      </div>
    </div>
  );
}
