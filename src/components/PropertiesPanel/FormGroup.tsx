import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useBuilderStore } from '../../store/builderStore';

// ============================================
// FormGroup - 기본 폼 필드 래퍼
// ============================================

interface FormGroupProps {
  label: string;
  children: React.ReactNode;
  helpText?: string;
  className?: string;
}

export function FormGroup({
  label,
  children,
  helpText,
  className = '',
}: FormGroupProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
      {helpText && (
        <p className="text-xs text-gray-500 mt-1">{helpText}</p>
      )}
    </div>
  );
}

// ============================================
// NumberInput - 숫자 입력
// ============================================

interface NumberInputProps {
  value: number | string;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  className?: string;
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
  className = '',
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      onChange(val);
    } else if (e.target.value === '') {
      onChange(0);
    }
  };

  return (
    <input
      type="number"
      value={value}
      onChange={handleChange}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      className={`w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    />
  );
}

// ============================================
// ColorInput - 색상 피커 + HEX 입력 + 팔레트
// ============================================

interface ColorInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ColorInput({ value, onChange, className = '' }: ColorInputProps) {
  const { colorPalette, addColorToPalette, removeColorFromPalette } = useBuilderStore();
  const [showPalette, setShowPalette] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleAddToPalette = () => {
    addColorToPalette(value);
  };

  const handleSelectFromPalette = (color: string) => {
    onChange(color);
    setShowPalette(false);
  };

  const isColorInPalette = colorPalette.some((item) => item.color === value);

  return (
    <div className={className}>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={value}
          onChange={handleChange}
          className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
          title="색상 선택"
        />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="#000000"
          pattern="^#[0-9A-Fa-f]{6}$"
        />
        {!isColorInPalette && (
          <button
            onClick={handleAddToPalette}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="팔레트에 추가"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {/* 저장된 색상 팔레트 */}
      <div className="mt-2">
        <button
          onClick={() => setShowPalette(!showPalette)}
          className="text-xs text-gray-600 hover:text-gray-800 transition-colors"
        >
          {showPalette ? '팔레트 숨기기' : `저장된 색상 (${colorPalette.length}개)`}
        </button>

        {showPalette && (
          <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
            <div className="grid grid-cols-6 gap-1.5">
              {colorPalette.map((item) => (
                <div key={item.id} className="group relative">
                  <button
                    onClick={() => handleSelectFromPalette(item.color)}
                    className={`w-full aspect-square rounded border-2 transition-all hover:scale-110 ${
                      item.color === value
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: item.color }}
                    title={item.name || item.color}
                  />
                  {/* 삭제 버튼 */}
                  {!item.id.startsWith('default-') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeColorFromPalette(item.id);
                      }}
                      className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="삭제"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {colorPalette.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-2">
                저장된 색상이 없습니다
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// RangeInput - 슬라이더 + 값 표시
// ============================================

interface RangeInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  displayValue?: string;
  className?: string;
}

export function RangeInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  displayValue,
  className = '',
}: RangeInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <input
        type="range"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className="flex-1"
      />
      <span className="text-xs text-gray-600 w-12 text-right">
        {displayValue || value}
      </span>
    </div>
  );
}

// ============================================
// SelectInput - 드롭다운
// ============================================

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function SelectInput({
  value,
  onChange,
  options,
  placeholder,
  className = '',
}: SelectInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className={`w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

// ============================================
// CheckboxInput - 체크박스
// ============================================

interface CheckboxInputProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
}

export function CheckboxInput({
  checked,
  onChange,
  label,
  className = '',
}: CheckboxInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <label className={`flex items-center space-x-2 cursor-pointer ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

// ============================================
// TextInput - 텍스트 입력
// ============================================

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function TextInput({
  value,
  onChange,
  placeholder,
  className = '',
}: TextInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={`w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    />
  );
}

// ============================================
// TextareaInput - 여러 줄 텍스트 입력
// ============================================

interface TextareaInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function TextareaInput({
  value,
  onChange,
  placeholder,
  rows = 3,
  className = '',
}: TextareaInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <textarea
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${className}`}
    />
  );
}
