// src/components/PropertiesPanel/LinkElementForm.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useBuilderStore } from '@/store/builderStore';
import type { Block, ButtonAction, HeaderContent, FooterContent, ContentBlockContent, LinkGroupContent } from '@/types';
import FormGroup, { ColorPickerFormGroup, SelectFormGroup } from './FormGroup';

interface LinkElementFormProps {
  block: Block;
  elementPath: string;
}

export default function LinkElementForm({ block, elementPath }: LinkElementFormProps) {
  const { updateBlock, project, syncButtonActionToEdge } = useBuilderStore();

  const pathParts = elementPath.split('.');
  const linkIndex = parseInt(pathParts[1] || '0');
  
  let link: { text: string; action: ButtonAction } | undefined;
  let linksColor = '#4b5563';
  
  if (block.type === '헤더') {
    const content = block.content as HeaderContent;
    link = content.navLinks?.[linkIndex];
    linksColor = content.navLinksColor || '#4b5563';
  } else if (block.type === '푸터') {
    const content = block.content as FooterContent;
    link = content.links?.[linkIndex];
    linksColor = content.linksColor || '#9ca3af';
  } else if (block.type === '콘텐츠') {
    const content = block.content as ContentBlockContent;
    link = content.links?.[linkIndex];
    linksColor = content.linksColor || '#3b82f6';
  } else if (block.type === '링크 그룹') {
    const content = block.content as LinkGroupContent;
    link = content.links?.[linkIndex];
    linksColor = content.linksColor || '#3b82f6';
  }

  const { register, watch, setValue } = useForm({
    defaultValues: {
      text: link?.text || '',
      actionType: (link?.action.type || 'none') as 'page' | 'external' | 'none',
      pageId: link?.action.pageId || '',
      externalUrl: link?.action.externalUrl || '',
      color: linksColor,
    },
  });

  useEffect(() => {
    const subscription = watch((value) => {
      let newContent;
      
      if (block.type === '헤더') {
        const content = block.content as HeaderContent;
        const newNavLinks = [...(content.navLinks || [])];
        
        if (newNavLinks[linkIndex]) {
          newNavLinks[linkIndex] = {
            text: value.text || '',
            action: {
              type: value.actionType as 'page' | 'external' | 'none',
              pageId: value.pageId,
              externalUrl: value.externalUrl,
              label: value.text || '',
            } as ButtonAction,
          };
        }
        
        newContent = {
          ...content,
          navLinks: newNavLinks,
          navLinksColor: value.color,
        };
      } else if (block.type === '푸터') {
        const content = block.content as FooterContent;
        const newLinks = [...(content.links || [])];
        
        if (newLinks[linkIndex]) {
          newLinks[linkIndex] = {
            text: value.text || '',
            action: {
              type: value.actionType as 'page' | 'external' | 'none',
              pageId: value.pageId,
              externalUrl: value.externalUrl,
              label: value.text || '',
            } as ButtonAction,
          };
        }
        
        newContent = {
          ...content,
          links: newLinks,
          linksColor: value.color,
        };
      } else if (block.type === '콘텐츠') {
        const content = block.content as ContentBlockContent;
        const newLinks = [...(content.links || [])];
        
        if (newLinks[linkIndex]) {
          newLinks[linkIndex] = {
            text: value.text || '',
            action: {
              type: value.actionType as 'page' | 'external' | 'none',
              pageId: value.pageId,
              externalUrl: value.externalUrl,
              label: value.text || '',
            } as ButtonAction,
          };
        }
        
        newContent = {
          ...content,
          links: newLinks,
          linksColor: value.color,
        };
      } else if (block.type === '링크 그룹') {
        const content = block.content as LinkGroupContent;
        const newLinks = [...(content.links || [])];
        
        if (newLinks[linkIndex]) {
          newLinks[linkIndex] = {
            text: value.text || '',
            action: {
              type: value.actionType as 'page' | 'external' | 'none',
              pageId: value.pageId,
              externalUrl: value.externalUrl,
              label: value.text || '',
            } as ButtonAction,
          };
        }
        
        newContent = {
          ...content,
          links: newLinks,
          linksColor: value.color,
        };
      }
      
      if (newContent) {
        updateBlock(block.id, { content: newContent });
        
        if (value.actionType === 'page' && value.pageId) {
          syncButtonActionToEdge(block.id, {
            type: 'page',
            pageId: value.pageId,
            label: value.text || '링크',
          }, linkIndex);
        } else if (value.actionType !== 'page') {
          syncButtonActionToEdge(block.id, {
            type: value.actionType as 'external' | 'none',
            label: value.text || '링크',
          }, linkIndex);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, updateBlock, block.id, block.type, linkIndex, syncButtonActionToEdge]);

  if (!link) {
    return (
      <div className="p-4">
        <p className="text-sm text-red-500">링크를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <FormGroup label="링크 텍스트" helpText="링크에 표시될 텍스트를 입력하세요">
        <input
          {...register('text')}
          type="text"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="예: 홈, 소개, 문의"
        />
      </FormGroup>

      <div className="border-t border-gray-200 pt-6"></div>

      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">링크 동작</h3>
        
        <SelectFormGroup
          label="동작 유형"
          value={watch('actionType')}
          options={[
            { value: 'none', label: '동작 없음' },
            { value: 'page', label: '페이지 이동' },
            { value: 'external', label: '외부 링크' },
          ]}
          onChange={(value) => setValue('actionType', value as 'page' | 'external' | 'none')}
          helpText="링크 클릭 시 실행할 동작을 선택하세요"
        />

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
            helpText="링크 클릭 시 이동할 페이지를 선택하세요"
            placeholder="페이지를 선택하세요"
          />
        )}

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

      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">스타일</h3>
        
        <ColorPickerFormGroup
          label="텍스트 색상"
          value={watch('color')}
          onChange={(value) => setValue('color', value)}
          helpText="링크 텍스트의 색상을 선택하세요"
        />
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">미리보기</p>
        <div className="flex flex-col items-center gap-3">
          <a
            href="#"
            className="text-sm font-medium hover:underline transition-all"
            style={{
              color: watch('color'),
            }}
          >
            {watch('text') || '링크'}
          </a>
          
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

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 <strong>팁:</strong> 페이지 이동을 선택하면 마인드맵에 자동으로 연결선이 생성됩니다.
        </p>
      </div>

      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-600">
          📍 현재 링크 위치: <span className="font-semibold">#{linkIndex + 1}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          블록 타입: <span className="font-semibold">{block.type}</span>
        </p>
      </div>
    </div>
  );
}