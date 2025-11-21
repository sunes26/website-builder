// src/components/PropertiesPanel/FormGroup.tsx
import type { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface FormGroupProps {
  label: string;
  error?: string;
  helpText?: string;
  children: ReactNode;
}

export default function FormGroup({ label, error, helpText, children }: FormGroupProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
        {label}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </div>
      )}
      {helpText && !error && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
}

interface SliderFormGroupProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (value: number) => void;
  error?: string;
}

export function SliderFormGroup({
  label,
  value,
  min,
  max,
  unit = 'px',
  onChange,
  error,
}: SliderFormGroupProps) {
  return (
    <FormGroup label={label} error={error}>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none 
                   [&::-webkit-slider-thumb]:w-4 
                   [&::-webkit-slider-thumb]:h-4 
                   [&::-webkit-slider-thumb]:rounded-full 
                   [&::-webkit-slider-thumb]:bg-blue-600
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-webkit-slider-thumb]:hover:bg-blue-700
                   [&::-moz-range-thumb]:w-4 
                   [&::-moz-range-thumb]:h-4 
                   [&::-moz-range-thumb]:rounded-full 
                   [&::-moz-range-thumb]:bg-blue-600
                   [&::-moz-range-thumb]:border-0
                   [&::-moz-range-thumb]:cursor-pointer"
        />
        <span className="text-sm font-semibold text-gray-700 w-14 text-right">
          {value}{unit}
        </span>
      </div>
    </FormGroup>
  );
}

interface ColorPickerFormGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helpText?: string;
}

export function ColorPickerFormGroup({
  label,
  value,
  onChange,
  error,
  helpText,
}: ColorPickerFormGroupProps) {
  const colorPresets = [
    { name: 'Black', value: '#000000' },
    { name: 'Gray 800', value: '#1f2937' },
    { name: 'Gray 700', value: '#374151' },
    { name: 'Gray 600', value: '#4b5563' },
    { name: 'Gray 400', value: '#9ca3af' },
    { name: 'White', value: '#ffffff' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
  ];

  return (
    <FormGroup label={label} error={error} helpText={helpText}>
      <div className="space-y-3">
        <div className="grid grid-cols-6 gap-2">
          {colorPresets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => onChange(preset.value)}
              className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110
                ${value.toLowerCase() === preset.value.toLowerCase()
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-300 hover:border-gray-400'
                }`}
              style={{ backgroundColor: preset.value }}
              title={preset.name}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            placeholder="#000000"
            pattern="^#[0-9A-Fa-f]{6}$"
          />
        </div>

        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-xs text-gray-600">미리보기:</span>
          <span 
            className="px-3 py-1 rounded font-medium text-sm"
            style={{ color: value }}
          >
            텍스트 색상 Aa
          </span>
        </div>
      </div>
    </FormGroup>
  );
}

interface SelectFormGroupProps {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  error?: string;
  helpText?: string;
  placeholder?: string;
}

export function SelectFormGroup({
  label,
  value,
  options,
  onChange,
  error,
  helpText,
  placeholder = '선택하세요',
}: SelectFormGroupProps) {
  return (
    <FormGroup label={label} error={error} helpText={helpText}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white
                 cursor-pointer hover:border-gray-400 transition-colors"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormGroup>
  );
}
