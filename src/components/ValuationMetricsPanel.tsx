/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ValuationResult } from "../types";
import { COEFFICIENTS } from "../prediction_engine";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";
import { 
  TrendingUp, 
  ShieldCheck, 
  Download, 
  Mail, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  FileText,
  DollarSign,
  Info,
  Eye
} from "lucide-react";

interface ValuationMetricsPanelProps {
  valuation: ValuationResult;
  lastSimulationId: number | null;
  onLeadCaptured: (email: string) => void;
  isLoadingLead: boolean;
}

export default function ValuationMetricsPanel({
  valuation,
  lastSimulationId,
  onLeadCaptured,
  isLoadingLead,
}: ValuationMetricsPanelProps) {
  const { predictedPrice, minPrice, maxPrice, contributions } = valuation;

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [leadRegistered, setLeadRegistered] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  // Parse contributions for Recharts (omitting 0 contributions to keep it clean)
  const chartData = contributions
    .filter((item) => item.value !== 0)
    .map((item) => ({
      name: item.name,
      Valor: item.value,
      Acumulado: item.cumulative,
    }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setEmailError("Se requiere un correo electrónico");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Por favor, ingrese un correo estructurado y válido");
      return;
    }

    setEmailError("");
    onLeadCaptured(email);
    setLeadRegistered(true);
    setShowCertificate(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. MAIN KPI CARD */}
      <div className="p-7 rounded-2xl bg-gradient-to-br from-charcoal-medium to-charcoal-dark border border-brand-gold/25 relative overflow-hidden shadow-2xl">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-brand-gold/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="flex items-center justify-between mb-3 text-xs tracking-wider text-gray-500 font-mono uppercase">
          <span>VALORACIÓN DEL ACTIVO (BI-PRED)</span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Modelo Estable
          </span>
        </div>

        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            {formatCurrency(predictedPrice)}
          </span>
          <span className="text-sm font-semibold text-brand-gold font-mono uppercase tracking-widest ml-1">
            USD
          </span>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.01] p-3.5 rounded-xl">
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-gray-500">
              Rango de Confianza Comercial (±5%)
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono text-gray-400">{formatCurrency(minPrice)}</span>
              <span className="text-gray-600">—</span>
              <span className="text-xs font-mono text-gray-300 font-bold">{formatCurrency(maxPrice)}</span>
              <span className="text-xs font-mono text-gray-300">USD</span>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 italic max-w-[200px] leading-relaxed self-center text-right sm:text-right hidden sm:block">
            Tasación comercial sugerida para negociaciones de mercado.
          </p>
        </div>
      </div>

      {/* 2. ADVANCED WATERFALL / BLOCK CHART */}
      <div className="p-6 rounded-2xl bg-charcoal-medium border border-white/5 premium-glass">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Suma de Contribución de Características
            </h3>
            <p className="text-[10px] text-gray-500 font-mono mt-0.5">
              Análisis descriptivo de impacto financiero unitario en dólares (USD)
            </p>
          </div>
          <TrendingUp className="w-4 h-4 text-brand-gold shrink-0" />
        </div>

        <div className="h-64 select-none">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 10, left: 25, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3033" horizontal={false} />
              <XAxis 
                type="number" 
                stroke="#6B7280" 
                fontSize={9} 
                tickFormatter={(tick) => formatCurrency(tick).replace("US$", "").replace("$", "")}
                domain={["auto", "auto"]}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#9CA3AF" 
                fontSize={8} 
                width={100}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#141617",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
                formatter={(value: any) => [formatCurrency(Number(value)), "Impacto"]}
              />
              <Bar dataKey="Valor" fill="#10B981">
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.Valor >= 0 ? (entry.name.includes("Base") ? "#4B5563" : "#10B981") : "#EF4444"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Dynamic Attributes contribution Breakdown list */}
        <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] text-gray-400 font-mono">
          <div className="flex items-center justify-between py-1 bg-white/[0.01] px-2 rounded">
            <span>Área:</span>
            <span className="text-green-400 font-semibold">
              +{formatCurrency(contributions[1].value)}
            </span>
          </div>
          <div className="flex items-center justify-between py-1 bg-white/[0.01] px-2 rounded">
            <span>Baños:</span>
            <span className="text-green-400 font-semibold">
              +{formatCurrency(contributions[2].value)}
            </span>
          </div>
          <div className="flex items-center justify-between py-1 bg-white/[0.01] px-2 rounded">
            <span>Plantas:</span>
            <span className="text-green-400 font-semibold">
              +{formatCurrency(contributions[3].value)}
            </span>
          </div>
          <div className="flex items-center justify-between py-1 bg-white/[0.01] px-2 rounded">
            <span>Cocheras:</span>
            <span className="text-green-400 font-semibold">
              +{formatCurrency(contributions[4].value)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. COHORT LEAD CAPTURE FORM */}
      <div className="p-6 rounded-2xl bg-charcoal-medium border border-white/5 relative">
        {!leadRegistered ? (
          <form onSubmit={handleLeadSubmit} className="flex flex-col gap-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-gold" />
                Obtener Certificado de Valoración Oficial
              </h4>
              <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                Ingrese las credenciales del cliente para sincronizar en la base de datos SQL y generar el informe certificado de tasación de alta fidelidad.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full bg-charcoal-dark border border-white/5 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-600 outline-none premium-border-glow focus:border-brand-gold"
                />
              </div>

              <button
                type="submit"
                disabled={isLoadingLead}
                className="bg-brand-gold hover:bg-brand-gold/90 text-charcoal-dark font-semibold text-xs py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isLoadingLead ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                Exportar Certificado
              </button>
            </div>
            {emailError && (
              <span className="text-[10px] text-red-500 font-mono">{emailError}</span>
            )}
          </form>
        ) : (
          <div className="flex flex-col gap-3 py-1">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-green-500/15 rounded-lg border border-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                  ¡Lead Capturado Corectamente!
                </h5>
                <p className="text-[10px] text-gray-400">
                  Sincronizado en <code className="text-brand-gold font-mono">proptech_leads.db</code> ID: {lastSimulationId || "último"}
                </p>
              </div>
            </div>

            <p className="text-[10px] text-gray-500 font-mono leading-normal">
              Correo: <strong className="text-white">{email}</strong>. El registro se ha asociado de manera asíncrona.
            </p>

            <div className="flex gap-2 mt-1">
              <button
                onClick={() => setShowCertificate(true)}
                className="flex-1 bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-white text-xs py-2 px-3 rounded-lg transition-all font-semibold flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-brand-gold" />
                Ver Certificado de Tasación
              </button>
              <button
                onClick={() => {
                  setLeadRegistered(false);
                  setEmail("");
                }}
                className="text-gray-500 hover:text-white text-[10px] font-mono"
              >
                Registrar otro
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. HIGH-END CERTIFICATE PREVIEW MODAL */}
      {showCertificate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-charcoal-medium border border-brand-gold/30 rounded-3xl max-w-lg w-full p-8 shadow-2xl relative flex flex-col gap-6 text-left">
            
            {/* Header stamps */}
            <div className="flex justify-between items-start border-b border-brand-gold/20 pb-4">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-brand-gold block font-semibold uppercase">
                  REPORTE CERTIFICADO OFICIAL
                </span>
                <h3 className="font-display font-bold text-lg text-white mt-0.5">
                  AUREUM PROPTECH SYSTEMS
                </h3>
              </div>
              <div className="px-3 py-1.5 bg-brand-gold/15 text-brand-gold border border-brand-gold/30 rounded font-mono text-[9px] uppercase font-bold tracking-wider">
                ✓ CERTIFICADO COMPLETO
              </div>
            </div>

            {/* Content list */}
            <div className="flex flex-col gap-4 py-1 text-xs">
              <div className="p-4 bg-charcoal-dark border border-white/5 rounded-xl flex flex-col gap-2">
                <div className="flex justify-between text-gray-500 font-mono text-[10px]">
                  <span>REMITENTE LEAD</span>
                  <span>BASE DE DATOS LOCAL</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-400">Correo Electrónico:</span>
                  <span className="text-white font-mono">{email || "Sin registrar"}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-400">ID Registro SQL:</span>
                  <span className="text-brand-gold font-mono font-bold">#{lastSimulationId || "ID_NUEVO"}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-400">Timestamp Servidor:</span>
                  <span className="text-white font-mono">{new Date().toISOString().substring(0, 10)}</span>
                </div>
              </div>

              {/* Specs detailed summary */}
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-gray-500 block mb-2">
                  Atributos Declarados para Tasación
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-gray-400">
                  <div className="p-2 bg-white/[0.01] rounded">Área Terreno: {Math.round(valuation.contributions[1].value / COEFFICIENTS.coef_area)} m²</div>
                  <div className="p-2 bg-white/[0.01] rounded">Baños Totales: {Math.round(valuation.contributions[2].value / COEFFICIENTS.coef_bathrooms)}</div>
                  <div className="p-2 bg-white/[0.01] rounded">Pisos totales: {Math.round(valuation.contributions[3].value / COEFFICIENTS.coef_stories)}</div>
                  <div className="p-2 bg-white/[0.01] rounded">Plazas Cochera: {Math.round(valuation.contributions[4].value / COEFFICIENTS.coef_parking)}</div>
                </div>
              </div>

              {/* Big price conclusion */}
              <div className="p-4 rounded-xl bg-brand-gold/10 border border-brand-gold/30 text-center">
                <span className="text-[9px] font-mono tracking-widest text-brand-gold block uppercase font-bold text-center">
                  CÁLCULO DEL PRECIO REITERADO
                </span>
                <span className="text-2xl font-display font-bold text-white block mt-1">
                  {formatCurrency(predictedPrice)} USD
                </span>
                <div className="text-[10px] text-gray-400 mt-1 font-mono">
                  Rango comercial de confianza: {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-gray-500 leading-relaxed font-mono">
                <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                <span>La presente valoración es el resultado de la regresión lineal múltiple con un R² de 0.680 con control de error residual comercial de +/- 5%.</span>
              </div>
            </div>

            {/* Footer triggers */}
            <div className="flex gap-2 pt-4 border-t border-white/5">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 bg-brand-gold text-charcoal-dark font-bold text-xs py-2.5 rounded-xl hover:bg-brand-gold/90 transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Imprimir / Guardar PDF
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="bg-charcoal-dark border border-white/10 hover:border-white/20 text-gray-400 hover:text-white text-xs px-5 py-2.5 rounded-xl transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
