import { useState, useCallback, useRef } from 'react';
import { useBuilderStore } from '../store/builderStore';
import { getSVGPoint } from '../utils/shapeUtils';
import type { CanvasElement } from '../types';

interface UseDragElementReturn {
  isDragging: boolean;
  handleDragStart: (e: React.MouseEvent, elementId: string) => void;
  handleDrag: (e: React.MouseEvent<SVGSVGElement>) => void;
  handleDragEnd: () => void;
}

export function useDragElement(): UseDragElementReturn {
  const { elements, updateElement, selectedElementIds, selectElements } = useBuilderStore();
  
  const [isDragging, setIsDragging] = useState(false);
  const [_draggedElementId, setDraggedElementId] = useState<string | null>(null);
  
  const dragStartPointRef = useRef<{ x: number; y: number } | null>(null);
  const elementStartDataRef = useRef<Map<string, any>>(new Map());

  /**
   * 드래그 시작
   */
  const handleDragStart = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      e.stopPropagation();
      
      // 잠긴 요소는 드래그 불가
      const element = elements.find((el) => el.id === elementId);
      if (!element || element.locked) return;
      
      // SVG 좌표로 변환
      const svg = (e.target as SVGElement).ownerSVGElement;
      if (!svg) return;
      
      const point = getSVGPoint(svg, e.clientX, e.clientY);
      dragStartPointRef.current = point;
      
      // 선택되지 않은 요소를 드래그하면 해당 요소만 선택
      if (!selectedElementIds.includes(elementId)) {
        selectElements([elementId], 'replace');
      }
      
      // 선택된 모든 요소의 시작 데이터 저장
      const startData = new Map<string, any>();
      selectedElementIds.forEach((id) => {
        const el = elements.find((e) => e.id === id);
        if (el && !el.locked) {
          if (el.type === 'line' || el.type === 'arrow') {
            // 선/화살표: startPoint, endPoint 저장
            startData.set(id, {
              startPoint: { ...el.startPoint },
              endPoint: { ...el.endPoint },
            });
          } else {
            // 도형/텍스트/이미지: position 저장
            startData.set(id, {
              position: { ...el.position },
            });
          }
        }
      });
      elementStartDataRef.current = startData;
      
      setIsDragging(true);
      setDraggedElementId(elementId);
    },
    [elements, selectedElementIds, selectElements]
  );

  /**
   * 드래그 중
   */
  const handleDrag = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isDragging || !dragStartPointRef.current) return;
      
      const svg = e.currentTarget;
      const currentPoint = getSVGPoint(svg, e.clientX, e.clientY);
      
      const deltaX = currentPoint.x - dragStartPointRef.current.x;
      const deltaY = currentPoint.y - dragStartPointRef.current.y;
      
      // 선택된 모든 요소 이동
      elementStartDataRef.current.forEach((startData, elementId) => {
        const element = elements.find((el) => el.id === elementId);
        if (!element) return;

        if (element.type === 'line' || element.type === 'arrow') {
          // 선/화살표: startPoint와 endPoint 모두 이동
          const newStartPoint = {
            x: startData.startPoint.x + deltaX,
            y: startData.startPoint.y + deltaY,
          };
          const newEndPoint = {
            x: startData.endPoint.x + deltaX,
            y: startData.endPoint.y + deltaY,
          };
          
          updateElement(elementId, {
            startPoint: newStartPoint,
            endPoint: newEndPoint,
          } as Partial<CanvasElement>);
        } else {
          // 도형/텍스트/이미지: position 이동
          const newPosition = {
            x: startData.position.x + deltaX,
            y: startData.position.y + deltaY,
          };
          
          updateElement(elementId, { position: newPosition });
        }
      });
    },
    [isDragging, elements, updateElement]
  );

  /**
   * 드래그 종료
   */
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggedElementId(null);
    dragStartPointRef.current = null;
    elementStartDataRef.current.clear();
  }, []);

  return {
    isDragging,
    handleDragStart,
    handleDrag,
    handleDragEnd,
  };
}