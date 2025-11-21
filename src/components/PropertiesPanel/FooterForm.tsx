// src/components/PropertiesPanel/FooterForm.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useBuilderStore } from '@/store/builderStore';
import type { Block, FooterContent, ButtonAction } from '@/types';
import FormGroup, { ColorPickerFormGroup } from './FormGroup';
import { Trash2, Settings } from 'lucide-react';

interface FooterFormProps {
  block: Block;
}

export default function FooterForm({ block }: FooterFormProps) {
  const { updateBlock, setSelectedElement } = useBuilderStore();
  const content = block.content as FooterContent;

  const { register, watch, setValue } = useForm({
    defaultValues: {
      text: content.text,
      fontSize: content.fontSize,
      textColor: content.textColor,
      links: content.links || [],
      linksColor: content.linksColor || '#9ca3af',
      showLinks: content.showLinks !== false,
    },
  });

  useEffect(() => {
    const subscription = watch((value) => {
      const newContent: FooterContent = {
        text: value.text || '',
        fontSize: value.fontSize || 14,
        textColor: value.textColor || '#9ca3af',
        // 🔧 타입 단언으로 해결
        links: (value.links || []).filter((link): link is { text: string; action: ButtonAction } => 
          link !== undefined && link.text !== undefined && link.action !== undefined
        ),
        linksColor: value.linksColor || '#9ca3af',
        showLinks: value.showLinks !== false,
      };

      updateBlock(block.id, { content: newContent });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateBlock, block.id]);

  return (
    <div className="p-4 space-y-6">
      <FormGroup label="푸터 텍스트" helpText="저작권 표시 등 푸터 메인 텍스트">
        <textarea
          {...register('text')}
          rows={2}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="© 2025 My Company. All rights reserved."
        />
      </FormGroup>

      <div className="grid grid-cols-2 gap-4">
        <FormGroup label="폰트 크기 (px)">
          <input
            {...register('fontSize', { valueAsNumber: true })}
            type="number"
            min="10"
            max="24"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </FormGroup>

        <ColorPickerFormGroup
          label="텍스트 색상"
          value={watch('textColor')}
          onChange={(value) => setValue('textColor', value)}
        />
      </div>

      {/* 🆕 Phase 1: 푸터 링크 섹션 */}
      <div className="border-t border-gray-200 pt-6"></div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">푸터 링크</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={watch('showLinks')}
              onChange={(e) => setValue('showLinks', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-xs text-gray-600">링크 표시</span>
          </label>
        </div>

        {watch('showLinks') && (
          <>
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
          </>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">미리보기</p>
        <div 
          className="bg-gray-800 py-4 px-6 rounded-lg text-center"
        >
          <div 
            style={{ 
              fontSize: `${watch('fontSize')}px`,
              color: watch('textColor')
            }}
          >
            {watch('text') || '푸터 텍스트'}
          </div>
          
          {watch('showLinks') && watch('links') && watch('links').length > 0 && (
            <div className="mt-3 flex justify-center items-center gap-4 flex-wrap">
              {(watch('links') || []).map((link, index) => (
                <span 
                  key={index}
                  style={{ color: watch('linksColor') }}
                  className="text-sm"
                >
                  {link?.text || '링크'}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 <strong>팁:</strong> 링크의 "상세 설정" 버튼을 클릭하면 페이지 이동이나 외부 링크를 설정할 수 있습니다.
        </p>
      </div>
    </div>
  );
}