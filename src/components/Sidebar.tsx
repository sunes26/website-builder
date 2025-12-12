import { Settings, Package, Palette, Film, Sliders, History, Droplet, Sparkles } from 'lucide-react';
import { useState } from 'react';
import PropertiesPanel from './PropertiesPanel';
import ComponentPanel from './ComponentPanel';
import ClassPanel from './ClassPanel';
import KeyframePanel from './KeyframePanel';
import BreakpointManager from './BreakpointManager';
import HistoryPanel from './HistoryPanel';
import ColorPalettePanel from './ColorPalettePanel';
import DesignTokensPanel from './DesignTokensPanel';
import { useBuilderStore } from '../store/builderStore';

type SidebarTab = 'properties' | 'components' | 'colors' | 'tokens' | 'classes' | 'animations' | 'breakpoints' | 'history';

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState<SidebarTab>('properties');
  const { selectedElementIds, elements } = useBuilderStore();

  const tabs = [
    { id: 'properties' as const, icon: Settings, label: '속성' },
    { id: 'components' as const, icon: Package, label: '컴포넌트' },
    { id: 'colors' as const, icon: Droplet, label: '색상' },
    { id: 'tokens' as const, icon: Sparkles, label: '디자인 토큰' },
    { id: 'classes' as const, icon: Palette, label: '클래스' },
    { id: 'animations' as const, icon: Film, label: '애니메이션' },
    { id: 'breakpoints' as const, icon: Sliders, label: '반응형' },
    { id: 'history' as const, icon: History, label: '히스토리' },
  ];

  return (
    <aside className="w-80 flex-shrink-0 bg-white border-l border-gray-200 flex">
      {/* 세로 탭바 */}
      <div className="w-14 flex-shrink-0 border-r border-gray-200 flex flex-col bg-gray-50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group relative w-full h-14 flex items-center justify-center
                transition-all duration-200
                ${isActive
                  ? 'bg-white text-blue-600 border-l-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
              title={tab.label}
            >
              <Icon size={20} />

              {/* 툴팁 */}
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 탭 콘텐츠 */}
      <div className="flex-1 flex flex-col">
        {/* 탭 제목 */}
        <div className="border-b border-gray-200 px-4 py-3 bg-white">
          <h2 className="text-sm font-semibold text-gray-800">
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {activeTab === 'properties' && (
            <div className="p-4">
              {selectedElementIds.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Settings size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    요소를 선택하세요
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    캔버스에서 요소를 클릭하거나<br />
                    좌측 도구바에서 도구를 선택하세요
                  </p>
                </div>
              ) : (
                <PropertiesPanel />
              )}
            </div>
          )}

          {activeTab === 'components' && <ComponentPanel />}

          {activeTab === 'colors' && <ColorPalettePanel />}

          {activeTab === 'tokens' && <DesignTokensPanel />}

          {activeTab === 'classes' && <ClassPanel />}

          {activeTab === 'animations' && <KeyframePanel />}

          {activeTab === 'breakpoints' && <BreakpointManager />}

          {activeTab === 'history' && <HistoryPanel />}
        </div>

        {/* 푸터 정보 */}
        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>총 요소:</span>
              <span className="font-medium text-gray-700">
                {elements.length}개
              </span>
            </div>
            <div className="flex justify-between">
              <span>선택됨:</span>
              <span className="font-medium text-blue-600">
                {selectedElementIds.length}개
              </span>
            </div>
            <div className="flex justify-between">
              <span>Phase:</span>
              <span className="font-medium text-green-600">
                15 (스타일 시스템)
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}