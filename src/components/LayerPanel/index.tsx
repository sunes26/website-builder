import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import LayerItem from './LayerItem';
import LayerControls from './LayerControls';
import type { CanvasElement } from '../../types';

export default function LayerPanel() {
  const { elements, selectedElementIds, selectElements } = useBuilderStore();
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const lastClickedIdRef = useRef<string | null>(null);

  // Ctrl+F로 검색 포커스
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // zIndex 순서대로 정렬 (높은 것이 위로)
  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  // 검색 필터링
  const filteredElements = sortedElements.filter((element) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const typeName = getElementTypeName(element).toLowerCase();

    // 타입 이름으로 검색
    if (typeName.includes(query)) return true;

    // 텍스트 요소의 경우 content로 검색
    if (element.type === 'text' && element.content) {
      if (element.content.toLowerCase().includes(query)) return true;
    }

    // ID로 검색
    if (element.id.toLowerCase().includes(query)) return true;

    return false;
  });

  const handleLayerClick = (elementId: string, isMultiSelect: boolean, isRangeSelect: boolean) => {
    // Shift+클릭: 범위 선택 (Priority 1.2)
    if (isRangeSelect && lastClickedIdRef.current) {
      const lastIndex = sortedElements.findIndex(el => el.id === lastClickedIdRef.current);
      const currentIndex = sortedElements.findIndex(el => el.id === elementId);

      if (lastIndex !== -1 && currentIndex !== -1) {
        const start = Math.min(lastIndex, currentIndex);
        const end = Math.max(lastIndex, currentIndex);
        const rangeIds = sortedElements.slice(start, end + 1).map(el => el.id);
        selectElements(rangeIds, 'replace');
        // Shift+클릭 시에는 lastClickedId를 업데이트하지 않음 (연속 범위 선택 가능)
        return;
      }
    }

    // Ctrl/Cmd+클릭: 다중 선택
    if (isMultiSelect) {
      selectElements([elementId], 'add');
    } else {
      selectElements([elementId], 'replace');
    }

    // 마지막 클릭 요소 업데이트
    lastClickedIdRef.current = elementId;
  };

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800">레이어</h3>
        <p className="text-xs text-gray-500 mt-1">
          {elements.length}개의 요소
          {searchQuery && ` · ${filteredElements.length}개 검색됨`}
        </p>
      </div>

      {/* 검색 입력 (Priority 0.4) */}
      <div className="px-4 py-2 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="레이어 검색... (Ctrl+F)"
            className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X size={14} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* 레이어 컨트롤 */}
      <LayerControls />

      {/* 레이어 목록 */}
      <div className="flex-1 overflow-y-auto">
        {filteredElements.length === 0 && searchQuery ? (
          <div className="flex flex-col items-center justify-center h-full px-4 py-12 text-center">
            <Search className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500 mb-1">검색 결과 없음</p>
            <p className="text-xs text-gray-400">
              '{searchQuery}'와 일치하는 레이어가 없습니다
            </p>
          </div>
        ) : sortedElements.length === 0 ? (
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
            {filteredElements.map((element) => (
              <LayerItem
                key={element.id}
                element={element}
                isSelected={selectedElementIds.includes(element.id)}
                onClick={(isMultiSelect, isRangeSelect) => handleLayerClick(element.id, isMultiSelect, isRangeSelect)}
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

// 요소 타입 이름 가져오기
function getElementTypeName(element: CanvasElement): string {
  const typeNames: Record<string, string> = {
    shape: '도형',
    line: '직선',
    arrow: '화살표',
    text: '텍스트',
    image: '이미지',
    group: '그룹',
    component: '컴포넌트',
  };
  return typeNames[element.type] || element.type;
}