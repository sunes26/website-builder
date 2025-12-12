import { X, Command } from 'lucide-react';

/**
 * 키보드 단축키 치트시트 모달 (Priority 0.3)
 */
interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Shortcut {
  keys: string[];
  description: string;
}

interface ShortcutCategory {
  title: string;
  shortcuts: Shortcut[];
}

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const modKey = isMac ? '⌘' : 'Ctrl';

const shortcutCategories: ShortcutCategory[] = [
  {
    title: '일반',
    shortcuts: [
      { keys: [modKey, 'S'], description: '프로젝트 저장' },
      { keys: [modKey, 'K'], description: '단축키 보기' },
      { keys: ['?'], description: '단축키 보기' },
    ],
  },
  {
    title: '편집',
    shortcuts: [
      { keys: [modKey, 'Z'], description: '실행 취소' },
      { keys: [modKey, 'Shift', 'Z'], description: '다시 실행' },
      { keys: [modKey, 'D'], description: '복제' },
      { keys: ['Del'], description: '삭제' },
      { keys: ['Esc'], description: '선택 해제' },
    ],
  },
  {
    title: '선택',
    shortcuts: [
      { keys: ['V'], description: '선택 도구' },
      { keys: [modKey, 'A'], description: '전체 선택' },
      { keys: [modKey, 'Click'], description: '다중 선택 추가' },
    ],
  },
  {
    title: '도형 도구',
    shortcuts: [
      { keys: ['R'], description: '사각형' },
      { keys: ['O'], description: '원' },
      { keys: ['L'], description: '직선' },
      { keys: ['T'], description: '텍스트' },
      { keys: ['I'], description: '이미지' },
    ],
  },
  {
    title: '캔버스',
    shortcuts: [
      { keys: [modKey, '+'], description: '줌 인' },
      { keys: [modKey, '-'], description: '줌 아웃' },
      { keys: [modKey, '0'], description: '줌 리셋' },
      { keys: [modKey, 'Wheel'], description: '줌' },
      { keys: ['Space', 'Drag'], description: '캔버스 이동' },
      { keys: [modKey, "'"], description: '그리드 토글' },
    ],
  },
  {
    title: '정렬',
    shortcuts: [
      { keys: [modKey, 'G'], description: '그룹화' },
      { keys: [modKey, 'Shift', 'G'], description: '그룹 해제' },
      { keys: [modKey, '['], description: '뒤로 보내기' },
      { keys: [modKey, ']'], description: '앞으로 가져오기' },
    ],
  },
];

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Command className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">키보드 단축키</h2>
              <p className="text-sm text-gray-500">빠른 작업을 위한 단축키 모음</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shortcutCategories.map((category) => (
              <div key={category.title}>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  {category.title}
                </h3>
                <div className="space-y-2">
                  {category.shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm text-gray-700">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <span key={keyIndex} className="flex items-center">
                            <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded shadow-sm">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="mx-1 text-gray-400 text-xs">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 푸터 */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            팁: 이 창을 닫으려면 <kbd className="px-1.5 py-0.5 text-xs bg-gray-200 rounded">Esc</kbd> 키를 누르세요
          </p>
        </div>
      </div>
    </div>
  );
}
