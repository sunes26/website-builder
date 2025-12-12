import { useEffect, useRef } from 'react';
import type { CanvasElement, GroupElement, ComponentInstance, ComputedLayout, FlexboxLayout, GridLayout } from '../types';

/**
 * LayoutCalculator Component (Phase 15)
 *
 * Hidden foreignObject를 사용하여 브라우저의 레이아웃 엔진으로
 * Flexbox/Grid 레이아웃을 계산하고 결과를 콜백으로 전달합니다.
 */

interface LayoutCalculatorProps {
  group: GroupElement | ComponentInstance;
  children: CanvasElement[];
  onLayoutComputed: (layouts: ComputedLayout[]) => void;
}

export default function LayoutCalculator({
  group,
  children,
  onLayoutComputed,
}: LayoutCalculatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const childRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    // 레이아웃이 없으면 계산하지 않음
    if (!group.layout) {
      return;
    }

    // DOM이 렌더링된 후 레이아웃 계산
    const timer = requestAnimationFrame(() => {
      if (!containerRef.current) return;

      const layouts: ComputedLayout[] = [];
      const containerRect = containerRef.current.getBoundingClientRect();

      // 각 자식 요소의 계산된 위치 읽기
      children.forEach((child) => {
        const childEl = childRefs.current[child.id];
        if (!childEl) return;

        const childRect = childEl.getBoundingClientRect();

        // 컨테이너 기준 상대 좌표 계산
        const relativeX = childRect.left - containerRect.left;
        const relativeY = childRect.top - containerRect.top;

        // 그룹의 절대 위치에 상대 좌표를 더함
        const absoluteX = group.position.x + relativeX;
        const absoluteY = group.position.y + relativeY;

        layouts.push({
          elementId: child.id,
          computedPosition: {
            x: absoluteX,
            y: absoluteY,
          },
          computedSize: {
            width: childRect.width,
            height: childRect.height,
          },
        });
      });

      // 계산 결과 콜백
      onLayoutComputed(layouts);
    });

    return () => {
      cancelAnimationFrame(timer);
    };
  }, [group, children, onLayoutComputed]);

  // 레이아웃이 없으면 렌더링하지 않음
  if (!group.layout) {
    return null;
  }

  // 컨테이너 스타일 생성
  const containerStyle = generateContainerStyle(group.layout, group.size);

  return (
    <foreignObject
      x="-10000"
      y="0"
      width="1920"
      height="1080"
      style={{ visibility: 'hidden', pointerEvents: 'none' }}
    >
      <div ref={containerRef} style={containerStyle}>
        {children.map((child) => (
          <div
            key={child.id}
            ref={(el) => {
              childRefs.current[child.id] = el;
            }}
            style={generateChildStyle(child)}
          />
        ))}
      </div>
    </foreignObject>
  );
}

/**
 * Flexbox/Grid 컨테이너 스타일 생성
 */
function generateContainerStyle(
  layout: FlexboxLayout | GridLayout,
  size: { width: number; height: number }
): React.CSSProperties {
  const baseStyle: React.CSSProperties = {
    width: `${size.width}px`,
    height: `${size.height}px`,
    boxSizing: 'border-box',
    position: 'relative',
  };

  if (layout.type === 'flex') {
    const rowGap = layout.rowGap !== undefined ? layout.rowGap : layout.gap;
    const columnGap = layout.columnGap !== undefined ? layout.columnGap : layout.gap;

    return {
      ...baseStyle,
      display: 'flex',
      flexDirection: layout.flexDirection,
      justifyContent: layout.justifyContent,
      alignItems: layout.alignItems,
      flexWrap: layout.flexWrap,
      rowGap: `${rowGap}px`,
      columnGap: `${columnGap}px`,
    };
  }

  if (layout.type === 'grid') {
    const rowGap = layout.rowGap !== undefined ? layout.rowGap : layout.gap;
    const columnGap = layout.columnGap !== undefined ? layout.columnGap : layout.gap;

    return {
      ...baseStyle,
      display: 'grid',
      gridTemplateColumns: layout.gridTemplateColumns,
      gridTemplateRows: layout.gridTemplateRows,
      rowGap: `${rowGap}px`,
      columnGap: `${columnGap}px`,
      justifyItems: layout.justifyItems,
      alignItems: layout.alignItems,
      gridAutoFlow: layout.gridAutoFlow,
    };
  }

  return baseStyle;
}

/**
 * 자식 요소 스타일 생성
 */
function generateChildStyle(child: CanvasElement): React.CSSProperties {
  const baseStyle: React.CSSProperties = {
    width: `${child.size.width}px`,
    height: `${child.size.height}px`,
    boxSizing: 'border-box',
  };

  // Flex 자식 속성
  if (child.layoutChild && 'flexGrow' in child.layoutChild) {
    const flexProps = child.layoutChild;
    return {
      ...baseStyle,
      flexGrow: flexProps.flexGrow,
      flexShrink: flexProps.flexShrink,
      flexBasis: flexProps.flexBasis,
      order: flexProps.order,
      alignSelf: flexProps.alignSelf,
    };
  }

  // Grid 자식 속성
  if (child.layoutChild && 'gridColumn' in child.layoutChild) {
    const gridProps = child.layoutChild;
    return {
      ...baseStyle,
      gridColumn: gridProps.gridColumn,
      gridRow: gridProps.gridRow,
      justifySelf: gridProps.justifySelf,
      alignSelf: gridProps.alignSelf,
    };
  }

  return baseStyle;
}
