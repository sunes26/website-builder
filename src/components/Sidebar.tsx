import { Layers, Settings } from 'lucide-react';
import { useState } from 'react';
import PropertiesPanel from './PropertiesPanel';
import { useBuilderStore } from '../store/builderStore';

type SidebarTab = 'properties' | 'layers';

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState<SidebarTab>('properties');
  const { selectedElementIds } = useBuilderStore();

  return (
    <aside className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* 탭 헤더 */}
      <div className="border-b border-gray-200 flex">
        <button
          onClick={() => setActiveTab('properties')}
          className={`
            flex-1 px-4 py-3 text-sm font-medium transition-colors
            ${activeTab === 'properties'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }
          `}
        >
          <div className="flex items-center justify-center space-x-2">
            <Settings size={16} />
            <span>속성</span>
          </div>
        </button>
        
        <button
          onClick={() => setActiveTab('layers')}
          className={`
            flex-1 px-4 py-3 text-sm font-medium transition-colors
            ${activeTab === 'layers'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }
          `}
        >
          <div className="flex items-center justify-center space-x-2">
            <Layers size={16} />
            <span>레이어</span>
          </div>
        </button>
      </div>

      {/* 탭 콘텐츠 */}
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
        
        {activeTab === 'layers' && (
          <div className="p-4">
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Layers size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">
                레이어가 없습니다
              </p>
              <p className="text-gray-400 text-xs mt-2">
                요소를 추가하면 여기에 표시됩니다<br />
                (Phase 6에서 구현 예정)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 푸터 정보 */}
      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>선택된 요소:</span>
            <span className="font-medium text-gray-700">
              {selectedElementIds.length}개
            </span>
          </div>
          <div className="flex justify-between">
            <span>Phase:</span>
            <span className="font-medium text-blue-600">
              1 (기본 구조)
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}