import { useState } from 'react';
import { X } from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';

interface NewProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 새 프로젝트 생성 다이얼로그 (Phase 10)
 *
 * 프로젝트 이름을 입력받아 새 프로젝트를 생성합니다.
 */
export default function NewProjectDialog({
  isOpen,
  onClose,
}: NewProjectDialogProps) {
  const [projectName, setProjectName] = useState('');
  const { createNewProject } = useBuilderStore();

  if (!isOpen) return null;

  const handleCreate = () => {
    const trimmedName = projectName.trim();
    if (trimmedName) {
      createNewProject(trimmedName);
      onClose();
      setProjectName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreate();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">새 프로젝트</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 입력 필드 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            프로젝트 이름
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="내 멋진 프로젝트"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            autoFocus
          />
        </div>

        {/* 버튼 */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleCreate}
            disabled={!projectName.trim()}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            생성
          </button>
        </div>
      </div>
    </div>
  );
}
