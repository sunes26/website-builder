import type { CanvasElement } from '../types';

/**
 * 스마트 가이드라인 타입
 */
export interface SmartGuide {
  type: 'vertical' | 'horizontal';
  position: number; // x 또는 y 좌표
  label?: string; // 가이드 레이블 (예: "중앙 정렬")
}

/**
 * 스냅 결과
 */
export interface SnapResult {
  deltaX: number;
  deltaY: number;
  guides: SmartGuide[];
}

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
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  const { position, size } = element;
  return {
    left: position.x,
    right: position.x + size.width,
    top: position.y,
    bottom: position.y + size.height,
    centerX: position.x + size.width / 2,
    centerY: position.y + size.height / 2,
    width: size.width,
    height: size.height,
  };
}

/**
 * 스마트 가이드라인 계산
 * @param draggedElements 드래그 중인 요소들
 * @param otherElements 다른 요소들 (가이드 기준)
 * @param threshold 스냅 거리 임계값 (px)
 * @returns 스냅 결과 (deltaX, deltaY, guides)
 */
export function calculateSmartGuides(
  draggedElements: CanvasElement[],
  otherElements: CanvasElement[],
  canvasWidth: number = 1920,
  canvasHeight: number = 1080,
  threshold: number = 8
): SnapResult {
  if (draggedElements.length === 0) {
    return { deltaX: 0, deltaY: 0, guides: [] };
  }

  // 드래그 중인 요소들의 전체 바운딩 박스 계산
  let draggedLeft = Infinity;
  let draggedRight = -Infinity;
  let draggedTop = Infinity;
  let draggedBottom = -Infinity;

  draggedElements.forEach((el) => {
    const bounds = getElementBounds(el);
    draggedLeft = Math.min(draggedLeft, bounds.left);
    draggedRight = Math.max(draggedRight, bounds.right);
    draggedTop = Math.min(draggedTop, bounds.top);
    draggedBottom = Math.max(draggedBottom, bounds.bottom);
  });

  const draggedCenterX = (draggedLeft + draggedRight) / 2;
  const draggedCenterY = (draggedTop + draggedBottom) / 2;

  // 캔버스 중앙
  const canvasCenterX = canvasWidth / 2;
  const canvasCenterY = canvasHeight / 2;

  const guides: SmartGuide[] = [];
  let snapDeltaX = 0;
  let snapDeltaY = 0;

  // 1. 캔버스 중앙 정렬 체크
  if (Math.abs(draggedCenterX - canvasCenterX) < threshold) {
    guides.push({
      type: 'vertical',
      position: canvasCenterX,
      label: '캔버스 중앙',
    });
    snapDeltaX = canvasCenterX - draggedCenterX;
  }

  if (Math.abs(draggedCenterY - canvasCenterY) < threshold) {
    guides.push({
      type: 'horizontal',
      position: canvasCenterY,
      label: '캔버스 중앙',
    });
    snapDeltaY = canvasCenterY - draggedCenterY;
  }

  // 2. 다른 요소들과의 정렬 체크
  otherElements.forEach((other) => {
    const bounds = getElementBounds(other);

    // 수직 정렬 체크 (좌측, 중앙, 우측)
    if (snapDeltaX === 0) {
      // 좌측 정렬
      if (Math.abs(draggedLeft - bounds.left) < threshold) {
        guides.push({ type: 'vertical', position: bounds.left });
        snapDeltaX = bounds.left - draggedLeft;
      }
      // 중앙 정렬
      else if (Math.abs(draggedCenterX - bounds.centerX) < threshold) {
        guides.push({ type: 'vertical', position: bounds.centerX });
        snapDeltaX = bounds.centerX - draggedCenterX;
      }
      // 우측 정렬
      else if (Math.abs(draggedRight - bounds.right) < threshold) {
        guides.push({ type: 'vertical', position: bounds.right });
        snapDeltaX = bounds.right - draggedRight;
      }
    }

    // 수평 정렬 체크 (상단, 중앙, 하단)
    if (snapDeltaY === 0) {
      // 상단 정렬
      if (Math.abs(draggedTop - bounds.top) < threshold) {
        guides.push({ type: 'horizontal', position: bounds.top });
        snapDeltaY = bounds.top - draggedTop;
      }
      // 중앙 정렬
      else if (Math.abs(draggedCenterY - bounds.centerY) < threshold) {
        guides.push({ type: 'horizontal', position: bounds.centerY });
        snapDeltaY = bounds.centerY - draggedCenterY;
      }
      // 하단 정렬
      else if (Math.abs(draggedBottom - bounds.bottom) < threshold) {
        guides.push({ type: 'horizontal', position: bounds.bottom });
        snapDeltaY = bounds.bottom - draggedBottom;
      }
    }
  });

  // 3. 같은 간격 감지 (3개 이상의 요소가 있을 때)
  if (otherElements.length >= 2) {
    // X축 간격 체크
    const xPositions = otherElements
      .map((el) => getElementBounds(el).centerX)
      .sort((a, b) => a - b);

    for (let i = 0; i < xPositions.length - 1; i++) {
      const gap1 = xPositions[i + 1] - xPositions[i];
      const expectedPos = xPositions[i + 1] + gap1;

      if (Math.abs(draggedCenterX - expectedPos) < threshold) {
        guides.push({
          type: 'vertical',
          position: expectedPos,
          label: `간격 ${Math.round(gap1)}px`,
        });
        if (snapDeltaX === 0) {
          snapDeltaX = expectedPos - draggedCenterX;
        }
      }
    }

    // Y축 간격 체크
    const yPositions = otherElements
      .map((el) => getElementBounds(el).centerY)
      .sort((a, b) => a - b);

    for (let i = 0; i < yPositions.length - 1; i++) {
      const gap1 = yPositions[i + 1] - yPositions[i];
      const expectedPos = yPositions[i + 1] + gap1;

      if (Math.abs(draggedCenterY - expectedPos) < threshold) {
        guides.push({
          type: 'horizontal',
          position: expectedPos,
          label: `간격 ${Math.round(gap1)}px`,
        });
        if (snapDeltaY === 0) {
          snapDeltaY = expectedPos - draggedCenterY;
        }
      }
    }
  }

  return {
    deltaX: snapDeltaX,
    deltaY: snapDeltaY,
    guides,
  };
}
