import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, RotateCcw, Droplet } from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';

export default function ColorPalettePanel() {
  const { colorPalette, addColorToPalette, removeColorFromPalette, updatePaletteColor, clearColorPalette, selectedElementIds, elements, updateElement } = useBuilderStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newColor, setNewColor] = useState('#3B82F6');
  const [newColorName, setNewColorName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // 색상 추가
  const handleAddColor = () => {
    if (newColor) {
      addColorToPalette(newColor, newColorName || undefined);
      setNewColor('#3B82F6');
      setNewColorName('');
      setShowAddForm(false);
    }
  };

  // 색상 이름 수정 시작
  const startEditing = (id: string, currentName?: string) => {
    setEditingId(id);
    setEditingName(currentName || '');
  };

  // 색상 이름 수정 완료
  const finishEditing = () => {
    if (editingId) {
      updatePaletteColor(editingId, { name: editingName || undefined });
      setEditingId(null);
      setEditingName('');
    }
  };

  // 색상 이름 수정 취소
  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  // 색상을 선택된 요소에 적용
  const applyColorToSelection = (color: string) => {
    if (selectedElementIds.length === 0) return;

    selectedElementIds.forEach((id) => {
      const element = elements.find((el) => el.id === id);
      if (!element) return;

      // 요소 타입에 따라 적절한 속성에 색상 적용
      if (element.type === 'shape') {
        updateElement(id, {
          style: { ...element.style, fill: color },
        });
      } else if (element.type === 'text') {
        updateElement(id, { color });
      } else if (element.type === 'line' || element.type === 'arrow') {
        updateElement(id, { strokeColor: color });
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">색상 팔레트</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="색상 추가"
            >
              <Plus size={16} className="text-gray-600" />
            </button>
            <button
              onClick={() => {
                if (confirm('모든 색상을 초기화하시겠습니까?')) {
                  clearColorPalette();
                }
              }}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="팔레트 초기화"
            >
              <RotateCcw size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* 색상 추가 폼 */}
        {showAddForm && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="색상 이름 (선택사항)"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddColor();
                  if (e.key === 'Escape') setShowAddForm(false);
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleAddColor}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                추가
              </button>
            </div>
          </div>
        )}

        {/* 선택된 요소에 적용 안내 */}
        {selectedElementIds.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded">
            <Droplet size={14} />
            <span>색상을 클릭하면 선택된 요소에 적용됩니다</span>
          </div>
        )}
      </div>

      {/* 색상 그리드 */}
      <div className="flex-1 overflow-y-auto p-4">
        {colorPalette.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Droplet size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">색상이 없습니다</p>
            <p className="text-gray-400 text-xs mt-2">
              + 버튼을 눌러 색상을 추가하세요
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {colorPalette.map((item) => (
              <div
                key={item.id}
                className="group relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors"
              >
                {/* 색상 미리보기 */}
                <button
                  onClick={() => applyColorToSelection(item.color)}
                  className="w-full h-20 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                  style={{ backgroundColor: item.color }}
                  title={`${item.name || item.color}${selectedElementIds.length > 0 ? ' (클릭하여 적용)' : ''}`}
                />

                {/* 색상 정보 */}
                <div className="p-2 bg-white">
                  {editingId === item.id ? (
                    // 이름 편집 모드
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') finishEditing();
                          if (e.key === 'Escape') cancelEditing();
                        }}
                      />
                      <button
                        onClick={finishEditing}
                        className="p-1 hover:bg-green-100 rounded transition-colors"
                        title="저장"
                      >
                        <Check size={12} className="text-green-600" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                        title="취소"
                      >
                        <X size={12} className="text-red-600" />
                      </button>
                    </div>
                  ) : (
                    // 일반 표시 모드
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">
                          {item.name || '이름 없음'}
                        </p>
                        <p className="text-xs text-gray-500 font-mono">
                          {item.color.toUpperCase()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEditing(item.id, item.name)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="이름 편집"
                        >
                          <Edit2 size={12} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`"${item.name || item.color}" 색상을 삭제하시겠습니까?`)) {
                              removeColorFromPalette(item.id);
                            }
                          }}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                          title="삭제"
                        >
                          <Trash2 size={12} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 푸터 정보 */}
      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>총 색상:</span>
          <span className="font-medium text-gray-700">
            {colorPalette.length}개
          </span>
        </div>
      </div>
    </div>
  );
}
