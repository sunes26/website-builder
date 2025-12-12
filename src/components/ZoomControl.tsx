import { ZoomIn, ZoomOut, Maximize2, Grid3x3, Magnet } from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';

/**
 * 캔버스 줌 & 그리드 컨트롤 (Priority 0.1 & 0.2)
 *
 * 오른쪽 하단에 위치한 줌, 그리드, 스냅 컨트롤
 */
export default function ZoomControl() {
  const { canvasZoom, zoomIn, zoomOut, resetZoom, showGrid, snapToGrid, toggleGrid, toggleSnap } = useBuilderStore();

  const zoomPercentage = Math.round(canvasZoom * 100);

  return (
    <div className="fixed bottom-6 right-6 z-40 no-select flex flex-col gap-2">
      {/* 줌 컨트롤 */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 flex items-center gap-1 p-1">
        {/* 줌 아웃 */}
        <button
          onClick={zoomOut}
          className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="줌 아웃 (Ctrl + -)"
          disabled={canvasZoom <= 0.1}
        >
          <ZoomOut size={18} />
        </button>

        {/* 현재 줌 레벨 & 리셋 */}
        <button
          onClick={resetZoom}
          className="px-3 py-2 min-w-[60px] text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
          title="줌 리셋 (Ctrl + 0)"
        >
          {zoomPercentage}%
        </button>

        {/* 줌 인 */}
        <button
          onClick={zoomIn}
          className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="줌 인 (Ctrl + =)"
          disabled={canvasZoom >= 5}
        >
          <ZoomIn size={18} />
        </button>

        {/* 구분선 */}
        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* 화면 맞춤 */}
        <button
          onClick={resetZoom}
          className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-700"
          title="화면 맞춤"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      {/* 그리드 & 스냅 컨트롤 */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 flex items-center gap-1 p-1">
        {/* 그리드 토글 */}
        <button
          onClick={toggleGrid}
          className={`p-2 rounded transition-colors ${
            showGrid
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          title={`그리드 ${showGrid ? '숨기기' : '표시'} (Ctrl + ')`}
        >
          <Grid3x3 size={18} />
        </button>

        {/* 스냅 토글 */}
        <button
          onClick={toggleSnap}
          className={`p-2 rounded transition-colors ${
            snapToGrid
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          title={`그리드 스냅 ${snapToGrid ? '끄기' : '켜기'} (Ctrl + Shift + ')`}
        >
          <Magnet size={18} />
        </button>
      </div>
    </div>
  );
}
