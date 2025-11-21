// src/components/PropertiesPanel/BoxElementForm.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useBuilderStore } from '@/store/builderStore';
import type { Block, BoxStyle } from '@/types';
import FormGroup, { SliderFormGroup, ColorPickerFormGroup } from './FormGroup';

interface BoxElementFormProps {
  block: Block;
  elementPath: string;  // 예: "header", "section", "navLinks"
}

export default function BoxElementForm({ block, elementPath }: BoxElementFormProps) {
  const { updateBlock } = useBuilderStore();

  // 현재 박스 스타일 가져오기
  const currentBoxStyle = block.boxStyles?.[elementPath] || {};

  const { register, watch, setValue } = useForm<BoxStyle>({
    defaultValues: {
      width: currentBoxStyle.width || '100%',
      height: currentBoxStyle.height || 'auto',
      backgroundColor: currentBoxStyle.backgroundColor || 'transparent',
      borderWidth: currentBoxStyle.borderWidth || 0,
      borderColor: currentBoxStyle.borderColor || '#e5e7eb',
      borderRadius: currentBoxStyle.borderRadius || 0,
      paddingTop: currentBoxStyle.paddingTop || 16,
      paddingRight: currentBoxStyle.paddingRight || 24,
      paddingBottom: currentBoxStyle.paddingBottom || 16,
      paddingLeft: currentBoxStyle.paddingLeft || 24,
      marginTop: currentBoxStyle.marginTop || 0,
      marginBottom: currentBoxStyle.marginBottom || 0,
    },
  });

  // 🆕 실시간 업데이트 - 실제 구현
  useEffect(() => {
    const subscription = watch((value) => {
      // 박스 스타일 업데이트
      const newBoxStyles = {
        ...block.boxStyles,
        [elementPath]: {
          width: value.width,
          height: value.height,
          backgroundColor: value.backgroundColor,
          borderWidth: value.borderWidth,
          borderColor: value.borderColor,
          borderRadius: value.borderRadius,
          paddingTop: value.paddingTop,
          paddingRight: value.paddingRight,
          paddingBottom: value.paddingBottom,
          paddingLeft: value.paddingLeft,
          marginTop: value.marginTop,
          marginBottom: value.marginBottom,
        },
      };

      updateBlock(block.id, { boxStyles: newBoxStyles });
    });

    return () => subscription.unsubscribe();
  }, [watch, updateBlock, block.id, block.boxStyles, elementPath]);

  return (
    <div className="p-4 space-y-6">
      {/* 크기 */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">크기</h3>
        
        <FormGroup label="너비 (Width)">
          <div className="flex gap-2">
            <input
              {...register('width')}
              type="text"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: 100%, 500px, auto"
            />
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setValue('width', '100%')}
                className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              >
                100%
              </button>
              <button
                type="button"
                onClick={() => setValue('width', 'auto')}
                className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              >
                Auto
              </button>
            </div>
          </div>
        </FormGroup>

        <FormGroup label="높이 (Height)">
          <div className="flex gap-2">
            <input
              {...register('height')}
              type="text"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: 400px, auto"
            />
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setValue('height', '100%')}
                className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              >
                100%
              </button>
              <button
                type="button"
                onClick={() => setValue('height', 'auto')}
                className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              >
                Auto
              </button>
            </div>
          </div>
        </FormGroup>
      </div>

      <div className="border-t border-gray-200 pt-6"></div>

      {/* 배경 */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">배경</h3>
        
        <ColorPickerFormGroup
          label="배경 색상"
          value={watch('backgroundColor') || 'transparent'}
          onChange={(value) => setValue('backgroundColor', value)}
          helpText="컨테이너의 배경 색상을 선택하세요"
        />
      </div>

      <div className="border-t border-gray-200 pt-6"></div>

      {/* 테두리 */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">테두리</h3>
        
        <SliderFormGroup
          label="테두리 두께"
          value={watch('borderWidth') || 0}
          min={0}
          max={10}
          onChange={(value) => setValue('borderWidth', value)}
        />

        <ColorPickerFormGroup
          label="테두리 색상"
          value={watch('borderColor') || '#e5e7eb'}
          onChange={(value) => setValue('borderColor', value)}
        />

        <SliderFormGroup
          label="모서리 둥글기 (Border Radius)"
          value={watch('borderRadius') || 0}
          min={0}
          max={50}
          onChange={(value) => setValue('borderRadius', value)}
        />
      </div>

      <div className="border-t border-gray-200 pt-6"></div>

      {/* 안쪽 여백 (Padding) */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">안쪽 여백 (Padding)</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="위">
            <input
              {...register('paddingTop', { valueAsNumber: true })}
              type="number"
              min="0"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormGroup>
          <FormGroup label="아래">
            <input
              {...register('paddingBottom', { valueAsNumber: true })}
              type="number"
              min="0"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormGroup>
          <FormGroup label="왼쪽">
            <input
              {...register('paddingLeft', { valueAsNumber: true })}
              type="number"
              min="0"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormGroup>
          <FormGroup label="오른쪽">
            <input
              {...register('paddingRight', { valueAsNumber: true })}
              type="number"
              min="0"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormGroup>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6"></div>

      {/* 바깥 여백 (Margin) */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">바깥 여백 (Margin)</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="위">
            <input
              {...register('marginTop', { valueAsNumber: true })}
              type="number"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormGroup>
          <FormGroup label="아래">
            <input
              {...register('marginBottom', { valueAsNumber: true })}
              type="number"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormGroup>
        </div>
      </div>

      {/* 미리보기 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">미리보기</p>
        <div 
          className="flex items-center justify-center text-xs text-gray-500"
          style={{
            width: watch('width'),
            height: watch('height') === 'auto' ? '100px' : watch('height'),
            backgroundColor: watch('backgroundColor'),
            borderWidth: `${watch('borderWidth')}px`,
            borderColor: watch('borderColor'),
            borderStyle: watch('borderWidth') ? 'solid' : 'none',
            borderRadius: `${watch('borderRadius')}px`,
            padding: `${watch('paddingTop')}px ${watch('paddingRight')}px ${watch('paddingBottom')}px ${watch('paddingLeft')}px`,
            marginTop: `${watch('marginTop')}px`,
            marginBottom: `${watch('marginBottom')}px`,
          }}
        >
          박스 미리보기
        </div>
      </div>

      {/* 🆕 성공 메시지 */}
      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-xs text-green-800">
          ✅ 박스 스타일이 실시간으로 적용됩니다!<br />
          변경 사항은 즉시 캔버스에 반영됩니다.
        </p>
      </div>
    </div>
  );
}