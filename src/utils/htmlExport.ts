import type {
  CanvasElement,
  Shape,
  TextElement,
  ImageElement,
  LineElement,
  ArrowElement,
  GroupElement,
  Page,
  CSSClass,
  KeyframeAnimation,
} from '../types';
import {
  generateLinePath,
  generateArrowPath,
  generateTriangleSVG,
  extractFontFamilies,
  generateGoogleFontsURL,
} from './cssGenerator';
import { generateHTMLTemplate, generateClassName } from './htmlTemplate';
import { generateAllResponsiveCSS } from './responsiveCssGenerator';
import { generateAllCSSClasses, generateAllKeyframes, getClassNamesString } from './classCssGenerator';

/**
 * HTML Export System for Phase 11: Preview & HTML Export
 *
 * Converts canvas elements to HTML/CSS for preview and download
 */

/**
 * 인터랙션 데이터 속성 생성 (Phase 13)
 */
function generateInteractionDataAttributes(element: CanvasElement): string {
  const attributes: string[] = [];

  // 인터랙션 데이터 직렬화
  if (element.interactions && element.interactions.length > 0) {
    const enabledInteractions = element.interactions.filter((i) => i.enabled);
    if (enabledInteractions.length > 0) {
      const interactionsJSON = JSON.stringify(enabledInteractions);
      // Single quotes for attribute value, escape single quotes in JSON
      const escapedJSON = interactionsJSON.replace(/'/g, '&#39;');
      attributes.push(`data-interactions='${escapedJSON}'`);
    }
  }

  // 앵커 ID 추가
  if (element.anchorId) {
    attributes.push(`data-anchor-id="${escapeHTML(element.anchorId)}"`);
  }

  return attributes.length > 0 ? ' ' + attributes.join(' ') : '';
}

/**
 * 캔버스 요소를 HTML로 변환
 */
export function elementToHTML(
  element: CanvasElement,
  allElements: CanvasElement[],
  cssClasses: CSSClass[] = []
): string {
  if (!element.visible) {
    return ''; // 숨겨진 요소는 렌더링하지 않음
  }

  switch (element.type) {
    case 'shape':
      return shapeToHTML(element, cssClasses);
    case 'text':
      return textToHTML(element, cssClasses);
    case 'image':
      return imageToHTML(element, cssClasses);
    case 'group':
      return groupToHTML(element, allElements, cssClasses);
    case 'line':
    case 'arrow':
      // Lines and arrows are handled separately in SVG overlay
      return '';
    default:
      return '';
  }
}

/**
 * Shape 요소를 HTML로 변환 (Phase 14: CSS 클래스 기반, Phase 15: CSS 클래스 적용)
 */
function shapeToHTML(shape: Shape, cssClasses: CSSClass[] = []): string {
  const className = generateClassName(shape.id);
  const dataAttrs = generateInteractionDataAttributes(shape);

  // Phase 15: 요소에 적용된 CSS 클래스 추가
  const customClasses = getClassNamesString(shape.classNames, cssClasses);
  const allClasses = customClasses
    ? `canvas-element ${className} ${customClasses}`
    : `canvas-element ${className}`;

  // Triangle uses inline SVG
  if (shape.shapeType === 'triangle') {
    const svg = generateTriangleSVG(shape);
    return `<div class="${allClasses}"${dataAttrs}>${svg}</div>`;
  }

  // Rectangle & Circle use div with border-radius (styles in CSS)
  return `<div class="${allClasses}"${dataAttrs}></div>`;
}

/**
 * Text 요소를 HTML로 변환 (Phase 14: CSS 클래스 기반, Phase 15: CSS 클래스 적용)
 */
function textToHTML(text: TextElement, cssClasses: CSSClass[] = []): string {
  const className = generateClassName(text.id);
  const dataAttrs = generateInteractionDataAttributes(text);

  // Phase 15: 요소에 적용된 CSS 클래스 추가
  const customClasses = getClassNamesString(text.classNames, cssClasses);
  const allClasses = customClasses
    ? `canvas-element ${className} ${customClasses}`
    : `canvas-element ${className}`;

  // Escape HTML in content to prevent XSS
  const safeContent = escapeHTML(text.content);

  return `<div class="${allClasses}"${dataAttrs}>${safeContent}</div>`;
}

/**
 * Image 요소를 HTML로 변환 (Phase 14: CSS 클래스 기반, Phase 15: CSS 클래스 적용)
 */
function imageToHTML(image: ImageElement, cssClasses: CSSClass[] = []): string {
  const className = generateClassName(image.id);
  const dataAttrs = generateInteractionDataAttributes(image);
  const safeAlt = escapeHTML(image.alt);

  // Phase 15: 요소에 적용된 CSS 클래스 추가
  const customClasses = getClassNamesString(image.classNames, cssClasses);
  const allClasses = customClasses
    ? `canvas-element ${className} ${customClasses}`
    : `canvas-element ${className}`;

  // img 태그 스타일은 CSS 클래스로 처리 (.canvas-element img)
  return `<div class="${allClasses}"${dataAttrs}>
  <img src="${image.src}" alt="${safeAlt}" />
</div>`;
}

/**
 * Group 요소를 HTML로 변환 (재귀적으로 자식 렌더링) (Phase 14: CSS 클래스 기반, Phase 15: 레이아웃 확장 & CSS 클래스 적용)
 */
function groupToHTML(group: GroupElement, allElements: CanvasElement[], cssClasses: CSSClass[] = []): string {
  const className = generateClassName(group.id);
  const dataAttrs = generateInteractionDataAttributes(group);

  // Phase 15: 요소에 적용된 CSS 클래스 추가
  const customClasses = getClassNamesString(group.classNames, cssClasses);

  // 자식 요소들 찾기
  const children = group.childElementIds
    .map((childId) => allElements.find((el) => el.id === childId))
    .filter((el): el is CanvasElement => el !== undefined);

  // 자식 요소를 HTML로 변환 (cssClasses 전달)
  const childrenHTML = children
    .map((child) => elementToHTML(child, allElements, cssClasses))
    .join('\n');

  // Phase 15: 레이아웃 컨테이너 클래스 추가
  const layoutClass = group.layout ? 'layout-container' : '';

  const allClasses = customClasses
    ? `canvas-element group-element ${layoutClass} ${className} ${customClasses}`
    : `canvas-element group-element ${layoutClass} ${className}`;

  return `<div class="${allClasses}"${dataAttrs}>
  ${childrenHTML}
</div>`;
}

/**
 * Lines와 Arrows를 SVG 오버레이로 변환
 */
function linesAndArrowsToSVG(elements: CanvasElement[]): string {
  const lines = elements.filter(
    (el): el is LineElement => el.type === 'line' && el.visible
  );
  const arrows = elements.filter(
    (el): el is ArrowElement => el.type === 'arrow' && el.visible
  );

  if (lines.length === 0 && arrows.length === 0) {
    return '';
  }

  // Calculate SVG bounds
  const allPoints: number[] = [];
  [...lines, ...arrows].forEach((el) => {
    allPoints.push(el.startPoint.x, el.startPoint.y, el.endPoint.x, el.endPoint.y);
  });

  const maxX = Math.max(...allPoints.filter((_, i) => i % 2 === 0)) || 1000;
  const maxY = Math.max(...allPoints.filter((_, i) => i % 2 === 1)) || 1000;

  const svgWidth = Math.max(maxX + 100, 1000);
  const svgHeight = Math.max(maxY + 100, 1000);

  // Generate SVG paths
  let pathsHTML = '';

  lines.forEach((line) => {
    const path = generateLinePath(line);
    pathsHTML += `
    <path
      d="${path}"
      stroke="${line.strokeColor}"
      stroke-width="${line.strokeWidth}"
      opacity="${line.opacity}"
      fill="none"
    />`;
  });

  arrows.forEach((arrow) => {
    const { linePath, arrowHeadPath } = generateArrowPath(arrow);
    pathsHTML += `
    <path
      d="${linePath}"
      stroke="${arrow.strokeColor}"
      stroke-width="${arrow.strokeWidth}"
      opacity="${arrow.opacity}"
      fill="none"
    />
    <path
      d="${arrowHeadPath}"
      stroke="${arrow.strokeColor}"
      stroke-width="${arrow.strokeWidth}"
      opacity="${arrow.opacity}"
      fill="none"
      stroke-linejoin="miter"
    />`;
  });

  return `<svg class="lines-arrows-overlay" width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  ${pathsHTML}
</svg>`;
}

/**
 * 페이지 전체를 HTML로 변환
 */
export function pageToHTML(page: Page, cssClasses: CSSClass[] = []): string {
  // Sort elements by zIndex
  const sortedElements = [...page.elements].sort((a, b) => a.zIndex - b.zIndex);

  // Convert regular elements (shapes, text, images, groups)
  const elementsHTML = sortedElements
    .map((element) => elementToHTML(element, page.elements, cssClasses))
    .filter((html) => html.length > 0)
    .join('\n');

  // Add lines and arrows as SVG overlay
  const linesAndArrowsHTML = linesAndArrowsToSVG(sortedElements);

  return `${elementsHTML}
${linesAndArrowsHTML}`;
}

/**
 * 페이지를 완전한 HTML 문서로 내보내기
 */
export function exportPageToHTML(page: Page, cssClasses: CSSClass[] = []): string {
  const bodyHTML = pageToHTML(page, cssClasses);
  const fontFamilies = extractFontFamilies(page.elements);
  const googleFontsURL =
    fontFamilies.length > 0 ? generateGoogleFontsURL(fontFamilies) : undefined;

  return generateHTMLTemplate({
    seoSettings: page.seoSettings,
    googleFontsURL,
    bodyHTML,
  });
}

/**
 * 모든 페이지를 하나의 HTML 문서로 내보내기 (Phase 13: 다중 페이지 지원, Phase 14: 반응형 CSS, Phase 15: CSS 클래스 & 키프레임 & 커스텀 브레이크포인트)
 */
export function exportAllPagesToHTML(
  pages: Page[],
  currentPageId: string,
  cssClasses: CSSClass[] = [],  // Phase 15.1
  keyframeAnimations: KeyframeAnimation[] = [],  // Phase 15.2
  customBreakpoints: import('../types').CustomBreakpoint[] = []  // Phase 15.3
): string {
  // 각 페이지의 HTML 생성
  const pagesHTML = pages.map((page) => {
    const bodyHTML = pageToHTML(page, cssClasses);
    const isActive = page.id === currentPageId;
    const pageClass = isActive ? 'page-container page-active' : 'page-container page-hidden';

    return `
    <div class="${pageClass}" data-page-id="${page.id}">
      ${bodyHTML}
    </div>`;
  }).join('\n');

  // 모든 페이지의 폰트 수집
  const allElements = pages.flatMap(p => p.elements);
  const fontFamilies = extractFontFamilies(allElements);
  const googleFontsURL =
    fontFamilies.length > 0 ? generateGoogleFontsURL(fontFamilies) : undefined;

  // Phase 14 & 15.2 & 15.3: 반응형 CSS 생성 (애니메이션 & 커스텀 브레이크포인트 포함)
  const responsiveCSS = generateAllResponsiveCSS(allElements, customBreakpoints, keyframeAnimations);

  // Phase 15.1: CSS 클래스 CSS 생성
  const cssClassesCSS = generateAllCSSClasses(cssClasses);

  // Phase 15.2: 키프레임 애니메이션 CSS 생성
  const keyframesCSS = generateAllKeyframes(keyframeAnimations);

  // 첫 번째 페이지의 SEO 설정 사용
  const seoSettings = pages[0]?.seoSettings || {
    title: 'Website',
    description: '',
    keywords: [],
  };

  return generateHTMLTemplate({
    seoSettings,
    googleFontsURL,
    bodyHTML: pagesHTML,
    pages: pages.map(p => ({ id: p.id, name: p.name })),
    currentPageId,
    responsiveCSS,  // Phase 14: 반응형 CSS 전달
    cssClassesCSS,  // Phase 15.1: CSS 클래스 전달
    keyframesCSS,  // Phase 15.2: 키프레임 애니메이션 전달
  });
}

/**
 * HTML 파일 다운로드 (다중 페이지 지원, Phase 15: CSS 클래스 & 키프레임 & 커스텀 브레이크포인트)
 */
export function downloadHTMLFile(
  pages: Page[],
  currentPageId: string,
  projectName: string,
  cssClasses: CSSClass[] = [],  // Phase 15.1
  keyframeAnimations: KeyframeAnimation[] = [],  // Phase 15.2
  customBreakpoints: import('../types').CustomBreakpoint[] = []  // Phase 15.3
): void {
  const htmlContent = exportAllPagesToHTML(pages, currentPageId, cssClasses, keyframeAnimations, customBreakpoints);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);

  console.log(`✅ HTML exported: ${projectName}.html (${pages.length} pages)`);
}

/**
 * HTML 이스케이프 (XSS 방지)
 */
function escapeHTML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
