import { 
  MousePointer2, 
  Square, 
  Circle, 
  Triangle, 
  Minus, 
  ArrowRight,
  Type,
  Image as ImageIcon
} from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import type { ToolMode } from '../types';

interface Tool {
  id: ToolMode;
  icon: React.ReactNode;
  label: string;
  shortcut: string;
}

const tools: Tool[] = [
  {
    id: 'select',
    icon: <MousePointer2 size={20} />,
    label: '선택',
    shortcut: 'V',
  },
  {
    id: 'rectangle',
    icon: <Square size={20} />,
    label: '사각형',
    shortcut: 'R',
  },
  {
    id: 'circle',
    icon: <Circle size={20} />,
    label: '원',
    shortcut: 'O',
  },
  {
    id: 'triangle',
    icon: <Triangle size={20} />,
    label: '삼각형',
    shortcut: '',
  },
  {
    id: 'line',
    icon: <Minus size={20} />,
    label: '직선',
    shortcut: 'L',
  },
  {
    id: 'arrow',
    icon: <ArrowRight size={20} />,
    label: '화살표',
    shortcut: '',
  },
  {
    id: 'text',
    icon: <Type size={20} />,
    label: '텍스트',
    shortcut: 'T',
  },
  {
    id: 'image',
    icon: <ImageIcon size={20} />,
    label: '이미지',
    shortcut: 'I',
  },
];

export default function Toolbar() {
  const { currentTool, setCurrentTool } = useBuilderStore();

  const handleToolClick = (toolId: ToolMode) => {
    setCurrentTool(toolId);
  };

  return (
    <aside className="w-16 bg-white border-r border-gray-200 flex flex-col py-4 no-select">
      {/* 로고 영역 */}
      <div className="px-4 mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">F</span>
        </div>
      </div>

      {/* 도구 버튼들 */}
      <nav className="flex-1 space-y-1 px-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleToolClick(tool.id)}
            className={`
              btn-icon w-full relative group
              ${currentTool === tool.id ? 'active' : 'text-gray-600'}
            `}
            title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}`}
            aria-label={tool.label}
          >
            {tool.icon}
            
            {/* 툴팁 */}
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded 
              opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              {tool.label}
              {tool.shortcut && (
                <span className="ml-2 text-gray-400">({tool.shortcut})</span>
              )}
            </span>
          </button>
        ))}
      </nav>

      {/* 하단 영역 (추후 설정 등) */}
      <div className="px-2 pt-4 border-t border-gray-200">
        <button 
          className="btn-icon w-full text-gray-600"
          title="설정"
          aria-label="설정"
        >
          <Circle size={20} />
        </button>
      </div>
    </aside>
  );
}