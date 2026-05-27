/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ValuationInputs } from "../types";
import { Sliders, CheckSquare, Layers, Sparkles, Building, MapPin, Eye, Car, Bath, Maximize2 } from "lucide-react";

interface AssetConfigurationPanelProps {
  inputs: ValuationInputs;
  setInputs: React.Dispatch<React.SetStateAction<ValuationInputs>>;
}

export default function AssetConfigurationPanel({
  inputs,
  setInputs,
}: AssetConfigurationPanelProps) {
  const [activeTab, setActiveTab] = useState<"structure" | "amenities">("structure");

  const handleChange = <K extends keyof ValuationInputs>(key: K, value: ValuationInputs[K]) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="bg-charcoal-medium rounded-2xl border border-white/5 p-6 flex flex-col gap-6 shadow-xl premium-glass">
      {/* Tab Header for input grouping */}
      <div className="flex border-b border-white/5 pb-2">
        <button
          onClick={() => setActiveTab("structure")}
          className={`flex items-center gap-2 pb-3 px-2 text-xs font-semibold tracking-wider uppercase border-b-2 transition-all duration-300 ${
            activeTab === "structure"
              ? "border-brand-gold text-brand-gold font-bold"
              : "border-transparent text-gray-500 hover:text-white"
          }`}
        >
          <Building className="w-4 h-4" />
          1. Estructura del Activo
        </button>
        <button
          onClick={() => setActiveTab("amenities")}
          className={`flex items-center gap-2 pb-3 px-2 text-xs font-semibold tracking-wider uppercase border-b-2 transition-all duration-300 ml-4 ${
            activeTab === "amenities"
              ? "border-brand-gold text-brand-gold font-bold"
              : "border-transparent text-gray-500 hover:text-white"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          2. Comodidades & Ubicación
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "structure" ? (
        <div className="flex flex-col gap-6">
          <p className="text-xs text-gray-400 font-mono">
            Defina las cualidades estructurales fundamentales del inmueble. El análisis predictivo es especialmente sensible a la escala de estos atributos.
          </p>

          {/* Area Slider (1650 to 16200 sqft / m2 equivalent) */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                <Maximize2 className="w-3.5 h-3.5 text-brand-gold" />
                Área del Terreno (m²)
              </label>
              <span className="text-sm font-semibold text-brand-gold font-display font-bold">
                {inputs.area.toLocaleString()} m²
              </span>
            </div>
            <input
              type="range"
              min={1650}
              max={16200}
              step={50}
              value={inputs.area}
              onChange={(e) => handleChange("area", Number(e.target.value))}
              className="w-full accent-brand-gold cursor-pointer bg-charcoal-dark h-1.5 rounded-lg border border-white/5"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>Mín: 1,650 m²</span>
              <span>Dataset Jamovi bounds</span>
              <span>Máx: 16,200 m²</span>
            </div>
          </div>

          {/* Bathrooms Slider (1 to 4) */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                <Bath className="w-3.5 h-3.5 text-brand-gold" />
                Baños Completos
              </label>
              <span className="text-sm font-semibold text-brand-gold font-display font-bold bg-white/[0.03] px-3 py-1 rounded-md border border-white/5">
                {inputs.bathrooms} {inputs.bathrooms === 1 ? "Baño" : "Baños"}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={4}
              step={1}
              value={inputs.bathrooms}
              onChange={(e) => handleChange("bathrooms", Number(e.target.value))}
              className="w-full accent-brand-gold cursor-pointer bg-charcoal-dark h-1.5 rounded-lg border border-white/5"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>1 Baño</span>
              <span>Coef: +$1,024,077.94 (p &lt; 0.001)</span>
              <span>4 Baños</span>
            </div>
          </div>

          {/* Stories Slider (1 to 4) */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-brand-gold" />
                Pisos / Plantas totales
              </label>
              <span className="text-sm font-semibold text-brand-gold font-display font-bold bg-white/[0.03] px-3 py-1 rounded-md border border-white/5">
                {inputs.stories} {inputs.stories === 1 ? "Planta" : "Plantas"}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={4}
              step={1}
              value={inputs.stories}
              onChange={(e) => handleChange("stories", Number(e.target.value))}
              className="w-full accent-brand-gold cursor-pointer bg-charcoal-dark h-1.5 rounded-lg border border-white/5"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>1 Planta</span>
              <span>Coef: +$486,503.39 (p &lt; 0.001)</span>
              <span>4 Plantas</span>
            </div>
          </div>

          {/* Parking Slider (0 to 3) */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                <Car className="w-3.5 h-3.5 text-brand-gold" />
                Plazas de Estacionamiento
              </label>
              <span className="text-sm font-semibold text-brand-gold font-display font-bold bg-white/[0.03] px-3 py-1 rounded-md border border-white/5">
                {inputs.parking === 0 ? "Sin Cochera" : `${inputs.parking} Garaje(s)`}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={3}
              step={1}
              value={inputs.parking}
              onChange={(e) => handleChange("parking", Number(e.target.value))}
              className="w-full accent-brand-gold cursor-pointer bg-charcoal-dark h-1.5 rounded-lg border border-white/5"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>Sin Cochera</span>
              <span>Coef: +$283,577.52 (p &lt; 0.001)</span>
              <span>3 plazas</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <p className="text-xs text-gray-400 font-mono">
            Active o desactive atributos de valor agregado. Estas variables binarias aportan valor sumatoria directo en la tasación lineal.
          </p>

          {/* Toggle Switches Column Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Air Conditioning */}
            <div className="p-3.5 rounded-xl bg-charcoal-dark/50 border border-white/5 flex items-center justify-between hover:border-brand-gold/30 transition-all">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">Aire Acondicionado</span>
                <span className="text-[10px] text-gray-500 font-mono">+$863,270.43 si aplica</span>
              </div>
              <button
                role="switch"
                aria-checked={inputs.airconditioning}
                onClick={() => handleChange("airconditioning", !inputs.airconditioning)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  inputs.airconditioning ? "bg-brand-gold" : "bg-gray-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-charcoal-dark shadow ring-0 transition duration-200 ease-in-out ${
                    inputs.airconditioning ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Basement */}
            <div className="p-3.5 rounded-xl bg-charcoal-dark/50 border border-white/5 flex items-center justify-between hover:border-brand-gold/30 transition-all">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">Sótano Equipado</span>
                <span className="text-[10px] text-gray-500 font-mono">+$374,040.80 si aplica</span>
              </div>
              <button
                role="switch"
                aria-checked={inputs.basement}
                onClick={() => handleChange("basement", !inputs.basement)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  inputs.basement ? "bg-brand-gold" : "bg-gray-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-charcoal-dark shadow ring-0 transition duration-200 ease-in-out ${
                    inputs.basement ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Hotwater heating */}
            <div className="p-3.5 rounded-xl bg-charcoal-dark/50 border border-white/5 flex items-center justify-between hover:border-brand-gold/30 transition-all">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">Calefón de Agua</span>
                <span className="text-[10px] text-gray-500 font-mono">+$861,783.03 si aplica</span>
              </div>
              <button
                role="switch"
                aria-checked={inputs.hotwaterheating}
                onClick={() => handleChange("hotwaterheating", !inputs.hotwaterheating)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  inputs.hotwaterheating ? "bg-brand-gold" : "bg-gray-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-charcoal-dark shadow ring-0 transition duration-200 ease-in-out ${
                    inputs.hotwaterheating ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Main Road Access */}
            <div className="p-3.5 rounded-xl bg-charcoal-dark/50 border border-white/5 flex items-center justify-between hover:border-brand-gold/30 transition-all">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">Acceso a Vía Principal</span>
                <span className="text-[10px] text-gray-500 font-mono">+$393,735.49 si aplica</span>
              </div>
              <button
                role="switch"
                aria-checked={inputs.mainroad}
                onClick={() => handleChange("mainroad", !inputs.mainroad)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  inputs.mainroad ? "bg-brand-gold" : "bg-gray-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-charcoal-dark shadow ring-0 transition duration-200 ease-in-out ${
                    inputs.mainroad ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Preferred Area */}
            <div className="p-3.5 rounded-xl bg-charcoal-dark/50 border border-white/5 flex items-center justify-between hover:border-brand-gold/30 transition-all">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">Área Preferencial</span>
                <span className="text-[10px] text-gray-500 font-mono">+$655,385.53 de plusvalía</span>
              </div>
              <button
                role="switch"
                aria-checked={inputs.prefarea}
                onClick={() => handleChange("prefarea", !inputs.prefarea)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  inputs.prefarea ? "bg-brand-gold" : "bg-gray-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-charcoal-dark shadow ring-0 transition duration-200 ease-in-out ${
                    inputs.prefarea ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Guest Room */}
            <div className="p-3.5 rounded-xl bg-charcoal-dark/50 border border-white/5 flex items-center justify-between hover:border-brand-gold/30 transition-all">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">Cuarto de Huéspedes</span>
                <span className="text-[10px] text-gray-500 font-mono">+$295,836.20 si aplica</span>
              </div>
              <button
                role="switch"
                aria-checked={inputs.guestroom}
                onClick={() => handleChange("guestroom", !inputs.guestroom)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  inputs.guestroom ? "bg-brand-gold" : "bg-gray-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-charcoal-dark shadow ring-0 transition duration-200 ease-in-out ${
                    inputs.guestroom ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Furnishing Dropdown */}
          <div className="flex flex-col gap-2 mt-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Estado de Amoblado (furnishingstatus)
            </label>
            <select
              value={inputs.furnishingstatus}
              onChange={(e: any) => handleChange("furnishingstatus", e.target.value)}
              className="w-full bg-charcoal-dark text-gray-300 rounded-xl border border-white/5 p-3 text-xs outline-none focus:border-brand-gold font-medium"
            >
              <option value="unfurnished">Sin Amoblar (unfurnished) — Nivel Base: $0</option>
              <option value="semi-furnished">Semi-amoblado (semi-furnished) — Coef: +$373,890.67</option>
              <option value="furnished">Amoblado Completo (furnished) — Coef: +$417,991.06</option>
            </select>
            <span className="text-[10px] text-gray-500 font-mono">
              El modelo Jamovi utiliza "unfurnished" como estado de referencia estadística.
            </span>
          </div>
        </div>
      )}

      {/* Mini Technical disclaimer */}
      <div className="mt-auto border-t border-white/5 pt-4 flex items-center gap-2 text-[10px] text-gray-500 font-mono bg-white/[0.01] p-3 rounded-lg border border-white/5">
        <Sliders className="w-4 h-4 text-brand-gold animate-pulse shrink-0" />
        <span>Cambie cualquier variable. Las variaciones se registran en tiempo real en SQLite y actualizan los gráficos.</span>
      </div>
    </div>
  );
}
