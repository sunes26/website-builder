// 정규표현식을 상수로 정의 (성능 개선)
const BOX_SHADOW_REGEX = /(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)(?:\s+(-?\d+(?:\.\d+)?(?:px)?))?\s+rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/g;

export interface ShadowParams {
  dx: number;
  dy: number;
  stdDeviation: number;
  floodColor: string;
  floodOpacity: number;
}

/**
 * 단일 box-shadow 문자열 파싱
 */
function parseSingleShadow(shadowString: string): ShadowParams | null {
  const match = shadowString.match(BOX_SHADOW_REGEX);

  if (!match || match.length === 0) {
    return null;
  }

  const groups = match[0].match(
    /(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)(?:\s+(-?\d+(?:\.\d+)?(?:px)?))?\s+rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
  );

  if (!groups) return null;

  const dx = parseFloat(groups[1]);
  const dy = parseFloat(groups[2]);
  const blur = parseFloat(groups[3]);
  // spread는 무시 (SVG에서 구현 어려움)
  const r = parseInt(groups[5]);
  const g = parseInt(groups[6]);
  const b = parseInt(groups[7]);
  const a = groups[8] ? parseFloat(groups[8]) : 1;

  return {
    dx,
    dy,
    stdDeviation: blur / 2, // blur를 stdDeviation으로 변환
    floodColor: `rgb(${r}, ${g}, ${b})`,
    floodOpacity: a,
  };
}

/**
 * CSS box-shadow 값을 SVG filter 파라미터 배열로 변환
 * 다중 shadow 지원
 */
export function parseBoxShadow(boxShadow: string | undefined): ShadowParams[] {
  if (!boxShadow || boxShadow === 'none') {
    return [];
  }

  // 쉼표로 구분된 여러 shadow 처리
  const shadowStrings = boxShadow.split(',').map(s => s.trim());
  const shadows: ShadowParams[] = [];

  for (const shadowString of shadowStrings) {
    const shadow = parseSingleShadow(shadowString);
    if (shadow) {
      shadows.push(shadow);
    }
  }

  // 파싱 실패 시 기본 shadow 반환
  if (shadows.length === 0) {
    return [{
      dx: 0,
      dy: 4,
      stdDeviation: 3,
      floodColor: '#000000',
      floodOpacity: 0.3,
    }];
  }

  return shadows;
}

/**
 * 고유한 filter ID 생성
 */
export function generateFilterId(elementId: string): string {
  return `shadow-${elementId}`;
}
