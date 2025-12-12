import { useRef, useEffect, useState } from 'react';
import { useBuilderStore } from '../store/builderStore';
import { useShapeDrawing } from '../hooks/useShapeDrawing';
import { useDragElement } from '../hooks/useDragElement';
import { useLineDrawing } from '../hooks/useLineDrawing';
import { useTextEditing } from '../hooks/useTextEditing';
import { useImageUpload } from '../hooks/useImageUpload';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useCanvasZoom } from '../hooks/useCanvasZoom';
import ShapeRenderer from './ShapeRenderer';
import LineRenderer from './LineRenderer';
import FreeTextRenderer from './FreeTextRenderer';
import FreeImageRenderer from './FreeImageRenderer';
import TextEditor from './TextEditor';
import SelectionBox from './SelectionBox';
import GroupRenderer from './GroupRenderer';
import ComponentInstanceRenderer from './ComponentInstanceRenderer';
import SmartGuidesRenderer from './SmartGuidesRenderer';
import HTMLSelectionBox from './HTMLSelectionBox';
import FloatingViewportSwitcher from '../components/FloatingViewportSwitcher';
import ContextMenu, { createContextMenuItems } from '../components/ContextMenu';
import { LayoutGuidesDefs } from './LayoutGuides';
import { getLayoutChildren } from '../utils/layoutCalculator';
import { getElementsInSelectionBox } from '../utils/selectionUtils';
import { getSVGPoint } from '../utils/shapeUtils';
import type { ShapeType } from '../types';

