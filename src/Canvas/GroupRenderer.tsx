import type { GroupElement, CanvasElement, ComputedLayout } from '../types';
import LayoutCalculator from './LayoutCalculator';
import LayoutGuides from './LayoutGuides';

interface GroupRendererProps {
  group: GroupElement;
  isSelected: boolean;
  children: CanvasElement[];
  onLayoutComputed: (layouts: ComputedLayout[]) => void;
  onClick?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
}

/**
 * 그룹 렌더러 (Phase 8, 확장: Phase 15)
 *
 * 그룹은 시각적으로 렌더링되지 않고, 자식 요소들은 별도로 렌더링됩니다.
 * 선택 시 그룹의 바운딩 박스만 표시됩니다.
 * Phase 15: 레이아웃 컨테이너인 경우 Hidden DOM으로 계산하고 가이드를 표시합니다.
 */
export default function GroupRenderer({
  group,
  isSelected,
  children,
  onLayoutComputed,
  onClick,
  onMouseDown,
}: GroupRendererProps) {
  if (!group.visible) return null;

  return (
    <g
      onClick={onClick}
      onMouseDown={onMouseDown}
      style={{ cursor: group.locked ? 'default' : 'pointer' }}
    >
      {/* Phase 15: Hidden DOM으로 레이아웃 계산 */}
      {group.layout && (
        <LayoutCalculator
          group={group}
          children={children}
          onLayoutComputed={onLayoutComputed}
        />
      )}

      {/* 그룹 테두리 (선택 시만 표시) */}
      {isSelected && (
        <rect
          x={group.position.x}
          y={group.position.y}
          width={group.size.width}
          height={group.size.height}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="5,5"
          pointerEvents="none"
        />
      )}

      {/* Phase 15: 레이아웃 가이드 (선택 시만 표시) */}
      <LayoutGuides group={group} isSelected={isSelected} />
    </g>
  );
}
