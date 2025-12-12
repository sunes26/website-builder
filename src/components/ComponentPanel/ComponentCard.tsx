import { Copy, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Component } from '../../types';
import { useBuilderStore } from '../../store/builderStore';
import EditDialog from './EditDialog';
import ComponentThumbnail from './ComponentThumbnail';

interface ComponentCardProps {
  component: Component;
}

export default function ComponentCard({ component }: ComponentCardProps) {
  const { deleteComponent, duplicateComponent } = useBuilderStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('componentId', component.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDelete = () => {
    if (confirm(`"${component.name}" 컴포넌트를 삭제하시겠습니까?`)) {
      deleteComponent(component.id);
    }
    setShowMenu(false);
  };

  const handleDuplicate = () => {
    duplicateComponent(component.id);
    setShowMenu(false);
  };

  const handleEdit = () => {
    setShowEditDialog(true);
    setShowMenu(false);
  };

  return (
    <>
      <div
        draggable
        onDragStart={handleDragStart}
        className="relative group bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm transition-all cursor-move"
      >
        {/* 썸네일 영역 (Priority 2.4) */}
        <div className="mb-2">
          <ComponentThumbnail component={component} />
        </div>

        {/* 컴포넌트 정보 */}
        <div className="space-y-1">
          <h4 className="text-xs font-medium text-gray-700 truncate">
            {component.name}
          </h4>
          {component.description && (
            <p className="text-xs text-gray-500 line-clamp-2">
              {component.description}
            </p>
          )}
        </div>

        {/* 메뉴 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="absolute top-2 right-2 p-1 rounded bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical size={14} className="text-gray-600" />
        </button>

        {/* 드롭다운 메뉴 */}
        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute top-8 right-2 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[140px]">
              <button
                onClick={handleEdit}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Pencil size={14} />
                편집
              </button>
              <button
                onClick={handleDuplicate}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Copy size={14} />
                복제
              </button>
              <div className="border-t border-gray-100 my-1" />
              <button
                onClick={handleDelete}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={14} />
                삭제
              </button>
            </div>
          </>
        )}
      </div>

      {/* 편집 다이얼로그 */}
      {showEditDialog && (
        <EditDialog
          component={component}
          onClose={() => setShowEditDialog(false)}
        />
      )}
    </>
  );
}
