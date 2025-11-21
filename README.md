# 블록 기반 웹사이트 빌더 - 완전 가이드

**React + TypeScript 기반의 노코드 웹사이트 빌더**

버전: v5.0 (다중 블록 선택 기능 추가) 🆕  
작성일: 2025년 11월  
최종 업데이트: 다중 블록 선택 시스템 구현 완료

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
9. [다중 블록 선택 시스템](#9-다중-블록-선택-시스템) 🆕
10. [블록 시스템](#10-블록-시스템)
11. [페이지 간 연결 시스템](#11-페이지-간-연결-시스템)
12. [마인드맵 시스템](#12-마인드맵-시스템)
13. [이미지 관리 시스템](#13-이미지-관리-시스템)
14. [블록 복사/붙여넣기 시스템](#14-블록-복사붙여넣기-시스템)
15. [실행 취소/다시 실행 시스템](#15-실행-취소다시-실행-시스템)
16. [상태 관리](#16-상태-관리)
17. [개발 가이드](#17-개발-가이드)
18. [트러블슈팅](#18-트러블슈팅)

---

## 1. 프로젝트 개요

### 1.1 소개

코딩 지식 없이도 누구나 손쉽게 웹사이트를 제작할 수 있는 노코드 웹사이트 빌더입니다.

### 1.2 주요 기능

- 🎨 **드래그 앤 드롭 블록 배치**: 좌측 패널에서 블록을 드래그하여 캔버스에 배치
- ⚙️ **실시간 속성 편집**: React Hook Form 기반의 강력한 편집 패널
- 🎯 **Figma 스타일 요소 선택**: 텍스트, 이미지, 버튼 등 개별 요소 클릭하여 편집
- 📦 **박스 스타일 편집**: 컨테이너 크기, 배경, 테두리, 여백 등 세밀한 레이아웃 제어
- 🎯 **다중 블록 선택**: Figma처럼 Ctrl+클릭, Shift+클릭으로 여러 블록 선택 🆕
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
    ├── 📄 index.css                   # 전역 스타일
    │
    ├── 📁 components/                 # React 컴포넌트
    │   │
    │   ├── 📄 Layout.tsx              # 레이아웃 컨테이너
    │   ├── 📄 Navbar.tsx              # 상단 네비게이션 바
    │   ├── 📄 Toolbar.tsx             # 툴바 (탭, 뷰포트, Undo/Redo) ⭐
    │   ├── 📄 Sidebar.tsx             # 좌측 사이드바 컨테이너
    │   ├── 📄 BlockPanel.tsx          # 블록 목록 패널
    │   ├── 📄 SettingsPanel.tsx       # 설정 패널
    │   ├── 📄 Canvas.tsx              # 중앙 캔버스 ⭐ (v5.0 업데이트 필요)
    │   ├── 📄 BlockRenderer.tsx       # 블록 렌더링 ⭐ (v5.0 업데이트 필요)
    │   ├── 📄 ImageUploader.tsx       # 이미지 업로드 컴포넌트
    │   ├── 📄 MindMapView.tsx         # 마인드맵 뷰
    │   ├── 📄 CustomEdge.tsx          # 커스텀 Edge 컴포넌트
    │   ├── 📄 PreviewNavBar.tsx       # 미리보기 모드 네비게이션
    │   │
    │   └── 📁 PropertiesPanel/        # 우측 속성 패널 ⭐
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
    │   └── 📄 builderStore.ts         # Zustand 스토어 ⭐ (v5.0 업데이트됨)
    │
    ├── 📁 types/                      # TypeScript 타입
    │   └── 📄 index.ts                # 모든 타입 정의 ⭐ (v5.0 업데이트됨)
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
| `Toolbar.tsx` | 툴바 (탭, 뷰포트, Undo/Redo) | ⭐⭐⭐ | v4.0 |
| `Sidebar.tsx` | 좌측 사이드바 컨테이너 | ⭐⭐ | - |
| `BlockPanel.tsx` | 블록 목록 패널 | ⭐⭐⭐ | - |
| `SettingsPanel.tsx` | 설정 패널 | ⭐⭐ | - |
| `Canvas.tsx` | 캔버스 + 다중 선택 | ⭐⭐⭐ | v5.0 (업데이트 필요) |
| `BlockRenderer.tsx` | 요소별 클릭 + 체크박스 | ⭐⭐⭐ | v5.0 (업데이트 필요) |
| `ImageUploader.tsx` | 이미지 업로드 | ⭐⭐⭐ | - |
| `MindMapView.tsx` | 마인드맵 뷰 | ⭐⭐⭐ | - |
| `CustomEdge.tsx` | 드래그 가능한 엣지 | ⭐⭐⭐ | - |
| `PreviewNavBar.tsx` | 미리보기 네비게이션 | ⭐⭐ | - |
| `builderStore.ts` | 상태 관리 | ⭐⭐⭐ | v5.0 (완료) |
| `types/index.ts` | 타입 정의 (SelectionMode 등) | ⭐⭐⭐ | v5.0 (완료) |
| **PropertiesPanel/** | | | |
| `index.tsx` | 동적 폼 렌더링 | ⭐⭐⭐ | v4.0 |
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

## 9. 다중 블록 선택 시스템 🆕

### 9.1 개요

v5.0에서 추가된 기능으로, Figma처럼 여러 블록을 동시에 선택하고 편집할 수 있습니다.

### 9.2 선택 방법

#### 기본 선택 (Replace)
```
일반 클릭: 단일 블록 선택
→ 기존 선택 해제 + 새 블록 선택
```

#### 추가 선택 (Add)
```
Ctrl/Cmd + 클릭: 블록 추가/제거
→ 이미 선택된 블록: 선택 해제
→ 새로운 블록: 선택 추가
```

#### 범위 선택 (Range)
```
Shift + 클릭: 범위 선택
→ 마지막 선택 ~ 현재 클릭 사이의 모든 블록 선택
```

#### 전체 선택
```
Ctrl/Cmd + A: 현재 페이지의 모든 블록 선택
```

### 9.3 키보드 단축키

#### 선택 관련
| 단축키 | 기능 |
|--------|------|
| `Ctrl/Cmd + A` | 전체 선택 |
| `Escape` | 선택 해제 |

#### 편집 관련
| 단축키 | 기능 |
|--------|------|
| `Ctrl/Cmd + C` | 복사 (단일/다중) |
| `Ctrl/Cmd + V` | 붙여넣기 |
| `Ctrl/Cmd + X` | 잘라내기 (단일/다중) |
| `Delete` / `Backspace` | 선택된 블록 삭제 |

#### 히스토리
| 단축키 | 기능 |
|--------|------|
| `Ctrl/Cmd + Z` | 실행 취소 |
| `Ctrl/Cmd + Shift + Z` | 다시 실행 |
| `Ctrl/Cmd + Y` | 다시 실행 (대체) |

### 9.4 시각적 표시

#### 선택된 블록
```css
✅ 파란색 테두리 (ring-2 ring-blue-500)
✅ 배경 하이라이트 (bg-blue-50)
✅ 체크박스 표시 (다중 선택 시)
```

#### 다중 선택 모드
```
단일 선택: 체크박스 없음
다중 선택: 각 블록 우측 상단에 체크박스 표시
```

### 9.5 타입 정의

```typescript
// 다중 선택 모드
export type SelectionMode = 'single' | 'multiple';

// 선택 영역 (향후 드래그 박스용)
export interface SelectionBox {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}
```

### 9.6 상태 관리

```typescript
interface BuilderState {
  // 🆕 다중 블록 선택
  selectedBlockIds: string[];
  selectionMode: SelectionMode;
  copiedBlocks: Block[];  // 다중 복사
  
  // 🆕 선택 액션
  selectBlock(id: string, mode?: 'replace' | 'add' | 'range'): void;
  selectBlocks(ids: string[]): void;
  clearSelection(): void;
  selectAll(): void;
  isBlockSelected(id: string): boolean;
  
  // 🆕 다중 작업
  deleteSelectedBlocks(): void;
  copySelectedBlocks(): void;
  pasteSelectedBlocks(): void;
  cutSelectedBlocks(): void;
}
```

### 9.7 구현 상태

#### ✅ 완료된 기능
- [x] 타입 정의 (SelectionMode, SelectionBox)
- [x] 상태 관리 (builderStore.ts)
- [x] 선택 로직 (selectBlock, selectAll 등)
- [x] 다중 삭제 (deleteSelectedBlocks)
- [x] 다중 복사/붙여넣기 (copySelectedBlocks, pasteSelectedBlocks)
- [x] 다중 잘라내기 (cutSelectedBlocks)
- [x] Canvas.tsx 구현 (키보드 단축키, 클릭 핸들러)
- [x] BlockRenderer.tsx 구현 (체크박스, 선택 표시)

#### 🚧 적용 대기
- [ ] Canvas.tsx 프로젝트 적용
- [ ] BlockRenderer.tsx 프로젝트 적용
- [ ] Toolbar.tsx 업데이트 (선택 개수 표시)
- [ ] PropertiesPanel 업데이트 (다중 선택 패널)

#### 📌 향후 계획
- [ ] 드래그 선택 박스
- [ ] 정렬 기능 (왼쪽, 중앙, 오른쪽)
- [ ] 그룹화/그룹 해제
- [ ] 공통 속성 일괄 편집
- [ ] 순서 변경 (맨 앞으로, 맨 뒤로)

### 9.8 사용 예시

#### 예시 1: 여러 블록 선택 후 삭제
```
1. 첫 번째 블록 클릭 (선택)
2. Ctrl + 두 번째 블록 클릭 (추가)
3. Ctrl + 세 번째 블록 클릭 (추가)
4. Delete 키 → 3개 블록 모두 삭제 ✅
```

#### 예시 2: 범위 선택
```
1. 첫 번째 블록 클릭 (선택)
2. Shift + 다섯 번째 블록 클릭
   → 1~5번 블록 모두 선택 ✅
```

#### 예시 3: 전체 선택 후 복사
```
1. Ctrl + A (전체 선택)
2. Ctrl + C (복사)
3. 새 페이지로 이동
4. Ctrl + V (붙여넣기) ✅
```

### 9.9 적용 방법

자세한 적용 방법은 다음 문서를 참조하세요:
- `QUICK_START.md` - 빠른 시작 가이드
- `IMPLEMENTATION_SUMMARY.md` - 완전한 구현 가이드
- `MULTI_SELECT_GUIDE.md` - 사용자 가이드

---

## 15. 실행 취소/다시 실행 시스템

### 15.1 개요

히스토리 스택 방식으로 구현된 Undo/Redo 시스템입니다.

### 15.2 키보드 단축키

```typescript
// Windows/Linux
Ctrl + Z              // 실행 취소
Ctrl + Shift + Z      // 다시 실행
Ctrl + Y              // 다시 실행 (대체)

// Mac
Cmd + Z               // 실행 취소
Cmd + Shift + Z       // 다시 실행
Cmd + Y               // 다시 실행 (대체)
```

### 15.3 UI 버튼

- **위치**: Toolbar 중앙
- **버튼**:
  - ← (Undo2): 실행 취소
  - → (Redo2): 다시 실행
- **상태**: 히스토리 없을 때 비활성화

### 15.4 히스토리 기록 액션

```typescript
✅ 기록되는 액션:
- addBlock, removeBlock, updateBlock (박스 스타일 포함)
- reorderBlocks, pasteBlock, cutBlock
- addPage, removePage, updatePage
- 모든 마인드맵 액션
- 🆕 deleteSelectedBlocks, pasteSelectedBlocks, cutSelectedBlocks

❌ 기록 안 되는 액션:
- setSelectedElement (UI 상태)
- selectBlock, selectBlocks, clearSelection (선택 상태)
- setViewport (UI 상태)
- setActiveTab (UI 상태)
- copyBlock, copySelectedBlocks (읽기 전용)
- togglePreviewMode (UI 상태)
```

---

## 17. 트러블슈팅

### 17.1 일반적인 문제

#### Q1: Ctrl+A를 눌러도 텍스트가 선택돼요 🆕

**증상:**
```
Ctrl+A 누르면 → 텍스트가 파란색으로 선택됨 ❌
```

**원인:**
- Canvas.tsx가 업데이트되지 않음
- `e.preventDefault()`가 실행되지 않음

**해결:**
```typescript
// Canvas.tsx의 handleKeyDown 확인
if (ctrlOrCmd && e.key.toLowerCase() === 'a') {
  e.preventDefault();  // ⭐ 브라우저 기본 동작 차단
  selectAll();         // ⭐ 모든 블록 선택
  return;
}
```

**적용:**
- `QUICK_START.md`의 Canvas.tsx를 프로젝트에 복사하세요

#### Q2: 블록을 클릭해도 다중 선택이 안 돼요 🆕

**증상:**
```
Ctrl+클릭 → 아무 반응 없음 ❌
```

**원인:**
- BlockRenderer.tsx가 업데이트되지 않음
- `onBlockClick` prop이 전달되지 않음

**해결:**
```typescript
// Canvas.tsx에서 BlockRenderer 호출 확인
<BlockRenderer 
  block={block} 
  isSelected={isBlockSelected(block.id)}  // ✅
  onBlockClick={(e) => handleBlockClick(e, block.id)}  // ✅
/>
```

#### Q3: 체크박스가 보이지 않아요 🆕

**증상:**
```
블록 2개 선택 → 체크박스 없음 ❌
```

**확인 사항:**
1. BlockRenderer.tsx가 업데이트되었는지 확인
2. `selectionMode === 'multiple'` 인지 확인
3. `onClick` prop이 전달되었는지 확인

**해결:**
```typescript
// BlockRenderer.tsx 확인
{selectionMode === 'multiple' && onClick && (
  <div className="absolute top-2 right-2 z-50">
    <input type="checkbox" checked={isSelected} readOnly />
  </div>
)}
```

#### Q4: 박스 요소가 선택되지 않아요

**증상:**
```
히어로 블록의 배경 클릭 → 아무 반응 없음 ❌
```

**확인 사항:**
1. 미리보기 모드인가요? (편집 모드로 전환)
2. 텍스트나 버튼을 클릭하지 않았나요? (빈 공간 클릭)
3. BlockRenderer.tsx에 onClick 이벤트가 있나요?

**해결:**
```typescript
// BlockRenderer.tsx 확인
<section
  onClick={(e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'SECTION') {
      handleElementClick(e, block, 'box', 'section', onClick);  // ✅
    }
  }}
>
```

#### Q5: 텍스트 편집이 블록 전체에 적용돼요

**증상:**
```
제목만 수정하고 싶은데 블록 전체가 변경됨 ❌
```

**원인:**
- elementPath가 잘못 설정됨

**해결:**
```typescript
// BlockRenderer.tsx에서 정확한 경로 지정
onClick={(e) => handleElementClick(e, block, 'text', 'title', onClick)}  // ✅ 'title'
onClick={(e) => handleElementClick(e, block, 'text', 'subtitle', onClick)}  // ✅ 'subtitle'
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

- `QUICK_START.md` - 다중 블록 선택 빠른 시작 가이드 🆕
- `IMPLEMENTATION_SUMMARY.md` - 다중 블록 선택 구현 가이드 🆕
- `MULTI_SELECT_GUIDE.md` - 다중 블록 선택 사용자 가이드 🆕
- `README_MULTI_SELECT.md` - 다중 블록 선택 완성 가이드 🆕

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
- [x] 다중 블록 선택 (타입 + 상태 관리) 🆕
- [ ] 다중 블록 선택 (UI 완성)
- [ ] 텍스트 링크 연결 구현
- [ ] 다중 블록 정렬 기능
- [ ] 그룹화/그룹 해제

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
- [ ] 드래그 선택 박스

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
6. **다중 선택**: [9. 다중 블록 선택 시스템](#9-다중-블록-선택-시스템) 🆕
7. **문제 해결**: [17. 트러블슈팅](#17-트러블슈팅)

### 주요 업데이트

**v5.0 (최신) 🆕**
- ✅ 다중 블록 선택 시스템 구현
  - Ctrl+클릭으로 블록 추가/제거
  - Shift+클릭으로 범위 선택
  - Ctrl+A로 전체 선택
  - Delete 키로 일괄 삭제
  - 다중 복사/붙여넣기/잘라내기
  - 체크박스 시각화
  - SelectionMode, SelectionBox 타입 추가
  - builderStore에 다중 선택 상태 및 액션 추가
  - Canvas.tsx 구현 (키보드 단축키, 블록 클릭)
  - BlockRenderer.tsx 구현 (체크박스, 선택 표시)
  - 히스토리에 자동 기록 (Undo/Redo)

**v4.1**
- ✅ 박스 스타일 실제 적용 완료
  - 모든 블록에서 박스 요소 선택 가능
  - 크기, 배경, 테두리, 여백 실시간 편집
  - BoxStyle 타입 정의 및 데이터 구조 확립
  - convertBoxStyleToCSS 헬퍼 함수
  - 히스토리에 자동 기록 (Undo/Redo)

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
Ctrl+A / Cmd+A        → 전체 선택 🆕
Escape                → 선택 해제 🆕
Ctrl+클릭              → 블록 추가/제거 🆕
Shift+클릭             → 범위 선택 🆕

편집 작업:
Ctrl+C / Cmd+C        → 블록 복사 (단일/다중)
Ctrl+V / Cmd+V        → 블록 붙여넣기
Ctrl+X / Cmd+X        → 블록 잘라내기 (단일/다중)
Delete / Backspace    → 선택된 블록 삭제 🆕

히스토리:
Ctrl+Z / Cmd+Z              → 실행 취소
Ctrl+Shift+Z / Cmd+Shift+Z  → 다시 실행
Ctrl+Y / Cmd+Y              → 다시 실행 (대체)

참고:
- Input/Textarea 편집 중에는 단축키 비활성화
- 미리보기 모드에서는 단축키 비활성화
```

### 다중 블록 선택 빠른 가이드 🆕

```
블록 선택:
1. 일반 클릭 → 단일 블록 선택
2. Ctrl+클릭 → 블록 추가/제거 토글
3. Shift+클릭 → 범위 선택 (첫 선택~마지막 선택)
4. Ctrl+A → 모든 블록 선택

시각적 표시:
✅ 선택된 블록: 파란색 테두리 + 배경
✅ 체크박스: 다중 선택 모드 시 자동 표시
✅ 선택 개수: 툴바에 배지 표시 (향후)

주요 작업:
- Delete 키로 일괄 삭제
- Ctrl+C/V로 다중 복사/붙여넣기
- Ctrl+X로 다중 잘라내기
- 모든 작업은 Undo/Redo 가능

적용 방법:
QUICK_START.md를 참조하여 Canvas.tsx와 
BlockRenderer.tsx를 프로젝트에 적용하세요.
```

**Happy Coding! 🚀**

---

*이 문서는 지속적으로 업데이트됩니다.*  
*최종 업데이트: 2025년 11월 (v5.0 - 다중 블록 선택 시스템 구현 완료)*