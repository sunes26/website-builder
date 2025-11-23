import { useState, useCallback, useRef } from 'react';
import { useBuilderStore } from '../store/builderStore';
import { getSVGPoint } from '../utils/shapeUtils';
import type { CanvasElement } from '../types';

interface UseDragElementReturn {
  isDragging: boolean;
  draggedElementId: string | null;
  handleDragStart: (e: React.MouseEvent, elementId: string) => void;
  handleDrag: (e: React.MouseEvent<SVGSVGElement>) => void;
  handleDragEnd: () => void;
}

export function useDragElement(): UseDragElementReturn {
  const { elements, updateElement, selectedElementIds, selectElements } = useBuilderStore();
  
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  
  const dragStartPointRef = useRef<{ x: number; y: number } | null>(null);
  const elementStartPositionsRef = useRef<Map<string, { x: number; y: number }>>(new Map());

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
      
      // 선택된 모든 요소의 시작 위치 저장
      const startPositions = new Map<string, { x: number; y: number }>();
      selectedElementIds.forEach((id) => {
        const el = elements.find((e) => e.id === id);
        if (el && !el.locked) {
          startPositions.set(id, { ...el.position });
        }
      });
      elementStartPositionsRef.current = startPositions;
      
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
      elementStartPositionsRef.current.forEach((startPos, elementId) => {
        const newPosition = {
          x: startPos.x + deltaX,
          y: startPos.y + deltaY,
        };
        
        updateElement(elementId, { position: newPosition });
      });
    },
    [isDragging, updateElement]
  );

  /**
   * 드래그 종료
   */
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggedElementId(null);
    dragStartPointRef.current = null;
    elementStartPositionsRef.current.clear();
  }, []);

  return {
    isDragging,
    draggedElementId,
    handleDragStart,
    handleDrag,
    handleDragEnd,
  };
}