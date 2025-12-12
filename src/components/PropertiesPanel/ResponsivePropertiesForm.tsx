import { useBuilderStore } from '../../store/builderStore';
import { DEFAULT_BREAKPOINTS, type CanvasElement } from '../../types';

/**
 * ResponsivePropertiesForm Component (Phase 14: Responsive Design)
 *
 * 반응형 속성 관리 UI
 * - 현재 브레이크포인트 표시
 * - 오버라이드된 속성 시각적 표시
 * - 오버라이드 생성/제거 버튼
 */
interface ResponsivePropertiesFormProps {
  element: CanvasElement;
}

export default function ResponsivePropertiesForm({ element }: ResponsivePropertiesFormProps) {
  const { currentBreakpoint, setResponsiveOverride, clearResponsiveOverride } = useBuilderStore();

  // desktop은 오버라이드 불가
  if (currentBreakpoint === 'desktop') {
    return (
      <div className="border-t border-gray-200 pt-4 mt-4">
        <h4 className="text-xs font-semibold text-gray-700 mb-3">반응형 디자인</h4>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-700">
            <strong>데스크톱 뷰</strong>는 기본 속성입니다.
            <br />
            태블릿 또는 모바일 뷰에서 반응형 오버라이드를 설정할 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  const hasOverride = Boolean(element.responsiveOverrides?.[currentBreakpoint]);
  const config = DEFAULT_BREAKPOINTS[currentBreakpoint];

  // 현재 브레이크포인트의 오버라이드 속성 목록
  const overrideKeys = hasOverride
    ? Object.keys(element.responsiveOverrides![currentBreakpoint]!)
    : [];

  const handleCopyFromDesktop = () => {
    // 현재 요소의 기본 속성을 오버라이드로 복사
    const updates: Partial<CanvasElement> = {
      position: element.position,
      size: element.size,
      rotation: element.rotation,
    };

    setResponsiveOverride(element.id, currentBreakpoint, updates);
  };

  const handleClearOverride = () => {
    if (confirm(`${config.label} 뷰포트의 오버라이드를 모두 제거하시겠습니까?`)) {
      clearResponsiveOverride(element.id, currentBreakpoint);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <h4 className="text-xs font-semibold text-gray-700 mb-3">반응형 디자인</h4>

      {/* 현재 브레이크포인트 표시 */}
      <div className="mb-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-600">현재 뷰포트:</span>
          <span className="font-semibold text-blue-600">{config.label}</span>
          <span className="text-gray-400">
            ({config.minWidth}
            {config.maxWidth ? `-${config.maxWidth}` : '+'}px)
          </span>
        </div>
      </div>

      {/* 오버라이드 상태 */}
      {hasOverride ? (
        <div className="space-y-3">
          {/* 오버라이드 정보 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <OverrideIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-green-800 mb-1">
                  이 뷰포트에 오버라이드가 적용되었습니다
                </p>
                <p className="text-xs text-green-700">
                  오버라이드된 속성: {overrideKeys.length}개
                </p>
                {overrideKeys.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {overrideKeys.map((key) => (
                      <span
                        key={key}
                        className="inline-block px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded"
                      >
                        {getPropertyLabel(key)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 오버라이드 제거 버튼 */}
          <button
            onClick={handleClearOverride}
            className="btn btn-secondary w-full text-xs"
          >
            오버라이드 제거
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* 오버라이드 없음 안내 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-600">
              이 뷰포트에는 오버라이드가 없습니다.
              <br />
              데스크톱 뷰의 속성이 사용됩니다.
            </p>
          </div>

          {/* 오버라이드 생성 버튼 */}
          <button
            onClick={handleCopyFromDesktop}
            className="btn btn-primary w-full text-xs"
          >
            이 뷰포트에서 오버라이드 시작
          </button>

          <p className="text-xs text-gray-500 text-center">
            속성을 변경하면 자동으로 오버라이드가 생성됩니다
          </p>
        </div>
      )}

      {/* 도움말 */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-xs text-blue-700 leading-relaxed">
          💡 <strong>팁:</strong> 위치, 크기, 회전 등의 속성을 브레이크포인트별로 다르게 설정할 수
          있습니다. 변경된 속성은 자동으로 오버라이드됩니다.
        </p>
      </div>
    </div>
  );
}

/**
 * 오버라이드 아이콘
 */
function OverrideIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/**
 * 속성 키를 한글 라벨로 변환
 */
function getPropertyLabel(key: string): string {
  const labels: Record<string, string> = {
    position: '위치',
    size: '크기',
    rotation: '회전',
    style: '스타일',
    fontSize: '글꼴 크기',
    fontFamily: '글꼴',
    color: '색상',
    fill: '채우기',
    stroke: '테두리',
    strokeWidth: '테두리 두께',
    opacity: '불투명도',
    borderRadius: '둥근 모서리',
  };

  return labels[key] || key;
}
