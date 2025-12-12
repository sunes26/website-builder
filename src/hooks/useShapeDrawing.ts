import { useState, useCallback, useRef } from 'react';
import { useBuilderStore } from '../store/builderStore';
import { createShape, normalizeSize, getSquareSize, getCenterPosition, getSVGPoint } from '../utils/shapeUtils';
import type { Shape, ShapeType } from '../types';

interface UseShapeDrawingReturn {
  isDrawing: boolean;
  previewShape: Shape | null;
  handleMouseDown: (e: React.MouseEvent<SVGSVGElement>) => void;
  handleMouseMove: (e: React.MouseEvent<SVGSVGElement>) => void;
  handleMouseUp: () => void;
}

export function useShapeDrawing(
  currentTool: ShapeType | null,
  _svgRef: React.RefObject<SVGSVGElement>
): UseShapeDrawingReturn {
  const { addElement, setIsDrawing: setStoreIsDrawing } = useBuilderStore();
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [previewShape, setPreviewShape] = useState<Shape | null>(null);
  
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const isShiftKeyRef = useRef(false);
  const isAltKeyRef = useRef(false);

  /**
   * 마우스 다운: 그리기 시작
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!currentTool) return;
      
      const svg = e.currentTarget;
      const point = getSVGPoint(svg, e.clientX, e.clientY);
      
      startPointRef.current = point;
      isShiftKeyRef.current = e.shiftKey;
      isAltKeyRef.current = e.altKey;
      
      setIsDrawing(true);
      setStoreIsDrawing(true);
      
      // 초기 미리보기 도형 생성 (크기 0)
      const initialShape = createShape(currentTool, point, { width: 0, height: 0 });
      setPreviewShape(initialShape);
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
      const currentPoint = getSVGPoint(svg, e.clientX, e.clientY);
      
      // Shift/Alt 키 상태 업데이트
      isShiftKeyRef.current = e.shiftKey;
      isAltKeyRef.current = e.altKey;
      
      let position = { ...startPointRef.current };
      let size = {
        width: currentPoint.x - startPointRef.current.x,
        height: currentPoint.y - startPointRef.current.y,
      };
      
      // Shift 키: 정사각형/정원 그리기
      if (isShiftKeyRef.current) {
        const squareSize = getSquareSize(
          startPointRef.current.x,
          startPointRef.current.y,
          currentPoint.x,
          currentPoint.y
        );
        size = squareSize;
        
        // 음수 방향 처리
        if (currentPoint.x < startPointRef.current.x) {
          position.x = startPointRef.current.x - size.width;
        }
        if (currentPoint.y < startPointRef.current.y) {
          position.y = startPointRef.current.y - size.height;
        }
      } else {
        // 일반 그리기: 음수 크기 정규화
        const normalized = normalizeSize(
          startPointRef.current.x,
          startPointRef.current.y,
          currentPoint.x,
          currentPoint.y
        );
        position = normalized.position;
        size = normalized.size;
      }
      
      // Alt 키: 중심에서 그리기
      if (isAltKeyRef.current) {
        const centerPos = getCenterPosition(
          startPointRef.current.x,
          startPointRef.current.y,
          size.width,
          size.height
        );
        position = centerPos;
      }
      
      // 미리보기 도형 업데이트
      if (previewShape) {
        setPreviewShape({
          ...previewShape,
          position,
          size,
        });
      }
    },
    [isDrawing, currentTool, previewShape]
  );

  /**
   * 마우스 업: 도형 완성
   */
  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !previewShape) return;
    
    // 최소 크기 체크 (너무 작으면 무시)
    if (previewShape.size.width > 5 && previewShape.size.height > 5) {
      addElement(previewShape);
    }
    
    // 상태 초기화
    setIsDrawing(false);
    setStoreIsDrawing(false);
    setPreviewShape(null);
    startPointRef.current = null;
  }, [isDrawing, previewShape, addElement, setStoreIsDrawing]);

  return {
    isDrawing,
    previewShape,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}