import type { FlexboxLayout, GridLayout, FlexChildProps, GridChildProps } from '../types';

/**
 * Layout CSS Generator (Phase 15.5)
 *
 * Flexbox/Grid 레이아웃을 위한 CSS 생성 함수들
 */

/**
 * Flexbox 컨테이너 CSS 생성
 */
export function generateFlexboxCSS(layout: FlexboxLayout): React.CSSProperties {
  const rowGap = layout.rowGap !== undefined ? layout.rowGap : layout.gap;
  const columnGap = layout.columnGap !== undefined ? layout.columnGap : layout.gap;

  return {
    display: 'flex',
    flexDirection: layout.flexDirection,
    justifyContent: layout.justifyContent,
    alignItems: layout.alignItems,
    flexWrap: layout.flexWrap,
    rowGap: `${rowGap}px`,
    columnGap: `${columnGap}px`,
    position: 'relative', // Flexbox containers use relative positioning
  };
}

/**
 * Grid 컨테이너 CSS 생성
 */
export function generateGridCSS(layout: GridLayout): React.CSSProperties {
  const rowGap = layout.rowGap !== undefined ? layout.rowGap : layout.gap;
  const columnGap = layout.columnGap !== undefined ? layout.columnGap : layout.gap;

  const css: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: layout.gridTemplateColumns,
    gridTemplateRows: layout.gridTemplateRows,
    rowGap: `${rowGap}px`,
    columnGap: `${columnGap}px`,
    position: 'relative',
  };

  // Optional properties
  if (layout.justifyItems) {
    css.justifyItems = layout.justifyItems;
  }
  if (layout.alignItems) {
    css.alignItems = layout.alignItems;
  }
  if (layout.gridAutoFlow) {
    css.gridAutoFlow = layout.gridAutoFlow;
  }

  return css;
}

/**
 * Flex 자식 속성 CSS 생성
 */
export function generateFlexChildCSS(props: FlexChildProps): React.CSSProperties {
  const css: React.CSSProperties = {};

  if (props.flexGrow !== undefined) {
    css.flexGrow = props.flexGrow;
  }
  if (props.flexShrink !== undefined) {
    css.flexShrink = props.flexShrink;
  }
  if (props.flexBasis !== undefined) {
    css.flexBasis = props.flexBasis;
  }
  if (props.order !== undefined) {
    css.order = props.order;
  }
  if (props.alignSelf !== undefined) {
    css.alignSelf = props.alignSelf;
  }

  return css;
}

/**
 * Grid 자식 속성 CSS 생성
 */
export function generateGridChildCSS(props: GridChildProps): React.CSSProperties {
  const css: React.CSSProperties = {};

  if (props.gridColumn !== undefined) {
    css.gridColumn = props.gridColumn;
  }
  if (props.gridRow !== undefined) {
    css.gridRow = props.gridRow;
  }
  if (props.justifySelf !== undefined) {
    css.justifySelf = props.justifySelf;
  }
  if (props.alignSelf !== undefined) {
    css.alignSelf = props.alignSelf;
  }

  return css;
}

/**
 * Flexbox CSS를 문자열로 변환
 */
export function flexboxCSSToString(layout: FlexboxLayout): string {
  const css = generateFlexboxCSS(layout);
  return Object.entries(css)
    .map(([key, value]) => `${camelToKebab(key)}: ${value}`)
    .join('; ');
}

/**
 * Grid CSS를 문자열로 변환
 */
export function gridCSSToString(layout: GridLayout): string {
  const css = generateGridCSS(layout);
  return Object.entries(css)
    .map(([key, value]) => `${camelToKebab(key)}: ${value}`)
    .join('; ');
}

/**
 * Flex 자식 CSS를 문자열로 변환
 */
export function flexChildCSSToString(props: FlexChildProps): string {
  const css = generateFlexChildCSS(props);
  return Object.entries(css)
    .map(([key, value]) => `${camelToKebab(key)}: ${value}`)
    .join('; ');
}

/**
 * Grid 자식 CSS를 문자열로 변환
 */
export function gridChildCSSToString(props: GridChildProps): string {
  const css = generateGridChildCSS(props);
  return Object.entries(css)
    .map(([key, value]) => `${camelToKebab(key)}: ${value}`)
    .join('; ');
}

/**
 * camelCase를 kebab-case로 변환
 */
function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}
