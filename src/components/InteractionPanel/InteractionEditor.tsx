import { useBuilderStore } from '../../store/builderStore';
import { X } from 'lucide-react';
import { useState } from 'react';
import type { Interaction, InteractionEvent, InteractionActionData } from '../../types';
import NavigateEditor from './NavigateEditor';
import ScrollToEditor from './ScrollToEditor';
import AnimateEditor from './AnimateEditor';
import HoverEffectEditor from './HoverEffectEditor';

interface InteractionEditorProps {
  elementId: string;
  interaction: Interaction | null;
  onClose: () => void;
}

export default function InteractionEditor({ elementId, interaction, onClose }: InteractionEditorProps) {
  const { addInteraction, updateInteraction } = useBuilderStore();

  const [event, setEvent] = useState<InteractionEvent>(interaction?.event || 'click');
  const [actionType, setActionType] = useState<InteractionActionData['type']>(
    interaction?.action.type || 'navigate'
  );
  const [actionData, setActionData] = useState<InteractionActionData | null>(
    interaction?.action || null
  );

  const handleSave = () => {
    if (!actionData) {
      alert('액션 설정을 완료해주세요.');
      return;
    }

    if (interaction) {
      // 업데이트
      updateInteraction(elementId, interaction.id, {
        event,
        action: actionData,
      });
    } else {
      // 새로 생성
      addInteraction(elementId, {
        event,
        action: actionData,
        enabled: true,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {interaction ? '인터랙션 편집' : '새 인터랙션'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* 이벤트 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              트리거 이벤트
            </label>
            <select
              value={event}
              onChange={(e) => setEvent(e.target.value as InteractionEvent)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="click">클릭</option>
              <option value="hover">호버</option>
              <option value="load">페이지 로드</option>
              <option value="scroll">스크롤</option>
            </select>
          </div>

          {/* 액션 타입 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              액션 타입
            </label>
            <select
              value={actionType}
              onChange={(e) => {
                const newType = e.target.value as InteractionActionData['type'];
                setActionType(newType);
                setActionData(null); // 리셋
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="navigate">네비게이션</option>
              <option value="scroll-to">스크롤</option>
              <option value="animate">애니메이션</option>
              <option value="hover-effect">호버 효과</option>
            </select>
          </div>

          {/* 액션별 설정 폼 */}
          <div className="border-t border-gray-200 pt-4">
            {actionType === 'navigate' && (
              <NavigateEditor
                initialData={actionData?.type === 'navigate' ? actionData : undefined}
                onChange={setActionData}
              />
            )}
            {actionType === 'scroll-to' && (
              <ScrollToEditor
                initialData={actionData?.type === 'scroll-to' ? actionData : undefined}
                onChange={setActionData}
              />
            )}
            {actionType === 'animate' && (
              <AnimateEditor
                initialData={actionData?.type === 'animate' ? actionData : undefined}
                onChange={setActionData}
              />
            )}
            {actionType === 'hover-effect' && event === 'hover' && (
              <HoverEffectEditor
                initialData={actionData?.type === 'hover-effect' ? actionData : undefined}
                onChange={setActionData}
              />
            )}
            {actionType === 'hover-effect' && event !== 'hover' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-700">
                  ⚠️ 호버 효과는 '호버' 이벤트에서만 사용할 수 있습니다.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 푸터 */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {interaction ? '업데이트' : '추가'}
          </button>
        </div>
      </div>
    </div>
  );
}
