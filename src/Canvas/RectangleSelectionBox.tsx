import type { BoxSelection } from '../types';
import { getNormalizedBox } from '../utils/selectionUtils';

interface RectangleSelectionBoxProps {
  selectionBox: BoxSelection;
}

/**
 * 박스 선택 사각형 렌더러 (Priority 2.2)
 * 마우스 드래그로 여러 요소를 한 번에 선택
 */
export default function RectangleSelectionBox({
  selectionBox,
}: RectangleSelectionBoxProps) {
  const { x, y, width, height } = getNormalizedBox(selectionBox);

  return (
    <g className="rectangle-selection" pointerEvents="none">
      {/* 선택 박스 배경 */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#007bff"
        fillOpacity="0.1"
        stroke="#007bff"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
    </g>
  );
}
