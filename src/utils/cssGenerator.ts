import type {
  CanvasElement,
  Shape,
  TextElement,
  ImageElement,
  LineElement,
  ArrowElement,
} from '../types';
import {
  generateFlexboxCSS,
  generateGridCSS,
  generateFlexChildCSS,
  generateGridChildCSS,
} from './layoutCssGenerator';

/**
 * CSS Generator for Phase 11: Preview & HTML Export
 * Extended for Phase 15: Layout System
 *
 * Converts canvas elements to CSS styles for HTML export
 */

/**
 * 기본 포지셔닝 스타일 생성 (Phase 15 확장)
 */
export function generateBaseStyles(
  element: CanvasElement,
  isLayoutChild: boolean = false
): React.CSSProperties {
  const baseStyles: React.CSSProperties = {
    width: `${element.size.width}px`,
    height: `${element.size.height}px`,
    transform: `rotate(${element.rotation}deg)`,
    transformOrigin: 'center center',
    zIndex: element.zIndex,
    display: element.visible ? 'block' : 'none',
    pointerEvents: element.locked ? 'none' : 'auto',
  };

  // Phase 15: 레이아웃 컨테이너 CSS
  if (element.layout) {
    if (element.layout.type === 'flex') {
      Object.assign(baseStyles, generateFlexboxCSS(element.layout));
    } else if (element.layout.type === 'grid') {
      Object.assign(baseStyles, generateGridCSS(element.layout));
    }
    // Layout containers already have position: relative from layout CSS
    baseStyles.left = `${element.position.x}px`;
    baseStyles.top = `${element.position.y}px`;
    return baseStyles;
  }

  // Phase 15: 레이아웃 자식 요소 CSS
  if (isLayoutChild && element.layoutChild) {
    // Layout children use relative positioning (handled by flex/grid)
    baseStyles.position = 'relative';

    if ('flexGrow' in element.layoutChild) {
      Object.assign(baseStyles, generateFlexChildCSS(element.layoutChild));
    } else if ('gridColumn' in element.layoutChild) {
      Object.assign(baseStyles, generateGridChildCSS(element.layoutChild));
    }

    return baseStyles;
  }

  // 기본: absolute positioning
  const position = element.cssPosition || 'absolute';

  if (position === 'absolute') {
    baseStyles.position = 'absolute';
    baseStyles.left = `${element.position.x}px`;
    baseStyles.top = `${element.position.y}px`;
  } else {
    baseStyles.position = position;
  }

  return baseStyles;
}

/**
 * Shape 요소의 CSS 스타일 생성
 */
export function generateShapeStyles(
  shape: Shape,
  isLayoutChild: boolean = false
): React.CSSProperties {
  const baseStyles = generateBaseStyles(shape, isLayoutChild);

  // Rectangle & Circle - div with border-radius
  if (shape.shapeType === 'rectangle' || shape.shapeType === 'circle') {
    return {
      ...baseStyles,
      backgroundColor: shape.style.fill,
      border:
        shape.style.strokeWidth > 0
          ? `${shape.style.strokeWidth}px solid ${shape.style.stroke}`
          : 'none',
      borderRadius:
        shape.shapeType === 'circle'
          ? '50%'
          : shape.style.borderRadius > 0
          ? `${shape.style.borderRadius}px`
          : '0',
      opacity: shape.style.opacity,
      boxSizing: 'border-box',
    };
  }

  // Triangle - will use inline SVG, so just positioning
  return baseStyles;
}

/**
 * Text 요소의 CSS 스타일 생성
 */
export function generateTextStyles(
  text: TextElement,
  isLayoutChild: boolean = false
): React.CSSProperties {
  const baseStyles = generateBaseStyles(text, isLayoutChild);

  return {
    ...baseStyles,
    fontSize: `${text.fontSize}px`,
    fontFamily: text.fontFamily,
    fontWeight: text.fontWeight,
    color: text.color,
    textAlign: text.textAlign,
    lineHeight: '1.4',
    wordWrap: 'break-word',
    overflow: 'hidden',
    // Remove width/height constraints for text to flow naturally
    width: 'auto',
    height: 'auto',
    maxWidth: `${text.size.width}px`,
    minHeight: `${text.size.height}px`,
  };
}

