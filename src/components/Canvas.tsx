import { useBuilderStore } from '../store/builderStore';

export default function Canvas() {
  const { currentTool, elements } = useBuilderStore();

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <svg
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
          className="border border-gray-200"
          style={{ maxWidth: '100%', height: 'auto' }}
        >
          {/* 배경 그리드 (선택적) */}
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

          {/* Phase 2에서 요소들이 여기에 렌더링됩니다 */}
          {elements.length === 0 && (
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
                좌측 도구바에서 도구를 선택하세요
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