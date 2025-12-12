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
 * 도형 타입 (Priority 4.2: 새로운 도형 추가)
 */
export type ShapeType =
  | 'rectangle'
  | 'circle'
  | 'triangle'
  | 'star'
  | 'pentagon'
  | 'hexagon'
  | 'octagon'
  | 'diamond';

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
  boxShadow?: string; // Priority 4.4: 그림자 토큰 지원
}

// ============================================
// 인터랙션 시스템 타입 (Phase 13)
// ============================================

/**
 * 인터랙션 이벤트 타입
 */
export type InteractionEvent =
  | 'click'    // 클릭 시
  | 'hover'    // 마우스 오버 시
  | 'load'     // 페이지 로드 시
  | 'scroll';  // 스크롤 시

/**
 * 애니메이션 타입
 */
export type AnimationType =
  | 'fade-in'
  | 'fade-out'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale-up'
  | 'scale-down'
  | 'rotate';

/**
 * 이징 함수
 */
export type EasingFunction =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out';

/**
 * 네비게이션 액션
 */
export interface NavigateAction {
  type: 'navigate';
  target: 'internal' | 'external' | 'mailto' | 'tel';
  url: string;
  pageId?: string;
  openInNewTab?: boolean;
}

/**
 * 스크롤 액션
 */
export interface ScrollToAction {
  type: 'scroll-to';
  targetElementId: string;
  behavior: 'smooth' | 'auto';
  offset?: number;
}

/**
 * 애니메이션 액션
 */
export interface AnimateAction {
  type: 'animate';
  animationType: AnimationType;
  duration: number;
  delay: number;
  easing: EasingFunction;
  repeat?: number;
}

/**
 * 호버 효과 액션
 */
export interface HoverEffectAction {
  type: 'hover-effect';
  hoverStyles: {
    fill?: string;
    stroke?: string;
    color?: string;
    opacity?: number;
    scale?: number;
  };
  transition: {
    duration: number;
    easing: EasingFunction;
  };
}

/**
 * 인터랙션 액션 데이터 (통합 타입)
 */
export type InteractionActionData =
  | NavigateAction
  | ScrollToAction
  | AnimateAction
  | HoverEffectAction;

/**
 * 인터랙션 인터페이스
 */
export interface Interaction {
  id: string;
  event: InteractionEvent;
  action: InteractionActionData;
  enabled: boolean;
}

// ============================================
// 반응형 디자인 시스템 타입 (Phase 14)
// ============================================

/**
 * 브레이크포인트 타입
 */
export type Breakpoint = 'desktop' | 'tablet' | 'mobile';

/**
 * 브레이크포인트 설정
 */
export interface BreakpointConfig {
  name: Breakpoint;
  minWidth: number;
  maxWidth?: number;
  label: string;
}

/**
 * 기본 브레이크포인트 설정
 */
export const DEFAULT_BREAKPOINTS: Record<Breakpoint, BreakpointConfig> = {
  desktop: { name: 'desktop', minWidth: 1024, label: '데스크톱' },
  tablet: { name: 'tablet', minWidth: 768, maxWidth: 1023, label: '태블릿' },
  mobile: { name: 'mobile', minWidth: 0, maxWidth: 767, label: '모바일' }
};

/**
 * 반응형 오버라이드 (브레이크포인트별 속성 오버라이드)
 */
export interface ResponsiveOverrides {
  tablet?: Partial<CanvasElement>;
  mobile?: Partial<CanvasElement>;
}

// ============================================
// 레이아웃 시스템 타입 (Phase 15)
// ============================================

/**
 * CSS Position 타입
 */
export type CSSPosition = 'absolute' | 'relative' | 'static' | 'fixed' | 'sticky';

/**
 * 레이아웃 타입
 */
export type LayoutType = 'none' | 'flex' | 'grid';

/**
 * Flexbox 레이아웃 설정
 */
export interface FlexboxLayout {
  type: 'flex';
  flexDirection: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  justifyContent: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  flexWrap: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap: number; // px
  rowGap?: number; // px
  columnGap?: number; // px
}

/**
 * Grid 레이아웃 설정
 */
