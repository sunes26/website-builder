import { useState } from 'react';
import { FileText, Layers } from 'lucide-react';
import LayerPanel from './LayerPanel';
import PagePanel from './PagePanel';
import BuilderMenu from './BuilderMenu';

/**
 * Figma 스타일 좌측 사이드바 (페이지 + 레이어)
 */
interface LeftSidebarProps {
  onNewProject: () => void;
}

export default function LeftSidebar({ onNewProject }: LeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<'pages' | 'layers'>('layers');

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* 로고 & Builder 메뉴 */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <BuilderMenu onNewProject={onNewProject} />
        </div>
      </div>

      {/* 탭 전환 */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('pages')}
          className={`
            flex-1 px-4 py-2.5 text-xs font-medium transition-colors
            ${activeTab === 'pages'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }
          `}
        >
          <div className="flex items-center justify-center gap-1.5">
            <FileText size={14} />
            <span>페이지</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('layers')}
          className={`
            flex-1 px-4 py-2.5 text-xs font-medium transition-colors
            ${activeTab === 'layers'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }
          `}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Layers size={14} />
            <span>레이어</span>
          </div>
        </button>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'pages' && <PagePanel />}
        {activeTab === 'layers' && <LayerPanel />}
      </div>
    </aside>
  );
}
