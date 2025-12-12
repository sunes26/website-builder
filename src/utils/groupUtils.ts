import { nanoid } from 'nanoid';
import type { CanvasElement, GroupElement } from '../types';
import { getGroupBounds } from './alignUtils';

/**
 * 그룹 생성
 */
export function createGroup(childElements: CanvasElement[]): GroupElement {
  const groupBounds = getGroupBounds(childElements);

  return {
    id: nanoid(),
    type: 'group',
    childElementIds: childElements.map(el => el.id),
    position: {
      x: groupBounds.x,
      y: groupBounds.y,
    },
    size: {
      width: groupBounds.width,
      height: groupBounds.height,
    },
    rotation: 0,
    zIndex: Date.now(),
    locked: false,
    visible: true,
  };
}

/**
 * 그룹에 속한 모든 자식 ID (재귀)
 */
export function getAllChildIds(
  groupId: string,
  elements: CanvasElement[]
): string[] {
  const group = elements.find(el => el.id === groupId);
  if (!group || group.type !== 'group') return [];

  const result: string[] = [...group.childElementIds];

  // 중첩 그룹 처리
  group.childElementIds.forEach(childId => {
    const child = elements.find(el => el.id === childId);
    if (child && child.type === 'group') {
      result.push(...getAllChildIds(childId, elements));
    }
  });

  return result;
}

/**
 * 요소가 그룹에 속해있는지
 */
export function isElementInGroup(
  elementId: string,
  elements: CanvasElement[]
): boolean {
  return elements.some(el =>
    el.type === 'group' && el.childElementIds.includes(elementId)
  );
}
