// src/store/builderStore.ts
import { create } from 'zustand';
import type { 
  Project, 
  Page, 
  Block, 
  ViewportType, 
  ButtonAction, 
  MindMapNode, 
  MindMapEdge,
  SelectedElement,
  SelectionMode,
  SelectionBox
} from '@/types';

interface BuilderState {
  // 프로젝트 상태
  project: Project | null;
  currentPage: Page | null;
  
  // 선택된 요소
  selectedElement: SelectedElement | null;
  
  // 🆕 다중 블록 선택
  selectedBlockIds: string[];
  selectionMode: SelectionMode;
  
  // 🆕 드래그 선택 박스
  selectionBox: SelectionBox | null;
  isSelecting: boolean;
  
  // 레거시 호환성 (SettingsPanel용)
  selectedBlockId: string | null;
  
  // UI 상태
  activeTab: 'editor' | 'mindmap';
  viewport: ViewportType;
  previewMode: boolean;
  
  // 미리보기 히스토리
  previewHistory: string[];
  previewCurrentIndex: number;
  
  // 복사/붙여넣기
  copiedBlock: Block | null;
  copiedBlocks: Block[];  // 🆕 다중 복사
  
  // 히스토리 (Undo/Redo)
  history: Project[];
  historyIndex: number;
  maxHistory: number;
  
  // 액션
  setProject: (project: Project) => void;
  setCurrentPage: (pageId: string) => void;
  
  // 요소 선택
  setSelectedElement: (element: SelectedElement | null) => void;
  
  // 🆕 다중 블록 선택
  selectBlock: (blockId: string, mode?: 'replace' | 'add' | 'range') => void;
  selectBlocks: (blockIds: string[]) => void;
  clearSelection: () => void;
  selectAll: () => void;
  isBlockSelected: (blockId: string) => boolean;
  
  // 🆕 드래그 선택 박스
  setSelectionBox: (box: SelectionBox | null) => void;
  setIsSelecting: (isSelecting: boolean) => void;
  selectBlocksInBox: (box: SelectionBox, mode: 'replace' | 'add') => void;
  
  // 블록 액션
  addBlock: (block: Block, index?: number) => void;
  removeBlock: (blockId: string) => void;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  reorderBlocks: (fromIndex: number, toIndex: number) => void;
  
  // 🆕 다중 블록 삭제
  deleteSelectedBlocks: () => void;
  
  // 복사/붙여넣기/잘라내기
  copyBlock: (blockId: string) => void;
  pasteBlock: () => void;
  cutBlock: (blockId: string) => void;
  
  // 🆕 다중 복사/붙여넣기/잘라내기
  copySelectedBlocks: () => void;
  pasteSelectedBlocks: () => void;
  cutSelectedBlocks: () => void;
  
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // UI 액션
  setActiveTab: (tab: 'editor' | 'mindmap') => void;
  setViewport: (viewport: ViewportType) => void;
  togglePreviewMode: () => void;
  
  // 미리보기 네비게이션
  previewGoBack: () => void;
  previewGoForward: () => void;
  previewGoHome: () => void;
  
  // 페이지 관리
  addPage: (page: Page) => void;
  removePage: (pageId: string) => void;
  updatePage: (pageId: string, updates: Partial<Page>) => void;
  
  // 마인드맵 노드 관리
  addMindMapNode: (node: MindMapNode) => void;
  updateMindMapNode: (nodeId: string, updates: Partial<MindMapNode>) => void;
  updateMultipleMindMapNodes: (updates: Array<{ nodeId: string; position: { x: number; y: number } }>) => void;
  
  // 마인드맵 엣지 관리
  addMindMapEdge: (edge: Omit<MindMapEdge, 'id'>) => void;
  updateMindMapEdge: (edgeId: string, updates: Partial<MindMapEdge>) => void;
  
  // 기존 마인드맵
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;
  syncButtonActionToEdge: (blockId: string, action: ButtonAction, triggerIndex: number) => void;
  updateEdgeLabelOffset: (edgeId: string, offset: { x: number; y: number }) => void;
  
  // 미리보기 모드 네비게이션
  navigateToPageInPreview: (pageId: string) => void;
}

