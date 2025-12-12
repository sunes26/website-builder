import { useBuilderStore } from '../../store/builderStore';
import type { TextElement } from '../../types';
import {
  FormGroup,
  ColorInput,
  NumberInput,
  SelectInput,
  TextareaInput,
} from './FormGroup';

interface TextPropertiesFormProps {
  text: TextElement;
}

export default function TextPropertiesForm({ text }: TextPropertiesFormProps) {
  const { updateElement } = useBuilderStore();

  const fontFamilyOptions = [
    { value: 'Inter, sans-serif', label: 'Inter' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'Courier New, monospace', label: 'Courier New' },
    { value: 'Arial, sans-serif', label: 'Arial' },
  ];

  const fontWeightOptions = [
    { value: '400', label: 'Normal (400)' },
    { value: '500', label: 'Medium (500)' },
    { value: '600', label: 'Semi-bold (600)' },
    { value: '700', label: 'Bold (700)' },
  ];

  const fontStyleOptions = [
    { value: 'normal', label: '일반' },
    { value: 'italic', label: 'Italic' },
  ];

  const textDecorationOptions = [
    { value: 'none', label: '없음' },
    { value: 'underline', label: '밑줄' },
    { value: 'line-through', label: '취소선' },
    { value: 'underline line-through', label: '밑줄 + 취소선' },
  ];

  const textTransformOptions = [
    { value: 'none', label: '없음' },
    { value: 'uppercase', label: '대문자' },
    { value: 'lowercase', label: '소문자' },
    { value: 'capitalize', label: '단어 첫글자 대문자' },
  ];

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
        텍스트 속성
      </h4>

      {/* Content */}
      <FormGroup label="내용">
        <TextareaInput
          value={text.content}
          onChange={(val) => updateElement(text.id, { content: val })}
          placeholder="텍스트를 입력하세요"
          rows={4}
        />
      </FormGroup>

      {/* Font Size */}
      <FormGroup label="폰트 크기">
        <NumberInput
          value={text.fontSize}
          onChange={(val) => updateElement(text.id, { fontSize: val })}
          min={8}
          max={200}
          step={1}
        />
      </FormGroup>

      {/* Font Family */}
      <FormGroup label="폰트">
        <SelectInput
          value={text.fontFamily}
          onChange={(val) => updateElement(text.id, { fontFamily: val })}
          options={fontFamilyOptions}
        />
      </FormGroup>

      {/* Font Weight */}
      <FormGroup label="폰트 굵기">
        <SelectInput
          value={text.fontWeight}
          onChange={(val) => updateElement(text.id, { fontWeight: val })}
          options={fontWeightOptions}
        />
      </FormGroup>

      {/* Color */}
      <FormGroup label="텍스트 색상">
        <ColorInput
          value={text.color}
          onChange={(val) => updateElement(text.id, { color: val })}
        />
      </FormGroup>

      {/* Text Align (Priority 4.1: justify 추가) */}
      <FormGroup label="텍스트 정렬">
        <div className="grid grid-cols-4 gap-1">
          <button
            onClick={() => updateElement(text.id, { textAlign: 'left' })}
            className={`px-3 py-2 text-sm border rounded transition-colors ${
              text.textAlign === 'left'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            title="왼쪽 정렬"
          >
            ←
          </button>
          <button
            onClick={() => updateElement(text.id, { textAlign: 'center' })}
            className={`px-3 py-2 text-sm border rounded transition-colors ${
              text.textAlign === 'center'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            title="중앙 정렬"
          >
            ↔
          </button>
          <button
            onClick={() => updateElement(text.id, { textAlign: 'right' })}
            className={`px-3 py-2 text-sm border rounded transition-colors ${
              text.textAlign === 'right'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            title="오른쪽 정렬"
          >
            →
          </button>
          <button
            onClick={() => updateElement(text.id, { textAlign: 'justify' })}
            className={`px-3 py-2 text-sm border rounded transition-colors ${
              text.textAlign === 'justify'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            title="양쪽 정렬"
          >
            ═
          </button>
        </div>
      </FormGroup>

      {/* Font Style (Priority 4.1) */}
      <FormGroup label="폰트 스타일">
        <SelectInput
          value={text.fontStyle || 'normal'}
          onChange={(val) => updateElement(text.id, { fontStyle: val as 'normal' | 'italic' })}
          options={fontStyleOptions}
        />
      </FormGroup>

      {/* Text Decoration (Priority 4.1) */}
      <FormGroup label="텍스트 장식">
        <SelectInput
          value={text.textDecoration || 'none'}
          onChange={(val) => updateElement(text.id, { textDecoration: val as any })}
          options={textDecorationOptions}
        />
      </FormGroup>

      {/* Text Transform (Priority 4.1) */}
      <FormGroup label="대/소문자 변환">
        <SelectInput
          value={text.textTransform || 'none'}
          onChange={(val) => updateElement(text.id, { textTransform: val as any })}
          options={textTransformOptions}
        />
      </FormGroup>

      {/* Letter Spacing (Priority 4.1) */}
      <FormGroup label="자간">
        <NumberInput
          value={text.letterSpacing || 0}
          onChange={(val) => updateElement(text.id, { letterSpacing: val })}
          min={-5}
          max={20}
          step={0.1}
        />
      </FormGroup>

      {/* Line Height (Priority 4.1) */}
      <FormGroup label="줄 간격">
        <NumberInput
          value={text.lineHeight || 1.5}
          onChange={(val) => updateElement(text.id, { lineHeight: val })}
          min={0.5}
          max={3}
          step={0.1}
        />
      </FormGroup>

      {/* 텍스트 편집 안내 */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
        <p className="text-xs text-green-700 font-medium mb-1">
          ✨ 텍스트 편집 방법
        </p>
        <p className="text-xs text-green-600">
          • 더블클릭: 텍스트 편집 시작
          <br />
          • Enter: 줄바꿈
          <br />• ESC: 편집 종료
        </p>
      </div>
    </div>
  );
}
