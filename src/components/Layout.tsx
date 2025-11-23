import Toolbar from './Toolbar';
import Canvas from './Canvas';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex h-full w-full bg-gray-50">
      {/* 좌측 도구바 */}
      <Toolbar />
      
      {/* 중앙 캔버스 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 상단 네비게이션 (추후 추가) */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-800">
              Figma Style Builder
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="btn btn-secondary text-sm">
              미리보기
            </button>
            <button className="btn btn-primary text-sm">
              게시하기
            </button>
          </div>
        </header>
        
        {/* 캔버스 영역 */}
        <div className="flex-1 overflow-auto bg-gray-100">
          <Canvas />
        </div>
      </main>
      
      {/* 우측 사이드바 */}
      <Sidebar />
    </div>
  );
}