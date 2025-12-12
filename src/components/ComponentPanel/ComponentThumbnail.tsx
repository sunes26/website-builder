import type { Component } from '../../types';
import { getGroupBounds } from '../../utils/alignUtils';

interface ComponentThumbnailProps {
  component: Component;
  size?: number;
}

/**
 * ComponentThumbnail (Priority 2.4)
 * 컴포넌트의 SVG 썸네일 미리보기
 */
export default function ComponentThumbnail({
  component,
  size = 120,
}: ComponentThumbnailProps) {
  if (component.elements.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-gray-50 rounded border border-gray-100"
        style={{ width: size, height: size }}
      >
        <div className="text-gray-400 text-xs">비어있음</div>
      </div>
    );
  }

  // 컴포넌트 바운딩 박스 계산
  const bounds = getGroupBounds(component.elements);

  // 뷰박스 계산 (약간의 패딩 추가)
  const padding = 10;
  const viewBoxX = bounds.x - padding;
  const viewBoxY = bounds.y - padding;
  const viewBoxWidth = bounds.width + padding * 2;
  const viewBoxHeight = bounds.height + padding * 2;

  return (
    <div
      className="flex items-center justify-center bg-gray-50 rounded border border-gray-100 overflow-hidden"
      style={{ width: size, height: size }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {component.elements.map((element) => {
          // 간단한 렌더링 (상세한 렌더링은 생략)
          if (element.type === 'shape') {
            if (element.shapeType === 'rectangle') {
              return (
                <rect
                  key={element.id}
                  x={element.position.x}
                  y={element.position.y}
                  width={element.size.width}
                  height={element.size.height}
                  fill={element.style.fill}
                  stroke={element.style.stroke}
                  strokeWidth={element.style.strokeWidth}
                  rx={element.style.borderRadius}
                  ry={element.style.borderRadius}
                  opacity={element.style.opacity}
                />
              );
            } else if (element.shapeType === 'circle') {
              const cx = element.position.x + element.size.width / 2;
              const cy = element.position.y + element.size.height / 2;
              const rx = element.size.width / 2;
              const ry = element.size.height / 2;
              return (
                <ellipse
                  key={element.id}
                  cx={cx}
                  cy={cy}
                  rx={rx}
                  ry={ry}
                  fill={element.style.fill}
                  stroke={element.style.stroke}
                  strokeWidth={element.style.strokeWidth}
                  opacity={element.style.opacity}
                />
              );
            } else if (element.shapeType === 'triangle') {
              const x1 = element.position.x + element.size.width / 2;
              const y1 = element.position.y;
              const x2 = element.position.x;
              const y2 = element.position.y + element.size.height;
              const x3 = element.position.x + element.size.width;
              const y3 = element.position.y + element.size.height;
              return (
                <polygon
                  key={element.id}
                  points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
                  fill={element.style.fill}
                  stroke={element.style.stroke}
                  strokeWidth={element.style.strokeWidth}
                  opacity={element.style.opacity}
                />
              );
            }
          } else if (element.type === 'text') {
            return (
              <text
                key={element.id}
                x={element.position.x}
                y={element.position.y + 14}
                fontSize={element.fontSize}
                fontFamily={element.fontFamily}
                fill={element.color}
              >
                {element.content.substring(0, 20)}
              </text>
            );
          } else if (element.type === 'line' || element.type === 'arrow') {
            return (
              <line
                key={element.id}
                x1={element.startPoint.x}
                y1={element.startPoint.y}
                x2={element.endPoint.x}
                y2={element.endPoint.y}
                stroke={element.strokeColor}
                strokeWidth={element.strokeWidth}
                opacity={element.opacity}
              />
            );
          }

          return null;
        })}
      </svg>
    </div>
  );
}
