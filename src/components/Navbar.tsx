import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { useBuilderStore } from '@/store/builderStore';
import type { ViewportType } from '@/types';

export default function Navbar() {
  const { activeTab, viewport, setActiveTab, setViewport } = useBuilderStore();

  const viewportOptions: Array<{ type: ViewportType; icon: React.ReactNode; label: string }> = [
    { type: 'desktop', icon: <Monitor className="w-5 h-5" />, label: '데스크톱' },
    { type: 'tablet', icon: <Tablet className="w-5 h-5" />, label: '태블릿' },
    { type: 'mobile', icon: <Smartphone className="w-5 h-5" />, label: '모바일' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 flex-shrink-0">
      <div className="flex items-center justify-between h-16 px-6">
        {/* 탭 전환 */}
        <div className="flex items-center space-x-8">
          <button
            onClick={() => setActiveTab('editor')}
            className={`text-sm font-medium px-1 py-4 ${
              activeTab === 'editor'
                ? 'tab-active'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            페이지 에디터
          </button>
          <button
            onClick={() => setActiveTab('mindmap')}
            className={`text-sm font-medium px-1 py-4 ${
              activeTab === 'mindmap'
                ? 'tab-active'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            사이트 구조
          </button>
        </div>

        {/* 반응형 뷰포트 토글 (에디터 탭에서만 표시) */}
        {activeTab === 'editor' && (
          <div className="flex items-center space-x-2">
            {viewportOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => setViewport(option.type)}
                title={option.label}
                className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                  viewport === option.type
                    ? 'text-gray-600 bg-gray-100'
                    : 'text-gray-400'
                }`}
              >
                {option.icon}
              </button>
            ))}
          </div>
        )}

        {/* 우측 액션 버튼 */}
        <div className="flex items-center space-x-4">
          <button className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
            미리보기
          </button>
          <button className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            게시하기
          </button>
        </div>
      </div>
    </nav>
  );
}
