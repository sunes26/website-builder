import { useState, useRef, useEffect } from 'react';
import { FileText, Trash2 } from 'lucide-react';
import type { Page } from '../../types';
import { useBuilderStore } from '../../store/builderStore';

interface PageItemProps {
  page: Page;
  isActive: boolean;
}

/**
 * 페이지 아이템 컴포넌트 (Phase 9)
 *
 * 개별 페이지 표시 및 관리
 */
export default function PageItem({ page, isActive }: PageItemProps) {
  const { switchPage, updatePage, deletePage } = useBuilderStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(page.name);
  const inputRef = useRef<HTMLInputElement>(null);

  // 편집 모드로 전환 시 input에 포커스
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (!isEditing && !isActive) {
      switchPage(page.id);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditName(page.name);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(e.target.value);
  };

  const handleNameSubmit = () => {
    const trimmedName = editName.trim();
    if (trimmedName && trimmedName !== page.name) {
      updatePage(page.id, { name: trimmedName });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditName(page.name);
    }
  };

  const handleBlur = () => {
    handleNameSubmit();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deletePage(page.id);
  };

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`
        group flex items-center space-x-2 px-3 py-2 rounded cursor-pointer
        transition-colors
        ${isActive
          ? 'bg-blue-100 text-blue-700'
          : 'hover:bg-gray-100 text-gray-700'
        }
      `}
    >
      {/* 페이지 아이콘 */}
      <FileText size={16} className="flex-shrink-0" />

      {/* 페이지 이름 */}
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editName}
          onChange={handleNameChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="flex-1 px-1 py-0.5 text-sm bg-white border border-blue-500 rounded outline-none"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="flex-1 text-sm truncate">
          {page.name}
        </span>
      )}

      {/* 삭제 버튼 (호버 시 표시, 1개 이상일 때만) */}
      {!isEditing && (
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-opacity"
          title="페이지 삭제"
        >
          <Trash2 size={14} className="text-red-600" />
        </button>
      )}

      {/* 요소 개수 표시 */}
      {!isEditing && (
        <span className="text-xs text-gray-400">
          {page.elements.length}
        </span>
      )}
    </div>
  );
}
