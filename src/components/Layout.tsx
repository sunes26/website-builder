import { useState, useEffect } from 'react';
import { Check, Clock } from 'lucide-react';
import LeftSidebar from './LeftSidebar';
import FloatingToolbar from './FloatingToolbar';
import ZoomControl from './ZoomControl';
import Canvas from '../Canvas'; // Canvas/index.tsx를 가리킴
import Sidebar from './Sidebar';
import NewProjectDialog from './NewProjectDialog';
import PreviewModal from './PreviewModal';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import ViewportSwitcher from './ViewportSwitcher';
import { useBuilderStore } from '../store/builderStore';
import { downloadHTMLFile } from '../utils/htmlExport';

export default function Layout() {
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const {
    currentPage,
    pages,
    projectName,
    cssClasses,
    keyframeAnimations,
    customBreakpoints,
    lastAutoSaved,
    autoSaveEnabled,
    toggleAutoSave,
  } = useBuilderStore();

  // 오토세이브 시간 표시
  const getAutoSaveText = () => {
    if (!lastAutoSaved) return '자동 저장 대기 중';

    const now = new Date();
    const diff = now.getTime() - lastAutoSaved.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (seconds < 60) return `${seconds}초 전 저장됨`;
    if (minutes < 60) return `${minutes}분 전 저장됨`;
    return lastAutoSaved.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  // Ctrl+K 또는 ? 키로 단축키 모달 열기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowShortcutsModal(true);
      }
      // ? 키 (Shift + /)
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setShowShortcutsModal(true);
      }
      // Esc로 닫기
      if (e.key === 'Escape' && showShortcutsModal) {
        setShowShortcutsModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showShortcutsModal]);

  return (
    <div className="flex h-full w-full bg-gray-50">
      {/* 좌측 사이드바 (페이지 + 레이어) */}
      <LeftSidebar onNewProject={() => setShowNewProjectDialog(true)} />

      {/* 중앙 캔버스 */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* 상단 네비게이션 */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* 프로젝트 이름 표시 */}
            <h1 className="text-lg font-semibold text-gray-800">
              {projectName}
            </h1>

            {/* 오토세이브 상태 표시 */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={toggleAutoSave}
                className={`
                  flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors
                  ${autoSaveEnabled
                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }
                `}
                title={autoSaveEnabled ? '자동 저장 활성화됨 (클릭하여 비활성화)' : '자동 저장 비활성화됨 (클릭하여 활성화)'}
              >
                {autoSaveEnabled ? (
                  <>
                    <Check size={14} />
                    <span>{getAutoSaveText()}</span>
                  </>
                ) : (
                  <>
                    <Clock size={14} />
                    <span>자동 저장 꺼짐</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Viewport Switcher (Phase 14) */}
            <ViewportSwitcher />

            <div className="w-px h-6 bg-gray-300" />

            <button
              onClick={() => setShowPreviewModal(true)}
              className="btn btn-secondary text-sm"
            >
              미리보기
            </button>
            <button
              onClick={() => downloadHTMLFile(pages, currentPage.id, projectName, cssClasses, keyframeAnimations, customBreakpoints)}
              className="btn btn-primary text-sm"
            >
              HTML 내보내기
            </button>
          </div>
        </header>

        {/* 캔버스 영역 */}
        <div className="flex-1 overflow-auto bg-gray-100 relative">
          <Canvas />

          {/* Figma 스타일 플로팅 툴바 */}
          <FloatingToolbar />

          {/* 줌 컨트롤 (Priority 0.1) */}
          <ZoomControl />
        </div>
      </main>

      {/* 우측 사이드바 */}
      <Sidebar />

      {/* 새 프로젝트 다이얼로그 (Phase 10) */}
      <NewProjectDialog
        isOpen={showNewProjectDialog}
        onClose={() => setShowNewProjectDialog(false)}
      />

      {/* 미리보기 모달 (Phase 11) */}
      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        page={currentPage}
      />

      {/* 키보드 단축키 모달 (Priority 0.3) */}
      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />
    </div>
  );
}