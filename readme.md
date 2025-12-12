# Figma 스타일 웹사이트 빌더

**React + TypeScript 기반의 노코드 웹사이트 제작 플랫폼**

현재 상태: **Phase 15 + Priority 4 + 전체 개선 완료** ✅
작성일: 2025년 12월 13일
**목표: 손쉬운 웹사이트 제작 + Figma 스타일 편집 + 인터랙티브 + 반응형 웹사이트** 🌐

---

## 📋 목차

1. [프로젝트 소개](#프로젝트-소개)
2. [현재 상태](#현재-상태)
3. [최근 업데이트](#최근-업데이트)
4. [빠른 시작](#빠른-시작)
5. [주요 기능](#주요-기능)
6. [프로젝트 구조](#프로젝트-구조)
7. [개발 로드맵](#개발-로드맵)
8. [기술 스택](#기술-스택)
9. [향후 계획](#향후-계획)

---

## 프로젝트 소개

### 🎨 무엇을 만드나요?

**Figma처럼 직관적하고 강력한 웹사이트 제작 도구**입니다.

코딩 지식 없이도 누구나 도형, 선, 텍스트, 이미지를 자유롭게 배치하여 전문적인 웹사이트를 디자인하고 HTML로 내보낼 수 있습니다.

### 🌟 핵심 특징

```
✨ Figma 스타일 편집
└── 직관적인 드래그 앤 드롭
└── 자유로운 요소 배치
└── 실시간 미리보기
└── 캔버스 줌 & 팬 (마우스 휠, Space+드래그)
└── 그리드 & 스냅 시스템

📱 완전한 웹사이트 제작
└── 다중 페이지 관리
└── SEO 최적화
└── 깨끗한 HTML/CSS 내보내기
└── 반응형 디자인 (Desktop/Tablet/Mobile)

🎯 프로덕션 레디
└── 프로젝트 저장/불러오기
└── 이중 자동 저장 (변경 감지 + 30초 주기)
└── Undo/Redo (히스토리 패널)
└── 키보드 단축키 (Ctrl+K로 치트시트 확인)
└── 요소 복제 (Ctrl+D, Alt+드래그)

🎨 고급 디자인
└── CSS 클래스 시스템
└── 키프레임 애니메이션
└── 커스텀 브레이크포인트
└── 컴포넌트 라이브러리
└── 인터랙션 시스템
```

---

## 현재 상태

### ✅ 완료된 Phase (Phase 0-15)

#### 🎨 Core 디자인 툴 (Phase 0-8)

| Phase | 기능 | 상태 |
|-------|------|------|
| **Phase 0** | 프로젝트 초기화 | ✅ 완료 |
| **Phase 1** | 기본 구조 및 타입 시스템 | ✅ 완료 |
| **Phase 2** | 도형 그리기 (사각형, 원, 삼각형) | ✅ 완료 |
| **Phase 3** | 선 그리기 (직선, 화살표) | ✅ 완료 |
| **Phase 4** | 자유 텍스트 시스템 | ✅ 완료 |
| **Phase 5** | 이미지 추가 시스템 | ✅ 완료 |
| **Phase 6** | 레이어 시스템 | ✅ 완료 |
| **Phase 7** | 속성 편집 시스템 | ✅ 완료 |
| **Phase 8** | 고급 기능 (Undo/Redo, 정렬, 그룹) | ✅ 완료 |

#### 🌐 웹사이트 제작 기능 (Phase 9-15)

| Phase | 기능 | 상태 |
|-------|------|------|
| **Phase 9** | 다중 페이지 관리 | ✅ 완료 |
| **Phase 10** | 프로젝트 저장/불러오기 | ✅ 완료 |
| **Phase 11** | 미리보기 & HTML 내보내기 | ✅ 완료 |
| **Phase 12** | 컴포넌트 시스템 (재사용 가능한 요소) | ✅ 완료 |
| **Phase 13** | 인터랙션 시스템 (클릭/호버/애니메이션) | ✅ 완료 |
| **Phase 14** | 반응형 디자인 시스템 (브레이크포인트/오버라이드) | ✅ 완료 |
| **Phase 15** | CSS 클래스 & 키프레임 애니메이션 & 커스텀 브레이크포인트 | ✅ 완료 |

#### 🚀 UX 개선 (Priority 0-4)

| Priority | 기능 | 상태 |
|----------|------|------|
| **Priority 0.1** | 캔버스 줌 & 팬 컨트롤 | ✅ 완료 |
| **Priority 0.2** | 그리드 & 스냅 시스템 | ✅ 완료 |
| **Priority 0.3** | 키보드 단축키 치트시트 모달 | ✅ 완료 |
| **Priority 0.4** | 레이어 검색 (Ctrl+F) | ✅ 완료 |
| **Priority 1.1** | 요소 복제 개선 (Ctrl+D, Alt+드래그) | ✅ 완료 |
| **Priority 1.2** | 멀티 선택 개선 (Shift+클릭 범위 선택) | ✅ 완료 |
| **Priority 1.3** | 히스토리 패널 (사이드바) | ✅ 완료 |
| **Priority 2.1** | 스마트 가이드라인 & 정렬 보조선 | ✅ 완료 |
| **Priority 2.2** | 박스 선택 (Rectangle Selection) | ✅ 완료 |
| **Priority 2.3** | 실시간 반응형 프리뷰 | ✅ 완료 |
| **Priority 2.4** | 컴포넌트 드래그 앤 드롭 개선 | ✅ 완료 |
| **Priority 3.1** | 색상 팔레트 관리 | ✅ 완료 |
| **Priority 3.2** | 요소 잠금 & 숨김 개선 | ✅ 완료 |
| **Priority 3.3** | 실행 취소 개선 (작업 이름 표시) | ✅ 완료 |
| **Priority 3.4** | 이미지 업로드 개선 (드래그 앤 드롭) | ✅ 완료 |
| **Priority 4.1** | 텍스트 편집 고도화 (리치 텍스트) | ✅ 완료 |
| **Priority 4.2** | 도형 라이브러리 확장 (별, 다각형 등) | ✅ 완료 |
| **Priority 4.4** | 디자인 토큰 시스템 | ✅ 완료 |

#### 📦 추가 개선 사항

| 기능 | 상태 |
|------|------|
| **HTML 내보내기 개선** | ✅ 완료 |
| **오토세이브 개선** | ✅ 완료 |

---

## 최근 업데이트

### 🔧 전체 개선 작업 완료 (2025-12-13)

#### Critical & Recommended 이슈 해결 (6가지)

**1️⃣ DesignTokensPanel 논리 오류 수정**
- ✅ radius 토큰 버튼 활성화 조건 명확화
- ✅ OR 논리 → AND 논리로 개선
- 파일: `src/components/DesignTokensPanel.tsx:407-410`

**2️⃣ 토큰 리셋 후 자동 저장**
- ✅ 토큰 리셋 시 자동 저장 추가
- ✅ 새로고침 후에도 리셋 상태 유지
- 파일: `src/store/builderStore.ts:2398-2401`

**3️⃣ 빈 배열 처리 오류 수정**
- ✅ 텍스트 편집 시 빈 배열 안전 처리
- ✅ Math.max -Infinity 오류 방지
- 파일: `src/hooks/useTextEditing.ts:31-34`

**4️⃣ textShadow 타입 안전성 개선**
- ✅ textShadow 값 명시적 검증
- ✅ 잘못된 CSS 값 적용 방지
- 파일: `src/Canvas/FreeTextRenderer.tsx:83`

**5️⃣ 다중 boxShadow 지원 추가** ⭐
- ✅ 쉼표로 구분된 여러 shadow 파싱
- ✅ 모든 도형 타입에 다중 shadow 렌더링
- ✅ 정규표현식 상수화 (성능 개선)
- ✅ ShadowParams 인터페이스 export
- 파일: `src/utils/shadowUtils.ts`, `src/Canvas/ShapeRenderer.tsx`
- 예시: `box-shadow: 0 1px 2px rgba(0,0,0,0.05), 0 4px 6px rgba(0,0,0,0.1);`

**6️⃣ spacing 토큰 제거**
- ✅ 미사용 spacing 토큰 제거
- ✅ SpacingToken 인터페이스 제거
- ✅ 코드 정리 및 혼란 제거
- 파일: `src/types/index.ts`, `src/store/builderStore.ts`

#### 개선 효과
```
버그 수정
├── 빈 배열 처리 → 런타임 안정성 ↑
├── 논리 오류 → 코드 명확성 ↑
└── 타입 안전성 → 예측 가능성 ↑

기능 향상
├── 다중 boxShadow 지원 → 디자인 자유도 ↑
└── 토큰 리셋 자동 저장 → UX 개선

코드 품질
├── spacing 토큰 제거 → 코드 정리
├── 정규표현식 상수화 → 성능 개선
└── 명시적 타입 체크 → 유지보수성 ↑
```

### 🎨 Priority 4: 고급 디자인 기능 완료 (2025-12-13)

#### 4.1 텍스트 편집 고도화 (리치 텍스트)
- ✅ Font Style (Normal/Italic)
- ✅ Text Decoration (Underline/Line-through)
- ✅ Text Transform (Uppercase/Lowercase/Capitalize)
- ✅ Letter Spacing (자간 조정)
- ✅ Line Height (줄 간격 조정)
- ✅ Text Align Justify (양쪽 정렬)
- ✅ 모든 텍스트 속성 통합 편집

#### 4.2 도형 라이브러리 확장
- ✅ 새로운 도형 5개 추가
  - ⭐ 별 (Star)
  - 🔷 다이아몬드 (Diamond)
  - ⬠ 오각형 (Pentagon)
  - ⬡ 육각형 (Hexagon)
  - ⬢ 팔각형 (Octagon)
- ✅ 수학적 다각형 생성 알고리즘
- ✅ 도형별 최적화된 렌더링
- ✅ 레이어 패널 아이콘 자동 업데이트

#### 4.4 디자인 토큰 시스템
- ✅ **타이포그래피 토큰** (9개)
  - H1-H6 (헤딩 6단계)
  - Body, Body Small, Caption
  - fontSize, fontWeight, lineHeight, letterSpacing 통합 관리
- ✅ **색상 토큰** (10개)
  - Primary, Secondary, Accent
  - Neutral (Text, Text Secondary, Background)
  - Semantic (Success, Error, Warning)
  - 카테고리별 그룹화
- ✅ **그림자 토큰** (4개)
  - Small, Medium, Large, Extra Large
  - Tailwind CSS 기반 그림자
  - **다중 shadow 지원** (복합 그림자 효과)
- ✅ **모서리 토큰** (5개)
  - None ~ Full (9999px)
  - 사각형 도형에 적용
- ✅ 클릭으로 토큰 즉시 적용
- ✅ 요소 타입별 자동 필터링
- ✅ 토큰 초기화 기능 (자동 저장)

### 🎨 Priority 3: 생산성 향상 완료 (2025-12-13)

#### 3.1 색상 팔레트 관리
- ✅ 재사용 가능한 색상 팔레트 시스템
- ✅ 색상 추가/삭제/편집
- ✅ 색상 이름 지정
- ✅ 선택된 요소에 클릭으로 색상 적용
- ✅ 8개 기본 색상 제공
- ✅ 팔레트 초기화 기능

#### 3.2 요소 잠금 & 숨김 개선
- ✅ 키보드 단축키 지원 (Ctrl+H: 숨김/표시, Ctrl+L: 잠금/해제)
- ✅ 숨겨진 요소는 캔버스에서 보이지 않음
- ✅ 잠긴 요소는 선택/드래그 불가능
- ✅ 박스 선택에서 잠금/숨김 요소 자동 제외
- ✅ 시각적 피드백 개선 (레이어 패널)

#### 3.3 실행 취소 개선
- ✅ 히스토리 패널에 작업 이름 표시
- ✅ "도형 추가", "요소 삭제" 등 구체적인 액션 이름
- ✅ 요소 개수와 함께 표시
- ✅ 모든 주요 액션에 작업 이름 적용

#### 3.4 이미지 업로드 개선
- ✅ 캔버스에 드래그 앤 드롭으로 이미지 추가
- ✅ 여러 이미지 한 번에 드롭 가능
- ✅ 드롭 위치에 자동 배치 (오프셋)
- ✅ 드래그 오버 시각적 피드백

### 🚀 Priority 2: 핵심 UX 개선 완료 (2025-12-12)

#### 2.1 스마트 가이드라인 & 정렬 보조선
- ✅ 요소 드래그 시 다른 요소와 정렬 감지
- ✅ 캔버스 중앙 정렬 감지
- ✅ Figma 스타일 빨간 가이드라인 표시
- ✅ 자동 스냅 기능 (8px 임계값)
- ✅ 같은 간격 자동 감지
- ✅ 좌/중/우, 상/중/하 정렬 지원

#### 2.2 박스 선택 (Rectangle Selection)
- ✅ 마우스 드래그로 여러 요소 한 번에 선택
- ✅ Shift+드래그로 기존 선택에 추가
- ✅ 파란색 선택 박스 표시
- ✅ 겹치는 모든 요소 자동 선택
- ✅ 숨김/잠금 요소 제외

#### 2.3 실시간 반응형 프리뷰
- ✅ 캔버스 상단 플로팅 브레이크포인트 전환기
- ✅ 현재 브레이크포인트 정보 표시
- ✅ 부드러운 애니메이션 전환 (0.3s)
- ✅ Desktop/Tablet/Mobile 빠른 전환
- ✅ 캔버스 크기 실시간 변경

#### 2.4 컴포넌트 드래그 앤 드롭 개선
- ✅ 컴포넌트 썸네일 미리보기
- ✅ SVG 기반 실시간 렌더링
- ✅ 드래그 앤 드롭으로 즉시 추가
- ✅ 모든 요소 타입 지원 (도형/텍스트/선)

### 🎉 Phase 15: 스타일 시스템 완성 (2025-12-12)

#### 15.1 CSS 클래스 시스템
- ✅ 재사용 가능한 CSS 클래스 생성 및 관리
- ✅ 요소에 클래스 적용/제거
- ✅ 클래스 편집/복제/삭제
- ✅ 반응형 클래스 지원
- ✅ HTML 내보내기 시 CSS 클래스 포함

#### 15.2 키프레임 애니메이션 시스템
- ✅ @keyframes 애니메이션 생성
- ✅ 다중 키프레임 지원 (0%, 50%, 100% 등)
- ✅ 애니메이션 속성 (duration, delay, timing, iteration)
- ✅ 요소에 애니메이션 적용
- ✅ 애니메이션 미리보기
- ✅ HTML 내보내기 시 @keyframes 포함

#### 15.3 커스텀 브레이크포인트
- ✅ 사용자 정의 브레이크포인트 추가
- ✅ 브레이크포인트 이름, 너비, 아이콘 커스터마이징
- ✅ 순서 변경 (드래그 앤 드롭)
- ✅ 기본 브레이크포인트 재설정
- ✅ 반응형 CSS 생성 시 커스텀 브레이크포인트 반영

### 🎨 Priority 0: 기본 UX 개선 (2025-12-12)

#### 캔버스 줌 & 팬 컨트롤
- ✅ Ctrl + 마우스 휠로 줌 인/아웃
- ✅ Space + 드래그로 캔버스 이동
- ✅ 키보드 단축키 (Ctrl+0: 리셋, Ctrl+=/- : 줌)
- ✅ 플로팅 줌 컨트롤 UI (우측 하단)
- ✅ 줌 비율 표시 (10% ~ 500%)

#### 그리드 & 스냅 시스템
- ✅ 그리드 토글 (Ctrl+')
- ✅ 그리드 크기 조절 (5-100px)
- ✅ 스냅 투 그리드 토글
- ✅ 시각적 그리드 표시

#### 키보드 단축키 치트시트
- ✅ Ctrl+K 또는 ? 키로 모달 열기
- ✅ 6개 카테고리 (일반, 편집, 선택, 도형 도구, 캔버스, 정렬)
- ✅ Mac/Windows 호환 (⌘/Ctrl 자동 전환)
- ✅ 모든 단축키 실제 작동 검증

#### 레이어 검색
- ✅ Ctrl+F로 검색창 포커스
- ✅ 요소 타입, 텍스트 내용, ID로 검색
- ✅ 실시간 필터링
- ✅ 검색 결과 개수 표시

### 🔧 Priority 1: 고급 UX 개선 (2025-12-12)

#### 요소 복제 개선
- ✅ Ctrl+D: 선택된 요소를 20px 오프셋으로 즉시 복제
- ✅ Alt+드래그: 드래그하면서 요소 복제
- ✅ 다중 선택 지원
- ✅ Line/Arrow 타입 지원

#### 멀티 선택 개선
- ✅ Shift+클릭: 마지막 클릭부터 현재 클릭까지 범위 선택
- ✅ 레이어 패널에서 작동
- ✅ zIndex 순서 기준 범위 선택

#### 히스토리 패널
- ✅ 과거/현재/미래 상태를 시각적 타임라인으로 표시
- ✅ 클릭하여 특정 히스토리 상태로 바로 이동
- ✅ 현재 상태 강조 표시
- ✅ 타임스탬프 표시 ("5분 전", "방금 전")
- ✅ 각 상태의 요소 개수 변화 표시
- ✅ Undo/Redo 버튼 통합

### 📦 HTML 내보내기 개선 (2025-12-12)

#### CSS 클래스 기반 코드 생성
- ✅ 인라인 스타일 최소화
- ✅ 이미지 태그 스타일 → CSS 클래스로 이동
- ✅ SVG 오버레이 스타일 → CSS 클래스로 이동
- ✅ 페이지 컨테이너 스타일 → CSS 클래스로 이동
- ✅ 깨끗하고 유지보수 가능한 HTML 생성

**Before:**
```html
<img src="..." style="width: 100%; height: 100%; object-fit: cover; display: block;" />
<svg style="position: absolute; top: 0; left: 0; width: 1000px; ...">
<div style="display: block;">
```

**After:**
```html
<img src="..." />
<svg class="lines-arrows-overlay">
<div class="page-active">
```

### 💾 오토세이브 개선 (2025-12-12)

#### 이중 자동 저장 시스템
- ✅ **변경 감지 자동 저장**: 2초 디바운스 (기존 유지)
- ✅ **주기적 자동 저장**: 30초마다 자동 저장 (신규)
- ✅ 자동 저장 활성화/비활성화 토글
- ✅ 마지막 자동 저장 시간 표시
- ✅ 헤더에 실시간 상태 표시
  - 활성화: "5초 전 저장됨" (초록색)
  - 비활성화: "자동 저장 꺼짐" (회색)

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

# 빌드
npm run build
```

### 기본 사용법

#### 1. 도형 그리기
```
1. 좌측 도구바에서 사각형/원/삼각형 클릭 (또는 R/O 키)
2. 캔버스에서 드래그하여 도형 그리기
3. Shift: 정사각형/정원
4. Alt: 중심에서 그리기
```

#### 2. 캔버스 네비게이션
```
줌 인/아웃:
- Ctrl + 마우스 휠
- Ctrl + (줌 인)
- Ctrl - (줌 아웃)
- Ctrl 0 (리셋)

캔버스 이동:
- Space + 마우스 드래그

그리드:
- Ctrl + ' (그리드 토글)
- 우측 하단 그리드 아이콘 클릭
```

#### 3. 요소 복제
```
방법 1: Ctrl+D
- 요소 선택 후 Ctrl+D
- 20px 오프셋으로 복제됨

방법 2: Alt+드래그
- 요소 선택
- Alt 키를 누른 상태로 드래그
- 드래그하면서 복제됨
```

#### 4. 멀티 선택
```
Ctrl/Cmd + 클릭: 개별 추가
Shift + 클릭: 범위 선택 (레이어 패널)
Ctrl + A: 전체 선택
```

#### 5. 히스토리 탐색
```
1. 우측 사이드바 > "히스토리" 탭
2. 타임라인에서 원하는 상태 클릭
3. 또는 Ctrl+Z (Undo), Ctrl+Shift+Z (Redo)
```

#### 6. 키보드 단축키 확인
```
Ctrl + K 또는 ? 키
→ 전체 단축키 치트시트 표시
```

### 키보드 단축키

#### 일반
| 단축키 | 기능 |
|--------|------|
| **Ctrl/Cmd + S** | 프로젝트 저장 |
| **Ctrl/Cmd + K** | 단축키 보기 |
| **?** | 단축키 보기 |

#### 편집
| 단축키 | 기능 |
|--------|------|
| **Ctrl/Cmd + Z** | 실행 취소 |
| **Ctrl/Cmd + Shift + Z** | 다시 실행 |
| **Ctrl/Cmd + D** | 복제 |
| **Delete / Backspace** | 삭제 |
| **Escape** | 선택 해제 |

#### 선택
| 단축키 | 기능 |
|--------|------|
| **V** | 선택 도구 |
| **Ctrl/Cmd + A** | 전체 선택 |
| **Ctrl/Cmd + Click** | 다중 선택 추가 |
| **Shift + Click** | 범위 선택 (레이어) |

#### 도형 도구
| 단축키 | 기능 |
|--------|------|
| **R** | 사각형 |
| **O** | 원 |
| **L** | 직선 |
| **T** | 텍스트 |
| **I** | 이미지 |

#### 캔버스
| 단축키 | 기능 |
|--------|------|
| **Ctrl/Cmd + +** | 줌 인 |
| **Ctrl/Cmd + -** | 줌 아웃 |
| **Ctrl/Cmd + 0** | 줌 리셋 |
| **Ctrl/Cmd + Wheel** | 줌 |
| **Space + Drag** | 캔버스 이동 |
| **Ctrl/Cmd + '** | 그리드 토글 |

#### 정렬
| 단축키 | 기능 |
|--------|------|
| **Ctrl/Cmd + G** | 그룹화 |
| **Ctrl/Cmd + Shift + G** | 그룹 해제 |
| **Ctrl/Cmd + [** | 뒤로 보내기 |
| **Ctrl/Cmd + ]** | 앞으로 가져오기 |

#### 레이어 패널
| 단축키 | 기능 |
|--------|------|
| **Ctrl/Cmd + F** | 레이어 검색 |
| **Ctrl/Cmd + H** | 선택 항목 숨김/표시 |
| **Ctrl/Cmd + L** | 선택 항목 잠금/해제 |

---

## 주요 기능

### 🎨 Figma 스타일 편집

```
Canvas 기반 자유 배치
├── 드래그 앤 드롭으로 요소 이동
├── 8방향 핸들로 크기 조절
├── 회전 핸들로 자유 회전
├── 실시간 미리보기
├── 캔버스 줌 & 팬
└── 그리드 & 스냅

다중 선택 및 편집
├── Ctrl/Cmd + 클릭으로 다중 선택
├── Shift + 클릭으로 범위 선택
├── 공통 속성 일괄 편집
└── 정렬/분포 도구

레이어 시스템
├── zIndex 기반 순서 관리
├── 드래그 앤 드롭 순서 변경
├── 표시/숨김, 잠금/해제
├── 레이어 그룹화
└── 레이어 검색 (Ctrl+F)

히스토리 관리
├── 50단계 Undo/Redo
├── 히스토리 패널 (시각적 타임라인)
├── 특정 상태로 바로 점프
└── 타임스탬프 표시
```

### 🎨 고급 디자인 기능

```
CSS 클래스 시스템
├── 재사용 가능한 스타일 클래스
├── 클래스 생성/편집/삭제
├── 요소에 다중 클래스 적용
└── 반응형 클래스 지원

키프레임 애니메이션
├── @keyframes 애니메이션 정의
├── 다중 키프레임 (0%, 50%, 100%)
├── 애니메이션 속성 설정
├── 요소에 애니메이션 적용
└── 실시간 미리보기

반응형 디자인
├── 3개 기본 브레이크포인트 (Desktop/Tablet/Mobile)
├── 커스텀 브레이크포인트 추가
├── 브레이크포인트별 속성 오버라이드
└── 반응형 CSS 미디어 쿼리 생성

컴포넌트 시스템
├── 재사용 가능한 컴포넌트 생성
├── 마스터-인스턴스 동기화
├── 인스턴스별 오버라이드
└── 컴포넌트 라이브러리
```

### 📄 다중 페이지 관리

```
페이지 생성 및 관리
├── 무제한 페이지 생성
├── 페이지별 독립적인 캔버스
├── 인라인 이름 편집
└── SEO 설정 (title, description, keywords)

페이지 전환
├── 페이지 패널에서 클릭
├── 히스토리 초기화
└── 빠른 전환

인터랙션 시스템
├── 내부 페이지 이동
├── 외부 링크 (새 탭/현재 탭)
├── 앵커 스크롤
└── 이메일/전화 링크
```

### 💾 프로젝트 저장

```
이중 자동 저장 시스템
├── 변경 감지 자동 저장 (2초 디바운스)
├── 주기적 자동 저장 (30초 간격)
├── 자동 저장 ON/OFF 토글
└── 마지막 저장 시간 표시

LocalStorage 기반
├── 빠른 로딩
├── 오프라인 작업 가능
├── 상태 해시 비교 (불필요한 저장 방지)
└── 저장 시간 표시

다중 프로젝트 관리
├── 프로젝트 목록 표시
├── 프로젝트 전환
├── 프로젝트 삭제
└── 마지막 프로젝트 자동 로드

Import/Export
├── JSON 파일 내보내기
├── JSON 파일 가져오기
├── 프로젝트 복제
└── 타임스탬프 파일명
```

### 🚀 HTML 내보내기 (개선됨)

```
깨끗한 CSS 클래스 기반 코드
├── 인라인 스타일 최소화
├── 재사용 가능한 CSS 클래스
├── 유지보수 용이한 코드
└── 성능 최적화

Canvas → HTML/CSS 변환
├── 도형 → <div> with border-radius
├── 삼각형 → inline SVG
├── 텍스트 → <div> with typography
├── 이미지 → <img> in container
├── 선/화살표 → SVG overlay
└── 그룹 → wrapper <div>

완전한 HTML 문서
├── DOCTYPE 및 meta 태그
├── SEO 최적화 (title, description, keywords)
├── Open Graph & Twitter Card
├── Google Fonts 자동 로드
├── 반응형 CSS (@media queries)
├── CSS 클래스 정의
├── @keyframes 애니메이션
└── 자체 완결형 단일 파일

미리보기
├── 실시간 iframe 렌더링
├── 반응형 뷰포트 전환
│   ├── 데스크톱 (1440×900)
│   ├── 태블릿 (768×1024)
│   └── 모바일 (375×667)
├── 자동 스케일 조정
└── ESC 키로 닫기
```

---

## 프로젝트 구조

### 전체 구조

```
src/
├── components/
│   ├── Layout.tsx                      ✅ 메인 레이아웃
│   ├── LeftSidebar.tsx                 ✅ 좌측 사이드바 (페이지 + 레이어)
│   ├── Toolbar.tsx                     ✅ 도구바 (Priority 4.2: 도형 확장)
│   ├── FloatingToolbar.tsx             ✅ 플로팅 툴바 (Figma 스타일)
│   ├── ZoomControl.tsx                 ✅ 줌 & 그리드 컨트롤 (우측 하단)
│   ├── Sidebar.tsx                     ✅ 우측 사이드바
│   ├── PropertiesPanel.tsx             ✅ 속성 패널
│   ├── AlignmentTools.tsx              ✅ 정렬 도구
│   ├── KeyboardShortcutsModal.tsx      ✅ 키보드 단축키 모달
│   ├── LayerPanel/                     ✅ 레이어 패널 (검색 기능)
│   │   ├── index.tsx
│   │   ├── LayerItem.tsx
│   │   └── LayerControls.tsx
│   ├── PagePanel/                      ✅ 페이지 패널
│   │   ├── index.tsx
│   │   └── PageItem.tsx
│   ├── ComponentPanel/                 ✅ 컴포넌트 패널
│   ├── ColorPalettePanel.tsx           ✅ 색상 팔레트 패널 (Priority 3.1)
│   ├── DesignTokensPanel.tsx           ✅ 디자인 토큰 패널 (Priority 4.4)
│   ├── ClassPanel.tsx                  ✅ CSS 클래스 패널
│   ├── KeyframePanel.tsx               ✅ 키프레임 애니메이션 패널
│   ├── BreakpointManager.tsx           ✅ 커스텀 브레이크포인트 관리
│   ├── HistoryPanel.tsx                ✅ 히스토리 패널
│   ├── ProjectMenu.tsx                 ✅ 프로젝트 메뉴
│   ├── NewProjectDialog.tsx            ✅ 새 프로젝트 다이얼로그
│   ├── PreviewModal.tsx                ✅ 미리보기 모달
│   └── ViewportSwitcher.tsx            ✅ 반응형 뷰포트 전환
│
├── Canvas/
│   ├── index.tsx                       ✅ 메인 캔버스
│   ├── ShapeRenderer.tsx               ✅ 도형 렌더링 (Priority 4.2: 다각형)
│   ├── LineRenderer.tsx                ✅ 선 렌더링
│   ├── FreeTextRenderer.tsx            ✅ 텍스트 렌더링 (Priority 4.1: 리치 텍스트)
│   ├── FreeImageRenderer.tsx           ✅ 이미지 렌더링
│   ├── GroupRenderer.tsx               ✅ 그룹 렌더링
│   ├── ComponentInstanceRenderer.tsx   ✅ 컴포넌트 인스턴스 렌더링
│   ├── TextEditor.tsx                  ✅ 텍스트 편집기
│   └── SelectionBox.tsx                ✅ 선택 박스
│
├── hooks/
│   ├── useShapeDrawing.ts              ✅ 도형 그리기
│   ├── useLineDrawing.ts               ✅ 선 그리기
│   ├── useTextEditing.ts               ✅ 텍스트 편집
│   ├── useImageUpload.ts               ✅ 이미지 업로드
│   ├── useDragElement.ts               ✅ 요소 드래그 (Alt+드래그 복제)
│   ├── useKeyboardShortcuts.ts         ✅ 키보드 단축키
│   ├── useAutoSave.ts                  ✅ 이중 자동 저장
│   └── useCanvasZoom.ts                ✅ 캔버스 줌 & 팬
│
├── store/
│   └── builderStore.ts                 ✅ Zustand 스토어
│
├── types/
│   └── index.ts                        ✅ TypeScript 타입 정의
│
├── utils/
│   ├── shapeUtils.ts                   ✅ 도형 유틸리티
│   ├── lineUtils.ts                    ✅ 선 유틸리티
│   ├── imageUtils.ts                   ✅ 이미지 유틸리티
│   ├── alignUtils.ts                   ✅ 정렬 유틸리티
│   ├── groupUtils.ts                   ✅ 그룹 유틸리티
│   ├── shadowUtils.ts                  ✅ 그림자 유틸리티 (다중 shadow 파싱)
│   ├── storageUtils.ts                 ✅ LocalStorage CRUD
│   ├── cssGenerator.ts                 ✅ CSS 생성
│   ├── htmlTemplate.ts                 ✅ HTML 템플릿
│   ├── htmlExport.ts                   ✅ HTML 내보내기 (개선)
│   ├── responsiveCssGenerator.ts       ✅ 반응형 CSS 생성
│   ├── classCssGenerator.ts            ✅ CSS 클래스 생성
│   ├── layoutCalculator.ts             ✅ 레이아웃 계산
│   └── layoutCssGenerator.ts           ✅ 레이아웃 CSS 생성
│
├── main.tsx                            ✅ React 진입점
├── App.tsx                             ✅ 앱 루트
└── index.css                           ✅ 전역 스타일
```

---

## 개발 로드맵

### 📊 완료된 Phase

#### Phase 0-15: 핵심 기능 완성
- **Phase 0-8**: 기본 디자인 툴
- **Phase 9-11**: 웹사이트 제작 기능
- **Phase 12**: 컴포넌트 시스템
- **Phase 13**: 인터랙션 시스템
- **Phase 14**: 반응형 디자인
- **Phase 15**: CSS 클래스 & 키프레임 & 커스텀 브레이크포인트

#### Priority 0-4: UX 개선
- **Priority 0**: 기본 UX (줌/팬, 그리드, 단축키, 검색)
- **Priority 1**: 고급 UX (복제, 멀티 선택, 히스토리)
- **Priority 2**: 핵심 UX (스마트 가이드, 박스 선택, 반응형 프리뷰)
- **Priority 3**: 생산성 향상 (색상 팔레트, 잠금/숨김, 실행 취소, 드래그 앤 드롭)
- **Priority 4**: 고급 디자인 (리치 텍스트, 도형 확장, 디자인 토큰)

#### 추가 개선
- **HTML 내보내기**: CSS 클래스 기반 코드 생성
- **오토세이브**: 이중 자동 저장 시스템

**총 개발 기간: 약 4-5주**

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
└── Zustand              # 전역 상태

그래픽 및 디자인
├── SVG                  # 벡터 그래픽
├── foreignObject        # 텍스트/이미지 렌더링
└── contentEditable      # 텍스트 편집

파일 처리
├── FileReader API       # 파일 읽기
├── Data URL             # 이미지 인코딩
└── LocalStorage         # 프로젝트 저장

HTML 생성
├── Template Literal     # HTML 문자열 생성
├── CSS-in-JS            # 스타일 객체
└── Google Fonts API     # 웹폰트 로드
```

### 빌드 결과

```
✓ 1465 modules transformed
✓ built in 1.81s

- index.html: 0.46 kB (gzip: 0.33 kB)
- CSS: 31.92 kB (gzip: 5.87 kB)
- JS: 431.56 kB (gzip: 112.68 kB)
```

**변경사항 (개선 작업 후)**:
- 모듈: 1464 → 1465 (+1, shadowUtils.ts 추가)
- JS: 428.39 kB → 431.56 kB (+3.17 kB, +0.74%)
- gzip: 111.67 kB → 112.68 kB (+1.01 kB, +0.90%)

**분석**: 다중 shadow 지원 및 타입 안전성 개선으로 인한 최소한의 증가 - 매우 합리적 ✅

---

## 향후 계획

### 🚀 Priority 5: 템플릿 & 내보내기 (다음 단계)

1. **템플릿 시스템** ⭐⭐⭐⭐
2. **아트보드 시스템** ⭐⭐⭐⭐
3. **내보내기 확장** (React/Vue 컴포넌트) ⭐⭐⭐
4. **키보드 단축키 확장** ⭐⭐

### 💡 Priority 6: 협업 & 공유

1. **프로젝트 공유 기능** ⭐⭐⭐
2. **버전 관리** ⭐⭐
3. **협업 기능** ⭐⭐
4. **클라우드 저장소 연동** ⭐⭐

---

## 문제 해결

### 자주 발생하는 문제

#### Q1: 빌드가 실패해요
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install

# 타입 체크
npx tsc --noEmit

# 빌드
npm run build
```

#### Q2: 자동 저장이 동작하지 않아요
```bash
# 1. 헤더에서 자동 저장 상태 확인 (초록색 = 활성화)
# 2. 클릭하여 자동 저장 ON/OFF 가능
# 3. 콘솔에서 "Auto-saved project" 메시지 확인
```

#### Q3: 키보드 단축키를 잊어버렸어요
```bash
# Ctrl+K 또는 ? 키를 눌러 단축키 치트시트 확인
```

#### Q4: 캔버스를 확대/이동하고 싶어요
```bash
# 줌: Ctrl + 마우스 휠
# 팬: Space + 드래그
# 리셋: Ctrl + 0
# 그리드: Ctrl + '
```

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

**Let's build something amazing! 🚀**

*최종 업데이트: 2025년 12월 13일 (Phase 15 + Priority 4 + 전체 개선 완료)*
