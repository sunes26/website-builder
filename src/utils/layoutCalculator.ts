import type { CanvasElement, GroupElement, LayoutConfig, Position, Size, ComputedLayout } from '../types';

/**
 * Layout Calculator Utility (Phase 15)
 *
 * 레이아웃 계산 관련 헬퍼 함수들
 * 실제 레이아웃 계산은 LayoutCalculator.tsx 컴포넌트에서 Hidden DOM을 사용하여 수행됨
 */

/**
 * 레이아웃이 활성화되어 있는지 확인
 */
export function hasLayout(element: CanvasElement): boolean {
  return element.layout !== null && element.layout !== undefined;
}

/**
 * 요소가 레이아웃 컨테이너가 될 수 있는지 확인
 * (그룹 또는 컴포넌트만 가능)
 */
export function canBeLayoutContainer(element: CanvasElement): boolean {
  return element.type === 'group' || element.type === 'component';
}

/**
 * 요소가 Flexbox 컨테이너인지 확인
 */
export function isFlexContainer(element: CanvasElement): boolean {
  return hasLayout(element) && element.layout?.type === 'flex';
}

/**
 * 요소가 Grid 컨테이너인지 확인
 */
export function isGridContainer(element: CanvasElement): boolean {
  return hasLayout(element) && element.layout?.type === 'grid';
}

/**
 * 계산된 위치를 가져옴 (computedPosition이 있으면 우선, 없으면 기본 position)
 */
export function getEffectivePosition(element: CanvasElement): Position {
  if (element.computedPosition) {
    return element.computedPosition;
  }
  return element.position;
}

/**
 * 레이아웃 계산 결과를 검증
 */
export function validateComputedLayout(layout: ComputedLayout): boolean {
  return (
    layout.elementId !== '' &&
    typeof layout.computedPosition.x === 'number' &&
    typeof layout.computedPosition.y === 'number' &&
    !isNaN(layout.computedPosition.x) &&
    !isNaN(layout.computedPosition.y) &&
    layout.computedSize.width > 0 &&
    layout.computedSize.height > 0
  );
}

/**
 * 레이아웃 컨테이너의 자식 요소들을 가져옴
 */
export function getLayoutChildren(
  container: GroupElement | import('../types').ComponentInstance,
  allElements: CanvasElement[]
): CanvasElement[] {
  if (!container.childElementIds || container.childElementIds.length === 0) {
    return [];
  }

  return container.childElementIds
    .map(childId => allElements.find(el => el.id === childId))
    .filter((el): el is CanvasElement => el !== undefined && el.visible);
}

/**
 * Flexbox gap 값을 가져옴 (rowGap, columnGap 또는 gap)
 */
export function getFlexGap(layout: LayoutConfig): { rowGap: number; columnGap: number } {
  if (!layout || layout.type !== 'flex') {
    return { rowGap: 0, columnGap: 0 };
  }

  const rowGap = layout.rowGap !== undefined ? layout.rowGap : layout.gap;
  const columnGap = layout.columnGap !== undefined ? layout.columnGap : layout.gap;

  return { rowGap, columnGap };
}

/**
 * Grid gap 값을 가져옴
 */
export function getGridGap(layout: LayoutConfig): { rowGap: number; columnGap: number } {
  if (!layout || layout.type !== 'grid') {
    return { rowGap: 0, columnGap: 0 };
  }

  const rowGap = layout.rowGap !== undefined ? layout.rowGap : layout.gap;
  const columnGap = layout.columnGap !== undefined ? layout.columnGap : layout.gap;

  return { rowGap, columnGap };
}

/**
 * 레이아웃 컨테이너의 내부 크기 계산
 * (패딩, 보더 등을 고려하지 않음 - 추후 확장 가능)
 */
export function getContainerInnerSize(container: GroupElement): Size {
  return {
    width: container.size.width,
    height: container.size.height
  };
}

/**
 * 레이아웃 변경 여부 확인 (디바운싱/캐싱용)
 */
export function hasLayoutChanged(
  prevLayout: LayoutConfig,
  newLayout: LayoutConfig
): boolean {
  if (prevLayout === newLayout) return false;
  if (!prevLayout && newLayout) return true;
  if (prevLayout && !newLayout) return true;
  if (!prevLayout || !newLayout) return false;

  // 타입이 다르면 변경됨
  if (prevLayout.type !== newLayout.type) return true;

  // JSON 문자열 비교 (간단한 방법)
  return JSON.stringify(prevLayout) !== JSON.stringify(newLayout);
}
