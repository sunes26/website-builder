import {
  MousePointer2,
  Square,
  Circle,
  Triangle,
  Minus,
  ArrowRight,
  Type,
  Image as ImageIcon,
} from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import type { ToolMode } from '../types';

/**
 * Figma 스타일 플로팅 툴바 (하단 중앙)
 */

interface Tool {
  id: ToolMode;
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
}

const tools: Tool[] = [
  {
    id: 'select',
    icon: <MousePointer2 size={18} />,
    label: '선택',
    shortcut: 'V',
  },
  {
    id: 'rectangle',
    icon: <Square size={18} />,
    label: '사각형',
    shortcut: 'R',
  },
  {
    id: 'circle',
    icon: <Circle size={18} />,
    label: '원',
    shortcut: 'O',
  },
  {
    id: 'triangle',
    icon: <Triangle size={18} />,
    label: '삼각형',
  },
  {
    id: 'line',
    icon: <Minus size={18} />,
    label: '직선',
    shortcut: 'L',
  },
  {
    id: 'arrow',
    icon: <ArrowRight size={18} />,
    label: '화살표',
  },
  {
    id: 'text',
    icon: <Type size={18} />,
    label: '텍스트',
    shortcut: 'T',
  },
  {
    id: 'image',
    icon: <ImageIcon size={18} />,
    label: '이미지',
    shortcut: 'I',
  },
];

export default function FloatingToolbar() {
  const { currentTool, setCurrentTool } = useBuilderStore();

  const handleToolClick = (toolId: ToolMode) => {
    setCurrentTool(toolId);
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 no-select">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 px-2 py-2">
        <div className="flex items-center gap-1">
          {tools.map((tool, index) => (
            <div key={tool.id} className="flex items-center">
              {/* 구분선: 선택 도구 다음 */}
              {index === 1 && (
                <div className="w-px h-6 bg-gray-200 mx-1" />
              )}

              <button
                onClick={() => handleToolClick(tool.id)}
                className={`
                  group relative p-2.5 rounded-lg transition-all
                  ${currentTool === tool.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
                title={tool.label}
                aria-label={tool.label}
              >
                {tool.icon}

                {/* 툴팁 */}
                <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1
                  bg-gray-800 text-white text-xs rounded whitespace-nowrap
                  opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {tool.label}
                  {tool.shortcut && (
                    <span className="ml-1.5 text-gray-400">({tool.shortcut})</span>
                  )}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