export interface GridLayout {
  type: 'grid';
  gridTemplateColumns: string; // "1fr 1fr 1fr", "repeat(3, 1fr)" 등
  gridTemplateRows: string;
  gap: number; // px
  rowGap?: number; // px
  columnGap?: number; // px
  justifyItems?: 'start' | 'end' | 'center' | 'stretch';
  alignItems?: 'start' | 'end' | 'center' | 'stretch';
  gridAutoFlow?: 'row' | 'column' | 'dense' | 'row dense' | 'column dense';
}

/**
 * 레이아웃 설정 (Flexbox 또는 Grid)
 */
export type LayoutConfig = FlexboxLayout | GridLayout | null;

/**
 * Flex 자식 요소 속성
 */
export interface FlexChildProps {
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: string; // 'auto', '100px', '50%' 등
  order?: number;
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
}

/**
 * Grid 자식 요소 속성
 */
export interface GridChildProps {
  gridColumn?: string; // "1 / 3", "span 2" 등
  gridRow?: string;
  justifySelf?: 'start' | 'end' | 'center' | 'stretch';
  alignSelf?: 'start' | 'end' | 'center' | 'stretch';
}

/**
 * 레이아웃 자식 속성 (Flex 또는 Grid)
 */
export type LayoutChildProps = FlexChildProps | GridChildProps | null;

/**
 * 레이아웃 계산 결과
 */
export interface ComputedLayout {
  elementId: string;
  computedPosition: Position;
  computedSize: Size;
}

// ============================================
// CSS 클래스 시스템 타입 (Phase 15.1)
// ============================================

/**
 * CSS 클래스 (재사용 가능한 스타일)
 */
