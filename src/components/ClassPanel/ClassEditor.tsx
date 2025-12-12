import { useState } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { X } from 'lucide-react';
import type { CSSClass } from '../../types';

/**
 * CSS 클래스 에디터 (Phase 15.1)
 *
 * CSS 클래스를 생성하거나 편집하는 다이얼로그
 */
interface ClassEditorProps {
  cssClass: CSSClass | null; // null이면 새 클래스 생성
  onClose: () => void;
}

export default function ClassEditor({ cssClass, onClose }: ClassEditorProps) {
  const { createCSSClass, updateCSSClass } = useBuilderStore();

  const [name, setName] = useState(cssClass?.name || '');
  const [description, setDescription] = useState(cssClass?.description || '');
  const [category, setCategory] = useState(cssClass?.category || 'utilities');

  // 스타일 속성
  const [backgroundColor, setBackgroundColor] = useState(
    (cssClass?.styles.backgroundColor as string) || '#ffffff'
  );
  const [color, setColor] = useState((cssClass?.styles.color as string) || '#000000');
  const [fontSize, setFontSize] = useState(
    parseInt((cssClass?.styles.fontSize as string) || '16') || 16
  );
  const [fontWeight, setFontWeight] = useState(
    (cssClass?.styles.fontWeight as string) || 'normal'
  );
  const [padding, setPadding] = useState(
    parseInt((cssClass?.styles.padding as string) || '0') || 0
  );
  const [borderRadius, setBorderRadius] = useState(
    parseInt((cssClass?.styles.borderRadius as string) || '0') || 0
  );
  const [borderWidth, setBorderWidth] = useState(
    parseInt((cssClass?.styles.borderWidth as string) || '0') || 0
  );
  const [borderColor, setBorderColor] = useState(
    (cssClass?.styles.borderColor as string) || '#000000'
  );

  // 호버 스타일
  const [enableHover, setEnableHover] = useState(!!cssClass?.hoverStyles);
  const [hoverBackgroundColor, setHoverBackgroundColor] = useState(
    (cssClass?.hoverStyles?.backgroundColor as string) || '#f0f0f0'
  );
  const [hoverColor, setHoverColor] = useState(
    (cssClass?.hoverStyles?.color as string) || '#000000'
  );

  const isEditing = !!cssClass;

  const handleSave = () => {
    if (!name.trim()) {
      alert('클래스 이름을 입력하세요.');
      return;
    }

    const styles: React.CSSProperties = {
      backgroundColor,
      color,
      fontSize: `${fontSize}px`,
      fontWeight,
      padding: `${padding}px`,
      borderRadius: `${borderRadius}px`,
      ...(borderWidth > 0 && {
        borderWidth: `${borderWidth}px`,
        borderStyle: 'solid',
        borderColor,
      }),
    };

    const hoverStyles: React.CSSProperties | undefined = enableHover
      ? {
          backgroundColor: hoverBackgroundColor,
          color: hoverColor,
        }
      : undefined;

    if (isEditing) {
      updateCSSClass(cssClass.id, {
        name,
        description,
        category,
        styles,
        hoverStyles,
      });
    } else {
      createCSSClass(name, styles, {
        description,
        category,
        hoverStyles,
      });
    }

    onClose();
  };

  // 미리보기 스타일
  const previewStyles: React.CSSProperties = {
    backgroundColor,
    color,
    fontSize: `${fontSize}px`,
    fontWeight,
    padding: `${padding}px`,
    borderRadius: `${borderRadius}px`,
    ...(borderWidth > 0 && {
      borderWidth: `${borderWidth}px`,
      borderStyle: 'solid',
      borderColor,
    }),
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'CSS 클래스 편집' : '새 CSS 클래스 생성'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                클래스 이름 *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: btn-primary, heading-1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                설명
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="클래스 설명 (선택사항)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                카테고리
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="buttons">버튼</option>
                <option value="text">텍스트</option>
                <option value="containers">컨테이너</option>
                <option value="utilities">유틸리티</option>
              </select>
            </div>
          </div>

          {/* 스타일 속성 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">스타일</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">배경색</label>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full h-10 rounded border border-gray-300"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">글자색</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-10 rounded border border-gray-300"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">폰트 크기</label>
                <input
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="8"
                  max="72"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">폰트 두께</label>
                <select
                  value={fontWeight}
                  onChange={(e) => setFontWeight(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                  <option value="500">500</option>
                  <option value="600">600</option>
                  <option value="700">700</option>
                  <option value="800">800</option>
                  <option value="900">900</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">패딩</label>
                <input
                  type="number"
                  value={padding}
                  onChange={(e) => setPadding(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">모서리 반경</label>
                <input
                  type="number"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">테두리 두께</label>
                <input
                  type="number"
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="0"
                  max="20"
                />
              </div>

              {borderWidth > 0 && (
                <div>
                  <label className="block text-xs text-gray-600 mb-1">테두리 색</label>
                  <input
                    type="color"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="w-full h-10 rounded border border-gray-300"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 호버 스타일 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="enable-hover"
                checked={enableHover}
                onChange={(e) => setEnableHover(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="enable-hover" className="text-sm font-semibold text-gray-800">
                호버 스타일 활성화
              </label>
            </div>

            {enableHover && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">호버 배경색</label>
                  <input
                    type="color"
                    value={hoverBackgroundColor}
                    onChange={(e) => setHoverBackgroundColor(e.target.value)}
                    className="w-full h-10 rounded border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">호버 글자색</label>
                  <input
                    type="color"
                    value={hoverColor}
                    onChange={(e) => setHoverColor(e.target.value)}
                    className="w-full h-10 rounded border border-gray-300"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 미리보기 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">미리보기</h3>
            <div
              style={previewStyles}
              className="inline-block px-4 py-2 cursor-pointer transition-all"
            >
              Sample Text
            </div>
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
