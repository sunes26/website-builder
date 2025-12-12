import { useBuilderStore } from '../store/builderStore';
import { DEFAULT_BREAKPOINTS, type Breakpoint } from '../types';

/**
 * ViewportSwitcher Component (Phase 14: Responsive Design)
 *
 * 브레이크포인트 전환 UI - 데스크톱/태블릿/모바일 뷰포트 전환
 */
export default function ViewportSwitcher() {
  const { currentBreakpoint, setCurrentBreakpoint } = useBuilderStore();

  const breakpoints: Breakpoint[] = ['desktop', 'tablet', 'mobile'];

  return (
    <div className="flex items-center gap-2">
      {/* 브레이크포인트 버튼들 - 가로 배치 */}
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
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
            title={`${config.label} 뷰포트 (${config.minWidth}px${config.maxWidth ? `-${config.maxWidth}px` : '+'})`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs font-medium">{config.label}</span>
          </button>
        );
      })}
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