/**
 * Image 요소의 CSS 스타일 생성
 */
export function generateImageStyles(
  image: ImageElement,
  isLayoutChild: boolean = false
): React.CSSProperties {
  const baseStyles = generateBaseStyles(image, isLayoutChild);

  return {
    ...baseStyles,
    overflow: 'hidden',
  };
}

/**
 * Image의 img 태그 스타일
 */
export function generateImgTagStyles(): React.CSSProperties {
  return {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  };
}

/**
 * Line 요소의 SVG 경로 생성
 */
export function generateLinePath(line: LineElement): string {
  const x1 = line.startPoint.x;
  const y1 = line.startPoint.y;
  const x2 = line.endPoint.x;
  const y2 = line.endPoint.y;

  return `M ${x1} ${y1} L ${x2} ${y2}`;
}

/**
 * Arrow 요소의 SVG 경로 생성 (선 + 화살표 머리)
 */
export function generateArrowPath(arrow: ArrowElement): {
  linePath: string;
  arrowHeadPath: string;
} {
  const x1 = arrow.startPoint.x;
  const y1 = arrow.startPoint.y;
  const x2 = arrow.endPoint.x;
  const y2 = arrow.endPoint.y;
  const headSize = arrow.arrowHeadSize;

  // 화살표 방향 계산
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const arrowAngle = Math.PI / 6; // 30도

  // 화살표 머리 좌표
  const arrowX1 = x2 - headSize * Math.cos(angle - arrowAngle);
  const arrowY1 = y2 - headSize * Math.sin(angle - arrowAngle);
  const arrowX2 = x2 - headSize * Math.cos(angle + arrowAngle);
  const arrowY2 = y2 - headSize * Math.sin(angle + arrowAngle);

  return {
    linePath: `M ${x1} ${y1} L ${x2} ${y2}`,
    arrowHeadPath: `M ${arrowX1} ${arrowY1} L ${x2} ${y2} L ${arrowX2} ${arrowY2}`,
  };
}

/**
 * Triangle SVG 생성
 */
export function generateTriangleSVG(shape: Shape): string {
  const { width, height } = shape.size;
  const { fill, stroke, strokeWidth, opacity } = shape.style;

  // 정삼각형 좌표
  const points = `${width / 2},0 ${width},${height} 0,${height}`;

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <polygon
        points="${points}"
        fill="${fill}"
        stroke="${stroke}"
        stroke-width="${strokeWidth}"
        opacity="${opacity}"
      />
    </svg>
  `.trim();
}

/**
 * React.CSSProperties를 CSS 문자열로 변환
 */
export function stylesToString(styles: React.CSSProperties): string {
  return Object.entries(styles)
    .map(([key, value]) => {
      // camelCase를 kebab-case로 변환
      const kebabKey = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
      return `${kebabKey}: ${value}`;
    })
    .join('; ');
}

/**
 * 폰트 패밀리 목록 추출 (Google Fonts 로드용)
 */
export function extractFontFamilies(elements: CanvasElement[]): string[] {
  const fonts = new Set<string>();

  elements.forEach((element) => {
    if (element.type === 'text') {
      fonts.add(element.fontFamily);
    }
  });

  return Array.from(fonts);
}

/**
 * Google Fonts URL 생성
 */
export function generateGoogleFontsURL(fontFamilies: string[]): string {
  if (fontFamilies.length === 0) return '';

  // 폰트 이름을 + 로 연결 (공백 → +)
  const families = fontFamilies
    .map((font) => font.replace(/\s+/g, '+'))
    .join('&family=');

  return `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
}
