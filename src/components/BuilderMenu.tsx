import { useState, useRef } from 'react';
import {
  ChevronDown,
  FilePlus,
  Save,
  FolderOpen,
  Download,
  Upload,
  Copy,
  FileEdit,
} from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import { getProjectMetadataList } from '../utils/storageUtils';

/**
 * Builder 드롭다운 메뉴 컴포넌트
 *
 * F 로고 옆에 위치하며 프로젝트 관련 모든 기능 제공
 */
interface BuilderMenuProps {
  onNewProject: () => void;
}

export default function BuilderMenu({ onNewProject }: BuilderMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showProjectList, setShowProjectList] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    projectName,
    setProjectName,
    saveProject,
    loadProject,
    exportProject,
    importProject,
    duplicateProject,
    lastSaved,
    isSaving,
  } = useBuilderStore();

  const projects = getProjectMetadataList();

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await importProject(file);
      setShowMenu(false);
      setShowProjectList(false);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRename = () => {
    const newName = prompt('새 프로젝트 이름을 입력하세요:', projectName);
    if (newName && newName.trim() !== '') {
      setProjectName(newName.trim());
      setShowMenu(false);
    }
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '저장 안됨';
    const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    if (seconds < 60) return '방금 저장됨';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전 저장`;
    const hours = Math.floor(seconds / 3600);
    return `${hours}시간 전 저장`;
  };

  return (
    <div className="relative">
      {/* Builder 버튼 */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center space-x-1.5 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">Builder</span>
        <ChevronDown
          size={14}
          className={`text-gray-500 transition-transform ${
            showMenu ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* 드롭다운 메뉴 */}
      {showMenu && (
        <>
          {/* 배경 클릭 시 닫기 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setShowMenu(false);
              setShowProjectList(false);
            }}
          />

          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
            {/* 저장 상태 표시 */}
            <div className="px-4 pb-2 mb-2 border-b border-gray-100">
              <div className="text-xs text-gray-500">
                {isSaving ? '저장 중...' : formatLastSaved()}
              </div>
            </div>

            {/* 새 프로젝트 */}
            <button
              onClick={() => {
                onNewProject();
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700"
            >
              <FilePlus size={16} />
              <span>새 프로젝트</span>
            </button>

            {/* 저장 */}
            <button
              onClick={() => {
                saveProject();
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700"
            >
              <Save size={16} />
              <span className="flex-1">프로젝트 저장</span>
              <span className="text-xs text-gray-400">Ctrl+S</span>
            </button>

            {/* 프로젝트 이름 변경 */}
            <button
              onClick={handleRename}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700"
            >
              <FileEdit size={16} />
              <span>프로젝트 이름 변경</span>
            </button>

            <div className="border-t border-gray-200 my-2" />

            {/* 프로젝트 열기 */}
            <button
              onClick={() => setShowProjectList(!showProjectList)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700"
            >
              <FolderOpen size={16} />
              <span className="flex-1">프로젝트 열기</span>
              <ChevronDown
                size={14}
                className={`transition-transform ${
                  showProjectList ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* 프로젝트 목록 */}
            {showProjectList && (
              <div className="max-h-64 overflow-y-auto border-t border-gray-200 mt-2 pt-2">
                {projects.length === 0 ? (
                  <div className="px-6 py-4 text-sm text-gray-500 text-center">
                    저장된 프로젝트가 없습니다
                  </div>
                ) : (
                  projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => {
                        loadProject(project.id);
                        setShowMenu(false);
                        setShowProjectList(false);
                      }}
                      className="w-full px-6 py-2 text-left hover:bg-blue-50 text-sm"
                    >
                      <div className="font-medium text-gray-800">
                        {project.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {project.pageCount} pages • {project.elementCount}{' '}
                        elements
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            <div className="border-t border-gray-200 my-2" />

            {/* 내보내기 */}
            <button
              onClick={() => {
                exportProject();
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700"
            >
              <Download size={16} />
              <span>내보내기 (JSON)</span>
            </button>

            {/* 가져오기 */}
            <button
              onClick={handleImport}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700"
            >
              <Upload size={16} />
              <span>가져오기 (JSON)</span>
            </button>

            <div className="border-t border-gray-200 my-2" />

            {/* 복제 */}
            <button
              onClick={() => {
                duplicateProject();
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700"
            >
              <Copy size={16} />
              <span>복제하기</span>
            </button>
          </div>
        </>
      )}

      {/* 파일 input (숨김) */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
