import type { SmartGuide } from '../types';

interface SmartGuidesRendererProps {
  guides: SmartGuide[];
  canvasWidth: number;
  canvasHeight: number;
}

/**
 * 스마트 가이드라인 렌더러 (Priority 2.1)
 * Figma 스타일의 빨간 가이드라인 표시
 */
export default function SmartGuidesRenderer({
  guides,
  canvasWidth,
  canvasHeight,
}: SmartGuidesRendererProps) {
  if (guides.length === 0) return null;

  return (
    <g className="smart-guides" pointerEvents="none">
      {guides.map((guide, index) => {
        if (guide.type === 'vertical') {
          return (
            <g key={`guide-${index}`}>
              {/* 수직 가이드라인 */}
              <line
                x1={guide.position}
                y1={0}
                x2={guide.position}
                y2={canvasHeight}
                stroke="#ff0066"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.8"
              />
              {/* 레이블 (있을 경우) */}
              {guide.label && (
                <text
                  x={guide.position + 5}
                  y={20}
                  fill="#ff0066"
                  fontSize="12"
                  fontFamily="Inter, sans-serif"
                  fontWeight="500"
                >
                  {guide.label}
                </text>
              )}
            </g>
          );
        } else {
          return (
            <g key={`guide-${index}`}>
              {/* 수평 가이드라인 */}
              <line
                x1={0}
                y1={guide.position}
                x2={canvasWidth}
                y2={guide.position}
                stroke="#ff0066"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.8"
              />
              {/* 레이블 (있을 경우) */}
              {guide.label && (
                <text
                  x={20}
                  y={guide.position - 5}
                  fill="#ff0066"
                  fontSize="12"
                  fontFamily="Inter, sans-serif"
                  fontWeight="500"
                >
                  {guide.label}
                </text>
              )}
            </g>
          );
        }
      })}
    </g>
  );
}
