"use client";

import React, { useState, useEffect } from "react";

interface PriceRangeProps {
  min: number;
  max: number;
  onChange: (minValue: number, maxValue: number) => void;
}

const PriceRange = ({ min, max, onChange }: PriceRangeProps) => {
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);

  useEffect(() => {
    // Si cambian min y max externos (por ejemplo al cargar productos), actualiza
    setMinValue(min);
    setMaxValue(max);
  }, [min, max]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setMinValue(value);
    onChange(value, maxValue);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setMaxValue(value);
    onChange(minValue, value);
  };

  return (
    <div className="flex flex-col w-full">
      <label className="font-semibold mb-2">Precio</label>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={minValue}
          min={min}
          max={maxValue}
          onChange={handleMinChange}
          className="w-20 border px-2 py-1 rounded"
        />
        <span> - </span>
        <input
          type="number"
          value={maxValue}
          min={minValue}
          max={max}
          onChange={handleMaxChange}
          className="w-20 border px-2 py-1 rounded"
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={minValue}
        onChange={handleMinChange}
        className="mt-4 accent-orange-500"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxValue}
        onChange={handleMaxChange}
        className="accent-orange-500"
      />
    </div>
  );
};

export default PriceRange;
