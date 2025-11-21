// src/components/CustomEdge.tsx
import type { EdgeProps } from 'reactflow';
import { EdgeLabelRenderer } from 'reactflow';
import { useState } from 'react';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  markerEnd,
}: EdgeProps) {
  const [isDragging, setIsDragging] = useState(false);

  // offset 적용하여 다른 경로 계산
  const offset = data?.offset || 0;
  
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;
  
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  const perpX = -dy / dist;
  const perpY = dx / dist;
  
  const offsetDistance = offset * 100;
  
  // 라벨 위치 오프셋 (드래그로 조정된 값)
  const labelOffsetX = data?.labelOffset?.x || 0;
  const labelOffsetY = data?.labelOffset?.y || 0;
  
  // 🆕 라벨 위치: 중앙 + offset (라벨 오프셋 적용)
  const labelX = centerX + perpX * offsetDistance + labelOffsetX;
  const labelY = centerY + perpY * offsetDistance + labelOffsetY;
  
  // 🆕 연결선을 두 부분으로 나눔: source → label → target
  // 첫 번째 곡선: source → label
  const midPoint1X = (sourceX + labelX) / 2;
  const midPoint1Y = (sourceY + labelY) / 2;
  
  // 두 번째 곡선: label → target
  const midPoint2X = (labelX + targetX) / 2;
  const midPoint2Y = (labelY + targetY) / 2;
  
  // 🆕 경로: source → label → target (라벨을 정확히 지나감)
  const customPath = `
    M ${sourceX},${sourceY} 
    Q ${midPoint1X},${midPoint1Y} ${labelX},${labelY}
    Q ${midPoint2X},${midPoint2Y} ${targetX},${targetY}
  `.trim();
  
  // 라벨 위치
  const customLabelX = labelX;
  const customLabelY = labelY;

  return (
    <>
      {/* Edge 선 */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={customPath}
        strokeWidth={2}
        stroke={data?.label ? '#3b82f6' : '#9ca3af'}
        fill="none"
        markerEnd={markerEnd}
      />
      
      {/* 🆕 드래그 가능한 라벨 (EdgeLabelRenderer 사용) */}
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            data-edge-id={id}
            className="custom-edge-label"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${customLabelX}px, ${customLabelY}px)`,
              pointerEvents: 'all',
              cursor: isDragging ? 'grabbing' : 'grab',
              zIndex: 1000,
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsDragging(true);
              
              const startX = e.clientX;
              const startY = e.clientY;
              const startOffsetX = labelOffsetX;
              const startOffsetY = labelOffsetY;

              const handleMouseMove = (moveEvent: MouseEvent) => {
                const deltaX = moveEvent.clientX - startX;
                const deltaY = moveEvent.clientY - startY;
                
                // 라벨 위치 업데이트를 부모로 전달
                const event = new CustomEvent('edge-label-drag', {
                  detail: {
                    edgeId: id,
                    labelOffset: {
                      x: startOffsetX + deltaX,
                      y: startOffsetY + deltaY,
                    },
                  },
                });
                window.dispatchEvent(event);
              };

              const handleMouseUp = () => {
                setIsDragging(false);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                
                // 드래그 종료 이벤트 발생
                const event = new CustomEvent('edge-label-drag-end', {
                  detail: { edgeId: id },
                });
                window.dispatchEvent(event);
              };

              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            <div
              style={{
                background: 'white',
                border: '2px solid #3b82f6',
                borderRadius: '6px',
                padding: '6px 12px',
                boxShadow: isDragging 
                  ? '0 4px 12px rgba(59, 130, 246, 0.3)' 
                  : '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: isDragging ? 'none' : 'box-shadow 0.2s',
                userSelect: 'none',
              }}
            >
              {/* 라벨 텍스트 */}
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#3b82f6',
                  whiteSpace: 'nowrap',
                }}
              >
                {data.label}
              </span>
              
              {/* 트리거 타입 아이콘 */}
              {data.triggerType === 'button' && (
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#3b82f6',
                  }}
                  title="버튼 액션"
                />
              )}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
      
      {/* 호버 시 표시할 추가 정보 */}
      {data?.triggerBlockId && (
        <title>
          트리거: {data.triggerType === 'button' ? '버튼' : '링크'}
          {data.label ? ` - "${data.label}"` : ''}
          {data.totalCount > 1 ? ` (${data.totalCount}개 중 하나)` : ''}
        </title>
      )}
    </>
  );
}
