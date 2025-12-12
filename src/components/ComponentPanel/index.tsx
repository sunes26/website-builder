import { Package, Plus } from 'lucide-react';
import { useState } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import ComponentCard from './ComponentCard';
import CreateDialog from './CreateDialog';

export default function ComponentPanel() {
  const { components } = useBuilderStore();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700">컴포넌트 라이브러리</h3>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors"
            title="새 컴포넌트 생성"
          >
            <Plus size={16} className="text-gray-600" />
          </button>
        </div>
        <p className="text-xs text-gray-500">
          {components.length}개의 컴포넌트
        </p>
      </div>

      {/* 컴포넌트 목록 */}
      <div className="flex-1 overflow-y-auto p-4">
        {components.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Package size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm mb-2">
              컴포넌트가 없습니다
            </p>
            <p className="text-gray-400 text-xs">
              요소를 선택하고<br />
              컴포넌트를 생성하세요
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {components.map((component) => (
              <ComponentCard key={component.id} component={component} />
            ))}
          </div>
        )}
      </div>

      {/* 생성 다이얼로그 */}
      {showCreateDialog && (
        <CreateDialog onClose={() => setShowCreateDialog(false)} />
      )}
    </div>
  );
}
