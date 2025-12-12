import type {
  SaveableProject,
  SaveablePage,
  Page,
  Component,
  SaveableComponent,
  CSSClass,
  SaveableCSSClass,
  KeyframeAnimation,
  SaveableKeyframeAnimation,
  CustomBreakpoint,
  ProjectMetadata,
  LocalStorageData,
  DesignTokens,
} from '../types';

const STORAGE_KEY = 'figma-builder-data';
const STORAGE_VERSION = '1.0.0';

// ============================================
// 변환 함수 (Date ↔ ISO string)
// ============================================

/**
 * Page를 SaveablePage로 변환 (Date → ISO string)
 */
export function pageToSaveable(page: Page): SaveablePage {
  return {
    ...page,
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
  };
}

/**
 * SaveablePage를 Page로 변환 (ISO string → Date)
 */
export function saveableToPage(saveable: SaveablePage): Page {
  return {
    ...saveable,
    createdAt: new Date(saveable.createdAt),
    updatedAt: new Date(saveable.updatedAt),
  };
}

/**
 * Component를 SaveableComponent로 변환 (Date → ISO string)
 * Phase 12
 */
export function componentToSaveable(component: Component): SaveableComponent {
  return {
    ...component,
    createdAt: component.createdAt.toISOString(),
    updatedAt: component.updatedAt.toISOString(),
  };
}

/**
 * SaveableComponent를 Component로 변환 (ISO string → Date)
 * Phase 12
 */
export function saveableToComponent(saveable: SaveableComponent): Component {
  return {
    ...saveable,
    createdAt: new Date(saveable.createdAt),
    updatedAt: new Date(saveable.updatedAt),
  };
}

/**
 * CSSClass를 SaveableCSSClass로 변환 (Date → ISO string)
 * Phase 15.1
 */
export function cssClassToSaveable(cssClass: CSSClass): SaveableCSSClass {
  return {
    ...cssClass,
    createdAt: cssClass.createdAt.toISOString(),
    updatedAt: cssClass.updatedAt.toISOString(),
  };
}

/**
 * SaveableCSSClass를 CSSClass로 변환 (ISO string → Date)
 * Phase 15.1
 */
export function saveableToCSSClass(saveable: SaveableCSSClass): CSSClass {
  return {
    ...saveable,
    createdAt: new Date(saveable.createdAt),
    updatedAt: new Date(saveable.updatedAt),
  };
}

/**
 * KeyframeAnimation을 SaveableKeyframeAnimation으로 변환 (Date → ISO string)
 * Phase 15.2
 */
export function keyframeAnimationToSaveable(animation: KeyframeAnimation): SaveableKeyframeAnimation {
  return {
    ...animation,
    createdAt: animation.createdAt.toISOString(),
    updatedAt: animation.updatedAt.toISOString(),
  };
}

/**
 * SaveableKeyframeAnimation을 KeyframeAnimation으로 변환 (ISO string → Date)
 * Phase 15.2
 */
export function saveableToKeyframeAnimation(saveable: SaveableKeyframeAnimation): KeyframeAnimation {
  return {
    ...saveable,
    createdAt: new Date(saveable.createdAt),
    updatedAt: new Date(saveable.updatedAt),
  };
}

/**
 * 현재 store 상태로 SaveableProject 생성
 */
export function createSaveableProject(
  id: string,
  name: string,
  pages: Page[],
  currentPageId: string,
  components: Component[] = [],  // Phase 12
  cssClasses: CSSClass[] = [],  // Phase 15.1
  keyframeAnimations: KeyframeAnimation[] = [],  // Phase 15.2
  customBreakpoints: CustomBreakpoint[] = [],  // Phase 15.3
  designTokens?: DesignTokens  // Priority 4.4
): SaveableProject {
  return {
    id,
    name,
    pages: pages.map(pageToSaveable),
    currentPageId,
    components: components.map(componentToSaveable),  // Phase 12
    cssClasses: cssClasses.map(cssClassToSaveable),  // Phase 15.1
    keyframeAnimations: keyframeAnimations.map(keyframeAnimationToSaveable),  // Phase 15.2
    customBreakpoints,  // Phase 15.3 (Date 없어서 변환 불필요)
    designTokens,  // Priority 4.4
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ============================================
// LocalStorage CRUD 함수
// ============================================

/**
 * LocalStorage에서 모든 데이터 가져오기
 */
export function getStorageData(): LocalStorageData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data);

    // 구조 검증
    if (!parsed.version || !Array.isArray(parsed.projects)) {
      console.error('Invalid storage structure');
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Failed to read localStorage:', error);

    // 손상된 데이터 백업
    const backup = localStorage.getItem(STORAGE_KEY);
    if (backup) {
      try {
        localStorage.setItem(`${STORAGE_KEY}-backup-${Date.now()}`, backup);
        console.log('Corrupted data backed up');
      } catch (backupError) {
        console.error('Failed to backup corrupted data:', backupError);
      }
    }

    return null;
  }
}

