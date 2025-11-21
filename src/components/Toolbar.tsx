// src/components/Toolbar.tsx
import { Monitor, Tablet, Smartphone, Eye, Upload, Copy, Scissors, Clipboard, Undo2, Redo2 } from 'lucide-react';
import { useBuilderStore } from '@/store/builderStore';

export default function Toolbar() {
  const { 
    activeTab, 
    setActiveTab, 
    viewport, 
    setViewport, 
    previewMode, 
    togglePreviewMode,
    selectedElement,  // 🔥 수정: selectedBlockId → selectedElement
    copyBlock,
    pasteBlock,
    cutBlock,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useBuilderStore();

  const handleCopy = () => {
    if (selectedElement) {  // 🔥 수정
      copyBlock(selectedElement.blockId);  // 🔥 수정
    }
  };

  const handleCut = () => {
    if (selectedElement) {  // 🔥 수정
      cutBlock(selectedElement.blockId);  // 🔥 수정
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* 좌측: 탭 */}
        <div className="flex items-center space-x-8">
          <button
            onClick={() => setActiveTab('editor')}
            className={`text-sm font-medium px-1 py-4 transition-colors ${
              activeTab === 'editor'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            페이지 에디터
          </button>
          <button
            onClick={() => setActiveTab('mindmap')}
            className={`text-sm font-medium px-1 py-4 transition-colors ${
              activeTab === 'mindmap'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            사이트 구조
          </button>
        </div>

        {/* 중앙: 복사/붙여넣기/잘라내기 + Undo/Redo */}
        {activeTab === 'editor' && !previewMode && (
          <div className="flex items-center gap-1">
            {/* 복사/붙여넣기/잘라내기 */}
            <button
              onClick={handleCopy}
              disabled={!selectedElement}  // 🔥 수정
              className={`p-2 rounded-lg transition-colors ${
                selectedElement  // 🔥 수정
                  ? 'text-gray-700 hover:bg-white hover:shadow-sm' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              title="복사 (Ctrl+C)"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button
              onClick={pasteBlock}
              className="p-2 rounded-lg text-gray-700 hover:bg-white hover:shadow-sm transition-colors"
              title="붙여넣기 (Ctrl+V)"
            >
              <Clipboard className="w-5 h-5" />
            </button>
            <button
              onClick={handleCut}
              disabled={!selectedElement}  // 🔥 수정
              className={`p-2 rounded-lg transition-colors ${
                selectedElement  // 🔥 수정
                  ? 'text-gray-700 hover:bg-white hover:shadow-sm' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              title="잘라내기 (Ctrl+X)"
            >
              <Scissors className="w-5 h-5" />
            </button>

            {/* 구분선 */}
            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Undo/Redo */}
            <button
              onClick={undo}
              disabled={!canUndo()}
              className={`p-2 rounded-lg transition-colors ${
                canUndo()
                  ? 'text-gray-700 hover:bg-white hover:shadow-sm' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              title="실행 취소 (Ctrl+Z)"
            >
              <Undo2 className="w-5 h-5" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo()}
              className={`p-2 rounded-lg transition-colors ${
                canRedo()
                  ? 'text-gray-700 hover:bg-white hover:shadow-sm' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              title="다시 실행 (Ctrl+Shift+Z 또는 Ctrl+Y)"
            >
              <Redo2 className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* 우측: 뷰포트 + 미리보기/게시 */}
        <div className="flex items-center space-x-4">
          {/* 뷰포트 선택 (편집 모드에서만) */}
          {activeTab === 'editor' && !previewMode && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewport('desktop')}
                className={`p-2 rounded-lg transition-colors ${
                  viewport === 'desktop'
                    ? 'text-gray-600 bg-gray-100'
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
                title="데스크톱"
              >
                <Monitor className="w-6 h-6" />
              </button>
              <button
                onClick={() => setViewport('tablet')}
                className={`p-2 rounded-lg transition-colors ${
                  viewport === 'tablet'
                    ? 'text-gray-600 bg-gray-100'
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
                title="태블릿"
              >
                <Tablet className="w-6 h-6" />
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`p-2 rounded-lg transition-colors ${
                  viewport === 'mobile'
                    ? 'text-gray-600 bg-gray-100'
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
                title="모바일"
              >
                <Smartphone className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* 미리보기/게시 */}
          <button
            onClick={togglePreviewMode}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
              previewMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <Eye className="w-4 h-4" />
            {previewMode ? '편집 모드로' : '미리보기'}
          </button>
          <button className="flex items-center gap-2 text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Upload className="w-4 h-4" />
            게시하기
          </button>
        </div>
      </div>
    </nav>
  );
}