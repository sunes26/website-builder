import { nanoid } from 'nanoid';
import type { LineElement, ArrowElement, Position } from '../types';

/**
 * 새 직선 생성
 */
export function createLine(
  startPoint: Position,
  endPoint: Position
): LineElement {
  return {
    id: nanoid(),
    type: 'line',
    startPoint,
    endPoint,
    position: { x: 0, y: 0 }, // 선은 position을 사용하지 않지만 BaseElement 요구사항
    size: { width: 0, height: 0 }, // 선은 size를 사용하지 않지만 BaseElement 요구사항
    rotation: 0,
    zIndex: Date.now(),
    locked: false,
    visible: true,
    strokeColor: '#1e40af', // blue-800
    strokeWidth: 2,
    opacity: 1,
  };
}

/**
 * 새 화살표 생성
 */
export function createArrow(
  startPoint: Position,
  endPoint: Position
): ArrowElement {
  return {
    id: nanoid(),
    type: 'arrow',
    startPoint,
    endPoint,
    position: { x: 0, y: 0 },
    size: { width: 0, height: 0 },
    rotation: 0,
    zIndex: Date.now(),
    locked: false,
    visible: true,
    strokeColor: '#1e40af', // blue-800
    strokeWidth: 2,
    arrowHeadSize: 10,
    opacity: 1,
  };
}

/**
 * 두 점 사이의 거리 계산
 */
export function getLineLength(
  startPoint: Position,
  endPoint: Position
): number {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 두 점 사이의 각도 계산 (라디안)
 */
export function getLineAngle(
  startPoint: Position,
  endPoint: Position
): number {
  return Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
}

/**
 * 각도를 도(degree)로 변환
 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * 도(degree)를 라디안으로 변환
 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * 45도 단위로 스냅 (Shift 키)
 * 0, 45, 90, 135, 180, 225, 270, 315도
 */
export function snapToAngle(
  startPoint: Position,
  currentPoint: Position
): Position {
  const dx = currentPoint.x - startPoint.x;
  const dy = currentPoint.y - startPoint.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // 각도 계산 (라디안)
  const angle = Math.atan2(dy, dx);
  
  // 45도 단위로 스냅 (8방향)
  const snapAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
  
  // 새로운 끝점 계산
  return {
    x: startPoint.x + distance * Math.cos(snapAngle),
    y: startPoint.y + distance * Math.sin(snapAngle),
  };
}

/**
 * 점이 선 근처에 있는지 확인 (충돌 감지)
 */
export function isPointNearLine(
  point: Position,
  startPoint: Position,
  endPoint: Position,
  threshold: number = 5
): boolean {
  // 점에서 선까지의 최단 거리 계산
  const lineLength = getLineLength(startPoint, endPoint);
  
  if (lineLength === 0) {
    // 선의 길이가 0이면 시작점과의 거리만 확인
    return getLineLength(point, startPoint) <= threshold;
  }
  
  // 선의 방향 벡터
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  
  // 점에서 선의 시작점까지의 벡터를 선의 방향 벡터에 투영
  const t = Math.max(
    0,
    Math.min(
      1,
      ((point.x - startPoint.x) * dx + (point.y - startPoint.y) * dy) /
        (lineLength * lineLength)
    )
  );
  
  // 선 위의 가장 가까운 점
  const closestPoint = {
    x: startPoint.x + t * dx,
    y: startPoint.y + t * dy,
  };
  
  // 점에서 가장 가까운 점까지의 거리
  const distance = getLineLength(point, closestPoint);
  
  return distance <= threshold;
}

/**
 * 선의 바운딩 박스 계산
 */
export function getLineBounds(line: LineElement | ArrowElement): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  const { startPoint, endPoint } = line;
  
  const minX = Math.min(startPoint.x, endPoint.x);
  const minY = Math.min(startPoint.y, endPoint.y);
  const maxX = Math.max(startPoint.x, endPoint.x);
  const maxY = Math.max(startPoint.y, endPoint.y);
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * 선의 중점 계산
 */
export function getLineMidpoint(
  startPoint: Position,
  endPoint: Position
): Position {
  return {
    x: (startPoint.x + endPoint.x) / 2,
    y: (startPoint.y + endPoint.y) / 2,
  };
}