/**
 * LocalStorage에 모든 데이터 저장
 */
export function setStorageData(data: LocalStorageData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to write localStorage:', error);

    if (error instanceof Error && error.name === 'QuotaExceededError') {
      alert(
        '저장 공간이 부족합니다.\n이전 프로젝트를 삭제하거나 JSON으로 내보낸 후 삭제해주세요.'
      );
    }

    return false;
  }
}

/**
 * 프로젝트 메타데이터 목록 가져오기
 */
export function getProjectMetadataList(): ProjectMetadata[] {
  const data = getStorageData();
  if (!data) return [];

  return data.projects.map((project) => ({
    id: project.id,
    name: project.name,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    pageCount: project.pages.length,
    elementCount: project.pages.reduce(
      (sum, page) => sum + page.elements.length,
      0
    ),
  }));
}

/**
 * ID로 프로젝트 가져오기
 */
export function getProjectById(projectId: string): SaveableProject | null {
  const data = getStorageData();
  if (!data) return null;

  return data.projects.find((p) => p.id === projectId) || null;
}

/**
 * 프로젝트 저장 또는 업데이트
 */
export function saveProject(project: SaveableProject): boolean {
  const data = getStorageData() || {
    version: STORAGE_VERSION,
    lastOpenedProjectId: project.id,
    projects: [],
  };

  const existingIndex = data.projects.findIndex((p) => p.id === project.id);

  if (existingIndex >= 0) {
    // 기존 프로젝트 업데이트
    data.projects[existingIndex] = {
      ...project,
      updatedAt: new Date().toISOString(),
    };
  } else {
    // 새 프로젝트 추가
    data.projects.push(project);
  }

  data.lastOpenedProjectId = project.id;
  return setStorageData(data);
}

/**
 * 프로젝트 삭제
 */
export function deleteProject(projectId: string): boolean {
  const data = getStorageData();
  if (!data) return false;

  data.projects = data.projects.filter((p) => p.id !== projectId);

  // 마지막으로 열었던 프로젝트가 삭제되면 첫 번째 프로젝트로 변경
  if (data.lastOpenedProjectId === projectId) {
    data.lastOpenedProjectId = data.projects[0]?.id || null;
  }

  return setStorageData(data);
}

// ============================================
// Import/Export 함수
// ============================================

/**
 * 프로젝트를 JSON 파일로 내보내기
 */
export function exportProjectToFile(project: SaveableProject): void {
  const blob = new Blob([JSON.stringify(project, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * JSON 파일에서 프로젝트 가져오기
 */
export function importProjectFromFile(file: File): Promise<SaveableProject> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const project = JSON.parse(e.target?.result as string);

        // 구조 검증
        if (!project.id || !project.name || !Array.isArray(project.pages)) {
          throw new Error('잘못된 프로젝트 파일 형식입니다.');
        }

        resolve(project);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

// ============================================
// 유틸리티 함수
// ============================================

/**
 * 저장 공간 사용량 확인
 */
export function getStorageInfo(): {
  used: number;
  total: number;
  percentage: number;
} {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const used = new Blob([data || '']).size;
    const total = 5 * 1024 * 1024; // 5MB (일반적인 localStorage 제한)

    return {
      used,
      total,
      percentage: (used / total) * 100,
    };
  } catch {
    return { used: 0, total: 0, percentage: 0 };
  }
}
