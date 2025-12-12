import { useRef, useEffect } from 'react';
import type { TextElement } from '../types';

interface TextEditorProps {
  text: TextElement;
  onContentChange: (content: string) => void;
  onBlur: () => void;
}

export default function TextEditor({
  text,
  onContentChange,
  onBlur,
}: TextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const {
    position,
    size,
    fontSize,
    fontFamily,
    fontWeight,
    color,
    textAlign,
    rotation,
  } = text;

  // 에디터 마운트 시 초기값 설정 및 포커스
  useEffect(() => {
    if (editorRef.current) {
      // 초기 텍스트 설정
      editorRef.current.textContent = text.content;
      
      // 포커스 및 커서를 끝으로 이동
      editorRef.current.focus();
      
      const range = document.createRange();
      const selection = window.getSelection();
      
      // 커서를 끝으로 이동
      if (editorRef.current.childNodes.length > 0) {
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 마운트 시에만 실행

  // 입력 이벤트 핸들러
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.textContent || '';
    onContentChange(content);
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Escape: 편집 종료
    if (e.key === 'Escape') {
      e.preventDefault();
      editorRef.current?.blur();
    }
    
    // Enter는 줄바꿈으로 허용 (기본 동작)
  };

  // 포커스 아웃 핸들러
  const handleBlur = () => {
    onBlur();
  };

  return (
    <g transform={`rotate(${rotation}, ${position.x + size.width / 2}, ${position.y + size.height / 2})`}>
      {/* 편집 중 테두리 */}
      <rect
        x={position.x - 2}
        y={position.y - 2}
        width={size.width + 4}
        height={size.height + 4}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
        pointerEvents="none"
      />

      {/* 편집 가능한 텍스트 영역 */}
      <foreignObject
        x={position.x}
        y={position.y}
        width={size.width}
        height={size.height}
        style={{ overflow: 'visible' }}
      >
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          style={{
            width: '100%',
            minHeight: '100%',
            fontSize: `${fontSize}px`,
            fontFamily: fontFamily,
            fontWeight: fontWeight,
            color: color,
            textAlign: textAlign,
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            lineHeight: '1.4',
            padding: '4px',
            boxSizing: 'border-box',
            outline: 'none',
            cursor: 'text',
            background: 'rgba(255, 255, 255, 0.9)',
          }}
        />
      </foreignObject>
    </g>
  );
}