import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';

export default function LayerControls() {
  const { selectedElementIds, elements, moveLayerUp, moveLayerDown, deleteElements } =
    useBuilderStore();

  const hasSelection = selectedElementIds.length > 0;
  const selectedElement = hasSelection
    ? elements.find((el) => el.id === selectedElementIds[0])
    : null;

  // 최상위/최하위 레이어 체크
  const isTopLayer = selectedElement
    ? elements.every((el) => el.zIndex <= selectedElement.zIndex)
    : false;
  const isBottomLayer = selectedElement
    ? elements.every((el) => el.zIndex >= selectedElement.zIndex)
    : false;

  const handleMoveUp = () => {
    if (!hasSelection || isTopLayer) return;
    selectedElementIds.forEach((id) => moveLayerUp(id));
  };

  const handleMoveDown = () => {
    if (!hasSelection || isBottomLayer) return;
    selectedElementIds.forEach((id) => moveLayerDown(id));
  };

  const handleDelete = () => {
    if (!hasSelection) return;
    if (confirm(`${selectedElementIds.length}개의 레이어를 삭제하시겠습니까?`)) {
      deleteElements(selectedElementIds);
    }
  };

  return (
    <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">레이어 순서</span>
        
        <div className="flex items-center space-x-1">
          {/* 위로 이동 */}
          <button
            onClick={handleMoveUp}
            disabled={!hasSelection || isTopLayer}
            className={`
              p-1.5 rounded transition-colors
              ${!hasSelection || isTopLayer
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
              }
            `}
            title="위로 이동 (zIndex 증가)"
          >
            <ChevronUp size={16} />
          </button>

          {/* 아래로 이동 */}
          <button
            onClick={handleMoveDown}
            disabled={!hasSelection || isBottomLayer}
            className={`
              p-1.5 rounded transition-colors
              ${!hasSelection || isBottomLayer
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
              }
            `}
            title="아래로 이동 (zIndex 감소)"
          >
            <ChevronDown size={16} />
          </button>

          {/* 구분선 */}
          <div className="w-px h-4 bg-gray-300 mx-1" />

          {/* 삭제 */}
          <button
            onClick={handleDelete}
            disabled={!hasSelection}
            className={`
              p-1.5 rounded transition-colors
              ${!hasSelection
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-red-600 hover:bg-red-50 hover:text-red-700'
              }
            `}
            title="레이어 삭제"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* 선택된 레이어 정보 */}
      {hasSelection && (
        <div className="mt-2 text-xs text-gray-500">
          {selectedElementIds.length === 1 ? (
            <span>
              1개 선택됨
              {selectedElement && ` · Z: ${selectedElement.zIndex}`}
            </span>
          ) : (
            <span>{selectedElementIds.length}개 선택됨</span>
          )}
        </div>
      )}
    </div>
  );
}