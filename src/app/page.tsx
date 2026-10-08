"use client";

import React, { useState, useEffect } from "react";
import { LanguageGate } from "@/components/LanguageGate";
import enLocale from "@/locales/en.json";
import hiLocale from "@/locales/hi.json";

interface StoryCluster {
  id: string;
  tag: string;
  titleEn: string;
  titleHi: string;
  leadFact: string;
  divergenceSummary: string;
  isBlindspot: boolean;
  omissionEvidence: string;
  omittedOutlets: string[];
  outlets: {
    name: string;
    headline: string;
    score: number; // 0 to 100
    language: string;
  }[];
}

const SAMPLE_STORIES: StoryCluster[] = [
  {
    id: "tax",
    tag: "Politics",
    titleEn: "New income-tax slabs announced in Union Budget",
    titleHi: "केंद्रीय बजट में नए आयकर स्लैब की घोषणा",
    leadFact: "New slabs were announced in the Budget and take effect next financial year.",
    divergenceSummary: "Some lead with the relief, others with who still pays more.",
    isBlindspot: false,
    omissionEvidence: "Impact on salaried class above ₹15 lakh",
    omittedOutlets: ["Dainik Jagran"],
    outlets: [
      { name: "The Hindu", headline: "Tax slabs widened; relief mostly for mid-income earners", score: 55, language: "EN" },
      { name: "Indian Express", headline: "What the new slabs mean for your take-home pay", score: 48, language: "EN" },
      { name: "Dainik Jagran", headline: "मध्यम वर्ग को बड़ी सौगात, टैक्स में राहत", score: 84, language: "HI" },
      { name: "NDTV", headline: "Budget fine print: higher earners see little change", score: 34, language: "EN" },
      { name: "The Wire", headline: "Tax 'relief' leaves most workers outside the net", score: 16, language: "EN" },
    ],
  },
  {
    id: "msp",
    tag: "Economy",
    titleEn: "Farm support prices revised ahead of sowing season",
    titleHi: "बुवाई से पहले एमएसपी में संशोधन",
    leadFact: "Support prices for major crops were raised ahead of the sowing season.",
    divergenceSummary: "Framing splits between 'historic hike' and 'below input-cost growth'.",
    isBlindspot: true,
    omissionEvidence: "Farmer union dissent and legal guarantee demand",
    omittedOutlets: ["Dainik Jagran"],
    outlets: [
      { name: "The Hindu", headline: "MSP raised for 14 crops; unions want legal guarantee", score: 50, language: "EN" },
      { name: "Indian Express", headline: "Explained: how MSP is fixed, and what changed", score: 46, language: "EN" },
      { name: "Dainik Jagran", headline: "किसानों को तोहफ़ा, एमएसपी में रिकॉर्ड बढ़ोतरी", score: 86, language: "HI" },
      { name: "The Wire", headline: "Farmers say hike trails rising input costs", score: 20, language: "EN" },
    ],
  },
];

