import type { CanvasElement, BoxSelection } from '../types';

/**
 * 요소의 바운딩 박스 가져오기
 */
function getElementBounds(element: CanvasElement) {
  if (element.type === 'line' || element.type === 'arrow') {
    const minX = Math.min(element.startPoint.x, element.endPoint.x);
    const maxX = Math.max(element.startPoint.x, element.endPoint.x);
    const minY = Math.min(element.startPoint.y, element.endPoint.y);
    const maxY = Math.max(element.startPoint.y, element.endPoint.y);

    return {
      left: minX,
      right: maxX,
      top: minY,
      bottom: maxY,
    };
  }

  const { position, size } = element;
  return {
    left: position.x,
    right: position.x + size.width,
    top: position.y,
    bottom: position.y + size.height,
  };
}

/**
 * 두 사각형이 겹치는지 확인
 */
function rectanglesIntersect(
  rect1: { left: number; right: number; top: number; bottom: number },
  rect2: { left: number; right: number; top: number; bottom: number }
): boolean {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

/**
 * 박스 선택 영역과 겹치는 요소들 찾기
 * @param elements 모든 요소
 * @param selectionBox 선택 박스
 * @returns 선택 박스와 겹치는 요소 ID 배열
 */
export function getElementsInSelectionBox(
  elements: CanvasElement[],
  selectionBox: BoxSelection
): string[] {
  const boxBounds = {
    left: Math.min(selectionBox.startX, selectionBox.endX),
    right: Math.max(selectionBox.startX, selectionBox.endX),
    top: Math.min(selectionBox.startY, selectionBox.endY),
    bottom: Math.max(selectionBox.startY, selectionBox.endY),
  };

  return elements
    .filter((element) => {
      // 숨김/잠금 요소는 제외
      if (!element.visible || element.locked) {
        return false;
      }

      const elementBounds = getElementBounds(element);
      return rectanglesIntersect(boxBounds, elementBounds);
    })
    .map((element) => element.id);
}

/**
 * 선택 박스의 정규화된 좌표 가져오기
 */
export function getNormalizedBox(box: BoxSelection) {
  return {
    x: Math.min(box.startX, box.endX),
    y: Math.min(box.startY, box.endY),
    width: Math.abs(box.endX - box.startX),
    height: Math.abs(box.endY - box.startY),
  };
}
