import type { CanvasElement } from '../types';

/**
 * 정렬 타입
 */
export type AlignType =
  | 'left'         // 좌측 정렬
  | 'right'        // 우측 정렬
  | 'top'          // 상단 정렬
  | 'bottom'       // 하단 정렬
  | 'center-h'     // 수평 중앙
  | 'center-v'     // 수직 중앙
  | 'distribute-h' // 수평 균등 분배
  | 'distribute-v'; // 수직 균등 분배

/**
 * 바운딩 박스
 */
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 요소의 바운딩 박스 계산
 */
export function getElementBounds(element: CanvasElement): BoundingBox {
  if (element.type === 'line' || element.type === 'arrow') {
    const minX = Math.min(element.startPoint.x, element.endPoint.x);
    const minY = Math.min(element.startPoint.y, element.endPoint.y);
    const maxX = Math.max(element.startPoint.x, element.endPoint.x);
    const maxY = Math.max(element.startPoint.y, element.endPoint.y);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  // Shape, Text, Image
  return {
    x: element.position.x,
    y: element.position.y,
    width: element.size.width,
    height: element.size.height,
  };
}

/**
 * 여러 요소의 전체 바운딩 박스
 */
export function getGroupBounds(elements: CanvasElement[]): BoundingBox {
  if (elements.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  const bounds = elements.map(getElementBounds);

  const minX = Math.min(...bounds.map(b => b.x));
  const minY = Math.min(...bounds.map(b => b.y));
  const maxX = Math.max(...bounds.map(b => b.x + b.width));
  const maxY = Math.max(...bounds.map(b => b.y + b.height));

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * 정렬 적용
 */
export function alignElements(
  elements: CanvasElement[],
  alignType: AlignType
): CanvasElement[] {
  if (elements.length < 2) return elements;

  const groupBounds = getGroupBounds(elements);

  return elements.map(element => {
    const bounds = getElementBounds(element);
    let newX = bounds.x;
    let newY = bounds.y;

    switch (alignType) {
      case 'left':
        newX = groupBounds.x;
        break;
      case 'right':
        newX = groupBounds.x + groupBounds.width - bounds.width;
        break;
      case 'top':
        newY = groupBounds.y;
        break;
      case 'bottom':
        newY = groupBounds.y + groupBounds.height - bounds.height;
        break;
      case 'center-h':
        newX = groupBounds.x + (groupBounds.width - bounds.width) / 2;
        break;
      case 'center-v':
        newY = groupBounds.y + (groupBounds.height - bounds.height) / 2;
        break;
    }

    // Line/Arrow는 startPoint/endPoint 조정
    if (element.type === 'line' || element.type === 'arrow') {
      const dx = newX - bounds.x;
      const dy = newY - bounds.y;

      return {
        ...element,
        startPoint: {
          x: element.startPoint.x + dx,
          y: element.startPoint.y + dy,
        },
        endPoint: {
          x: element.endPoint.x + dx,
          y: element.endPoint.y + dy,
        },
      };
    }

    // Shape, Text, Image
    return {
      ...element,
      position: { x: newX, y: newY },
    };
  });
}

/**
 * 균등 분배
 */
export function distributeElements(
  elements: CanvasElement[],
  direction: 'horizontal' | 'vertical'
): CanvasElement[] {
  if (elements.length < 3) return elements;

  // 정렬 기준으로 정렬
  const sorted = [...elements].sort((a, b) => {
    const boundsA = getElementBounds(a);
    const boundsB = getElementBounds(b);
    return direction === 'horizontal'
      ? boundsA.x - boundsB.x
      : boundsA.y - boundsB.y;
  });

  const firstBounds = getElementBounds(sorted[0]);
  const lastBounds = getElementBounds(sorted[sorted.length - 1]);

  // 전체 간격 계산
  const totalSpace = direction === 'horizontal'
    ? (lastBounds.x - (firstBounds.x + firstBounds.width))
    : (lastBounds.y - (firstBounds.y + firstBounds.height));

  // 중간 요소들의 총 크기
  const middleElementsSize = sorted.slice(1, -1).reduce((sum, el) => {
    const bounds = getElementBounds(el);
    return sum + (direction === 'horizontal' ? bounds.width : bounds.height);
  }, 0);

  // 간격 계산
  const gap = (totalSpace - middleElementsSize) / (sorted.length - 1);

  // 위치 재조정
  let currentPos = direction === 'horizontal'
    ? firstBounds.x + firstBounds.width + gap
    : firstBounds.y + firstBounds.height + gap;

  return sorted.map((element, index) => {
    if (index === 0 || index === sorted.length - 1) {
      return element; // 첫/마지막은 그대로
    }

    const bounds = getElementBounds(element);
    const newX = direction === 'horizontal' ? currentPos : bounds.x;
    const newY = direction === 'vertical' ? currentPos : bounds.y;

    currentPos += (direction === 'horizontal' ? bounds.width : bounds.height) + gap;

    // Line/Arrow 처리
    if (element.type === 'line' || element.type === 'arrow') {
      const dx = newX - bounds.x;
      const dy = newY - bounds.y;

      return {
        ...element,
        startPoint: {
          x: element.startPoint.x + dx,
          y: element.startPoint.y + dy,
        },
        endPoint: {
          x: element.endPoint.x + dx,
          y: element.endPoint.y + dy,
        },
      };
    }

    return {
      ...element,
      position: { x: newX, y: newY },
    };
  });
}
