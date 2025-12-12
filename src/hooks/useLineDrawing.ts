import { useState, useCallback, useRef, useEffect } from 'react';
import { useBuilderStore } from '../store/builderStore';
import { createLine, createArrow, snapToAngle } from '../utils/lineUtils';
import { getSVGPoint } from '../utils/shapeUtils';
import type { LineElement, ArrowElement } from '../types';

type LineType = 'line' | 'arrow';

interface UseLineDrawingReturn {
  isDrawing: boolean;
  previewLine: LineElement | ArrowElement | null;
  handleMouseDown: (e: React.MouseEvent<SVGSVGElement>) => void;
  handleMouseMove: (e: React.MouseEvent<SVGSVGElement>) => void;
  handleMouseUp: (e: React.MouseEvent<SVGSVGElement>) => void;
  cancelDrawing: () => void;
}

export function useLineDrawing(
  currentTool: LineType | null,
  _svgRef: React.RefObject<SVGSVGElement>
): UseLineDrawingReturn {
  const { addElement, setIsDrawing: setStoreIsDrawing } = useBuilderStore();
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [previewLine, setPreviewLine] = useState<LineElement | ArrowElement | null>(null);
  
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const isShiftKeyRef = useRef(false);

  /**
   * 그리기 취소
   */
  const cancelDrawing = useCallback(() => {
    setIsDrawing(false);
    setStoreIsDrawing(false);
    setPreviewLine(null);
    startPointRef.current = null;
  }, [setStoreIsDrawing]);

  /**
   * ESC 키로 그리기 취소
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawing) {
        cancelDrawing();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawing, cancelDrawing]);

  /**
   * 첫 번째 클릭: 시작점 설정
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!currentTool) return;
      
      const svg = e.currentTarget;
      const point = getSVGPoint(svg, e.clientX, e.clientY);
      
      startPointRef.current = point;
      isShiftKeyRef.current = e.shiftKey;
      
      setIsDrawing(true);
      setStoreIsDrawing(true);
      
      // 초기 미리보기 선 생성 (시작점과 끝점이 같음)
      const initialLine = currentTool === 'arrow'
        ? createArrow(point, point)
        : createLine(point, point);
      
      setPreviewLine(initialLine);
    },
    [currentTool, setStoreIsDrawing]
  );

  /**
   * 마우스 이동: 실시간 미리보기
   */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isDrawing || !startPointRef.current || !currentTool) return;
      
      const svg = e.currentTarget;
      let currentPoint = getSVGPoint(svg, e.clientX, e.clientY);
      
      // Shift 키 상태 업데이트
      isShiftKeyRef.current = e.shiftKey;
      
      // Shift 키: 45도 스냅
      if (isShiftKeyRef.current) {
        currentPoint = snapToAngle(startPointRef.current, currentPoint);
      }
      
      // 미리보기 선 업데이트
      if (previewLine) {
        setPreviewLine({
          ...previewLine,
          endPoint: currentPoint,
        });
      }
    },
    [isDrawing, currentTool, previewLine]
  );

  /**
   * 마우스 업: 선 완성
   */
  const handleMouseUp = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isDrawing || !previewLine || !startPointRef.current) return;
      
      const svg = e.currentTarget;
      let endPoint = getSVGPoint(svg, e.clientX, e.clientY);
      
      // Shift 키: 45도 스냅
      if (isShiftKeyRef.current) {
        endPoint = snapToAngle(startPointRef.current, endPoint);
      }
      
      // 최소 길이 체크 (너무 짧으면 무시)
      const dx = endPoint.x - startPointRef.current.x;
      const dy = endPoint.y - startPointRef.current.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      if (length > 5) {
        // 최종 선 생성
        const finalLine = {
          ...previewLine,
          endPoint,
        };
        
        addElement(finalLine);
      }
      
      // 상태 초기화
      setIsDrawing(false);
      setStoreIsDrawing(false);
      setPreviewLine(null);
      startPointRef.current = null;
    },
    [isDrawing, previewLine, addElement, setStoreIsDrawing]
  );

  return {
    isDrawing,
    previewLine,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cancelDrawing,
  };
}