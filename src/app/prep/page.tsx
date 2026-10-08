"use client";

import React, { useState } from "react";

interface McqItem {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface MainsQuestion {
  id: number;
  question: string;
  wordLimit: number;
  framework: string[];
}

export default function PerspectivePrepPage() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<number, boolean>>({});

  const mcqs: McqItem[] = [
    {
      id: 1,
      question: "Which of the following constitutional provisions empowers the Parliament of India to levy taxes on income other than agricultural income?",
      options: [
        "A) Article 246 read with Entry 82 of List I (Union List)",
        "B) Article 246 read with Entry 54 of List II (State List)",
        "C) Article 265 and Entry 97 of List I",
        "D) Article 270 read with Entry 84 of List I",
      ],
      correctAnswer: 0,
      explanation: "Entry 82 of the Union List (Seventh Schedule) empowers Parliament to tax income other than agricultural income.",
    },
    {
      id: 2,
      question: "Consider the following statements regarding the Finance Bill:\n1. It is a Money Bill under Article 110 of the Constitution.\n2. Rajya Sabha has equal power with Lok Sabha to amend it.",
      options: [
        "A) 1 only",
        "B) 2 only",
        "C) Both 1 and 2",
        "D) Neither 1 nor 2",
      ],
      correctAnswer: 0,
      explanation: "The Finance Bill containing tax proposals constitutes a Money Bill under Article 110. Rajya Sabha cannot amend or reject it.",
    },
  ];

  const mainsQuestions: MainsQuestion[] = [
    {
      id: 1,
      question: "Critically examine the macroeconomic implications of widening personal income tax slabs on consumer demand and state tax devolution in India.",
      wordLimit: 150,
      framework: [
        "Introduction: Context of recent Union Budget tax slab restructuring.",
        "Dimension 1: Impact on disposable household income and urban domestic consumption.",
        "Dimension 2: Fiscal impact on divisible tax pool under Article 270 (Finance Commission devolution to States).",
        "Way Forward: Balancing direct tax base expansion with equitable consumption stimulus.",
      ],
    },
  ];

