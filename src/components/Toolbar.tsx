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
    selectedElement,
    copyBlock,
    pasteBlock,
    cutBlock,
    undo,
    redo,
    canUndo,
    canRedo,
    
    // 🆕 다중 선택 관련
    selectedBlockIds,
    selectionMode,
    copySelectedBlocks,
    pasteSelectedBlocks,
    cutSelectedBlocks,
  } = useBuilderStore();

  // 🆕 복사 핸들러 (단일/다중 자동 선택)
  const handleCopy = () => {
    if (selectionMode === 'multiple' && selectedBlockIds.length > 1) {
      copySelectedBlocks();
    } else if (selectedElement) {
      copyBlock(selectedElement.blockId);
    }
  };

  // 🆕 잘라내기 핸들러 (단일/다중 자동 선택)
  const handleCut = () => {
    if (selectionMode === 'multiple' && selectedBlockIds.length > 1) {
      cutSelectedBlocks();
    } else if (selectedElement) {
      cutBlock(selectedElement.blockId);
    }
  };

  // 🆕 붙여넣기 핸들러 (단일/다중 자동 선택)
  const handlePaste = () => {
    if (selectionMode === 'multiple') {
      pasteSelectedBlocks();
    } else {
      pasteBlock();
    }
  };

  // 🆕 선택 가능 여부 (요소 선택 또는 다중 블록 선택)
  const hasSelection = selectedElement !== null || selectedBlockIds.length > 0;

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

        {/* 중앙: 복사/붙여넣기/잘라내기 + Undo/Redo + 선택 개수 배지 🆕 */}
        {activeTab === 'editor' && !previewMode && (
          <div className="flex items-center gap-1">
            {/* 🆕 선택 개수 배지 */}
            {selectedBlockIds.length > 1 && (
              <div className="mr-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                {selectedBlockIds.length}개 선택됨
              </div>
            )}

            {/* 복사/붙여넣기/잘라내기 */}
            <button
              onClick={handleCopy}
              disabled={!hasSelection}
              className={`p-2 rounded-lg transition-colors ${
                hasSelection
                  ? 'text-gray-700 hover:bg-white hover:shadow-sm' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              title={`복사 (Ctrl+C)${selectedBlockIds.length > 1 ? ` - ${selectedBlockIds.length}개` : ''}`}
            >
              <Copy className="w-5 h-5" />
            </button>
            <button
              onClick={handlePaste}
              className="p-2 rounded-lg text-gray-700 hover:bg-white hover:shadow-sm transition-colors"
              title="붙여넣기 (Ctrl+V)"
            >
              <Clipboard className="w-5 h-5" />
            </button>
            <button
              onClick={handleCut}
              disabled={!hasSelection}
              className={`p-2 rounded-lg transition-colors ${
                hasSelection
                  ? 'text-gray-700 hover:bg-white hover:shadow-sm' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              title={`잘라내기 (Ctrl+X)${selectedBlockIds.length > 1 ? ` - ${selectedBlockIds.length}개` : ''}`}
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