/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ChevronDown, ChevronUp, FileSpreadsheet, Percent, BarChart3, HelpCircle, Layers } from "lucide-react";

export default function TechnicalSpecs() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-charcoal-medium rounded-2xl border border-white/5 shadow-xl overflow-hidden premium-glass transition-all">
      {/* Header/Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/[0.01]"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-brand-gold/10 rounded-lg text-brand-gold">
            <FileSpreadsheet className="w-4.5 h-4.5 stroke-[1.5]" />
          </div>
          <div>
            <span>Ficha Técnica y Respaldo Estadístico del Modelo</span>
            <p className="text-[10px] text-gray-500 font-mono tracking-normal normal-case mt-0.5">
              Valores estimados por mínimos cuadrados ordinarios (MCO) en Jamovi
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-brand-gold stroke-[2]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 hover:text-white stroke-[2]" />
        )}
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="p-6 border-t border-white/5 bg-charcoal-dark/30 flex flex-col gap-6 text-xs text-gray-300 leading-relaxed font-sans">
          
          {/* Main Key Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Stat 1: R-Square */}
            <div className="p-4 rounded-xl bg-charcoal-dark border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">
                Coeficiente R² de Jamovi
              </span>
              <span className="text-2xl font-display font-bold text-white mt-2 font-display">
                0.680
              </span>
              <p className="text-[10px] text-gray-500 font-mono mt-1.5 leading-normal">
                El modelo explica el <strong className="text-brand-gold">68.0%</strong> de la variabilidad del precio residencial.
              </p>
            </div>

            {/* Stat 2: Sample size */}
            <div className="p-4 rounded-xl bg-charcoal-dark border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">
                Muestra Analizada (N)
              </span>
              <span className="text-2xl font-display font-semibold text-white mt-2">
                545 observaciones
              </span>
              <p className="text-[10px] text-gray-500 font-mono mt-1.5 leading-normal">
                Universo poblacional representativo y auditado para consistencia paramétrica.
              </p>
            </div>

            {/* Stat 3: Variable Omission */}
            <div className="p-4 rounded-xl bg-charcoal-dark border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">
                Exclusión Estratégica
              </span>
              <span className="text-xs font-semibold text-red-400 mt-2 flex items-center gap-1.5">
                • Variable 'bedrooms' omitida
              </span>
              <p className="text-[10px] text-gray-500 font-mono mt-1.5 leading-normal">
                Su p-valor &gt; 0.05 demuestra falta de significancia marginal explicativa tras ajustar por Área.
              </p>
            </div>

          </div>

          {/* Model Mathematical Formula Display */}
          <div className="p-4 rounded-xl bg-charcoal-dark border border-white/10 font-mono text-[11px]">
            <span className="text-[9px] uppercase tracking-widest text-brand-gold font-bold block mb-1">
              Fórmula de Regresión de Precisión Lineal Múltiple
            </span>
            <div className="bg-charcoal-medium p-3 rounded border border-white/5 text-gray-300 font-mono overflow-x-auto select-all leading-relaxed whitespace-pre-wrap">
              Precio Estimado = -149,472.84 
              {"\n"}  + (247.17 × Área) 
              {"\n"}  + (1,024,077.94 × Baños) 
              {"\n"}  + (486,503.39 × Pisos) 
              {"\n"}  + (283,577.52 × Cocheras) 
              {"\n"}  + (863,270.43 × Aire Acondicionado) 
              {"\n"}  + (393,735.49 × Acceso Vía Principal) 
              {"\n"}  + (295,836.20 × Cuarto de Huéspedes) 
              {"\n"}  + (374,040.80 × Sótano Equipado) 
              {"\n"}  + (861,783.03 × Boiler / Calefón de Agua) 
              {"\n"}  + (655,385.53 × Área Preferencial) 
              {"\n"}  + (Valor de Amoblado: Unfurnished=0 / Semi-furnished=+373,890.67 / Furnished=+417,991.06)
            </div>
          </div>

          {/* Business Rationale Accordion details */}
          <div className="bg-white/[0.01] p-4 rounded-xl border border-white/5 flex flex-col gap-3 font-mono text-[10px] text-gray-400">
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-brand-gold" />
              Rigurosidad Analítica PropTech
            </h5>
            <p className="leading-relaxed">
              En econometría inmobiliaria tradicional, la cantidad de habitaciones totales ('bedrooms') suele colisionar con el Área total construida. Esto genera el fenómeno estadístico de <strong className="text-brand-gold">Colinealidad de Atributos</strong>.
            </p>
            <p className="leading-relaxed">
              El análisis estadístico en Jamovi demostró que con el área y el número de baños incorporados, los dormitorios adicionales resultaban redundantes para determinar la variación del valor (p-valor marginal de bedrooms = 0.124). Excluirla evita que el modelo infle artificialmente las predicciones en carteras con alta densidad de distribución de cuartos.
            </p>
          </div>

        </div>
      )}
    </div>
  );
}
