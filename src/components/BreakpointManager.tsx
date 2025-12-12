import { useState } from 'react';
import { useBuilderStore } from '../store/builderStore';
import { Plus, Edit2, Trash2, GripVertical, X } from 'lucide-react';
import type { CustomBreakpoint } from '../types';

/**
 * 커스텀 브레이크포인트 관리자 (Phase 15.3)
 *
 * 반응형 디자인의 커스텀 브레이크포인트를 관리하는 UI
 */
export default function BreakpointManager() {
  const { customBreakpoints, deleteCustomBreakpoint } =
    useBuilderStore();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBreakpoint, setEditingBreakpoint] = useState<CustomBreakpoint | null>(null);

  const handleCreateBreakpoint = () => {
    setEditingBreakpoint(null);
    setIsEditorOpen(true);
  };

  const handleEditBreakpoint = (breakpoint: CustomBreakpoint) => {
    setEditingBreakpoint(breakpoint);
    setIsEditorOpen(true);
  };

  const handleDeleteBreakpoint = (breakpoint: CustomBreakpoint) => {
    if (confirm(`"${breakpoint.label}" 브레이크포인트를 삭제하시겠습니까?`)) {
      deleteCustomBreakpoint(breakpoint.id);
    }
  };

  // 기본 브레이크포인트 (삭제 불가)
  const defaultBreakpoints = [
    { name: 'desktop', label: '데스크톱', minWidth: 1024, maxWidth: undefined },
    { name: 'tablet', label: '태블릿', minWidth: 768, maxWidth: 1023 },
    { name: 'mobile', label: '모바일', minWidth: 0, maxWidth: 767 },
  ];

  // 정렬된 브레이크포인트 (order 기준)
  const sortedCustomBreakpoints = [...customBreakpoints].sort((a, b) => a.order - b.order);

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800">브레이크포인트 관리</h3>
        <button
          onClick={handleCreateBreakpoint}
          className="p-1.5 rounded hover:bg-gray-100 text-blue-600"
          title="새 브레이크포인트 추가"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* 설명 */}
      <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
        <p className="text-xs text-blue-800">
          커스텀 브레이크포인트를 추가하여 더 세밀한 반응형 디자인을 구현할 수 있습니다.
        </p>
      </div>

      {/* 브레이크포인트 목록 */}
      <div className="flex-1 overflow-y-auto">
        {/* 기본 브레이크포인트 */}
        <div className="p-4">
          <h4 className="text-xs font-semibold text-gray-600 mb-2">기본 브레이크포인트</h4>
          <div className="space-y-2">
            {defaultBreakpoints.map((bp) => (
              <BreakpointCard
                key={bp.name}
                name={bp.name}
                label={bp.label}
                minWidth={bp.minWidth}
                maxWidth={bp.maxWidth}
                isDefault={true}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        </div>

        {/* 커스텀 브레이크포인트 */}
        {sortedCustomBreakpoints.length > 0 && (
          <div className="px-4 pb-4">
            <h4 className="text-xs font-semibold text-gray-600 mb-2">커스텀 브레이크포인트</h4>
            <div className="space-y-2">
              {sortedCustomBreakpoints.map((bp) => (
                <BreakpointCard
                  key={bp.id}
                  name={bp.name}
                  label={bp.label}
                  minWidth={bp.minWidth}
                  maxWidth={bp.maxWidth}
                  isDefault={false}
                  onEdit={() => handleEditBreakpoint(bp)}
                  onDelete={() => handleDeleteBreakpoint(bp)}
                />
              ))}
            </div>
          </div>
        )}

        {sortedCustomBreakpoints.length === 0 && (
          <div className="px-4 pb-4">
            <div className="text-center py-8 text-gray-500 text-xs">
              <p>커스텀 브레이크포인트가 없습니다.</p>
              <p className="mt-1">버튼을 클릭하여 새 브레이크포인트를 추가하세요.</p>
            </div>
          </div>
        )}
      </div>

      {/* 브레이크포인트 에디터 다이얼로그 */}
      {isEditorOpen && (
        <BreakpointEditor
          breakpoint={editingBreakpoint}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingBreakpoint(null);
          }}
        />
      )}
    </div>
  );
}

/**
 * 브레이크포인트 카드 컴포넌트
 */
