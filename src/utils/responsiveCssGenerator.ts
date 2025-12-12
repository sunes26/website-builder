import type { CanvasElement, Breakpoint, CustomBreakpoint, KeyframeAnimation } from '../types';
import {
  generateBaseStyles,
  generateShapeStyles,
  generateTextStyles,
  generateImageStyles,
  stylesToString,
} from './cssGenerator';
import { generateAnimationCSS } from './classCssGenerator';

/**
 * Responsive CSS Generator (Phase 14, Phase 15.3 확장)
 *
 * Generates CSS rules with media queries for responsive design
 * Phase 15.3: 커스텀 브레이크포인트 지원
 */

/**
 * 요소의 반응형 CSS 규칙 생성 (Phase 15 확장: 레이아웃 자식 지원, Phase 15.2: 애니메이션 지원)
 * 데스크톱 (기본) + 태블릿/모바일 미디어 쿼리
 */
export function generateResponsiveCSSRules(
  element: CanvasElement,
  className: string,
  allElements: CanvasElement[],
  keyframeAnimations: KeyframeAnimation[] = []
): string {
  const rules: string[] = [];
  const isLayoutChild = isElementLayoutChild(element, allElements);

  // 1. 데스크톱 (기본 스타일)
  const desktopStyles = generateElementStyles(element, isLayoutChild);
  const desktopCSS = stylesToString(desktopStyles);
  rules.push(`.${className} {\n  ${desktopCSS.replace(/;/g, ';\n  ')}\n}`);

  // Phase 15.2: 키프레임 애니메이션 적용
  if (element.animationName) {
    const animation = keyframeAnimations.find(anim => anim.id === element.animationName);
    if (animation) {
      const animationCSS = generateAnimationCSS(animation);
      rules.push(`.${className} {\n  ${animationCSS}\n}`);
    }
  }

  // 2. 태블릿 오버라이드
  if (element.responsiveOverrides?.tablet) {
    const tabletElement = { ...element, ...element.responsiveOverrides.tablet } as CanvasElement;
    const tabletStyles = generateElementStyles(tabletElement, isLayoutChild);
    const tabletCSS = stylesToString(tabletStyles);

    rules.push(
      `@media (max-width: 1023px) {\n  .${className} {\n    ${tabletCSS.replace(/;/g, ';\n    ')}\n  }\n}`
    );
  }

  // 3. 모바일 오버라이드
  if (element.responsiveOverrides?.mobile) {
    // 모바일은 태블릿 오버라이드도 상속
    let mobileElement: CanvasElement = { ...element };
    if (element.responsiveOverrides.tablet) {
      mobileElement = { ...mobileElement, ...element.responsiveOverrides.tablet } as CanvasElement;
    }
    mobileElement = { ...mobileElement, ...element.responsiveOverrides.mobile } as CanvasElement;

    const mobileStyles = generateElementStyles(mobileElement, isLayoutChild);
    const mobileCSS = stylesToString(mobileStyles);

    rules.push(
      `@media (max-width: 767px) {\n  .${className} {\n    ${mobileCSS.replace(/;/g, ';\n    ')}\n  }\n}`
    );
  }

  return rules.join('\n\n');
}

/**
 * 요소 타입에 따른 CSS 스타일 생성 (Phase 15 확장)
 */
function generateElementStyles(
  element: CanvasElement,
  isLayoutChild: boolean = false
): React.CSSProperties {
  switch (element.type) {
    case 'shape':
      return generateShapeStyles(element, isLayoutChild);
    case 'text':
      return generateTextStyles(element, isLayoutChild);
    case 'image':
      return generateImageStyles(element, isLayoutChild);
    case 'group':
    case 'component':
      return generateBaseStyles(element, isLayoutChild);
    default:
      return generateBaseStyles(element, isLayoutChild);
  }
}

/**
 * 요소가 레이아웃 컨테이너의 자식인지 확인 (Phase 15)
 */
function isElementLayoutChild(
  element: CanvasElement,
  allElements: CanvasElement[]
): boolean {
  // 부모 컨테이너 찾기
  const parent = allElements.find((el) => {
    if (el.type === 'group' || el.type === 'component') {
      return el.childElementIds?.includes(element.id);
    }
    return false;
  });

  // 부모가 레이아웃 컨테이너인지 확인
  return !!(parent && parent.layout);
}

/**
 * 모든 페이지 요소들의 반응형 CSS 생성 (Phase 15.2 & 15.3 확장: 애니메이션 & 커스텀 브레이크포인트 지원)
 */
