/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Building2, Activity, Database, Sparkles } from "lucide-react";

interface HeaderProps {
  activeTab: "valuation" | "analytics";
  setActiveTab: (tab: "valuation" | "analytics") => void;
  totalSimulations: number;
  totalLeads: number;
}

export default function Header({
  activeTab,
  setActiveTab,
  totalSimulations,
  totalLeads,
}: HeaderProps) {
  return (
    <header className="border-b border-white/5 py-5 px-6 md:px-12 bg-charcoal-dark/90 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-gold/10 rounded-xl border border-brand-gold/20 flex items-center justify-center text-brand-gold">
            <Building2 className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg tracking-wider font-semibold text-white uppercase">
                PROPVAL <span className="text-brand-gold font-bold">ARCHITECT</span>
              </span>
              <span className="px-2 py-0.5 text-[9px] bg-brand-gold/15 text-brand-gold font-mono rounded font-medium border border-brand-gold/10 uppercase">
                MVP v1.1
              </span>
            </div>
            <p className="text-[11px] text-gray-500 font-mono tracking-normal">
              ADVANCED PROPTECH VALUATION ENGINE • REAL-TIME REGRESSION ANALYSIS
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Valuation Simulator vs SQLite Business Intelligence) */}
        <div className="flex bg-charcoal-medium p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab("valuation")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
              activeTab === "valuation"
                ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/20 font-semibold shadow-lg shadow-brand-gold/5"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-4.5 h-4.5 stroke-[1.8]" />
            Simulador de Valoración
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 relative ${
              activeTab === "analytics"
                ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/20 font-semibold shadow-lg shadow-brand-gold/5"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Database className="w-4.5 h-4.5 stroke-[1.8]" />
            Analítica de Demanda & Leads
            {totalSimulations > 0 && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold"></span>
              </span>
            )}
          </button>
        </div>

        {/* Real-time Status Counters for Panel */}
        <div className="hidden lg:flex items-center gap-5 text-xs font-mono">
          <div className="flex items-center gap-2 text-gray-400 px-3 py-1.5 bg-white/[0.02] rounded-lg border border-white/5">
            <Activity className="w-3.5 h-3.5 text-green-500 animate-pulse" />
            <span>Consultas en vivo: <strong className="text-white">{totalSimulations}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 px-3 py-1.5 bg-white/[0.02] rounded-lg border border-white/5">
            <span className="w-1.5 h-1.5 bg-brand-gold rounded-full"></span>
            <span>Leads Capturados: <strong className="text-white">{totalLeads}</strong></span>
          </div>
        </div>
      </div>
    </header>
  );
}
