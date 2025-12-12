import { useEffect, useRef } from 'react';
import { useBuilderStore } from '../store/builderStore';

const AUTO_SAVE_DELAY = 2000; // 2초 디바운스
const AUTO_SAVE_INTERVAL = 30000; // 30초 주기 저장

/**
 * 자동 저장 훅 (Phase 10 + 오토세이브 개선)
 *
 * 두 가지 방식의 자동 저장:
 * 1. 변경 감지 기반: 2초 디바운스로 연속 작업 시 저장 지연
 * 2. 주기적 저장: 30초마다 자동 저장 (autoSaveEnabled 설정 시)
 */
export function useAutoSave() {
  const { saveProject, autoSaveProject, autoSaveEnabled, pages, projectName, currentPage } = useBuilderStore();
  const debounceTimeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const previousStateRef = useRef<string>('');

  // 변경 감지 기반 자동 저장 (디바운스)
  useEffect(() => {
    // 상태 해시 생성 (변경 감지용)
    const currentState = JSON.stringify({
      pages: pages.map((p) => ({
        id: p.id,
        name: p.name,
        elementsCount: p.elements.length, // 개수만 추적
        updatedAt: p.updatedAt.getTime(),
      })),
      projectName,
      currentPageId: currentPage.id,
    });

    // 변경 없으면 스킵
    if (currentState === previousStateRef.current) {
      return;
    }

    previousStateRef.current = currentState;

    // 기존 타이머 클리어
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // 새 타이머 설정 (2초 후 저장)
    debounceTimeoutRef.current = window.setTimeout(() => {
      console.log('⚡ Auto-saving project (debounce)...');
      saveProject();
    }, AUTO_SAVE_DELAY);

    // 클린업
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [pages, projectName, currentPage, saveProject]);

  // 주기적 자동 저장 (30초 간격)
  useEffect(() => {
    // 오토세이브가 비활성화되어 있으면 타이머 정리
    if (!autoSaveEnabled) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // 오토세이브 타이머 설정
    intervalRef.current = window.setInterval(() => {
      const success = autoSaveProject();
      if (success) {
        console.log('💾 Auto-saved project (30s interval)');
      }
    }, AUTO_SAVE_INTERVAL);

    // 클린업: 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoSaveProject, autoSaveEnabled]);
}
