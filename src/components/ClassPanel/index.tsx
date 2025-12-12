import { useState } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { Plus, Edit2, Copy, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import ClassEditor from './ClassEditor';
import type { CSSClass } from '../../types';

/**
 * CSS 클래스 패널 (Phase 15.1)
 *
 * 재사용 가능한 CSS 클래스 라이브러리를 관리하는 패널
 */
export default function ClassPanel() {
  const { cssClasses, deleteCSSClass, duplicateCSSClass } = useBuilderStore();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<CSSClass | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['all']));

  // 카테고리별 그룹화
  const groupedClasses = cssClasses.reduce((acc, cls) => {
    const category = cls.category || 'uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(cls);
    return acc;
  }, {} as Record<string, CSSClass[]>);

  const categories = Object.keys(groupedClasses).sort();

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCreateClass = () => {
    setEditingClass(null);
    setIsEditorOpen(true);
  };

  const handleEditClass = (cls: CSSClass) => {
    setEditingClass(cls);
    setIsEditorOpen(true);
  };

  const handleDuplicateClass = (cls: CSSClass) => {
    duplicateCSSClass(cls.id);
  };

  const handleDeleteClass = (cls: CSSClass) => {
    if (confirm(`"${cls.name}" 클래스를 삭제하시겠습니까?`)) {
      deleteCSSClass(cls.id);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      buttons: '버튼',
      text: '텍스트',
      containers: '컨테이너',
      utilities: '유틸리티',
      uncategorized: '미분류',
    };
    return labels[category] || category;
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800">CSS 클래스</h3>
        <button
          onClick={handleCreateClass}
          className="p-1.5 rounded hover:bg-gray-100 text-blue-600"
          title="새 클래스 추가"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* 클래스 목록 */}
      <div className="flex-1 overflow-y-auto">
        {cssClasses.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-xs">
            <p>생성된 CSS 클래스가 없습니다.</p>
            <p className="mt-1">버튼을 클릭하여 새 클래스를 추가하세요.</p>
          </div>
        ) : (
          <div className="p-2">
            {categories.map((category) => {
              const classes = groupedClasses[category];
              const isExpanded = expandedCategories.has(category);

              return (
                <div key={category} className="mb-2">
                  {/* 카테고리 헤더 */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded"
                  >
                    {isExpanded ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                    <span>{getCategoryLabel(category)}</span>
                    <span className="ml-auto text-gray-400">({classes.length})</span>
                  </button>

                  {/* 클래스 목록 */}
                  {isExpanded && (
                    <div className="mt-1 space-y-1">
                      {classes.map((cls) => (
                        <ClassCard
                          key={cls.id}
                          cssClass={cls}
                          onEdit={() => handleEditClass(cls)}
                          onDuplicate={() => handleDuplicateClass(cls)}
                          onDelete={() => handleDeleteClass(cls)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 클래스 에디터 다이얼로그 */}
      {isEditorOpen && (
        <ClassEditor
          cssClass={editingClass}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingClass(null);
          }}
        />
      )}
    </div>
  );
}

/**
 * CSS 클래스 카드 컴포넌트
 */
interface ClassCardProps {
  cssClass: CSSClass;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

function ClassCard({ cssClass, onEdit, onDuplicate, onDelete }: ClassCardProps) {
  const { addClassToElement, selectedElementIds } = useBuilderStore();
  const [isDragging, setIsDragging] = useState(false);

  // 선택된 요소에 클래스 적용
  const handleApplyToSelected = () => {
    if (selectedElementIds.length === 0) {
      alert('클래스를 적용할 요소를 먼저 선택하세요.');
      return;
    }

    selectedElementIds.forEach((elementId) => {
      addClassToElement(elementId, cssClass.id);
    });
  };

  // 드래그 시작
  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('css-class-id', cssClass.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // 스타일 미리보기
  const previewStyle: React.CSSProperties = {
    ...cssClass.styles,
    width: '100%',
    height: '24px',
    borderRadius: '4px',
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`group border rounded p-2 bg-white hover:border-blue-300 transition-colors cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {/* 클래스 이름 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-900 truncate">
            {cssClass.name}
          </p>
          {cssClass.description && (
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {cssClass.description}
            </p>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1 rounded hover:bg-gray-100 text-gray-600"
            title="편집"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={onDuplicate}
            className="p-1 rounded hover:bg-gray-100 text-gray-600"
            title="복제"
          >
            <Copy size={12} />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded hover:bg-red-100 text-red-600"
            title="삭제"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* 스타일 미리보기 */}
      <div className="mb-2">
        <div style={previewStyle} className="border border-gray-200" />
      </div>

      {/* 적용 버튼 */}
      <button
        onClick={handleApplyToSelected}
        className="w-full px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 rounded transition-colors"
      >
        선택된 요소에 적용
      </button>
    </div>
  );
}
