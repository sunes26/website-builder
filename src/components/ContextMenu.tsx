import { useEffect, useRef } from 'react';
import {
  Undo,
  Redo,
  Trash2,
  Group,
  Ungroup,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface ContextMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  disabled?: boolean;
  separator?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export default function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // 약간의 딜레이를 주어 메뉴가 열린 직후 닫히지 않도록 함
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 0);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleItemClick = (item: ContextMenuItem) => {
    if (!item.disabled) {
      item.action();
      onClose();
    }
  };

  return (
    <div
      ref={menuRef}
      className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[200px] z-50"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      {items.map((item, index) => (
        <div key={item.id}>
          {item.separator && index > 0 && (
            <div className="border-t border-gray-200 my-1" />
          )}
          <button
            onClick={() => handleItemClick(item)}
            disabled={item.disabled}
            className={`
              w-full flex items-center space-x-3 px-4 py-2 text-sm text-left
              ${
                item.disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
              }
            `}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
          </button>
        </div>
      ))}
    </div>
  );
}

// 컨텍스트 메뉴 아이템 생성 헬퍼
export const createContextMenuItems = {
  undo: (canUndo: boolean, onUndo: () => void): ContextMenuItem => ({
    id: 'undo',
    label: '되돌리기',
    icon: <Undo size={16} />,
    action: onUndo,
    disabled: !canUndo,
  }),

  redo: (canRedo: boolean, onRedo: () => void): ContextMenuItem => ({
    id: 'redo',
    label: '다시 실행',
    icon: <Redo size={16} />,
    action: onRedo,
    disabled: !canRedo,
  }),

  group: (canGroup: boolean, onGroup: () => void): ContextMenuItem => ({
    id: 'group',
    label: '그룹화',
    icon: <Group size={16} />,
    action: onGroup,
    disabled: !canGroup,
    separator: true,
  }),

  ungroup: (canUngroup: boolean, onUngroup: () => void): ContextMenuItem => ({
    id: 'ungroup',
    label: '그룹 해제',
    icon: <Ungroup size={16} />,
    action: onUngroup,
    disabled: !canUngroup,
  }),

  delete: (canDelete: boolean, onDelete: () => void): ContextMenuItem => ({
    id: 'delete',
    label: '삭제',
    icon: <Trash2 size={16} />,
    action: onDelete,
    disabled: !canDelete,
    separator: true,
  }),

  bringForward: (canMove: boolean, onBringForward: () => void): ContextMenuItem => ({
    id: 'bringForward',
    label: '앞으로 가져오기',
    icon: <ArrowUp size={16} />,
    action: onBringForward,
    disabled: !canMove,
    separator: true,
  }),

  sendBackward: (canMove: boolean, onSendBackward: () => void): ContextMenuItem => ({
    id: 'sendBackward',
    label: '뒤로 보내기',
    icon: <ArrowDown size={16} />,
    action: onSendBackward,
    disabled: !canMove,
  }),
};