export interface CSSClass {
  id: string;
  name: string; // 클래스 이름 (예: "btn-primary", "heading-1")
  description?: string;
  styles: React.CSSProperties; // CSS 스타일 객체
  hoverStyles?: React.CSSProperties; // 호버 스타일 (선택적)
  category?: string; // "buttons", "text", "containers", "utilities" 등
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 저장 가능한 CSS 클래스 (Date → ISO string)
 */
export interface SaveableCSSClass {
  id: string;
  name: string;
  description?: string;
  styles: React.CSSProperties;
  hoverStyles?: React.CSSProperties;
  category?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// ============================================
// CSS 키프레임 애니메이션 타입 (Phase 15.2)
// ============================================

/**
 * CSS 키프레임 (0%, 50%, 100% 등)
 */
export interface Keyframe {
  offset: number; // 0-100 (%)
  styles: React.CSSProperties;
}

/**
 * CSS 키프레임 애니메이션
 */
export interface KeyframeAnimation {
  id: string;
  name: string; // 애니메이션 이름 (예: "bounce", "fade-in-out")
  description?: string;
  keyframes: Keyframe[]; // 키프레임 배열
  duration: number; // ms
  timingFunction: EasingFunction;
  iterationCount: number | 'infinite';
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode: 'none' | 'forwards' | 'backwards' | 'both';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 저장 가능한 키프레임 애니메이션 (Date → ISO string)
 */
export interface SaveableKeyframeAnimation {
  id: string;
  name: string;
  description?: string;
  keyframes: Keyframe[];
  duration: number;
  timingFunction: EasingFunction;
  iterationCount: number | 'infinite';
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode: 'none' | 'forwards' | 'backwards' | 'both';
  createdAt: string;
  updatedAt: string;
}

// ============================================
// 커스텀 브레이크포인트 타입 (Phase 15.3)
// ============================================

/**
 * 커스텀 브레이크포인트 정의
 */
export interface CustomBreakpoint {
  id: string;
  name: string; // 브레이크포인트 이름 (예: "large-desktop", "small-mobile")
  minWidth: number; // px
  maxWidth?: number; // px (선택적)
  label: string; // UI 표시용 라벨
  order: number; // 정렬 순서
}

// ============================================
// 캔버스 요소 타입
// ============================================

/**
 * 기본 캔버스 요소 (모든 요소의 베이스 타입)
 */
export interface BaseElement {
  id: string;
  type: 'shape' | 'text' | 'image' | 'line' | 'arrow' | 'group' | 'component';
  position: Position;
  size: Size;
  rotation: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  // Phase 13: 인터랙션 시스템
  interactions?: Interaction[];
  anchorId?: string;
  // Phase 14: 반응형 디자인 시스템
  responsiveOverrides?: ResponsiveOverrides;
  // Phase 15: 레이아웃 시스템
  cssPosition?: CSSPosition; // CSS position 속성 (기본값: 'absolute')
  layout?: LayoutConfig; // 컨테이너 레이아웃 설정 (그룹/컴포넌트만 사용)
  layoutChild?: LayoutChildProps; // 자식 요소 레이아웃 속성
  computedPosition?: Position; // 레이아웃 엔진이 계산한 위치 (읽기 전용)
  // Phase 15.1: CSS 클래스 시스템
  classNames?: string[]; // 적용된 CSS 클래스 ID 배열
  // Phase 15.2: CSS 키프레임 애니메이션
  animationName?: string; // 적용된 키프레임 애니메이션 ID
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
 * 텍스트 요소 (Priority 4.1: 리치 텍스트 기능 확장)
 */
export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline' | 'line-through' | 'underline line-through';
  color: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textShadow?: string; // Priority 4.4: 그림자 토큰 지원
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
 * 그룹 요소 (Phase 8)
 */
export interface GroupElement extends BaseElement {
  type: 'group';
  childElementIds: string[];
}

/**
 * 컴포넌트 인스턴스 (Phase 12)
 */
export interface ComponentInstance extends BaseElement {
  type: 'component';
  componentId: string;           // 마스터 컴포넌트 참조
  childElementIds: string[];     // 실제 자식 요소 ID 배열
  overrides: Record<string, any>; // elementId를 키로 속성 오버라이드
  isDetached: boolean;           // 마스터 연결 끊김 여부
}

/**
 * 모든 캔버스 요소 타입의 유니온
 */
export type CanvasElement =
  | Shape
  | TextElement
  | ImageElement
  | LineElement
  | ArrowElement
  | GroupElement
  | ComponentInstance;

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
// 컴포넌트 시스템 타입 (Phase 12)
// ============================================

/**
 * 컴포넌트 (마스터)
 */
export interface Component {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;            // base64 이미지 또는 SVG 문자열
  elements: CanvasElement[];     // 컴포넌트를 구성하는 요소들 (상대 좌표)
  createdAt: Date;
  updatedAt: Date;
  category?: string;             // 'buttons', 'cards', 'headers' 등
  tags?: string[];
}

/**
 * 저장 가능한 컴포넌트 (Date → ISO string)
 */
export interface SaveableComponent {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  elements: CanvasElement[];
  createdAt: string;  // ISO string
  updatedAt: string;  // ISO string
  category?: string;
  tags?: string[];
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
  components: Component[];  // Phase 12: 컴포넌트 라이브러리
  cssClasses?: CSSClass[];  // Phase 15.1: CSS 클래스 라이브러리
  keyframeAnimations?: KeyframeAnimation[];  // Phase 15.2: 키프레임 애니메이션 라이브러리
  customBreakpoints?: CustomBreakpoint[];  // Phase 15.3: 커스텀 브레이크포인트
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
// 히스토리 타입 (Phase 8)
// ============================================

/**
 * 히스토리 엔트리 (스냅샷)
 */
export interface HistoryEntry {
  elements: CanvasElement[];
  selectedElementIds: string[];
  timestamp: number;
  action?: string; // Priority 3.3: 작업 이름
}

/**
 * 히스토리 구조
 */
export interface History {
  past: HistoryEntry[];
  present: HistoryEntry | null;
  future: HistoryEntry[];
  maxSize: number;
}

// ============================================
// 프로젝트 저장/불러오기 타입 (Phase 10)
// ============================================

/**
 * 저장 가능한 페이지 (Date → ISO string 변환)
 */
export interface SaveablePage {
  id: string;
  name: string;
  slug: string;
  elements: CanvasElement[];
  seoSettings: SeoSettings;
  createdAt: string;  // ISO string
  updatedAt: string;  // ISO string
}

/**
 * 저장 가능한 프로젝트 (Date → ISO string 변환)
 */
export interface SaveableProject {
  id: string;
  name: string;
  pages: SaveablePage[];
  currentPageId: string;
  components: SaveableComponent[];  // Phase 12: 컴포넌트 라이브러리
  cssClasses?: SaveableCSSClass[];  // Phase 15.1: CSS 클래스 라이브러리
  keyframeAnimations?: SaveableKeyframeAnimation[];  // Phase 15.2: 키프레임 애니메이션 라이브러리
  customBreakpoints?: CustomBreakpoint[];  // Phase 15.3: 커스텀 브레이크포인트
  designTokens?: DesignTokens;  // Priority 4.4: 디자인 토큰 시스템
  createdAt: string;  // ISO string
  updatedAt: string;  // ISO string
}

/**
 * 프로젝트 메타데이터 (목록 표시용)
 */
export interface ProjectMetadata {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  pageCount: number;
  elementCount: number;
}

/**
 * LocalStorage 데이터 구조
 */
export interface LocalStorageData {
  version: string;
  lastOpenedProjectId: string | null;
  projects: SaveableProject[];
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
  switchPage: (id: string) => void;
  updatePage: (id: string, updates: Partial<Omit<Page, 'id' | 'elements' | 'createdAt'>>) => void;
  updatePageElements: (elements: CanvasElement[]) => void;

