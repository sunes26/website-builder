import { useBuilderStore } from '../../store/builderStore';
import { Zap, Plus } from 'lucide-react';
import { useState } from 'react';
import InteractionList from './InteractionList';
import InteractionEditor from './InteractionEditor';
import type { Interaction } from '../../types';

export default function InteractionPanel() {
  const { selectedElementIds, elements } = useBuilderStore();
  const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // 단일 선택된 요소 가져오기
  const element = selectedElementIds.length === 1
    ? elements.find(el => el.id === selectedElementIds[0])
    : null;

  // 선택된 요소가 없거나 다중 선택인 경우
  if (!element) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Zap size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">
            단일 요소를 선택하세요
          </p>
          <p className="text-gray-400 text-xs mt-2">
            인터랙션은 한 번에 하나의 요소에만<br />
            추가할 수 있습니다
          </p>
        </div>
      </div>
    );
  }

  const interactions = element.interactions || [];

  const handleCreate = () => {
    setIsCreating(true);
    setEditingInteraction(null);
  };

  const handleEdit = (interaction: Interaction) => {
    setEditingInteraction(interaction);
    setIsCreating(false);
  };

  const handleClose = () => {
    setIsCreating(false);
    setEditingInteraction(null);
  };

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-blue-600" />
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            인터랙션
          </h4>
        </div>
        <button
          onClick={handleCreate}
          className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"
          title="인터랙션 추가"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* 인터랙션 목록 */}
      {interactions.length > 0 ? (
        <InteractionList
          interactions={interactions}
          elementId={element.id}
          onEdit={handleEdit}
        />
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-600">
            아직 인터랙션이 없습니다
          </p>
          <button
            onClick={handleCreate}
            className="mt-2 text-xs text-blue-600 hover:text-blue-700"
          >
            첫 인터랙션 추가하기
          </button>
        </div>
      )}

      {/* 인터랙션 편집기 */}
      {(isCreating || editingInteraction) && (
        <InteractionEditor
          elementId={element.id}
          interaction={editingInteraction}
          onClose={handleClose}
        />
      )}

      {/* 앵커 ID 설정 */}
      <div className="border-t border-gray-200 pt-4">
        <label className="block text-xs font-medium text-gray-700 mb-2">
          앵커 ID (스크롤 타겟용)
        </label>
        <input
          type="text"
          value={element.anchorId || ''}
          onChange={(e) => useBuilderStore.getState().setAnchorId(element.id, e.target.value)}
          placeholder="예: section-about"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          다른 요소에서 이 요소로 스크롤할 때 사용됩니다
        </p>
      </div>
    </div>
  );
}
