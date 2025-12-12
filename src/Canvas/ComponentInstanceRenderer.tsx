import type { ComponentInstance, CanvasElement, ComputedLayout } from '../types';
import LayoutCalculator from './LayoutCalculator';
import LayoutGuides from './LayoutGuides';

interface ComponentInstanceRendererProps {
  instance: ComponentInstance;
  isSelected: boolean;
  children: CanvasElement[];
  onLayoutComputed: (layouts: ComputedLayout[]) => void;
  onClick?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
}

export default function ComponentInstanceRenderer({
  instance,
  isSelected,
  children,
  onLayoutComputed,
  onClick,
  onMouseDown,
}: ComponentInstanceRendererProps) {
  if (!instance.visible) return null;

  // Note: 자식 요소들은 Canvas의 sortedElements에서 별도로 렌더링됨
  // 여기서는 컴포넌트 인스턴스의 시각적 표시만 담당
  // Phase 15: 레이아웃 컨테이너인 경우 Hidden DOM으로 계산

  return (
    <g
      onClick={onClick}
      onMouseDown={onMouseDown}
      style={{
        cursor: instance.locked ? 'default' : 'pointer',
      }}
    >
      {/* Phase 15: Hidden DOM으로 레이아웃 계산 */}
      {instance.layout && (
        <LayoutCalculator
          group={instance}
          children={children}
          onLayoutComputed={onLayoutComputed}
        />
      )}

      {/* 선택 시 보라색 테두리 (컴포넌트 구분) */}
      {isSelected && (
        <>
          <rect
            x={instance.position.x}
            y={instance.position.y}
            width={instance.size.width}
            height={instance.size.height}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
            strokeDasharray="8,4"
            pointerEvents="none"
          />

          {/* "Component" 라벨 */}
          <g
            transform={`translate(${instance.position.x}, ${
              instance.position.y - 22
            })`}
          >
            <rect
              width="80"
              height="18"
              fill="#8b5cf6"
              rx="4"
              pointerEvents="none"
            />
            <text
              x="40"
              y="13"
              fill="white"
              fontSize="10"
              fontWeight="600"
              textAnchor="middle"
              pointerEvents="none"
            >
              Component
            </text>
          </g>
        </>
      )}

      {/* Phase 15: 레이아웃 가이드 (선택 시만 표시) */}
      <LayoutGuides group={instance} isSelected={isSelected} />
    </g>
  );
}
