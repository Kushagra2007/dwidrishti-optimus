"use client";

import React, { useState } from "react";

export default function TakedownPage() {
  const [submitted, setSubmitted] = useState(false);
  const [outletName, setOutletName] = useState("");
  const [email, setEmail] = useState("");
  const [articleUrl, setArticleUrl] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 border-b border-line pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-coral">Statutory Grievance Redressal</span>
          <h1 className="text-3xl font-extrabold font-display mt-1">Publisher Takedown & Right-of-Reply</h1>
          <p className="text-sm text-mut mt-1">
            Section 79 Information Technology Act, 2000 Grievance Officer Mechanism
          </p>
        </div>
        <a href="/" className="px-4 py-1.5 rounded-full text-xs font-bold border border-fg hover:bg-volt/30">
          ← Home
        </a>
      </div>

      {submitted ? (
        <div className="p-8 rounded-3xl bg-card border-2 border-fg text-center">
          <div className="text-2xl font-bold font-display mb-2">Request Acknowledged ✓</div>
          <p className="text-xs sm:text-sm text-mut max-w-md mx-auto mb-4">
            Your grievance has been assigned tracking ID <span className="font-mono text-fg font-bold">GRV-2026-8819</span>. In accordance with the IT Rules, our Grievance Officer will review and respond within our 48-hour statutory SLA.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2 rounded-full text-xs font-bold bg-volt text-black border border-fg"
          >
            Return to Homepage
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-card border border-line space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-mut mb-1">
              Publishing Outlet / Media Organization
            </label>
            <input
              required
              type="text"
              value={outletName}
              onChange={(e) => setOutletName(e.target.value)}
              placeholder="e.g. The Hindu, Amar Ujala"
              className="w-full p-2.5 rounded-xl bg-bg border border-line text-xs font-medium focus:border-cobalt focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-mut mb-1">
              Authorized Contact Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="legal@outlet.com"
              className="w-full p-2.5 rounded-xl bg-bg border border-line text-xs font-medium focus:border-cobalt focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-mut mb-1">
              Article Canonical URL or Cluster ID
            </label>
            <input
              required
              type="url"
              value={articleUrl}
              onChange={(e) => setArticleUrl(e.target.value)}
              placeholder="https://..."
              className="w-full p-2.5 rounded-xl bg-bg border border-line text-xs font-medium focus:border-cobalt focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-mut mb-1">
              Reason for Takedown or Right-of-Reply Statement
            </label>
            <textarea
              required
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Detail factual inaccuracies, copyright concerns, or provide your organization's formal response..."
              className="w-full p-2.5 rounded-xl bg-bg border border-line text-xs font-medium focus:border-cobalt focus:outline-none"
            ></textarea>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-volt text-black border border-fg hover:bg-volt/80 shadow-sm"
            >
              Submit Statutory Notice (48h SLA) →
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
