import { useRef, useCallback } from 'react';
import { useBuilderStore } from '../store/builderStore';
import { useShapeDrawing } from '../hooks/useShapeDrawing';
import { useDragElement } from '../hooks/useDragElement';
import ShapeRenderer from '../Canvas/ShapeRenderer';
import SelectionBox from '../Canvas/SelectionBox';
import type { Shape, ShapeType } from '../types';

export default function Canvas() {
  const { 
    currentTool, 
    elements, 
    selectedElementIds,
    selectElements,
  } = useBuilderStore();

  const svgRef = useRef<SVGSVGElement>(null);

  // 도형 그리기 훅
  const isShapeTool = ['rectangle', 'circle', 'triangle'].includes(currentTool);
  const shapeDrawing = useShapeDrawing(
    isShapeTool ? (currentTool as ShapeType) : null,
    svgRef
  );

  // 드래그 훅
  const dragElement = useDragElement();

  /**
   * SVG 캔버스 클릭 (배경 클릭)
   */
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      // 배경 클릭 시에만 선택 해제
      if (e.target === e.currentTarget || (e.target as SVGElement).tagName === 'rect') {
        if ((e.target as SVGElement).getAttribute('data-background')) {
          selectElements([], 'replace');
        }
      }
    },
    [selectElements]
  );

  /**
   * 요소 클릭
   */
  const handleElementClick = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      e.stopPropagation();
      
      // Ctrl/Cmd 키: 다중 선택
      if (e.ctrlKey || e.metaKey) {
        selectElements([elementId], 'add');
      } else {
        selectElements([elementId], 'replace');
      }
    },
    [selectElements]
  );

  /**
   * 요소 마우스 다운 (드래그 시작)
   */
  const handleElementMouseDown = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      e.stopPropagation();
      
      // 선택 도구일 때만 드래그 가능
      if (currentTool === 'select') {
        dragElement.handleDragStart(e, elementId);
      }
    },
    [currentTool, dragElement]
  );

  /**
   * 마우스 다운 핸들러
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      // 도형 그리기 도구일 때
      if (isShapeTool) {
        shapeDrawing.handleMouseDown(e);
      }
    },
    [isShapeTool, shapeDrawing]
  );

  /**
   * 마우스 이동 핸들러
   */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      // 도형 그리기 중
      if (shapeDrawing.isDrawing) {
        shapeDrawing.handleMouseMove(e);
      }
      // 드래그 중
      else if (dragElement.isDragging) {
        dragElement.handleDrag(e);
      }
    },
    [shapeDrawing, dragElement]
  );

  /**
   * 마우스 업 핸들러
   */
  const handleMouseUp = useCallback(() => {
    // 도형 그리기 종료
    if (shapeDrawing.isDrawing) {
      shapeDrawing.handleMouseUp();
    }
    // 드래그 종료
    else if (dragElement.isDragging) {
      dragElement.handleDragEnd();
    }
  }, [shapeDrawing, dragElement]);

  // 요소를 zIndex 순서로 정렬
  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  // Shape 타입 요소만 필터링
  const shapes = sortedElements.filter((el) => el.type === 'shape') as Shape[];

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <svg
          ref={svgRef}
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
          className="border border-gray-200"
          style={{ maxWidth: '100%', height: 'auto' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleCanvasClick}
        >
          {/* 배경 그리드 */}
          <defs>
            <pattern
              id="grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect width="20" height="20" fill="white" />
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#f0f0f0"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>

          {/* 그리드 배경 */}
          <rect 
            width="1920" 
            height="1080" 
            fill="url(#grid)" 
            data-background="true"
          />

          {/* 기존 도형들 렌더링 */}
          {shapes.map((shape) => (
            <ShapeRenderer
              key={shape.id}
              shape={shape}
              isSelected={selectedElementIds.includes(shape.id)}
              onMouseDown={(e) => handleElementMouseDown(e, shape.id)}
              onClick={(e) => handleElementClick(e, shape.id)}
            />
          ))}

          {/* 그리기 중인 미리보기 도형 */}
          {shapeDrawing.previewShape && (
            <ShapeRenderer
              shape={shapeDrawing.previewShape}
              isSelected={false}
            />
          )}

          {/* 선택 박스 */}
          {shapes
            .filter((shape) => selectedElementIds.includes(shape.id))
            .map((shape) => (
              <SelectionBox
                key={`selection-${shape.id}`}
                element={shape}
              />
            ))}

          {/* 안내 메시지 (요소가 없을 때) */}
          {elements.length === 0 && !shapeDrawing.isDrawing && (
            <g>
              <text
                x="960"
                y="500"
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="24"
                fontFamily="Inter, sans-serif"
              >
                {currentTool === 'select'
                  ? '도구를 선택하여 시작하세요'
                  : `${getToolName(currentTool)} 도구로 캔버스에 그리세요`}
              </text>
              <text
                x="960"
                y="540"
                textAnchor="middle"
                fill="#d1d5db"
                fontSize="16"
                fontFamily="Inter, sans-serif"
              >
                {currentTool === 'select' 
                  ? '좌측 도구바에서 도구를 선택하세요'
                  : '드래그하여 그리기 시작'}
              </text>
              {isShapeTool && (
                <text
                  x="960"
                  y="570"
                  textAnchor="middle"
                  fill="#d1d5db"
                  fontSize="14"
                  fontFamily="Inter, sans-serif"
                >
                  Shift: 정사각형/정원 | Alt: 중심에서 그리기
                </text>
              )}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

// 도구 이름 가져오기 헬퍼 함수
function getToolName(tool: string): string {
  const toolNames: Record<string, string> = {
    select: '선택',
    rectangle: '사각형',
    circle: '원',
    triangle: '삼각형',
    line: '직선',
    arrow: '화살표',
    text: '텍스트',
    image: '이미지',
  };
  return toolNames[tool] || tool;
}