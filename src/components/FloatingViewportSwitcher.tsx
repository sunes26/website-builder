import { useBuilderStore } from '../store/builderStore';
import { DEFAULT_BREAKPOINTS, type Breakpoint } from '../types';

/**
 * FloatingViewportSwitcher Component (Priority 2.3)
 *
 * 캔버스 상단에 표시되는 플로팅 브레이크포인트 전환 UI
 * 실시간 반응형 프리뷰를 위한 빠른 전환 제공
 */
export default function FloatingViewportSwitcher() {
  const { currentBreakpoint, setCurrentBreakpoint } = useBuilderStore();

  const breakpoints: Breakpoint[] = ['desktop', 'tablet', 'mobile'];

  // 현재 브레이크포인트 정보
  const currentConfig = DEFAULT_BREAKPOINTS[currentBreakpoint];

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2">
        <div className="flex items-center gap-2">
          {/* 현재 브레이크포인트 정보 */}
          <div className="px-3 py-1.5 text-xs font-medium text-gray-600 border-r border-gray-200">
            <span className="font-semibold text-blue-600">{currentConfig.label}</span>
            <span className="ml-1 text-gray-400">
              ({currentConfig.minWidth}px
              {currentConfig.maxWidth ? `-${currentConfig.maxWidth}px` : '+'})
            </span>
          </div>

          {/* 브레이크포인트 버튼들 */}
          {breakpoints.map((breakpoint) => {
            const config = DEFAULT_BREAKPOINTS[breakpoint];
            const isActive = currentBreakpoint === breakpoint;

            // 아이콘 선택
            const Icon = getBreakpointIcon(breakpoint);

            return (
              <button
                key={breakpoint}
                onClick={() => setCurrentBreakpoint(breakpoint)}
                className={`
                  flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg
                  transition-all duration-200
                  ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md scale-105'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }
                `}
                title={`${config.label} 뷰포트로 전환`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium hidden sm:inline">{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * 브레이크포인트별 아이콘 반환
 */
function getBreakpointIcon(breakpoint: Breakpoint) {
  switch (breakpoint) {
    case 'desktop':
      return DesktopIcon;
    case 'tablet':
      return TabletIcon;
    case 'mobile':
      return MobileIcon;
  }
}

// SVG 아이콘 컴포넌트들

function DesktopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function TabletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  );
}

function MobileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  );
}