export const useBuilderStore = create<BuilderState>((set, get) => {
  // 히스토리 추가 헬퍼 함수
  const addToHistory = () => {
    const { project, history, historyIndex, maxHistory, previewMode } = get();
    
    // 미리보기 모드에서는 히스토리 기록 안 함
    if (!project || previewMode) return;
    
    // 1. 현재 위치 이후의 히스토리 제거 (새로운 분기)
    const newHistory = history.slice(0, historyIndex + 1);
    
    // 2. Deep Copy로 프로젝트 스냅샷 추가
    const snapshot = JSON.parse(JSON.stringify(project));
    newHistory.push(snapshot);
    
    // 3. 최대 개수 제한
    if (newHistory.length > maxHistory) {
      newHistory.shift(); // 가장 오래된 것 제거
    }
    
    // 4. 상태 업데이트
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  };

  return {
    // 초기 상태
    project: null,
    currentPage: null,
    selectedElement: null,
    selectedBlockId: null,  // 레거시
    selectedBlockIds: [],  // 🆕
    selectionMode: 'single',  // 🆕
    selectionBox: null,  // 🆕
    isSelecting: false,  // 🆕
    activeTab: 'editor',
    viewport: 'desktop',
    previewMode: false,
    previewHistory: [],
    previewCurrentIndex: -1,
    copiedBlock: null,
    copiedBlocks: [],  // 🆕
    
    // 히스토리 초기값
    history: [],
    historyIndex: -1,
    maxHistory: 50,

    // 프로젝트 설정
    setProject: (project) => {
      const currentPage = project.pages.find((p) => p.id === project.currentPageId) || project.pages[0];
      
      set({
        project,
        currentPage,
        selectedElement: null,
        selectedBlockId: null,
        selectedBlockIds: [],
        selectionMode: 'single',
        // 초기 히스토리 설정
        history: [JSON.parse(JSON.stringify(project))],
        historyIndex: 0,
      });
    },

    // 현재 페이지 설정
    setCurrentPage: (pageId) => {
      const { project } = get();
      if (!project) return;

      const page = project.pages.find((p) => p.id === pageId);
      if (page) {
        set({
          currentPage: page,
          selectedElement: null,
          selectedBlockId: null,
          selectedBlockIds: [],
          project: { ...project, currentPageId: pageId },
        });
      }
    },

    // 요소 선택
    setSelectedElement: (element) => {
      set({ 
        selectedElement: element,
        selectedBlockId: element?.blockId || null,  // 레거시 호환
        selectedBlockIds: element ? [element.blockId] : [],  // 🆕 단일 선택 시에도 배열로
        selectionMode: 'single',
      });
    },

    // 🆕 다중 블록 선택
    selectBlock: (blockId, mode = 'replace') => {
      const { selectedBlockIds, currentPage } = get();
      
      if (!currentPage) return;

      let newSelectedIds: string[] = [];

      switch (mode) {
        case 'replace':
          // 기본: 해당 블록만 선택
          newSelectedIds = [blockId];
          set({
            selectedBlockIds: newSelectedIds,
            selectionMode: 'single',
            selectedElement: null,  // 다중 선택 시에는 요소 선택 해제
          });
          break;

        case 'add':
          // Ctrl+클릭: 추가/제거 토글
          if (selectedBlockIds.includes(blockId)) {
            newSelectedIds = selectedBlockIds.filter(id => id !== blockId);
          } else {
            newSelectedIds = [...selectedBlockIds, blockId];
          }
          set({
            selectedBlockIds: newSelectedIds,
            selectionMode: newSelectedIds.length > 1 ? 'multiple' : 'single',
            selectedElement: null,
          });
          break;

        case 'range':
          // Shift+클릭: 범위 선택
          if (selectedBlockIds.length === 0) {
            newSelectedIds = [blockId];
          } else {
            const lastSelectedId = selectedBlockIds[selectedBlockIds.length - 1];
            const lastIndex = currentPage.blocks.findIndex(b => b.id === lastSelectedId);
            const currentIndex = currentPage.blocks.findIndex(b => b.id === blockId);
            
            if (lastIndex !== -1 && currentIndex !== -1) {
              const start = Math.min(lastIndex, currentIndex);
              const end = Math.max(lastIndex, currentIndex);
              newSelectedIds = currentPage.blocks.slice(start, end + 1).map(b => b.id);
            } else {
              newSelectedIds = [blockId];
            }
          }
          set({
            selectedBlockIds: newSelectedIds,
            selectionMode: newSelectedIds.length > 1 ? 'multiple' : 'single',
            selectedElement: null,
          });
          break;
      }
    },

    selectBlocks: (blockIds) => {
      set({
        selectedBlockIds: blockIds,
        selectionMode: blockIds.length > 1 ? 'multiple' : 'single',
        selectedElement: null,
      });
    },

    clearSelection: () => {
      set({
        selectedBlockIds: [],
        selectionMode: 'single',
        selectedElement: null,
        selectedBlockId: null,
      });
    },

    selectAll: () => {
      const { currentPage } = get();
      if (!currentPage) return;

      const allBlockIds = currentPage.blocks.map(b => b.id);
      set({
        selectedBlockIds: allBlockIds,
        selectionMode: 'multiple',
        selectedElement: null,
      });
    },

    isBlockSelected: (blockId) => {
      const { selectedBlockIds } = get();
      return selectedBlockIds.includes(blockId);
    },

    // 🆕 드래그 선택 박스
    setSelectionBox: (box) => {
      set({ selectionBox: box });
    },

    setIsSelecting: (isSelecting) => {
      set({ isSelecting });
    },

    // ✅ 수정된 selectBlocksInBox 함수
    selectBlocksInBox: (box, mode) => {
      const { currentPage } = get();
      if (!currentPage) return;

      // 캔버스 스크롤 위치 고려
      const canvas = document.querySelector('.viewport-canvas');
      if (!canvas) return;

      const canvasRect = canvas.getBoundingClientRect();

      // 박스 내에 있는 블록들 찾기
      const blocksInBox: string[] = [];
      
      currentPage.blocks.forEach(block => {
        const blockElement = document.querySelector(`[data-block-id="${block.id}"]`);
        if (!blockElement) return;

        const blockRect = blockElement.getBoundingClientRect();
        
        // ⭐ 블록 위치를 캔버스 내부 좌표로 변환 (스크롤 포함)
        const blockLeft = blockRect.left - canvasRect.left + canvas.scrollLeft;
        const blockRight = blockRect.right - canvasRect.left + canvas.scrollLeft;
        const blockTop = blockRect.top - canvasRect.top + canvas.scrollTop;
        const blockBottom = blockRect.bottom - canvasRect.top + canvas.scrollTop;

        const boxLeft = Math.min(box.startX, box.endX);
        const boxRight = Math.max(box.startX, box.endX);
        const boxTop = Math.min(box.startY, box.endY);
        const boxBottom = Math.max(box.startY, box.endY);

        // AABB 충돌 감지
        const isOverlapping = !(
          blockRight < boxLeft ||
          blockLeft > boxRight ||
          blockBottom < boxTop ||
          blockTop > boxBottom
        );

        if (isOverlapping) {
          blocksInBox.push(block.id);
        }
      });

      // 선택 모드에 따라 처리
      if (mode === 'replace') {
        set({
          selectedBlockIds: blocksInBox,
          selectionMode: blocksInBox.length > 1 ? 'multiple' : 'single',
          selectedElement: null,
        });
      } else if (mode === 'add') {
        const { selectedBlockIds } = get();
        const newSelection = [...new Set([...selectedBlockIds, ...blocksInBox])];
        set({
          selectedBlockIds: newSelection,
          selectionMode: newSelection.length > 1 ? 'multiple' : 'single',
          selectedElement: null,
        });
      }
    },

    // 블록 추가
    addBlock: (block, index) => {
      const { currentPage, project } = get();
      if (!currentPage || !project) return;

      const newBlocks = [...currentPage.blocks];
      if (index !== undefined) {
        newBlocks.splice(index, 0, block);
      } else {
        newBlocks.push(block);
      }

      const updatedPage = { ...currentPage, blocks: newBlocks };
      const updatedPages = project.pages.map((p) =>
        p.id === currentPage.id ? updatedPage : p
      );

      set({
        currentPage: updatedPage,
        project: { ...project, pages: updatedPages },
      });
      
      addToHistory();
    },

    // 블록 삭제
    removeBlock: (blockId) => {
      const { currentPage, project, selectedElement, selectedBlockIds } = get();
      if (!currentPage || !project) return;

      const newBlocks = currentPage.blocks.filter((b) => b.id !== blockId);
      const updatedPage = { ...currentPage, blocks: newBlocks };
      const updatedPages = project.pages.map((p) =>
        p.id === currentPage.id ? updatedPage : p
      );

      // 마인드맵 엣지 삭제
      const filteredEdges = project.mindMap.edges.filter(
        (e) => e.triggerBlockId !== blockId
      );

      set({
        currentPage: updatedPage,
        project: {
          ...project,
          pages: updatedPages,
          mindMap: { ...project.mindMap, edges: filteredEdges },
        },
        selectedElement: selectedElement?.blockId === blockId ? null : selectedElement,
        selectedBlockId: selectedElement?.blockId === blockId ? null : get().selectedBlockId,
        selectedBlockIds: selectedBlockIds.filter(id => id !== blockId),
      });
      
      addToHistory();
    },

    // 🆕 선택된 블록들 삭제
    deleteSelectedBlocks: () => {
      const { selectedBlockIds, currentPage, project } = get();
      if (!currentPage || !project || selectedBlockIds.length === 0) return;

      const newBlocks = currentPage.blocks.filter(b => !selectedBlockIds.includes(b.id));
      const updatedPage = { ...currentPage, blocks: newBlocks };
      const updatedPages = project.pages.map((p) =>
        p.id === currentPage.id ? updatedPage : p
      );

      // 마인드맵 엣지 삭제
      const filteredEdges = project.mindMap.edges.filter(
        (e) => !selectedBlockIds.includes(e.triggerBlockId || '')
      );

      set({
        currentPage: updatedPage,
        project: {
          ...project,
          pages: updatedPages,
          mindMap: { ...project.mindMap, edges: filteredEdges },
        },
        selectedElement: null,
        selectedBlockId: null,
        selectedBlockIds: [],
        selectionMode: 'single',
      });
      
      addToHistory();
    },

    // 블록 업데이트
    updateBlock: (blockId, updates) => {
      const { currentPage, project } = get();
      if (!currentPage || !project) return;

      const updatedBlocks = currentPage.blocks.map((block) =>
        block.id === blockId ? { ...block, ...updates } : block
      );

      const updatedPage = { ...currentPage, blocks: updatedBlocks };
      const updatedPages = project.pages.map((p) =>
        p.id === currentPage.id ? updatedPage : p
      );

      set({
        currentPage: updatedPage,
        project: { ...project, pages: updatedPages },
      });
      
      addToHistory();
    },

    // 블록 순서 변경
    reorderBlocks: (fromIndex, toIndex) => {
      const { currentPage, project } = get();
      if (!currentPage || !project) return;

      const newBlocks = [...currentPage.blocks];
      const [movedBlock] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, movedBlock);

      const updatedPage = { ...currentPage, blocks: newBlocks };
      const updatedPages = project.pages.map((p) =>
        p.id === currentPage.id ? updatedPage : p
      );

      set({
        currentPage: updatedPage,
        project: { ...project, pages: updatedPages },
      });
      
      addToHistory();
    },

    // 블록 복사
    copyBlock: (blockId) => {
      const { currentPage } = get();
      if (!currentPage) return;

      const block = currentPage.blocks.find((b) => b.id === blockId);
      if (block) {
        set({ copiedBlock: JSON.parse(JSON.stringify(block)) });
      }
    },

    // 🆕 선택된 블록들 복사
    copySelectedBlocks: () => {
      const { selectedBlockIds, currentPage } = get();
      if (!currentPage || selectedBlockIds.length === 0) return;

      const blocks = currentPage.blocks.filter(b => selectedBlockIds.includes(b.id));
      set({ copiedBlocks: JSON.parse(JSON.stringify(blocks)) });
    },

    // 블록 붙여넣기
    pasteBlock: () => {
      const { copiedBlock, currentPage, addBlock, syncButtonActionToEdge } = get();
      if (!copiedBlock || !currentPage) return;

      const collectAllLabels = (): string[] => {
        const labels: string[] = [];
        
        currentPage.blocks.forEach(block => {
          if (block.type === '히어로' && 'buttonText' in block.content) {
            labels.push(block.content.buttonText as string);
          } else if (block.type === '헤더' && 'navLinks' in block.content) {
            const navLinks = block.content.navLinks as Array<{ text: string }>;
            navLinks.forEach(link => labels.push(link.text));
          }
        });
        
        return labels;
      };

      const getUniqueLabel = (originalLabel: string, existingLabels: string[]): string => {
        let newLabel = originalLabel;
        let counter = 2;
        
        while (existingLabels.includes(newLabel)) {
          newLabel = `${originalLabel}(${counter})`;
          counter++;
        }
        
        return newLabel;
      };

      const existingLabels = collectAllLabels();
      const newBlock = {
        ...JSON.parse(JSON.stringify(copiedBlock)),
        id: crypto.randomUUID(),
      };

      if (newBlock.type === '히어로' && 'buttonAction' in newBlock.content) {
        const originalLabel = newBlock.content.buttonText as string;
        const uniqueLabel = getUniqueLabel(originalLabel, existingLabels);
        newBlock.content.buttonText = uniqueLabel;
        newBlock.content.buttonAction.label = uniqueLabel;
      } else if (newBlock.type === '헤더' && 'navLinks' in newBlock.content) {
        const navLinks = newBlock.content.navLinks as Array<{ text: string; action: { label: string } }>;
        navLinks.forEach(link => {
          const originalLabel = link.text;
          const uniqueLabel = getUniqueLabel(originalLabel, existingLabels);
          link.text = uniqueLabel;
          link.action.label = uniqueLabel;
          existingLabels.push(uniqueLabel);
        });
      }

      addBlock(newBlock);

      if (newBlock.type === '히어로' && 'buttonAction' in newBlock.content) {
        const buttonAction = newBlock.content.buttonAction;
        if (buttonAction.type === 'page' && buttonAction.pageId) {
          setTimeout(() => {
            syncButtonActionToEdge(newBlock.id, buttonAction, 0);
          }, 100);
        }
      } else if (newBlock.type === '헤더' && 'navLinks' in newBlock.content) {
        const navLinks = newBlock.content.navLinks as Array<{ action: ButtonAction }>;
        navLinks.forEach((link, index) => {
          if (link.action.type === 'page' && link.action.pageId) {
            setTimeout(() => {
              syncButtonActionToEdge(newBlock.id, link.action, index);
            }, 100);
          }
        });
      }
    },

    // 🆕 선택된 블록들 붙여넣기
    pasteSelectedBlocks: () => {
      const { copiedBlocks, addBlock } = get();
      if (copiedBlocks.length === 0) return;

      copiedBlocks.forEach(block => {
        const newBlock = {
          ...JSON.parse(JSON.stringify(block)),
          id: crypto.randomUUID(),
        };
        addBlock(newBlock);
      });
    },

    // 블록 잘라내기
    cutBlock: (blockId) => {
      const { copyBlock, removeBlock } = get();
      copyBlock(blockId);
      removeBlock(blockId);
    },

    // 🆕 선택된 블록들 잘라내기
    cutSelectedBlocks: () => {
      const { copySelectedBlocks, deleteSelectedBlocks } = get();
      copySelectedBlocks();
      deleteSelectedBlocks();
    },

    // 실행 취소
    undo: () => {
      const { history, historyIndex } = get();
      
      if (historyIndex <= 0) return;
      
      const newIndex = historyIndex - 1;
      const previousProject = history[newIndex];
      
      set({
        project: previousProject,
        currentPage: previousProject.pages.find(
          p => p.id === previousProject.currentPageId
        ) || previousProject.pages[0],
        historyIndex: newIndex,
        selectedElement: null,
        selectedBlockId: null,
        selectedBlockIds: [],
      });
    },

    // 다시 실행
    redo: () => {
      const { history, historyIndex } = get();
      
      if (historyIndex >= history.length - 1) return;
      
      const newIndex = historyIndex + 1;
      const nextProject = history[newIndex];
      
      set({
        project: nextProject,
        currentPage: nextProject.pages.find(
          p => p.id === nextProject.currentPageId
        ) || nextProject.pages[0],
        historyIndex: newIndex,
        selectedElement: null,
        selectedBlockId: null,
        selectedBlockIds: [],
      });
    },

    // 실행 취소 가능 여부
    canUndo: () => {
      const { historyIndex } = get();
      return historyIndex > 0;
    },

    // 다시 실행 가능 여부
    canRedo: () => {
      const { history, historyIndex } = get();
      return historyIndex < history.length - 1;
    },

    // UI 액션
    setActiveTab: (tab) => set({ activeTab: tab }),
    setViewport: (viewport) => set({ viewport }),
    togglePreviewMode: () => {
      const { previewMode, project } = get();
      
      if (!previewMode && project) {
        const mainPage = project.pages.find(p => {
          const node = project.mindMap.nodes.find(n => n.pageId === p.id);
          return node?.isMainPage;
        }) || project.pages[0];
        
        set({ 
          previewMode: true,
          previewHistory: [mainPage.id],
          previewCurrentIndex: 0,
          currentPage: mainPage,
          project: { ...project, currentPageId: mainPage.id },
          selectedBlockIds: [],  // 🆕 미리보기 진입 시 선택 해제
        });
      } else {
        set({ 
          previewMode: false,
          previewHistory: [],
          previewCurrentIndex: -1,
        });
      }
    },

    // 미리보기 뒤로가기
    previewGoBack: () => {
      const { previewHistory, previewCurrentIndex, project } = get();
      if (previewCurrentIndex <= 0 || !project) return;
      
      const newIndex = previewCurrentIndex - 1;
      const pageId = previewHistory[newIndex];
      const page = project.pages.find(p => p.id === pageId);
      
      if (page) {
        set({
          previewCurrentIndex: newIndex,
          currentPage: page,
          project: { ...project, currentPageId: pageId }
        });
      }
    },

    // 미리보기 앞으로가기
    previewGoForward: () => {
      const { previewHistory, previewCurrentIndex, project } = get();
      if (previewCurrentIndex >= previewHistory.length - 1 || !project) return;
      
      const newIndex = previewCurrentIndex + 1;
      const pageId = previewHistory[newIndex];
      const page = project.pages.find(p => p.id === pageId);
      
      if (page) {
        set({
          previewCurrentIndex: newIndex,
          currentPage: page,
          project: { ...project, currentPageId: pageId }
        });
      }
    },

    // 미리보기 홈으로
    previewGoHome: () => {
      const { project } = get();
      if (!project) return;
      
      const mainPage = project.pages.find(p => {
        const node = project.mindMap.nodes.find(n => n.pageId === p.id);
        return node?.isMainPage;
      }) || project.pages[0];
      
      set({
        previewHistory: [mainPage.id],
        previewCurrentIndex: 0,
        currentPage: mainPage,
        project: { ...project, currentPageId: mainPage.id }
      });
    },

    // 페이지 추가
    addPage: (page) => {
      const { project } = get();
      if (!project) return;

      const newNode: MindMapNode = {
        id: crypto.randomUUID(),
        pageId: page.id,
        pageName: page.name,
        position: { x: 100 + project.mindMap.nodes.length * 50, y: 100 },
        isMainPage: false,
      };

      set({
        project: {
          ...project,
          pages: [...project.pages, page],
          mindMap: {
            ...project.mindMap,
            nodes: [...project.mindMap.nodes, newNode],
          },
        },
      });
      
      addToHistory();
    },

    // 페이지 삭제
    removePage: (pageId) => {
      const { project } = get();
      if (!project || project.pages.length <= 1) return;

      const filteredPages = project.pages.filter((p) => p.id !== pageId);
      const filteredNodes = project.mindMap.nodes.filter((n) => n.pageId !== pageId);
      const filteredEdges = project.mindMap.edges.filter(
        (e) => {
          const sourceNode = project.mindMap.nodes.find((n) => n.id === e.source);
          const targetNode = project.mindMap.nodes.find((n) => n.id === e.target);
          return sourceNode?.pageId !== pageId && targetNode?.pageId !== pageId;
        }
      );

      const newCurrentPageId = project.currentPageId === pageId
        ? filteredPages[0].id
        : project.currentPageId;

      set({
        project: {
          ...project,
          pages: filteredPages,
          mindMap: {
            nodes: filteredNodes,
            edges: filteredEdges,
          },
          currentPageId: newCurrentPageId,
        },
        currentPage: filteredPages.find((p) => p.id === newCurrentPageId) || filteredPages[0],
      });
      
      addToHistory();
    },

    // 페이지 업데이트
    updatePage: (pageId, updates) => {
      const { project } = get();
      if (!project) return;

      const updatedPages = project.pages.map((page) =>
        page.id === pageId ? { ...page, ...updates } : page
      );

      const updatedNodes = project.mindMap.nodes.map((node) =>
        node.pageId === pageId && updates.name
          ? { ...node, pageName: updates.name }
          : node
      );

      set({
        project: {
          ...project,
          pages: updatedPages,
          mindMap: { ...project.mindMap, nodes: updatedNodes },
        },
        currentPage: updatedPages.find((p) => p.id === pageId) || get().currentPage,
      });
      
      addToHistory();
    },

    // 마인드맵 노드 추가
    addMindMapNode: (node) => {
      const { project } = get();
      if (!project) return;

      set({
        project: {
          ...project,
          mindMap: {
            ...project.mindMap,
            nodes: [...project.mindMap.nodes, node],
          },
        },
      });
      
      addToHistory();
    },

    // 마인드맵 노드 업데이트
    updateMindMapNode: (nodeId, updates) => {
      const { project } = get();
      if (!project) return;

      const updatedNodes = project.mindMap.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      );

      set({
        project: {
          ...project,
          mindMap: { ...project.mindMap, nodes: updatedNodes },
        },
      });
      
      addToHistory();
    },

    // 마인드맵 여러 노드 일괄 업데이트
    updateMultipleMindMapNodes: (updates) => {
      const { project } = get();
      if (!project) return;

      const updatedNodes = project.mindMap.nodes.map((node) => {
        const update = updates.find((u) => u.nodeId === node.id);
        return update ? { ...node, position: update.position } : node;
      });

      set({
        project: {
          ...project,
          mindMap: { ...project.mindMap, nodes: updatedNodes },
        },
      });
      
      addToHistory();
    },

    // 마인드맵 엣지 추가
    addMindMapEdge: (edge) => {
      const { project } = get();
      if (!project) return;

      const newEdge: MindMapEdge = {
        ...edge,
        id: crypto.randomUUID(),
      };

      set({
        project: {
          ...project,
          mindMap: {
            ...project.mindMap,
            edges: [...project.mindMap.edges, newEdge],
          },
        },
      });
      
      addToHistory();
    },

    // 마인드맵 엣지 업데이트
    updateMindMapEdge: (edgeId, updates) => {
      const { project } = get();
      if (!project) return;

      const updatedEdges = project.mindMap.edges.map((edge) =>
        edge.id === edgeId ? { ...edge, ...updates } : edge
      );

      set({
        project: {
          ...project,
          mindMap: { ...project.mindMap, edges: updatedEdges },
        },
      });
      
      addToHistory();
    },

    // 노드 위치 업데이트 (레거시)
    updateNodePosition: (nodeId, position) => {
      const { updateMindMapNode } = get();
      updateMindMapNode(nodeId, { position });
    },

    // 버튼 액션과 Edge 동기화
    syncButtonActionToEdge: (blockId, action, triggerIndex) => {
      const { project, currentPage } = get();
      if (!project || !currentPage) return;

      const currentNode = project.mindMap.nodes.find((n) => n.pageId === currentPage.id);
      if (!currentNode) return;

      const filteredEdges = project.mindMap.edges.filter(
        (e) => !(e.triggerBlockId === blockId && e.triggerIndex === triggerIndex)
      );

      if (action.type === 'page' && action.pageId) {
        const targetNode = project.mindMap.nodes.find((n) => n.pageId === action.pageId);
        if (targetNode) {
          const newEdge: MindMapEdge = {
            id: `edge-${Date.now()}-${triggerIndex}`,
            source: currentNode.id,
            target: targetNode.id,
            triggerBlockId: blockId,
            triggerType: 'button',
            triggerIndex,
            label: action.label,
          };
          filteredEdges.push(newEdge);
        }
      }

      set({
        project: {
          ...project,
          mindMap: { ...project.mindMap, edges: filteredEdges },
        },
      });
      
      addToHistory();
    },

    // Edge 라벨 오프셋 업데이트
    updateEdgeLabelOffset: (edgeId, offset) => {
      const { updateMindMapEdge } = get();
      updateMindMapEdge(edgeId, { labelOffset: offset });
    },

    // 미리보기 모드 페이지 전환
    navigateToPageInPreview: (pageId) => {
      const { project, previewMode, previewHistory, previewCurrentIndex } = get();
      if (!project || !previewMode) return;

      const page = project.pages.find((p) => p.id === pageId);
      if (page) {
        const newHistory = [...previewHistory.slice(0, previewCurrentIndex + 1), pageId];
        
        set({
          currentPage: page,
          project: { ...project, currentPageId: pageId },
          previewHistory: newHistory,
          previewCurrentIndex: newHistory.length - 1,
        });
      }
    },
  };
});