interface BreakpointCardProps {
  name: string;
  label: string;
  minWidth: number;
  maxWidth?: number;
  isDefault: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function BreakpointCard({
  name,
  label,
  minWidth,
  maxWidth,
  isDefault,
  onEdit,
  onDelete,
}: BreakpointCardProps) {
  const rangeText = maxWidth
    ? `${minWidth}px - ${maxWidth}px`
    : `${minWidth}px 이상`;

  return (
    <div className="group border rounded p-3 bg-white hover:border-blue-300 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          {!isDefault && (
            <div className="cursor-move text-gray-400">
              <GripVertical size={14} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{rangeText}</p>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">{name}</p>
          </div>
        </div>

        {!isDefault && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onEdit}
              className="p-1 rounded hover:bg-gray-100 text-gray-600"
              title="편집"
            >
              <Edit2 size={12} />
            </button>
            <button
              onClick={onDelete}
              className="p-1 rounded hover:bg-red-100 text-red-600"
              title="삭제"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 브레이크포인트 에디터 다이얼로그
 */
interface BreakpointEditorProps {
  breakpoint: CustomBreakpoint | null;
  onClose: () => void;
}

function BreakpointEditor({ breakpoint, onClose }: BreakpointEditorProps) {
  const { addCustomBreakpoint, updateCustomBreakpoint } = useBuilderStore();

  const [name, setName] = useState(breakpoint?.name || '');
  const [label, setLabel] = useState(breakpoint?.label || '');
  const [minWidth, setMinWidth] = useState(breakpoint?.minWidth || 0);
  const [maxWidth, setMaxWidth] = useState(breakpoint?.maxWidth || undefined);
  const [hasMaxWidth, setHasMaxWidth] = useState(!!breakpoint?.maxWidth);

  const isEditing = !!breakpoint;

  const handleSave = () => {
    if (!name.trim()) {
      alert('브레이크포인트 이름을 입력하세요.');
      return;
    }

    if (!label.trim()) {
      alert('브레이크포인트 레이블을 입력하세요.');
      return;
    }

    if (minWidth < 0) {
      alert('최소 너비는 0 이상이어야 합니다.');
      return;
    }

    if (hasMaxWidth && maxWidth !== undefined && maxWidth <= minWidth) {
      alert('최대 너비는 최소 너비보다 커야 합니다.');
      return;
    }

    const breakpointData = {
      name: name.trim(),
      label: label.trim(),
      minWidth,
      maxWidth: hasMaxWidth ? maxWidth : undefined,
    };

    if (isEditing) {
      updateCustomBreakpoint(breakpoint.id, breakpointData);
    } else {
      // 새 브레이크포인트 추가 시 id와 order는 자동으로 설정됨
      addCustomBreakpoint({
        ...breakpointData,
        order: 0, // 스토어에서 자동으로 재정렬됨
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? '브레이크포인트 편집' : '새 브레이크포인트'}
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름 (영문) *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: laptop, wide-mobile"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              코드에서 사용될 식별자입니다. (공백 없이)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              레이블 *
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="예: 노트북, 큰 모바일"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              UI에 표시될 이름입니다.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              최소 너비 (px) *
            </label>
            <input
              type="number"
              value={minWidth}
              onChange={(e) => setMinWidth(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="has-max-width"
                checked={hasMaxWidth}
                onChange={(e) => setHasMaxWidth(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="has-max-width" className="text-sm font-medium text-gray-700">
                최대 너비 설정
              </label>
            </div>

            {hasMaxWidth && (
              <input
                type="number"
                value={maxWidth || ''}
                onChange={(e) => setMaxWidth(parseInt(e.target.value) || undefined)}
                placeholder="최대 너비 (px)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={minWidth + 1}
              />
            )}
          </div>

          {/* 미리보기 */}
          <div className="bg-gray-50 rounded p-3">
            <p className="text-xs font-semibold text-gray-700 mb-1">미디어 쿼리 미리보기:</p>
            <code className="text-xs text-gray-600 font-mono">
              {hasMaxWidth && maxWidth
                ? `@media (min-width: ${minWidth}px) and (max-width: ${maxWidth}px)`
                : `@media (min-width: ${minWidth}px)`}
            </code>
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            {isEditing ? '저장' : '생성'}
          </button>
        </div>
      </div>
    </div>
  );
}
