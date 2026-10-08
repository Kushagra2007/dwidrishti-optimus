"use client";

import React, { useState, useEffect } from "react";
import { SUPPORTED_LOCALES, LocaleInfo } from "@/config/locales";

interface LanguageGateProps {
  currentLocale: string;
  onSelectLocale: (locale: string) => void;
}

export function LanguageGate({ currentLocale, onSelectLocale }: LanguageGateProps) {
  const [selected, setSelected] = useState<string>(currentLocale || "en");
  const [showMore, setShowMore] = useState(false);

  const primaryLocales = SUPPORTED_LOCALES.filter((l) => l.isPrimary);
  const secondaryLocales = SUPPORTED_LOCALES.filter((l) => !l.isPrimary);

  const handleConfirm = () => {
    // Persist choice in cookie
    document.cookie = `NEXT_LOCALE=${selected}; path=/; max-age=31536000; SameSite=Lax`;
    onSelectLocale(selected);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-card border-2 border-fg rounded-3xl p-6 sm:p-10 shadow-2xl animate-in fade-in duration-300">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 rounded-full border border-fg text-xs font-bold uppercase tracking-wider mb-3 bg-volt text-black">
            Dwi Drishti · द्वि दृष्टि
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display mb-2">
            Choose your language
          </h2>
          <p className="text-sm sm:text-base text-mut max-w-md mx-auto">
            Read how the same story is framed across different outlets, translated and analyzed in your language.
          </p>
        </div>

        {/* Primary Language Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {primaryLocales.map((locale) => {
            const isSelected = selected === locale.code;
            return (
              <button
                key={locale.code}
                onClick={() => setSelected(locale.code)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? "bg-fg text-bg border-fg scale-102 shadow-md"
                    : "bg-bg text-fg border-line hover:border-fg hover:bg-volt/20"
                }`}
              >
                <span className="text-2xl font-bold font-display">{locale.nativeName}</span>
                <span className={`text-xs mt-1 ${isSelected ? "text-bg/70" : "text-mut"}`}>
                  {locale.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Expandable secondary languages */}
        {!showMore ? (
          <div className="text-center my-3">
            <button
              onClick={() => setShowMore(true)}
              className="text-xs font-bold text-mut hover:text-fg underline decoration-dotted underline-offset-4"
            >
              + More Indian languages (Gujarati, Kannada, Malayalam, Punjabi, Odia, Urdu)
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 pt-2 border-t border-line animate-in fade-in">
            {secondaryLocales.map((locale) => {
              const isSelected = selected === locale.code;
              return (
                <button
                  key={locale.code}
                  onClick={() => setSelected(locale.code)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? "bg-fg text-bg border-fg scale-102 shadow-md"
                      : "bg-bg text-fg border-line hover:border-fg hover:bg-volt/20"
                  }`}
                  dir={locale.dir}
                >
                  <span className="text-xl font-bold font-display">{locale.nativeName}</span>
                  <span className={`text-xs mt-1 ${isSelected ? "text-bg/70" : "text-mut"}`}>
                    {locale.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleConfirm}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm bg-volt text-black border-2 border-fg hover:bg-volt/80 shadow-[2px_2px_0px_#0E0E0C] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            Confirm & Enter Platform →
          </button>
        </div>
      </div>
    </div>
  );
}
