import type { LineElement, ArrowElement } from '../types';

interface LineRendererProps {
  line: LineElement | ArrowElement;
  isSelected: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
}

export default function LineRenderer({
  line,
  isSelected,
  onMouseDown,
  onClick,
}: LineRendererProps) {
  const { startPoint, endPoint, strokeColor, strokeWidth, visible } = line;

  if (!visible) return null;

  const isArrow = line.type === 'arrow';
  const arrowHeadSize = isArrow ? line.arrowHeadSize : 0;

  // 마커 ID (각 선마다 고유하게)
  const markerId = `arrowhead-${line.id}`;

  // 선택 상태에 따른 스타일
  const finalStrokeColor = isSelected ? '#3b82f6' : strokeColor;
  const finalStrokeWidth = isSelected ? strokeWidth + 1 : strokeWidth;

  return (
    <g>
      {/* 화살표 마커 정의 */}
      {isArrow && (
        <defs>
          <marker
            id={markerId}
            markerWidth={arrowHeadSize}
            markerHeight={arrowHeadSize}
            refX={arrowHeadSize * 0.5}
            refY={arrowHeadSize * 0.5}
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon
              points={`0,0 0,${arrowHeadSize} ${arrowHeadSize},${arrowHeadSize / 2}`}
              fill={finalStrokeColor}
            />
          </marker>
        </defs>
      )}

      {/* 투명한 히트 영역 (클릭 감지용) */}
      <line
        x1={startPoint.x}
        y1={startPoint.y}
        x2={endPoint.x}
        y2={endPoint.y}
        stroke="transparent"
        strokeWidth={Math.max(strokeWidth + 10, 15)} // 클릭하기 쉽도록 넓게
        cursor="pointer"
        onMouseDown={onMouseDown}
        onClick={onClick}
        style={{ pointerEvents: 'stroke' }}
      />

      {/* 실제 선 */}
      <line
        x1={startPoint.x}
        y1={startPoint.y}
        x2={endPoint.x}
        y2={endPoint.y}
        stroke={finalStrokeColor}
        strokeWidth={finalStrokeWidth}
        strokeLinecap="round"
        markerEnd={isArrow ? `url(#${markerId})` : undefined}
        opacity={line.opacity || 1}
        style={{ pointerEvents: 'none' }}
      />

      {/* 선택 상태 표시 (시작점과 끝점에 원) */}
      {isSelected && (
        <g>
          {/* 시작점 */}
          <circle
            cx={startPoint.x}
            cy={startPoint.y}
            r="6"
            fill="white"
            stroke="#3b82f6"
            strokeWidth="2"
            style={{ pointerEvents: 'none' }}
          />
          
          {/* 끝점 */}
          <circle
            cx={endPoint.x}
            cy={endPoint.y}
            r="6"
            fill="white"
            stroke="#3b82f6"
            strokeWidth="2"
            style={{ pointerEvents: 'none' }}
          />
        </g>
      )}
    </g>
  );
}