export function generateAllResponsiveCSS(
  elements: CanvasElement[],
  customBreakpoints: CustomBreakpoint[] = [],
  keyframeAnimations: KeyframeAnimation[] = []
): string {
  const cssRules: string[] = [];

  elements.forEach((element) => {
    // Line과 Arrow는 SVG로 렌더링되므로 제외
    if (element.type === 'line' || element.type === 'arrow') {
      return;
    }

    const className = `element-${element.id}`;
    const css = generateResponsiveCSSRules(element, className, elements, keyframeAnimations);
    cssRules.push(css);
  });

  // 커스텀 브레이크포인트용 CSS 생성 (Phase 15.3)
  if (customBreakpoints.length > 0) {
    const customBreakpointCSS = generateCustomBreakpointCSS(elements, customBreakpoints);
    if (customBreakpointCSS) {
      cssRules.push('\n/* 커스텀 브레이크포인트 (Phase 15.3) */');
      cssRules.push(customBreakpointCSS);
    }
  }

  return cssRules.join('\n\n');
}

/**
 * 특정 브레이크포인트의 모든 요소 CSS 생성 (미디어 쿼리 없음) (Phase 15 확장)
 */
export function generateBreakpointCSS(
  elements: CanvasElement[],
  breakpoint: Breakpoint
): string {
  const cssRules: string[] = [];

  elements.forEach((element) => {
    // Line과 Arrow는 SVG로 렌더링되므로 제외
    if (element.type === 'line' || element.type === 'arrow') {
      return;
    }

    // 브레이크포인트 해결
    let resolvedElement: CanvasElement = { ...element };

    if (breakpoint === 'tablet' && element.responsiveOverrides?.tablet) {
      resolvedElement = { ...resolvedElement, ...element.responsiveOverrides.tablet } as CanvasElement;
    } else if (breakpoint === 'mobile') {
      if (element.responsiveOverrides?.tablet) {
        resolvedElement = { ...resolvedElement, ...element.responsiveOverrides.tablet } as CanvasElement;
      }
      if (element.responsiveOverrides?.mobile) {
        resolvedElement = { ...resolvedElement, ...element.responsiveOverrides.mobile } as CanvasElement;
      }
    }

    const isLayoutChild = isElementLayoutChild(element, elements);
    const className = `element-${element.id}`;
    const styles = generateElementStyles(resolvedElement, isLayoutChild);
    const css = stylesToString(styles);

    cssRules.push(`.${className} {\n  ${css.replace(/;/g, ';\n  ')}\n}`);
  });

  return cssRules.join('\n\n');
}

/**
 * 커스텀 브레이크포인트용 CSS 생성 (Phase 15.3)
 *
 * 커스텀 브레이크포인트는 현재 요소의 데스크톱 스타일을 기준으로 미디어 쿼리를 생성
 * (향후 확장: 요소별 커스텀 브레이크포인트 오버라이드 지원 가능)
 */
function generateCustomBreakpointCSS(
  elements: CanvasElement[],
  customBreakpoints: CustomBreakpoint[]
): string {
  const rules: string[] = [];

  // 브레이크포인트를 order 순으로 정렬
  const sortedBreakpoints = [...customBreakpoints].sort((a, b) => a.order - b.order);

  sortedBreakpoints.forEach((breakpoint) => {
    // 미디어 쿼리 생성
    const mediaQuery = generateMediaQuery(breakpoint);

    // 각 요소에 대한 스타일 (현재는 데스크톱 스타일과 동일)
    // 향후 확장: 요소에 customBreakpointOverrides 속성 추가하여 커스텀 스타일 지원
    const breakpointRules: string[] = [];

    elements.forEach((element) => {
      if (element.type === 'line' || element.type === 'arrow') {
        return;
      }

      // 현재는 데스크톱 스타일을 그대로 사용
      // 향후: element.customBreakpointOverrides?[breakpoint.id] 확인하여
      // 커스텀 브레이크포인트별 스타일 오버라이드 지원
      // const className = `element-${element.id}`;
      // 커스텀 브레이크포인트에 대한 특별한 스타일이 없으면 스킵
      // (기본 데스크톱 스타일이 이미 적용되어 있음)
    });

    // 현재는 커스텀 브레이크포인트에 대한 특별한 스타일이 없으므로
    // 미디어 쿼리만 생성하고 실제 스타일은 추후 확장 예정
    if (breakpointRules.length > 0) {
      rules.push(`${mediaQuery} {\n${breakpointRules.join('\n\n')}\n}`);
    }
  });

  return rules.join('\n\n');
}

/**
 * CustomBreakpoint로부터 미디어 쿼리 문자열 생성
 */
function generateMediaQuery(breakpoint: CustomBreakpoint): string {
  if (breakpoint.maxWidth !== undefined) {
    return `@media (min-width: ${breakpoint.minWidth}px) and (max-width: ${breakpoint.maxWidth}px)`;
  } else {
    return `@media (min-width: ${breakpoint.minWidth}px)`;
  }
}
