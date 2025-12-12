import { useEffect, useRef, useState } from 'react';
import { useBuilderStore } from '../store/builderStore';

/**
 * 캔버스 줌 & 팬 훅 (Priority 0.1)
 *
 * 마우스 휠로 줌, 스페이스바 + 드래그로 팬 기능 제공
 */
export function useCanvasZoom(containerRef: React.RefObject<HTMLElement>) {
  const { canvasZoom, canvasPanX, canvasPanY, setCanvasZoom, setCanvasPan, zoomIn, zoomOut, resetZoom } = useBuilderStore();
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const panStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  // 마우스 휠로 줌
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Ctrl/Cmd + 휠: 줌
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();

        const delta = -e.deltaY * 0.001;
        const newZoom = Math.max(0.1, Math.min(5, canvasZoom + delta));
        setCanvasZoom(newZoom);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [containerRef, canvasZoom, setCanvasZoom]);

  // 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 스페이스바
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setIsSpacePressed(true);
      }

      // Ctrl/Cmd + 0: 리셋
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        resetZoom();
      }

      // Ctrl/Cmd + =: 줌 인
      if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        zoomIn();
      }

      // Ctrl/Cmd + -: 줌 아웃
      if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        zoomOut();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setIsPanning(false);
        panStartRef.current = null;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [resetZoom, zoomIn, zoomOut]);

  // 스페이스바 + 드래그로 팬
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (isSpacePressed) {
        e.preventDefault();
        setIsPanning(true);
        panStartRef.current = {
          x: e.clientX,
          y: e.clientY,
          panX: canvasPanX,
          panY: canvasPanY,
        };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning && panStartRef.current) {
        const deltaX = e.clientX - panStartRef.current.x;
        const deltaY = e.clientY - panStartRef.current.y;

        setCanvasPan(
          panStartRef.current.panX + deltaX,
          panStartRef.current.panY + deltaY
        );
      }
    };

    const handleMouseUp = () => {
      if (isPanning) {
        setIsPanning(false);
        panStartRef.current = null;
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [containerRef, isSpacePressed, isPanning, canvasPanX, canvasPanY, setCanvasPan]);

  // 커서 스타일 변경
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (isSpacePressed) {
      container.style.cursor = isPanning ? 'grabbing' : 'grab';
    } else {
      container.style.cursor = '';
    }
  }, [containerRef, isSpacePressed, isPanning]);

  return {
    canvasZoom,
    canvasPanX,
    canvasPanY,
    isPanning,
    isSpacePressed,
  };
}
