import { Plus } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';

/**
 * 페이지 컨트롤 컴포넌트 (Phase 9)
 *
 * 페이지 추가 버튼
 */
export default function PageControls() {
  const { addPage, pages } = useBuilderStore();

  const handleAddPage = () => {
    addPage();
  };

  return (
    <div className="p-3 border-b border-gray-200">
      <button
        onClick={handleAddPage}
        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        <Plus size={16} />
        <span className="text-sm font-medium">새 페이지</span>
      </button>

      <div className="mt-2 text-xs text-gray-500 text-center">
        총 {pages.length}개의 페이지
      </div>
    </div>
  );
}
