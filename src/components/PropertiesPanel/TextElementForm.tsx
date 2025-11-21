// src/components/PropertiesPanel/TextElementForm.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AlignLeft, AlignCenter, AlignRight, Link as LinkIcon } from 'lucide-react';
import { useBuilderStore } from '@/store/builderStore';
import type { Block } from '@/types';
import FormGroup, { SliderFormGroup, ColorPickerFormGroup } from './FormGroup';

interface TextElementFormProps {
  block: Block;
  elementPath: string;  // 예: "title", "subtitle", "navLinks.0.text"
}

export default function TextElementForm({ block, elementPath }: TextElementFormProps) {
  const { updateBlock } = useBuilderStore();

  // elementPath에서 값 가져오기
  const getValue = (path: string, obj: any): any => {
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
      value = value?.[key];
    }
    return value;
  };

  // elementPath에 값 설정하기
  const setValue = (path: string, obj: any, value: any): any => {
    const keys = path.split('.');
    const newObj = JSON.parse(JSON.stringify(obj));
    
    let current = newObj;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    return newObj;
  };

  const currentText = getValue(elementPath, block.content) || '';
  const currentFontSize = getValue(`${elementPath}FontSize`, block.content) || 16;
  const currentColor = getValue(`${elementPath}Color`, block.content) || '#000000';

  const { register, watch, setValue: setFormValue } = useForm({
    defaultValues: {
      text: currentText,
      fontSize: currentFontSize,
      color: currentColor,
      textAlign: 'left' as 'left' | 'center' | 'right',
      fontWeight: 'normal' as 'normal' | 'bold',
      fontFamily: 'Inter' as string,
    },
  });

  // 실시간 업데이트
  useEffect(() => {
    const subscription = watch((value) => {
      let newContent = { ...block.content };
      
      // 텍스트 내용 업데이트
      if (value.text !== undefined) {
        newContent = setValue(elementPath, newContent, value.text);
      }
      
      // 폰트 크기 업데이트
      if (value.fontSize !== undefined) {
        newContent = setValue(`${elementPath}FontSize`, newContent, value.fontSize);
      }
      
      // 색상 업데이트
      if (value.color !== undefined) {
        newContent = setValue(`${elementPath}Color`, newContent, value.color);
      }
      
      updateBlock(block.id, { content: newContent });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateBlock, block.id, elementPath]);

  return (
    <div className="p-4 space-y-6">
      {/* 텍스트 내용 */}
      <FormGroup label="텍스트 내용" helpText="표시될 텍스트를 입력하세요">
        <textarea
          {...register('text')}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          placeholder="텍스트를 입력하세요..."
        />
      </FormGroup>

      <div className="border-t border-gray-200 pt-6"></div>

      {/* 폰트 크기 */}
      <SliderFormGroup
        label="폰트 크기"
        value={watch('fontSize')}
        min={12}
        max={72}
        onChange={(value) => setFormValue('fontSize', value)}
      />

      {/* 색상 */}
      <ColorPickerFormGroup
        label="텍스트 색상"
        value={watch('color')}
        onChange={(value) => setFormValue('color', value)}
        helpText="텍스트의 색상을 선택하세요"
      />

      <div className="border-t border-gray-200 pt-6"></div>

      {/* 정렬 */}
      <FormGroup label="정렬" helpText="텍스트 정렬 방향을 선택하세요">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFormValue('textAlign', 'left')}
            className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all flex items-center justify-center gap-2
              ${watch('textAlign') === 'left'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
          >
            <AlignLeft className="w-4 h-4" />
            <span className="text-xs font-medium">좌</span>
          </button>
          <button
            type="button"
            onClick={() => setFormValue('textAlign', 'center')}
            className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all flex items-center justify-center gap-2
              ${watch('textAlign') === 'center'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
          >
            <AlignCenter className="w-4 h-4" />
            <span className="text-xs font-medium">중앙</span>
          </button>
          <button
            type="button"
            onClick={() => setFormValue('textAlign', 'right')}
            className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all flex items-center justify-center gap-2
              ${watch('textAlign') === 'right'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
          >
            <AlignRight className="w-4 h-4" />
            <span className="text-xs font-medium">우</span>
          </button>
        </div>
      </FormGroup>

      {/* 굵기 */}
      <FormGroup label="글꼴 굵기">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFormValue('fontWeight', 'normal')}
            className={`flex-1 px-4 py-2 text-sm rounded-lg border-2 transition-all
              ${watch('fontWeight') === 'normal'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
          >
            일반
          </button>
          <button
            type="button"
            onClick={() => setFormValue('fontWeight', 'bold')}
            className={`flex-1 px-4 py-2 text-sm font-bold rounded-lg border-2 transition-all
              ${watch('fontWeight') === 'bold'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
          >
            굵게
          </button>
        </div>
      </FormGroup>

      {/* 폰트 패밀리 */}
      <FormGroup label="글꼴">
        <select
          {...register('fontFamily')}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="Inter">Inter (기본)</option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Verdana">Verdana</option>
        </select>
      </FormGroup>

      <div className="border-t border-gray-200 pt-6"></div>

      {/* 링크 연결 (추후 구현) */}
      <FormGroup label="링크 연결" helpText="텍스트를 클릭 시 이동할 URL (선택사항)">
        <div className="flex gap-2">
          <input
            type="url"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />
          <button
            type="button"
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>
      </FormGroup>

      {/* 미리보기 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">미리보기</p>
        <div 
          style={{
            fontSize: `${watch('fontSize')}px`,
            color: watch('color'),
            textAlign: watch('textAlign'),
            fontWeight: watch('fontWeight'),
            fontFamily: watch('fontFamily'),
          }}
        >
          {watch('text') || '(텍스트 없음)'}
        </div>
      </div>
    </div>
  );
}