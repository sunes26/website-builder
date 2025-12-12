import { useBuilderStore } from '../../store/builderStore';
import PageItem from './PageItem';
import PageControls from './PageControls';

/**
 * 페이지 패널 컴포넌트 (Phase 9)
 *
 * 다중 페이지 관리 UI
 */
export default function PagePanel() {
  const { pages, currentPage } = useBuilderStore();

  return (
    <div className="h-full flex flex-col">
      {/* 페이지 컨트롤 */}
      <PageControls />

      {/* 페이지 목록 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {pages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">
              페이지가 없습니다
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {pages.map((page) => (
              <PageItem
                key={page.id}
                page={page}
                isActive={page.id === currentPage.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
