// src/components/PreviewNavBar.tsx
import { ChevronLeft, ChevronRight, Home, X, Monitor, Tablet, Smartphone } from 'lucide-react';
import { useBuilderStore } from '@/store/builderStore';
import type { ViewportType } from '@/types';

export default function PreviewNavBar() {
  const { 
    currentPage,
    previewHistory,
    previewCurrentIndex,
    viewport,
    togglePreviewMode,
    previewGoBack,
    previewGoForward,
    previewGoHome,
    setViewport,
  } = useBuilderStore();
  
  const canGoBack = previewCurrentIndex > 0;
  const canGoForward = previewCurrentIndex < previewHistory.length - 1;
  
  const viewportOptions: Array<{ type: ViewportType; icon: React.ReactNode; label: string }> = [
    { type: 'desktop', icon: <Monitor className="w-4 h-4" />, label: '데스크톱' },
    { type: 'tablet', icon: <Tablet className="w-4 h-4" />, label: '태블릿' },
    { type: 'mobile', icon: <Smartphone className="w-4 h-4" />, label: '모바일' },
  ];

  return (
    <div className="preview-navbar">
      <div className="h-full flex items-center justify-between px-6">
        {/* 좌측: 네비게이션 컨트롤 */}
        <div className="flex items-center gap-2">
          {/* 뒤로가기 */}
          <button
            onClick={previewGoBack}
            disabled={!canGoBack}
            title="뒤로가기"
            className={`p-2 rounded-lg transition-colors ${
              canGoBack
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-gray-300 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* 앞으로가기 */}
          <button
            onClick={previewGoForward}
            disabled={!canGoForward}
            title="앞으로가기"
            className={`p-2 rounded-lg transition-colors ${
              canGoForward
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-gray-300 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* 홈 버튼 */}
          <button
            onClick={previewGoHome}
            title="홈으로"
            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Home className="w-5 h-5" />
          </button>

          {/* 구분선 */}
          <div className="h-6 w-px bg-gray-300 mx-2" />

          {/* 현재 페이지 이름 */}
          <div className="px-3 py-1.5 bg-gray-100 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              {currentPage?.name || '페이지'}
            </span>
          </div>
        </div>

        {/* 중앙: 뷰포트 전환 */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {viewportOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => setViewport(option.type)}
              title={option.label}
              className={`p-2 rounded-md transition-all ${
                viewport === option.type
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {option.icon}
            </button>
          ))}
        </div>

        {/* 우측: 종료 버튼 */}
        <button
          onClick={togglePreviewMode}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white 
                   bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors"
        >
          <X className="w-4 h-4" />
          미리보기 종료
        </button>
      </div>
    </div>
  );
}