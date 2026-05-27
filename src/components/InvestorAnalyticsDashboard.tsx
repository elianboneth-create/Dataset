/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { AnalyticsSummary } from "../types";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  Database, 
  RefreshCw, 
  TrendingUp, 
  Users, 
  Clock, 
  Grid, 
  Maximize2,
  DollarSign,
  SearchCheck,
  AlertCircle
} from "lucide-react";

interface InvestorAnalyticsDashboardProps {
  analytics: AnalyticsSummary | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function InvestorAnalyticsDashboard({
  analytics,
  onRefresh,
  isRefreshing,
}: InvestorAnalyticsDashboardProps) {

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Safe variables parsing
  const totalSimulations = analytics?.total_count || 0;
  const avgPrice = analytics?.avg_price || 0;
  const avgArea = analytics?.avg_area || 0;
  const totalLeads = analytics?.total_leads || 0;
  const recentLogs = analytics?.recent || [];

  // Parse points for a simple demand price distribution line
  const graphPoints = recentLogs
    .slice()
    .reverse()
    .map((log, idx) => ({
      index: idx + 1,
      Precio: log.predicted_price,
      Area: log.area,
    }));

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Overview stats */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-brand-gold animate-pulse" />
            Consola Analítica SQLite: Demanda Colectiva
          </h2>
          <p className="text-[11px] text-gray-500 font-mono mt-0.5">
            Métricas de las simulaciones registradas en base de datos local: <code className="text-gray-300">proptech_leads.db</code>
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="bg-white/[0.03] border border-white/10 hover:border-brand-gold hover:bg-brand-gold/10 text-gray-300 hover:text-brand-gold text-xs font-semibold py-2 px-4 rounded-xl transition-all duration-300 flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          Sincronizar SQL
        </button>
      </div>

      {/* KPI Cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="p-5 rounded-2xl bg-charcoal-medium border border-white/5 flex flex-col justify-between premium-glass">
          <div className="flex justify-between items-center text-gray-500 font-mono text-[9px] uppercase tracking-wider">
            <span>Simulaciones Totales</span>
            <SearchCheck className="w-4 h-4 text-brand-gold" />
          </div>
          <span className="text-2xl font-display font-bold text-white mt-3 font-display">
            {totalSimulations}
          </span>
          <p className="text-[10px] text-gray-500 font-mono mt-1 pt-1 border-t border-white/5">
            Consultas totales registradas
          </p>
        </div>

        {/* KPI 2 */}
        <div className="p-5 rounded-2xl bg-charcoal-medium border border-white/5 flex flex-col justify-between premium-glass">
          <div className="flex justify-between items-center text-gray-500 font-mono text-[9px] uppercase tracking-wider">
            <span>Precio promedio tasado</span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <span className="text-2xl font-display font-medium text-white mt-3 leading-none">
            {formatCurrency(avgPrice)}
          </span>
          <p className="text-[10px] text-gray-500 font-mono mt-1 pt-1 border-t border-white/5">
            Valoración media de demanda
          </p>
        </div>

        {/* KPI 3 */}
        <div className="p-5 rounded-2xl bg-charcoal-medium border border-white/5 flex flex-col justify-between premium-glass">
          <div className="flex justify-between items-center text-gray-500 font-mono text-[9px] uppercase tracking-wider">
            <span>Área Promedio buscada</span>
            <Maximize2 className="w-4 h-4 text-brand-gold" />
          </div>
          <span className="text-2xl font-display font-bold text-white mt-3 font-display">
            {avgArea.toLocaleString()} m²
          </span>
          <p className="text-[10px] text-gray-500 font-mono mt-1 pt-1 border-t border-white/5">
            Escala espacial de consultas
          </p>
        </div>

        {/* KPI 4 */}
        <div className="p-5 rounded-2xl bg-charcoal-medium border border-white/5 flex flex-col justify-between premium-glass">
          <div className="flex justify-between items-center text-gray-500 font-mono text-[9px] uppercase tracking-wider">
            <span>Leads Capturados (emails)</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-2xl font-display font-bold text-white mt-3 font-display">
            {totalLeads}
          </span>
          <p className="text-[10px] text-gray-500 font-mono mt-1 pt-1 border-t border-white/5">
            Tasa de conversión de lead
          </p>
        </div>

      </div>

      {/* Grid of graph and logging tables */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Trend line graph */}
        <div className="lg:col-span-3 p-6 rounded-2xl bg-charcoal-medium border border-white/5 flex flex-col gap-4 premium-glass">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Historial de Rangos de Demanda (Precios)
            </h4>
            <span className="text-[10px] text-gray-500 font-mono block mt-0.5">
              Fluctuación de precios simulados secuencialmente en el mercado
            </span>
          </div>

          <div className="h-48 select-none">
            {graphPoints.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-gray-500 font-mono bg-charcoal-dark/30 rounded border border-white/[0.02]">
                Esperando interacciones del simulador para graficar...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphPoints}>
                  <CartesianGrid stroke="#1F2224" strokeDasharray="3 3" />
                  <XAxis dataKey="index" stroke="#6B7280" fontSize={9} label={{ value: "Sims", position: "insideBottomRight", offset: -5 }} />
                  <YAxis stroke="#6B7280" fontSize={9} tickFormatter={(tick) => formatCurrency(tick).replace("US$", "").replace("$", "")} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#141617", borderColor: "#10B981", borderRadius: "8px", fontSize: "11px" }}
                    formatter={(value: any) => [formatCurrency(Number(value)), "Precio"]}
                  />
                  <Line type="monotone" dataKey="Precio" stroke="#10B981" strokeWidth={2.5} dot={{ fill: "#10B981", r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Database log inspector */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-charcoal-medium border border-white/5 flex flex-col gap-4 premium-glass overflow-hidden">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Logs de SQLite en Tiempo Real
              </h4>
              <span className="text-[10px] text-gray-500 font-mono block mt-0.5">
                Inspector directo de tabla "simulations"
              </span>
            </div>
            <Clock className="w-4 h-4 text-brand-gold shrink-0" />
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto max-h-48 scrollbar">
            {recentLogs.length === 0 ? (
              <div className="p-4 rounded border border-dashed border-white/5 text-center text-gray-500 font-mono text-[10px]">
                No hay actividades aún. Cambie los parámetros del simulador para escribir logs silenciosos.
              </div>
            ) : (
              recentLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="p-3 bg-charcoal-dark/75 rounded-lg border border-white/5 font-mono text-[10px] flex flex-col gap-1 hover:border-white/10 transition-all"
                >
                  <div className="flex justify-between font-bold">
                    <span className="text-brand-gold">ID: #{log.id}</span>
                    <span className="text-white">{formatCurrency(log.predicted_price)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-[9px]">
                    <span>Área: {log.area} m² | Baños: {log.bathrooms}</span>
                    <span>{log.timestamp ? log.timestamp.substring(11, 19) : "En vivo"}</span>
                  </div>
                  {log.user_email && (
                    <div className="mt-1 pt-1 border-t border-white/5 text-[9px] text-blue-400 flex items-center gap-1">
                      <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                      Email: {log.user_email}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

        </div>

      </div>

      {/* Database manager notification */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-start gap-2.5 text-[11px] leading-relaxed">
        <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
        <div>
          <strong>Capa de Persistencia Tolerante a Fallos:</strong> El backend ejecuta las transacciones de manera asíncrona no-bloqueante. El archivo `proptech_leads.db` está protegido por un context manager robusto, lo cual garantiza que ante fallos eventuales del motor de base de datos o permisos modificados, la lógica de predicción del MVP nunca dejará de responder a sus clientes.
        </div>
      </div>

    </div>
  );
}
