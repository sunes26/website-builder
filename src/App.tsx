import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import { useBuilderStore } from './store/builderStore';
import { getStorageData } from './utils/storageUtils';
import { useAutoSave } from './hooks/useAutoSave';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { loadProject, createNewProject } = useBuilderStore();

  // 자동 저장 활성화 (Phase 10)
  useAutoSave();

  // 앱 시작 시 프로젝트 로드 (Phase 10)
  useEffect(() => {
    const data = getStorageData();

    if (data && data.lastOpenedProjectId) {
      // 마지막으로 열었던 프로젝트 로드
      const success = loadProject(data.lastOpenedProjectId);
      if (!success) {
        // 프로젝트 로드 실패 시 새 프로젝트 생성
        console.warn('Failed to load last project, creating new one');
        createNewProject('새 프로젝트');
      }
    } else {
      // 저장된 데이터 없으면 첫 프로젝트 생성
      createNewProject('첫 프로젝트');
    }

    setIsInitialized(true);
  }, [loadProject, createNewProject]);

  // 로딩 화면
  if (!isInitialized) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-gray-600 font-medium">
            프로젝트 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden">
      <Layout />
    </div>
  );
}

export default App;