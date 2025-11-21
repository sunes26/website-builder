// src/components/Canvas.tsx
import { useState, useEffect, useRef } from 'react';
import { useBuilderStore } from '@/store/builderStore';
import { createBlockTemplate } from '@/utils/blockTemplates';
import BlockRenderer from './BlockRenderer';
import type { BlockType, SelectedElement } from '@/types';

// 블록 타입별 예상 높이 (px)
const BLOCK_HEIGHTS: Record<BlockType, number> = {
  '헤더': 80,
  '히어로': 80,
  '콘텐츠': 80,
  '갤러리': 80,
  '폼(Form)': 80,
  '푸터': 80,
  '링크 그룹': 80,
};

// 전역 드래그 상태
let globalDraggingBlockType: BlockType | null = null;

export default function Canvas() {
  const { 
    currentPage, 
    viewport, 
    previewMode,
    addBlock, 
    reorderBlocks, 
    setSelectedElement,
    selectedElement,
    copyBlock,
    pasteBlock,
    cutBlock,
    undo,
    redo,
    
    // 🆕 다중 블록 선택
    selectBlock,
    selectBlocks,
    clearSelection,
    selectAll,
    isBlockSelected,
    selectedBlockIds,
    selectionMode,
    deleteSelectedBlocks,
    copySelectedBlocks,
    pasteSelectedBlocks,
    cutSelectedBlocks,
    
    // 🆕 드래그 선택 박스
    selectionBox,
    setSelectionBox,
    isSelecting,
    setIsSelecting,
    selectBlocksInBox,
  } = useBuilderStore();
  
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggingBlockType, setDraggingBlockType] = useState<BlockType | null>(null);
  const dropZoneRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  
  // 🆕 선택 박스 드래그 상태
  const canvasRef = useRef<HTMLDivElement>(null);
  const isDraggingSelection = useRef(false);

  // 🆕 다중 블록 선택 키보드 단축키
  useEffect(() => {
    if (previewMode) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isEditing = 
        activeElement?.tagName === 'INPUT' || 
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.getAttribute('contenteditable') === 'true';
      
      if (isEditing) return;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;
      
      // 🆕 Ctrl+A: 전체 선택
      if (ctrlOrCmd && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        selectAll();
        return;
      }
      
      // 🆕 Escape: 선택 해제
      if (e.key === 'Escape') {
        e.preventDefault();
        clearSelection();
        return;
      }
      
      // 🆕 Delete/Backspace: 선택된 블록 삭제
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedBlockIds.length > 0) {
          e.preventDefault();
          deleteSelectedBlocks();
          return;
        }
        return;
      }
      
      // Ctrl+Z: 실행 취소
      if (ctrlOrCmd && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      
      // Ctrl+Shift+Z: 다시 실행
      if (ctrlOrCmd && e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        redo();
        return;
      }
      
      // Ctrl+Y: 다시 실행 (대체)
      if (ctrlOrCmd && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
        return;
      }
      
      // 🆕 Ctrl+C: 복사 (단일 또는 다중)
      if (ctrlOrCmd && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        if (selectionMode === 'multiple' && selectedBlockIds.length > 1) {
          copySelectedBlocks();
        } else if (selectedElement) {
          copyBlock(selectedElement.blockId);
        }
        return;
      }
      
      // 🆕 Ctrl+V: 붙여넣기 (단일 또는 다중)
      if (ctrlOrCmd && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        if (selectionMode === 'multiple') {
          pasteSelectedBlocks();
        } else {
          pasteBlock();
        }
        return;
      }
      
      // 🆕 Ctrl+X: 잘라내기 (단일 또는 다중)
      if (ctrlOrCmd && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        if (selectionMode === 'multiple' && selectedBlockIds.length > 1) {
          cutSelectedBlocks();
        } else if (selectedElement) {
          cutBlock(selectedElement.blockId);
        }
        return;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedElement, 
    copyBlock, 
    pasteBlock, 
    cutBlock, 
    undo, 
    redo, 
    previewMode,
    // 🆕 다중 선택 관련 의존성
    selectedBlockIds,
    selectionMode,
    selectAll,
    clearSelection,
    deleteSelectedBlocks,
    copySelectedBlocks,
    pasteSelectedBlocks,
    cutSelectedBlocks,
  ]);

  // 전역 드래그 이벤트 리스너
  useEffect(() => {
    if (previewMode) return;
    
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[draggable="true"]')) {
        const blockType = e.dataTransfer?.getData('blockType') as BlockType;
        if (blockType) {
          globalDraggingBlockType = blockType;
          setDraggingBlockType(blockType);
        }
      }
    };

    const handleDragEnd = () => {
      globalDraggingBlockType = null;
      setDraggingBlockType(null);
      setDragOverIndex(null);
    };

    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragend', handleDragEnd);

    return () => {
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('dragend', handleDragEnd);
    };
  }, [previewMode]);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (previewMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
    
    if (globalDraggingBlockType && draggingBlockType !== globalDraggingBlockType) {
      setDraggingBlockType(globalDraggingBlockType);
    } else if (!globalDraggingBlockType) {
      const draggedElement = document.querySelector('.dragging');
      if (draggedElement && currentPage) {
        const blockId = draggedElement.getAttribute('data-block-id');
        const block = currentPage.blocks.find(b => b.id === blockId);
        if (block && draggingBlockType !== block.type) {
          setDraggingBlockType(block.type);
        }
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent, index: number) => {
    if (previewMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const dropZone = dropZoneRefs.current.get(index);
    const relatedTarget = e.relatedTarget as Node;
    
    if (dropZone && relatedTarget && dropZone.contains(relatedTarget)) {
      return;
    }
    
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    if (previewMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setDragOverIndex(null);

    const blockType = e.dataTransfer.getData('blockType') as BlockType;
    const blockIndex = e.dataTransfer.getData('blockIndex');

    if (blockType && !blockIndex) {
      const newBlock = createBlockTemplate(blockType);
      addBlock(newBlock, index);
    } else if (blockIndex) {
      const startIndex = parseInt(blockIndex);
      reorderBlocks(startIndex, index);
    }

    globalDraggingBlockType = null;
    setDraggingBlockType(null);
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    if (previewMode) return;
    e.preventDefault();
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    if (previewMode) return;
    
    e.preventDefault();
    
    const blockType = e.dataTransfer.getData('blockType') as BlockType;
    
    if (blockType) {
      const newBlock = createBlockTemplate(blockType);
      addBlock(newBlock);
    }

    setDragOverIndex(null);
    globalDraggingBlockType = null;
    setDraggingBlockType(null);
  };

  const getPlaceholderHeight = () => {
    if (!draggingBlockType) return 120;
    return BLOCK_HEIGHTS[draggingBlockType] || 120;
  };

  // 🆕 요소 클릭 핸들러 (텍스트/이미지/버튼 등)
  const handleElementClick = (element: SelectedElement) => {
    setSelectedElement(element);
  };

  // 🆕 블록 클릭 핸들러 (다중 선택)
  const handleBlockClick = (e: React.MouseEvent, blockId: string) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;
    const shift = e.shiftKey;
    
    if (ctrlOrCmd) {
      // Ctrl+클릭: 추가/제거 토글
      e.preventDefault();
      selectBlock(blockId, 'add');
    } else if (shift) {
      // Shift+클릭: 범위 선택
      e.preventDefault();
      selectBlock(blockId, 'range');
    } else {
      // 일반 클릭: 단일 선택
      selectBlock(blockId, 'replace');
    }
  };

  // 🆕 캔버스 배경 클릭 (선택 해제)
  const handleCanvasClick = (e: React.MouseEvent) => {
    // 캔버스 자체를 클릭한 경우에만 선택 해제
    if (e.target === e.currentTarget) {
      clearSelection();
    }
  };

  // 🆕 드래그 선택 박스 시작
  const handleMouseDown = (e: React.MouseEvent) => {
    if (previewMode) return;
    
    // 빈 공간에서만 선택 박스 시작 (블록이나 드롭존이 아닌 곳)
    const target = e.target as HTMLElement;
    const isCanvas = target.classList.contains('viewport-canvas') || 
                     target.closest('.viewport-canvas')?.contains(target);
    const isBlock = target.closest('[data-block-id]');
    const isDropZone = target.classList.contains('drag-placeholder-active') ||
                       target.classList.contains('drag-placeholder-inactive');
    
    if (!isCanvas || isBlock || isDropZone) return;
    
    // 🆕 텍스트 선택 방지 - preventDefault 추가
    e.preventDefault();
    
    // 캔버스 기준 좌표 계산
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const startX = e.clientX - rect.left + canvas.scrollLeft;
    const startY = e.clientY - rect.top + canvas.scrollTop;
    
    isDraggingSelection.current = true;
    setIsSelecting(true);
    setSelectionBox({
      startX,
      startY,
      endX: startX,
      endY: startY,
    });
  };

  // 🆕 드래그 선택 박스 업데이트
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingSelection.current || !selectionBox || previewMode) return;
    
    // 🆕 텍스트 선택 방지
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left + canvas.scrollLeft;
    const endY = e.clientY - rect.top + canvas.scrollTop;
    
    setSelectionBox({
      ...selectionBox,
      endX,
      endY,
    });
  };

  // 🆕 드래그 선택 박스 종료
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDraggingSelection.current || !selectionBox || previewMode) return;
    
    isDraggingSelection.current = false;
    setIsSelecting(false);
    
    // Ctrl 키 확인 (기존 선택에 추가)
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;
    const mode = ctrlOrCmd ? 'add' : 'replace';
    
    // 선택 박스 내 블록들 선택
    selectBlocksInBox(selectionBox, mode);
    
    // 선택 박스 초기화
    setSelectionBox(null);
  };

  // 🆕 선택 박스 렌더링 헬퍼
  const renderSelectionBox = () => {
    if (!selectionBox || !isSelecting) return null;
    
    const left = Math.min(selectionBox.startX, selectionBox.endX);
    const top = Math.min(selectionBox.startY, selectionBox.endY);
    const width = Math.abs(selectionBox.endX - selectionBox.startX);
    const height = Math.abs(selectionBox.endY - selectionBox.startY);
    
    return (
      <div
        className="absolute pointer-events-none z-50"
        style={{
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          border: '2px solid rgb(59, 130, 246)',
          borderRadius: '4px',
        }}
      />
    );
  };

  if (!currentPage) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500">페이지를 선택하세요.</p>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full p-8" 
      onClick={!previewMode ? handleCanvasClick : undefined}
    >
      <div
        ref={canvasRef}
        className={`viewport-canvas bg-white rounded-lg shadow-lg overflow-hidden relative ${viewport} ${isSelecting ? 'selecting' : ''}`}
        onDragOver={handleCanvasDragOver}
        onDrop={handleCanvasDrop}
        onMouseDown={!previewMode ? handleMouseDown : undefined}
        onMouseMove={!previewMode ? handleMouseMove : undefined}
        onMouseUp={!previewMode ? handleMouseUp : undefined}
        style={{ cursor: isDraggingSelection.current ? 'crosshair' : 'default' }}
      >
        {/* 🆕 드래그 선택 박스 */}
        {renderSelectionBox()}
        
        <div className="min-h-screen">
          {currentPage.blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-300 m-8 rounded-lg">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 1 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-400 text-lg font-medium mb-2">블록을 드래그하여 시작하세요</p>
              <p className="text-gray-400 text-sm">좌측에서 블록을 선택하고 여기로 드래그하세요</p>
            </div>
          ) : (
            <>
              {!previewMode && (
                <div
                  ref={(el) => el && dropZoneRefs.current.set(0, el)}
                  onDragOver={(e) => handleDragOver(e, 0)}
                  onDragLeave={(e) => handleDragLeave(e, 0)}
                  onDrop={(e) => handleDrop(e, 0)}
                  className={`transition-all duration-200 ${
                    dragOverIndex === 0 
                      ? 'drag-placeholder-active' 
                      : 'drag-placeholder-inactive'
                  }`}
                  style={{
                    minHeight: dragOverIndex === 0 ? `${getPlaceholderHeight()}px` : '50px'
                  }}
                >
                  {dragOverIndex === 0 && (
                    <div className="drag-placeholder-content pointer-events-none">
                      <div className="text-center relative z-10">
                        <div className="text-base font-semibold mb-1">여기에 블록 추가</div>
                        {draggingBlockType && (
                          <div className="text-sm opacity-75">{draggingBlockType} 블록</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentPage.blocks.map((block, index) => (
                <div key={block.id}>
                  {/* 🆕 클릭 가능한 wrapper로 Ctrl+클릭, Shift+클릭 처리 */}
                  <div
                    className="block-wrapper"
                    onClickCapture={!previewMode ? (e) => {
                      // Ctrl 또는 Shift 키가 눌렸으면 블록 선택 모드
                      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
                      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;
                      const shift = e.shiftKey;
                      
                      if (ctrlOrCmd || shift) {
                        e.preventDefault();
                        e.stopPropagation();
                        handleBlockClick(e, block.id);
                      }
                    } : undefined}
                  >
                    <BlockRenderer 
                      block={block} 
                      isSelected={!previewMode && isBlockSelected(block.id)}
                      onClick={previewMode ? undefined : (element) => {
                        // 요소 클릭 시 (텍스트, 이미지, 버튼 등)
                        handleElementClick(element);
                      }}
                      onBlockClick={previewMode ? undefined : (e) => {
                        // 블록 자체 클릭 시 (빈 공간 클릭)
                        handleBlockClick(e, block.id);
                      }}
                    />
                  </div>
                  
                  {!previewMode && (
                    <div
                      ref={(el) => el && dropZoneRefs.current.set(index + 1, el)}
                      onDragOver={(e) => handleDragOver(e, index + 1)}
                      onDragLeave={(e) => handleDragLeave(e, index + 1)}
                      onDrop={(e) => handleDrop(e, index + 1)}
                      className={`transition-all duration-200 ${
                        dragOverIndex === index + 1
                          ? 'drag-placeholder-active' 
                          : 'drag-placeholder-inactive'
                      }`}
                      style={{
                        minHeight: dragOverIndex === index + 1 ? `${getPlaceholderHeight()}px` : '50px'
                      }}
                    >
                      {dragOverIndex === index + 1 && (
                        <div className="drag-placeholder-content pointer-events-none">
                          <div className="text-center relative z-10">
                            <div className="text-base font-semibold mb-1">여기에 블록 추가</div>
                            {draggingBlockType && (
                              <div className="text-sm opacity-75">{draggingBlockType} 블록</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}