import type { CSSClass, KeyframeAnimation } from '../types';

/**
 * CSS Class Generator (Phase 15.1)
 *
 * CSS 클래스와 키프레임 애니메이션을 CSS 문자열로 변환
 */

/**
 * CSSProperties를 CSS 문자열로 변환
 */
function cssPropertiesToString(styles: React.CSSProperties): string {
  return Object.entries(styles)
    .map(([key, value]) => {
      // camelCase를 kebab-case로 변환
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `  ${cssKey}: ${value};`;
    })
    .join('\n');
}

/**
 * CSS 클래스를 CSS 규칙으로 변환
 */
export function generateCSSClassRule(cssClass: CSSClass): string {
  const className = cssClass.name.replace(/\s+/g, '-').toLowerCase();
  const rules: string[] = [];

  // 기본 스타일
  const styles = cssPropertiesToString(cssClass.styles);
  rules.push(`.${className} {\n${styles}\n}`);

  // 호버 스타일
  if (cssClass.hoverStyles) {
    const hoverStyles = cssPropertiesToString(cssClass.hoverStyles);
    rules.push(`.${className}:hover {\n${hoverStyles}\n}`);
  }

  return rules.join('\n\n');
}

/**
 * 모든 CSS 클래스를 CSS 문자열로 변환
 */
export function generateAllCSSClasses(cssClasses: CSSClass[]): string {
  if (cssClasses.length === 0) {
    return '';
  }

  const rules = cssClasses.map((cls) => generateCSSClassRule(cls));
  return `/* CSS 클래스 (Phase 15.1) */\n\n${rules.join('\n\n')}`;
}

/**
 * 키프레임 애니메이션을 @keyframes 규칙으로 변환 (Phase 15.2)
 */
export function generateKeyframeRule(animation: KeyframeAnimation): string {
  const animationName = animation.name.replace(/\s+/g, '-').toLowerCase();

  // 키프레임 생성
  const keyframes = animation.keyframes
    .map((keyframe) => {
      const styles = cssPropertiesToString(keyframe.styles);
      return `  ${keyframe.offset}% {\n  ${styles}\n  }`;
    })
    .join('\n\n');

  return `@keyframes ${animationName} {\n${keyframes}\n}`;
}

/**
 * 모든 키프레임 애니메이션을 CSS 문자열로 변환
 */
export function generateAllKeyframes(animations: KeyframeAnimation[]): string {
  if (animations.length === 0) {
    return '';
  }

  const rules = animations.map((anim) => generateKeyframeRule(anim));
  return `/* CSS 키프레임 애니메이션 (Phase 15.2) */\n\n${rules.join('\n\n')}`;
}

/**
 * 애니메이션 속성 CSS 생성
 */
export function generateAnimationCSS(animation: KeyframeAnimation): string {
  const animationName = animation.name.replace(/\s+/g, '-').toLowerCase();
  const duration = `${animation.duration}ms`;
  const timingFunction = animation.timingFunction;
  const iterationCount =
    animation.iterationCount === 'infinite' ? 'infinite' : animation.iterationCount.toString();
  const direction = animation.direction;
  const fillMode = animation.fillMode;

  return `animation: ${animationName} ${duration} ${timingFunction} ${iterationCount} ${direction} ${fillMode};`;
}

/**
 * 요소의 클래스 이름 배열을 class 속성 문자열로 변환
 */
export function getClassNamesString(
  classIds: string[] | undefined,
  cssClasses: CSSClass[]
): string {
  if (!classIds || classIds.length === 0) {
    return '';
  }

  const classNames = classIds
    .map((id) => {
      const cssClass = cssClasses.find((cls) => cls.id === id);
      return cssClass ? cssClass.name.replace(/\s+/g, '-').toLowerCase() : null;
    })
    .filter((name): name is string => name !== null);

  return classNames.join(' ');
}
