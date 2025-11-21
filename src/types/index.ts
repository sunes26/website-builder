// src/types/index.ts
// 블록 타입 정의
export type BlockType = '헤더' | '히어로' | '콘텐츠' | '갤러리' | '폼(Form)' | '푸터' | '링크 그룹';

// 🆕 요소 타입 정의
export type ElementType = 
  | 'text'           // 텍스트 요소 (h1, h2, p, span 등)
  | 'box'            // 박스/컨테이너 요소 (div, section, header 등)
  | 'image'          // 이미지 요소
  | 'button'         // 버튼 요소
  | 'link'           // 링크 요소
  | 'input'          // 입력 필드
  | 'block';         // 블록 전체

// 🆕 선택된 요소 정보
export interface SelectedElement {
  blockId: string;           // 어느 블록에 속한 요소인지
  blockType: BlockType;      // 블록 타입
  elementType: ElementType;  // 요소 타입
  elementPath: string;       // 요소의 경로 (예: "title", "subtitle", "navLinks.0.text")
  elementTag?: string;       // HTML 태그 (h1, p, div 등)
}

// 🆕 다중 선택 모드
export type SelectionMode = 'single' | 'multiple';

// 🆕 선택 영역 정의 (드래그 선택 박스)
export interface SelectionBox {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

// 🆕 박스 스타일 정의 (확장)
export interface BoxStyle {
  width?: string;              // 너비 (예: "100%", "500px", "auto")
  height?: string;             // 높이 (예: "400px", "auto")
  backgroundColor?: string;    // 배경 색상
  borderWidth?: number;        // 테두리 두께 (px)
  borderColor?: string;        // 테두리 색상
  borderRadius?: number;       // 모서리 둥글기 (px)
  paddingTop?: number;         // 안쪽 여백 - 위 (px)
  paddingRight?: number;       // 안쪽 여백 - 오른쪽 (px)
  paddingBottom?: number;      // 안쪽 여백 - 아래 (px)
  paddingLeft?: number;        // 안쪽 여백 - 왼쪽 (px)
  marginTop?: number;          // 바깥 여백 - 위 (px)
  marginBottom?: number;       // 바깥 여백 - 아래 (px)
}

// 블록 데이터 구조
export interface Block {
  id: string;
  type: BlockType;
  content: BlockContent;
  style?: BlockStyle;  // 기존 블록 스타일 (레거시)
  boxStyles?: Record<string, BoxStyle>;  // 🆕 요소별 박스 스타일 (elementPath를 키로 사용)
}

// 블록 콘텐츠 (각 블록 타입별 데이터)
export interface BlockContent {
  [key: string]: any;
}

// 버튼/링크 액션 타입
export interface ButtonAction {
  type: 'page' | 'external' | 'none';
  pageId?: string;
  externalUrl?: string;
  label: string;
}

// 헤더 블록 콘텐츠
export interface HeaderContent extends BlockContent {
  logo: string;
  logoFontSize: number;
  logoColor: string;
  navLinks: Array<{ 
    text: string; 
    action: ButtonAction;
  }>;
  navLinksColor: string;
}

// 히어로 블록 콘텐츠
export interface HeroContent extends BlockContent {
  backgroundImage: string;
  title: string;
  titleFontSize: number;
  titleColor: string;
  subtitle: string;
  subtitleFontSize: number;
  subtitleColor: string;
  buttonText: string;
  buttonAction: ButtonAction;
}

// 콘텐츠 블록
export interface ContentBlockContent extends BlockContent {
  title: string;
  titleFontSize: number;
  titleColor: string;
  text: string;
  textFontSize: number;
  textColor: string;
  imageUrl: string;
  imagePosition: 'left' | 'right';
  // 🆕 Phase 2: 콘텐츠 링크
  links?: Array<{
    text: string;
    action: ButtonAction;
  }>;
  linksColor?: string;
  showLinks?: boolean;
}

// 갤러리 블록
export interface GalleryContent extends BlockContent {
  title: string;
  titleColor: string;
  images: string[];
  columns: number;
}

// 폼 블록
export interface FormContent extends BlockContent {
  title: string;
  titleFontSize: number;
  titleColor: string;
  fields: Array<{
    id: string;
    type: 'text' | 'email' | 'textarea';
    label: string;
    placeholder: string;
  }>;
  buttonText: string;
}

// 푸터 블록
export interface FooterContent extends BlockContent {
  text: string;
  fontSize: number;
  textColor: string;
  // 🆕 Phase 1: 푸터 링크
  links?: Array<{
    text: string;
    action: ButtonAction;
  }>;
  linksColor?: string;
  showLinks?: boolean;
}

// 🆕 Phase 3: 링크 그룹 블록
export interface LinkGroupContent extends BlockContent {
  title?: string;
  titleFontSize?: number;
  titleColor?: string;
  showTitle?: boolean;
  links: Array<{
    text: string;
    action: ButtonAction;
  }>;
  linksColor: string;
  layout: 'horizontal' | 'vertical' | 'grid';
  columns?: number;
  showDivider?: boolean;
  alignment?: 'left' | 'center' | 'right';
}

// 블록 스타일 (레거시)
export interface BlockStyle {
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  margin?: string;
}

// 페이지 구조
export interface Page {
  id: string;
  name: string;
  blocks: Block[];
  route: string;
}

// 마인드맵 노드
export interface MindMapNode {
  id: string;
  pageId: string;
  pageName: string;
  position: { x: number; y: number };
  isMainPage: boolean;
}

// 마인드맵 엣지 (연결선)
export interface MindMapEdge {
  id: string;
  source: string;
  target: string;
  triggerBlockId?: string;
  triggerType?: 'button' | 'link';
  triggerIndex?: number;
  label?: string;
  labelOffset?: { x: number; y: number };
}

// 프로젝트 구조
export interface Project {
  id: string;
  name: string;
  pages: Page[];
  mindMap: {
    nodes: MindMapNode[];
    edges: MindMapEdge[];
  };
  currentPageId: string;
}

// 뷰포트 타입
export type ViewportType = 'desktop' | 'tablet' | 'mobile';

// 히스토리 상태 타입
export interface HistoryState {
  history: Project[];       // 과거 상태들
  historyIndex: number;     // 현재 위치 (-1 = 히스토리 없음)
  maxHistory: number;       // 최대 히스토리 개수
}