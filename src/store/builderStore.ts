import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { BuilderState, CanvasElement, Page, SelectMode, ToolMode } from '../types';

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

export const useBuilderStore = create<BuilderState>((set) => ({
  // 초기 상태
  elements: [],
  selectedElementIds: [],
  currentTool: 'select',
  isDrawing: false,
  currentPage: createInitialPage(),
  pages: [createInitialPage()],

  // 요소 추가
  addElement: (element: CanvasElement) => {
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
    set((state) => {
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

  // 요소 선택
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

  // 도구 변경
  setCurrentTool: (tool: ToolMode) => {
    set({ currentTool: tool });
  },

  // 그리기 상태 변경
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
      };
    });
  },

  // 페이지 요소 업데이트 (전체 교체)
  updatePageElements: (elements: CanvasElement[]) => {
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
}));