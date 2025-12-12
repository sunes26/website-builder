import { ChevronUp, ChevronDown, Trash2, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import { useState } from 'react';

export default function LayerControls() {
  const { selectedElementIds, elements, moveLayerUp, moveLayerDown, deleteElements, updateElement } =
    useBuilderStore();
  const [showBulkMenu, setShowBulkMenu] = useState(false);

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

  // 대량 작업 핸들러
  const handleBulkLock = () => {
    elements.forEach((el) => {
      if (!el.locked) {
        updateElement(el.id, { locked: true });
      }
    });
    setShowBulkMenu(false);
  };

  const handleBulkUnlock = () => {
    elements.forEach((el) => {
      if (el.locked) {
        updateElement(el.id, { locked: false });
      }
    });
    setShowBulkMenu(false);
  };

  const handleBulkHide = () => {
    elements.forEach((el) => {
      if (el.visible) {
        updateElement(el.id, { visible: false });
      }
    });
    setShowBulkMenu(false);
  };

  const handleBulkShow = () => {
    elements.forEach((el) => {
      if (!el.visible) {
        updateElement(el.id, { visible: true });
      }
    });
    setShowBulkMenu(false);
  };

  // 선택된 요소 잠금/해제
  const handleToggleSelectedLock = () => {
    if (!hasSelection) return;
    const selectedElements = elements.filter((el) => selectedElementIds.includes(el.id));
    const allLocked = selectedElements.every((el) => el.locked);
    selectedElementIds.forEach((id) => {
      updateElement(id, { locked: !allLocked });
    });
  };

  // 선택된 요소 숨김/표시
  const handleToggleSelectedVisibility = () => {
    if (!hasSelection) return;
    const selectedElements = elements.filter((el) => selectedElementIds.includes(el.id));
    const allVisible = selectedElements.every((el) => el.visible);
    selectedElementIds.forEach((id) => {
      updateElement(id, { visible: !allVisible });
    });
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

          {/* 선택된 요소 숨김/표시 */}
          <button
            onClick={handleToggleSelectedVisibility}
            disabled={!hasSelection}
            className={`
              p-1.5 rounded transition-colors
              ${!hasSelection
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
              }
            `}
            title="선택 항목 숨김/표시 (Ctrl+H)"
          >
            <Eye size={16} />
          </button>

          {/* 선택된 요소 잠금/해제 */}
          <button
            onClick={handleToggleSelectedLock}
            disabled={!hasSelection}
            className={`
              p-1.5 rounded transition-colors
              ${!hasSelection
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
              }
            `}
            title="선택 항목 잠금/해제 (Ctrl+L)"
          >
            <Lock size={16} />
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

      {/* 대량 작업 버튼 */}
      <div className="mt-2 relative">
        <button
          onClick={() => setShowBulkMenu(!showBulkMenu)}
          className="w-full text-xs text-gray-600 hover:text-gray-800 transition-colors text-left"
        >
          대량 작업 {showBulkMenu ? '▲' : '▼'}
        </button>

        {showBulkMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowBulkMenu(false)}
            />
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
              <button
                onClick={handleBulkLock}
                className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Lock size={14} />
                모두 잠그기
              </button>
              <button
                onClick={handleBulkUnlock}
                className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Unlock size={14} />
                모두 잠금 해제
              </button>
              <div className="border-t border-gray-100 my-1" />
              <button
                onClick={handleBulkHide}
                className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <EyeOff size={14} />
                모두 숨기기
              </button>
              <button
                onClick={handleBulkShow}
                className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Eye size={14} />
                모두 표시
              </button>
            </div>
          </>
        )}
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