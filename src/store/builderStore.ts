import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { BuilderState, CanvasElement, Page, SelectMode, ToolMode, HistoryEntry, Component, ComponentInstance, Position, Interaction, Breakpoint, DesignTokens } from '../types';
import { alignElements as alignElementsUtil, distributeElements as distributeElementsUtil, getGroupBounds, type AlignType } from '../utils/alignUtils';
import { createGroup } from '../utils/groupUtils';
import {
  createSaveableProject,
  saveProject as saveToStorage,
  getProjectById,
  saveableToPage,
  exportProjectToFile,
  importProjectFromFile,
  deleteProject as deleteFromStorage,
} from '../utils/storageUtils';

// 기본 디자인 토큰 (Priority 4.4)
const defaultDesignTokens: DesignTokens = {
  typography: [
    { id: 'h1', name: 'Heading 1', fontSize: 48, fontWeight: '700', lineHeight: 1.2 },
    { id: 'h2', name: 'Heading 2', fontSize: 36, fontWeight: '700', lineHeight: 1.3 },
    { id: 'h3', name: 'Heading 3', fontSize: 30, fontWeight: '600', lineHeight: 1.3 },
    { id: 'h4', name: 'Heading 4', fontSize: 24, fontWeight: '600', lineHeight: 1.4 },
    { id: 'h5', name: 'Heading 5', fontSize: 20, fontWeight: '600', lineHeight: 1.4 },
    { id: 'h6', name: 'Heading 6', fontSize: 18, fontWeight: '600', lineHeight: 1.4 },
    { id: 'body', name: 'Body', fontSize: 16, fontWeight: '400', lineHeight: 1.6 },
    { id: 'body-sm', name: 'Body Small', fontSize: 14, fontWeight: '400', lineHeight: 1.5 },
    { id: 'caption', name: 'Caption', fontSize: 12, fontWeight: '400', lineHeight: 1.4 },
  ],
  colors: [
    { id: 'primary-500', name: 'Primary', value: '#3B82F6', category: 'primary' },
    { id: 'primary-600', name: 'Primary Dark', value: '#2563EB', category: 'primary' },
    { id: 'secondary-500', name: 'Secondary', value: '#8B5CF6', category: 'secondary' },
    { id: 'accent-500', name: 'Accent', value: '#F59E0B', category: 'accent' },
    { id: 'neutral-900', name: 'Text', value: '#111827', category: 'neutral' },
    { id: 'neutral-600', name: 'Text Secondary', value: '#4B5563', category: 'neutral' },
    { id: 'neutral-100', name: 'Background', value: '#F3F4F6', category: 'neutral' },
    { id: 'success', name: 'Success', value: '#10B981', category: 'semantic' },
    { id: 'error', name: 'Error', value: '#EF4444', category: 'semantic' },
    { id: 'warning', name: 'Warning', value: '#F59E0B', category: 'semantic' },
  ],
  shadows: [
    { id: 'sm', name: 'Small', value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
    { id: 'md', name: 'Medium', value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
    { id: 'lg', name: 'Large', value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' },
    { id: 'xl', name: 'Extra Large', value: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
  ],
  radius: [
    { id: 'none', name: 'None', value: 0 },
    { id: 'sm', name: 'Small', value: 4 },
    { id: 'md', name: 'Medium', value: 8 },
    { id: 'lg', name: 'Large', value: 16 },
    { id: 'full', name: 'Full', value: 9999 },
  ],
};

// 초기 페이지 생성
const createInitialPage = (): Page => ({
  id: nanoid(),
  name: '홈',
  slug: 'home',
  elements: [],
  seoSettings: {
    title: '새 페이지',
    description: '',
    keywords: [],
  },
  createdAt: new Date(),
  updatedAt: new Date(),
});

// 히스토리 기록 헬퍼 함수
function recordHistory(set: any, get: any, action?: string) {
  const state = get();

  // 현재 상태를 히스토리에 기록
  const entry: HistoryEntry = {
    elements: structuredClone(state.elements),
    selectedElementIds: [...state.selectedElementIds],
    timestamp: Date.now(),
    action, // Priority 3.3: 작업 이름 추가
  };

  // 현재 present가 없으면 초기화
  if (!state.history.present) {
    set({
      history: {
        ...state.history,
        present: entry,
      },
    });
    return;
  }

  // 현재 present를 past에 추가
  let newPast = [...state.history.past, state.history.present];

  // 최대 크기 제한 (50개)
  if (newPast.length > state.history.maxSize) {
    newPast = newPast.slice(1); // 가장 오래된 것 제거
  }

  set({
    history: {
      ...state.history,
      past: newPast,
      present: entry,
      future: [], // 새 액션 시 future 초기화
    },
  });
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  // 초기 상태
  elements: [],
  selectedElementIds: [],
  currentTool: 'select',
  isDrawing: false,
  currentPage: createInitialPage(),
  pages: [createInitialPage()],

  // Undo/Redo 히스토리 초기화 (Phase 8)
  history: {
    past: [],
    present: null,
    future: [],
    maxSize: 50,
  },

  // 프로젝트 관리 초기화 (Phase 10)
  projectId: nanoid(),
  projectName: '새 프로젝트',
  lastSaved: null,
  isSaving: false,
  lastAutoSaved: null,
  autoSaveEnabled: true,

  // 컴포넌트 시스템 초기화 (Phase 12)
  components: [],

  // 반응형 디자인 시스템 초기화 (Phase 14)
  currentBreakpoint: 'desktop' as Breakpoint,

  // CSS 클래스 시스템 초기화 (Phase 15.1)
  cssClasses: [],

  // CSS 키프레임 애니메이션 시스템 초기화 (Phase 15.2)
  keyframeAnimations: [],

  // 커스텀 브레이크포인트 시스템 초기화 (Phase 15.3)
  customBreakpoints: [],

  // 캔버스 줌 & 팬 초기화 (Priority 0.1)
  canvasZoom: 1,
  canvasPanX: 0,
  canvasPanY: 0,

  // 그리드 & 스냅 초기화 (Priority 0.2)
  showGrid: true,
  gridSize: 20,
  snapToGrid: false,

  // 스마트 가이드라인 초기화 (Priority 2.1)
  smartGuides: [],

  // 박스 선택 초기화 (Priority 2.2)
  selectionBox: null,

  // 색상 팔레트 초기화 (Priority 3.1)
  colorPalette: [
    { id: 'default-1', color: '#3B82F6', name: 'Blue', createdAt: new Date() },
    { id: 'default-2', color: '#EF4444', name: 'Red', createdAt: new Date() },
    { id: 'default-3', color: '#10B981', name: 'Green', createdAt: new Date() },
    { id: 'default-4', color: '#F59E0B', name: 'Orange', createdAt: new Date() },
    { id: 'default-5', color: '#8B5CF6', name: 'Purple', createdAt: new Date() },
    { id: 'default-6', color: '#EC4899', name: 'Pink', createdAt: new Date() },
    { id: 'default-7', color: '#000000', name: 'Black', createdAt: new Date() },
    { id: 'default-8', color: '#FFFFFF', name: 'White', createdAt: new Date() },
  ],

  // 디자인 토큰 초기화 (Priority 4.4)
  designTokens: defaultDesignTokens,

  // 요소 추가
  addElement: (element: CanvasElement) => {
    // 먼저 현재 상태 기록
    const actionName = element.type === 'shape'
      ? `도형 추가 (${element.shapeType})`
      : element.type === 'text'
      ? '텍스트 추가'
      : element.type === 'image'
      ? '이미지 추가'
      : element.type === 'line'
      ? '직선 추가'
      : element.type === 'arrow'
      ? '화살표 추가'
      : '요소 추가';
    recordHistory(set, get, actionName);

    set((state) => {
      const newElements: CanvasElement[] = [...state.elements, element];
      const updatedPage: Page = {
        ...state.currentPage,
        elements: newElements,
        updatedAt: new Date(),
      };

      return {
        elements: newElements,
        currentPage: updatedPage,
        pages: state.pages.map((p) =>
          p.id === updatedPage.id ? updatedPage : p
        ),
        // 요소 추가 후 자동으로 선택 도구로 전환
        currentTool: 'select' as ToolMode,
        selectedElementIds: [element.id],
      };
    });
  },

  // 요소 업데이트
  updateElement: (id: string, updates: Partial<CanvasElement>) => {
    // 먼저 현재 상태 기록
    recordHistory(set, get);

    set((state) => {
      const element = state.elements.find((el) => el.id === id);

      // 그룹 이동 시 자식도 함께 이동 (Phase 8)
      if (element && element.type === 'group' && updates.position) {
        const deltaX = updates.position.x - element.position.x;
        const deltaY = updates.position.y - element.position.y;

        const newElements = state.elements.map((el) => {
          // 자식 요소 이동
          if (element.childElementIds.includes(el.id)) {
            if (el.type === 'line' || el.type === 'arrow') {
              return {
                ...el,
                startPoint: {
                  x: el.startPoint.x + deltaX,
                  y: el.startPoint.y + deltaY,
                },
                endPoint: {
                  x: el.endPoint.x + deltaX,
                  y: el.endPoint.y + deltaY,
                },
              };
            }
            return {
              ...el,
              position: {
                x: el.position.x + deltaX,
                y: el.position.y + deltaY,
              },
            };
          }
          // 그룹 자체 업데이트
          if (el.id === id) {
            return { ...el, ...updates } as CanvasElement;
          }
          return el;
        });

        const updatedPage: Page = {
          ...state.currentPage,
          elements: newElements,
          updatedAt: new Date(),
        };

        return {
          elements: newElements,
          currentPage: updatedPage,
          pages: state.pages.map((p) =>
            p.id === updatedPage.id ? updatedPage : p
          ),
        };
      }

      // 일반 업데이트 (기존 로직)
      const newElements: CanvasElement[] = state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } as CanvasElement : el
      );
      const updatedPage: Page = {
        ...state.currentPage,
        elements: newElements,
        updatedAt: new Date(),
      };

      return {
        elements: newElements,
        currentPage: updatedPage,
        pages: state.pages.map((p) =>
          p.id === updatedPage.id ? updatedPage : p
        ),
      };
    });
  },

  // 요소 삭제
  deleteElements: (ids: string[]) => {
    // 먼저 현재 상태 기록
    const actionName = ids.length === 1
      ? '요소 삭제'
      : `요소 삭제 (${ids.length}개)`;
    recordHistory(set, get, actionName);

    set((state) => {
      const newElements: CanvasElement[] = state.elements.filter((el) => !ids.includes(el.id));
      const updatedPage: Page = {
        ...state.currentPage,
        elements: newElements,
        updatedAt: new Date(),
      };

      return {
        elements: newElements,
        currentPage: updatedPage,
        pages: state.pages.map((p) =>
          p.id === updatedPage.id ? updatedPage : p
        ),
        selectedElementIds: [],
      };
    });
  },

  // 요소 복제 (Priority 1.1)
  duplicateElements: (ids: string[], offset: { x: number; y: number } = { x: 20, y: 20 }) => {
    // 먼저 현재 상태 기록
    const actionName = ids.length === 1
      ? '요소 복제'
      : `요소 복제 (${ids.length}개)`;
    recordHistory(set, get, actionName);

    const state = get();
    const elementsToDuplicate = state.elements.filter((el) => ids.includes(el.id));

    if (elementsToDuplicate.length === 0) return [];

    const duplicatedElements: CanvasElement[] = elementsToDuplicate.map((el) => {
      const cloned = structuredClone(el);
      cloned.id = nanoid();

      // 위치 조정
      if (cloned.type === 'line' || cloned.type === 'arrow') {
        if ('startPoint' in cloned && 'endPoint' in cloned) {
          cloned.startPoint = {
            x: cloned.startPoint.x + offset.x,
            y: cloned.startPoint.y + offset.y,
          };
          cloned.endPoint = {
            x: cloned.endPoint.x + offset.x,
            y: cloned.endPoint.y + offset.y,
          };
        }
      } else {
        cloned.position = {
          x: cloned.position.x + offset.x,
          y: cloned.position.y + offset.y,
        };
      }

      // 고유한 zIndex
      cloned.zIndex = Date.now() + Math.random();

      return cloned;
    });

    // 상태 업데이트
    set((state) => {
      const newElements = [...state.elements, ...duplicatedElements];
      const updatedPage: Page = {
        ...state.currentPage,
        elements: newElements,
        updatedAt: new Date(),
      };

      return {
        elements: newElements,
        currentPage: updatedPage,
        pages: state.pages.map((p) =>
          p.id === updatedPage.id ? updatedPage : p
        ),
        selectedElementIds: duplicatedElements.map((el) => el.id),
      };
    });

    return duplicatedElements.map((el) => el.id);
  },

  // 요소 선택 (히스토리에 기록하지 않음)
  selectElements: (ids: string[], mode: SelectMode = 'replace') => {
    set((state) => {
      if (mode === 'replace') {
        return { selectedElementIds: ids };
      } else {
        // 'add' 모드: 기존 선택에 추가
        const newSelection = [...state.selectedElementIds];
        ids.forEach((id) => {
          const index = newSelection.indexOf(id);
          if (index > -1) {
            // 이미 선택되어 있으면 선택 해제
            newSelection.splice(index, 1);
          } else {
            // 선택되어 있지 않으면 추가
            newSelection.push(id);
          }
        });
        return { selectedElementIds: newSelection };
      }
    });
  },

  // 도구 변경 (히스토리에 기록하지 않음)
  setCurrentTool: (tool: ToolMode) => {
    set({ currentTool: tool });
  },

  // 그리기 상태 변경 (히스토리에 기록하지 않음)
  setIsDrawing: (isDrawing: boolean) => {
    set({ isDrawing });
  },

  // 페이지 추가
  addPage: (pageData?: Partial<Page>) => {
    set((state) => {
      const newPage: Page = {
        id: nanoid(),
        name: pageData?.name || `페이지 ${state.pages.length + 1}`,
        slug: pageData?.slug || `page-${state.pages.length + 1}`,
        elements: pageData?.elements || [],
        seoSettings: pageData?.seoSettings || {
          title: '',
          description: '',
          keywords: [],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return {
        pages: [...state.pages, newPage],
        currentPage: newPage,
        elements: newPage.elements,
        selectedElementIds: [],
        // 페이지 변경 시 히스토리 초기화
        history: {
          past: [],
          present: null,
          future: [],
          maxSize: 50,
        },
      };
    });
  },

  // 페이지 삭제
  deletePage: (id: string) => {
    set((state) => {
      // 최소 1개의 페이지는 유지
      if (state.pages.length <= 1) {
        return state;
      }

      const newPages = state.pages.filter((p) => p.id !== id);
      const isCurrentPage = state.currentPage.id === id;

      if (isCurrentPage) {
        // 삭제되는 페이지가 현재 페이지면 첫 번째 페이지로 이동
        const newCurrentPage = newPages[0];
        return {
          pages: newPages,
          currentPage: newCurrentPage,
          elements: newCurrentPage.elements,
          selectedElementIds: [],
          // 페이지 변경 시 히스토리 초기화
          history: {
            past: [],
            present: null,
            future: [],
            maxSize: 50,
          },
        };
      }

      return { pages: newPages };
    });
  },

  // 현재 페이지 변경
  setCurrentPage: (id: string) => {
    set((state) => {
      const page = state.pages.find((p) => p.id === id);
      if (!page) return state;

      return {
        currentPage: page,
        elements: page.elements,
        selectedElementIds: [],
        currentTool: 'select' as ToolMode,
        // 페이지 변경 시 히스토리 초기화
        history: {
          past: [],
          present: null,
          future: [],
          maxSize: 50,
        },
      };
    });
  },

  // 페이지 전환 (setCurrentPage의 별칭)
  switchPage: (id: string) => {
    get().setCurrentPage(id);
  },

  // 페이지 정보 업데이트 (Phase 9)
  updatePage: (id: string, updates: Partial<Omit<Page, 'id' | 'elements' | 'createdAt'>>) => {
    set((state) => {
      const newPages = state.pages.map((p) => {
        if (p.id === id) {
          const updatedPage = {
            ...p,
            ...updates,
            updatedAt: new Date(),
          };

          // 현재 페이지면 currentPage도 업데이트
          if (state.currentPage.id === id) {
            return updatedPage;
          }
          return updatedPage;
        }
        return p;
      });

      const newCurrentPage = newPages.find((p) => p.id === state.currentPage.id) || state.currentPage;

      return {
        pages: newPages,
        currentPage: newCurrentPage,
      };
    });
  },

  // 페이지 요소 업데이트 (전체 교체)
  updatePageElements: (elements: CanvasElement[]) => {
    // 먼저 현재 상태 기록
    recordHistory(set, get);

    set((state) => {
      const updatedPage: Page = {
        ...state.currentPage,
        elements,
        updatedAt: new Date(),
      };

      return {
        elements,
        currentPage: updatedPage,
        pages: state.pages.map((p) =>
          p.id === updatedPage.id ? updatedPage : p
        ),
      };
    });
  },

  // 레이어 위로 이동 (zIndex 증가)
  moveLayerUp: (id: string) => {
    // 먼저 현재 상태 기록
    recordHistory(set, get, '레이어 위로 이동');

    set((state) => {
      const element = state.elements.find((el) => el.id === id);
      if (!element) return state;

      // 현재 zIndex보다 바로 위에 있는 요소 찾기
      const elementsAbove = state.elements
        .filter((el) => el.zIndex > element.zIndex)
        .sort((a, b) => a.zIndex - b.zIndex);

      if (elementsAbove.length === 0) {
        // 이미 최상위면 아무것도 안 함
        return state;
      }

      // 바로 위 요소와 zIndex 교환
      const nextElement = elementsAbove[0];
      const newZIndex = nextElement.zIndex;
      const oldZIndex = element.zIndex;

      const newElements: CanvasElement[] = state.elements.map((el) => {
        if (el.id === id) {
          return { ...el, zIndex: newZIndex } as CanvasElement;
        } else if (el.id === nextElement.id) {
          return { ...el, zIndex: oldZIndex } as CanvasElement;
        }
        return el;
      });

      const updatedPage: Page = {
        ...state.currentPage,
        elements: newElements,
        updatedAt: new Date(),
      };

      return {
        elements: newElements,
        currentPage: updatedPage,
        pages: state.pages.map((p) =>
          p.id === updatedPage.id ? updatedPage : p
        ),
      };
    });
  },

  // 레이어 아래로 이동 (zIndex 감소)
  moveLayerDown: (id: string) => {
    // 먼저 현재 상태 기록
    recordHistory(set, get, '레이어 아래로 이동');

    set((state) => {
      const element = state.elements.find((el) => el.id === id);
      if (!element) return state;

      // 현재 zIndex보다 바로 아래에 있는 요소 찾기
      const elementsBelow = state.elements
        .filter((el) => el.zIndex < element.zIndex)
        .sort((a, b) => b.zIndex - a.zIndex);

      if (elementsBelow.length === 0) {
        // 이미 최하위면 아무것도 안 함
        return state;
      }

      // 바로 아래 요소와 zIndex 교환
      const prevElement = elementsBelow[0];
      const newZIndex = prevElement.zIndex;
      const oldZIndex = element.zIndex;

      const newElements: CanvasElement[] = state.elements.map((el) => {
        if (el.id === id) {
          return { ...el, zIndex: newZIndex } as CanvasElement;
        } else if (el.id === prevElement.id) {
          return { ...el, zIndex: oldZIndex } as CanvasElement;
        }
        return el;
      });

      const updatedPage: Page = {
        ...state.currentPage,
        elements: newElements,
        updatedAt: new Date(),
      };

      return {
        elements: newElements,
        currentPage: updatedPage,
        pages: state.pages.map((p) =>
          p.id === updatedPage.id ? updatedPage : p
        ),
      };
    });
  },

  // Undo (Phase 8)
  undo: () => {
    set((state) => {
      if (state.history.past.length === 0) return state;

      const previous = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, -1);

      const updatedPage: Page = {
        ...state.currentPage,
        elements: previous.elements,
        updatedAt: new Date(),
      };

      return {
        elements: previous.elements,
        selectedElementIds: previous.selectedElementIds,
        currentPage: updatedPage,
        pages: state.pages.map((p) =>
          p.id === updatedPage.id ? updatedPage : p
        ),
        history: {
          ...state.history,
          past: newPast,
          present: previous,
          future: [state.history.present!, ...state.history.future],
        },
      };
    });
  },

  // Redo (Phase 8)
  redo: () => {
    set((state) => {
      if (state.history.future.length === 0) return state;

      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);

      const updatedPage: Page = {
        ...state.currentPage,
        elements: next.elements,
        updatedAt: new Date(),
      };

      return {
        elements: next.elements,
        selectedElementIds: next.selectedElementIds,
        currentPage: updatedPage,
        pages: state.pages.map((p) =>
          p.id === updatedPage.id ? updatedPage : p
        ),
        history: {
          ...state.history,
          past: [...state.history.past, state.history.present!],
          present: next,
          future: newFuture,
        },
      };
    });
  },

  // Undo 가능 여부 체크
  canUndo: () => get().history.past.length > 0,

  // Redo 가능 여부 체크
  canRedo: () => get().history.future.length > 0,

  // 히스토리 특정 상태로 점프 (Priority 1.3)
  jumpToHistoryState: (targetIndex: number) => {
    set((state) => {
      const allStates = [...state.history.past, state.history.present!];

      if (targetIndex < 0 || targetIndex >= allStates.length) return state;

      const targetState = allStates[targetIndex];
      const newPast = allStates.slice(0, targetIndex);
      const newFuture = allStates.slice(targetIndex + 1);

      const updatedPage: Page = {
        ...state.currentPage,
        elements: targetState.elements,
        updatedAt: new Date(),
      };

      return {
        elements: targetState.elements,
        selectedElementIds: targetState.selectedElementIds,
        currentPage: updatedPage,
        pages: state.pages.map((p) =>
          p.id === updatedPage.id ? updatedPage : p
        ),
        history: {
          ...state.history,
          past: newPast,
          present: targetState,
          future: newFuture,
        },
      };
    });
  },

  // 정렬 (Phase 8)
  alignElements: (alignType: AlignType) => {
    // 먼저 현재 상태 기록
    const alignNames: Record<AlignType, string> = {
      left: '왼쪽 정렬',
      right: '오른쪽 정렬',
      top: '상단 정렬',
      bottom: '하단 정렬',
      'center-h': '가로 중앙 정렬',
      'center-v': '세로 중앙 정렬',
      'distribute-h': '가로 균등 분배',
      'distribute-v': '세로 균등 분배',
    };
    recordHistory(set, get, alignNames[alignType]);

    set((state) => {
      if (state.selectedElementIds.length < 2) return state;

      const selectedElements = state.elements.filter(el =>
        state.selectedElementIds.includes(el.id)
      );

      const aligned = alignElementsUtil(selectedElements, alignType);

      // 정렬된 요소들로 업데이트
      const newElements = state.elements.map(el => {
        const alignedEl = aligned.find(a => a.id === el.id);
        return alignedEl || el;
      });

      const updatedPage: Page = {
        ...state.currentPage,
        elements: newElements,
        updatedAt: new Date(),
      };

      return {
        elements: newElements,
        currentPage: updatedPage,
        pages: state.pages.map((p) =>
          p.id === updatedPage.id ? updatedPage : p
        ),
      };
    });
  },

  // 균등 분배 (Phase 8)
  distributeElements: (direction: 'horizontal' | 'vertical') => {
    // 먼저 현재 상태 기록
    recordHistory(set, get);

    set((state) => {
      if (state.selectedElementIds.length < 3) return state;

      const selectedElements = state.elements.filter(el =>
        state.selectedElementIds.includes(el.id)
      );

      const distributed = distributeElementsUtil(selectedElements, direction);

      const newElements = state.elements.map(el => {
        const distributedEl = distributed.find(d => d.id === el.id);
        return distributedEl || el;
      });

      const updatedPage: Page = {
        ...state.currentPage,
        elements: newElements,
        updatedAt: new Date(),
      };

      return {
        elements: newElements,
        currentPage: updatedPage,
        pages: state.pages.map((p) =>
          p.id === updatedPage.id ? updatedPage : p
        ),
      };
    });
  },

  // 그룹 생성 (Phase 8)
  groupElements: () => {
    // 먼저 현재 상태 기록
    recordHistory(set, get, '그룹 생성');

    set((state) => {
      if (state.selectedElementIds.length < 2) return state;

      const selectedElements = state.elements.filter(el =>
        state.selectedElementIds.includes(el.id)
      );

      const group = createGroup(selectedElements);

      const newElements = [...state.elements, group];

      const updatedPage: Page = {
        ...state.currentPage,
        elements: newElements,
        updatedAt: new Date(),
      };

      return {
        elements: newElements,
        selectedElementIds: [group.id],
        currentPage: updatedPage,
        pages: state.pages.map((p) =>
          p.id === updatedPage.id ? updatedPage : p
        ),
      };
    });
  },

  // 그룹 해제 (Phase 8)
  ungroupElements: (groupId: string) => {
    // 먼저 현재 상태 기록
    recordHistory(set, get, '그룹 해제');

    set((state) => {
      const group = state.elements.find(el => el.id === groupId);
      if (!group || group.type !== 'group') return state;

      // 그룹만 제거 (자식 요소는 유지)
      const newElements = state.elements.filter(el => el.id !== groupId);

      const updatedPage: Page = {
        ...state.currentPage,
        elements: newElements,
        updatedAt: new Date(),
      };

      return {
        elements: newElements,
        selectedElementIds: group.childElementIds,
        currentPage: updatedPage,
        pages: state.pages.map((p) =>
          p.id === updatedPage.id ? updatedPage : p
        ),
      };
    });
  },

  // ============================================
  // 프로젝트 관리 (Phase 10)
  // ============================================

  /**
   * 프로젝트 이름 변경
   */
  setProjectName: (name: string) => {
    set({ projectName: name });
  },

  /**
   * 현재 프로젝트 저장
   */
  saveProject: () => {
    const state = get();
    set({ isSaving: true });

    const saveableProject = createSaveableProject(
      state.projectId,
      state.projectName,
      state.pages,
      state.currentPage.id,
      state.components,  // Phase 12
      state.cssClasses,  // Phase 15.1
      state.keyframeAnimations,  // Phase 15.2
      state.customBreakpoints,  // Phase 15.3
      state.designTokens  // Priority 4.4
    );

    const success = saveToStorage(saveableProject);

    set({
      isSaving: false,
      lastSaved: success ? new Date() : state.lastSaved,
    });

    return success;
  },

  /**
   * 자동 저장 (오토세이브 개선)
   */
  autoSaveProject: () => {
    const state = get();

    // 오토세이브가 비활성화되어 있으면 실행하지 않음
    if (!state.autoSaveEnabled) return false;

    const saveableProject = createSaveableProject(
      state.projectId,
      state.projectName,
      state.pages,
      state.currentPage.id,
      state.components,
      state.cssClasses,
      state.keyframeAnimations,
      state.customBreakpoints,
      state.designTokens  // Priority 4.4
    );

    const success = saveToStorage(saveableProject);

    if (success) {
      set({ lastAutoSaved: new Date() });
    }

    return success;
  },

  /**
   * 오토세이브 토글
   */
  toggleAutoSave: () => {
    set((state) => ({ autoSaveEnabled: !state.autoSaveEnabled }));
  },

  /**
   * 프로젝트 불러오기
   */
  loadProject: (projectId: string) => {
    const saveableProject = getProjectById(projectId);
    if (!saveableProject) return false;

    const pages = saveableProject.pages.map(saveableToPage);
    const currentPage =
      pages.find((p) => p.id === saveableProject.currentPageId) || pages[0];

    // 컴포넌트 불러오기 (Phase 12)
    const components = (saveableProject.components || []).map((sc) => ({
      ...sc,
      createdAt: new Date(sc.createdAt),
      updatedAt: new Date(sc.updatedAt),
    }));

    // CSS 클래스 불러오기 (Phase 15.1)
    const cssClasses = (saveableProject.cssClasses || []).map((sc) => ({
      ...sc,
      createdAt: new Date(sc.createdAt),
      updatedAt: new Date(sc.updatedAt),
    }));

    // 키프레임 애니메이션 불러오기 (Phase 15.2)
    const keyframeAnimations = (saveableProject.keyframeAnimations || []).map((sa) => ({
      ...sa,
      createdAt: new Date(sa.createdAt),
      updatedAt: new Date(sa.updatedAt),
    }));

    // 커스텀 브레이크포인트 불러오기 (Phase 15.3)
    const customBreakpoints = saveableProject.customBreakpoints || [];

    // 디자인 토큰 불러오기 (Priority 4.4)
    const designTokens = saveableProject.designTokens || defaultDesignTokens;

    set({
      projectId: saveableProject.id,
      projectName: saveableProject.name,
      pages,
      currentPage,
      elements: currentPage.elements,
      selectedElementIds: [],
      components,  // Phase 12
      cssClasses,  // Phase 15.1
      keyframeAnimations,  // Phase 15.2
      customBreakpoints,  // Phase 15.3
      designTokens,  // Priority 4.4
      lastSaved: new Date(saveableProject.updatedAt),
      // 페이지 전환 시 히스토리 초기화
      history: {
        past: [],
        present: null,
        future: [],
        maxSize: 50,
      },
    });

    return true;
  },

  /**
   * 새 프로젝트 생성
   */
  createNewProject: (name: string) => {
    const initialPage = createInitialPage();
    const projectId = nanoid();

    set({
      projectId,
      projectName: name,
      pages: [initialPage],
      currentPage: initialPage,
      elements: [],
      selectedElementIds: [],
      currentTool: 'select',
      components: [],  // Phase 12
      cssClasses: [],  // Phase 15.1
      keyframeAnimations: [],  // Phase 15.2
      customBreakpoints: [],  // Phase 15.3
      designTokens: defaultDesignTokens,  // Priority 4.4
      lastSaved: null,
      history: {
        past: [],
        present: null,
        future: [],
        maxSize: 50,
      },
    });

    // 즉시 저장
    get().saveProject();
  },

  /**
   * 프로젝트 이름 변경
   */
  renameProject: (name: string) => {
    set({ projectName: name });
    get().saveProject();
  },

  /**
   * 프로젝트 삭제
   */
  deleteProjectById: (projectId: string) => {
    return deleteFromStorage(projectId);
  },

  /**
   * 프로젝트 JSON 파일로 내보내기
   */
  exportProject: () => {
    const state = get();
    const saveableProject = createSaveableProject(
      state.projectId,
      state.projectName,
      state.pages,
      state.currentPage.id,
      state.components  // Phase 12
    );
    exportProjectToFile(saveableProject);
  },

  /**
   * JSON 파일에서 프로젝트 가져오기
   */
  importProject: async (file: File) => {
    try {
      const project = await importProjectFromFile(file);

      // 새 ID 생성 (중복 방지)
      const newProjectId = nanoid();
      project.id = newProjectId;
      project.name = `${project.name} (imported)`;

      // 저장
      saveToStorage(project);

      // 불러오기
      get().loadProject(newProjectId);
    } catch (error) {
      console.error('Import failed:', error);
      alert('프로젝트 가져오기에 실패했습니다.\n파일 형식을 확인해주세요.');
    }
  },

  /**
   * 현재 프로젝트 복제
   */
  duplicateProject: () => {
    const state = get();
    const saveableProject = createSaveableProject(
      nanoid(),
      `${state.projectName} (copy)`,
      state.pages,
      state.currentPage.id,
      state.components  // Phase 12
    );
    saveToStorage(saveableProject);
  },

  // ============================================
  // 컴포넌트 시스템 (Phase 12)
  // ============================================

  /**
   * 컴포넌트 생성 (선택된 요소들로)
   */
  createComponent: (name: string, description?: string) => {
    const state = get();

    // 최소 1개 이상 선택 확인
    if (state.selectedElementIds.length === 0) {
      return null;
    }

    // 선택된 요소들 복사
    const selectedElements = state.elements.filter((el) =>
      state.selectedElementIds.includes(el.id)
    );

    // 요소들을 상대 좌표로 변환 (0,0 기준)
    const bounds = getGroupBounds(selectedElements);
    const normalizedElements = selectedElements.map((el) => {
      const normalized = structuredClone(el);

      // 위치 정규화
      if (normalized.type === 'line' || normalized.type === 'arrow') {
        // 타입 가드로 확인
        if ('startPoint' in normalized && 'endPoint' in normalized) {
          normalized.startPoint = {
            x: normalized.startPoint.x - bounds.x,
            y: normalized.startPoint.y - bounds.y,
          };
          normalized.endPoint = {
            x: normalized.endPoint.x - bounds.x,
            y: normalized.endPoint.y - bounds.y,
          };
        }
      } else {
        normalized.position = {
          x: normalized.position.x - bounds.x,
          y: normalized.position.y - bounds.y,
        };
      }

      return normalized;
    });

    const component: Component = {
      id: nanoid(),
      name,
      description,
      elements: normalizedElements,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      components: [...state.components, component],
    }));

    // 자동 저장
    get().saveProject();

    return component;
  },

  /**
   * 컴포넌트 인스턴스 추가 (캔버스에 드롭)
   */
  addComponentInstance: (componentId: string, position: Position) => {
    const state = get();
    const component = state.components.find((c) => c.id === componentId);

    if (!component) return;

    // 1. 컴포넌트 요소들 복사 및 위치 조정
    const instanceElements = component.elements.map((el) => {
      const cloned = structuredClone(el);
      cloned.id = nanoid(); // 새 ID 생성

      if (cloned.type === 'line' || cloned.type === 'arrow') {
        // 타입 가드로 확인
        if ('startPoint' in cloned && 'endPoint' in cloned && 'startPoint' in el && 'endPoint' in el) {
          cloned.startPoint = {
            x: el.startPoint.x + position.x,
            y: el.startPoint.y + position.y,
          };
          cloned.endPoint = {
            x: el.endPoint.x + position.x,
            y: el.endPoint.y + position.y,
          };
        }
      } else {
        cloned.position = {
          x: el.position.x + position.x,
          y: el.position.y + position.y,
        };
      }

      cloned.zIndex = Date.now() + Math.random(); // 고유한 zIndex

      return cloned;
    });

    // 2. ComponentInstance 생성
    const bounds = getGroupBounds(component.elements);
    const instance: ComponentInstance = {
      id: nanoid(),
      type: 'component',
      componentId,
      childElementIds: instanceElements.map((el) => el.id),
      overrides: {},
      isDetached: false,
      position,
      size: { width: bounds.width, height: bounds.height },
      rotation: 0,
      zIndex: Date.now(),
      locked: false,
      visible: true,
    };

    // 3. 히스토리 기록
    recordHistory(set, get);

    // 4. 인스턴스와 자식 요소들 모두 추가
    set((state) => {
      const newElements = [...state.elements, ...instanceElements, instance];
      const updatedPage: Page = {
        ...state.currentPage,
        elements: newElements,
        updatedAt: new Date(),
      };

      return {
        elements: newElements,
        currentPage: updatedPage,
        pages: state.pages.map((p) =>
          p.id === updatedPage.id ? updatedPage : p
        ),
        selectedElementIds: [instance.id],
        currentTool: 'select' as ToolMode,
      };
    });
  },

  /**
   * 컴포넌트 수정
   */
  updateComponent: (id: string, updates: Partial<Component>) => {
    set((state) => ({
      components: state.components.map((c) =>
        c.id === id
          ? { ...c, ...updates, updatedAt: new Date() }
          : c
      ),
    }));

    // 인스턴스 동기화
    get().syncComponentInstances(id);

    // 자동 저장
    get().saveProject();
  },

  /**
   * 마스터 수정 시 모든 인스턴스 동기화
   */
  syncComponentInstances: (componentId: string) => {
    const state = get();
    const component = state.components.find((c) => c.id === componentId);

    if (!component) return;

    // 모든 인스턴스 찾기
    const instances = state.elements.filter(
      (el): el is ComponentInstance =>
        el.type === 'component' &&
        el.componentId === componentId &&
        !el.isDetached
    );

    if (instances.length === 0) return;

    recordHistory(set, get);

    set((state) => {
      let newElements = [...state.elements];

      instances.forEach((instance) => {
        // 기존 자식 요소들 제거
        newElements = newElements.filter(
          (el) => !instance.childElementIds.includes(el.id)
        );

        // 마스터에서 새 요소들 생성
        const updatedChildren = component.elements.map((el) => {
          const newEl = structuredClone(el);
          newEl.id = nanoid();

          // 위치 조정
          if (newEl.type === 'line' || newEl.type === 'arrow') {
            // 타입 가드로 확인
            if ('startPoint' in newEl && 'endPoint' in newEl && 'startPoint' in el && 'endPoint' in el) {
              newEl.startPoint = {
                x: el.startPoint.x + instance.position.x,
                y: el.startPoint.y + instance.position.y,
              };
              newEl.endPoint = {
                x: el.endPoint.x + instance.position.x,
                y: el.endPoint.y + instance.position.y,
              };
            }
          } else {
            newEl.position = {
              x: el.position.x + instance.position.x,
              y: el.position.y + instance.position.y,
            };
          }

          newEl.zIndex = Date.now() + Math.random();

          // 오버라이드 적용
          const overrideKey = el.id; // 원래 마스터 요소의 ID
          if (instance.overrides[overrideKey]) {
            Object.assign(newEl, instance.overrides[overrideKey]);
          }

          return newEl;
        });

        // 인스턴스 업데이트
        const updatedInstance: ComponentInstance = {
          ...instance,
          childElementIds: updatedChildren.map((el) => el.id),
        };

        // 새 요소들 추가
        newElements = [
          ...newElements.filter((el) => el.id !== instance.id),
          ...updatedChildren,
          updatedInstance,
        ];
      });

      const updatedPage: Page = {
        ...state.currentPage,
        elements: newElements,
        updatedAt: new Date(),
      };

      return {
        elements: newElements,
        currentPage: updatedPage,
        pages: state.pages.map((p) =>
          p.id === updatedPage.id ? updatedPage : p
        ),
      };
    });
  },

  /**
   * 컴포넌트 삭제
   */
  deleteComponent: (id: string) => {
    const state = get();

    // 해당 컴포넌트를 사용하는 인스턴스들 찾기
    const instances = state.elements.filter(
      (el): el is ComponentInstance =>
        el.type === 'component' && el.componentId === id
    );

    // 인스턴스들을 자동으로 detach
    instances.forEach((instance) => {
      get().detachComponentInstance(instance.id);
    });

    // 컴포넌트 삭제
    set((state) => ({
      components: state.components.filter((c) => c.id !== id),
    }));

    // 자동 저장
    get().saveProject();
  },

  /**
   * 인스턴스 속성 오버라이드
   */
  overrideComponentInstance: (instanceId: string, propertyPath: string, value: any) => {
    recordHistory(set, get);

    set((state) => {
      const newElements = state.elements.map((el) => {
        if (el.id === instanceId && el.type === 'component') {
          const instance = el as ComponentInstance;
          return {
            ...instance,
            overrides: {
              ...instance.overrides,
              [propertyPath]: value,
            },
          };
        }
        return el;
      });

      const updatedPage: Page = {
        ...state.currentPage,
        elements: newElements,
        updatedAt: new Date(),
      };

      return {
        elements: newElements,
        currentPage: updatedPage,
        pages: state.pages.map((p) =>
          p.id === updatedPage.id ? updatedPage : p
        ),
      };
    });
  },

  /**
   * 인스턴스 detach (마스터 연결 끊기)
   */
  detachComponentInstance: (instanceId: string) => {
    recordHistory(set, get);

    set((state) => {
      const newElements = state.elements.map((el) => {
        if (el.id === instanceId && el.type === 'component') {
          const instance = el as ComponentInstance;
          // 일반 그룹으로 변환
          const group: CanvasElement = {
            id: instance.id,
            type: 'group',
            childElementIds: instance.childElementIds,
            position: instance.position,
            size: instance.size,
            rotation: instance.rotation,
            zIndex: instance.zIndex,
            locked: instance.locked,
            visible: instance.visible,
          };
          return group;
        }
        return el;
      });

      const updatedPage: Page = {
        ...state.currentPage,
        elements: newElements,
        updatedAt: new Date(),
      };

      return {
        elements: newElements,
        currentPage: updatedPage,
        pages: state.pages.map((p) =>
          p.id === updatedPage.id ? updatedPage : p
        ),
      };
    });
  },

  /**
   * 컴포넌트 복제
   */
  duplicateComponent: (id: string) => {
    const state = get();
    const component = state.components.find((c) => c.id === id);

    if (!component) {
      throw new Error('Component not found');
    }

    const duplicated: Component = {
      ...structuredClone(component),
      id: nanoid(),
      name: `${component.name} (copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      components: [...state.components, duplicated],
    }));

    // 자동 저장
    get().saveProject();

    return duplicated;
  },

  // ============================================
  // Phase 13: 인터랙션 시스템
  // ============================================

  /**
   * 인터랙션 추가
   */
  addInteraction: (elementId: string, interaction: Omit<Interaction, 'id'>) => {
    const state = get();
    const element = state.elements.find((el) => el.id === elementId);

    if (!element) {
      throw new Error('Element not found');
    }

    // 히스토리 기록
    recordHistory(set, get);

    const newInteraction: Interaction = {
      ...interaction,
      id: nanoid(),
    };

    const interactions = element.interactions || [];

    get().updateElement(elementId, {
      interactions: [...interactions, newInteraction],
    });
  },

  /**
   * 인터랙션 업데이트
   */
  updateInteraction: (
    elementId: string,
    interactionId: string,
    updates: Partial<Interaction>
  ) => {
    const state = get();
    const element = state.elements.find((el) => el.id === elementId);

    if (!element || !element.interactions) {
      throw new Error('Element or interactions not found');
    }

    // 히스토리 기록
    recordHistory(set, get);

    const updatedInteractions = element.interactions.map((interaction) =>
      interaction.id === interactionId
        ? { ...interaction, ...updates }
        : interaction
    );

    get().updateElement(elementId, {
      interactions: updatedInteractions,
    });
  },

  /**
   * 인터랙션 삭제
   */
  removeInteraction: (elementId: string, interactionId: string) => {
    const state = get();
    const element = state.elements.find((el) => el.id === elementId);

    if (!element || !element.interactions) {
      throw new Error('Element or interactions not found');
    }

    // 히스토리 기록
    recordHistory(set, get);

    const updatedInteractions = element.interactions.filter(
      (interaction) => interaction.id !== interactionId
    );

    get().updateElement(elementId, {
      interactions: updatedInteractions,
    });
  },

  /**
   * 인터랙션 활성화/비활성화 토글
   */
  toggleInteraction: (elementId: string, interactionId: string) => {
    const state = get();
    const element = state.elements.find((el) => el.id === elementId);

    if (!element || !element.interactions) {
      throw new Error('Element or interactions not found');
    }

    const interaction = element.interactions.find((i) => i.id === interactionId);

    if (!interaction) {
      throw new Error('Interaction not found');
    }

    get().updateInteraction(elementId, interactionId, {
      enabled: !interaction.enabled,
    });
  },

  /**
   * 앵커 ID 설정
   */
  setAnchorId: (elementId: string, anchorId: string) => {
    const state = get();
    const element = state.elements.find((el) => el.id === elementId);

    if (!element) {
      throw new Error('Element not found');
    }

    // 히스토리 기록
    recordHistory(set, get);

    get().updateElement(elementId, {
      anchorId: anchorId.trim() || undefined,
    });
  },

  // ============================================
  // Phase 14: 반응형 디자인 시스템
  // ============================================

  /**
   * 현재 브레이크포인트 변경 (히스토리에 기록하지 않음)
   */
  setCurrentBreakpoint: (breakpoint: Breakpoint) => {
    set({ currentBreakpoint: breakpoint });
  },

  /**
   * 반응형 오버라이드 설정
   */
  setResponsiveOverride: (
    elementId: string,
    breakpoint: Breakpoint,
    updates: Partial<CanvasElement>
  ) => {
    const state = get();
    const element = state.elements.find((el) => el.id === elementId);

    if (!element) {
      throw new Error('Element not found');
    }

    // desktop은 오버라이드 불가 (기본값)
    if (breakpoint === 'desktop') {
      return;
    }

    // 히스토리 기록
    recordHistory(set, get);

    const currentOverrides = element.responsiveOverrides || {};
    const breakpointOverrides = currentOverrides[breakpoint] || {};

    get().updateElement(elementId, {
      responsiveOverrides: {
        ...currentOverrides,
        [breakpoint]: {
          ...breakpointOverrides,
          ...updates,
        },
      },
    });
  },

  /**
   * 반응형 오버라이드 제거
   */
  clearResponsiveOverride: (elementId: string, breakpoint: Breakpoint) => {
    const state = get();
    const element = state.elements.find((el) => el.id === elementId);

    if (!element || !element.responsiveOverrides || breakpoint === 'desktop') {
      return;
    }

    // 히스토리 기록
    recordHistory(set, get);

    const newOverrides = { ...element.responsiveOverrides };
    delete newOverrides[breakpoint as 'tablet' | 'mobile'];

    get().updateElement(elementId, {
      responsiveOverrides: Object.keys(newOverrides).length > 0 ? newOverrides : undefined,
    });
  },

  /**
   * 특정 브레이크포인트의 해결된 속성 가져오기
   * 브레이크포인트 캐스케이드: desktop → tablet → mobile
   */
  getResolvedProperties: (element: CanvasElement, breakpoint: Breakpoint): CanvasElement => {
    // 기본값은 element 그대로 (desktop)
    let resolved = { ...element };

    if (breakpoint === 'tablet' && element.responsiveOverrides?.tablet) {
      // tablet: desktop + tablet 오버라이드
      resolved = { ...resolved, ...element.responsiveOverrides.tablet } as CanvasElement;
    } else if (breakpoint === 'mobile') {
      // mobile: desktop + tablet 오버라이드 + mobile 오버라이드
      if (element.responsiveOverrides?.tablet) {
        resolved = { ...resolved, ...element.responsiveOverrides.tablet } as CanvasElement;
      }
      if (element.responsiveOverrides?.mobile) {
        resolved = { ...resolved, ...element.responsiveOverrides.mobile } as CanvasElement;
      }
    }

    return resolved;
  },

  // ============================================
  // Phase 15: 레이아웃 시스템
  // ============================================

  /**
   * 레이아웃 설정 (그룹/컴포넌트 컨테이너)
   */
  setLayout: (elementId: string, layout: import('../types').LayoutConfig) => {
    const state = get();
    const element = state.elements.find((el) => el.id === elementId);

    if (!element) {
      throw new Error('Element not found');
    }

    // 그룹 또는 컴포넌트만 레이아웃 컨테이너가 될 수 있음
    if (element.type !== 'group' && element.type !== 'component') {
      console.warn('Only group or component elements can have layout');
      return;
    }

    // 히스토리 기록
    recordHistory(set, get);

    get().updateElement(elementId, { layout });
  },

  /**
   * 자식 레이아웃 속성 설정
   */
  setLayoutChild: (elementId: string, props: import('../types').LayoutChildProps) => {
    // 히스토리 기록
    recordHistory(set, get);

    get().updateElement(elementId, { layoutChild: props });
  },

  /**
   * CSS position 설정
   */
  setCSSPosition: (elementId: string, position: import('../types').CSSPosition) => {
    // 히스토리 기록
    recordHistory(set, get);

    get().updateElement(elementId, { cssPosition: position });
  },

  /**
   * 레이아웃 계산 결과 업데이트 (히스토리에 기록하지 않음)
   */
  updateComputedPositions: (layouts: import('../types').ComputedLayout[]) => {
    const state = get();
    const elements = [...state.elements];

    layouts.forEach(({ elementId, computedPosition }) => {
      const element = elements.find((el) => el.id === elementId);
      if (element) {
        element.computedPosition = computedPosition;
      }
    });

    set({ elements });
  },

  // ============================================
  // Phase 15.1: CSS 클래스 시스템
  // ============================================

  /**
   * CSS 클래스 생성
   */
  createCSSClass: (name: string, styles: React.CSSProperties, options?: Partial<import('../types').CSSClass>) => {
    const state = get();
    const newClass: import('../types').CSSClass = {
      id: nanoid(),
      name,
      styles,
      description: options?.description,
      hoverStyles: options?.hoverStyles,
      category: options?.category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set({ cssClasses: [...state.cssClasses, newClass] });
    return newClass;
  },

  /**
   * CSS 클래스 업데이트
   */
  updateCSSClass: (id: string, updates: Partial<import('../types').CSSClass>) => {
    const state = get();
    const cssClasses = state.cssClasses.map((cls) =>
      cls.id === id
        ? { ...cls, ...updates, updatedAt: new Date() }
        : cls
    );
    set({ cssClasses });
  },

  /**
   * CSS 클래스 삭제
   */
  deleteCSSClass: (id: string) => {
    const state = get();

    // 클래스를 사용하는 모든 요소에서 제거
    const elements = state.elements.map((el) => {
      if (el.classNames?.includes(id)) {
        return {
          ...el,
          classNames: el.classNames.filter((cid) => cid !== id),
        };
      }
      return el;
    });

    set({
      cssClasses: state.cssClasses.filter((cls) => cls.id !== id),
      elements,
    });
  },

  /**
   * CSS 클래스 복제
   */
  duplicateCSSClass: (id: string) => {
    const state = get();
    const original = state.cssClasses.find((cls) => cls.id === id);

    if (!original) {
      throw new Error('CSS class not found');
    }

    const duplicate: import('../types').CSSClass = {
      ...original,
      id: nanoid(),
      name: `${original.name} (복사본)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set({ cssClasses: [...state.cssClasses, duplicate] });
    return duplicate;
  },

  /**
   * 요소에 CSS 클래스 추가
   */
  addClassToElement: (elementId: string, classId: string) => {
    const state = get();
    const element = state.elements.find((el) => el.id === elementId);

    if (!element) {
      throw new Error('Element not found');
    }

    const classNames = element.classNames || [];
    if (classNames.includes(classId)) {
      return; // 이미 적용된 클래스
    }

    recordHistory(set, get);
    get().updateElement(elementId, {
      classNames: [...classNames, classId],
    });
  },

  /**
   * 요소에서 CSS 클래스 제거
   */
  removeClassFromElement: (elementId: string, classId: string) => {
    const state = get();
    const element = state.elements.find((el) => el.id === elementId);

    if (!element || !element.classNames) {
      return;
    }

    recordHistory(set, get);
    get().updateElement(elementId, {
      classNames: element.classNames.filter((cid) => cid !== classId),
    });
  },

  // ============================================
  // Phase 15.2: CSS 키프레임 애니메이션 시스템
  // ============================================

  /**
   * 키프레임 애니메이션 생성
   */
  createKeyframeAnimation: (
    name: string,
    keyframes: import('../types').Keyframe[],
    options?: Partial<import('../types').KeyframeAnimation>
  ) => {
    const state = get();
    const newAnimation: import('../types').KeyframeAnimation = {
      id: nanoid(),
      name,
      keyframes,
      description: options?.description,
      duration: options?.duration || 1000,
      timingFunction: options?.timingFunction || 'ease',
      iterationCount: options?.iterationCount || 1,
      direction: options?.direction || 'normal',
      fillMode: options?.fillMode || 'forwards',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set({ keyframeAnimations: [...state.keyframeAnimations, newAnimation] });
    return newAnimation;
  },

  /**
   * 키프레임 애니메이션 업데이트
   */
  updateKeyframeAnimation: (id: string, updates: Partial<import('../types').KeyframeAnimation>) => {
    const state = get();
    const keyframeAnimations = state.keyframeAnimations.map((anim) =>
      anim.id === id
        ? { ...anim, ...updates, updatedAt: new Date() }
        : anim
    );
    set({ keyframeAnimations });
  },

  /**
   * 키프레임 애니메이션 삭제
   */
  deleteKeyframeAnimation: (id: string) => {
    const state = get();

    // 애니메이션을 사용하는 모든 요소에서 제거
    const elements = state.elements.map((el) => {
      if (el.animationName === id) {
        const { animationName, ...rest } = el;
        return rest;
      }
      return el;
    });

    set({
      keyframeAnimations: state.keyframeAnimations.filter((anim) => anim.id !== id),
      elements,
    });
  },

  /**
   * 키프레임 애니메이션 복제
   */
  duplicateKeyframeAnimation: (id: string) => {
    const state = get();
    const original = state.keyframeAnimations.find((anim) => anim.id === id);

    if (!original) {
      throw new Error('Keyframe animation not found');
    }

    const duplicate: import('../types').KeyframeAnimation = {
      ...original,
      id: nanoid(),
      name: `${original.name} (복사본)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set({ keyframeAnimations: [...state.keyframeAnimations, duplicate] });
    return duplicate;
  },

  /**
   * 요소에 키프레임 애니메이션 적용
   */
  applyAnimationToElement: (elementId: string, animationId: string) => {
    recordHistory(set, get);
    get().updateElement(elementId, { animationName: animationId });
  },

  /**
   * 요소에서 키프레임 애니메이션 제거
   */
  removeAnimationFromElement: (elementId: string) => {
    const state = get();
    const element = state.elements.find((el) => el.id === elementId);

    if (!element || !element.animationName) {
      return;
    }

    recordHistory(set, get);
    const { animationName, ...rest } = element;
    get().updateElement(elementId, rest);
  },

  // ============================================
  // Phase 15.3: 커스텀 브레이크포인트 시스템
  // ============================================

  /**
   * 커스텀 브레이크포인트 추가
   */
  addCustomBreakpoint: (breakpoint: Omit<import('../types').CustomBreakpoint, 'id'>) => {
    const state = get();
    const newBreakpoint: import('../types').CustomBreakpoint = {
      ...breakpoint,
      id: nanoid(),
    };

    set({ customBreakpoints: [...state.customBreakpoints, newBreakpoint] });
    return newBreakpoint;
  },

  /**
   * 커스텀 브레이크포인트 업데이트
   */
  updateCustomBreakpoint: (id: string, updates: Partial<import('../types').CustomBreakpoint>) => {
    const state = get();
    const customBreakpoints = state.customBreakpoints.map((bp) =>
      bp.id === id ? { ...bp, ...updates } : bp
    );
    set({ customBreakpoints });
  },

  /**
   * 커스텀 브레이크포인트 삭제
   */
  deleteCustomBreakpoint: (id: string) => {
    const state = get();
    set({
      customBreakpoints: state.customBreakpoints.filter((bp) => bp.id !== id),
    });
  },

  /**
   * 브레이크포인트 순서 변경
   */
  reorderBreakpoints: (breakpoints: import('../types').CustomBreakpoint[]) => {
    set({ customBreakpoints: breakpoints });
  },

  // ============================================
  // 캔버스 줌 & 팬 (Priority 0.1)
  // ============================================

  /**
   * 캔버스 줌 설정
   */
  setCanvasZoom: (zoom: number) => {
    const clampedZoom = Math.max(0.1, Math.min(5, zoom));
    set({ canvasZoom: clampedZoom });
  },

  /**
   * 캔버스 줌 인
   */
  zoomIn: () => {
    const state = get();
    const newZoom = Math.min(5, state.canvasZoom + 0.1);
    set({ canvasZoom: newZoom });
  },

  /**
   * 캔버스 줌 아웃
   */
  zoomOut: () => {
    const state = get();
    const newZoom = Math.max(0.1, state.canvasZoom - 0.1);
    set({ canvasZoom: newZoom });
  },

  /**
   * 캔버스 줌 리셋
   */
  resetZoom: () => {
    set({ canvasZoom: 1, canvasPanX: 0, canvasPanY: 0 });
  },

  /**
   * 캔버스 팬 설정
   */
  setCanvasPan: (panX: number, panY: number) => {
    set({ canvasPanX: panX, canvasPanY: panY });
  },

  // ============================================
  // 그리드 & 스냅 (Priority 0.2)
  // ============================================

  /**
   * 그리드 표시 토글
   */
  toggleGrid: () => {
    const state = get();
    set({ showGrid: !state.showGrid });
  },

  /**
   * 그리드 크기 설정
   */
  setGridSize: (size: number) => {
    const clampedSize = Math.max(5, Math.min(100, size));
    set({ gridSize: clampedSize });
  },

  /**
   * 스냅 토글
   */
  toggleSnap: () => {
    const state = get();
    set({ snapToGrid: !state.snapToGrid });
  },

  // ============================================
  // 스마트 가이드라인 (Priority 2.1)
  // ============================================

  /**
   * 스마트 가이드라인 설정
   */
  setSmartGuides: (guides: import('../types').SmartGuide[]) => {
    set({ smartGuides: guides });
  },

  // ============================================
  // 박스 선택 (Priority 2.2)
  // ============================================

  /**
   * 박스 선택 영역 설정
   */
  setSelectionBox: (box: import('../types').BoxSelection | null) => {
    set({ selectionBox: box });
  },

  // ============================================
  // 색상 팔레트 관리 (Priority 3.1)
  // ============================================

  /**
   * 색상 팔레트에 색상 추가
   */
  addColorToPalette: (color: string, name?: string) => {
    const newColor: import('../types').ColorPaletteItem = {
      id: `color-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      color,
      name,
      createdAt: new Date(),
    };
    set((state) => ({
      colorPalette: [...state.colorPalette, newColor],
    }));
  },

  /**
   * 색상 팔레트에서 색상 제거
   */
  removeColorFromPalette: (id: string) => {
    set((state) => ({
      colorPalette: state.colorPalette.filter((item) => item.id !== id),
    }));
  },

  /**
   * 팔레트 색상 업데이트
   */
  updatePaletteColor: (id: string, updates: Partial<import('../types').ColorPaletteItem>) => {
    set((state) => ({
      colorPalette: state.colorPalette.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  },

  /**
   * 색상 팔레트 초기화
   */
  clearColorPalette: () => {
    set({
      colorPalette: [
        { id: 'default-1', color: '#3B82F6', name: 'Blue', createdAt: new Date() },
        { id: 'default-2', color: '#EF4444', name: 'Red', createdAt: new Date() },
        { id: 'default-3', color: '#10B981', name: 'Green', createdAt: new Date() },
        { id: 'default-4', color: '#F59E0B', name: 'Orange', createdAt: new Date() },
        { id: 'default-5', color: '#8B5CF6', name: 'Purple', createdAt: new Date() },
        { id: 'default-6', color: '#EC4899', name: 'Pink', createdAt: new Date() },
        { id: 'default-7', color: '#000000', name: 'Black', createdAt: new Date() },
        { id: 'default-8', color: '#FFFFFF', name: 'White', createdAt: new Date() },
      ],
    });
  },

  // ============================================
  // 디자인 토큰 시스템 (Priority 4.4)
  // ============================================

  /**
   * 타이포그래피 토큰 적용
   */
  applyTypographyToken: (elementId: string, tokenId: string) => {
    const state = get();
    const element = state.elements.find((el) => el.id === elementId);
    const token = state.designTokens.typography.find((t) => t.id === tokenId);

    if (!element || !token) {
      throw new Error('Element or token not found');
    }

    // 텍스트 요소만 타이포그래피 토큰 적용 가능
    if (element.type !== 'text') {
      console.warn('Typography tokens can only be applied to text elements');
      return;
    }

    recordHistory(set, get, `타이포그래피 토큰 적용: ${token.name}`);

    get().updateElement(elementId, {
      fontSize: token.fontSize,
      fontWeight: token.fontWeight,
      lineHeight: token.lineHeight,
      letterSpacing: token.letterSpacing,
      textTransform: token.textTransform,
    });
  },

  /**
   * 색상 토큰 적용
   */
  applyColorToken: (elementId: string, tokenId: string, property: 'fill' | 'stroke' | 'color') => {
    const state = get();
    const element = state.elements.find((el) => el.id === elementId);
    const token = state.designTokens.colors.find((t) => t.id === tokenId);

    if (!element || !token) {
      throw new Error('Element or token not found');
    }

    recordHistory(set, get, `색상 토큰 적용: ${token.name}`);

    // 요소 타입에 따라 적용 방식 다르게
    if (element.type === 'text') {
      // 텍스트는 color 속성
      get().updateElement(elementId, { color: token.value });
    } else if (element.type === 'shape') {
      // 도형은 fill/stroke 속성
      if (property === 'fill') {
        get().updateElement(elementId, {
          style: { ...element.style, fill: token.value }
        });
      } else if (property === 'stroke') {
        get().updateElement(elementId, {
          style: { ...element.style, stroke: token.value }
        });
      }
    } else if (element.type === 'line' || element.type === 'arrow') {
      // 선/화살표는 strokeColor 속성 사용
      get().updateElement(elementId, {
        strokeColor: token.value
      });
    }
  },

  /**
   * 그림자 토큰 적용
   */
  applyShadowToken: (elementId: string, tokenId: string) => {
    const state = get();
    const element = state.elements.find((el) => el.id === elementId);
    const token = state.designTokens.shadows.find((t) => t.id === tokenId);

    if (!element || !token) {
      throw new Error('Element or token not found');
    }

    // 선/화살표/이미지는 그림자 적용 불가
    if (element.type === 'line' || element.type === 'arrow' || element.type === 'image') {
      console.warn('Shadow tokens cannot be applied to line, arrow, or image elements');
      return;
    }

    recordHistory(set, get, `그림자 토큰 적용: ${token.name}`);

    if (element.type === 'shape') {
      // Shape는 style.boxShadow에 적용
      get().updateElement(elementId, {
        style: { ...element.style, boxShadow: token.value }
      });
    } else if (element.type === 'text') {
      // Text는 textShadow에 적용
      get().updateElement(elementId, {
        textShadow: token.value
      });
    }
  },

  /**
   * 모서리 반경 토큰 적용
   */
  applyRadiusToken: (elementId: string, tokenId: string) => {
    const state = get();
    const element = state.elements.find((el) => el.id === elementId);
    const token = state.designTokens.radius.find((t) => t.id === tokenId);

    if (!element || !token) {
      throw new Error('Element or token not found');
    }

    // 사각형 도형만 borderRadius 적용 가능
    if (element.type !== 'shape' || element.shapeType !== 'rectangle') {
      console.warn('Radius tokens can only be applied to rectangle shapes');
      return;
    }

    recordHistory(set, get, `모서리 토큰 적용: ${token.name}`);

    get().updateElement(elementId, {
      style: { ...element.style, borderRadius: token.value }
    });
  },

  /**
   * 디자인 토큰 초기화
   */
  resetDesignTokens: () => {
    set({ designTokens: defaultDesignTokens });
    get().saveProject();  // 자동 저장
  },
}));
