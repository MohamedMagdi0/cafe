"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LanguageSwitcher() {
  const router = useRouter();
  const [locale, setLocale] = useState<"en" | "ar">("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("locale") as "en" | "ar" | null;
    if (saved && (saved === "en" || saved === "ar")) {
      setLocale(saved);
    }
  }, []);

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
    window.dispatchEvent(new Event("localechange"));
    router.refresh();
  };

  if (!mounted) {
    return (
      <button
        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
        style={{ direction: "ltr" }}
      >
        EN/AR
      </button>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      style={{ direction: "ltr" }}
    >
      {locale === "en" ? "العربية" : "English"}
    </button>
  );
}

export function useLocale(): "en" | "ar" {
  const [locale, setLocale] = useState<"en" | "ar">("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("locale");
    if (saved === "ar" || saved === "en") {
      setLocale(saved);
    }

    const handleLocaleChange = () => {
      const newSaved = localStorage.getItem("locale");
      if (newSaved === "ar" || newSaved === "en") {
        setLocale(newSaved);
      }
    };

    window.addEventListener("localechange", handleLocaleChange);
    return () => window.removeEventListener("localechange", handleLocaleChange);
  }, []);

  return mounted ? locale : "en";
}
