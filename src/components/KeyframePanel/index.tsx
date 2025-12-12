import { useState } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { Plus, Edit2, Copy, Trash2, Play } from 'lucide-react';
import KeyframeEditor from './KeyframeEditor';
import type { KeyframeAnimation } from '../../types';

/**
 * 키프레임 애니메이션 패널 (Phase 15.2)
 *
 * CSS 키프레임 애니메이션 라이브러리를 관리하는 패널
 */
export default function KeyframePanel() {
  const { keyframeAnimations, deleteKeyframeAnimation, duplicateKeyframeAnimation } =
    useBuilderStore();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingAnimation, setEditingAnimation] = useState<KeyframeAnimation | null>(null);

  const handleCreateAnimation = () => {
    setEditingAnimation(null);
    setIsEditorOpen(true);
  };

  const handleEditAnimation = (animation: KeyframeAnimation) => {
    setEditingAnimation(animation);
    setIsEditorOpen(true);
  };

  const handleDuplicateAnimation = (animation: KeyframeAnimation) => {
    duplicateKeyframeAnimation(animation.id);
  };

  const handleDeleteAnimation = (animation: KeyframeAnimation) => {
    if (confirm(`"${animation.name}" 애니메이션을 삭제하시겠습니까?`)) {
      deleteKeyframeAnimation(animation.id);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800">키프레임 애니메이션</h3>
        <button
          onClick={handleCreateAnimation}
          className="p-1.5 rounded hover:bg-gray-100 text-blue-600"
          title="새 애니메이션 추가"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* 애니메이션 목록 */}
      <div className="flex-1 overflow-y-auto">
        {keyframeAnimations.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-xs">
            <p>생성된 키프레임 애니메이션이 없습니다.</p>
            <p className="mt-1">버튼을 클릭하여 새 애니메이션을 추가하세요.</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {keyframeAnimations.map((animation) => (
              <AnimationCard
                key={animation.id}
                animation={animation}
                onEdit={() => handleEditAnimation(animation)}
                onDuplicate={() => handleDuplicateAnimation(animation)}
                onDelete={() => handleDeleteAnimation(animation)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 애니메이션 에디터 다이얼로그 */}
      {isEditorOpen && (
        <KeyframeEditor
          animation={editingAnimation}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingAnimation(null);
          }}
        />
      )}
    </div>
  );
}

/**
 * 애니메이션 카드 컴포넌트
 */
interface AnimationCardProps {
  animation: KeyframeAnimation;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

function AnimationCard({ animation, onEdit, onDuplicate, onDelete }: AnimationCardProps) {
  const { applyAnimationToElement, selectedElementIds } = useBuilderStore();
  const [isPlaying, setIsPlaying] = useState(false);

  // 선택된 요소에 애니메이션 적용
  const handleApplyToSelected = () => {
    if (selectedElementIds.length === 0) {
      alert('애니메이션을 적용할 요소를 먼저 선택하세요.');
      return;
    }

    selectedElementIds.forEach((elementId) => {
      applyAnimationToElement(elementId, animation.id);
    });
  };

  // 애니메이션 미리보기
  const handlePreview = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), animation.duration);
  };

  const getIterationText = () => {
    if (animation.iterationCount === 'infinite') {
      return '무한 반복';
    }
    return `${animation.iterationCount}회`;
  };

  return (
    <div className="group border rounded p-3 bg-white hover:border-blue-300 transition-colors">
      {/* 애니메이션 정보 */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{animation.name}</p>
          {animation.description && (
            <p className="text-xs text-gray-500 truncate mt-0.5">{animation.description}</p>
          )}
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
            <span>{animation.duration}ms</span>
            <span>•</span>
            <span>{getIterationText()}</span>
            <span>•</span>
            <span>{animation.keyframes.length} 키프레임</span>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handlePreview}
            className="p-1 rounded hover:bg-blue-100 text-blue-600"
            title="미리보기"
          >
            <Play size={12} />
          </button>
          <button
            onClick={onEdit}
            className="p-1 rounded hover:bg-gray-100 text-gray-600"
            title="편집"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={onDuplicate}
            className="p-1 rounded hover:bg-gray-100 text-gray-600"
            title="복제"
          >
            <Copy size={12} />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded hover:bg-red-100 text-red-600"
            title="삭제"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* 미리보기 박스 */}
      <div className="mb-2 bg-gray-50 rounded p-2 h-12 flex items-center justify-center overflow-hidden">
        <div
          className={`w-8 h-8 bg-blue-500 rounded ${isPlaying ? 'animate-preview' : ''}`}
          style={{
            animation: isPlaying
              ? `preview-${animation.id} ${animation.duration}ms ${animation.timingFunction} ${animation.direction} ${animation.fillMode}`
              : 'none',
          }}
        />
      </div>

      {/* 적용 버튼 */}
      <button
        onClick={handleApplyToSelected}
        className="w-full px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 rounded transition-colors"
      >
        선택된 요소에 적용
      </button>

      {/* 동적 스타일 (미리보기용) */}
      {isPlaying && (
        <style>{`
          @keyframes preview-${animation.id} {
            ${animation.keyframes
              .map(
                (kf) =>
                  `${kf.offset}% { ${Object.entries(kf.styles)
                    .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
                    .join('; ')} }`
              )
              .join('\n')}
          }
        `}</style>
      )}
    </div>
  );
}
