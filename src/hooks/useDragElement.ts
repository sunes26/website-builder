import { useState, useCallback, useRef } from 'react';
import { useBuilderStore } from '../store/builderStore';
import { getSVGPoint } from '../utils/shapeUtils';
import { calculateSmartGuides } from '../utils/smartGuides';
import type { CanvasElement } from '../types';

interface UseDragElementReturn {
  isDragging: boolean;
  handleDragStart: (e: React.MouseEvent, elementId: string) => void;
  handleDrag: (e: React.MouseEvent<SVGSVGElement>) => void;
  handleDragEnd: () => void;
}

export function useDragElement(canvasWidth: number = 1920, canvasHeight: number = 1080): UseDragElementReturn {
  const { elements, updateElement, selectedElementIds, selectElements, duplicateElements, setSmartGuides } = useBuilderStore();

  const [isDragging, setIsDragging] = useState(false);
  const [_draggedElementId, setDraggedElementId] = useState<string | null>(null);

  const dragStartPointRef = useRef<{ x: number; y: number } | null>(null);
  const elementStartDataRef = useRef<Map<string, any>>(new Map());
  const wasDuplicatedRef = useRef<boolean>(false);

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

      // Alt+드래그: 복제 후 드래그 (Priority 1.1)
      let targetElementIds = selectedElementIds.includes(elementId)
        ? selectedElementIds
        : [elementId];

      wasDuplicatedRef.current = false;

      if (e.altKey) {
        // Alt 키가 눌려있으면 복제 (오프셋 0으로 시작, 드래그로 이동)
        const duplicatedIds = duplicateElements(targetElementIds, { x: 0, y: 0 });
        targetElementIds = duplicatedIds;
        wasDuplicatedRef.current = true;
      }

      // 선택된 모든 요소의 시작 데이터 저장
      const startData = new Map<string, any>();
      targetElementIds.forEach((id) => {
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
    [elements, selectedElementIds, selectElements, duplicateElements]
  );

  /**
   * 드래그 중
   */
  const handleDrag = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isDragging || !dragStartPointRef.current) return;

      const svg = e.currentTarget;
      const currentPoint = getSVGPoint(svg, e.clientX, e.clientY);

      let deltaX = currentPoint.x - dragStartPointRef.current.x;
      let deltaY = currentPoint.y - dragStartPointRef.current.y;

      // 드래그 중인 요소들 가져오기
      const draggedElements = Array.from(elementStartDataRef.current.keys())
        .map((id) => elements.find((el) => el.id === id))
        .filter((el): el is CanvasElement => el !== undefined);

      // 다른 요소들 (가이드 기준)
      const otherElements = elements.filter(
        (el) => !draggedElements.some((dragged) => dragged.id === el.id) && !el.locked && el.visible
      );

      // 임시로 요소들의 위치를 업데이트해서 가이드 계산
      const tempElements: CanvasElement[] = draggedElements.map((element) => {
        const startData = elementStartDataRef.current.get(element.id);
        if (!startData) return element;

        if (element.type === 'line' || element.type === 'arrow') {
          return {
            ...element,
            startPoint: {
              x: startData.startPoint.x + deltaX,
              y: startData.startPoint.y + deltaY,
            },
            endPoint: {
              x: startData.endPoint.x + deltaX,
              y: startData.endPoint.y + deltaY,
            },
          };
        } else {
          return {
            ...element,
            position: {
              x: startData.position.x + deltaX,
              y: startData.position.y + deltaY,
            },
          };
        }
      });

      // 스마트 가이드 계산 (Priority 2.1)
      const snapResult = calculateSmartGuides(tempElements, otherElements, canvasWidth, canvasHeight);

      // 스냅 델타 적용
      deltaX += snapResult.deltaX;
      deltaY += snapResult.deltaY;

      // 가이드라인 업데이트
      setSmartGuides(snapResult.guides);

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
    [isDragging, elements, updateElement, setSmartGuides, canvasWidth, canvasHeight]
  );

  /**
   * 드래그 종료
   */
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggedElementId(null);
    dragStartPointRef.current = null;
    elementStartDataRef.current.clear();
    wasDuplicatedRef.current = false;

    // 가이드라인 초기화 (Priority 2.1)
    setSmartGuides([]);
  }, [setSmartGuides]);

  return {
    isDragging,
    handleDragStart,
    handleDrag,
    handleDragEnd,
  };
}