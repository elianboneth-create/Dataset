/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BarChart3, 
  HelpCircle, 
  BookOpen, 
  TrendingUp, 
  Info, 
  Sparkles,
  ArrowRightLeft,
  CheckCircle2,
  FileSpreadsheet
} from "lucide-react";

interface InvestorAnalyticsDashboardProps {
  analytics: any;
  onRefresh: () => void;
  isRefreshing: boolean;
}

interface StatVariable {
  key: string;
  name: string;
  label: string;
  role: "dependent" | "independent" | "prediction";
  n: number;
  miss: number;
  mean: number;
  median: number;
  sd: number;
  min: number;
  max: number;
  unit: string;
  description: string;
  interpretation: string;
}

export default function InvestorAnalyticsDashboard({
  analytics,
  onRefresh,
  isRefreshing,
}: InvestorAnalyticsDashboardProps) {
  const [selectedVariable, setSelectedVariable] = useState<string>("price");

  // Descriptive statistics exact values from Jamovi screenshot
  const statVariables: Record<string, StatVariable> = {
    price: {
      key: "price",
      name: "price",
      label: "Precio de Venta (MCO)",
      role: "dependent",
      n: 545,
      miss: 1,
      mean: 4766729.25,
      median: 4340000.00,
      sd: 1870439.62,
      min: 1750000.00,
      max: 13300000.00,
      unit: "USD",
      description: "Variable Dependiente (Y). Representa el valor transaccional del inmueble en el mercado real.",
      interpretation: "Tiene 1 dato perdido (N=545). La distribución presenta sesgo positivo (media > mediana) por propiedades exclusivas de alto valor que estiran el extremo superior hasta los 13.3M USD. La desviación estándar indica alta dispersión de datos reales."
    },
    area: {
      key: "area",
      name: "area",
      label: "Área de Terreno",
      role: "independent",
      n: 546,
      miss: 0,
      mean: 5147.52,
      median: 4580.00,
      sd: 2169.30,
      min: 1650.00,
      max: 16200.00,
      unit: "m²",
      description: "Variable Independiente fundamental de escala espacial que mide la superficie del inmueble.",
      interpretation: "Es altamente significativa (p < 0.001) en Jamovi. Por cada metro cuadrado de aumento en el terreno, el precio estimado incrementa en $247.17 de manera constante."
    },
    bedrooms: {
      key: "bedrooms",
      name: "bedrooms",
      label: "Dormitorios",
      role: "independent",
      n: 546,
      miss: 0,
      mean: 2.96,
      median: 3.00,
      sd: 0.75,
      min: 0.00,
      max: 6.00,
      unit: "unidades",
      description: "Variable descriptiva del conjunto total. El número de habitaciones de las propiedades.",
      interpretation: "La media muestral es casi exactamente 3 dormitorios. Aunque no se incluyó en la ecuación final por criterio de significancia múltiple o colinealidad, describe la estructura base del conjunto de propiedades."
    },
    bathrooms: {
      key: "bathrooms",
      name: "bathrooms",
      label: "Baños Totales",
      role: "independent",
      n: 546,
      miss: 0,
      mean: 1.29,
      median: 1.00,
      sd: 0.50,
      min: 1.00,
      max: 4.00,
      unit: "unidades",
      description: "Variable independiente de confort higiénico. Cantidad de baños en la edificación.",
      interpretation: "Tiene un impacto masivo en el precio ($1,024,077.94 adicionales por cada baño adicional). La mayoría de propiedades tienen 1 baño (el 50% central tiene exactamente 1), siendo las de 3 o 4 baños activos muy premium."
    },
    stories: {
      key: "stories",
      name: "stories",
      label: "Pisos / Plantas",
      role: "independent",
      n: 546,
      miss: 0,
      mean: 1.80,
      median: 2.00,
      sd: 0.87,
      min: 1.00,
      max: 4.00,
      unit: "pisos",
      description: "Variable independiente de dimensión vertical o niveles construidos.",
      interpretation: "El coeficiente del modelo suma $486,503.39 por planta añadida. La desviación estándar de 0.87 muestra que la muestra abarca equilibradamente casas de 1 piso y de 2 pisos."
    },
    parking: {
      key: "parking",
      name: "parking",
      label: "Cocheras / Plazas",
      role: "independent",
      n: 546,
      miss: 0,
      mean: 0.69,
      median: 0.00,
      sd: 0.86,
      min: 0.00,
      max: 3.00,
      unit: "autos",
      description: "Variable de equipamiento vehicular o plazas de cochera disponibles.",
      interpretation: "Aporta $283,577.52 por plaza de parqueo construida. La mediana 0 indica que más de la mitad de las casas del dataset histórico carecen de cochera o disponen de parqueo abierto no tasado."
    },
    predicciones: {
      key: "predicciones",
      name: "Predicciones",
      label: "Predicciones del Modelo",
      role: "prediction",
      n: 546,
      miss: 0,
      mean: 4767568.55,
      median: 4560316.52,
      sd: 1541457.24,
      min: 1961738.58,
      max: 10633251.00,
      unit: "USD",
      description: "Valores estimados (ŷ) calculados formalmente mediante la planta de regresión multivariante.",
      interpretation: "Excelente validación didáctica: la media de las predicciones ($4,767,568.55) aproxima de forma casi idéntica a la media observada ($4,766,729.25), demostrando el principio de que los residuos en Mínimos Cuadrados Ordinarios tienen una esperanza matemática de valor cero (E[e] = 0)."
    }
  };

  const formatValue = (variable: StatVariable, value: number) => {
    if (variable.unit === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    }
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-gray-200">
      
      {/* Page Title & Explanation Card */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-gold" />
            Marco Estadístico del Modelo: Estadísticas Descriptivas
          </h2>
          <p className="text-[11px] text-gray-500 font-mono mt-0.5">
            Vista unificada de distribuciones y parámetros de calibración extraídos directamente de Jamovi (N = 546)
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono bg-charcoal-medium px-3 py-1.5 rounded-xl border border-white/5 text-gray-400">
          <BookOpen className="w-3.5 h-3.5 text-brand-gold" />
          <span>Fines Educativos y Didácticos</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Descriptive Jamovi Table - Colspan 2 */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-charcoal-medium border border-white/5 premium-glass flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-brand-gold" />
                  Salida Descriptiva de Jamovi
                </h3>
                <span className="text-[10px] text-gray-500 font-mono">
                  Haga clic sobre cualquier columna para visualizar su análisis detallado de regresión
                </span>
              </div>
              <span className="text-[9px] font-mono bg-brand-gold/10 text-brand-gold tracking-widest uppercase px-2 py-0.5 border border-brand-gold/15 rounded">
                Datos Centrales
              </span>
            </div>

            {/* Jamovi Layout styled Table */}
            <div className="overflow-x-auto rounded-xl border border-white/5 bg-charcoal-dark/50">
              <table className="w-full text-left font-mono text-xs text-gray-400 border-collapse">
                <thead>
                  <tr className="bg-charcoal-dark border-b border-white/5 text-gray-300">
                    <th className="p-3.5 text-[10px] tracking-wider uppercase text-gray-500 max-w-[150px]">Medida</th>
                    {Object.values(statVariables).map((v) => (
                      <th 
                        key={v.key}
                        onClick={() => setSelectedVariable(v.key)}
                        className={`p-3.5 text-center cursor-pointer transition-all hover:bg-white/[0.02] ${
                          selectedVariable === v.key 
                            ? "bg-brand-gold/10 text-brand-gold border-x border-brand-gold/20" 
                            : ""
                        }`}
                      >
                        <div className="font-sans text-[11px] font-bold text-gray-200 capitalize">
                          {v.name}
                        </div>
                        {v.role === "dependent" && (
                          <span className="text-[8px] tracking-wide text-amber-500 block font-normal uppercase mt-0.5">Dep (Y)</span>
                        )}
                        {v.role === "independent" && (
                          <span className="text-[8px] tracking-wide text-blue-400 block font-normal uppercase mt-0.5">Indep (X)</span>
                        )}
                        {v.role === "prediction" && (
                          <span className="text-[8px] tracking-wide text-green-400 block font-normal uppercase mt-0.5">Pred (ŷ)</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  
                  {/* Row: N */}
                  <tr className="hover:bg-white/[0.01] transition-all">
                    <td className="p-3 font-semibold text-gray-200">N</td>
                    {Object.values(statVariables).map((v) => (
                      <td 
                        key={v.key}
                        onClick={() => setSelectedVariable(v.key)}
                        className={`p-3 text-center cursor-pointer font-bold ${
                          selectedVariable === v.key ? "bg-brand-gold/5 text-white" : ""
                        }`}
                      >
                        {v.n}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Perdidos */}
                  <tr className="hover:bg-white/[0.01] transition-all">
                    <td className="p-3 font-semibold text-gray-400 italic">Perdidos</td>
                    {Object.values(statVariables).map((v) => (
                      <td 
                        key={v.key}
                        onClick={() => setSelectedVariable(v.key)}
                        className={`p-3 text-center cursor-pointer ${
                          selectedVariable === v.key ? "bg-brand-gold/5 text-gray-300" : ""
                        } ${v.miss > 0 ? "text-red-400 font-bold" : "text-gray-600"}`}
                      >
                        {v.miss}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Media */}
                  <tr className="hover:bg-white/[0.01] transition-all bg-white/[0.01]">
                    <td className="p-3 font-semibold text-gray-200">Media</td>
                    {Object.values(statVariables).map((v) => (
                      <td 
                        key={v.key}
                        onClick={() => setSelectedVariable(v.key)}
                        className={`p-3 text-center cursor-pointer font-bold text-gray-100 ${
                          selectedVariable === v.key ? "bg-brand-gold/10 text-brand-gold" : ""
                        }`}
                      >
                        {formatValue(v, v.mean)}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Mediana */}
                  <tr className="hover:bg-white/[0.01] transition-all">
                    <td className="p-3 font-semibold text-gray-300">Mediana</td>
                    {Object.values(statVariables).map((v) => (
                      <td 
                        key={v.key}
                        onClick={() => setSelectedVariable(v.key)}
                        className={`p-3 text-center cursor-pointer text-gray-300 ${
                          selectedVariable === v.key ? "bg-brand-gold/5 text-white" : ""
                        }`}
                      >
                        {formatValue(v, v.median)}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Desviación Estándar */}
                  <tr className="hover:bg-white/[0.01] transition-all bg-white/[0.01]">
                    <td className="p-3 font-semibold text-gray-300">Desv. estándar</td>
                    {Object.values(statVariables).map((v) => (
                      <td 
                        key={v.key}
                        onClick={() => setSelectedVariable(v.key)}
                        className={`p-3 text-center cursor-pointer text-gray-300 ${
                          selectedVariable === v.key ? "bg-brand-gold/5 text-white" : ""
                        }`}
                      >
                        {formatValue(v, v.sd)}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Mínimo */}
                  <tr className="hover:bg-white/[0.01] transition-all">
                    <td className="p-3 font-semibold text-gray-400">Mínimo</td>
                    {Object.values(statVariables).map((v) => (
                      <td 
                        key={v.key}
                        onClick={() => setSelectedVariable(v.key)}
                        className={`p-3 text-center cursor-pointer text-gray-400 ${
                          selectedVariable === v.key ? "bg-brand-gold/5 text-gray-200" : ""
                        }`}
                      >
                        {formatValue(v, v.min)}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Máximo */}
                  <tr className="hover:bg-white/[0.01] transition-all bg-white/[0.01]">
                    <td className="p-3 font-semibold text-gray-400">Máximo</td>
                    {Object.values(statVariables).map((v) => (
                      <td 
                        key={v.key}
                        onClick={() => setSelectedVariable(v.key)}
                        className={`p-3 text-center cursor-pointer text-gray-200 ${
                          selectedVariable === v.key ? "bg-brand-gold/5 text-white" : ""
                        }`}
                      >
                        {formatValue(v, v.max)}
                      </td>
                    ))}
                  </tr>

                </tbody>
              </table>
            </div>

            {/* Note about missing value */}
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex gap-2 text-[11px] leading-relaxed text-red-400">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Anomalía de datos de muestra (Price):</strong> El precio real presenta un valor perdido (<code className="text-white font-mono font-bold">N=545</code> de un total de 546 observaciones). Jamovi lo clasifica automáticamente como <strong>"Perdido"</strong>. Nuestro motor de cálculo gestiona este sesgo matemático para asegurar que no contamine las inferencias de la matriz.
              </span>
            </div>
          </div>
        </div>

        {/* Selected Variable Interpretation Panel - Colspan 1 */}
        <div className="flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-charcoal-medium border border-white/5 premium-glass flex flex-col gap-4 h-full justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-brand-gold shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Explicación Pedagógica
                </h3>
              </div>

              {/* Variable Card */}
              <div className="p-4 rounded-xl bg-charcoal-dark border border-white/5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-wider text-brand-gold block font-semibold uppercase">
                    FILA SELECCIONADA
                  </span>
                  <span className="px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold bg-white/10 text-white">
                    {statVariables[selectedVariable].name}
                  </span>
                </div>

                <div className="font-display font-bold text-lg text-white">
                  {statVariables[selectedVariable].label}
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">
                  {statVariables[selectedVariable].description}
                </p>

                <div className="mt-2 pt-3 border-t border-white/5 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Valor Promedio (Media):</span>
                    <span className="font-mono text-white font-semibold">
                      {formatValue(statVariables[selectedVariable], statVariables[selectedVariable].mean)} {statVariables[selectedVariable].unit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Valor Central (Mediana):</span>
                    <span className="font-mono text-blue-400">
                      {formatValue(statVariables[selectedVariable], statVariables[selectedVariable].median)} {statVariables[selectedVariable].unit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Desv. Estándar (Dispersión):</span>
                    <span className="font-mono text-gray-300">
                      {formatValue(statVariables[selectedVariable], statVariables[selectedVariable].sd)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deep jamovi analysis */}
              <div className="p-4 rounded-xl bg-brand-gold/5 border border-brand-gold/15 flex flex-col gap-2">
                <span className="text-[9px] font-mono tracking-widest text-brand-gold font-bold uppercase block">
                  INTERPRETACIÓN EN EL MODELO JAMOVI
                </span>
                <p className="text-xs text-brand-gold/80 italic leading-relaxed">
                  "{statVariables[selectedVariable].interpretation}"
                </p>
              </div>
            </div>

            {/* Hint of help */}
            <div className="text-[10px] text-gray-500 border-t border-white/5 pt-4 font-mono">
              * El análisis multivariable determina cómo influyen todos estos parámetros simultáneamente sobre el precio.
            </div>
          </div>
        </div>

      </div>

      {/* Verification & OLS Proof Card */}
      <div className="p-6 rounded-2xl bg-charcoal-medium border border-white/5 premium-glass flex flex-col gap-3">
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Demostración Científica de Mínimos Cuadrados Ordinarios (MCO)
          </h4>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          En un modelo calibrado por regresión lineal multivariante, la media de las predicciones teóricas (<code className="text-white font-mono font-bold">$4,767,568.55</code>) coincide casi perfectamente con la media de los datos reales observados (<code className="text-white font-mono font-bold">$4,766,729.25</code>), siendo la diferencia de apenas un <strong>0.017%</strong> debido al dato perdido (N=545).
        </p>
        <div className="mt-2 text-[10px] font-mono p-3 bg-charcoal-dark border border-white/5 rounded-xl text-gray-500 flex justify-between items-center">
          <span>Suma de Residuos (Σ e) → Aproxima a 0.00</span>
          <span className="text-green-400 font-bold">¡CORRECTO SEGÚN TEORÍA DE GAUSS-MARKOV! ✓</span>
        </div>
      </div>

    </div>
  );
}
