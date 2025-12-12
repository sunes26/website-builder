import { useState, useEffect, useRef } from 'react';
import { X, Monitor, Tablet, Smartphone } from 'lucide-react';
import { pageToHTML } from '../utils/htmlExport';
import { generatePreviewHTML } from '../utils/htmlTemplate';
import { generateAllResponsiveCSS } from '../utils/responsiveCssGenerator';
import type { Page } from '../types';

/**
 * Preview Modal Component (Phase 11)
 *
 * 미리보기 모달 - 반응형 뷰포트 전환 지원
 */

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: Page;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_SIZES: Record<
  ViewportSize,
  { width: number; height: number; label: string; icon: typeof Monitor }
> = {
  desktop: {
    width: 1440,
    height: 900,
    label: '데스크톱',
    icon: Monitor,
  },
  tablet: {
    width: 768,
    height: 1024,
    label: '태블릿',
    icon: Tablet,
  },
  mobile: {
    width: 375,
    height: 667,
    label: '모바일',
    icon: Smartphone,
  },
};

export default function PreviewModal({ isOpen, onClose, page }: PreviewModalProps) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [scale, setScale] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate HTML content (Phase 14: 반응형 CSS 포함)
  const bodyHTML = pageToHTML(page);
  const responsiveCSS = generateAllResponsiveCSS(page.elements);
  const htmlContent = generatePreviewHTML(bodyHTML, responsiveCSS);

  // Update iframe content when page changes
  useEffect(() => {
    if (iframeRef.current && isOpen) {
      const iframeDoc =
        iframeRef.current.contentDocument ||
        iframeRef.current.contentWindow?.document;

      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
      }
    }
  }, [htmlContent, isOpen, viewport]);

  // Calculate scale to fit viewport
  useEffect(() => {
    if (!containerRef.current || !isOpen) return;

    const updateScale = () => {
      const container = containerRef.current;
      if (!container) return;

      const viewportConfig = VIEWPORT_SIZES[viewport];
      const containerWidth = container.clientWidth - 64; // padding
      const containerHeight = container.clientHeight - 120; // header + padding

      const scaleX = containerWidth / viewportConfig.width;
      const scaleY = containerHeight / viewportConfig.height;

      // Use smaller scale to fit both dimensions
      const newScale = Math.min(scaleX, scaleY, 1);
      setScale(newScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);

    return () => window.removeEventListener('resize', updateScale);
  }, [viewport, isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const viewportConfig = VIEWPORT_SIZES[viewport];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      {/* Modal Container */}
      <div className="bg-white rounded-lg shadow-2xl w-[95vw] h-[95vh] flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-800">미리보기</h2>
            <span className="text-sm text-gray-500">
              {page.name} • {page.slug}
            </span>
          </div>

          {/* Viewport Toggles */}
          <div className="flex items-center space-x-2">
            {(Object.keys(VIEWPORT_SIZES) as ViewportSize[]).map((size) => {
              const config = VIEWPORT_SIZES[size];
              const Icon = config.icon;
              const isActive = viewport === size;

              return (
                <button
                  key={size}
                  onClick={() => setViewport(size)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  title={config.label}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{config.label}</span>
                  <span className="text-xs opacity-70">
                    {config.width}×{config.height}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close preview"
          >
            <X size={24} />
          </button>
        </header>

        {/* Preview Area */}
        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center bg-gray-100 p-8 overflow-hidden"
        >
          {/* Iframe Container with Scale */}
          <div
            style={{
              width: `${viewportConfig.width}px`,
              height: `${viewportConfig.height}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              transition: 'all 0.3s ease-in-out',
            }}
            className="bg-white shadow-2xl rounded-lg overflow-hidden"
          >
            <iframe
              ref={iframeRef}
              title="Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Scale: {Math.round(scale * 100)}%
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            닫기
          </button>
        </footer>
      </div>
    </div>
  );
}
