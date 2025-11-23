import type { ImageElement } from '../types';

interface FreeImageRendererProps {
  image: ImageElement;
  isSelected: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
}

export default function FreeImageRenderer({
  image,
  isSelected,
  onMouseDown,
  onClick,
}: FreeImageRendererProps) {
  const {
    position,
    size,
    src,
    alt,
    rotation,
    visible,
  } = image;

  if (!visible) return null;

  return (
    <g transform={`rotate(${rotation}, ${position.x + size.width / 2}, ${position.y + size.height / 2})`}>
      {/* 선택 상태 표시 (배경) */}
      {isSelected && (
        <rect
          x={position.x - 4}
          y={position.y - 4}
          width={size.width + 8}
          height={size.height + 8}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="4 4"
          pointerEvents="none"
        />
      )}

      {/* 이미지 렌더링 (foreignObject 사용) */}
      <foreignObject
        x={position.x}
        y={position.y}
        width={size.width}
        height={size.height}
        onMouseDown={onMouseDown}
        onClick={onClick}
        style={{ 
          cursor: 'move',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6',
            pointerEvents: 'none',
          }}
        >
          {src ? (
            <img
              src={src}
              alt={alt || '이미지'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
              draggable={false}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9ca3af',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              이미지 없음
            </div>
          )}
        </div>
      </foreignObject>

      {/* 선택 시 테두리 표시 */}
      {isSelected && (
        <rect
          x={position.x}
          y={position.y}
          width={size.width}
          height={size.height}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          pointerEvents="none"
        />
      )}
    </g>
  );
}