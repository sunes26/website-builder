import { useRef, useEffect } from 'react';
import { useBuilderStore } from '../store/builderStore';
import { useShapeDrawing } from '../hooks/useShapeDrawing';
import { useDragElement } from '../hooks/useDragElement';
import { useLineDrawing } from '../hooks/useLineDrawing';
import { useTextEditing } from '../hooks/useTextEditing';
import { useImageUpload } from '../hooks/useImageUpload';
import ShapeRenderer from './ShapeRenderer';
import LineRenderer from './LineRenderer';
import FreeTextRenderer from './FreeTextRenderer';
import FreeImageRenderer from './FreeImageRenderer';
import TextEditor from './TextEditor';
import SelectionBox from './SelectionBox';
import type { ShapeType } from '../types';

export default function Canvas() {
  const svgRef = useRef<SVGSVGElement>(null);
  
  const { 
    currentTool, 
    elements, 
    selectedElementIds, 
    selectElements,
    isDrawing: storeIsDrawing 
  } = useBuilderStore();

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
  } = useImageUpload();

  // 드래그 이동 훅
  const {
    isDragging,
    handleDragStart,
    handleDrag,
    handleDragEnd,
  } = useDragElement();

  // 현재 그리기 상태
  const isDrawing = isDrawingShape || isDrawingLine;

  // 마우스 다운 이벤트
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    // 이미지 모드: 클릭한 위치에서 이미지 업로드 시작
    if (currentTool === 'image') {
      if (!svgRef.current) return;
      
      const rect = svgRef.current.getBoundingClientRect();
      const svgX = ((e.clientX - rect.left) / rect.width) * 1920;
      const svgY = ((e.clientY - rect.top) / rect.height) * 1080;
      
      createImageAtPosition({ x: svgX, y: svgY });
      return;
    }
    
    // 텍스트 모드: 클릭한 위치에 텍스트 생성
    if (currentTool === 'text') {
      if (!svgRef.current) return;
      
      const rect = svgRef.current.getBoundingClientRect();
      const svgX = ((e.clientX - rect.left) / rect.width) * 1920;
      const svgY = ((e.clientY - rect.top) / rect.height) * 1080;
      
      createTextAtPosition({ x: svgX, y: svgY });
      return;
    }
    
    // 선택 모드 또는 도형 그리기 모드 또는 선 그리기 모드
    if (currentTool === 'select') {
      // SVG 배경 클릭 시 선택 해제
      if (e.target === e.currentTarget || (e.target as SVGElement).tagName === 'rect') {
        const rect = e.currentTarget.querySelector('rect[width="1920"]');
        if (e.target === rect) {
          selectElements([], 'replace');
        }
      }
    } else if (isShapeDrawingMode) {
      handleShapeDrawingMouseDown(e);
    } else if (isLineDrawingMode) {
      handleLineDrawingMouseDown(e);
    }
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
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDrawingShape, isDragging, handleShapeDrawingMouseUp, handleDragEnd]);

  // 요소 클릭 핸들러
  const handleElementClick = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    
    if (currentTool === 'select') {
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

  // zIndex 순서로 정렬 (낮은 것부터 그려야 위에 있는 것이 나중에 그려짐)
  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <svg
          ref={svgRef}
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
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
              : 'default'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
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
          <rect width="1920" height="1080" fill="url(#grid)" />

          {/* 기존 요소들 렌더링 */}
          {sortedElements.map((element) => {
            const isSelected = selectedElementIds.includes(element.id);
            const isEditingThis = editingTextId === element.id;
            
            // 도형
            if (element.type === 'shape') {
              return (
                <g key={element.id}>
                  <ShapeRenderer
                    shape={element}
                    isSelected={isSelected}
                    onMouseDown={(e) => handleElementMouseDown(e, element.id)}
                    onClick={(e) => handleElementClick(e, element.id)}
                  />
                  {isSelected && !storeIsDrawing && (
                    <SelectionBox element={element} />
                  )}
                </g>
              );
            }
            
            // 선 또는 화살표
            if (element.type === 'line' || element.type === 'arrow') {
              return (
                <g key={element.id}>
                  <LineRenderer
                    line={element}
                    isSelected={isSelected}
                    onMouseDown={(e) => handleElementMouseDown(e, element.id)}
                    onClick={(e) => handleElementClick(e, element.id)}
                  />
                </g>
              );
            }
            
            // 텍스트
            if (element.type === 'text') {
              // 편집 중이면 TextEditor 렌더링
              if (isEditingThis) {
                return (
                  <TextEditor
                    key={element.id}
                    text={element}
                    onContentChange={(content) => handleTextContentChange(element.id, content)}
                    onBlur={handleTextBlur}
                  />
                );
              }
              
              // 일반 렌더링
              return (
                <g key={element.id}>
                  <FreeTextRenderer
                    text={element}
                    isSelected={isSelected}
                    isEditing={false}
                    onDoubleClick={(e) => handleTextDoubleClick(e, element.id)}
                    onMouseDown={(e) => handleElementMouseDown(e, element.id)}
                    onClick={(e) => handleElementClick(e, element.id)}
                  />
                  {isSelected && !storeIsDrawing && (
                    <SelectionBox element={element} />
                  )}
                </g>
              );
            }
            
            // 이미지
            if (element.type === 'image') {
              return (
                <g key={element.id}>
                  <FreeImageRenderer
                    image={element}
                    isSelected={isSelected}
                    onMouseDown={(e) => handleElementMouseDown(e, element.id)}
                    onClick={(e) => handleElementClick(e, element.id)}
                  />
                  {isSelected && !storeIsDrawing && (
                    <SelectionBox element={element} />
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