  const handleSelectOption = (mcqId: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [mcqId]: optIdx }));
    setRevealedExplanations((prev) => ({ ...prev, [mcqId]: true }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header with Print PDF button */}
      <div className="flex justify-between items-center mb-8 border-b border-line pb-4 print:hidden">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cobalt">Perspective Prep Module</span>
          <h1 className="text-3xl font-extrabold font-display mt-1">UPSC & State PSC Exam Brief</h1>
          <p className="text-xs text-mut mt-1">Topic: Union Budget Tax Slabs Restructuring & Fiscal Federalism</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-1.5 rounded-full text-xs font-bold bg-volt text-black border border-fg hover:bg-volt/80 shadow-sm"
          >
            🖨 Export Study PDF
          </button>
          <a
            href="/"
            className="px-4 py-1.5 rounded-full text-xs font-bold border border-fg bg-bg hover:bg-card"
          >
            ← Home
          </a>
        </div>
      </div>

      {/* 1. Neutral Background */}
      <section className="mb-8">
        <h2 className="text-xl font-bold font-display mb-3">1. Neutral Background & Timeline</h2>
        <div className="p-5 rounded-2xl bg-card border border-line text-xs sm:text-sm leading-relaxed text-fg space-y-2">
          <p>
            The Union Finance Minister introduced a comprehensive revision of personal income tax slabs under the simplified tax regime. The measure expands the basic exemption limit and rationalizes brackets up to ₹15 lakh.
          </p>
          <p className="text-mut">
            <b className="text-fg">Key Dates:</b> Introduced in February Budget Session, enacted via Finance Act with effect from April 1 of the new assessment year.
          </p>
        </div>
      </section>

      {/* 2. Constitutional & Statutory Basis */}
      <section className="mb-8">
        <h2 className="text-xl font-bold font-display mb-3">2. Constitutional & Statutory Framework</h2>
        <div className="p-5 rounded-2xl bg-card border border-line text-xs space-y-3">
          <div className="p-2.5 rounded-xl bg-bg border border-line">
            <b className="text-fg">Article 265:</b> Taxes not to be imposed save by authority of law.
          </div>
          <div className="p-2.5 rounded-xl bg-bg border border-line">
            <b className="text-fg">Article 270:</b> Taxes levied and distributed between the Union and the States (Divisible Tax Pool).
          </div>
          <div className="p-2.5 rounded-xl bg-bg border border-line">
            <b className="text-fg">Seventh Schedule (Union List Entry 82):</b> Taxes on income other than agricultural income.
          </div>
          <p className="text-[11px] text-mut italic">
            * Note for Aspirants: Verify citations with official Gazette notifications before quoting in examination answer sheets.
          </p>
        </div>
      </section>

      {/* 3. Balanced Arguments Matrix */}
      <section className="mb-8">
        <h2 className="text-xl font-bold font-display mb-3">3. Balanced Perspectives Matrix</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-line">
            <span className="text-xs font-bold text-volt uppercase">Pro-Government Rationale</span>
            <ul className="text-xs text-fg space-y-2 mt-2 list-disc pl-4 leading-relaxed">
              <li>Boosts disposable household income for middle-class consumers.</li>
              <li>Incentivizes shift towards exemption-free, frictionless tax filing.</li>
              <li>Improves voluntary direct tax compliance and widens taxpayer base.</li>
            </ul>
          </div>
          <div className="p-5 rounded-2xl bg-card border border-line">
            <span className="text-xs font-bold text-coral uppercase">Counter-Arguments & Critical Scrutiny</span>
            <ul className="text-xs text-fg space-y-2 mt-2 list-disc pl-4 leading-relaxed">
              <li>Offers minimal relief to rural and unorganized informal sector workers outside the net.</li>
              <li>Reduces gross tax buoyancy, potentially impacting State share under Finance Commission devolution.</li>
              <li>Disincentivizes small household savings instruments (PPF, NSC) traditionally tied to Section 80C exemptions.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Prelims MCQs */}
      <section className="mb-8">
        <h2 className="text-xl font-bold font-display mb-3">4. Practice MCQs for Prelims</h2>
        <div className="space-y-4">
          {mcqs.map((mcq) => (
            <div key={mcq.id} className="p-5 rounded-2xl bg-card border border-line text-xs">
              <p className="font-bold text-sm text-fg mb-3 whitespace-pre-line">{mcq.question}</p>
              <div className="space-y-2 mb-3">
                {mcq.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(mcq.id, idx)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs ${
                      selectedAnswers[mcq.id] === idx
                        ? idx === mcq.correctAnswer
                          ? "bg-volt text-black border-fg font-bold"
                          : "bg-coral/20 text-fg border-coral font-bold"
                        : "bg-bg text-fg border-line hover:border-fg"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {revealedExplanations[mcq.id] && (
                <div className="p-3 rounded-xl bg-bg border border-line text-[11px] text-mut">
                  <b className="text-fg">Explanation:</b> {mcq.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. Mains Analytical Outline */}
      <section className="mb-12">
        <h2 className="text-xl font-bold font-display mb-3">5. Mains Analytical Question Framework</h2>
        <div className="space-y-4">
          {mainsQuestions.map((mq) => (
            <div key={mq.id} className="p-5 rounded-2xl bg-card border border-line text-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-fg">{mq.question}</span>
                <span className="text-[10px] font-mono text-mut">({mq.wordLimit} Words)</span>
              </div>
              <div className="mt-3 p-4 rounded-xl bg-bg border border-line space-y-2">
                <b className="text-[11px] text-cobalt uppercase">Recommended Answer Structure:</b>
                {mq.framework.map((point, idx) => (
                  <p key={idx} className="text-mut text-xs leading-relaxed">
                    • {point}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