  // 레이어 관리 (Phase 6)
  moveLayerUp: (id: string) => void;
  moveLayerDown: (id: string) => void;

  // Undo/Redo 히스토리 (Phase 8)
  history: History;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  jumpToHistoryState: (targetIndex: number) => void;

  // 정렬 도구 (Phase 8)
  alignElements: (alignType: import('../utils/alignUtils').AlignType) => void;
  distributeElements: (direction: 'horizontal' | 'vertical') => void;

  // 그룹화 (Phase 8)
  groupElements: () => void;
  ungroupElements: (groupId: string) => void;

  // 프로젝트 관리 (Phase 10)
  projectId: string;
  projectName: string;
  lastSaved: Date | null;
  isSaving: boolean;
  lastAutoSaved: Date | null;
  autoSaveEnabled: boolean;

  setProjectName: (name: string) => void;
  saveProject: () => boolean;
  autoSaveProject: () => boolean;
  toggleAutoSave: () => void;
  loadProject: (projectId: string) => boolean;
  createNewProject: (name: string) => void;
  renameProject: (name: string) => void;
  deleteProjectById: (projectId: string) => boolean;
  exportProject: () => void;
  importProject: (file: File) => Promise<void>;
  duplicateProject: () => void;

  // 컴포넌트 시스템 (Phase 12)
  components: Component[];
  createComponent: (name: string, description?: string) => Component | null;
  updateComponent: (id: string, updates: Partial<Component>) => void;
  deleteComponent: (id: string) => void;
  addComponentInstance: (componentId: string, position: Position) => void;
  overrideComponentInstance: (instanceId: string, propertyPath: string, value: any) => void;
  detachComponentInstance: (instanceId: string) => void;
  syncComponentInstances: (componentId: string) => void;
  duplicateComponent: (id: string) => Component;

  // 인터랙션 시스템 (Phase 13)
  addInteraction: (elementId: string, interaction: Omit<Interaction, 'id'>) => void;
  updateInteraction: (elementId: string, interactionId: string, updates: Partial<Interaction>) => void;
  removeInteraction: (elementId: string, interactionId: string) => void;
  toggleInteraction: (elementId: string, interactionId: string) => void;
  setAnchorId: (elementId: string, anchorId: string) => void;

  // 반응형 디자인 시스템 (Phase 14)
  currentBreakpoint: Breakpoint;
  setCurrentBreakpoint: (breakpoint: Breakpoint) => void;
  setResponsiveOverride: (elementId: string, breakpoint: Breakpoint, updates: Partial<CanvasElement>) => void;
  clearResponsiveOverride: (elementId: string, breakpoint: Breakpoint) => void;
  getResolvedProperties: (element: CanvasElement, breakpoint: Breakpoint) => CanvasElement;

  // 레이아웃 시스템 (Phase 15)
  setLayout: (elementId: string, layout: LayoutConfig) => void;
  setLayoutChild: (elementId: string, props: LayoutChildProps) => void;
  setCSSPosition: (elementId: string, position: CSSPosition) => void;
  updateComputedPositions: (layouts: ComputedLayout[]) => void;

  // CSS 클래스 시스템 (Phase 15.1)
  cssClasses: CSSClass[];
  createCSSClass: (name: string, styles: React.CSSProperties, options?: Partial<CSSClass>) => CSSClass;
  updateCSSClass: (id: string, updates: Partial<CSSClass>) => void;
  deleteCSSClass: (id: string) => void;
  duplicateCSSClass: (id: string) => CSSClass;
  addClassToElement: (elementId: string, classId: string) => void;
  removeClassFromElement: (elementId: string, classId: string) => void;

