// src/components/PropertiesPanel/LinkGroupForm.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useBuilderStore } from '@/store/builderStore';
import type { Block, LinkGroupContent, ButtonAction } from '@/types';
import FormGroup, { ColorPickerFormGroup, SelectFormGroup } from './FormGroup';
import { Trash2, Settings } from 'lucide-react';

interface LinkGroupFormProps {
  block: Block;
}

export default function LinkGroupForm({ block }: LinkGroupFormProps) {
  const { updateBlock, setSelectedElement } = useBuilderStore();
  const content = block.content as LinkGroupContent;

  const { register, watch, setValue } = useForm({
    defaultValues: {
      title: content.title || '관련 링크',
      titleFontSize: content.titleFontSize || 20,
      titleColor: content.titleColor || '#1f2937',
      showTitle: content.showTitle !== false,
      links: content.links || [],
      linksColor: content.linksColor || '#3b82f6',
      layout: content.layout || 'horizontal',
      columns: content.columns || 3,
      showDivider: content.showDivider !== false,
      alignment: content.alignment || 'center',
    },
  });

  useEffect(() => {
    const subscription = watch((value) => {
      const newContent: LinkGroupContent = {
        title: value.title || '',
        titleFontSize: value.titleFontSize || 20,
        titleColor: value.titleColor || '#1f2937',
        showTitle: value.showTitle !== false,
        // 🔧 타입 단언으로 해결
        links: (value.links || []).filter((link): link is { text: string; action: ButtonAction } => 
          link !== undefined && link.text !== undefined && link.action !== undefined
        ),
        linksColor: value.linksColor || '#3b82f6',
        layout: value.layout || 'horizontal',
        columns: value.columns || 3,
        showDivider: value.showDivider !== false,
        alignment: value.alignment || 'center',
      };

      updateBlock(block.id, { content: newContent });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateBlock, block.id]);

  return (
    <div className="p-4 space-y-6">
      {/* 제목 설정 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">제목</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={watch('showTitle')}
              onChange={(e) => setValue('showTitle', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-xs text-gray-600">제목 표시</span>
          </label>
        </div>

        {watch('showTitle') && (
          <>
            <FormGroup label="제목 텍스트">
              <input
                {...register('title')}
                type="text"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 관련 링크, 바로가기"
              />
            </FormGroup>

            <div className="grid grid-cols-2 gap-4">
              <FormGroup label="제목 크기 (px)">
                <input
                  {...register('titleFontSize', { valueAsNumber: true })}
                  type="number"
                  min="14"
                  max="32"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormGroup>

              <ColorPickerFormGroup
                label="제목 색상"
                value={watch('titleColor')}
                onChange={(value) => setValue('titleColor', value)}
              />
            </div>
          </>
        )}
      </div>

      <div className="border-t border-gray-200"></div>

      {/* 레이아웃 설정 */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">레이아웃</h3>
        
        <SelectFormGroup
          label="배치 방식"
          value={watch('layout')}
          options={[
            { value: 'horizontal', label: '가로 (Horizontal)' },
            { value: 'vertical', label: '세로 (Vertical)' },
            { value: 'grid', label: '그리드 (Grid)' },
          ]}
          onChange={(value) => setValue('layout', value as 'horizontal' | 'vertical' | 'grid')}
          helpText="링크를 배치할 방식을 선택하세요"
        />

        {watch('layout') === 'grid' && (
          <FormGroup label="그리드 열 개수" helpText="한 줄에 표시할 링크 개수">
            <input
              {...register('columns', { valueAsNumber: true })}
              type="number"
              min="2"
              max="6"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormGroup>
        )}

        <SelectFormGroup
          label="정렬"
          value={watch('alignment')}
          options={[
            { value: 'left', label: '왼쪽' },
            { value: 'center', label: '가운데' },
            { value: 'right', label: '오른쪽' },
          ]}
          onChange={(value) => setValue('alignment', value as 'left' | 'center' | 'right')}
          helpText="링크 그룹의 정렬 위치"
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={watch('showDivider')}
            onChange={(e) => setValue('showDivider', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <label className="text-sm text-gray-700">구분선 표시</label>
        </div>
      </div>

      <div className="border-t border-gray-200"></div>

      {/* 링크 관리 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">링크</h3>
          <span className="text-xs text-gray-500">총 {watch('links')?.length || 0}개</span>
        </div>

        <ColorPickerFormGroup
          label="링크 색상"
          value={watch('linksColor')}
          onChange={(value) => setValue('linksColor', value)}
          helpText="모든 링크의 색상을 설정합니다"
        />
        
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-600">링크 목록</p>
          {(watch('links') || []).map((link, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-600">
                  링크 #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const newLinks = [...(watch('links') || [])];
                    newLinks.splice(index, 1);
                    setValue('links', newLinks);
                  }}
                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                  title="링크 삭제"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              
              <input
                value={link?.text || ''}
                onChange={(e) => {
                  const newLinks = [...(watch('links') || [])];
                  if (newLinks[index]) {
                    newLinks[index] = {
                      text: e.target.value,
                      action: {
                        ...newLinks[index].action,
                        label: e.target.value,
                      },
                    };
                    setValue('links', newLinks);
                  }
                }}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                placeholder="링크 텍스트"
              />
              
              <button
                type="button"
                onClick={() => {
                  setSelectedElement({
                    blockId: block.id,
                    blockType: block.type,
                    elementType: 'link',
                    elementPath: `links.${index}`,
                  });
                }}
                className="w-full py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 
                         text-xs font-medium rounded transition-colors flex items-center 
                         justify-center gap-2"
              >
                <Settings className="w-3 h-3" />
                상세 설정 (동작, 페이지 연결)
              </button>
            </div>
          ))}
        </div>
        
        <button
          type="button"
          onClick={() => {
            const currentLinks = watch('links') || [];
            const newLinks = [
              ...currentLinks,
              { 
                text: `링크 ${currentLinks.length + 1}`, 
                action: { 
                  type: 'none' as const, 
                  label: `링크 ${currentLinks.length + 1}` 
                } 
              }
            ];
            setValue('links', newLinks);
          }}
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg 
                   text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 
                   transition-colors font-medium"
        >
          + 링크 추가
        </button>
      </div>

      {/* 미리보기 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">미리보기</p>
        
        <div className="space-y-3">
          {watch('showTitle') && watch('title') && (
            <div 
              style={{ 
                fontSize: `${watch('titleFontSize')}px`,
                color: watch('titleColor'),
                fontWeight: 'bold',
                textAlign: watch('alignment')
              }}
            >
              {watch('title')}
            </div>
          )}
          
          {watch('showDivider') && <hr className="border-gray-300" />}
          
          <div 
            className={
              watch('layout') === 'horizontal' 
                ? 'flex flex-wrap gap-3' 
                : watch('layout') === 'vertical' 
                ? 'flex flex-col gap-2' 
                : 'grid gap-3'
            }
            style={{
              justifyContent: watch('alignment') === 'left' ? 'flex-start' : watch('alignment') === 'right' ? 'flex-end' : 'center',
              gridTemplateColumns: watch('layout') === 'grid' ? `repeat(${watch('columns')}, 1fr)` : undefined,
            }}
          >
            {(watch('links') || []).map((link, index) => (
              <span 
                key={index}
                style={{ color: watch('linksColor') }}
                className="font-medium text-sm"
              >
                {link?.text || '링크'}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 <strong>팁:</strong> 링크 그룹 블록은 어디든 자유롭게 배치할 수 있습니다. 페이지 중간, 사이드바, 상단 등 원하는 위치에 드래그하세요!
        </p>
      </div>

      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs text-amber-800">
          ⚡ <strong>활용 예시:</strong> CTA 링크 모음, 소셜 미디어 링크, 관련 페이지 바로가기, 파트너사 링크 등
        </p>
      </div>
    </div>
  );
}