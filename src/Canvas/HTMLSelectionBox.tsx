import { useRef, useEffect } from 'react';
import type { BoxSelection } from '../types';

interface HTMLSelectionBoxProps {
  selectionBox: BoxSelection;
  svgElement: SVGSVGElement | null;
}

/**
 * HTML 기반 박스 선택 렌더러 (Priority 2.2 개선)
 * SVG 밖에서도 선택 박스 표시 가능
 */
export default function HTMLSelectionBox({
  selectionBox,
  svgElement,
}: HTMLSelectionBoxProps) {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!boxRef.current || !svgElement) return;

    // SVG 좌표를 화면 좌표로 변환
    const ctm = svgElement.getScreenCTM();
    if (!ctm) return;

    // 시작점과 끝점을 화면 좌표로 변환
    const startPoint = svgElement.createSVGPoint();
    startPoint.x = selectionBox.startX;
    startPoint.y = selectionBox.startY;
    const transformedStart = startPoint.matrixTransform(ctm);

    const endPoint = svgElement.createSVGPoint();
    endPoint.x = selectionBox.endX;
    endPoint.y = selectionBox.endY;
    const transformedEnd = endPoint.matrixTransform(ctm);

    // 정규화된 좌표 계산
    const left = Math.min(transformedStart.x, transformedEnd.x);
    const top = Math.min(transformedStart.y, transformedEnd.y);
    const width = Math.abs(transformedEnd.x - transformedStart.x);
    const height = Math.abs(transformedEnd.y - transformedStart.y);

    // 박스 스타일 업데이트
    boxRef.current.style.left = `${left}px`;
    boxRef.current.style.top = `${top}px`;
    boxRef.current.style.width = `${width}px`;
    boxRef.current.style.height = `${height}px`;
  }, [selectionBox, svgElement]);

  return (
    <div
      ref={boxRef}
      className="rectangle-selection"
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        border: '2px dashed #007bff',
        zIndex: 9999,
      }}
    />
  );
}
