import React, { useState } from 'react';
import { Calculator, Info } from 'lucide-react';
import type { AreaUnit } from '../../types';
import { convertArea, REGIONAL_BIGHA_RULES } from '../../domain/india/area';

interface AreaConverterWidgetProps {
  initialAreaSqFt?: number;
  className?: string;
}

export const AreaConverterWidget: React.FC<AreaConverterWidgetProps> = ({
  initialAreaSqFt = 1500,
  className = ''
}) => {
  const [inputVal, setInputVal] = useState<number>(initialAreaSqFt);
  const [fromUnit, setFromUnit] = useState<AreaUnit>('sqft');
  const [toUnit, setToUnit] = useState<AreaUnit>('sqyd');
  const [selectedRegion, setSelectedRegion] = useState<string>('UP');

  const convertedResult = convertArea(inputVal, fromUnit, toUnit, selectedRegion);
  const isBighaInvolved = fromUnit === 'bigha' || toUnit === 'bigha';

  return (
    <div className={`bg-white rounded-2xl p-5 border border-navy-900/10 shadow-sm text-navy-900 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-orange-500" />
          <h4 className="font-extrabold text-sm text-navy-900">
            Indian Real Estate Area Converter
          </h4>
        </div>
        <span className="text-[10px] font-bold text-gray-400 bg-cream-200 px-2 py-0.5 rounded-full">
          Gaj · Sq Ft · Bigha · Acre
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {/* Input Value & Source Unit */}
        <div>
          <label className="block text-[11px] font-bold text-navy-800 mb-1">Enter Value</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={inputVal || ''}
              onChange={e => setInputVal(Number(e.target.value))}
              className="w-1/2 px-3 py-2 bg-cream-50 border border-navy-900/15 rounded-xl text-xs font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <select
              value={fromUnit}
              onChange={e => setFromUnit(e.target.value as AreaUnit)}
              className="w-1/2 px-2 py-2 bg-cream-50 border border-navy-900/15 rounded-xl text-xs font-bold text-navy-900 focus:outline-none"
            >
              <option value="sqft">Sq. Ft.</option>
              <option value="sqyd">Sq. Yd. (Gaj)</option>
              <option value="sqm">Sq. Metres</option>
              <option value="acre">Acres</option>
              <option value="hectare">Hectares</option>
              <option value="bigha">Bigha</option>
            </select>
          </div>
        </div>

        {/* Target Unit & Result */}
        <div>
          <label className="block text-[11px] font-bold text-navy-800 mb-1">Converted To</label>
          <div className="flex gap-2">
            <div className="w-1/2 px-3 py-2 bg-orange-500/10 border border-orange-500/30 rounded-xl text-xs font-extrabold text-orange-600 flex items-center">
              {convertedResult.toLocaleString('en-IN')}
            </div>
            <select
              value={toUnit}
              onChange={e => setToUnit(e.target.value as AreaUnit)}
              className="w-1/2 px-2 py-2 bg-cream-50 border border-navy-900/15 rounded-xl text-xs font-bold text-navy-900 focus:outline-none"
            >
              <option value="sqyd">Sq. Yd. (Gaj)</option>
              <option value="sqft">Sq. Ft.</option>
              <option value="sqm">Sq. Metres</option>
              <option value="acre">Acres</option>
              <option value="hectare">Hectares</option>
              <option value="bigha">Bigha</option>
            </select>
          </div>
        </div>
      </div>

      {/* Regional Bigha Rule selector when Bigha is selected */}
      {isBighaInvolved && (
        <div className="mt-3 p-3 bg-amber-soft/20 rounded-xl border border-orange-500/20 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-navy-900 flex items-center gap-1 text-[11px]">
              <Info className="w-3.5 h-3.5 text-orange-500" />
              Regional Bigha Standard:
            </span>
            <select
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value)}
              className="px-2 py-0.5 bg-white border border-navy-900/15 rounded text-[11px] font-bold"
            >
              <option value="UP">Uttar Pradesh (Pucca Bigha - 27,225 sq ft)</option>
              <option value="HARYANA">Haryana / Punjab (9,075 sq ft)</option>
              <option value="BENGAL">West Bengal (14,400 sq ft)</option>
              <option value="RAJASTHAN">Rajasthan (17,424 sq ft)</option>
              <option value="DEFAULT">India Standard Pucca (27,225 sq ft)</option>
            </select>
          </div>
          <p className="text-[10px] text-navy-700 italic">
            {REGIONAL_BIGHA_RULES[selectedRegion]?.subUnitsNote}
          </p>
        </div>
      )}
    </div>
  );
};
