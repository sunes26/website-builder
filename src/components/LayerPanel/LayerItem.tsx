import { Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import type { CanvasElement } from '../../types';

interface LayerItemProps {
  element: CanvasElement;
  isSelected: boolean;
  onClick: (isMultiSelect: boolean, isRangeSelect: boolean) => void;
}

export default function LayerItem({ element, isSelected, onClick }: LayerItemProps) {
  const { updateElement } = useBuilderStore();

  // 레이어 이름 생성
  const getLayerName = (el: CanvasElement): string => {
    const typeNames: Record<string, string> = {
      shape: '도형',
      line: '직선',
      arrow: '화살표',
      text: '텍스트',
      image: '이미지',
    };

    const baseName = typeNames[el.type] || el.type;
    const id = el.id.substring(0, 4);

    // 텍스트 요소는 내용 일부 표시
    if (el.type === 'text' && el.content) {
      const preview = el.content.substring(0, 15);
      return `${baseName}: ${preview}${el.content.length > 15 ? '...' : ''}`;
    }

    // 도형 요소는 타입 표시 (Priority 4.2: 새 도형 추가)
    if (el.type === 'shape') {
      const shapeNames: Record<string, string> = {
        rectangle: '사각형',
        circle: '원',
        triangle: '삼각형',
        star: '별',
        pentagon: '오각형',
        hexagon: '육각형',
        octagon: '팔각형',
        diamond: '다이아몬드',
      };
      return `${shapeNames[el.shapeType] || el.shapeType} (${id})`;
    }

    return `${baseName} (${id})`;
  };

  // 레이어 아이콘 생성
  const getLayerIcon = (el: CanvasElement): JSX.Element => {
    const iconClass = 'w-4 h-4';

    switch (el.type) {
      case 'shape':
        if (el.shapeType === 'rectangle') {
          return (
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" strokeWidth="2" rx="2" />
            </svg>
          );
        } else if (el.shapeType === 'circle') {
          return (
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8" strokeWidth="2" />
            </svg>
          );
        } else {
          return (
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" d="M12 4 L20 20 L4 20 Z" />
            </svg>
          );
        }

      case 'line':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <line x1="4" y1="20" x2="20" y2="4" strokeWidth="2" />
          </svg>
        );

      case 'arrow':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <line x1="4" y1="20" x2="20" y2="4" strokeWidth="2" />
            <polyline points="14,4 20,4 20,10" strokeWidth="2" />
          </svg>
        );

      case 'text':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            />
          </svg>
        );

      case 'image':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" strokeWidth="2" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="2" />
            <path strokeWidth="2" d="M3 16 L8 11 L13 16" />
            <path strokeWidth="2" d="M14 15 L17 12 L21 16" />
          </svg>
        );

      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="4" y="4" width="16" height="16" strokeWidth="2" rx="2" />
          </svg>
        );
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const isMultiSelect = e.ctrlKey || e.metaKey;
    const isRangeSelect = e.shiftKey;
    onClick(isMultiSelect, isRangeSelect);
  };

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateElement(element.id, { visible: !element.visible });
  };

  const handleToggleLock = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateElement(element.id, { locked: !element.locked });
  };

  return (
    <div
      onClick={handleClick}
      className={`
        group relative px-3 py-2 cursor-pointer transition-colors
        ${isSelected
          ? 'bg-blue-50 border-l-2 border-blue-500'
          : 'hover:bg-gray-50 border-l-2 border-transparent'
        }
        ${element.locked ? 'opacity-60' : ''}
      `}
    >
      <div className="flex items-center space-x-2">
        {/* 레이어 아이콘 */}
        <div
          className={`
            flex-shrink-0
            ${isSelected ? 'text-blue-600' : 'text-gray-500'}
          `}
        >
          {getLayerIcon(element)}
        </div>

        {/* 레이어 이름 */}
        <div className="flex-1 min-w-0">
          <p
            className={`
              text-xs truncate
              ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'}
            `}
          >
            {getLayerName(element)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Z: {element.zIndex}
          </p>
        </div>

        {/* 컨트롤 버튼들 - 상태에 따라 항상 표시 */}
        <div className="flex items-center space-x-1">
          {/* 표시/숨김 토글 */}
          <button
            onClick={handleToggleVisibility}
            className={`p-1 rounded transition-all ${
              !element.visible
                ? 'bg-gray-200 text-gray-700'
                : 'hover:bg-gray-200 text-gray-400'
            }`}
            title={element.visible ? '숨기기 (Ctrl+H)' : '보이기 (Ctrl+H)'}
          >
            {element.visible ? (
              <Eye size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            ) : (
              <EyeOff size={14} />
            )}
          </button>

          {/* 잠금/해제 토글 */}
          <button
            onClick={handleToggleLock}
            className={`p-1 rounded transition-all ${
              element.locked
                ? 'bg-orange-100 text-orange-700'
                : 'hover:bg-gray-200 text-gray-400'
            }`}
            title={element.locked ? '잠금 해제 (Ctrl+L)' : '잠그기 (Ctrl+L)'}
          >
            {element.locked ? (
              <Lock size={14} />
            ) : (
              <Unlock size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}