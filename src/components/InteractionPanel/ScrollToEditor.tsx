import { useBuilderStore } from '../../store/builderStore';
import { useState, useEffect } from 'react';
import type { ScrollToAction } from '../../types';

interface ScrollToEditorProps {
  initialData?: ScrollToAction;
  onChange: (data: ScrollToAction) => void;
}

export default function ScrollToEditor({ initialData, onChange }: ScrollToEditorProps) {
  const { elements } = useBuilderStore();

  const [targetElementId, setTargetElementId] = useState(
    initialData?.targetElementId || ''
  );
  const [behavior, setBehavior] = useState<'smooth' | 'auto'>(
    initialData?.behavior || 'smooth'
  );
  const [offset, setOffset] = useState(initialData?.offset || 0);

  // 앵커 ID가 설정된 요소들만 필터링
  const anchorElements = elements.filter((el) => el.anchorId);

  useEffect(() => {
    if (targetElementId) {
      onChange({
        type: 'scroll-to',
        targetElementId,
        behavior,
        offset,
      });
    }
  }, [targetElementId, behavior, offset, onChange]);

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          스크롤 타겟
        </label>
        <select
          value={targetElementId}
          onChange={(e) => setTargetElementId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">요소 선택</option>
          {anchorElements.map((element) => (
            <option key={element.id} value={element.anchorId}>
              {element.anchorId} ({element.type})
            </option>
          ))}
        </select>
        {anchorElements.length === 0 && (
          <p className="text-xs text-amber-600 mt-1">
            ⚠️ 앵커 ID가 설정된 요소가 없습니다. 타겟 요소에 먼저 앵커 ID를 설정하세요.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          스크롤 동작
        </label>
        <select
          value={behavior}
          onChange={(e) => setBehavior(e.target.value as 'smooth' | 'auto')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="smooth">부드럽게 (Smooth)</option>
          <option value="auto">즉시 (Auto)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          오프셋 (Y축, px)
        </label>
        <input
          type="number"
          value={offset}
          onChange={(e) => setOffset(Number(e.target.value))}
          placeholder="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          양수: 아래로, 음수: 위로 이동
        </p>
      </div>
    </div>
  );
}
