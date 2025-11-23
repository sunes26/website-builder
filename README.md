# Figma 스타일 웹사이트 빌더

**React + TypeScript 기반의 노코드 웹사이트 제작 플랫폼**

현재 상태: Phase 0 (준비 단계) 🚧  
작성일: 2025년 11월 23일  
**목표: 손쉬운 웹사이트 제작 + Figma 스타일 편집** 🌐

---

## 📋 목차

1. [프로젝트 소개](#프로젝트-소개)
2. [현재 상태](#현재-상태)
3. [빠른 시작](#빠른-시작)
4. [삭제할 파일](#삭제할-파일)
5. [프로젝트 구조](#프로젝트-구조)
6. [개발 로드맵](#개발-로드맵)
7. [Phase별 개발 가이드](#phase별-개발-가이드)
8. [기술 스택](#기술-스택)
9. [문제 해결](#문제-해결)

---

## 프로젝트 소개

### 🎨 무엇을 만드나요?

**Figma처럼 직관적하고 강력한 웹사이트 제작 도구**입니다. 

코딩 지식 없이도 누구나 도형, 선, 텍스트, 이미지를 자유롭게 배치하여 전문적인 웹사이트를 디자인하고 배포할 수 있습니다.

### 🌐 웹사이트 제작에 특화

단순한 디자인 툴이 아닌, **실제로 작동하는 웹사이트를 만드는 플랫폼**입니다:

```
🎨 디자인
└── Figma 스타일로 자유롭게 디자인

📱 반응형
└── 데스크톱, 태블릿, 모바일 자동 대응

🔗 인터랙션
└── 버튼 클릭, 페이지 이동, 폼 제출

🚀 배포
└── 원클릭 배포 및 도메인 연결

📊 분석
└── 방문자 통계 및 SEO 최적화
```

### 💡 핵심 개념

```
❌ 기존 블록 방식
└── 미리 만들어진 템플릿 블록
└── 세로로만 배치
└── 제한된 커스터마이징

✅ Figma 스타일 + 웹사이트 제작
└── 도형, 선, 텍스트, 이미지 자유 배치
└── 템플릿 + 커스텀 디자인 선택 가능
└── 실제 작동하는 웹사이트 생성
└── 페이지 간 연결 및 네비게이션
└── 반응형 자동 조정
└── 원클릭 배포
```

### 🎯 주요 기능 (개발 예정)

#### 📐 디자인 도구 (Phase 1-5)
- 🔲 도형: 사각형, 원, 삼각형
- ➖ 선: 직선, 화살표
- 📝 텍스트: 자유 텍스트 추가 및 편집
- 🖼️ 이미지: 드래그 앤 드롭 업로드

#### ⚙️ 편집 기능 (Phase 6-8)
- 📍 절대 위치 배치 (X, Y 좌표)
- ⚙️ 실시간 속성 편집
- 📚 레이어 시스템 (zIndex)
- ✨ 선택, 이동, 크기 조절, 회전
- 📐 정렬 도구
- 📦 그룹화
- ⌨️ 키보드 단축키
- ↩️ Undo/Redo

#### 🌐 웹사이트 기능 (Phase 9-12)
- 📄 **다중 페이지 관리**
  - 페이지 추가/삭제/복제
  - 마인드맵으로 페이지 구조 시각화
  - 페이지 간 네비게이션 자동 생성

- 🔗 **인터랙션 시스템**
  - 버튼 클릭 → 페이지 이동
  - 버튼 클릭 → 외부 링크
  - 버튼 클릭 → 스크롤 이동
  - 호버 효과, 클릭 애니메이션

- 📱 **반응형 디자인**
  - 데스크톱/태블릿/모바일 자동 조정
  - 브레이크포인트 설정
  - 디바이스별 숨김/표시
  - 유동적 레이아웃

- 📝 **컨텐츠 관리**
  - 텍스트 편집 (리치 에디터)
  - 이미지 갤러리
  - 비디오 삽입 (YouTube, Vimeo)
  - 폼 빌더 (문의, 뉴스레터, 설문)

#### 🚀 배포 및 관리 (Phase 13-15)
- 🌍 **배포 시스템**
  - 원클릭 배포
  - 커스텀 도메인 연결
  - HTTPS 자동 설정
  - CDN 최적화

- 📊 **SEO 및 분석**
  - 메타 태그 설정
  - Open Graph 이미지
  - Google Analytics 연동
  - 사이트맵 자동 생성

- 🎨 **템플릿 시스템**
  - 프리셋 템플릿 (포트폴리오, 랜딩페이지, 블로그)
  - 커스텀 템플릿 저장
  - 템플릿 마켓플레이스

#### 🔧 고급 기능 (장기)
- 💾 **버전 관리**: Git 스타일 버전 히스토리
- 👥 **협업**: 실시간 공동 편집
- 🔌 **플러그인**: 써드파티 통합 (Google Maps, 결제 등)
- 🤖 **AI 도우미**: 디자인 제안, 콘텐츠 생성

---

## 현재 상태

### ✅ 완료된 작업

- [x] 기존 블록 시스템 분석
- [x] Figma 스타일 전환 계획 수립
- [x] Phase 1-8 개발 로드맵 작성
- [x] 완전히 새로 시작하기로 결정

### 🚧 진행 중

**Phase 0: 프로젝트 초기화**
- [ ] 기존 src/ 디렉토리 완전 삭제
- [ ] 빈 프로젝트 상태에서 시작
- [ ] 기본 React + Vite 구조만 유지

### 📋 다음 단계

**Phase 1: 기본 구조 (1일)**
- [ ] types/index.ts 신규 생성
- [ ] builderStore.ts 신규 생성
- [ ] Layout.tsx 신규 생성
- [ ] Toolbar.tsx 신규 생성
- [ ] 모든 컴포넌트 처음부터 제작

---

## 빠른 시작

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 타입 체크
npx tsc --noEmit

# 빌드 테스트
npm run build
```

### 오류 확인

```bash
# 모든 타입 오류 확인 (추천)
npx tsc --noEmit

# 개발 서버 (실시간 확인)
npm run dev
```

---

## 프로젝트 초기화

### 🗑️ 완전히 처음부터 시작

기존 블록 기반 시스템을 완전히 제거하고 빈 프로젝트에서 시작합니다.

#### 초기화 방법

**방법 1: src/ 전체 삭제 후 재생성 (추천)**
```bash
# 1. 기존 src/ 디렉토리 삭제
rm -rf src/

# 2. 빈 src/ 디렉토리 생성
mkdir src

# 3. 기본 진입점만 생성
touch src/main.tsx
touch src/App.tsx
touch src/index.css
```

**방법 2: Git으로 완전 초기화**
```bash
# 1. src/ 디렉토리 Git에서 제거
git rm -rf src/

# 2. 커밋
git commit -m "Reset project: Remove all existing code for Figma-style rebuild"

# 3. 빈 디렉토리 생성
mkdir -p src/components src/hooks src/store src/types src/utils
```

#### 초기화 후 최소 파일

```
src/
├── main.tsx           # React 진입점 (Phase 1에서 생성)
├── App.tsx            # 앱 루트 (Phase 1에서 생성)
└── index.css          # 전역 스타일 (Phase 1에서 생성)
```

**모든 컴포넌트, 훅, 스토어, 타입은 Phase 1부터 새로 만듭니다.**

---

## 프로젝트 구조

### 현재 구조 (Phase 0 - 빈 프로젝트)

```
프로젝트/
├── package.json           ✅ 유지
├── tsconfig.json          ✅ 유지
├── vite.config.ts         ✅ 유지
├── tailwind.config.js     ✅ 유지
├── index.html             ✅ 유지
│
└── src/                   🆕 완전히 비어있음
    └── (Phase 1에서 모든 파일 생성)
```

**중요: src/ 디렉토리 내부는 완전히 비어있습니다.**  
**Phase 1부터 모든 파일을 새로 만듭니다.**

### 목표 구조 (Phase 8 완료 시)

```
src/
├── components/
│   ├── Canvas/                 🆕 Phase 2
│   │   ├── index.tsx
│   │   ├── ShapeRenderer.tsx
│   │   ├── LineRenderer.tsx
│   │   ├── FreeTextRenderer.tsx
│   │   ├── FreeImageRenderer.tsx
│   │   ├── SelectionBox.tsx
│   │   └── TextEditor.tsx
│   │
│   ├── LayerPanel/             🆕 Phase 6
│   │   ├── index.tsx
│   │   ├── LayerItem.tsx
│   │   └── LayerControls.tsx
│   │
│   ├── PropertiesPanel/
│   │   ├── index.tsx           ✅ 수정됨
│   │   ├── FormGroup.tsx       ✅ 유지
│   │   ├── ShapePropertiesForm.tsx    🆕 Phase 7
│   │   ├── LinePropertiesForm.tsx     🆕 Phase 7
│   │   ├── TextPropertiesForm.tsx     🆕 Phase 7
│   │   └── ImagePropertiesForm.tsx    🆕 Phase 7
│   │
│   ├── AlignmentTools/         🆕 Phase 8
│   │   └── index.tsx
│   │
│   └── GroupPanel/             🆕 Phase 8
│       └── index.tsx
│
├── hooks/                      🆕 Phase 2-8
│   ├── useShapeDrawing.ts
│   ├── useLineDrawing.ts
│   ├── useTextEditing.ts
│   ├── useDragElement.ts
│   ├── useResizeElement.ts
│   ├── useCanvasTool.ts
│   ├── useAlignment.ts
│   └── useKeyboardShortcuts.ts
│
├── store/
│   └── builderStore.ts         🔄 Phase 1 재작성
│
├── types/
│   └── index.ts                🔄 Phase 1 재작성
│
└── utils/
    ├── imageUtils.ts           ✅ 유지
    ├── shapeUtils.ts           🆕 Phase 2
    ├── lineUtils.ts            🆕 Phase 3
    ├── geometryUtils.ts        🆕 Phase 8
    └── positionUtils.ts        🆕 Phase 8
```

---

## 개발 로드맵

### 📊 전체 일정

#### 🎨 Core 디자인 툴 (Phase 1-8)

| Phase | 기능 | 기간 | 우선순위 | 상태 |
|-------|------|------|----------|------|
| **Phase 0** | 준비 작업 | 1일 | 🔴 필수 | 🚧 진행중 |
| **Phase 1** | 기본 구조 및 타입 | 1일 | 🔴 필수 | 📋 대기 |
| **Phase 2** | 도형 그리기 | 2일 | 🔴 필수 | 📋 대기 |
| **Phase 3** | 선 그리기 | 1일 | 🔴 필수 | 📋 대기 |
| **Phase 4** | 자유 텍스트 | 2일 | 🔴 필수 | 📋 대기 |
| **Phase 5** | 이미지 추가 | 1일 | 🔴 필수 | 📋 대기 |
| **Phase 6** | 레이어 시스템 | 2일 | 🟡 권장 | 📋 대기 |
| **Phase 7** | 속성 편집 | 2일 | 🔴 필수 | 📋 대기 |
| **Phase 8** | 고급 기능 | 3일 | 🟢 선택 | 📋 대기 |

**소계: 약 15일**

#### 🌐 웹사이트 제작 기능 (Phase 9-15)

| Phase | 기능 | 기간 | 우선순위 | 상태 |
|-------|------|------|----------|------|
| **Phase 9** | 다중 페이지 관리 | 2일 | 🔴 필수 | 📋 대기 |
| **Phase 10** | 인터랙션 시스템 | 3일 | 🔴 필수 | 📋 대기 |
| **Phase 11** | 반응형 디자인 | 3일 | 🔴 필수 | 📋 대기 |
| **Phase 12** | 컨텐츠 관리 | 2일 | 🟡 권장 | 📋 대기 |
| **Phase 13** | 배포 시스템 | 3일 | 🔴 필수 | 📋 대기 |
| **Phase 14** | SEO 및 분석 | 2일 | 🟡 권장 | 📋 대기 |
| **Phase 15** | 템플릿 시스템 | 2일 | 🟢 선택 | 📋 대기 |

**소계: 약 17일**

**총 개발 기간: 약 32일 (약 6-7주)**

### 🎯 마일스톤

#### MVP v1.0 (기본 디자인 툴)
```
Phase 0 → 1 → 2 → 4 → 7
= 준비 + 기본 구조 + 도형 + 텍스트 + 속성 편집
= 약 8일
```
**기능**: 기본 도형과 텍스트로 디자인 가능

#### MVP v2.0 (완전한 디자인 툴)
```
Phase 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8
= 모든 디자인 기능
= 약 15일
```
**기능**: Figma 스타일 완전 구현

#### MVP v3.0 (웹사이트 제작 기능)
```
Phase 0~8 + Phase 9 → 10 → 11 → 13
= 디자인 + 페이지 관리 + 인터랙션 + 반응형 + 배포
= 약 26일
```
**기능**: 실제 웹사이트 제작 및 배포 가능 ⭐

#### 완전한 제품 v4.0
```
Phase 0~15 전체
= 모든 기능
= 약 32일
```
**기능**: 템플릿, SEO, 분석 등 모든 기능 포함

---

## Phase별 개발 가이드

### Phase 0: 프로젝트 초기화 (현재) 🚧

**목표**: 기존 코드 완전 제거 및 빈 프로젝트 준비

**체크리스트**
- [ ] src/ 디렉토리 완전 삭제
- [ ] 빈 src/ 디렉토리 생성
- [ ] package.json, tsconfig.json 등 설정 파일만 유지
- [ ] `npm install` 정상 실행
- [ ] Phase 1 시작 준비 완료

**완료 조건**
```bash
# src/ 디렉토리가 비어있거나 최소 파일만 있어야 함
ls src/
# 출력: (비어있음) 또는 main.tsx, App.tsx, index.css만 존재
```

---

### Phase 1: 기본 구조 및 타입 시스템 (1일)

**목표**: Figma 스타일 타입 정의 및 상태 관리

**작업 파일**
```
신규 생성:
1. src/main.tsx                  (React 진입점)
2. src/App.tsx                   (앱 루트)
3. src/index.css                 (전역 스타일)
4. src/types/index.ts            (모든 타입 정의)
5. src/store/builderStore.ts     (Zustand 스토어)
6. src/components/Layout.tsx     (레이아웃)
7. src/components/Toolbar.tsx    (도구바)
8. src/components/Sidebar.tsx    (사이드바 - 빈 상태)
9. src/components/Canvas.tsx     (캔버스 - 빈 상태)
10. src/components/PropertiesPanel.tsx  (속성 패널 - 빈 상태)
```

**GPT 프롬프트**
```
Phase 1을 개발해주세요.

배경:
- 완전히 빈 프로젝트에서 시작합니다.
- Figma 스타일 디자인 툴의 기본 구조를 만듭니다.
- 사용자가 도형, 선, 텍스트, 이미지를 자유롭게 배치할 수 있는 기반을 구축합니다.

요구사항:

1. main.tsx
   - React 18 진입점
   - App 컴포넌트 렌더링
   - StrictMode 사용

2. App.tsx
   - Layout 컴포넌트로 구성
   - 간단한 라우팅 (단일 페이지)

3. index.css
   - Tailwind CSS 기본 설정
   - @tailwind base, components, utilities
   - 전역 스타일 (폰트, 기본 색상 등)

4. types/index.ts
   - CanvasElement 타입 정의
     * Shape: 사각형, 원, 삼각형
     * Line: 직선, 화살표
     * FreeText: 자유 텍스트
     * FreeImage: 자유 이미지
   - 공통 속성: id, position(x,y), size(width,height), rotation, zIndex
   - ToolMode: select, rectangle, circle, triangle, line, arrow, text, image
   - Page, Project 타입

5. store/builderStore.ts
   - Zustand 스토어 생성
   - 상태:
     * elements: CanvasElement[]
     * selectedElementIds: string[]
     * currentTool: ToolMode
     * isDrawing: boolean
     * currentPage: Page
     * pages: Page[]
   - 액션:
     * addElement(element: CanvasElement)
     * updateElement(id: string, updates: Partial<CanvasElement>)
     * deleteElements(ids: string[])
     * selectElements(ids: string[], mode: 'replace' | 'add')
     * setCurrentTool(tool: ToolMode)
     * addPage(), deletePage(), setCurrentPage()

6. components/Layout.tsx
   - 3단 레이아웃: Toolbar(좌) | Canvas(중) | Sidebar(우)
   - Tailwind CSS 사용
   - 반응형 (데스크톱 우선)

7. components/Toolbar.tsx
   - 세로 도구바 (좌측)
   - 도구 버튼:
     * 선택 도구 (V)
     * 사각형 (R)
     * 원 (O)
     * 삼각형
     * 직선 (L)
     * 화살표
     * 텍스트 (T)
     * 이미지
   - 클릭 시 currentTool 상태 변경
   - 현재 활성 도구 하이라이트

8. components/Sidebar.tsx
   - 우측 사이드바
   - 빈 상태 (Phase 7에서 속성 패널 추가)
   - "요소를 선택하세요" 메시지

9. components/Canvas.tsx
   - 중앙 캔버스
   - 빈 SVG (1920x1080)
   - Phase 2에서 도형 그리기 기능 추가 예정
   - 현재는 "도구를 선택하세요" 안내 메시지

10. components/PropertiesPanel.tsx
    - Sidebar 내부에 들어갈 속성 패널
    - 빈 상태
    - Phase 7에서 구현

기술 스택: 
- React 18, TypeScript
- Zustand (상태 관리)
- Tailwind CSS (스타일링)
- Lucide React (아이콘)

주의사항:
- 모든 파일을 처음부터 새로 작성합니다.
- TypeScript 타입을 엄격하게 지킵니다.
- 각 컴포넌트는 독립적으로 작동해야 합니다.
- 현재는 UI 구조만 만들고, 실제 기능은 Phase 2부터 추가합니다.

위 요구사항에 맞춰 10개 파일의 전체 코드를 작성해주세요.
```

---

### Phase 2: 도형 그리기 시스템 (2일)

**목표**: 사각형, 원, 삼각형 그리기 및 선택

**작업 파일**
```
신규 생성:
1. src/components/Canvas/index.tsx           (기존 Canvas.tsx를 폴더로 분리)
2. src/components/Canvas/ShapeRenderer.tsx   (도형 렌더러)
3. src/components/Canvas/SelectionBox.tsx    (선택 박스)
4. src/hooks/useShapeDrawing.ts              (도형 그리기 훅)
5. src/hooks/useDragElement.ts               (드래그 이동 훅)
6. src/utils/shapeUtils.ts                   (도형 유틸리티)
```

**주의**: Phase 1에서 만든 `components/Canvas.tsx`를 `Canvas/index.tsx`로 리팩토링합니다.

**GPT 프롬프트**
```
Phase 2를 개발해주세요.

배경:
- Phase 1에서 구축한 기본 구조 위에 도형 그리기 기능을 추가합니다.
- 사용자가 마우스 드래그로 도형을 그릴 수 있어야 합니다.

요구사항:

1. components/Canvas/index.tsx
   - Phase 1의 Canvas.tsx를 Canvas/index.tsx로 이동 및 확장
   - SVG 캔버스 (1920x1080)
   - 현재 도구(currentTool)에 따른 마우스 이벤트 처리
   - 도형 그리기 모드: useShapeDrawing 훅 사용
   - 선택 모드: 요소 클릭/드래그
   - 모든 요소 zIndex 순서로 렌더링

2. components/Canvas/ShapeRenderer.tsx
   - SVG로 도형 렌더링
     * 사각형: <rect>
     * 원: <circle>
     * 삼각형: <polygon>
   - Props: shape (Shape 타입), isSelected (boolean)
   - 클릭 시 선택 상태 변경

3. components/Canvas/SelectionBox.tsx
   - 선택된 요소 주변 표시
   - 파란색 테두리 (2px solid #3b82f6)
   - 8개 리사이즈 핸들 (모서리 4개 + 변 중앙 4개)
   - 회전 핸들 (상단 중앙)
   - Props: element, onResize, onRotate

4. hooks/useShapeDrawing.ts
   - 도형 그리기 로직
   - 마우스 다운: 시작점 저장 (startX, startY)
   - 마우스 무브: 실시간 크기 계산 (width, height)
   - 마우스 업: 도형 완성 및 store.addElement() 호출
   - 반환: { isDrawing, previewShape, handleMouseDown, handleMouseMove, handleMouseUp }

5. hooks/useDragElement.ts
   - 요소 드래그 이동 로직
   - 드래그 시작: offset 계산
   - 드래그 중: 새 위치 계산
   - 드래그 종료: store.updateElement() 호출
   - 반환: { isDragging, handleDragStart, handleDrag, handleDragEnd }

6. utils/shapeUtils.ts
   - 도형 관련 유틸리티 함수
   - createShape(type, position, size): 기본 도형 생성
   - isPointInShape(point, shape): 충돌 감지
   - getShapeBounds(shape): 바운딩 박스 계산

작동 방식:
```
1. 도구바에서 "사각형" 클릭
   → currentTool = 'rectangle'

2. 캔버스에서 마우스 다운
   → 시작점 저장 (startX, startY)
   → isDrawing = true

3. 마우스 이동
   → 실시간 크기 계산 (width, height)
   → 반투명 미리보기 도형 표시

4. 마우스 업
   → 도형 완성
   → store.addElement(newShape)
   → isDrawing = false
   → currentTool = 'select' (자동 전환)
```

기술 요구사항:
- SVG 기반 렌더링
- 마우스 좌표를 SVG 좌표로 변환 (getBoundingClientRect)
- Shift 키: 정사각형/정원 그리기
- Alt 키: 중심에서 그리기

위 요구사항에 맞춰 6개 파일의 전체 코드를 작성해주세요.
```

---

### Phase 3: 선 그리기 시스템 (1일)

**목표**: 직선, 화살표 그리기

**작업 파일**
```
신규 생성:
1. src/components/Canvas/LineRenderer.tsx    (선 렌더러)
2. src/hooks/useLineDrawing.ts               (선 그리기 훅)
3. src/utils/lineUtils.ts                    (선 유틸리티)

수정:
4. src/components/Canvas/index.tsx           (선 그리기 모드 추가)
```

**GPT 프롬프트**
```
Phase 3을 개발해주세요.

배경:
- Phase 2의 도형 그리기 위에 선 그리기 기능을 추가합니다.

요구사항:

1. components/Canvas/LineRenderer.tsx
   - SVG line/polyline 렌더링
   - 화살표 마커 (<marker>)
   - 점선 스타일 (strokeDasharray)

2. hooks/useLineDrawing.ts
   - 클릭: 시작점 추가
   - 이동: 마우스 따라가는 미리보기
   - 클릭: 끝점 확정
   - ESC: 그리기 취소

3. Canvas/index.tsx 수정
   - 선 그리기 모드 추가
   - Shift: 45도 스냅

위 요구사항에 맞춰 3개 파일의 전체 코드를 작성해주세요.
```

---

### Phase 4: 자유 텍스트 시스템 (2일)

**목표**: 텍스트 추가 및 인라인 편집

**작업 파일**
```
신규 생성:
1. src/components/Canvas/FreeTextRenderer.tsx  (텍스트 렌더러)
2. src/components/Canvas/TextEditor.tsx        (텍스트 에디터)
3. src/hooks/useTextEditing.ts                 (텍스트 편집 훅)

수정:
4. src/components/Canvas/index.tsx             (텍스트 모드 추가)
```

**GPT 프롬프트**
```
Phase 4를 개발해주세요.

배경:
- Figma처럼 클릭하여 텍스트를 추가하고 바로 편집할 수 있어야 합니다.

요구사항:

1. components/Canvas/FreeTextRenderer.tsx
   - foreignObject 내부에 div
   - 폰트, 크기, 색상, 정렬 적용
   - 더블클릭: 편집 모드

2. components/Canvas/TextEditor.tsx
   - contentEditable div
   - Enter: 줄바꿈
   - Escape: 편집 종료
   - 포커스 아웃: 편집 종료

3. hooks/useTextEditing.ts
   - 편집 시작/종료 로직
   - 실시간 업데이트

4. Canvas/index.tsx 수정
   - 텍스트 모드 추가
   - 클릭 시 새 텍스트 생성 + 자동 편집 시작

기술:
- contentEditable 사용
- 자동 크기 조절 (최소 50px, 최대 500px)

위 요구사항에 맞춰 4개 파일의 전체 코드를 작성해주세요.
```

---

### Phase 5: 이미지 추가 시스템 (1일)

**목표**: 이미지 업로드 및 배치

**작업 파일**
```
신규 생성:
1. src/components/Canvas/FreeImageRenderer.tsx  (이미지 렌더러)
2. src/components/ImageUploader.tsx             (이미지 업로더)
3. src/utils/imageUtils.ts                      (이미지 유틸리티)

수정:
4. src/components/Canvas/index.tsx              (이미지 모드 추가)
```

**GPT 프롬프트**
```
Phase 5를 개발해주세요.

배경:
- 사용자가 이미지를 업로드하고 캔버스에 자유롭게 배치할 수 있어야 합니다.

요구사항:

1. components/Canvas/FreeImageRenderer.tsx
   - SVG image 또는 foreignObject 내 img
   - 크기 조절 가능
   - 필터 효과 (밝기, 대비, 흐림)

2. Canvas/index.tsx 수정
   - 이미지 모드: 클릭 → 업로드 다이얼로그
   - 업로드 후 캔버스 중앙 배치
   - 자동 선택 상태

3. ImageUploader 활용
   - 드래그 앤 드롭
   - Base64 변환
   - 자동 리사이즈

기술:
- Shift: 비율 유지 리사이즈
- 최대 4MB

위 요구사항에 맞춰 3개 파일의 전체 코드를 작성해주세요.
```

---

### Phase 6: 레이어 시스템 (2일)

**목표**: 레이어 목록 표시 및 순서 변경

**작업 파일**
```
신규:
1. src/components/LayerPanel/index.tsx
2. src/components/LayerPanel/LayerItem.tsx
3. src/components/LayerPanel/LayerControls.tsx

수정:
4. src/components/Layout.tsx
5. src/store/builderStore.ts
```

**GPT 프롬프트**
```
Phase 6을 개발해주세요.

배경:
- Figma처럼 모든 요소를 레이어 패널에 표시하고 관리할 수 있어야 합니다.

요구사항:

1. components/LayerPanel/index.tsx
   - elements를 zIndex 순서대로 표시
   - @dnd-kit/sortable로 드래그 정렬

2. components/LayerPanel/LayerItem.tsx
   - 요소 타입별 아이콘
   - 표시/숨김 토글 (눈 아이콘)
   - 잠금 토글 (자물쇠)
   - 이름 편집 (더블클릭)

3. components/LayerPanel/LayerControls.tsx
   - 맨 앞으로 / 한 칸 앞으로
   - 한 칸 뒤로 / 맨 뒤로

4. Layout.tsx 수정
   - 우측 상단: 레이어 패널
   - 우측 하단: 속성 패널

5. builderStore.ts 수정
   - reorderElements, bringToFront, sendToBack
   - toggleVisibility, toggleLock

기술:
- @dnd-kit/sortable
- 잠긴 요소: 선택/편집 불가
- 숨김 요소: 캔버스에 미표시

위 요구사항에 맞춰 5개 파일의 전체 코드를 작성해주세요.
```

---

### Phase 7: 속성 편집 패널 (2일)

**목표**: 요소별 속성 폼 및 실시간 업데이트

**작업 파일**
```
신규:
1. src/components/PropertiesPanel/ShapePropertiesForm.tsx
2. src/components/PropertiesPanel/LinePropertiesForm.tsx
3. src/components/PropertiesPanel/TextPropertiesForm.tsx
4. src/components/PropertiesPanel/ImagePropertiesForm.tsx

수정:
5. src/components/PropertiesPanel/index.tsx
```

**GPT 프롬프트**
```
Phase 7을 개발해주세요.

배경:
- 선택된 요소의 모든 속성을 편집할 수 있는 패널을 만듭니다.

요구사항:

1. PropertiesPanel/ShapePropertiesForm.tsx
   - 크기 (width, height)
   - 위치 (x, y)
   - 스타일 (배경색, 테두리색, 두께, 모서리, 투명도)
   - 회전 (rotation)

2. PropertiesPanel/LinePropertiesForm.tsx
   - 시작점/끝점 좌표
   - 색상, 두께
   - 선 스타일 (실선, 점선, 파선)
   - 화살표 (시작, 끝)

3. PropertiesPanel/TextPropertiesForm.tsx
   - 폰트 패밀리, 크기, 굵기
   - 색상, 정렬
   - 줄 간격, 자간

4. PropertiesPanel/ImagePropertiesForm.tsx
   - 크기 (비율 고정 체크박스)
   - 위치, 회전
   - 필터 (밝기, 대비, 흐림, 채도)
   - 투명도

5. PropertiesPanel/index.tsx 수정
   - 동적 폼 렌더링
   - 선택 없음: 안내 메시지
   - 단일 선택: 해당 요소 폼
   - 다중 선택: 공통 속성

기술:
- React Hook Form
- 실시간 업데이트 (onChange)
- 색상 피커: input[type="color"]
- 슬라이더: input[type="range"]

위 요구사항에 맞춰 5개 파일의 전체 코드를 작성해주세요.
```

---

### Phase 8: 고급 기능 (3일)

**목표**: 정렬, 그룹화, 키보드 단축키

**작업 파일**
```
신규:
1. src/components/AlignmentTools/index.tsx
2. src/components/GroupPanel/index.tsx
3. src/hooks/useAlignment.ts
4. src/hooks/useKeyboardShortcuts.ts

수정:
5. src/components/Toolbar.tsx
6. src/store/builderStore.ts
```

**GPT 프롬프트**
```
Phase 8을 개발해주세요.

배경:
- 생산성을 높이는 정렬, 그룹화, 단축키 기능을 추가합니다.

요구사항:

1. components/AlignmentTools/index.tsx
   - 버튼: 좌/중/우, 상/중/하
   - 수평/수직 균등 분배

2. hooks/useAlignment.ts
   - alignLeft, alignCenter, alignRight
   - alignTop, alignMiddle, alignBottom
   - distributeHorizontal, distributeVertical

3. components/GroupPanel/index.tsx
   - 그룹 생성 (Ctrl+G)
   - 그룹 해제 (Ctrl+Shift+G)

4. hooks/useKeyboardShortcuts.ts
   - Ctrl+C/V/X/D: 복사/붙여넣기/잘라내기/복제
   - Delete: 삭제
   - Ctrl+Z/Shift+Z: Undo/Redo
   - Ctrl+A: 전체 선택
   - Ctrl+G: 그룹
   - Arrow Keys: 1px 이동
   - Shift+Arrow: 10px 이동

5. Toolbar.tsx 수정
   - 정렬 버튼 추가
   - 선택된 요소 2개 이상일 때만 활성화

6. builderStore.ts 수정
   - Group 타입 추가
   - createGroup, ungroupGroup
   - updateGroupPosition

기술:
- 정렬: 바운딩 박스 기준
- 그룹: 중첩 가능
- 단축키: input/textarea 포커스 시 비활성화

위 요구사항에 맞춰 6개 파일의 전체 코드를 작성해주세요.
```

---

## 🌐 웹사이트 제작 Phase (9-15)

### Phase 9: 다중 페이지 관리 (2일)

**목표**: 여러 페이지 생성 및 관리

**작업 파일**
```
신규 생성:
1. src/components/PageManager/index.tsx          (페이지 관리 패널)
2. src/components/PageManager/PageList.tsx       (페이지 목록)
3. src/components/PageManager/PageSettings.tsx   (페이지 설정)
4. src/components/MindMap/index.tsx              (페이지 구조 시각화)
5. src/hooks/usePageNavigation.ts                (페이지 네비게이션)

수정:
6. src/store/builderStore.ts                     (페이지 관련 액션 추가)
7. src/types/index.ts                            (Page 타입 확장)
```

**GPT 프롬프트**
```
Phase 9를 개발해주세요.

배경:
- 단일 페이지를 넘어 다중 페이지 웹사이트를 만들 수 있어야 합니다.
- 페이지 간 연결을 마인드맵으로 시각화합니다.

요구사항:

1. components/PageManager/index.tsx
   - 페이지 추가/삭제/복제 버튼
   - 페이지 목록 표시
   - 현재 페이지 강조

2. components/PageManager/PageList.tsx
   - 드래그로 페이지 순서 변경
   - 페이지 썸네일 (미리보기)
   - 페이지 이름 편집 (더블클릭)

3. components/PageManager/PageSettings.tsx
   - 페이지 제목 (SEO)
   - 페이지 경로 (URL slug)
   - 메타 설명
   - Open Graph 이미지

4. components/MindMap/index.tsx
   - ReactFlow로 페이지 구조 시각화
   - 노드: 각 페이지
   - 엣지: 페이지 간 링크 (버튼 클릭 등)
   - 노드 더블클릭 → 해당 페이지로 이동

5. hooks/usePageNavigation.ts
   - navigateToPage(pageId)
   - getCurrentPage()
   - getPageBySlug(slug)

6. builderStore.ts 수정
   - pages: Page[]
   - currentPageId: string
   - addPage(page), deletePage(id), duplicatePage(id)
   - updatePageSettings(id, settings)

7. types/index.ts 수정
   - Page 타입 확장:
     * id, title, slug, elements[]
     * seoTitle, seoDescription
     * ogImage, createdAt, updatedAt

기술:
- ReactFlow (마인드맵)
- @dnd-kit/sortable (페이지 정렬)

위 요구사항에 맞춰 7개 파일의 전체 코드를 작성해주세요.
```

---

### Phase 10: 인터랙션 시스템 (3일)

**목표**: 버튼 클릭, 페이지 이동 등 인터랙션 구현

**작업 파일**
```
신규 생성:
1. src/components/Canvas/InteractiveButton.tsx   (클릭 가능한 버튼)
2. src/components/InteractionPanel/index.tsx     (인터랙션 설정 패널)
3. src/types/interaction.ts                      (인터랙션 타입)
4. src/hooks/useInteraction.ts                   (인터랙션 훅)
5. src/utils/interactionUtils.ts                 (인터랙션 유틸)

수정:
6. src/components/Canvas/index.tsx               (인터랙션 모드 추가)
7. src/store/builderStore.ts                     (인터랙션 액션)
```

**GPT 프롬프트**
```
Phase 10을 개발해주세요.

배경:
- 정적인 디자인을 넘어 클릭, 호버 등 인터랙션을 추가합니다.
- 버튼을 클릭하면 다른 페이지로 이동하거나 외부 링크를 엽니다.

요구사항:

1. components/Canvas/InteractiveButton.tsx
   - 클릭 가능한 버튼 렌더링
   - 호버 효과 (스타일 변경)
   - 클릭 시 액션 실행
   - Props: button, interaction

2. components/InteractionPanel/index.tsx
   - 인터랙션 타입 선택
     * 페이지 이동 (내부 페이지 선택)
     * 외부 링크 (URL 입력)
     * 스크롤 이동 (섹션 ID)
     * 팝업 열기
   - 호버 효과 설정 (색상, 크기 변경)
   - 클릭 애니메이션 설정

3. types/interaction.ts
   - Interaction 타입:
     * type: 'navigate' | 'external' | 'scroll' | 'popup'
     * target: pageId | url | sectionId
     * hoverEffect: { scale, color, shadow }
     * clickAnimation: { duration, easing }

4. hooks/useInteraction.ts
   - handleInteraction(interaction)
   - navigateToPage(pageId)
   - openExternalLink(url)
   - scrollToSection(sectionId)

5. utils/interactionUtils.ts
   - validateUrl(url): URL 검증
   - getSectionById(id): 섹션 찾기
   - applyHoverEffect(element, effect)

6. Canvas/index.tsx 수정
   - 버튼 클릭 이벤트 처리
   - 미리보기 모드에서만 인터랙션 실행

7. builderStore.ts 수정
   - interactions: Map<elementId, Interaction>
   - setInteraction(elementId, interaction)
   - removeInteraction(elementId)

위 요구사항에 맞춰 7개 파일의 전체 코드를 작성해주세요.
```

---

### Phase 11: 반응형 디자인 (3일)

**목표**: 데스크톱/태블릿/모바일 자동 대응

**작업 파일**
```
신규 생성:
1. src/components/ResponsivePanel/index.tsx      (반응형 설정 패널)
2. src/components/DevicePreview/index.tsx        (디바이스 미리보기)
3. src/hooks/useResponsive.ts                    (반응형 훅)
4. src/utils/responsiveUtils.ts                  (반응형 유틸)
5. src/types/responsive.ts                       (반응형 타입)

수정:
6. src/components/Canvas/index.tsx               (반응형 렌더링)
7. src/store/builderStore.ts                     (뷰포트 상태)
```

**GPT 프롬프트**
```
Phase 11을 개발해주세요.

배경:
- 다양한 디바이스에서 웹사이트가 올바르게 보여야 합니다.
- 디바이스별로 요소 크기, 위치, 표시 여부를 조정합니다.

요구사항:

1. components/ResponsivePanel/index.tsx
   - 브레이크포인트 설정 (desktop, tablet, mobile)
   - 디바이스별 표시/숨김
   - 디바이스별 크기 조정
   - 레이아웃 모드 (fixed, fluid, responsive)

2. components/DevicePreview/index.tsx
   - 디바이스 선택 버튼 (desktop, tablet, mobile)
   - 캔버스 크기 변경
   - 회전 (portrait, landscape)
   - 미리보기 프레임

3. hooks/useResponsive.ts
   - getCurrentBreakpoint()
   - getElementStyleForDevice(element, device)
   - shouldShowElement(element, device)

4. utils/responsiveUtils.ts
   - calculateResponsiveSize(size, device)
   - getBreakpointValue(device): 픽셀 값
   - convertToFluidSize(fixedSize): vh/vw 단위 변환

5. types/responsive.ts
   - Breakpoint: 'desktop' | 'tablet' | 'mobile'
   - ResponsiveStyle: {
       desktop: Style,
       tablet?: Style,
       mobile?: Style
     }
   - LayoutMode: 'fixed' | 'fluid' | 'responsive'

6. Canvas/index.tsx 수정
   - 현재 뷰포트에 맞는 스타일 적용
   - 미디어 쿼리 시뮬레이션

7. builderStore.ts 수정
   - currentViewport: Breakpoint
   - setViewport(viewport)
   - 요소에 responsiveStyle 추가

브레이크포인트:
- Desktop: 1920px
- Tablet: 768px
- Mobile: 375px

위 요구사항에 맞춰 7개 파일의 전체 코드를 작성해주세요.
```

---

### Phase 12: 컨텐츠 관리 (2일)

**목표**: 텍스트, 이미지, 비디오, 폼 등 다양한 컨텐츠 추가

**작업 파일**
```
신규 생성:
1. src/components/ContentManager/RichTextEditor.tsx  (리치 텍스트 에디터)
2. src/components/ContentManager/VideoEmbed.tsx      (비디오 삽입)
3. src/components/ContentManager/FormBuilder.tsx     (폼 빌더)
4. src/components/ContentManager/GalleryManager.tsx  (이미지 갤러리)

수정:
5. src/types/index.ts                                (컨텐츠 타입 추가)
```

**GPT 프롬프트**
```
Phase 12를 개발해주세요.

배경:
- 단순한 도형을 넘어 실제 웹사이트 컨텐츠를 추가합니다.
- 텍스트 서식, 비디오, 폼 등을 손쉽게 추가할 수 있어야 합니다.

요구사항:

1. components/ContentManager/RichTextEditor.tsx
   - 텍스트 서식 (굵게, 기울임, 밑줄)
   - 제목 스타일 (H1-H6)
   - 목록 (순서, 비순서)
   - 링크 삽입
   - 색상 변경
   - TipTap 또는 Slate.js 사용

2. components/ContentManager/VideoEmbed.tsx
   - YouTube URL 입력 → 자동 임베드
   - Vimeo 지원
   - 비디오 크기 조절
   - 자동 재생, 반복, 음소거 옵션

3. components/ContentManager/FormBuilder.tsx
   - 폼 필드 추가 (텍스트, 이메일, 전화번호, 메시지)
   - 제출 버튼 커스터마이징
   - 제출 시 동작 (이메일 전송, API 호출)
   - 유효성 검사 설정

4. components/ContentManager/GalleryManager.tsx
   - 여러 이미지 업로드
   - 갤러리 레이아웃 (그리드, 슬라이더, 메이슨리)
   - 라이트박스 (이미지 클릭 시 확대)

5. types/index.ts 수정
   - RichText, Video, Form, Gallery 타입 추가

기술:
- TipTap (리치 에디터)
- React Hook Form (폼)
- Swiper (슬라이더)

위 요구사항에 맞춰 5개 파일의 전체 코드를 작성해주세요.
```

---

### Phase 13: 배포 시스템 (3일)

**목표**: 웹사이트를 실제로 배포하고 도메인 연결

**작업 파일**
```
신규 생성:
1. src/components/DeployPanel/index.tsx          (배포 패널)
2. src/components/DeployPanel/DomainSettings.tsx (도메인 설정)
3. src/services/deployService.ts                (배포 서비스)
4. src/utils/buildUtils.ts                      (빌드 유틸)
5. src/hooks/useDeploy.ts                        (배포 훅)

수정:
6. src/store/builderStore.ts                     (배포 상태)
```

**GPT 프롬프트**
```
Phase 13을 개발해주세요.

배경:
- 디자인한 웹사이트를 실제로 배포합니다.
- 정적 사이트 생성 (SSG) 방식으로 빌드합니다.

요구사항:

1. components/DeployPanel/index.tsx
   - 배포 버튼 (원클릭 배포)
   - 배포 상태 표시 (빌드 중, 성공, 실패)
   - 배포된 사이트 URL
   - 배포 이력 (버전, 시간)

2. components/DeployPanel/DomainSettings.tsx
   - 커스텀 도메인 입력
   - DNS 설정 안내
   - HTTPS 자동 설정
   - 도메인 검증

3. services/deployService.ts
   - buildSite(): 정적 HTML 생성
   - deploySite(files): 파일 업로드
   - getDomainStatus(domain): 도메인 상태 확인
   - Vercel, Netlify, AWS S3 등과 연동

4. utils/buildUtils.ts
   - generateHTML(pages): React → HTML 변환
   - generateCSS(elements): 인라인 스타일 → CSS 파일
   - optimizeAssets(images): 이미지 최적화
   - generateSitemap(pages): 사이트맵 생성

5. hooks/useDeploy.ts
   - startDeploy()
   - checkDeployStatus()
   - cancelDeploy()

6. builderStore.ts 수정
   - deployStatus: 'idle' | 'building' | 'deploying' | 'success' | 'error'
   - deployUrl: string
   - customDomain: string

배포 흐름:
```
1. 배포 버튼 클릭
   → buildSite() 호출

2. 정적 파일 생성
   → HTML, CSS, JS, 이미지

3. CDN에 업로드
   → Vercel/Netlify API

4. 배포 완료
   → URL 반환
   → 사용자에게 표시
```

기술:
- Vercel/Netlify API
- AWS SDK (S3, CloudFront)

위 요구사항에 맞춰 6개 파일의 전체 코드를 작성해주세요.
```

---

### Phase 14: SEO 및 분석 (2일)

**목표**: 검색 엔진 최적화 및 방문자 분석

**작업 파일**
```
신규 생성:
1. src/components/SEOPanel/index.tsx             (SEO 설정 패널)
2. src/components/AnalyticsPanel/index.tsx       (분석 대시보드)
3. src/utils/seoUtils.ts                         (SEO 유틸)
4. src/services/analyticsService.ts              (분석 서비스)

수정:
5. src/types/index.ts                            (SEO 타입)
```

**GPT 프롬프트**
```
Phase 14를 개발해주세요.

배경:
- 검색 엔진에서 웹사이트를 찾을 수 있도록 최적화합니다.
- 방문자 통계를 수집하고 분석합니다.

요구사항:

1. components/SEOPanel/index.tsx
   - 페이지별 메타 태그 설정
     * title, description, keywords
   - Open Graph 설정
     * og:title, og:description, og:image
   - Twitter Card 설정
   - 사이트맵 생성
   - robots.txt 편집

2. components/AnalyticsPanel/index.tsx
   - 방문자 통계
     * 페이지뷰
     * 고유 방문자
     * 평균 체류 시간
   - 트래픽 소스
   - 인기 페이지
   - 그래프 (차트.js)

3. utils/seoUtils.ts
   - generateMetaTags(page): 메타 태그 생성
   - validateSEO(page): SEO 점수 계산
   - generateStructuredData(page): JSON-LD 생성
   - optimizeImages(images): alt 태그 자동 생성

4. services/analyticsService.ts
   - initGoogleAnalytics(trackingId)
   - trackPageView(page)
   - trackEvent(category, action, label)
   - getAnalyticsData(): API 호출

5. types/index.ts 수정
   - SEOSettings: {
       title: string,
       description: string,
       keywords: string[],
       ogImage: string,
       canonicalUrl: string
     }

연동:
- Google Analytics
- Google Search Console
- 자체 분석 (간단한 추적)

위 요구사항에 맞춰 5개 파일의 전체 코드를 작성해주세요.
```

---

### Phase 15: 템플릿 시스템 (2일)

**목표**: 프리셋 템플릿 제공 및 커스텀 템플릿 저장

**작업 파일**
```
신규 생성:
1. src/components/TemplateGallery/index.tsx      (템플릿 갤러리)
2. src/components/TemplateGallery/TemplateCard.tsx (템플릿 카드)
3. src/templates/presets.ts                      (프리셋 템플릿)
4. src/hooks/useTemplate.ts                      (템플릿 훅)

수정:
5. src/store/builderStore.ts                     (템플릿 액션)
```

**GPT 프롬프트**
```
Phase 15를 개발해주세요.

배경:
- 사용자가 빠르게 시작할 수 있도록 프리셋 템플릿을 제공합니다.
- 자신의 디자인을 템플릿으로 저장하여 재사용할 수 있습니다.

요구사항:

1. components/TemplateGallery/index.tsx
   - 템플릿 카테고리 (포트폴리오, 랜딩페이지, 블로그)
   - 템플릿 검색 및 필터
   - 템플릿 미리보기
   - "이 템플릿 사용" 버튼

2. components/TemplateGallery/TemplateCard.tsx
   - 템플릿 썸네일
   - 템플릿 이름 및 설명
   - 카테고리 태그
   - 사용 횟수

3. templates/presets.ts
   - 프리셋 템플릿 정의
   - 포트폴리오 템플릿
     * 헤더 + 히어로 + 프로젝트 갤러리 + 푸터
   - 랜딩페이지 템플릿
     * 헤더 + 히어로 + 기능 섹션 + CTA + 푸터
   - 블로그 템플릿
     * 헤더 + 포스트 목록 + 사이드바 + 푸터

4. hooks/useTemplate.ts
   - loadTemplate(templateId): 템플릿 불러오기
   - saveAsTemplate(name, pages): 현재 디자인을 템플릿으로 저장
   - deleteTemplate(templateId)
   - getMyTemplates(): 내가 만든 템플릿

5. builderStore.ts 수정
   - loadTemplate(template): 템플릿의 pages를 현재 프로젝트에 적용
   - saveAsTemplate(name): 현재 pages를 템플릿으로 저장

템플릿 구조:
```typescript
interface Template {
  id: string;
  name: string;
  description: string;
  category: 'portfolio' | 'landing' | 'blog';
  thumbnail: string;
  pages: Page[];
  createdAt: Date;
}
```

위 요구사항에 맞춰 5개 파일의 전체 코드를 작성해주세요.
```

---

## 기술 스택

### 핵심 기술

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

그래픽 및 디자인
├── SVG                  # 벡터 그래픽
├── Canvas API           # 이미지 처리
└── Framer Motion        # 애니메이션 (선택적)

드래그 앤 드롭
└── @dnd-kit/sortable    # 레이어 정렬

페이지 구조
└── ReactFlow            # 마인드맵 시각화
```

### 웹사이트 제작 기술

```
컨텐츠 관리
├── TipTap               # 리치 텍스트 에디터
├── Swiper               # 이미지 슬라이더
└── React Player         # 비디오 플레이어

반응형 & 디바이스
├── CSS Media Queries    # 반응형 디자인
└── React Responsive     # 디바이스 감지

배포 & 호스팅
├── Vercel API           # 배포 플랫폼
├── Netlify API          # 배포 플랫폼 (대체)
└── AWS SDK              # S3, CloudFront (선택적)

SEO & 분석
├── React Helmet         # 메타 태그 관리
├── Google Analytics     # 방문자 분석
└── Sitemap Generator    # 사이트맵 생성

폼 & 데이터
├── React Hook Form      # 폼 관리
├── Zod                  # 유효성 검사
└── Axios                # API 호출
```

### 개발 도구

```
코드 품질
├── ESLint               # 린팅
├── Prettier             # 코드 포맷팅
└── TypeScript Compiler  # 타입 체크

빌드 & 최적화
├── Vite                 # 개발 서버
├── PostCSS              # CSS 처리
└── Terser               # JS 압축

테스팅
├── Vitest               # 유닛 테스트
└── Playwright           # E2E 테스트 (선택적)

버전 관리
└── Git                  # 소스 코드 관리
```

---

## 문제 해결

### 자주 발생하는 문제

#### Q1: 파일을 삭제했는데 오류가 나요
```bash
# 타입 체크로 남은 오류 확인
npx tsc --noEmit

# 임포트 오류가 있는 파일 수정
# Canvas.tsx, PropertiesPanel/index.tsx, Sidebar.tsx 등
```

#### Q2: 빌드가 실패해요
```bash
# 1. node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install

# 2. 캐시 삭제
npm run dev -- --force

# 3. 타입 체크
npx tsc --noEmit
```

#### Q3: Phase 개발 중 막혔어요
- 해당 Phase의 GPT 프롬프트를 GPT-4에게 다시 요청하세요
- 오류 메시지를 포함하여 질문하세요
- README의 요구사항을 다시 확인하세요

### 오류 확인 명령어

```bash
# 모든 타입 오류 확인 (추천)
npx tsc --noEmit

# 실시간 개발 서버
npm run dev

# 프로덕션 빌드 테스트
npm run build

# ESLint 검사
npm run lint
```

---

## 향후 계획

### 단기 (1-2개월) - MVP v3.0
- [ ] Phase 1-8 완료 (디자인 툴 기본 기능)
- [ ] Phase 9-11 완료 (페이지 관리, 인터랙션, 반응형)
- [ ] Phase 13 완료 (배포 시스템)
- [ ] **첫 번째 웹사이트 배포 가능** 🎉
- [ ] 사용자 피드백 수집

### 중기 (3-6개월) - 완전한 제품
- [ ] Phase 12, 14, 15 완료 (컨텐츠, SEO, 템플릿)
- [ ] 추가 기능:
  - [ ] 블로그 시스템 (포스트 작성, 카테고리, 태그)
  - [ ] 이커머스 기능 (제품 목록, 장바구니)
  - [ ] 멤버십 시스템 (로그인, 회원 전용 콘텐츠)
  - [ ] 다국어 지원 (i18n)
  - [ ] 애니메이션 라이브러리 (페이드, 슬라이드, 패럴랙스)
  - [ ] 컴포넌트 라이브러리 확장 (카운터, 타이머, 지도)

### 장기 (6개월+) - 엔터프라이즈 기능
- [ ] **협업 기능**
  - [ ] 실시간 공동 편집 (WebSocket)
  - [ ] 댓글 및 피드백 시스템
  - [ ] 버전 관리 (Git 스타일)
  - [ ] 역할 기반 권한 (관리자, 편집자, 뷰어)

- [ ] **AI 기반 기능**
  - [ ] AI 디자인 제안 (레이아웃, 색상, 폰트)
  - [ ] AI 콘텐츠 생성 (텍스트, 이미지 캡션)
  - [ ] 자동 반응형 조정
  - [ ] 접근성 자동 체크 (WCAG 준수)

- [ ] **플러그인 시스템**
  - [ ] 플러그인 개발 SDK
  - [ ] 플러그인 마켓플레이스
  - [ ] 써드파티 통합:
    - [ ] Google Maps
    - [ ] Stripe 결제
    - [ ] Mailchimp 이메일
    - [ ] Calendly 예약
    - [ ] Disqus 댓글

- [ ] **고급 기능**
  - [ ] 데이터베이스 연동 (CMS 기능)
  - [ ] API 빌더 (노코드 백엔드)
  - [ ] 자동화 워크플로우 (Zapier 스타일)
  - [ ] A/B 테스팅
  - [ ] 히트맵 분석

- [ ] **코드 내보내기**
  - [ ] HTML/CSS 다운로드
  - [ ] React 컴포넌트 생성
  - [ ] WordPress 테마 변환
  - [ ] Webflow 호환

### 사용자 경험 개선 (지속적)
- [ ] 온보딩 튜토리얼
- [ ] 비디오 가이드
- [ ] AI 챗봇 도우미
- [ ] 커뮤니티 포럼
- [ ] 쇼케이스 갤러리

---

## 참고 자료

### 공식 문서
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Zustand](https://docs.pmnd.rs/zustand/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [SVG MDN](https://developer.mozilla.org/en-US/docs/Web/SVG)

### 디자인 툴 참고
- [Figma](https://www.figma.com/)
- [Sketch](https://www.sketch.com/)
- [Adobe XD](https://www.adobe.com/products/xd.html)

---

## 기여하기

1. 이슈 등록
2. 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 커밋 (`git commit -m 'Add amazing feature'`)
4. 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

---

## 라이선스

MIT License

---

**Let's build something amazing! 🚀**

*최종 업데이트: 2025년 11월 23일 (Phase 0 - 준비 단계)*