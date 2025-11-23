// ============================================
// 기본 타입 정의
// ============================================

/**
 * 위치 좌표
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * 크기
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * 도형 타입
 */
export type ShapeType = 'rectangle' | 'circle' | 'triangle';

/**
 * 도구 타입 (ToolMode로도 export)
 */
export type ToolType = 'select' | ShapeType | 'line' | 'arrow' | 'text' | 'image';
export type ToolMode = ToolType; // 별칭

/**
 * 선택 모드 (SelectMode로도 export)
 */
export type SelectionMode = 'replace' | 'add' | 'remove' | 'toggle';
export type SelectMode = SelectionMode; // 별칭

/**
 * 스타일 속성
 */
export interface ShapeStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  borderRadius: number;
  opacity: number;
}

// ============================================
// 캔버스 요소 타입
// ============================================

/**
 * 기본 캔버스 요소 (모든 요소의 베이스 타입)
 */
export interface BaseElement {
  id: string;
  type: 'shape' | 'text' | 'image' | 'line' | 'arrow';
  position: Position;
  size: Size;
  rotation: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
}

/**
 * 도형 요소
 */
export interface Shape extends BaseElement {
  type: 'shape';
  shapeType: ShapeType;
  style: ShapeStyle;
}

/**
 * 텍스트 요소
 */
export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  textAlign: 'left' | 'center' | 'right';
}

/**
 * 이미지 요소
 */
export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  alt: string;
}

/**
 * 선 요소
 */
export interface LineElement extends BaseElement {
  type: 'line';
  startPoint: Position;
  endPoint: Position;
  strokeColor: string;
  strokeWidth: number;
  opacity: number;
}

/**
 * 화살표 요소
 */
export interface ArrowElement extends BaseElement {
  type: 'arrow';
  startPoint: Position;
  endPoint: Position;
  strokeColor: string;
  strokeWidth: number;
  arrowHeadSize: number;
  opacity: number;
}

/**
 * 모든 캔버스 요소 타입의 유니온
 */
export type CanvasElement = 
  | Shape 
  | TextElement 
  | ImageElement 
  | LineElement 
  | ArrowElement;

// ============================================
// SEO 설정 타입
// ============================================

/**
 * SEO 설정
 */
export interface SeoSettings {
  title: string;
  description: string;
  keywords: string[];
}

// ============================================
// 페이지 및 프로젝트 타입
// ============================================

/**
 * 페이지
 */
export interface Page {
  id: string;
  name: string;
  slug: string;
  elements: CanvasElement[];
  seoSettings: SeoSettings;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 프로젝트
 */
export interface Project {
  id: string;
  name: string;
  pages: Page[];
  currentPageId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// 선택 영역 타입
// ============================================

/**
 * 선택 영역
 */
export interface SelectionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ============================================
// 스토어 상태 타입
// ============================================

/**
 * 빌더 스토어 상태
 */
export interface BuilderState {
  // 현재 도구
  currentTool: ToolMode;
  setCurrentTool: (tool: ToolMode) => void;

  // 캔버스 요소들
  elements: CanvasElement[];
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElements: (ids: string[]) => void;

  // 선택된 요소들
  selectedElementIds: string[];
  selectElements: (ids: string[], mode?: SelectMode) => void;

  // 그리기 상태
  isDrawing: boolean;
  setIsDrawing: (isDrawing: boolean) => void;

  // 페이지 관리
  currentPage: Page;
  pages: Page[];
  addPage: (pageData?: Partial<Page>) => void;
  deletePage: (id: string) => void;
  setCurrentPage: (id: string) => void;
  updatePageElements: (elements: CanvasElement[]) => void;
}

// ============================================
// 유틸리티 타입
// ============================================

/**
 * 부분 업데이트 타입
 */
export type PartialUpdate<T> = {
  [P in keyof T]?: T[P] extends object ? PartialUpdate<T[P]> : T[P];
};