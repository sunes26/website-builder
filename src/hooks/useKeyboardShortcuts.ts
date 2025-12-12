import { useEffect } from 'react';
import { useBuilderStore } from '../store/builderStore';

/**
 * 키보드 단축키 관리 훅
 *
 * 지원하는 단축키:
 * - Delete/Backspace: 선택된 요소 삭제
 * - Ctrl+A (Cmd+A): 전체 선택
 * - Escape: 선택 해제 (Canvas에서 이미 구현)
 * - Ctrl+Z (Cmd+Z): Undo (히스토리 시스템 구현 후 활성화)
 * - Ctrl+Y (Cmd+Y) / Ctrl+Shift+Z: Redo (히스토리 시스템 구현 후 활성화)
 * - Ctrl+G (Cmd+G): 그룹 생성 (그룹 시스템 구현 후 활성화)
 * - Ctrl+Shift+G: 그룹 해제 (그룹 시스템 구현 후 활성화)
 * - Ctrl+]: 레이어 위로 (레이어 시스템 구현 후 활성화)
 * - Ctrl+[: 레이어 아래로 (레이어 시스템 구현 후 활성화)
 */
export function useKeyboardShortcuts() {
  const {
    selectedElementIds,
    elements,
    deleteElements,
    selectElements,
    undo,
    redo,
    canUndo,
    canRedo,
    groupElements,
    ungroupElements,
    saveProject,
    setCurrentTool,
    moveLayerUp,
    moveLayerDown,
    toggleGrid,
    duplicateElements,
    updateElement,
  } = useBuilderStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 텍스트 입력 중이면 단축키 무시
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Windows/Mac 호환을 위한 Ctrl/Cmd 키 처리
      const ctrl = e.ctrlKey || e.metaKey;

      // Delete/Backspace: 선택된 요소 삭제
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementIds.length > 0) {
          e.preventDefault();
          deleteElements(selectedElementIds);
        }
        return;
      }

      // Ctrl+A: 전체 선택
      if (ctrl && e.key === 'a') {
        e.preventDefault();
        const allIds = elements.map(el => el.id);
        selectElements(allIds);
        return;
      }

      // Ctrl+Z: Undo (Phase 8)
      if (ctrl && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        if (canUndo()) {
          undo();
        }
        return;
      }

      // Ctrl+Y or Ctrl+Shift+Z: Redo (Phase 8)
      if ((ctrl && e.key === 'y') || (ctrl && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        if (canRedo()) {
          redo();
        }
        return;
      }

      // Ctrl+G: 그룹 생성 (Phase 8)
      if (ctrl && !e.shiftKey && e.key === 'g') {
        if (selectedElementIds.length >= 2) {
          e.preventDefault();
          groupElements();
        }
        return;
      }

      // Ctrl+Shift+G: 그룹 해제 (Phase 8)
      if (ctrl && e.shiftKey && e.key === 'g') {
        e.preventDefault();
        const selectedElements = elements.filter(el =>
          selectedElementIds.includes(el.id)
        );
        selectedElements.forEach(el => {
          if (el.type === 'group') {
            ungroupElements(el.id);
          }
        });
        return;
      }

      // Ctrl/Cmd + S: 프로젝트 저장 (Phase 10)
      if (ctrl && e.key === 's') {
        e.preventDefault();
        saveProject();
        console.log('💾 Project saved manually');
        return;
      }

      // Ctrl+]: 레이어 위로 (Phase 8)
      if (ctrl && e.key === ']') {
        if (selectedElementIds.length > 0) {
          e.preventDefault();
          selectedElementIds.forEach(id => {
            moveLayerUp(id);
          });
        }
        return;
      }

      // Ctrl+[: 레이어 아래로 (Phase 8)
      if (ctrl && e.key === '[') {
        if (selectedElementIds.length > 0) {
          e.preventDefault();
          selectedElementIds.forEach(id => {
            moveLayerDown(id);
          });
        }
        return;
      }

      // Ctrl+D: 복제 (Priority 1.1)
      if (ctrl && e.key === 'd') {
        if (selectedElementIds.length > 0) {
          e.preventDefault();
          duplicateElements(selectedElementIds);
        }
        return;
      }

      // Ctrl+C: 복사 (현재 복사 기능 없음)
      if (ctrl && e.key === 'c') {
        if (selectedElementIds.length > 0) {
          e.preventDefault();
          // TODO: 복사 기능 구현 필요
          console.log('📋 Copy shortcut (not implemented yet)');
        }
        return;
      }

      // Ctrl+V: 붙여넣기 (현재 붙여넣기 기능 없음)
      if (ctrl && e.key === 'v') {
        e.preventDefault();
        // TODO: 붙여넣기 기능 구현 필요
        console.log('📋 Paste shortcut (not implemented yet)');
        return;
      }

      // Ctrl+': 그리드 토글 (Priority 0.2)
      if (ctrl && e.key === "'") {
        e.preventDefault();
        toggleGrid();
        return;
      }

      // Ctrl+H: 선택된 요소 숨김/표시 토글 (Priority 3.2)
      if (ctrl && e.key === 'h') {
        if (selectedElementIds.length > 0) {
          e.preventDefault();
          const selectedElements = elements.filter((el) => selectedElementIds.includes(el.id));
          const allVisible = selectedElements.every((el) => el.visible);
          selectedElementIds.forEach((id) => {
            updateElement(id, { visible: !allVisible });
          });
        }
        return;
      }

      // Ctrl+L: 선택된 요소 잠금/해제 토글 (Priority 3.2)
      if (ctrl && e.key === 'l') {
        if (selectedElementIds.length > 0) {
          e.preventDefault();
          const selectedElements = elements.filter((el) => selectedElementIds.includes(el.id));
          const allLocked = selectedElements.every((el) => el.locked);
          selectedElementIds.forEach((id) => {
            updateElement(id, { locked: !allLocked });
          });
        }
        return;
      }

      // 도형 도구 단축키 (입력 중이 아닐 때만)
      if (!ctrl && !e.shiftKey && !e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'v':
            e.preventDefault();
            setCurrentTool('select');
            return;
          case 'r':
            e.preventDefault();
            setCurrentTool('rectangle');
            return;
          case 'o':
            e.preventDefault();
            setCurrentTool('circle');
            return;
          case 'l':
            e.preventDefault();
            setCurrentTool('line');
            return;
          case 't':
            e.preventDefault();
            setCurrentTool('text');
            return;
          case 'i':
            e.preventDefault();
            setCurrentTool('image');
            return;
        }
      }

      // Escape: 선택 해제
      if (e.key === 'Escape') {
        if (selectedElementIds.length > 0) {
          e.preventDefault();
          selectElements([]);
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementIds, elements, deleteElements, selectElements, undo, redo, canUndo, canRedo, groupElements, ungroupElements, saveProject, setCurrentTool, moveLayerUp, moveLayerDown, toggleGrid, duplicateElements, updateElement]);
}
