// src/components/PropertiesPanel/HeaderForm.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { useBuilderStore } from '@/store/builderStore';
import type { Block, HeaderContent, ButtonAction } from '@/types';
import FormGroup, { SliderFormGroup, ColorPickerFormGroup } from './FormGroup';

interface HeaderFormProps {
  block: Block;
}

export default function HeaderForm({ block }: HeaderFormProps) {
  const { updateBlock, project, syncButtonActionToEdge } = useBuilderStore();
  const content = block.content as HeaderContent;

  const { register, watch, setValue } = useForm<HeaderContent>({
    defaultValues: content,
  });

  useEffect(() => {
    const subscription = watch((value) => {
      updateBlock(block.id, {
        content: value as HeaderContent,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateBlock, block.id]);

  const addNavLink = () => {
    const currentLinks = watch('navLinks') || [];
    setValue('navLinks', [
      ...currentLinks,
      { text: '새 링크', action: { type: 'none', label: '새 링크' } },
    ]);
  };

  const removeNavLink = (index: number) => {
    const currentLinks = watch('navLinks') || [];
    const newLinks = currentLinks.filter((_, i) => i !== index);
    setValue('navLinks', newLinks);

    const { project } = useBuilderStore.getState();
    if (project) {
      const filteredEdges = project.mindMap.edges.filter(
        (e) => e.triggerBlockId !== block.id
      );

      const currentPage = useBuilderStore.getState().currentPage;
      if (currentPage) {
        const currentNode = project.mindMap.nodes.find(
          (n) => n.pageId === currentPage.id
        );

        newLinks.forEach((link, newIndex) => {
          if (link.action.type === 'page' && link.action.pageId && currentNode) {
            const targetNode = project.mindMap.nodes.find(
              (n) => n.pageId === link.action.pageId
            );

            if (targetNode) {
              filteredEdges.push({
                id: `edge-${Date.now()}-${newIndex}`,
                source: currentNode.id,
                target: targetNode.id,
                triggerBlockId: block.id,
                triggerType: 'link',
                triggerIndex: newIndex,
                label: link.text,
              });
            }
          }
        });
      }

      useBuilderStore.setState({
        project: {
          ...project,
          mindMap: { ...project.mindMap, edges: filteredEdges },
        },
      });
    }
  };

  const updateNavLink = (index: number, field: 'text' | 'action', value: any) => {
    const currentLinks = watch('navLinks') || [];
    const newLinks = [...currentLinks];

    if (field === 'action') {
      newLinks[index].action = value;
    } else {
      newLinks[index].text = value;
      newLinks[index].action.label = value;
    }

    setValue('navLinks', newLinks);
  };

  return (
    <div className="p-4 space-y-6">
      <FormGroup label="로고 텍스트">
        <input
          {...register('logo')}
          type="text"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </FormGroup>

      <SliderFormGroup
        label="로고 크기"
        value={watch('logoFontSize')}
        min={12}
        max={48}
        onChange={(value) => setValue('logoFontSize', value)}
      />

      <ColorPickerFormGroup
        label="로고 색상"
        value={watch('logoColor')}
        onChange={(value) => setValue('logoColor', value)}
      />

      <div className="border-t border-gray-200 pt-6"></div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
            네비게이션 메뉴
          </label>
          <button
            type="button"
            onClick={addNavLink}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus className="w-3 h-3" />
            링크 추가
          </button>
        </div>

        <div className="space-y-3">
          {(watch('navLinks') || []).map((link, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">링크 {index + 1}</span>
                {(watch('navLinks')?.length || 0) > 1 && (
                  <button
                    type="button"
                    onClick={() => removeNavLink(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              <input
                type="text"
                value={link.text}
                onChange={(e) => updateNavLink(index, 'text', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={link.action.type}
                onChange={(e) => {
                  const newAction: ButtonAction = {
                    ...link.action,
                    type: e.target.value as 'page' | 'external' | 'none',
                  };

                  if (e.target.value === 'none') {
                    newAction.pageId = undefined;
                    newAction.externalUrl = undefined;
                    syncButtonActionToEdge(block.id, newAction, index);
                  } else if (e.target.value === 'page') {
                    newAction.externalUrl = undefined;
                  } else if (e.target.value === 'external') {
                    newAction.pageId = undefined;
                    syncButtonActionToEdge(block.id, newAction, index);
                  }

                  updateNavLink(index, 'action', newAction);
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="none">동작 없음</option>
                <option value="page">페이지 이동</option>
                <option value="external">외부 링크</option>
              </select>

              {link.action.type === 'page' && (
                <select
                  value={link.action.pageId || ''}
                  onChange={(e) => {
                    const newAction: ButtonAction = {
                      ...link.action,
                      pageId: e.target.value,
                    };
                    updateNavLink(index, 'action', newAction);

                    if (e.target.value) {
                      syncButtonActionToEdge(block.id, {
                        type: 'page',
                        pageId: e.target.value,
                        label: link.text,
                      }, index);
                    }
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">페이지 선택...</option>
                  {project?.pages.map((page) => (
                    <option key={page.id} value={page.id}>
                      {page.name}
                    </option>
                  ))}
                </select>
              )}

              {link.action.type === 'external' && (
                <input
                  type="url"
                  value={link.action.externalUrl || ''}
                  onChange={(e) => {
                    updateNavLink(index, 'action', {
                      ...link.action,
                      externalUrl: e.target.value,
                    });
                  }}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}
        </div>

        <ColorPickerFormGroup
          label="네비게이션 링크 색상"
          value={watch('navLinksColor')}
          onChange={(value) => setValue('navLinksColor', value)}
        />
      </div>
    </div>
  );
}