export default function Canvas() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 키보드 단축키 활성화
  useKeyboardShortcuts();

  // 캔버스 줌 & 팬 활성화 (Priority 0.1)
  const { canvasZoom, canvasPanX, canvasPanY } = useCanvasZoom(containerRef);

  // 컨텍스트 메뉴 상태
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // 드래그 앤 드롭 상태 (Priority 3.4)
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    currentTool,
    elements,
    selectedElementIds,
    selectElements,
    isDrawing: storeIsDrawing,
    deleteElements,
    undo,
    redo,
    canUndo,
    canRedo,
    groupElements,
    ungroupElements,
    moveLayerUp,
    moveLayerDown,
    addComponentInstance,
    currentBreakpoint,
    getResolvedProperties,
    updateComputedPositions,
    showGrid,
    gridSize,
    smartGuides,
    selectionBox,
    setSelectionBox,
  } = useBuilderStore();

  // Phase 14: 반응형 디자인 - 브레이크포인트별 캔버스 너비
  const canvasWidths = {
    desktop: 1920,
    tablet: 768,
    mobile: 375,
  };
  const canvasWidth = canvasWidths[currentBreakpoint];
  const canvasHeight = 1080; // 고정 높이 유지

  // 도형 그리기 훅
  const isShapeDrawingMode = 
    currentTool === 'rectangle' || 
    currentTool === 'circle' || 
    currentTool === 'triangle';
  
  const shapeType: ShapeType | null = isShapeDrawingMode 
    ? currentTool as ShapeType 
    : null;

  const {
    isDrawing: isDrawingShape,
    previewShape,
    handleMouseDown: handleShapeDrawingMouseDown,
    handleMouseMove: handleShapeDrawingMouseMove,
    handleMouseUp: handleShapeDrawingMouseUp,
  } = useShapeDrawing(shapeType, svgRef);

  // 선 그리기 훅
  const isLineDrawingMode = 
    currentTool === 'line' || 
    currentTool === 'arrow';
  
  const lineType = isLineDrawingMode ? currentTool : null;

  const {
    isDrawing: isDrawingLine,
    previewLine,
    handleMouseDown: handleLineDrawingMouseDown,
    handleMouseMove: handleLineDrawingMouseMove,
    handleMouseUp: handleLineDrawingMouseUp,
  } = useLineDrawing(lineType, svgRef);

  // 텍스트 편집 훅
  const {
    editingTextId,
    startEditing,
    stopEditing,
    updateTextContent,
    createTextAtPosition,
  } = useTextEditing();

  // 이미지 업로드 훅
  const {
    createImageAtPosition,
    handleImageUpload,
  } = useImageUpload();

  // 드래그 이동 훅
  const {
    isDragging,
    handleDragStart,
    handleDrag,
    handleDragEnd,
  } = useDragElement(canvasWidth, canvasHeight);

  // 현재 그리기 상태
  const isDrawing = isDrawingShape || isDrawingLine;

  // 마우스 다운 이벤트
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    // 이미지 모드: 클릭한 위치에서 이미지 업로드 시작
    if (currentTool === 'image') {
      if (!svgRef.current) return;

      const rect = svgRef.current.getBoundingClientRect();
      const svgX = ((e.clientX - rect.left) / rect.width) * canvasWidth;
      const svgY = ((e.clientY - rect.top) / rect.height) * canvasHeight;

      createImageAtPosition({ x: svgX, y: svgY });
      return;
    }

    // 텍스트 모드: 클릭한 위치에 텍스트 생성
    if (currentTool === 'text') {
      if (!svgRef.current) return;

      const rect = svgRef.current.getBoundingClientRect();
      const svgX = ((e.clientX - rect.left) / rect.width) * canvasWidth;
      const svgY = ((e.clientY - rect.top) / rect.height) * canvasHeight;

      createTextAtPosition({ x: svgX, y: svgY });
      return;
    }

    // 도형 그리기 모드 또는 선 그리기 모드
    if (isShapeDrawingMode) {
      handleShapeDrawingMouseDown(e);
    } else if (isLineDrawingMode) {
      handleLineDrawingMouseDown(e);
    }
    // 선택 모드는 컨테이너 레벨에서 처리
  };

  // 마우스 이동 이벤트
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDrawingShape) {
      handleShapeDrawingMouseMove(e);
    } else if (isDrawingLine) {
      handleLineDrawingMouseMove(e);
    } else if (isDragging) {
      handleDrag(e);
    }
    // 박스 선택은 컨테이너 레벨에서 처리
  };

  // 마우스 업 이벤트
  const handleMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDrawingShape) {
      handleShapeDrawingMouseUp();
    } else if (isDrawingLine) {
      handleLineDrawingMouseUp(e);
    } else if (isDragging) {
      handleDragEnd();
    }
    // 박스 선택은 컨테이너 레벨에서 처리
  };

  // 전역 마우스 업 이벤트 (캔버스 밖에서 마우스를 떼는 경우)
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDrawingShape) {
        handleShapeDrawingMouseUp();
      }
      if (isDragging) {
        handleDragEnd();
      }
      if (selectionBox) {
        // 박스 선택 초기화 (Priority 2.2)
        setSelectionBox(null);
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDrawingShape, isDragging, selectionBox, handleShapeDrawingMouseUp, handleDragEnd, setSelectionBox]);

  // 요소 클릭 핸들러
  const handleElementClick = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();

    if (currentTool === 'select') {
      // Priority 3.2: 잠긴 요소는 선택할 수 없음
      const element = elements.find((el) => el.id === elementId);
      if (element?.locked) {
        return;
      }

      // Ctrl/Cmd 키: 다중 선택
      if (e.ctrlKey || e.metaKey) {
        selectElements([elementId], 'add');
      } else {
        selectElements([elementId], 'replace');
      }
    }
  };

  // 요소 드래그 시작 핸들러
  const handleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
    if (currentTool === 'select') {
      // Priority 3.2: 잠긴 요소는 드래그할 수 없음
      const element = elements.find((el) => el.id === elementId);
      if (element?.locked) {
        e.stopPropagation();
        return;
      }

      // Ctrl/Cmd 키가 눌려있으면 다중 선택 모드이므로 드래그 시작하지 않음
      if (e.ctrlKey || e.metaKey) {
        return;
      }
      handleDragStart(e, elementId);
    }
  };

  // 텍스트 더블클릭 핸들러
  const handleTextDoubleClick = (e: React.MouseEvent, textId: string) => {
    e.stopPropagation();
    startEditing(textId);
  };

  // 텍스트 내용 변경 핸들러
  const handleTextContentChange = (textId: string, content: string) => {
    updateTextContent(textId, content);
  };

  // 텍스트 편집 종료 핸들러
  const handleTextBlur = () => {
    stopEditing();
  };

  // 컨텍스트 메뉴 핸들러
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // 컨텍스트 메뉴 아이템 생성
  const getContextMenuItems = () => {
    const selectedElements = elements.filter(el =>
      selectedElementIds.includes(el.id)
    );
    const hasSelection = selectedElementIds.length > 0;
    const canGroup = selectedElementIds.length >= 2;
    const hasGroups = selectedElements.some(el => el.type === 'group');

    return [
      createContextMenuItems.undo(canUndo(), () => undo()),
      createContextMenuItems.redo(canRedo(), () => redo()),
      createContextMenuItems.group(canGroup, () => groupElements()),
      createContextMenuItems.ungroup(hasGroups, () => {
        selectedElements.forEach(el => {
          if (el.type === 'group') {
            ungroupElements(el.id);
          }
        });
      }),
      createContextMenuItems.delete(hasSelection, () => deleteElements(selectedElementIds)),
      createContextMenuItems.bringForward(hasSelection, () => {
        selectedElementIds.forEach(id => moveLayerUp(id));
      }),
      createContextMenuItems.sendBackward(hasSelection, () => {
        selectedElementIds.forEach(id => moveLayerDown(id));
      }),
    ];
  };

  // 드래그 오버 핸들러 (Phase 12 + Priority 3.4)
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 컴포넌트 또는 이미지 파일 체크
    const hasFiles = e.dataTransfer.types.includes('Files');
    const hasComponent = e.dataTransfer.types.includes('componentid');

    if (hasFiles || hasComponent) {
      e.dataTransfer.dropEffect = 'copy';
      setIsDragOver(true);
    }
  };

  // 드롭 핸들러 (Phase 12 + Priority 3.4)
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const svg = svgRef.current;
    if (!svg) return;

    // 1. 이미지 파일 드롭 처리 (Priority 3.4)
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      // 드롭 위치 계산 (SVG 좌표로 변환)
      const dropPoint = getSVGPoint(svg, e.clientX, e.clientY);

      // 여러 이미지를 순차적으로 추가 (간격을 두고)
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const offsetX = i * 30; // 각 이미지마다 30px씩 오프셋
        const offsetY = i * 30;
        const position = {
          x: dropPoint.x + offsetX,
          y: dropPoint.y + offsetY,
        };
        await handleImageUpload(file, position);
      }
      return;
    }

    // 2. 컴포넌트 드롭 처리 (Phase 12)
    const componentId = e.dataTransfer.getData('componentId');
    if (componentId) {
      const rect = svg.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 1920;
      const y = ((e.clientY - rect.top) / rect.height) * 1080;

      // 컴포넌트 인스턴스 생성
      addComponentInstance(componentId, { x, y });
    }
  };

  // zIndex 순서로 정렬 (낮은 것부터 그려야 위에 있는 것이 나중에 그려짐)
  // Priority 3.2: visible이 true인 요소만 렌더링
  const sortedElements = [...elements]
    .filter((el) => el.visible)
    .sort((a, b) => a.zIndex - b.zIndex);

  // 컨테이너 레벨 마우스 다운 핸들러 (박스 선택을 캔버스 밖에서도 시작 가능)
  const handleContainerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // 플로팅 UI 클릭은 무시
    if ((e.target as HTMLElement).closest('.floating-viewport-switcher')) {
      return;
    }

    // 선택 모드이고 SVG 외부를 클릭한 경우 박스 선택 시작
    if (currentTool === 'select' && svgRef.current) {
      const svg = svgRef.current;
      const point = getSVGPoint(svg, e.clientX, e.clientY);

      setSelectionBox({
        startX: point.x,
        startY: point.y,
        endX: point.x,
        endY: point.y,
      });

      // Shift 키가 눌려있지 않으면 기존 선택 해제
      if (!e.shiftKey) {
        selectElements([], 'replace');
      }
    }
  };

  // 컨테이너 레벨 마우스 이동 핸들러
  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectionBox && svgRef.current) {
      const svg = svgRef.current;
      const point = getSVGPoint(svg, e.clientX, e.clientY);

      setSelectionBox({
        ...selectionBox,
        endX: point.x,
        endY: point.y,
      });
    }
  };

  // 컨테이너 레벨 마우스 업 핸들러
  const handleContainerMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectionBox) {
      // 박스 선택 완료
      const selectedIds = getElementsInSelectionBox(elements, selectionBox);

      if (selectedIds.length > 0) {
        if (e.shiftKey) {
          // Shift+드래그: 기존 선택에 추가
          const newSelection = [
            ...new Set([...selectedElementIds, ...selectedIds]),
          ];
          selectElements(newSelection, 'replace');
        } else {
          // 일반 드래그: 새로 선택
          selectElements(selectedIds, 'replace');
        }
      }

      // 박스 초기화
      setSelectionBox(null);
    }
  };

  // 드래그 리브 핸들러 (Priority 3.4)
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex items-center justify-center p-8 overflow-hidden relative ${
        isDragOver ? 'bg-blue-50' : ''
      }`}
      onMouseDown={handleContainerMouseDown}
      onMouseMove={handleContainerMouseMove}
      onMouseUp={handleContainerMouseUp}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 플로팅 브레이크포인트 전환기 (Priority 2.3) */}
      <div className="floating-viewport-switcher">
        <FloatingViewportSwitcher />
      </div>

      {/* HTML 박스 선택 (Priority 2.2 개선 - 캔버스 밖에서도 표시) */}
      {selectionBox && <HTMLSelectionBox selectionBox={selectionBox} svgElement={svgRef.current} />}

      {/* 드래그 앤 드롭 오버레이 (Priority 3.4) */}
      {isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-500/10 border-4 border-dashed border-blue-500 rounded-lg pointer-events-none z-50">
          <div className="bg-white/95 rounded-lg shadow-lg px-6 py-4">
            <p className="text-lg font-medium text-blue-600">이미지 파일을 여기에 드롭하세요</p>
            <p className="text-sm text-gray-500 mt-1">여러 이미지를 한 번에 드롭할 수 있습니다</p>
          </div>
        </div>
      )}

      <div
        className="bg-white rounded-lg shadow-xl overflow-hidden"
        style={{
          transform: `translate(${canvasPanX}px, ${canvasPanY}px) scale(${canvasZoom})`,
          transformOrigin: 'center',
          transition: 'transform 0.1s ease-out, width 0.3s ease-in-out, height 0.3s ease-in-out',
        }}
      >
        <svg
          ref={svgRef}
          width={canvasWidth}
          height={canvasHeight}
          viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          className="border border-gray-200"
          style={{
            maxWidth: '100%',
            height: 'auto',
            cursor: isDrawing
              ? 'crosshair'
              : isDragging
              ? 'grabbing'
              : currentTool === 'text'
              ? 'text'
              : currentTool === 'image'
              ? 'pointer'
              : 'default',
            transition: 'width 0.3s ease-in-out, height 0.3s ease-in-out',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onContextMenu={handleContextMenu}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* 배경 그리드 및 레이아웃 가이드 마커 */}
          <defs>
            <pattern
              id="grid"
              width={gridSize}
              height={gridSize}
              patternUnits="userSpaceOnUse"
            >
              <rect width={gridSize} height={gridSize} fill="white" />
              <path
                d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                fill="none"
                stroke="#f0f0f0"
                strokeWidth="0.5"
              />
            </pattern>
            {/* Phase 15: 레이아웃 가이드 마커 */}
            <LayoutGuidesDefs />
          </defs>

          {/* 그리드 배경 */}
          <rect
            width={canvasWidth}
            height={canvasHeight}
            fill={showGrid ? "url(#grid)" : "white"}
          />

          {/* 기존 요소들 렌더링 */}
          {sortedElements.map((element) => {
            // Phase 14: 현재 브레이크포인트의 해결된 속성 사용
            const resolvedElement = getResolvedProperties(element, currentBreakpoint);

            const isSelected = selectedElementIds.includes(element.id);
            const isEditingThis = editingTextId === element.id;

            // 그룹 (Phase 8, 확장: Phase 15)
            if (resolvedElement.type === 'group') {
              // Phase 15: 레이아웃 자식 요소 가져오기
              const groupChildren = getLayoutChildren(
                resolvedElement,
                elements
              );

              return (
                <g key={element.id}>
                  <GroupRenderer
                    group={resolvedElement}
                    isSelected={isSelected}
                    children={groupChildren}
                    onLayoutComputed={updateComputedPositions}
                    onMouseDown={(e) => handleElementMouseDown(e, element.id)}
                    onClick={(e) => handleElementClick(e, element.id)}
                  />
                  {isSelected && !storeIsDrawing && (
                    <SelectionBox element={resolvedElement} />
                  )}
                </g>
              );
            }

            // 컴포넌트 인스턴스 (Phase 12, 확장: Phase 15)
            if (resolvedElement.type === 'component') {
              // Phase 15: 레이아웃 자식 요소 가져오기
              const componentChildren = getLayoutChildren(
                resolvedElement,
                elements
              );

              return (
                <g key={element.id}>
                  <ComponentInstanceRenderer
                    instance={resolvedElement}
                    isSelected={isSelected}
                    children={componentChildren}
                    onLayoutComputed={updateComputedPositions}
                    onMouseDown={(e) => handleElementMouseDown(e, element.id)}
                    onClick={(e) => handleElementClick(e, element.id)}
                  />
                  {isSelected && !storeIsDrawing && (
                    <SelectionBox element={resolvedElement} />
                  )}
                </g>
              );
            }

            // 도형
            if (resolvedElement.type === 'shape') {
              return (
                <g key={element.id}>
                  <ShapeRenderer
                    shape={resolvedElement}
                    isSelected={isSelected}
                    onMouseDown={(e) => handleElementMouseDown(e, element.id)}
                    onClick={(e) => handleElementClick(e, element.id)}
                  />
                  {isSelected && !storeIsDrawing && (
                    <SelectionBox element={resolvedElement} />
                  )}
                </g>
              );
            }

            // 선 또는 화살표
            if (resolvedElement.type === 'line' || resolvedElement.type === 'arrow') {
              return (
                <g key={element.id}>
                  <LineRenderer
                    line={resolvedElement}
                    isSelected={isSelected}
                    onMouseDown={(e) => handleElementMouseDown(e, element.id)}
                    onClick={(e) => handleElementClick(e, element.id)}
                  />
                </g>
              );
            }

            // 텍스트
            if (resolvedElement.type === 'text') {
              // 편집 중이면 TextEditor 렌더링
              if (isEditingThis) {
                return (
                  <TextEditor
                    key={element.id}
                    text={resolvedElement}
                    onContentChange={(content) => handleTextContentChange(element.id, content)}
                    onBlur={handleTextBlur}
                  />
                );
              }

              // 일반 렌더링
              return (
                <g key={element.id}>
                  <FreeTextRenderer
                    text={resolvedElement}
                    isSelected={isSelected}
                    isEditing={false}
                    onDoubleClick={(e) => handleTextDoubleClick(e, element.id)}
                    onMouseDown={(e) => handleElementMouseDown(e, element.id)}
                    onClick={(e) => handleElementClick(e, element.id)}
                  />
                  {isSelected && !storeIsDrawing && (
                    <SelectionBox element={resolvedElement} />
                  )}
                </g>
              );
            }

            // 이미지
            if (resolvedElement.type === 'image') {
              return (
                <g key={element.id}>
                  <FreeImageRenderer
                    image={resolvedElement}
                    isSelected={isSelected}
                    onMouseDown={(e) => handleElementMouseDown(e, element.id)}
                    onClick={(e) => handleElementClick(e, element.id)}
                  />
                  {isSelected && !storeIsDrawing && (
                    <SelectionBox element={resolvedElement} />
                  )}
                </g>
              );
            }

            return null;
          })}

          {/* 미리보기 도형 (그리기 중) */}
          {isDrawingShape && previewShape && (
            <g opacity="0.6">
              <ShapeRenderer
                shape={previewShape}
                isSelected={false}
              />
            </g>
          )}

          {/* 미리보기 선 (그리기 중) */}
          {isDrawingLine && previewLine && (
            <g opacity="0.6">
              <LineRenderer
                line={previewLine}
                isSelected={false}
              />
            </g>
          )}

          {/* 스마트 가이드라인 (Priority 2.1) */}
          <SmartGuidesRenderer
            guides={smartGuides}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
          />

          {/* 안내 메시지 */}
          {elements.length === 0 && !isDrawing && (
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
                  ? '좌측 도구바에서 도구를 선택하세요'
                  : currentTool === 'text'
                  ? '텍스트 도구로 캔버스를 클릭하여 텍스트를 추가하세요'
                  : currentTool === 'image'
                  ? '이미지 도구로 캔버스를 클릭하여 이미지를 업로드하세요'
                  : `${getToolName(currentTool)} 도구로 캔버스를 ${isLineDrawingMode ? '클릭' : '드래그'}하여 그리세요`}
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
                  ? '사각형, 원, 삼각형, 선, 텍스트, 이미지 등을 그려보세요'
                  : currentTool === 'text'
                  ? '더블클릭하여 텍스트 편집 | ESC: 편집 종료'
                  : currentTool === 'image'
                  ? '클릭하면 파일 선택 대화상자가 열립니다'
                  : isLineDrawingMode
                  ? 'Shift: 45도 스냅 | ESC: 취소'
                  : 'Shift: 정사각형/정원 | Alt: 중심에서 그리기'}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* 컨텍스트 메뉴 */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={getContextMenuItems()}
          onClose={handleCloseContextMenu}
        />
      )}
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