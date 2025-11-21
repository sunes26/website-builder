// src/App.tsx
import { useEffect } from 'react';
import { useBuilderStore } from './store/builderStore';
import type { Project } from './types';

// 레이아웃 컴포넌트
import Layout from './components/Layout';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import PropertiesPanel from '@/components/PropertiesPanel';
import MindMapView from './components/MindMapView';
import PreviewNavBar from './components/PreviewNavBar';  // 🆕

function App() {
  const { setProject, activeTab, previewMode } = useBuilderStore();  // 🆕 previewMode 추가

  useEffect(() => {
    // 초기 프로젝트 데이터 설정
    const initialProject: Project = {
      id: 'project-1',
      name: '새 프로젝트',
      pages: [
        {
          id: 'page-1',
          name: '메인 페이지',
          route: '/',
          blocks: [],
        },
      ],
      mindMap: {
        nodes: [
          {
            id: 'node-1',
            pageId: 'page-1',
            pageName: '메인 페이지',
            position: { x: 250, y: 100 },
            isMainPage: true,
          },
        ],
        edges: [],
      },
      currentPageId: 'page-1',
    };

    setProject(initialProject);
  }, [setProject]);

  // 🆕 미리보기 모드일 때 완전히 다른 레이아웃
  if (previewMode) {
    return (
      <div className="w-full h-screen flex flex-col bg-gray-100">
        {/* 미리보기 전용 네비게이션 바 */}
        <PreviewNavBar />
        
        {/* 캔버스만 전체 화면으로 */}
        <div className="flex-1 overflow-hidden">
          <Canvas />
        </div>
      </div>
    );
  }

  // 편집 모드 (기존 레이아웃)
  return (
    <Layout>
      {/* 상단 툴바 */}
      <Layout.Toolbar>
        <Toolbar />
      </Layout.Toolbar>

      {/* 좌측 사이드바 */}
      <Layout.Sidebar>
        <Sidebar />
      </Layout.Sidebar>

      {/* 중앙 캔버스 */}
      <Layout.Canvas>
        {activeTab === 'editor' ? <Canvas /> : <MindMapView />}
      </Layout.Canvas>

      {/* 우측 속성 패널 */}
      <Layout.PropertiesPanel>
        <PropertiesPanel />
      </Layout.PropertiesPanel>
    </Layout>
  );
}

export default App;