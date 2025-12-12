import { useBuilderStore } from '../../store/builderStore';
import { MousePointer, Move, Sparkles, Palette, Power, Trash2, Edit } from 'lucide-react';
import type { Interaction } from '../../types';

interface InteractionListProps {
  interactions: Interaction[];
  elementId: string;
  onEdit: (interaction: Interaction) => void;
}

export default function InteractionList({ interactions, elementId, onEdit }: InteractionListProps) {
  const { removeInteraction, toggleInteraction } = useBuilderStore();

  const getEventIcon = (event: string) => {
    switch (event) {
      case 'click': return <MousePointer size={14} />;
      case 'hover': return <Palette size={14} />;
      case 'load': return <Sparkles size={14} />;
      case 'scroll': return <Move size={14} />;
      default: return <Sparkles size={14} />;
    }
  };

  const getEventLabel = (event: string) => {
    const labels = {
      click: '클릭',
      hover: '호버',
      load: '로드',
      scroll: '스크롤',
    };
    return labels[event as keyof typeof labels] || event;
  };

  const getActionLabel = (action: Interaction['action']) => {
    switch (action.type) {
      case 'navigate':
        if (action.target === 'internal') return '페이지 이동';
        if (action.target === 'external') return '외부 링크';
        if (action.target === 'mailto') return '이메일';
        if (action.target === 'tel') return '전화';
        return '네비게이션';
      case 'scroll-to':
        return '스크롤';
      case 'animate':
        return `애니메이션: ${action.animationType}`;
      case 'hover-effect':
        return '호버 효과';
      default:
        return '인터랙션';
    }
  };

  return (
    <div className="space-y-2">
      {interactions.map((interaction) => (
        <div
          key={interaction.id}
          className={`
            border rounded-lg p-3 transition-colors
            ${interaction.enabled
              ? 'border-blue-200 bg-blue-50'
              : 'border-gray-200 bg-gray-50 opacity-60'
            }
          `}
        >
          <div className="flex items-start justify-between gap-2">
            {/* 인터랙션 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="text-blue-600">
                  {getEventIcon(interaction.event)}
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {getEventLabel(interaction.event)}
                </span>
                <span className="text-xs text-gray-400">→</span>
                <span className="text-xs text-gray-600">
                  {getActionLabel(interaction.action)}
                </span>
              </div>

              {/* 추가 정보 */}
              {interaction.action.type === 'navigate' && (
                <p className="text-xs text-gray-500 truncate">
                  {interaction.action.url}
                </p>
              )}
            </div>

            {/* 액션 버튼 */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => toggleInteraction(elementId, interaction.id)}
                className={`
                  p-1 rounded transition-colors
                  ${interaction.enabled
                    ? 'text-green-600 hover:bg-green-100'
                    : 'text-gray-400 hover:bg-gray-200'
                  }
                `}
                title={interaction.enabled ? '비활성화' : '활성화'}
              >
                <Power size={14} />
              </button>
              <button
                onClick={() => onEdit(interaction)}
                className="p-1 rounded text-blue-600 hover:bg-blue-100 transition-colors"
                title="편집"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => {
                  if (confirm('이 인터랙션을 삭제하시겠습니까?')) {
                    removeInteraction(elementId, interaction.id);
                  }
                }}
                className="p-1 rounded text-red-600 hover:bg-red-100 transition-colors"
                title="삭제"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
