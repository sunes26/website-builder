import { useState, useCallback } from 'react';
import type { CanvasElement, Shape } from '../types';

interface SelectionBoxProps {
  element: CanvasElement;
  onResize?: (newSize: { width: number; height: number }) => void;
  onRotate?: (newRotation: number) => void;
}

export default function SelectionBox({
  element,
  onResize: _onResize,
  onRotate: _onRotate,
}: SelectionBoxProps) {
  const [_isResizing, setIsResizing] = useState(false);
  const [_activeHandle, setActiveHandle] = useState<string | null>(null);

  // Shape 타입만 크기 조절 가능
  const canResize = element.type === 'shape';
  const shape = canResize ? (element as Shape) : null;

  if (!shape) return null;

  const { position, size } = shape;
  const padding = 2;

  // 리사이즈 핸들 위치 계산
  const handles = [
    { id: 'nw', x: position.x - padding, y: position.y - padding, cursor: 'nw-resize' },
    { id: 'n', x: position.x + size.width / 2 - 4, y: position.y - padding, cursor: 'n-resize' },
    { id: 'ne', x: position.x + size.width + padding, y: position.y - padding, cursor: 'ne-resize' },
    { id: 'e', x: position.x + size.width + padding, y: position.y + size.height / 2 - 4, cursor: 'e-resize' },
    { id: 'se', x: position.x + size.width + padding, y: position.y + size.height + padding, cursor: 'se-resize' },
    { id: 's', x: position.x + size.width / 2 - 4, y: position.y + size.height + padding, cursor: 's-resize' },
    { id: 'sw', x: position.x - padding, y: position.y + size.height + padding, cursor: 'sw-resize' },
    { id: 'w', x: position.x - padding, y: position.y + size.height / 2 - 4, cursor: 'w-resize' },
  ];

  // 회전 핸들 위치
  const rotateHandle = {
    x: position.x + size.width / 2 - 4,
    y: position.y - 24,
  };

  const handleResizeStart = useCallback((e: React.MouseEvent, handleId: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setActiveHandle(handleId);
    // 실제 리사이즈 로직은 Phase 8에서 구현
  }, []);

  const handleRotateStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // 회전 로직은 Phase 8에서 구현
  }, []);

  return (
    <g className="selection-box">
      {/* 선택 테두리 */}
      <rect
        x={position.x - padding}
        y={position.y - padding}
        width={size.width + padding * 2}
        height={size.height + padding * 2}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
        strokeDasharray="none"
        pointerEvents="none"
      />

      {/* 리사이즈 핸들 */}
      {handles.map((handle) => (
        <rect
          key={handle.id}
          x={handle.x}
          y={handle.y}
          width="8"
          height="8"
          fill="white"
          stroke="#3b82f6"
          strokeWidth="2"
          cursor={handle.cursor}
          onMouseDown={(e) => handleResizeStart(e, handle.id)}
          style={{ pointerEvents: 'all' }}
        />
      ))}

      {/* 회전 핸들 */}
      <g>
        {/* 회전 핸들로 연결되는 선 */}
        <line
          x1={position.x + size.width / 2}
          y1={position.y - padding}
          x2={position.x + size.width / 2}
          y2={position.y - 20}
          stroke="#3b82f6"
          strokeWidth="2"
          pointerEvents="none"
        />
        
        {/* 회전 핸들 */}
        <circle
          cx={rotateHandle.x + 4}
          cy={rotateHandle.y + 4}
          r="6"
          fill="white"
          stroke="#3b82f6"
          strokeWidth="2"
          cursor="grab"
          onMouseDown={handleRotateStart}
          style={{ pointerEvents: 'all' }}
        />
        
        {/* 회전 아이콘 (간단한 화살표) */}
        <path
          d={`M ${rotateHandle.x + 2} ${rotateHandle.y + 4} 
              L ${rotateHandle.x + 6} ${rotateHandle.y + 2} 
              L ${rotateHandle.x + 6} ${rotateHandle.y + 6} Z`}
          fill="#3b82f6"
          pointerEvents="none"
        />
      </g>
    </g>
  );
}