  // CSS 키프레임 애니메이션 시스템 (Phase 15.2)
  keyframeAnimations: KeyframeAnimation[];
  createKeyframeAnimation: (name: string, keyframes: Keyframe[], options?: Partial<KeyframeAnimation>) => KeyframeAnimation;
  updateKeyframeAnimation: (id: string, updates: Partial<KeyframeAnimation>) => void;
  deleteKeyframeAnimation: (id: string) => void;
  duplicateKeyframeAnimation: (id: string) => KeyframeAnimation;
  applyAnimationToElement: (elementId: string, animationId: string) => void;
  removeAnimationFromElement: (elementId: string) => void;

  // 커스텀 브레이크포인트 시스템 (Phase 15.3)
  customBreakpoints: CustomBreakpoint[];
  addCustomBreakpoint: (breakpoint: Omit<CustomBreakpoint, 'id'>) => CustomBreakpoint;
  updateCustomBreakpoint: (id: string, updates: Partial<CustomBreakpoint>) => void;
  deleteCustomBreakpoint: (id: string) => void;
  reorderBreakpoints: (breakpoints: CustomBreakpoint[]) => void;

  // 캔버스 줌 & 팬 (Priority 0.1)
  canvasZoom: number;
  canvasPanX: number;
  canvasPanY: number;
  setCanvasZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setCanvasPan: (panX: number, panY: number) => void;

  // 그리드 & 스냅 (Priority 0.2)
  showGrid: boolean;
  gridSize: number;
  snapToGrid: boolean;
  toggleGrid: () => void;
  setGridSize: (size: number) => void;
  toggleSnap: () => void;

  // 요소 복제 (Priority 1.1)
  duplicateElements: (ids: string[], offset?: { x: number; y: number }) => string[];

  // 스마트 가이드라인 (Priority 2.1)
  smartGuides: SmartGuide[];
  setSmartGuides: (guides: SmartGuide[]) => void;

  // 박스 선택 (Priority 2.2)
  selectionBox: BoxSelection | null;
  setSelectionBox: (box: BoxSelection | null) => void;

  // 색상 팔레트 (Priority 3.1)
  colorPalette: ColorPaletteItem[];
  addColorToPalette: (color: string, name?: string) => void;
  removeColorFromPalette: (id: string) => void;
  updatePaletteColor: (id: string, updates: Partial<ColorPaletteItem>) => void;
  clearColorPalette: () => void;

  // 디자인 토큰 시스템 (Priority 4.4)
  designTokens: DesignTokens;
  applyTypographyToken: (elementId: string, tokenId: string) => void;
  applyColorToken: (elementId: string, tokenId: string, property: 'fill' | 'stroke' | 'color') => void;
  applyShadowToken: (elementId: string, tokenId: string) => void;
  applyRadiusToken: (elementId: string, tokenId: string) => void;
  resetDesignTokens: () => void;
}

// ============================================
// 스마트 가이드라인 시스템 (Priority 2.1)
// ============================================

/**
 * 스마트 가이드라인 타입
 */
export interface SmartGuide {
  type: 'vertical' | 'horizontal';
  position: number;
  label?: string;
}

// ============================================
// 박스 선택 시스템 (Priority 2.2)
// ============================================

/**
 * 박스 선택 영역
 */
export interface BoxSelection {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

// ============================================
// 색상 팔레트 시스템 (Priority 3.1)
// ============================================

/**
 * 색상 팔레트 아이템
 */
export interface ColorPaletteItem {
  id: string;
  color: string;
  name?: string;
  createdAt: Date;
}

// ============================================
// 디자인 토큰 시스템 (Priority 4.4)
// ============================================

/**
 * 타이포그래피 토큰
 */
export interface TypographyToken {
  id: string;
  name: string;
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
  letterSpacing?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

/**
 * 색상 토큰
 */
export interface ColorToken {
  id: string;
  name: string;
  value: string;
  category: 'primary' | 'secondary' | 'accent' | 'neutral' | 'semantic';
}

/**
 * 그림자 토큰
 */
export interface ShadowToken {
  id: string;
  name: string;
  value: string; // CSS box-shadow value
}

/**
 * Border Radius 토큰
 */
export interface RadiusToken {
  id: string;
  name: string;
  value: number; // px
}

/**
 * 디자인 토큰 세트
 */
export interface DesignTokens {
  typography: TypographyToken[];
  colors: ColorToken[];
  shadows: ShadowToken[];
  radius: RadiusToken[];
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