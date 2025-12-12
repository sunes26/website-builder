import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { useBuilderStore } from '../store/builderStore';
import type { TextElement, Position } from '../types';

interface UseTextEditingReturn {
  editingTextId: string | null;
  startEditing: (textId: string) => void;
  stopEditing: () => void;
  updateTextContent: (textId: string, content: string) => void;
  createTextAtPosition: (position: Position) => void;
}

export function useTextEditing(): UseTextEditingReturn {
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const { addElement, updateElement, elements } = useBuilderStore();

  // 편집 시작
  const startEditing = useCallback((textId: string) => {
    setEditingTextId(textId);
  }, []);

  // 편집 종료
  const stopEditing = useCallback(() => {
    if (editingTextId) {
      // 편집 종료 시 텍스트 크기 자동 조정
      const textElement = elements.find((el) => el.id === editingTextId);
      if (textElement && textElement.type === 'text') {
        const content = textElement.content || '';
        const lines = content.split('\n');
        const maxLineLength = lines.length > 0
          ? Math.max(...lines.map((line) => line.length), 1)
          : 1;
        const lineCount = lines.length || 1;

        const estimatedWidth = Math.max(
          100, // 최소 너비
          Math.min(500, maxLineLength * (textElement.fontSize * 0.6)) // 최대 500px
        );

        const estimatedHeight = Math.max(
          40, // 최소 높이
          lineCount * (textElement.fontSize * 1.4) + 16 // 줄 높이 + 패딩
        );

        updateElement(editingTextId, {
          size: {
            width: estimatedWidth,
            height: estimatedHeight,
          },
        } as Partial<TextElement>);
      }
    }
    setEditingTextId(null);
  }, [editingTextId, elements, updateElement]);

  // 텍스트 내용 업데이트
  const updateTextContent = useCallback(
    (textId: string, content: string) => {
      // 내용만 업데이트 (크기는 편집 완료 시 조정)
      updateElement(textId, { content } as Partial<TextElement>);
    },
    [updateElement]
  );

  // 특정 위치에 새 텍스트 생성
  const createTextAtPosition = useCallback(
    (position: Position) => {
      // 최대 zIndex 계산
      const maxZIndex = elements.length > 0
        ? Math.max(...elements.map((el) => el.zIndex))
        : 0;

      // 새 텍스트 요소 생성
      const newText: TextElement = {
        id: nanoid(),
        type: 'text',
        position,
        size: { width: 200, height: 40 }, // 초기 크기
        rotation: 0,
        zIndex: maxZIndex + 1,
        locked: false,
        visible: true,
        content: '',
        fontSize: 16,
        fontFamily: 'Inter, sans-serif',
        fontWeight: '400',
        color: '#000000',
        textAlign: 'left',
      };

      // 스토어에 추가
      addElement(newText);

      // 자동으로 편집 모드 시작
      setTimeout(() => {
        setEditingTextId(newText.id);
      }, 50); // 약간의 지연을 두어 렌더링 완료 후 편집 시작
    },
    [elements, addElement]
  );

  return {
    editingTextId,
    startEditing,
    stopEditing,
    updateTextContent,
    createTextAtPosition,
  };
}