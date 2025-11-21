# 블록 기반 웹사이트 빌더 - 완전 가이드

**React + TypeScript 기반의 노코드 웹사이트 빌더**

버전: v6.0 (드래그 선택 박스 기능 완성) 🎉  
작성일: 2025년 11월  
최종 업데이트: 2025년 11월 22일 - 드래그 선택 박스, 텍스트 선택 방지 완료

---

## 📑 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [빠른 시작](#2-빠른-시작)
3. [프로젝트 구조](#3-프로젝트-구조)
4. [아키텍처](#4-아키텍처)
5. [레이아웃 시스템](#5-레이아웃-시스템)
6. [Figma 스타일 요소 선택 시스템](#6-figma-스타일-요소-선택-시스템)
7. [PropertiesPanel 사용법](#7-propertiespanel-사용법)
8. [박스 스타일 편집 시스템](#8-박스-스타일-편집-시스템)
9. [다중 블록 선택 시스템](#9-다중-블록-선택-시스템)
10. [드래그 선택 박스 시스템](#10-드래그-선택-박스-시스템) ✅ 신규
11. [블록 시스템](#11-블록-시스템)
12. [페이지 간 연결 시스템](#12-페이지-간-연결-시스템)
13. [마인드맵 시스템](#13-마인드맵-시스템)
14. [이미지 관리 시스템](#14-이미지-관리-시스템)
15. [블록 복사/붙여넣기 시스템](#15-블록-복사붙여넣기-시스템)
16. [실행 취소/다시 실행 시스템](#16-실행-취소다시-실행-시스템)
17. [상태 관리](#17-상태-관리)
18. [개발 가이드](#18-개발-가이드)
19. [트러블슈팅](#19-트러블슈팅)

---

## 1. 프로젝트 개요

### 1.1 소개

코딩 지식 없이도 누구나 손쉽게 웹사이트를 제작할 수 있는 노코드 웹사이트 빌더입니다.

### 1.2 주요 기능

- 🎨 **드래그 앤 드롭 블록 배치**: 좌측 패널에서 블록을 드래그하여 캔버스에 배치
- ⚙️ **실시간 속성 편집**: React Hook Form 기반의 강력한 편집 패널
- 🎯 **Figma 스타일 요소 선택**: 텍스트, 이미지, 버튼 등 개별 요소 클릭하여 편집
- 📦 **박스 스타일 편집**: 컨테이너 크기, 배경, 테두리, 여백 등 세밀한 레이아웃 제어
- 🎯 **다중 블록 선택**: Figma처럼 Ctrl+클릭, Shift+클릭으로 여러 블록 선택
- 🖱️ **드래그 선택 박스**: 마우스 드래그로 영역 선택하여 블록 선택 ✅ v6.0
- 🚫 **텍스트 선택 방지**: 드래그 시 텍스트가 선택되지 않음 ✅ v6.0
- 📝 **요소별 속성 패널**: 텍스트 색상, 정렬, 폰트, 이미지 크기, 버튼 링크 등 세밀한 편집
- 🗺️ **마인드맵 사이트 구조**: 페이지 간 연결을 시각적으로 설계
- 🔗 **페이지 간 자동 연결**: 버튼/링크 설정 시 마인드맵에 자동 반영
- 📊 **Multi-Edge 지원**: 같은 목적지로 가는 여러 링크 시각화
- ✨ **최적화된 자동 정렬**: 일괄 업데이트 방식의 빠른 마인드맵 정렬
- 🎯 **지능형 노드 배치**: 동적 너비 계산 및 겹침 방지
- 🖱️ **노드 더블클릭 네비게이션**: 마인드맵에서 페이지로 빠른 이동
- 🏷️ **엣지 라벨 드래그**: 버튼/링크 라벨을 독립적으로 드래그하여 위치 조정
- 📱 **반응형 미리보기**: 데스크톱, 태블릿, 모바일 뷰포트 전환
- 📋 **블록 복사/붙여넣기**: 키보드 단축키로 빠른 블록 복제
- ✂️ **블록 잘라내기**: 블록을 이동하거나 재배치
- 🔢 **자동 라벨 증가**: 복사 시 버튼 이름 자동 증가 (버튼1 → 버튼1(2))
- ⏮️ **실행 취소/다시 실행**: 히스토리 스택 기반의 Undo/Redo 시스템
- ⌨️ **키보드 단축키**: Ctrl+Z, Ctrl+Shift+Z로 빠른 작업 취소/복원
- 💾 **최대 50개 히스토리**: 메모리 최적화된 히스토리 관리
- 🖼️ **이미지 업로드**: Base64 방식의 드래그 앤 드롭 이미지 업로드
- 🎨 **이미지 자동 최적화**: 압축 및 리사이즈로 빠른 로딩
- 💾 **효율적인 상태 관리**: Zustand를 사용한 전역 상태 관리

### 1.3 기술 스택

```
Frontend
├── React 18              # UI 라이브러리
├── TypeScript           # 타입 안정성
├── Vite                 # 빌드 도구
├── Tailwind CSS         # 스타일링
└── Lucide React         # 아이콘

상태 관리
├── Zustand              # 전역 상태
└── React Hook Form      # 폼 상태

드래그 앤 드롭
├── @dnd-kit/core        # 드래그 앤 드롭 코어
└── @dnd-kit/sortable    # 정렬 기능

마인드맵
└── ReactFlow            # 노드 기반 다이어그램

이미지 처리
└── Canvas API           # 이미지 압축 및 리사이즈
```

---

## 2. 빠른 시작

### 2.1 설치

```bash
# 저장소 클론
git clone <repository-url>

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 2.2 첫 번째 페이지 만들기

1. **블록 추가**: 좌측 패널에서 "히어로" 블록을 드래그하여 캔버스에 배치
2. **요소 선택**: 히어로 블록 내의 제목 텍스트를 클릭
3. **속성 편집**: 우측 패널에서 텍스트 내용, 크기, 색상 편집
4. **박스 편집**: 히어로 블록의 배경 클릭 → 배경색, 여백, 테두리 설정
5. **이미지 추가**: 배경 이미지 업로드 또는 URL 입력
6. **버튼 설정**: 버튼을 클릭하고 동작(페이지 이동/외부 링크) 설정
7. **미리보기**: 상단의 "미리보기" 버튼으로 결과 확인

### 2.3 다중 블록 선택 사용법

```
1. Ctrl+클릭: 여러 블록 추가/제거 선택
2. Shift+클릭: 범위 선택 (첫 선택~마지막 선택)
3. 드래그 선택: 마우스로 영역 드래그하여 블록 선택 ✅ v6.0
4. Ctrl+드래그: 기존 선택 유지하며 추가 선택 ✅ v6.0
5. Ctrl+A: 모든 블록 선택
6. Delete: 선택된 블록 일괄 삭제
7. Ctrl+C/V: 다중 복사/붙여넣기
8. Ctrl+X: 다중 잘라내기
```

---

## 3. 프로젝트 구조

### 3.1 전체 디렉토리 구조

```
website-builder/
│
├── 📄 .eslintrc.cjs                   # ESLint 설정
├── 📄 .gitignore                      # Git 제외 파일
├── 📄 package.json                    # 프로젝트 의존성
├── 📄 tsconfig.json                   # TypeScript 설정
├── 📄 tsconfig.node.json              # Node TypeScript 설정
├── 📄 vite.config.ts                  # Vite 빌드 설정
├── 📄 tailwind.config.js              # Tailwind CSS 설정
├── 📄 postcss.config.js               # PostCSS 설정
├── 📄 index.html                      # HTML 진입점
├── 📄 README.md                       # 프로젝트 문서
│
└── 📁 src/
    │
    ├── 📄 main.tsx                    # React 앱 엔트리
    ├── 📄 App.tsx                     # 최상위 컴포넌트
    ├── 📄 index.css                   # 전역 스타일 ✅ v6.0 업데이트
    │
    ├── 📁 components/                 # React 컴포넌트
    │   │
    │   ├── 📄 Layout.tsx              # 레이아웃 컨테이너
    │   ├── 📄 Navbar.tsx              # 상단 네비게이션 바
    │   ├── 📄 Toolbar.tsx             # 툴바 (탭, 뷰포트, Undo/Redo)
    │   ├── 📄 Sidebar.tsx             # 좌측 사이드바 컨테이너
    │   ├── 📄 BlockPanel.tsx          # 블록 목록 패널
    │   ├── 📄 SettingsPanel.tsx       # 설정 패널
    │   ├── 📄 Canvas.tsx              # 중앙 캔버스 ✅ v6.0 완성
    │   ├── 📄 BlockRenderer.tsx       # 블록 렌더링 ✅ v6.0 완성
    │   ├── 📄 ImageUploader.tsx       # 이미지 업로드 컴포넌트
    │   ├── 📄 MindMapView.tsx         # 마인드맵 뷰
    │   ├── 📄 CustomEdge.tsx          # 커스텀 Edge 컴포넌트
    │   ├── 📄 PreviewNavBar.tsx       # 미리보기 모드 네비게이션
    │   │
    │   └── 📁 PropertiesPanel/        # 우측 속성 패널
    │       ├── 📄 index.tsx           # 메인 진입점 (동적 폼 렌더링)
    │       ├── 📄 FormGroup.tsx       # 재사용 폼 컴포넌트
    │       │
    │       ├── 🎨 블록 전체 폼
    │       ├── 📄 HeaderForm.tsx      # 헤더 블록 폼
    │       ├── 📄 HeroForm.tsx        # 히어로 블록 폼
    │       ├── 📄 ContentForm.tsx     # 콘텐츠 블록 폼
    │       ├── 📄 GalleryForm.tsx     # 갤러리 블록 폼
    │       ├── 📄 FormBlockForm.tsx   # 폼 블록 폼
    │       ├── 📄 FooterForm.tsx      # 푸터 블록 폼
    │       │
    │       └── 🎯 요소별 폼
    │           ├── 📄 TextElementForm.tsx       # 텍스트 요소 폼
    │           ├── 📄 BoxElementForm.tsx        # 박스/컨테이너 폼
    │           ├── 📄 ImageElementForm.tsx      # 이미지 요소 폼
    │           ├── 📄 ButtonElementForm.tsx     # 버튼 요소 폼
    │           └── 📄 LinkElementForm.tsx       # 링크 요소 폼
    │
    ├── 📁 store/                      # 상태 관리
    │   └── 📄 builderStore.ts         # Zustand 스토어 ✅ v6.0 완성
    │
    ├── 📁 types/                      # TypeScript 타입
    │   └── 📄 index.ts                # 모든 타입 정의 ✅ v6.0 완성
    │
    └── 📁 utils/                      # 유틸리티
        ├── 📄 blockTemplates.ts       # 블록 템플릿
        └── 📄 imageUtils.ts           # 이미지 처리 유틸리티
```

### 3.2 핵심 파일

| 파일 | 용도 | 중요도 | 상태 |
|------|------|--------|------|
| `App.tsx` | 앱 시작점 | ⭐⭐⭐ | - |
| `Layout.tsx` | 레이아웃 구조 | ⭐⭐⭐ | - |
| `Navbar.tsx` | 상단 네비게이션 | ⭐⭐ | - |
| `Toolbar.tsx` | 툴바 (선택 배지) | ⭐⭐⭐ | v5.0 |
| `Sidebar.tsx` | 좌측 사이드바 컨테이너 | ⭐⭐ | - |
| `BlockPanel.tsx` | 블록 목록 패널 | ⭐⭐⭐ | - |
| `SettingsPanel.tsx` | 설정 패널 | ⭐⭐ | - |
| `Canvas.tsx` | 드래그 선택 박스 | ⭐⭐⭐ | ✅ v6.0 |
| `BlockRenderer.tsx` | data-block-id 속성 | ⭐⭐⭐ | ✅ v6.0 |
| `index.css` | 텍스트 선택 방지 CSS | ⭐⭐⭐ | ✅ v6.0 |
| `ImageUploader.tsx` | 이미지 업로드 | ⭐⭐⭐ | - |
| `MindMapView.tsx` | 마인드맵 뷰 | ⭐⭐⭐ | - |
| `CustomEdge.tsx` | 드래그 가능한 엣지 | ⭐⭐⭐ | - |
| `PreviewNavBar.tsx` | 미리보기 네비게이션 | ⭐⭐ | - |
| `builderStore.ts` | 상태 관리 | ⭐⭐⭐ | ✅ v6.0 |
| `types/index.ts` | 타입 정의 (SelectionBox 등) | ⭐⭐⭐ | ✅ v6.0 |
| **PropertiesPanel/** | | | |
| `index.tsx` | 다중 선택 패널 | ⭐⭐⭐ | v5.0 |
| `FormGroup.tsx` | 재사용 폼 컴포넌트 | ⭐⭐ | - |
| `TextElementForm.tsx` | 텍스트 속성 편집 | ⭐⭐⭐ | v4.0 |
| `ImageElementForm.tsx` | 이미지 속성 편집 | ⭐⭐⭐ | v4.0 |
| `ButtonElementForm.tsx` | 버튼 속성 편집 | ⭐⭐⭐ | v4.0 |
| `LinkElementForm.tsx` | 링크 속성 편집 | ⭐⭐⭐ | v4.0 |
| `BoxElementForm.tsx` | 박스 속성 편집 | ⭐⭐⭐ | v4.1 |
| `HeaderForm.tsx` | 헤더 블록 폼 | ⭐⭐ | - |
| `HeroForm.tsx` | 히어로 블록 폼 | ⭐⭐ | - |
| `ContentForm.tsx` | 콘텐츠 블록 폼 | ⭐⭐ | - |
| `GalleryForm.tsx` | 갤러리 블록 폼 | ⭐⭐ | - |
| `FormBlockForm.tsx` | 폼 블록 폼 | ⭐⭐ | - |
| `FooterForm.tsx` | 푸터 블록 폼 | ⭐⭐ | - |

---

## 10. 드래그 선택 박스 시스템 ✅ v6.0

### 10.1 개요

마우스 드래그로 영역을 선택하여 여러 블록을 한 번에 선택할 수 있는 Figma 스타일의 선택 시스템입니다.

### 10.2 선택 방법

#### 기본 드래그 선택
```
빈 공간에서 마우스 드래그
→ 파란색 반투명 선택 박스 표시
→ 박스 내 블록들이 실시간 하이라이트
→ 마우스를 떼면 선택 완료
```

#### Ctrl+드래그 (추가 선택)
```
Ctrl/Cmd 키를 누른 채로 드래그
→ 기존 선택 유지
→ 박스 내 블록들을 기존 선택에 추가
```

#### 일반 드래그 (새로운 선택)
```
Ctrl 없이 드래그
→ 기존 선택 해제
→ 박스 내 블록들만 새로 선택
```

### 10.3 시각적 피드백

```css
/* 선택 박스 스타일 */
background: rgba(59, 130, 246, 0.1)  /* 파란색 10% 투명 */
border: 2px solid #3b82f6            /* 파란색 실선 */
border-radius: 4px                   /* 둥근 모서리 */
cursor: crosshair                    /* 십자 커서 */
```

### 10.4 충돌 감지 알고리즘

**AABB (Axis-Aligned Bounding Box) 방식:**
```typescript
const isOverlapping = !(
  blockRight < boxLeft ||
  blockLeft > boxRight ||
  blockBottom < boxTop ||
  blockTop > boxBottom
);
```

**장점:**
- 빠른 계산 속도
- 정확한 겹침 감지
- 블록 일부만 포함해도 선택 가능

### 10.5 텍스트 선택 방지 ✅ v6.0

드래그 선택 시 텍스트가 파란색으로 선택되는 것을 방지합니다.

#### CSS 방식
```css
.viewport-canvas.selecting {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
```

#### JavaScript 방식
```typescript
handleMouseDown(e) {
  e.preventDefault();  // 텍스트 선택 방지
}

handleMouseMove(e) {
  e.preventDefault();  // 드래그 중 선택 방지
}
```

### 10.6 타입 정의

```typescript
// 선택 영역
export interface SelectionBox {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

// 상태 관리
interface BuilderState {
  selectionBox: SelectionBox | null;
  isSelecting: boolean;
  setSelectionBox: (box: SelectionBox | null) => void;
  setIsSelecting: (isSelecting: boolean) => void;
  selectBlocksInBox: (box: SelectionBox, mode: 'replace' | 'add') => void;
}
```

### 10.7 주요 기능

| 기능 | 설명 | 상태 |
|------|------|------|
| 드래그 선택 박스 | 마우스 드래그로 영역 선택 | ✅ |
| AABB 충돌 감지 | 블록과 박스 겹침 자동 감지 | ✅ |
| Ctrl+드래그 | 기존 선택 유지하며 추가 | ✅ |
| 시각적 피드백 | 파란색 반투명 박스 표시 | ✅ |
| 텍스트 선택 방지 | 드래그 시 텍스트 선택 안 됨 | ✅ |
| 스크롤 고려 | 스크롤 위치 반영한 좌표 | ✅ |
| 성능 최적화 | useRef로 불필요한 리렌더링 방지 | ✅ |

### 10.8 사용 예시

#### 예시 1: 여러 블록 선택
```
1. 캔버스 빈 공간에서 마우스 버튼 누르기
2. 드래그하여 블록 3개 포함
3. 마우스 버튼 떼기
→ ✅ 3개 블록 모두 선택됨
→ ✅ 체크박스 표시
→ ✅ 툴바에 "3개 선택됨" 배지
```

#### 예시 2: Ctrl+드래그로 추가 선택
```
1. 블록 1개 클릭 (선택)
2. Ctrl 키를 누른 채로
3. 빈 공간 드래그하여 다른 블록 2개 포함
4. 마우스 버튼 떼기
→ ✅ 총 3개 블록 선택됨 (1 + 2)
```

#### 예시 3: 텍스트 선택 안 됨
```
드래그 시작
→ ✅ 텍스트가 파란색으로 선택되지 않음
→ ✅ 선택 박스만 표시
→ ✅ 블록 선택 정상 작동
```

---

## 19. 트러블슈팅

### 19.1 다중 블록 선택 문제

#### Q1: Ctrl+클릭이 작동하지 않아요
**증상:**
```
텍스트/이미지 Ctrl+클릭 → 아무 반응 없음 ❌
```

**해결:**
- 제공된 `Canvas.tsx`가 적용되었는지 확인
- `onClickCapture` 이벤트가 있는지 확인

#### Q2: 드래그 선택 박스가 블록을 선택하지 않아요 ✅
**증상:**
```
드래그 선택 박스는 표시되지만
→ ❌ 블록이 선택되지 않음
```

**원인:**
- BlockRenderer에 `data-block-id` 속성이 없음

**해결:**
```typescript
// BlockRenderer.tsx 확인
<div
  data-block-id={block.id}  // ⭐ 이 속성 필수!
  className="editable-block"
>
```

#### Q3: 드래그 시 텍스트가 파란색으로 선택돼요 ✅
**증상:**
```
드래그 시작 → 텍스트가 파란색으로 선택됨 ❌
```

**해결:**
1. `index.css`에 텍스트 선택 방지 CSS 추가
```css
.viewport-canvas.selecting {
  user-select: none;
  -webkit-user-select: none;
}
```

2. `Canvas.tsx`에서 `e.preventDefault()` 호출 확인

#### Q4: 선택 박스가 보이지 않아요
**확인:**
- Canvas.tsx가 업데이트되었는지 확인
- `renderSelectionBox()` 함수 존재 확인
- 빈 공간에서 드래그하는지 확인 (블록 위에서는 안 됨)

### 19.2 CSS 경고 문제 ✅

#### Q1: VS Code에서 CSS 경고가 보여요
**증상:**
```
Unknown at rule @tailwind
Unknown at rule @apply
```

**해결 방법 1: CSS 검증 비활성화**
```
1. Ctrl/Cmd + Shift + P
2. "Open User Settings (JSON)" 입력
3. 추가: "css.validate": false
4. 저장 후 VS Code 재시작
```

**해결 방법 2: Tailwind CSS IntelliSense 설치**
```
1. 확장 창 열기 (Ctrl+Shift+X)
2. "Tailwind CSS IntelliSense" 검색
3. 설치
4. VS Code 재시작
```

**참고:** 이것은 경고일 뿐 실제 에러가 아닙니다! 앱은 정상 작동합니다.

### 19.3 일반적인 문제

#### Q5: 박스 요소가 선택되지 않아요
**확인:**
- 미리보기 모드인가요? (편집 모드로 전환)
- 텍스트나 버튼을 클릭하지 않았나요? (빈 공간 클릭)
- BlockRenderer.tsx에 onClick 이벤트가 있나요?

#### Q6: 블록 드래그가 선택 박스와 충돌해요
**확인:**
- Canvas.tsx에서 빈 공간 감지 로직 확인:
```typescript
const isBlock = target.closest('[data-block-id]');
if (isBlock) return;  // 블록 위에서는 선택 박스 시작 안 함
```

---

## 📚 추가 리소스

### 공식 문서

- [React 공식 문서](https://react.dev/)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [Zustand 문서](https://docs.pmnd.rs/zustand/)
- [React Hook Form](https://react-hook-form.com/)
- [ReactFlow 문서](https://reactflow.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### 프로젝트 문서

- `DRAG_SELECTION_GUIDE.md` - 드래그 선택 박스 상세 가이드 ✅
- `TEXT_SELECTION_FIX.md` - 텍스트 선택 방지 가이드 ✅
- `CSS_WARNING_FIX.md` - CSS 경고 해결 가이드 ✅
- `COMPLETION_REPORT.md` - 다중 블록 선택 완성 보고서
- `CTRL_CLICK_TEST_GUIDE.md` - Ctrl+클릭 테스트 가이드
- `TEST_GUIDE.md` - 전체 테스트 가이드

---

## 🎯 향후 개발 계획

### 단기 (1-2개월)

- [x] 페이지 간 연결 시스템
- [x] Multi-Edge 처리
- [x] 마인드맵 자동 정렬
- [x] 이미지 업로드 기능
- [x] 블록 복사/붙여넣기
- [x] 마인드맵 라벨 드래그
- [x] 실행 취소/다시 실행
- [x] Figma 스타일 요소 선택
- [x] 박스 스타일 실제 적용
- [x] 다중 블록 선택 (완성)
- [x] 드래그 선택 박스 (완성) ✅ v6.0
- [x] 텍스트 선택 방지 (완성) ✅ v6.0
- [ ] 다중 블록 정렬 기능
- [ ] 그룹화/그룹 해제
- [ ] 선택 영역 내 블록 개수 표시

### 중기 (3-6개월)

- [ ] 템플릿 시스템
- [ ] 조건부 라우팅
- [ ] 애니메이션 효과
- [ ] 반응형 블록 설정
- [ ] 추가 키보드 단축키
- [ ] 히스토리 브라우저 UI
- [ ] 요소 변형 (회전, 크기 조절)
- [ ] 레이어 시스템
- [ ] Display 속성 (Flex, Grid)
- [ ] Position 속성 (Absolute, Relative)

### 장기 (6개월+)

- [ ] 데이터베이스 연동
- [ ] 사용자 인증 시스템
- [ ] 실제 웹사이트 배포
- [ ] CMS 기능
- [ ] 협업 기능
- [ ] 히스토리 영구 저장
- [ ] AI 기반 디자인 제안
- [ ] 고급 레이아웃 시스템

---

## 🎉 마무리

이 가이드를 통해 블록 기반 웹사이트 빌더의 모든 측면을 이해하셨기를 바랍니다.

### 빠른 참조

1. **시작하기**: [2. 빠른 시작](#2-빠른-시작)
2. **프로젝트 구조**: [3. 프로젝트 구조](#3-프로젝트-구조)
3. **요소 선택**: [6. Figma 스타일 요소 선택 시스템](#6-figma-스타일-요소-선택-시스템)
4. **속성 편집**: [7. PropertiesPanel 사용법](#7-propertiespanel-사용법)
5. **박스 스타일**: [8. 박스 스타일 편집 시스템](#8-박스-스타일-편집-시스템)
6. **다중 선택**: [9. 다중 블록 선택 시스템](#9-다중-블록-선택-시스템)
7. **드래그 선택**: [10. 드래그 선택 박스 시스템](#10-드래그-선택-박스-시스템) ✅ v6.0
8. **문제 해결**: [19. 트러블슈팅](#19-트러블슈팅)

### 주요 업데이트

**v6.0 (최신) ✅ 완성**
- ✅ 드래그 선택 박스 시스템 완성
  - 마우스 드래그로 영역 선택
  - 파란색 반투명 박스 시각화
  - AABB 충돌 감지 알고리즘
  - Ctrl+드래그로 추가 선택
  - 스크롤 위치 고려한 정확한 좌표
- ✅ 텍스트 선택 방지 기능
  - 드래그 시 텍스트가 선택되지 않음
  - CSS + JavaScript 조합 방식
  - 모든 브라우저 호환
- ✅ BlockRenderer에 data-block-id 속성 추가
  - 드래그 선택 박스가 블록을 정확히 감지
  - 충돌 감지 알고리즘 정상 작동
- ✅ CSS 경고 해결 가이드
  - Tailwind CSS 경고 제거 방법
  - VS Code 설정 최적화
- ✅ 히스토리에 자동 기록 (Undo/Redo)

**v5.0**
- ✅ 다중 블록 선택 시스템 100% 완성
  - Ctrl+클릭으로 블록 추가/제거
  - Shift+클릭으로 범위 선택
  - Ctrl+A로 전체 선택
  - Delete 키로 일괄 삭제
  - 다중 복사/붙여넣기/잘라내기
  - 체크박스 시각화
  - 선택 개수 배지 표시
  - 다중 선택 패널

**v4.1**
- ✅ 박스 스타일 실제 적용 완료

**v4.0**
- ✅ Figma 스타일 요소별 선택 시스템
- ✅ 5가지 요소별 폼 추가
- ✅ 동적 폼 렌더링 시스템

**v3.0**
- ✅ 실행 취소/다시 실행 기능
- ✅ 히스토리 스택 (최대 50개)
- ✅ 키보드 단축키 (Ctrl+Z, Ctrl+Shift+Z)

### 키보드 단축키 치트시트

```
선택 작업:
Ctrl+A / Cmd+A        → 전체 선택
Escape                → 선택 해제
Ctrl+클릭              → 블록 추가/제거
Shift+클릭             → 범위 선택
드래그                → 영역 선택 ✅ v6.0
Ctrl+드래그            → 영역 추가 선택 ✅ v6.0

편집 작업:
Ctrl+C / Cmd+C        → 블록 복사 (단일/다중)
Ctrl+V / Cmd+V        → 블록 붙여넣기
Ctrl+X / Cmd+X        → 블록 잘라내기 (단일/다중)
Delete / Backspace    → 선택된 블록 삭제

히스토리:
Ctrl+Z / Cmd+Z              → 실행 취소
Ctrl+Shift+Z / Cmd+Shift+Z  → 다시 실행
Ctrl+Y / Cmd+Y              → 다시 실행 (대체)

참고:
- Input/Textarea 편집 중에는 단축키 비활성화
- 미리보기 모드에서는 단축키 비활성화
```

### 드래그 선택 박스 빠른 가이드 ✅ v6.0

```
기본 사용:
1. 빈 공간에서 마우스 드래그
   → 파란색 선택 박스 표시
   → 박스 내 블록 자동 선택

Ctrl+드래그:
1. Ctrl 키를 누른 채로 드래그
   → 기존 선택 유지
   → 박스 내 블록 추가 선택

시각적 피드백:
✅ 파란색 반투명 박스
✅ 십자(crosshair) 커서
✅ 실시간 블록 하이라이트
✅ 텍스트 선택 안 됨

주의사항:
- 빈 공간에서만 시작 가능
- 블록이나 드롭존 위에서는 시작 안 됨
- 미리보기 모드에서는 비활성화
```

**Happy Coding! 🚀**

---

*이 문서는 지속적으로 업데이트됩니다.*  
*최종 업데이트: 2025년 11월 22일 (v6.0 - 드래그 선택 박스 시스템 완성)*