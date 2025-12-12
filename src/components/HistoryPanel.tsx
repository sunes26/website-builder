import { History, RotateCcw, RotateCw } from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';

/**
 * 히스토리 패널 (Priority 1.3)
 *
 * Undo/Redo 히스토리를 시각적으로 표시하고
 * 특정 상태로 바로 점프할 수 있는 패널
 */
export default function HistoryPanel() {
  const { history, undo, redo, canUndo, canRedo, jumpToHistoryState } = useBuilderStore();

  // 모든 히스토리 상태 (past + present + future)
  const allStates = [...history.past, history.present!].filter(Boolean);
  const currentIndex = history.past.length;

  // 액션 설명 생성 (Priority 3.3 개선: action 이름 우선 사용)
  const getActionDescription = (state: any, index: number): string => {
    if (index === 0) return '초기 상태';

    // action 이름이 있으면 우선 사용
    if (state.action) {
      return state.action;
    }

    // action 이름이 없으면 기존 방식으로 추론
    const prevState = allStates[index - 1];
    const elemCount = state.elements.length;
    const prevElemCount = prevState?.elements?.length || 0;

    if (elemCount > prevElemCount) {
      return `요소 추가 (${elemCount}개)`;
    } else if (elemCount < prevElemCount) {
      return `요소 삭제 (${elemCount}개)`;
    } else {
      return `요소 수정 (${elemCount}개)`;
    }
  };

  // 타임스탬프 포맷팅
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;

    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  const handleStateClick = (index: number) => {
    if (index !== currentIndex) {
      jumpToHistoryState(index);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800">히스토리</h3>
        <p className="text-xs text-gray-500 mt-1">
          {allStates.length}개의 상태
        </p>
      </div>

      {/* Undo/Redo 버튼 */}
      <div className="px-4 py-3 border-b border-gray-200 flex gap-2">
        <button
          onClick={undo}
          disabled={!canUndo()}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors"
          title="실행 취소 (Ctrl+Z)"
        >
          <RotateCcw size={16} />
          <span>실행 취소</span>
        </button>
        <button
          onClick={redo}
          disabled={!canRedo()}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors"
          title="다시 실행 (Ctrl+Shift+Z)"
        >
          <RotateCw size={16} />
          <span>다시 실행</span>
        </button>
      </div>

      {/* 히스토리 타임라인 */}
      <div className="flex-1 overflow-y-auto">
        {allStates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <History className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-2">히스토리가 없습니다</p>
            <p className="text-xs text-gray-400">
              작업을 시작하면 히스토리가 생성됩니다
            </p>
          </div>
        ) : (
          <div className="py-2">
            {allStates.map((state, index) => {
              const isCurrent = index === currentIndex;
              const isFuture = index > currentIndex;

              return (
                <div
                  key={index}
                  onClick={() => handleStateClick(index)}
                  className={`
                    relative px-4 py-3 cursor-pointer transition-all
                    border-l-2 mx-2 mb-2 rounded-r-lg
                    ${isCurrent
                      ? 'bg-blue-50 border-blue-500'
                      : isFuture
                      ? 'bg-gray-50 border-gray-200 opacity-50'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                    }
                  `}
                >
                  {/* 상태 번호 & 설명 */}
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`
                            inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium
                            ${isCurrent
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                            }
                          `}
                        >
                          {index + 1}
                        </span>
                        <span className={`
                          text-sm font-medium
                          ${isCurrent ? 'text-blue-900' : 'text-gray-700'}
                        `}>
                          {getActionDescription(state, index)}
                        </span>
                      </div>
                    </div>
                    {isCurrent && (
                      <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full font-medium">
                        현재
                      </span>
                    )}
                  </div>

                  {/* 타임스탬프 */}
                  <div className="text-xs text-gray-400 ml-8">
                    {formatTimestamp(state.timestamp)}
                  </div>

                  {/* 선택된 요소 수 */}
                  {state.selectedElementIds.length > 0 && (
                    <div className="text-xs text-gray-500 ml-8 mt-1">
                      선택: {state.selectedElementIds.length}개
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 푸터 정보 */}
      {allStates.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>과거:</span>
              <span className="font-medium text-gray-700">{history.past.length}개</span>
            </div>
            <div className="flex justify-between">
              <span>미래:</span>
              <span className="font-medium text-gray-700">{history.future.length}개</span>
            </div>
            <div className="flex justify-between">
              <span>최대:</span>
              <span className="font-medium text-gray-700">{history.maxSize}개</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
