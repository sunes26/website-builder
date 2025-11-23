import { useBuilderStore } from '../../store/builderStore';
import LayerItem from './LayerItem';
import LayerControls from './LayerControls';
import type { CanvasElement } from '../../types';

export default function LayerPanel() {
  const { elements, selectedElementIds, selectElements } = useBuilderStore();

  // zIndex 순서대로 정렬 (높은 것이 위로)
  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  const handleLayerClick = (elementId: string, isMultiSelect: boolean) => {
    if (isMultiSelect) {
      selectElements([elementId], 'add');
    } else {
      selectElements([elementId], 'replace');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800">레이어</h3>
        <p className="text-xs text-gray-500 mt-1">
          {elements.length}개의 요소
        </p>
      </div>

      {/* 레이어 컨트롤 */}
      <LayerControls />

      {/* 레이어 목록 */}
      <div className="flex-1 overflow-y-auto">
        {sortedElements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500 mb-2">레이어가 없습니다</p>
            <p className="text-xs text-gray-400">
              좌측 도구바에서 도구를 선택하고<br />
              캔버스에 요소를 추가하세요
            </p>
          </div>
        ) : (
          <div className="py-2">
            {sortedElements.map((element) => (
              <LayerItem
                key={element.id}
                element={element}
                isSelected={selectedElementIds.includes(element.id)}
                onClick={(isMultiSelect) => handleLayerClick(element.id, isMultiSelect)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 푸터 정보 */}
      {elements.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>총 레이어:</span>
              <span className="font-medium text-gray-700">{elements.length}개</span>
            </div>
            <div className="flex justify-between">
              <span>선택됨:</span>
              <span className="font-medium text-blue-600">
                {selectedElementIds.length}개
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}