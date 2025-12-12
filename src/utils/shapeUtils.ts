import { nanoid } from 'nanoid';
import type { Shape, ShapeType } from '../types';

/**
 * 새 도형 생성
 */
export function createShape(
  shapeType: ShapeType,
  position: { x: number; y: number },
  size: { width: number; height: number }
): Shape {
  return {
    id: nanoid(),
    type: 'shape',
    shapeType,
    position,
    size,
    rotation: 0,
    zIndex: Date.now(), // 생성 시간을 zIndex로 사용 (최신 요소가 위에)
    locked: false,
    visible: true,
    style: {
      fill: '#3b82f6', // blue-600
      stroke: '#1e40af', // blue-800
      strokeWidth: 2,
      borderRadius: 0,
      opacity: 1,
    },
  };
}

/**
 * 점이 도형 내부에 있는지 확인
 */
export function isPointInShape(
  point: { x: number; y: number },
  shape: Shape
): boolean {
  const { position, size, shapeType, rotation: _rotation } = shape;

  // 회전을 고려한 충돌 감지는 복잡하므로, 간단히 바운딩 박스만 체크
  // 나중에 회전 변환을 추가할 수 있음
  
  if (shapeType === 'rectangle') {
    return (
      point.x >= position.x &&
      point.x <= position.x + size.width &&
      point.y >= position.y &&
      point.y <= position.y + size.height
    );
  }

  if (shapeType === 'circle') {
    const centerX = position.x + size.width / 2;
    const centerY = position.y + size.height / 2;
    const radiusX = size.width / 2;
    const radiusY = size.height / 2;
    
    // 타원 방정식 사용
    const dx = point.x - centerX;
    const dy = point.y - centerY;
    return (dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY) <= 1;
  }

  if (shapeType === 'triangle') {
    // 삼각형은 바운딩 박스로 근사
    // 정확한 충돌 감지는 복잡하므로 간단히 처리
    return (
      point.x >= position.x &&
      point.x <= position.x + size.width &&
      point.y >= position.y &&
      point.y <= position.y + size.height
    );
  }

  return false;
}

/**
 * 도형의 바운딩 박스 계산
 */
export function getShapeBounds(shape: Shape): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  return {
    x: shape.position.x,
    y: shape.position.y,
    width: shape.size.width,
    height: shape.size.height,
  };
}

/**
 * 두 점 사이의 거리 계산
 */
export function getDistance(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 정사각형/정원 크기 계산 (Shift 키 눌렀을 때)
 */
export function getSquareSize(
  startX: number,
  startY: number,
  currentX: number,
  currentY: number
): { width: number; height: number } {
  const deltaX = currentX - startX;
  const deltaY = currentY - startY;
  const size = Math.min(Math.abs(deltaX), Math.abs(deltaY));
  
  return {
    width: size,
    height: size,
  };
}

/**
 * 중심에서 그리기 (Alt 키 눌렀을 때)
 */
export function getCenterPosition(
  centerX: number,
  centerY: number,
  width: number,
  height: number
): { x: number; y: number } {
  return {
    x: centerX - width / 2,
    y: centerY - height / 2,
  };
}

/**
 * 마우스 위치를 SVG 좌표로 변환
 */
export function getSVGPoint(
  svgElement: SVGSVGElement,
  clientX: number,
  clientY: number
): { x: number; y: number } {
  const point = svgElement.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  
  const ctm = svgElement.getScreenCTM();
  if (ctm) {
    const transformedPoint = point.matrixTransform(ctm.inverse());
    return { x: transformedPoint.x, y: transformedPoint.y };
  }
  
  // fallback: getBoundingClientRect 사용
  const rect = svgElement.getBoundingClientRect();
  const scaleX = svgElement.viewBox.baseVal.width / rect.width;
  const scaleY = svgElement.viewBox.baseVal.height / rect.height;
  
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}

/**
 * 도형 크기 정규화 (음수 크기 처리)
 */
export function normalizeSize(
  startX: number,
  startY: number,
  currentX: number,
  currentY: number
): {
  position: { x: number; y: number };
  size: { width: number; height: number };
} {
  const width = currentX - startX;
  const height = currentY - startY;
  
  return {
    position: {
      x: width < 0 ? currentX : startX,
      y: height < 0 ? currentY : startY,
    },
    size: {
      width: Math.abs(width),
      height: Math.abs(height),
    },
  };
}