export default function HomePage() {
  const [locale, setLocale] = useState<string>("en");
  const [showGate, setShowGate] = useState<boolean>(false);
  const [biasGoggles, setBiasGoggles] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const strings = locale === "hi" ? hiLocale.common : enLocale.common;

  useEffect(() => {
    // Check if locale cookie is already present
    const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
    if (!match) {
      setShowGate(true);
    } else {
      setLocale(match[1]);
    }

    // Keyboard shortcut for goggles (G)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "g" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        setBiasGoggles((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const filteredStories = SAMPLE_STORIES.filter((story) => {
    const matchesTag = selectedTag === "All" || (selectedTag === "Blindspots" ? story.isBlindspot : story.tag === selectedTag);
    const textToSearch = (story.titleEn + " " + story.titleHi).toLowerCase();
    const matchesSearch = textToSearch.includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-20">
      {showGate && (
        <LanguageGate
          currentLocale={locale}
          onSelectLocale={(newLocale) => {
            setLocale(newLocale);
            setShowGate(false);
          }}
        />
      )}

      {/* Persistent Navigation Header */}
      <header className="sticky top-3 z-40 max-w-5xl mx-auto px-4 sm:px-6 my-3">
        <div className="flex items-center justify-between gap-3 p-2 pl-5 bg-card/80 backdrop-blur-md border-2 border-fg rounded-full shadow-sm">
          <a href="#" className="font-extrabold text-lg sm:text-xl font-display tracking-tight flex items-center gap-1.5">
            Dwi Drishti <span className="font-light text-mut text-sm">News</span>
          </a>

          <div className="flex-1 max-w-xs mx-2">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={strings.searchPlaceholder}
              className="w-full px-4 py-1.5 text-xs sm:text-sm bg-bg border border-line rounded-full focus:outline-none focus:border-cobalt"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setBiasGoggles(!biasGoggles)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border border-fg transition-all flex items-center gap-1.5 ${
                biasGoggles ? "bg-volt text-black shadow-sm" : "bg-bg text-fg hover:bg-volt/30"
              }`}
              title="Highlight loaded phrases (shortcut G)"
            >
              👓 <span className="hidden sm:inline">{strings.biasGoggles}</span>
            </button>

            <button
              onClick={() => setShowGate(true)}
              className="px-3 py-1.5 rounded-full text-xs font-bold border border-fg bg-bg text-fg hover:bg-volt/30"
              aria-label={strings.changeLanguage}
            >
              {locale === "hi" ? "हिं" : "EN"}
            </button>

            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full border border-fg flex items-center justify-center text-xs font-bold bg-bg hover:bg-volt/30"
              aria-label={strings.toggleTheme}
            >
              {theme === "light" ? "◐" : "◑"}
            </button>
          </div>
        </div>
      </header>

      {/* Hero: Two Views Split */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-12">
        <div className="flex justify-between items-center text-xs font-semibold text-mut mb-4 px-2">
          <span>{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
          <span className="uppercase tracking-wider px-2 py-0.5 rounded border border-line text-[10px]">{strings.evidenceNotVerdicts}</span>
        </div>

        <div className="border-2 border-fg rounded-3xl overflow-hidden shadow-md bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-fg">
            <div className="p-8 sm:p-12 flex flex-col justify-between bg-[#F7F6F1]">
              <span className="text-xs uppercase font-extrabold tracking-wider text-coral">Perspective A · Scrutiny</span>
              <h1 className="text-3xl sm:text-5xl font-extrabold font-display my-6 text-[#0E0E0C] leading-tight">
                {locale === "hi" ? "बजट का सच: टैक्स छूट से किसे कितना फायदा?" : "The fine print: who still pays more after tax recast"}
              </h1>
              <p className="text-xs text-mut font-medium">Examining structural tax distribution and revenue implications.</p>
            </div>

            <div className="p-8 sm:p-12 flex flex-col justify-between bg-[#0E0E0C] text-[#F1EFE8]">
              <span className="text-xs uppercase font-extrabold tracking-wider text-volt">Perspective B · Establishment</span>
              <h1 className="text-3xl sm:text-5xl font-extrabold font-display my-6 text-[#F1EFE8] leading-tight">
                {locale === "hi" ? "मध्यम वर्ग को बड़ी राहत, नए आयकर स्लैब घोषित" : "Budget hands the middle class a historic tax relief"}
              </h1>
              <p className="text-xs text-[#A5A299] font-medium">Emphasizing purchasing power enhancement and ease of compliance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Chips */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex flex-wrap gap-2">
          {["All", "Politics", "Economy", "Blindspots"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                selectedTag === tag
                  ? "bg-fg text-bg border-fg"
                  : "bg-card text-fg border-line hover:border-fg"
              }`}
            >
              {tag === "All" ? strings.all : tag === "Blindspots" ? strings.blindspots : tag}
            </button>
          ))}
        </div>
      </section>

      {/* Story Cluster Feed */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStories.map((story) => (
            <article
              key={story.id}
              className="border-2 border-fg rounded-3xl p-6 bg-card flex flex-col justify-between hover:border-cobalt transition-all shadow-sm"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-mut">{story.tag}</span>
                  {story.isBlindspot && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-volt text-black border border-fg">
                      {strings.blindspots}
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-display mb-4">
                  {locale === "hi" ? story.titleHi : story.titleEn}
                </h2>

                {/* Evidence of Omission */}
                <div className="p-3 rounded-xl bg-bg border border-line text-xs mb-4">
                  <div className="font-bold text-coral mb-1">Evidence of Omission:</div>
                  <div className="text-mut">
                    &ldquo;{story.omissionEvidence}&rdquo; appears in peer coverage but is omitted by{" "}
                    <span className="font-bold text-fg">{story.omittedOutlets.join(", ")}</span>.
                  </div>
                </div>

                {/* Outlets framing breakdown */}
                <div className="space-y-3 mt-4">
                  {story.outlets.map((outlet) => (
                    <div key={outlet.name} className="border-t border-line pt-2">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>
                          {outlet.name} <span className="text-[10px] font-mono text-mut">[{outlet.language}]</span>
                        </span>
                        <span className="font-mono text-xs">{outlet.score}/100</span>
                      </div>
                      <p className={`text-xs ${biasGoggles ? "bias-favourable" : "text-fg/90"}`}>
                        {outlet.headline}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-line flex justify-between items-center text-xs">
                <span className="text-mut font-medium">
                  {strings.coveredBy} {story.outlets.length} {strings.of} 5 outlets
                </span>
                <span className="font-bold text-cobalt underline cursor-pointer">
                  {strings.perspectivePrep} →
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
