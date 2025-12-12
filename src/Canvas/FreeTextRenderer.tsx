import type { TextElement } from '../types';

interface FreeTextRendererProps {
  text: TextElement;
  isSelected: boolean;
  isEditing: boolean;
  onDoubleClick: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
}

export default function FreeTextRenderer({
  text,
  isSelected,
  isEditing,
  onDoubleClick,
  onMouseDown,
  onClick,
}: FreeTextRendererProps) {
  const {
    position,
    size,
    content,
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle,
    textDecoration,
    color,
    textAlign,
    letterSpacing,
    lineHeight,
    textTransform,
    textShadow,
    rotation,
  } = text;

  return (
    <g transform={`rotate(${rotation}, ${position.x + size.width / 2}, ${position.y + size.height / 2})`}>
      {/* 선택 상태 표시 (배경) */}
      {isSelected && !isEditing && (
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

      {/* 텍스트 렌더링 (foreignObject 사용) */}
      <foreignObject
        x={position.x}
        y={position.y}
        width={size.width}
        height={size.height}
        onDoubleClick={onDoubleClick}
        onMouseDown={onMouseDown}
        onClick={onClick}
        style={{ 
          cursor: isEditing ? 'text' : 'pointer',
          overflow: 'visible'
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            fontSize: `${fontSize}px`,
            fontFamily: fontFamily,
            fontWeight: fontWeight,
            fontStyle: fontStyle || 'normal',
            textDecoration: textDecoration || 'none',
            color: color,
            textAlign: textAlign,
            letterSpacing: letterSpacing ? `${letterSpacing}px` : 'normal',
            lineHeight: lineHeight || 1.4,
            textTransform: textTransform || 'none',
            textShadow: textShadow && textShadow !== 'none' ? textShadow : 'none',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            padding: '4px',
            boxSizing: 'border-box',
            userSelect: isEditing ? 'text' : 'none',
            pointerEvents: isEditing ? 'auto' : 'all',
          }}
        >
          {content || '텍스트를 입력하세요'}
        </div>
      </foreignObject>

      {/* 편집 중일 때 테두리 표시 */}
      {isEditing && (
        <rect
          x={position.x - 2}
          y={position.y - 2}
          width={size.width + 4}
          height={size.height + 4}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          pointerEvents="none"
        />
      )}
    </g>
  );
}