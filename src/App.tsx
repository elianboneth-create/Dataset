/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from "react";
import Header from "./components/Header";
import AssetConfigurationPanel from "./components/AssetConfigurationPanel";
import ValuationMetricsPanel from "./components/ValuationMetricsPanel";
import TechnicalSpecs from "./components/TechnicalSpecs";
import InvestorAnalyticsDashboard from "./components/InvestorAnalyticsDashboard";
import { calculateValuation } from "./prediction_engine";
import { ValuationInputs, AnalyticsSummary } from "./types";
import { RefreshCw, MapPin, Sparkles, Database, ShieldAlert } from "lucide-react";

export default function App() {
  // Navigation State: "valuation" (Simulator) or "analytics" (BI Panel)
  const [activeTab, setActiveTab] = useState<"valuation" | "analytics">("valuation");

  // Valuation Inputs State (Default values are chosen from typical real-world listings)
  const [inputs, setInputs] = useState<ValuationInputs>({
    area: 5000,
    bathrooms: 2,
    stories: 2,
    parking: 1,
    airconditioning: false,
    mainroad: true,
    guestroom: false,
    basement: false,
    hotwaterheating: false,
    prefarea: false,
    furnishingstatus: "semi-furnished",
  });

  // Calculation Results
  const valuation = useMemo(() => {
    return calculateValuation(inputs);
  }, [inputs]);

  // Database Management & Sincronización State
  const [lastSimulationId, setLastSimulationId] = useState<number | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isRefreshingAnalytics, setIsRefreshingAnalytics] = useState(false);
  const [isLoadingLead, setIsLoadingLead] = useState(false);
  const [connectivityError, setConnectivityError] = useState<string | null>(null);

  // References to handle debounce operations
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch SQLite aggregates from API
  const fetchAnalytics = async () => {
    setIsRefreshingAnalytics(true);
    try {
      const response = await fetch("/api/analytics");
      if (!response.ok) {
        throw new Error("HTTP response error");
      }
      const data: AnalyticsSummary = await response.json();
      setAnalytics(data);
      setConnectivityError(null);
    } catch (e: any) {
      console.warn("[-] Failed to fetch analytics from API:", e.message);
      setConnectivityError("Consola SQLite temporalmente offline (Servidor local simulado activo)");
    } finally {
      setIsRefreshingAnalytics(false);
    }
  };

  // Perform background simulation logging with debouncing to prevent flooding SQLite
  const logSimulationToDatabase = async () => {
    try {
      const payload = {
        area: inputs.area,
        bathrooms: inputs.bathrooms,
        stories: inputs.stories,
        parking: inputs.parking,
        predicted_price: valuation.predictedPrice,
      };

      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.id) {
          setLastSimulationId(data.id);
          // Refresh background logs secretly
          fetchAnalytics();
        }
      }
    } catch (error: any) {
      console.warn("[-] DB Background Log omitted offline:", error.message);
    }
  };

  // Trigger debounced logging on inputs change
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      logSimulationToDatabase();
    }, 600); // 600ms debounce threshold

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputs, valuation.predictedPrice]);

  // Initial load
  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Fetch again when user switches to Analytics Dashboard
  useEffect(() => {
    if (activeTab === "analytics") {
      fetchAnalytics();
    }
  }, [activeTab]);

  // Lead captured trigger
  const handleLeadCaptured = async (email: string) => {
    setIsLoadingLead(true);
    try {
      const payload = {
        id: lastSimulationId,
        email: email,
      };

      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Trigger analytics refresh to increase conversion counter
        await fetchAnalytics();
      }
    } catch (error: any) {
      console.error("[-] Error capturing lead:", error.message);
    } finally {
      setIsLoadingLead(false);
    }
  };

  const totalSimulations = analytics?.total_count || 0;
  const totalLeads = analytics?.total_leads || 0;

  return (
    <div className="min-h-screen bg-charcoal-dark text-slate-100 flex flex-col font-sans transition-colors duration-300 pb-16">
      
      {/* Editorial Navigation Headers */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalSimulations={totalSimulations}
        totalLeads={totalLeads}
      />

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 py-10 flex flex-col gap-8">
        
        {connectivityError && (
          <div className="flex items-center gap-2 px-4 py-3 bg-brand-gold/10 border border-brand-gold/25 text-brand-gold text-xs font-mono rounded-xl">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{connectivityError}</span>
          </div>
        )}

        {activeTab === "valuation" ? (
          /* SECTION 1: VALUATION SIMULATOR BENTO-GRID */
          <div className="flex flex-col gap-8 animate-fade-in">
            {/* Title intro */}
            <div>
              <h1 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight">
                Herramienta Científica de Valoración Inmobiliaria
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Ajuste los componentes arquitectónicos y geoespaciales para estimar el valor comercial preciso en tiempo real.
              </p>
            </div>

            {/* Split viewport */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              {/* Left Column - Form Sliders & Toggles (takes 2 spans out of 5) */}
              <div className="lg:col-span-2">
                <AssetConfigurationPanel
                  inputs={inputs}
                  setInputs={setInputs}
                />
              </div>

              {/* Right Column - Big stats calculations, water plots & leads (takes 3 spans out of 5) */}
              <div className="lg:col-span-3">
                <ValuationMetricsPanel
                  valuation={valuation}
                  lastSimulationId={lastSimulationId}
                  onLeadCaptured={handleLeadCaptured}
                  isLoadingLead={isLoadingLead}
                />
              </div>
            </div>

            {/* Bottom: technical statistics folder */}
            <div className="mt-2">
              <TechnicalSpecs />
            </div>
          </div>
        ) : (
          /* SECTION 2: BUSINESS ANALYTICS METRICS (SQLite) */
          <InvestorAnalyticsDashboard
            analytics={analytics}
            onRefresh={fetchAnalytics}
            isRefreshing={isRefreshingAnalytics}
          />
        )}
      </main>
    </div>
  );
}
