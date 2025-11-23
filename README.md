# Figma 스타일 웹사이트 빌더

**React + TypeScript 기반의 노코드 웹사이트 제작 플랫폼**

현재 상태: Phase 3 완료 ✅  
작성일: 2025년 11월 24일  
**목표: 손쉬운 웹사이트 제작 + Figma 스타일 편집** 🌐

---

## 📋 목차

1. [프로젝트 소개](#프로젝트-소개)
2. [현재 상태](#현재-상태)
3. [빠른 시작](#빠른-시작)
4. [프로젝트 구조](#프로젝트-구조)
5. [개발 로드맵](#개발-로드맵)
6. [Phase별 개발 가이드](#phase별-개발-가이드)
7. [기술 스택](#기술-스택)
8. [문제 해결](#문제-해결)

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

### 🎯 주요 기능

#### 📐 디자인 도구 (Phase 1-5)
- 🔲 도형: 사각형, 원, 삼각형 ✅
- ➖ 선: 직선, 화살표 ✅
- 📝 텍스트: 자유 텍스트 추가 및 편집
- 🖼️ 이미지: 드래그 앤 드롭 업로드

#### ⚙️ 편집 기능 (Phase 6-8)
- 📍 절대 위치 배치 (X, Y 좌표) ✅
- ⚙️ 실시간 속성 편집
- 📚 레이어 시스템 (zIndex) ✅
- ✨ 선택, 이동, 크기 조절, 회전 ✅ (기본 기능)
- 📐 정렬 도구
- 📦 그룹화
- ⌨️ 키보드 단축키
- ↩️ Undo/Redo

#### 🌐 웹사이트 기능 (Phase 9-12)
- 📄 **다중 페이지 관리**
- 🔗 **인터랙션 시스템**
- 📱 **반응형 디자인**
- 📝 **컨텐츠 관리**

#### 🚀 배포 및 관리 (Phase 13-15)
- 🌍 **배포 시스템**
- 📊 **SEO 및 분석**
- 🎨 **템플릿 시스템**

---

## 현재 상태

### ✅ 완료된 작업

**Phase 0: 프로젝트 초기화** ✅
- [x] 기존 블록 시스템 분석
- [x] Figma 스타일 전환 계획 수립
- [x] Phase 1-15 개발 로드맵 작성
- [x] 프로젝트 구조 준비

**Phase 1: 기본 구조 및 타입 시스템** ✅
- [x] types/index.ts 신규 생성
- [x] builderStore.ts 신규 생성
- [x] Layout.tsx 신규 생성
- [x] Toolbar.tsx 신규 생성
- [x] Sidebar.tsx 신규 생성
- [x] PropertiesPanel.tsx 신규 생성
- [x] 기본 UI 구조 완성

**Phase 2: 도형 그리기 시스템** ✅
- [x] Canvas/index.tsx 구현 (메인 캔버스)
- [x] ShapeRenderer.tsx 구현 (도형 렌더링)
- [x] SelectionBox.tsx 구현 (선택 박스)
- [x] useShapeDrawing.ts 구현 (도형 그리기 훅)
- [x] useDragElement.ts 구현 (드래그 이동 훅)
- [x] shapeUtils.ts 구현 (도형 유틸리티)
- [x] 사각형, 원, 삼각형 그리기 완성
- [x] 실시간 미리보기
- [x] Shift 키 (정사각형/정원)
- [x] Alt 키 (중심에서 그리기)
- [x] 도형 선택 및 이동
- [x] 다중 선택 (Ctrl/Cmd + 클릭)

**Phase 3: 선 그리기 시스템** ✅
- [x] Canvas/LineRenderer.tsx 구현 (선 렌더링)
- [x] useLineDrawing.ts 구현 (선 그리기 훅)
- [x] lineUtils.ts 구현 (선 유틸리티)
- [x] 직선 그리기 (클릭-이동-클릭)
- [x] 화살표 그리기 (화살촉 자동 생성)
- [x] Shift 키 (45도 스냅)
- [x] ESC 키 (그리기 취소)
- [x] 선 선택 및 이동
- [x] 다중 선택 지원
- [x] Canvas/index.tsx 업데이트 (선 그리기 모드)
- [x] useDragElement.ts 업데이트 (선 드래그 지원)
- [x] PropertiesPanel.tsx 업데이트 (선 속성 표시)
- [x] types/index.ts 업데이트 (opacity 속성 추가)

### 🚧 다음 단계

**Phase 4: 자유 텍스트 시스템** (2일 예상)
- [ ] FreeTextRenderer.tsx 신규 생성
- [ ] TextEditor.tsx 신규 생성
- [ ] useTextEditing.ts 신규 생성
- [ ] 클릭하여 텍스트 추가
- [ ] 인라인 편집 (더블클릭)
- [ ] 폰트, 크기, 색상 조정

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

### Phase 3 기능 테스트

```bash
# 1. 개발 서버 시작
npm run dev

# 2. 브라우저에서 테스트

# 도형 그리기 (Phase 2)
# - 좌측 도구바에서 사각형/원/삼각형 클릭
# - 캔버스에서 드래그하여 도형 그리기
# - Shift: 정사각형/정원 | Alt: 중심에서 그리기

# 선 그리기 (Phase 3) ✨ 새로 추가!
# - 좌측 도구바에서 직선/화살표 클릭
# - 캔버스에서 첫 번째 클릭 (시작점)
# - 마우스 이동하여 미리보기 확인
# - 두 번째 클릭 (끝점)
# - Shift: 45도 스냅 | ESC: 취소

# 선택 및 이동
# - 선택 모드에서 요소 클릭
# - 드래그하여 이동
# - Ctrl/Cmd + 클릭으로 다중 선택
```

### 오류 확인

```bash
# 모든 타입 오류 확인 (추천)
npx tsc --noEmit

# 개발 서버 (실시간 확인)
npm run dev
```

---

## 프로젝트 구조

### 현재 구조 (Phase 3 완료)

```
src/
├── components/
│   ├── Layout.tsx              ✅ 완성
│   ├── Toolbar.tsx             ✅ 완성
│   ├── Sidebar.tsx             ✅ 완성
│   └── PropertiesPanel.tsx     ✅ 완성 (도형/선 속성 표시)
│
├── Canvas/
│   ├── index.tsx               ✅ 완성 (도형+선 그리기)
│   ├── ShapeRenderer.tsx       ✅ 완성
│   ├── LineRenderer.tsx        ✅ 완성 (Phase 3)
│   └── SelectionBox.tsx        ✅ 완성
│
├── hooks/
│   ├── useShapeDrawing.ts      ✅ 완성
│   ├── useLineDrawing.ts       ✅ 완성 (Phase 3)
│   └── useDragElement.ts       ✅ 완성 (도형+선 드래그)
│
├── store/
│   └── builderStore.ts         ✅ 완성
│
├── types/
│   └── index.ts                ✅ 완성 (LineElement, ArrowElement 추가)
│
├── utils/
│   ├── shapeUtils.ts           ✅ 완성
│   └── lineUtils.ts            ✅ 완성 (Phase 3)
│
├── main.tsx                    ✅ 완성
├── App.tsx                     ✅ 완성
└── index.css                   ✅ 완성
```

### 목표 구조 (Phase 8 완료 시)

```
src/
├── components/
│   ├── Canvas/                 
│   │   ├── index.tsx                  ✅
│   │   ├── ShapeRenderer.tsx          ✅
│   │   ├── LineRenderer.tsx           ✅
│   │   ├── FreeTextRenderer.tsx       🆕 Phase 4
│   │   ├── FreeImageRenderer.tsx      🆕 Phase 5
│   │   ├── SelectionBox.tsx           ✅
│   │   └── TextEditor.tsx             🆕 Phase 4
│   │
│   ├── LayerPanel/             🆕 Phase 6
│   │   ├── index.tsx
│   │   ├── LayerItem.tsx
│   │   └── LayerControls.tsx
│   │
│   ├── PropertiesPanel/
│   │   ├── index.tsx                  ✅ (기본)
│   │   ├── FormGroup.tsx              
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
├── hooks/                      
│   ├── useShapeDrawing.ts             ✅
│   ├── useLineDrawing.ts              ✅
│   ├── useTextEditing.ts              🆕 Phase 4
│   ├── useDragElement.ts              ✅
│   ├── useResizeElement.ts            🆕 Phase 7
│   ├── useCanvasTool.ts               🆕 Phase 7
│   ├── useAlignment.ts                🆕 Phase 8
│   └── useKeyboardShortcuts.ts        🆕 Phase 8
│
├── store/
│   └── builderStore.ts                ✅
│
├── types/
│   └── index.ts                       ✅
│
└── utils/
    ├── imageUtils.ts                  
    ├── shapeUtils.ts                  ✅
    ├── lineUtils.ts                   ✅
    ├── geometryUtils.ts               🆕 Phase 8
    └── positionUtils.ts               🆕 Phase 8
```

---

## 개발 로드맵

### 📊 전체 일정

#### 🎨 Core 디자인 툴 (Phase 1-8)

| Phase | 기능 | 기간 | 우선순위 | 상태 |
|-------|------|------|----------|------|
| **Phase 0** | 준비 작업 | 1일 | 🔴 필수 | ✅ 완료 |
| **Phase 1** | 기본 구조 및 타입 | 1일 | 🔴 필수 | ✅ 완료 |
| **Phase 2** | 도형 그리기 | 2일 | 🔴 필수 | ✅ 완료 |
| **Phase 3** | 선 그리기 | 1일 | 🔴 필수 | ✅ 완료 |
| **Phase 4** | 자유 텍스트 | 2일 | 🔴 필수 | 📋 대기 |
| **Phase 5** | 이미지 추가 | 1일 | 🔴 필수 | 📋 대기 |
| **Phase 6** | 레이어 시스템 | 2일 | 🟡 권장 | 📋 대기 |
| **Phase 7** | 속성 편집 | 2일 | 🔴 필수 | 📋 대기 |
| **Phase 8** | 고급 기능 | 3일 | 🟢 선택 | 📋 대기 |

**현재까지 소요: 5일 / 총 15일**

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

#### ✅ MVP v0.3 (선 그리기) - 현재 위치
```
Phase 0 → 1 → 2 → 3 완료
= 준비 + 기본 구조 + 도형 + 선 그리기
= 약 5일 소요
```
**기능**: 도형과 선을 자유롭게 그리고 이동 가능

#### MVP v1.0 (기본 디자인 툴)
```
Phase 0 → 1 → 2 → 3 → 4 → 7
= 준비 + 기본 구조 + 도형 + 선 + 텍스트 + 속성 편집
= 약 10일
```
**기능**: 기본 도형, 선, 텍스트로 디자인 가능

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

### Phase 0: 프로젝트 초기화 ✅ 완료

**목표**: 기존 코드 완전 제거 및 빈 프로젝트 준비

**완료 내역**
- [x] src/ 디렉토리 완전 삭제
- [x] 빈 src/ 디렉토리 생성
- [x] package.json, tsconfig.json 등 설정 파일만 유지
- [x] Phase 1 시작 준비 완료

---

### Phase 1: 기본 구조 및 타입 시스템 ✅ 완료

**목표**: Figma 스타일 타입 정의 및 상태 관리

**완료된 파일**
1. ✅ src/main.tsx (React 진입점)
2. ✅ src/App.tsx (앱 루트)
3. ✅ src/index.css (전역 스타일)
4. ✅ src/types/index.ts (모든 타입 정의)
5. ✅ src/store/builderStore.ts (Zustand 스토어)
6. ✅ src/components/Layout.tsx (레이아웃)
7. ✅ src/components/Toolbar.tsx (도구바)
8. ✅ src/components/Sidebar.tsx (사이드바)
9. ✅ src/components/PropertiesPanel.tsx (속성 패널)

**구현된 기능**
- ✅ 3단 레이아웃 (Toolbar | Canvas | Sidebar)
- ✅ 도구 선택 UI
- ✅ Zustand 상태 관리
- ✅ TypeScript 타입 시스템

---

### Phase 2: 도형 그리기 시스템 ✅ 완료

**목표**: 사각형, 원, 삼각형 그리기 및 선택

**완료된 파일**
1. ✅ src/Canvas/index.tsx (메인 캔버스)
2. ✅ src/Canvas/ShapeRenderer.tsx (도형 렌더링)
3. ✅ src/Canvas/SelectionBox.tsx (선택 박스)
4. ✅ src/hooks/useShapeDrawing.ts (도형 그리기 훅)
5. ✅ src/hooks/useDragElement.ts (드래그 이동 훅)
6. ✅ src/utils/shapeUtils.ts (도형 유틸리티)

**구현된 기능**
- ✅ 마우스 드래그로 도형 그리기
- ✅ 실시간 미리보기 (반투명)
- ✅ Shift 키: 정사각형/정원 그리기
- ✅ Alt 키: 중심에서 그리기
- ✅ 도형 선택 (파란색 테두리)
- ✅ 선택 박스 (8개 리사이즈 핸들 + 회전 핸들)
- ✅ 도형 드래그 이동
- ✅ 다중 선택 (Ctrl/Cmd + 클릭)
- ✅ zIndex 순서 관리

**작동 방식**
```
1. 도구바에서 "사각형" 클릭
   → currentTool = 'rectangle'

2. 캔버스에서 마우스 다운
   → 시작점 저장 (startX, startY)
   → isDrawing = true

3. 마우스 이동
   → 실시간 크기 계산
   → 반투명 미리보기 도형 표시

4. 마우스 업
   → 도형 완성
   → store.addElement(newShape)
   → isDrawing = false
   → currentTool = 'select' (자동 전환)
```

---

### Phase 3: 선 그리기 시스템 ✅ 완료

**목표**: 직선, 화살표 그리기

**완료된 파일**
1. ✅ src/Canvas/LineRenderer.tsx (선 렌더링)
2. ✅ src/hooks/useLineDrawing.ts (선 그리기 훅)
3. ✅ src/utils/lineUtils.ts (선 유틸리티)
4. ✅ src/Canvas/index.tsx (선 그리기 모드 추가)
5. ✅ src/hooks/useDragElement.ts (선 드래그 지원 추가)
6. ✅ src/components/PropertiesPanel.tsx (선 속성 표시 추가)
7. ✅ src/types/index.ts (LineElement, ArrowElement 타입 추가)

**구현된 기능**
- ✅ 직선 그리기 (클릭-이동-클릭)
- ✅ 화살표 그리기 (화살촉 자동 생성)
- ✅ 실시간 미리보기 (반투명)
- ✅ Shift 키: 45도 스냅 (0°, 45°, 90°, 135°, 180° 등)
- ✅ ESC 키: 그리기 취소
- ✅ 선 선택 (파란색 테두리 + 시작/끝점 원)
- ✅ 선 드래그 이동
- ✅ 다중 선택 지원
- ✅ SVG 화살표 마커
- ✅ 투명 히트 영역 (클릭하기 쉬움)

**작동 방식**
```
1. 도구바에서 "직선" 또는 "화살표" 클릭
   → currentTool = 'line' or 'arrow'

2. 캔버스에서 첫 번째 클릭
   → 시작점 저장 (startPoint)
   → isDrawing = true

3. 마우스 이동
   → 실시간 미리보기 선 표시
   → Shift 키: 45도 스냅

4. 두 번째 클릭 또는 ESC
   → 선 완성 (클릭) 또는 취소 (ESC)
   → store.addElement(newLine)
   → isDrawing = false
```

---

### Phase 4: 자유 텍스트 시스템 (다음 단계)

**목표**: 텍스트 추가 및 인라인 편집

**작업 파일**
```
신규 생성:
1. src/Canvas/FreeTextRenderer.tsx  (텍스트 렌더러)
2. src/Canvas/TextEditor.tsx        (텍스트 에디터)
3. src/hooks/useTextEditing.ts      (텍스트 편집 훅)

수정:
4. src/Canvas/index.tsx             (텍스트 모드 추가)
```

**GPT 프롬프트**
```
Phase 4를 개발해주세요.

배경:
- Figma처럼 클릭하여 텍스트를 추가하고 바로 편집할 수 있어야 합니다.

요구사항:

1. Canvas/FreeTextRenderer.tsx
   - foreignObject 내부에 div
   - 폰트, 크기, 색상, 정렬 적용
   - 더블클릭: 편집 모드

2. Canvas/TextEditor.tsx
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

---

### Phase 6: 레이어 시스템 (2일)

**목표**: 레이어 목록 표시 및 순서 변경

---

### Phase 7: 속성 편집 패널 (2일)

**목표**: 요소별 속성 폼 및 실시간 업데이트

---

### Phase 8: 고급 기능 (3일)

**목표**: 정렬, 그룹화, 키보드 단축키

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
└── React Hook Form      # 폼 상태 (예정)

그래픽 및 디자인
├── SVG                  # 벡터 그래픽
├── Canvas API           # 이미지 처리 (예정)
└── Framer Motion        # 애니메이션 (선택적)

드래그 앤 드롭
└── @dnd-kit/sortable    # 레이어 정렬 (예정)

페이지 구조
└── ReactFlow            # 마인드맵 시각화 (예정)
```

---

## 문제 해결

### 자주 발생하는 문제

#### Q1: 도형이나 선이 그려지지 않아요
```bash
# 1. Canvas/index.tsx가 제대로 작성되었는지 확인
# 2. Layout.tsx에서 import 경로 확인
#    import Canvas from '../Canvas'; // ✅ 올바름
#    import Canvas from './Canvas';  // ❌ 틀림

# 3. 타입 체크
npx tsc --noEmit

# 4. 개발 서버 재시작
npm run dev
```

#### Q2: 선을 클릭해도 선택이 안 돼요
```bash
# 1. 선택 모드(V)인지 확인
# 2. 선 위를 정확히 클릭하세요
#    (투명 히트 영역이 넓어서 대부분 잘 됩니다)
# 3. 콘솔에서 오류 확인 (F12)
```

#### Q3: 45도 스냅이 작동 안 해요
```bash
# 1. Shift 키를 누른 채로 마우스를 이동하세요
# 2. 직선/화살표 도구가 선택되어 있는지 확인
# 3. useLineDrawing 훅의 snapToAngle 함수 확인
```

#### Q4: ESC 키가 작동 안 해요
```bash
# 1. 선 그리기 중인지 확인
# 2. 다른 입력 필드에 포커스가 있지 않은지 확인
# 3. 브라우저 콘솔에서 오류 확인
```

#### Q5: 빌드가 실패해요
```bash
# 1. node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install

# 2. 타입 체크
npx tsc --noEmit

# 3. 빌드
npm run build
```

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
- [ ] Phase 4-5 완료 (텍스트, 이미지)
- [ ] Phase 6-8 완료 (레이어, 속성, 고급 기능)
- [ ] Phase 9-11 완료 (페이지 관리, 인터랙션, 반응형)
- [ ] Phase 13 완료 (배포 시스템)
- [ ] **첫 번째 웹사이트 배포 가능** 🎉

### 중기 (3-6개월) - 완전한 제품
- [ ] Phase 12, 14, 15 완료 (컨텐츠, SEO, 템플릿)
- [ ] 추가 기능:
  - [ ] 블로그 시스템
  - [ ] 이커머스 기능
  - [ ] 멤버십 시스템
  - [ ] 다국어 지원
  - [ ] 애니메이션 라이브러리

### 장기 (6개월+) - 엔터프라이즈 기능
- [ ] 협업 기능 (실시간 공동 편집)
- [ ] AI 기반 기능 (디자인 제안, 콘텐츠 생성)
- [ ] 플러그인 시스템
- [ ] 코드 내보내기 (React, WordPress 등)

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

*최종 업데이트: 2025년 11월 24일 (Phase 3 완료)*