import React from "react";
import { OUTLETS_REGISTRY } from "@/config/outlets";

export const dynamic = "force-dynamic";

export default function IngestionHealthPage() {
  const activeOutlets = OUTLETS_REGISTRY.filter((o) => o.isActive);
  const inactiveOutlets = OUTLETS_REGISTRY.filter((o) => !o.isActive);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 border-b border-line pb-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display">Ingestion & Outlet Registry Health</h1>
          <p className="text-sm text-mut mt-1">
            Monitoring active RSS endpoints, robots compliance, ownership citations, and fetch latency.
          </p>
        </div>
        <a
          href="/"
          className="px-4 py-1.5 rounded-full text-xs font-bold border border-fg hover:bg-volt/30 transition-all"
        >
          ← Back to Platform
        </a>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-card border border-line">
          <span className="text-xs font-bold text-mut uppercase">Active Outlets</span>
          <div className="text-3xl font-extrabold font-display mt-1">{activeOutlets.length}</div>
          <span className="text-[11px] text-mut">Phase 1 priority</span>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-line">
          <span className="text-xs font-bold text-mut uppercase">Total Feeds</span>
          <div className="text-3xl font-extrabold font-display mt-1">
            {OUTLETS_REGISTRY.reduce((acc, o) => acc + o.feeds.length, 0)}
          </div>
          <span className="text-[11px] text-mut">English, Hindi & Regional</span>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-line">
          <span className="text-xs font-bold text-mut uppercase">Fair Dealing Cap</span>
          <div className="text-3xl font-extrabold font-display mt-1 text-cobalt">50 Words</div>
          <span className="text-[11px] text-mut">Sec 52(1)(a) compliant</span>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-line">
          <span className="text-xs font-bold text-mut uppercase">Text Cache TTL</span>
          <div className="text-3xl font-extrabold font-display mt-1 text-coral">7 Days</div>
          <span className="text-[11px] text-mut">Transient analysis only</span>
        </div>
      </div>

      {/* Active Feeds Table */}
      <h2 className="text-xl font-bold font-display mb-4">Phase 1 Active Sources</h2>
      <div className="border border-line rounded-2xl overflow-hidden mb-8 bg-card shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-bg border-b border-line uppercase font-bold text-mut text-[10px]">
            <tr>
              <th className="p-3">Outlet</th>
              <th className="p-3">Language</th>
              <th className="p-3">Region</th>
              <th className="p-3">Ownership & Citation</th>
              <th className="p-3">Feed Endpoint</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {activeOutlets.map((outlet) => (
              <tr key={outlet.id} className="hover:bg-bg/50">
                <td className="p-3 font-bold">{outlet.name}</td>
                <td className="p-3 uppercase font-mono text-[10px]">{outlet.language}</td>
                <td className="p-3">{outlet.region}</td>
                <td className="p-3 max-w-xs">
                  <p className="truncate text-mut">{outlet.ownershipDetails}</p>
                  <a
                    href={outlet.ownershipCitationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cobalt underline text-[10px]"
                  >
                    Citation Source ↗
                  </a>
                </td>
                <td className="p-3 font-mono text-[10px] truncate max-w-xs">{outlet.feeds[0]}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-volt text-black">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Standby / Phase 2 Registry */}
      <h2 className="text-xl font-bold font-display mb-4">Phase 2 Standby Registry</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {inactiveOutlets.map((outlet) => (
          <div key={outlet.id} className="p-3 rounded-xl bg-card border border-line text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold">{outlet.name}</span>
              <span className="text-[10px] font-mono text-mut uppercase">[{outlet.language}]</span>
            </div>
            <p className="text-[11px] text-mut truncate mb-1">{outlet.ownershipDetails}</p>
            <span className="text-[10px] text-mut/80">Feeds ready: {outlet.feeds.length}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
