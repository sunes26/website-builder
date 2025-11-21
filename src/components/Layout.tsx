//src\components\Layout.tsx
import { ReactNode, Children, isValidElement } from 'react';

interface LayoutProps {
  children: ReactNode;
}

/**
 * 메인 레이아웃 컴포넌트
 * Flexbox 기반의 고정된 레이아웃 구조
 */
export default function Layout({ children }: LayoutProps) {
  const childArray = Children.toArray(children);
  
  // 각 서브 컴포넌트 찾기
  let toolbar = null;
  let sidebar = null;
  let canvas = null;
  let properties = null;

  childArray.forEach((child) => {
    if (isValidElement(child)) {
      if (child.type === Layout.Toolbar) toolbar = child;
      else if (child.type === Layout.Sidebar) sidebar = child;
      else if (child.type === Layout.Canvas) canvas = child;
      else if (child.type === Layout.PropertiesPanel) properties = child;
    }
  });

  return (
    <div className="layout-root">
      {/* 상단 툴바 */}
      {toolbar}
      
      {/* 메인 컨텐츠 영역 (사이드바 + 캔버스 + 속성패널) */}
      <div className="layout-content">
        {sidebar}
        {canvas}
        {properties}
      </div>
    </div>
  );
}

/**
 * 상단 툴바 영역
 */
Layout.Toolbar = ({ children }: { children: ReactNode }) => {
  return (
    <div className="layout-toolbar">
      {children}
    </div>
  );
};

/**
 * 좌측 사이드바 영역
 */
Layout.Sidebar = ({ children }: { children: ReactNode }) => {
  return (
    <aside className="layout-sidebar">
      {children}
    </aside>
  );
};

/**
 * 중앙 캔버스 영역
 */
Layout.Canvas = ({ children }: { children: ReactNode }) => {
  return (
    <main className="layout-canvas">
      {children}
    </main>
  );
};

/**
 * 우측 속성 패널 영역
 */
Layout.PropertiesPanel = ({ children }: { children: ReactNode }) => {
  return (
    <aside className="layout-properties">
      {children}
    </aside>
  );
};
