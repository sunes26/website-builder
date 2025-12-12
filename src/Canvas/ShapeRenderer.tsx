import type { Shape } from '../types';
import { parseBoxShadow, generateFilterId } from '../utils/shadowUtils';

interface ShapeRendererProps {
  shape: Shape;
  isSelected: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
}

// Priority 4.2: 다각형 포인트 생성 헬퍼 함수
function generatePolygonPoints(cx: number, cy: number, radius: number, sides: number, startAngle: number = -Math.PI / 2): string {
  const points: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = startAngle + (i * 2 * Math.PI) / sides;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return points.join(' ');
}

// Priority 4.2: 별 포인트 생성 함수
function generateStarPoints(cx: number, cy: number, outerRadius: number, innerRadius: number, points: number = 5): string {
  const result: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    result.push(`${x},${y}`);
  }
  return result.join(' ');
}

export default function ShapeRenderer({
  shape,
  isSelected,
  onMouseDown,
  onClick,
}: ShapeRendererProps) {
  const { position, size, rotation, style, shapeType, visible } = shape;

  if (!visible) return null;

  // boxShadow를 SVG filter로 변환 (다중 shadow 지원)
  const shadowParams = parseBoxShadow(style.boxShadow);
  const filterId = shadowParams.length > 0 ? generateFilterId(shape.id) : undefined;

  const commonProps = {
    fill: style.fill,
    stroke: isSelected ? '#3b82f6' : style.stroke,
    strokeWidth: isSelected ? style.strokeWidth + 1 : style.strokeWidth,
    opacity: style.opacity,
    cursor: 'move',
    onMouseDown,
    onClick,
    filter: filterId ? `url(#${filterId})` : undefined,
  };

  const transform = `rotate(${rotation} ${position.x + size.width / 2} ${position.y + size.height / 2})`;

  // 사각형
  if (shapeType === 'rectangle') {
    return (
      <>
        {/* SVG filter 정의 - 다중 shadow 지원 */}
        {shadowParams.length > 0 && (
          <defs>
            <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
              {shadowParams.map((shadow, index) => (
                <feDropShadow
                  key={index}
                  dx={shadow.dx}
                  dy={shadow.dy}
                  stdDeviation={shadow.stdDeviation}
                  floodColor={shadow.floodColor}
                  floodOpacity={shadow.floodOpacity}
                />
              ))}
            </filter>
          </defs>
        )}
        <rect
          x={position.x}
          y={position.y}
          width={size.width}
          height={size.height}
          rx={style.borderRadius}
          ry={style.borderRadius}
          transform={transform}
          {...commonProps}
        />
      </>
    );
  }

  // 원
  if (shapeType === 'circle') {
    const cx = position.x + size.width / 2;
    const cy = position.y + size.height / 2;
    const rx = size.width / 2;
    const ry = size.height / 2;

    return (
      <>
        {shadowParams.length > 0 && (
          <defs>
            <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
              {shadowParams.map((shadow, index) => (
                <feDropShadow
                  key={index}
                  dx={shadow.dx}
                  dy={shadow.dy}
                  stdDeviation={shadow.stdDeviation}
                  floodColor={shadow.floodColor}
                  floodOpacity={shadow.floodOpacity}
                />
              ))}
            </filter>
          </defs>
        )}
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          transform={transform}
          {...commonProps}
        />
      </>
    );
  }

  // 삼각형
  if (shapeType === 'triangle') {
    const points = [
      `${position.x + size.width / 2},${position.y}`, // 상단 꼭지점
      `${position.x + size.width},${position.y + size.height}`, // 우하단
      `${position.x},${position.y + size.height}`, // 좌하단
    ].join(' ');

    return (
      <>
        {shadowParams.length > 0 && (
          <defs>
            <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
              {shadowParams.map((shadow, index) => (
                <feDropShadow
                  key={index}
                  dx={shadow.dx}
                  dy={shadow.dy}
                  stdDeviation={shadow.stdDeviation}
                  floodColor={shadow.floodColor}
                  floodOpacity={shadow.floodOpacity}
                />
              ))}
            </filter>
          </defs>
        )}
        <polygon
          points={points}
          transform={transform}
          {...commonProps}
        />
      </>
    );
  }

  // Priority 4.2: 별 (Star)
  if (shapeType === 'star') {
    const cx = position.x + size.width / 2;
    const cy = position.y + size.height / 2;
    const outerRadius = Math.min(size.width, size.height) / 2;
    const innerRadius = outerRadius * 0.4;
    const points = generateStarPoints(cx, cy, outerRadius, innerRadius, 5);

    return (
      <>
        {shadowParams.length > 0 && (
          <defs>
            <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
              {shadowParams.map((shadow, index) => (
                <feDropShadow
                  key={index}
                  dx={shadow.dx}
                  dy={shadow.dy}
                  stdDeviation={shadow.stdDeviation}
                  floodColor={shadow.floodColor}
                  floodOpacity={shadow.floodOpacity}
                />
              ))}
            </filter>
          </defs>
        )}
        <polygon
          points={points}
          transform={transform}
          {...commonProps}
        />
      </>
    );
  }

  // Priority 4.2: 오각형 (Pentagon)
  if (shapeType === 'pentagon') {
    const cx = position.x + size.width / 2;
    const cy = position.y + size.height / 2;
    const radius = Math.min(size.width, size.height) / 2;
    const points = generatePolygonPoints(cx, cy, radius, 5);

    return (
      <>
        {shadowParams.length > 0 && (
          <defs>
            <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
              {shadowParams.map((shadow, index) => (
                <feDropShadow
                  key={index}
                  dx={shadow.dx}
                  dy={shadow.dy}
                  stdDeviation={shadow.stdDeviation}
                  floodColor={shadow.floodColor}
                  floodOpacity={shadow.floodOpacity}
                />
              ))}
            </filter>
          </defs>
        )}
        <polygon
          points={points}
          transform={transform}
          {...commonProps}
        />
      </>
    );
  }

  // Priority 4.2: 육각형 (Hexagon)
  if (shapeType === 'hexagon') {
    const cx = position.x + size.width / 2;
    const cy = position.y + size.height / 2;
    const radius = Math.min(size.width, size.height) / 2;
    const points = generatePolygonPoints(cx, cy, radius, 6);

    return (
      <>
        {shadowParams.length > 0 && (
          <defs>
            <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
              {shadowParams.map((shadow, index) => (
                <feDropShadow
                  key={index}
                  dx={shadow.dx}
                  dy={shadow.dy}
                  stdDeviation={shadow.stdDeviation}
                  floodColor={shadow.floodColor}
                  floodOpacity={shadow.floodOpacity}
                />
              ))}
            </filter>
          </defs>
        )}
        <polygon
          points={points}
          transform={transform}
          {...commonProps}
        />
      </>
    );
  }

  // Priority 4.2: 팔각형 (Octagon)
  if (shapeType === 'octagon') {
    const cx = position.x + size.width / 2;
    const cy = position.y + size.height / 2;
    const radius = Math.min(size.width, size.height) / 2;
    const points = generatePolygonPoints(cx, cy, radius, 8);

    return (
      <>
        {shadowParams.length > 0 && (
          <defs>
            <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
              {shadowParams.map((shadow, index) => (
                <feDropShadow
                  key={index}
                  dx={shadow.dx}
                  dy={shadow.dy}
                  stdDeviation={shadow.stdDeviation}
                  floodColor={shadow.floodColor}
                  floodOpacity={shadow.floodOpacity}
                />
              ))}
            </filter>
          </defs>
        )}
        <polygon
          points={points}
          transform={transform}
          {...commonProps}
        />
      </>
    );
  }

  // Priority 4.2: 다이아몬드 (Diamond)
  if (shapeType === 'diamond') {
    const points = [
      `${position.x + size.width / 2},${position.y}`, // 상단
      `${position.x + size.width},${position.y + size.height / 2}`, // 우측
      `${position.x + size.width / 2},${position.y + size.height}`, // 하단
      `${position.x},${position.y + size.height / 2}`, // 좌측
    ].join(' ');

    return (
      <>
        {shadowParams.length > 0 && (
          <defs>
            <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
              {shadowParams.map((shadow, index) => (
                <feDropShadow
                  key={index}
                  dx={shadow.dx}
                  dy={shadow.dy}
                  stdDeviation={shadow.stdDeviation}
                  floodColor={shadow.floodColor}
                  floodOpacity={shadow.floodOpacity}
                />
              ))}
            </filter>
          </defs>
        )}
        <polygon
          points={points}
          transform={transform}
          {...commonProps}
        />
      </>
    );
  }

  return null;
}