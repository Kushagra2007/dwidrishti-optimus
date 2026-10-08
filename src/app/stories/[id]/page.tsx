"use client";

import React, { useState } from "react";
import { SixAxisRadar, RadarDataPoint } from "@/components/SixAxisRadar";

interface OutletDetail {
  name: string;
  headline: string;
  language: string;
  scoreGov: number; // 0 to 100
  axesScores: RadarDataPoint[];
  loadedPhrases: { text: string; polarity: "favourable" | "critical" }[];
  missingFact?: string;
  sourceUrl: string;
}

interface StoryClusterDetail {
  id: string;
  tag: string;
  title: string;
  consensusFacts: string[];
  divergenceSummary: string;
  omissionSentence: string;
  outlets: OutletDetail[];
}

const SAMPLE_DETAIL: StoryClusterDetail = {
  id: "tax",
  tag: "Politics",
  title: "New income-tax slabs announced in Union Budget",
  consensusFacts: [
    "New income-tax slabs were announced in the Union Budget.",
    "Changes take effect next financial year across all assessment zones.",
    "Standard deduction remains operative with restructured tax bands.",
  ],
  divergenceSummary: "Outlets split significantly between framing the change as historic middle-class relief vs. examining who still pays more.",
  omissionSentence: "Impact on salaried class above ₹15 lakh is reported by 4 of 5 outlets but omitted by Dainik Jagran.",
  outlets: [
    {
      name: "The Hindu",
      headline: "Tax slabs widened; relief mostly for mid-income earners",
      language: "EN",
      scoreGov: 55,
      sourceUrl: "https://thehindu.com",
      axesScores: [
        { axis: "gov", label: "Govt", value: 55, uncertainty: 0.1 },
        { axis: "cul", label: "Culture", value: 50, uncertainty: 0.1 },
        { axis: "fed", label: "Federal", value: 50, uncertainty: 0.1 },
        { axis: "eco", label: "Econ", value: 45, uncertainty: 0.2 },
        { axis: "cas", label: "Caste", value: 50, uncertainty: 0.1 },
        { axis: "ten", label: "Tenor", value: 30, uncertainty: 0.1 },
      ],
      loadedPhrases: [{ text: "relief mostly", polarity: "favourable" }],
    },
    {
      name: "Dainik Jagran",
      headline: "मध्यम वर्ग को बड़ी सौगात, टैक्स में राहत",
      language: "HI",
      scoreGov: 84,
      sourceUrl: "https://jagran.com",
      missingFact: "Impact on salaried brackets exceeding ₹15 lakh",
      axesScores: [
        { axis: "gov", label: "Govt", value: 84, uncertainty: 0.1 },
        { axis: "cul", label: "Culture", value: 65, uncertainty: 0.2 },
        { axis: "fed", label: "Federal", value: 75, uncertainty: 0.1 },
        { axis: "eco", label: "Econ", value: 80, uncertainty: 0.2 },
        { axis: "cas", label: "Caste", value: 50, uncertainty: 0.1 },
        { axis: "ten", label: "Tenor", value: 75, uncertainty: 0.2 },
      ],
      loadedPhrases: [
        { text: "बड़ी सौगात", polarity: "favourable" },
        { text: "राहत", polarity: "favourable" },
      ],
    },
    {
      name: "The Wire",
      headline: "Tax 'relief' leaves most workers outside the net",
      language: "EN",
      scoreGov: 16,
      sourceUrl: "https://thewire.in",
      axesScores: [
        { axis: "gov", label: "Govt", value: 16, uncertainty: 0.1 },
        { axis: "cul", label: "Culture", value: 45, uncertainty: 0.1 },
        { axis: "fed", label: "Federal", value: 35, uncertainty: 0.2 },
        { axis: "eco", label: "Econ", value: 20, uncertainty: 0.1 },
        { axis: "cas", label: "Caste", value: 60, uncertainty: 0.2 },
        { axis: "ten", label: "Tenor", value: 45, uncertainty: 0.1 },
      ],
      loadedPhrases: [{ text: "'relief'", polarity: "critical" }],
    },
  ],
};

