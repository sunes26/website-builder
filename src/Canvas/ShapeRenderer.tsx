import type { Shape } from '../types';

interface ShapeRendererProps {
  shape: Shape;
  isSelected: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
}

export default function ShapeRenderer({
  shape,
  isSelected,
  onMouseDown,
  onClick,
}: ShapeRendererProps) {
  const { position, size, rotation, style, shapeType, visible } = shape;

  if (!visible) return null;

  const commonProps = {
    fill: style.fill,
    stroke: isSelected ? '#3b82f6' : style.stroke,
    strokeWidth: isSelected ? style.strokeWidth + 1 : style.strokeWidth,
    opacity: style.opacity,
    cursor: 'move',
    onMouseDown,
    onClick,
  };

  const transform = `rotate(${rotation} ${position.x + size.width / 2} ${position.y + size.height / 2})`;

  // 사각형
  if (shapeType === 'rectangle') {
    return (
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
    );
  }

  // 원
  if (shapeType === 'circle') {
    const cx = position.x + size.width / 2;
    const cy = position.y + size.height / 2;
    const rx = size.width / 2;
    const ry = size.height / 2;

    return (
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        transform={transform}
        {...commonProps}
      />
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
      <polygon
        points={points}
        transform={transform}
        {...commonProps}
      />
    );
  }

  return null;
}