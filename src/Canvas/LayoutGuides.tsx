import type { GroupElement, ComponentInstance } from '../types';

/**
 * LayoutGuides Component (Phase 15.2)
 *
 * 레이아웃 컨테이너(Flexbox/Grid)의 시각적 가이드를 표시합니다.
 * 선택된 상태에서만 보입니다.
 */

interface LayoutGuidesProps {
  group: GroupElement | ComponentInstance;
  isSelected: boolean;
}

export default function LayoutGuides({ group, isSelected }: LayoutGuidesProps) {
  // 선택되지 않았거나 레이아웃이 없으면 렌더링하지 않음
  if (!isSelected || !group.layout) {
    return null;
  }

  const { position, size, layout } = group;

  // Flexbox 가이드
  if (layout.type === 'flex') {
    const isRow = layout.flexDirection === 'row' || layout.flexDirection === 'row-reverse';
    const isReverse = layout.flexDirection === 'row-reverse' || layout.flexDirection === 'column-reverse';

    return (
      <g opacity="0.5">
        {/* Main Axis 표시 */}
        {isRow ? (
          <>
            {/* 가로 축 화살표 */}
            <line
              x1={position.x + 20}
              y1={position.y + 10}
              x2={position.x + size.width - 20}
              y2={position.y + 10}
              stroke="#3b82f6"
              strokeWidth="2"
              markerEnd="url(#flexArrowEnd)"
              markerStart={isReverse ? "url(#flexArrowStart)" : undefined}
            />
            <text
              x={position.x + size.width / 2}
              y={position.y + 5}
              textAnchor="middle"
              fill="#3b82f6"
              fontSize="10"
              fontFamily="Inter, sans-serif"
              fontWeight="600"
            >
              Main Axis (Row)
            </text>
          </>
        ) : (
          <>
            {/* 세로 축 화살표 */}
            <line
              x1={position.x + 10}
              y1={position.y + 20}
              x2={position.x + 10}
              y2={position.y + size.height - 20}
              stroke="#3b82f6"
              strokeWidth="2"
              markerEnd="url(#flexArrowEnd)"
              markerStart={isReverse ? "url(#flexArrowStart)" : undefined}
            />
            <text
              x={position.x + 15}
              y={position.y + size.height / 2}
              fill="#3b82f6"
              fontSize="10"
              fontFamily="Inter, sans-serif"
              fontWeight="600"
            >
              Main
            </text>
          </>
        )}

        {/* Gap 표시 */}
        {layout.gap > 0 && (
          <text
            x={position.x + size.width - 5}
            y={position.y + size.height - 5}
            textAnchor="end"
            fill="#8b5cf6"
            fontSize="9"
            fontFamily="Inter, sans-serif"
          >
            gap: {layout.gap}px
          </text>
        )}
      </g>
    );
  }

  // Grid 가이드
  if (layout.type === 'grid') {
    const rowGap = layout.rowGap !== undefined ? layout.rowGap : layout.gap;
    const columnGap = layout.columnGap !== undefined ? layout.columnGap : layout.gap;

    return (
      <g opacity="0.4">
        {/* Grid 외곽선 */}
        <rect
          x={position.x}
          y={position.y}
          width={size.width}
          height={size.height}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="1"
          strokeDasharray="3,3"
        />

        {/* Grid 정보 텍스트 */}
        <text
          x={position.x + 5}
          y={position.y + 12}
          fill="#8b5cf6"
          fontSize="10"
          fontFamily="Inter, sans-serif"
          fontWeight="600"
        >
          Grid: {layout.gridTemplateColumns}
        </text>

        {layout.gap > 0 && (
          <text
            x={position.x + size.width - 5}
            y={position.y + size.height - 5}
            textAnchor="end"
            fill="#8b5cf6"
            fontSize="9"
            fontFamily="Inter, sans-serif"
          >
            gap: {columnGap}×{rowGap}px
          </text>
        )}
      </g>
    );
  }

  return null;
}

/**
 * Arrow markers for Flexbox guides
 * Should be defined in SVG <defs> section
 */
export function LayoutGuidesDefs() {
  return (
    <defs>
      <marker
        id="flexArrowEnd"
        markerWidth="10"
        markerHeight="10"
        refX="9"
        refY="3"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
      </marker>
      <marker
        id="flexArrowStart"
        markerWidth="10"
        markerHeight="10"
        refX="0"
        refY="3"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M9,0 L9,6 L0,3 z" fill="#3b82f6" />
      </marker>
    </defs>
  );
}