export default function StoryPage() {
  const [selectedOutlet, setSelectedOutlet] = useState<OutletDetail>(SAMPLE_DETAIL.outlets[0]);
  const [compareOutletA, setCompareOutletA] = useState<OutletDetail>(SAMPLE_DETAIL.outlets[1]);
  const [compareOutletB, setCompareOutletB] = useState<OutletDetail>(SAMPLE_DETAIL.outlets[2]);
  const [showHowScored, setShowHowScored] = useState<boolean>(false);
  const [biasGoggles, setBiasGoggles] = useState<boolean>(true);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <a href="/" className="px-4 py-1.5 rounded-full text-xs font-bold border border-fg hover:bg-volt/30">
          ← Back to Stories
        </a>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBiasGoggles(!biasGoggles)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border border-fg ${
              biasGoggles ? "bg-volt text-black" : "bg-bg text-fg"
            }`}
          >
            👓 Bias Goggles
          </button>
          <button
            onClick={() => setShowHowScored(!showHowScored)}
            className="px-3 py-1.5 rounded-full text-xs font-bold border border-line bg-card hover:border-fg"
          >
            How We Scored This
          </button>
        </div>
      </div>

      {/* Story Header */}
      <div className="mb-8">
        <span className="text-xs font-bold text-mut uppercase tracking-wider">{SAMPLE_DETAIL.tag}</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display my-2">{SAMPLE_DETAIL.title}</h1>
        <p className="text-sm text-mut max-w-2xl">{SAMPLE_DETAIL.divergenceSummary}</p>
      </div>

      {/* Evidence of Omission Banner */}
      <div className="p-4 rounded-2xl bg-card border-2 border-line mb-8 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-coral uppercase tracking-wider mb-1">
          <span>✦ Verifiable Omission Evidence</span>
        </div>
        <p className="text-xs sm:text-sm text-fg font-medium">{SAMPLE_DETAIL.omissionSentence}</p>
      </div>

      {/* 6-Axis Radar & Outlets Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="p-6 rounded-3xl bg-card border border-line flex flex-col items-center justify-center">
          <h2 className="text-sm font-bold uppercase tracking-wider text-mut mb-4">
            Six-Axis Framing Radar · {selectedOutlet.name}
          </h2>
          <SixAxisRadar data={selectedOutlet.axesScores} />
          <div className="text-[11px] text-mut text-center mt-3">
            Hatched points indicate confidence uncertainty. Values calibrated [-1.0, 1.0] to 0-100 track.
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-mut">Outlets in this Cluster</h2>
          {SAMPLE_DETAIL.outlets.map((outlet) => {
            const isSelected = selectedOutlet.name === outlet.name;
            return (
              <div
                key={outlet.name}
                onClick={() => setSelectedOutlet(outlet)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected ? "bg-card border-fg shadow-md" : "bg-bg border-line hover:border-fg"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm">
                    {outlet.name} <span className="text-xs text-mut font-mono">[{outlet.language}]</span>
                  </span>
                  <span className="font-mono text-xs font-bold">{outlet.scoreGov}/100</span>
                </div>

                <p className="text-xs my-2 font-medium">
                  {biasGoggles ? (
                    <span>
                      {outlet.headline}
                      {outlet.loadedPhrases.map((phrase) => (
                        <span
                          key={phrase.text}
                          className={`ml-2 ${
                            phrase.polarity === "favourable" ? "bias-favourable" : "bias-critical"
                          }`}
                        >
                          [{phrase.text}]
                        </span>
                      ))}
                    </span>
                  ) : (
                    outlet.headline
                  )}
                </p>

                {outlet.missingFact && (
                  <div className="mt-2 text-[11px] text-coral font-medium">
                    Absent here: {outlet.missingFact}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Compare View */}
      <div className="border-t border-line pt-8 mb-12">
        <h2 className="text-2xl font-extrabold font-display mb-6">Compare Any Two Outlets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-card border border-line">
            <span className="text-xs font-bold text-mut uppercase">Outlet A</span>
            <h3 className="text-xl font-bold font-display my-2">{compareOutletA.name}</h3>
            <p className="text-xs font-medium text-fg mb-4">&ldquo;{compareOutletA.headline}&rdquo;</p>
            <div className="text-xs space-y-2 text-mut">
              <div>Government Framing: <b className="text-fg">{compareOutletA.scoreGov}/100</b></div>
              <div>Language: <b className="text-fg uppercase">{compareOutletA.language}</b></div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-line">
            <span className="text-xs font-bold text-mut uppercase">Outlet B</span>
            <h3 className="text-xl font-bold font-display my-2">{compareOutletB.name}</h3>
            <p className="text-xs font-medium text-fg mb-4">&ldquo;{compareOutletB.headline}&rdquo;</p>
            <div className="text-xs space-y-2 text-mut">
              <div>Government Framing: <b className="text-fg">{compareOutletB.scoreGov}/100</b></div>
              <div>Language: <b className="text-fg uppercase">{compareOutletB.language}</b></div>
            </div>
          </div>
        </div>
      </div>

      {/* How We Scored This Drawer */}
      {showHowScored && (
        <div className="p-6 rounded-3xl bg-[#0E0E0C] text-[#F1EFE8] border border-fg mb-12">
          <h3 className="text-lg font-bold font-display text-volt mb-2">How We Scored This</h3>
          <div className="text-xs space-y-2 text-mut leading-relaxed">
            <p>• Model: <span className="text-white font-mono">gemini-2.5-pro / text-embedding-004</span></p>
            <p>• Version: <span className="text-white font-mono">v1.2.0-canary</span></p>
            <p>• Verification: Every loaded term and omission flag is matched verbatim against the source text.</p>
            <p>• Prompt Hash: <span className="text-white font-mono">sha256:88491f2ac90</span></p>
          </div>
        </div>
      )}
    </div>
  );
}
