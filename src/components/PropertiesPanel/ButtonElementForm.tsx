// src/components/PropertiesPanel/ButtonElementForm.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useBuilderStore } from '@/store/builderStore';
import type { Block, ButtonAction } from '@/types';
import FormGroup, { ColorPickerFormGroup, SelectFormGroup } from './FormGroup';

interface ButtonElementFormProps {
  block: Block;
  elementPath: string;  // 예: "button"
}

export default function ButtonElementForm({ block, elementPath: _elementPath }: ButtonElementFormProps) {  // 🔥 수정: _elementPath로 변경
  const { updateBlock, project, syncButtonActionToEdge } = useBuilderStore();

  // 버튼 텍스트와 액션 가져오기
  const buttonText = (block.content as any).buttonText || '';
  const buttonAction = (block.content as any).buttonAction || { type: 'none', label: '' };

  const { register, watch, setValue } = useForm({
    defaultValues: {
      text: buttonText,
      actionType: buttonAction.type as 'page' | 'external' | 'none',
      pageId: buttonAction.pageId || '',
      externalUrl: buttonAction.externalUrl || '',
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      borderRadius: 8,
    },
  });

  // 실시간 업데이트
  useEffect(() => {
    const subscription = watch((value) => {
      const newContent = {
        ...block.content,
        buttonText: value.text,
        buttonAction: {
          type: value.actionType,
          pageId: value.pageId,
          externalUrl: value.externalUrl,
          label: value.text,
        } as ButtonAction,
      };
      
      updateBlock(block.id, { content: newContent });
      
      // 🔥 마인드맵 Edge 자동 업데이트
      if (value.actionType === 'page' && value.pageId) {
        syncButtonActionToEdge(block.id, {
          type: 'page',
          pageId: value.pageId,
          label: value.text || '버튼',
        }, 0);
      } else if (value.actionType !== 'page') {
        // Edge 삭제
        syncButtonActionToEdge(block.id, {
          type: value.actionType as 'external' | 'none',
          label: value.text || '버튼',
        }, 0);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, updateBlock, block.id, syncButtonActionToEdge]);

  return (
    <div className="p-4 space-y-6">
      {/* 버튼 텍스트 */}
      <FormGroup label="버튼 텍스트" helpText="버튼에 표시될 텍스트를 입력하세요">
        <input
          {...register('text')}
          type="text"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="예: 자세히 보기"
        />
      </FormGroup>

      <div className="border-t border-gray-200 pt-6"></div>

      {/* 버튼 동작 */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">버튼 동작</h3>
        
        <SelectFormGroup
          label="동작 유형"
          value={watch('actionType')}
          options={[
            { value: 'none', label: '동작 없음' },
            { value: 'page', label: '페이지 이동' },
            { value: 'external', label: '외부 링크' },
          ]}
          onChange={(value) => setValue('actionType', value as 'page' | 'external' | 'none')}
          helpText="버튼 클릭 시 실행할 동작을 선택하세요"
        />

        {/* 페이지 선택 */}
        {watch('actionType') === 'page' && (
          <SelectFormGroup
            label="이동할 페이지"
            value={watch('pageId')}
            options={
              project?.pages.map((page) => ({
                value: page.id,
                label: page.name,
              })) || []
            }
            onChange={(value) => setValue('pageId', value)}
            helpText="버튼 클릭 시 이동할 페이지를 선택하세요"
            placeholder="페이지를 선택하세요"
          />
        )}

        {/* 외부 URL */}
        {watch('actionType') === 'external' && (
          <FormGroup label="외부 URL" helpText="https://로 시작하는 완전한 URL을 입력하세요">
            <input
              {...register('externalUrl')}
              type="url"
              placeholder="https://example.com"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormGroup>
        )}
      </div>

      <div className="border-t border-gray-200 pt-6"></div>

      {/* 버튼 스타일 */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">스타일</h3>
        
        <ColorPickerFormGroup
          label="배경 색상"
          value={watch('backgroundColor')}
          onChange={(value) => setValue('backgroundColor', value)}
          helpText="버튼의 배경 색상을 선택하세요"
        />

        <ColorPickerFormGroup
          label="텍스트 색상"
          value={watch('textColor')}
          onChange={(value) => setValue('textColor', value)}
          helpText="버튼 텍스트의 색상을 선택하세요"
        />

        <FormGroup label="모서리 둥글기">
          <div className="flex gap-2">
            <input
              {...register('borderRadius', { valueAsNumber: true })}
              type="number"
              min="0"
              max="50"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="px-3 py-2 text-sm text-gray-500">px</span>
          </div>
        </FormGroup>
      </div>

      {/* 미리보기 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">미리보기</p>
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            className="px-6 py-3 font-semibold transition-opacity hover:opacity-90"
            style={{
              backgroundColor: watch('backgroundColor'),
              color: watch('textColor'),
              borderRadius: `${watch('borderRadius')}px`,
            }}
          >
            {watch('text') || '버튼'}
          </button>
          
          <div className="text-xs text-gray-500 text-center">
            {watch('actionType') === 'page' && watch('pageId') && (
              <span className="text-blue-600">
                → {project?.pages.find(p => p.id === watch('pageId'))?.name}
              </span>
            )}
            {watch('actionType') === 'external' && watch('externalUrl') && (
              <span className="text-blue-600">
                → 외부 링크
              </span>
            )}
            {watch('actionType') === 'none' && (
              <span className="text-gray-400">(동작 없음)</span>
            )}
          </div>
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 <strong>팁:</strong> 페이지 이동을 선택하면 마인드맵에 자동으로 연결선이 생성됩니다.
        </p>
      </div>
    </div>
  );
}