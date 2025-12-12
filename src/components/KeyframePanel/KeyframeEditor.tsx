import { useState } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { X, Plus, Trash2 } from 'lucide-react';
import type { KeyframeAnimation, Keyframe } from '../../types';

/**
 * 키프레임 애니메이션 에디터 (Phase 15.2)
 */
interface KeyframeEditorProps {
  animation: KeyframeAnimation | null;
  onClose: () => void;
}

export default function KeyframeEditor({ animation, onClose }: KeyframeEditorProps) {
  const { createKeyframeAnimation, updateKeyframeAnimation } = useBuilderStore();

  const [name, setName] = useState(animation?.name || '');
  const [description, setDescription] = useState(animation?.description || '');
  const [duration, setDuration] = useState(animation?.duration || 1000);
  const [timingFunction, setTimingFunction] = useState(animation?.timingFunction || 'ease');
  const [iterationCount, setIterationCount] = useState<number | 'infinite'>(
    animation?.iterationCount || 1
  );
  const [direction, setDirection] = useState(animation?.direction || 'normal');
  const [fillMode, setFillMode] = useState(animation?.fillMode || 'forwards');

  const [keyframes, setKeyframes] = useState<Keyframe[]>(
    animation?.keyframes || [
      { offset: 0, styles: { opacity: '1' } },
      { offset: 100, styles: { opacity: '1' } },
    ]
  );

  const isEditing = !!animation;

  const handleAddKeyframe = () => {
    const newOffset = 50; // 기본 50%
    const newKeyframe: Keyframe = {
      offset: newOffset,
      styles: { opacity: '1' },
    };
    setKeyframes([...keyframes, newKeyframe].sort((a, b) => a.offset - b.offset));
  };

  const handleRemoveKeyframe = (index: number) => {
    if (keyframes.length <= 2) {
      alert('최소 2개의 키프레임이 필요합니다.');
      return;
    }
    setKeyframes(keyframes.filter((_, i) => i !== index));
  };

  const handleUpdateKeyframe = (index: number, updates: Partial<Keyframe>) => {
    const updated = [...keyframes];
    updated[index] = { ...updated[index], ...updates };
    setKeyframes(updated);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('애니메이션 이름을 입력하세요.');
      return;
    }

    if (keyframes.length < 2) {
      alert('최소 2개의 키프레임이 필요합니다.');
      return;
    }

    // 오프셋 순서로 정렬
    const sortedKeyframes = [...keyframes].sort((a, b) => a.offset - b.offset);

    if (isEditing) {
      updateKeyframeAnimation(animation.id, {
        name,
        description,
        keyframes: sortedKeyframes,
        duration,
        timingFunction,
        iterationCount,
        direction,
        fillMode,
      });
    } else {
      createKeyframeAnimation(name, sortedKeyframes, {
        description,
        duration,
        timingFunction,
        iterationCount,
        direction,
        fillMode,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? '키프레임 애니메이션 편집' : '새 키프레임 애니메이션'}
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                애니메이션 이름 *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: bounce, fade-in-out"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="애니메이션 설명 (선택사항)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">지속 시간 (ms)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 1000)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="100"
                max="10000"
                step="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이징 함수</label>
              <select
                value={timingFunction}
                onChange={(e) => setTimingFunction(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="linear">Linear</option>
                <option value="ease">Ease</option>
                <option value="ease-in">Ease In</option>
                <option value="ease-out">Ease Out</option>
                <option value="ease-in-out">Ease In Out</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">반복 횟수</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={iterationCount === 'infinite' ? 1 : iterationCount}
                  onChange={(e) => setIterationCount(parseInt(e.target.value) || 1)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  min="1"
                  max="100"
                  disabled={iterationCount === 'infinite'}
                />
                <button
                  onClick={() =>
                    setIterationCount(iterationCount === 'infinite' ? 1 : 'infinite')
                  }
                  className={`px-3 py-2 text-sm rounded border ${
                    iterationCount === 'infinite'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  무한
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">방향</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="normal">Normal</option>
                <option value="reverse">Reverse</option>
                <option value="alternate">Alternate</option>
                <option value="alternate-reverse">Alternate Reverse</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fill Mode</label>
              <select
                value={fillMode}
                onChange={(e) => setFillMode(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="none">None</option>
                <option value="forwards">Forwards</option>
                <option value="backwards">Backwards</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          {/* 키프레임 목록 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">키프레임</h3>
              <button
                onClick={handleAddKeyframe}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 rounded transition-colors"
              >
                <Plus size={14} />
                <span>키프레임 추가</span>
              </button>
            </div>

            <div className="space-y-2">
              {keyframes.map((keyframe, index) => (
                <KeyframeItem
                  key={index}
                  keyframe={keyframe}
                  index={index}
                  canDelete={keyframes.length > 2}
                  onUpdate={(updates) => handleUpdateKeyframe(index, updates)}
                  onDelete={() => handleRemoveKeyframe(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            {isEditing ? '저장' : '생성'}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 키프레임 아이템 컴포넌트
 */
interface KeyframeItemProps {
  keyframe: Keyframe;
  index: number;
  canDelete: boolean;
  onUpdate: (updates: Partial<Keyframe>) => void;
  onDelete: () => void;
}

function KeyframeItem({ keyframe, index, canDelete, onUpdate, onDelete }: KeyframeItemProps) {
  const updateStyle = (key: string, value: string) => {
    onUpdate({
      styles: {
        ...keyframe.styles,
        [key]: value,
      },
    });
  };

  return (
    <div className="border rounded p-3 bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-700">키프레임 {index + 1}</span>
          <input
            type="number"
            value={keyframe.offset}
            onChange={(e) => onUpdate({ offset: parseInt(e.target.value) || 0 })}
            className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
            min="0"
            max="100"
          />
          <span className="text-xs text-gray-500">%</span>
        </div>
        {canDelete && (
          <button
            onClick={onDelete}
            className="p-1 rounded hover:bg-red-100 text-red-600"
            title="삭제"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* 스타일 속성 */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Opacity</label>
          <input
            type="number"
            value={keyframe.styles.opacity || 1}
            onChange={(e) => updateStyle('opacity', e.target.value)}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            min="0"
            max="1"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">Transform</label>
          <input
            type="text"
            value={(keyframe.styles.transform as string) || ''}
            onChange={(e) => updateStyle('transform', e.target.value)}
            placeholder="scale(1.2)"
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">Background</label>
          <input
            type="color"
            value={(keyframe.styles.backgroundColor as string) || '#ffffff'}
            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
            className="w-full h-8 rounded border border-gray-300"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">Border Radius</label>
          <input
            type="text"
            value={(keyframe.styles.borderRadius as string) || '0'}
            onChange={(e) => updateStyle('borderRadius', e.target.value)}
            placeholder="50%"
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  );
}
