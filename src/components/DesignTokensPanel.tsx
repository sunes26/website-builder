import { Type, Palette, Sparkles, RotateCcw, Box } from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import { useState } from 'react';

type TokenCategory = 'typography' | 'colors' | 'shadows' | 'radius';

export default function DesignTokensPanel() {
  const {
    designTokens,
    selectedElementIds,
    elements,
    applyTypographyToken,
    applyColorToken,
    applyShadowToken,
    applyRadiusToken,
    resetDesignTokens,
  } = useBuilderStore();

  const [activeCategory, setActiveCategory] = useState<TokenCategory>('typography');

  const selectedElement = elements.find((el) => el.id === selectedElementIds[0]);
  const hasSelection = selectedElementIds.length > 0;

  // 타이포그래피 토큰 적용
  const handleApplyTypography = (tokenId: string) => {
    if (!hasSelection) return;
    selectedElementIds.forEach((id) => {
      try {
        applyTypographyToken(id, tokenId);
      } catch (error) {
        console.error('Failed to apply typography token:', error);
      }
    });
  };

  // 색상 토큰 적용
  const handleApplyColor = (tokenId: string) => {
    if (!hasSelection) return;
    selectedElementIds.forEach((id) => {
      const element = elements.find((el) => el.id === id);
      if (!element) return;

      // 요소 타입에 따라 기본 속성 결정
      let property: 'fill' | 'stroke' | 'color' = 'fill';
      if (element.type === 'text') {
        property = 'color';
      } else if (element.type === 'line' || element.type === 'arrow') {
        property = 'stroke';
      }

      try {
        applyColorToken(id, tokenId, property);
      } catch (error) {
        console.error('Failed to apply color token:', error);
      }
    });
  };

  // 그림자 토큰 적용
  const handleApplyShadow = (tokenId: string) => {
    if (!hasSelection) return;
    selectedElementIds.forEach((id) => {
      try {
        applyShadowToken(id, tokenId);
      } catch (error) {
        console.error('Failed to apply shadow token:', error);
      }
    });
  };

  // 모서리 토큰 적용
  const handleApplyRadius = (tokenId: string) => {
    if (!hasSelection) return;
    selectedElementIds.forEach((id) => {
      try {
        applyRadiusToken(id, tokenId);
      } catch (error) {
        console.error('Failed to apply radius token:', error);
      }
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">디자인 토큰</h3>
          <button
            onClick={resetDesignTokens}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="토큰 초기화"
          >
            <RotateCcw size={14} className="text-gray-500" />
          </button>
        </div>
        {!hasSelection && (
          <p className="text-xs text-gray-500 mt-1">
            요소를 선택하여 토큰을 적용하세요
          </p>
        )}
      </div>

      {/* 카테고리 탭 */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveCategory('typography')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            activeCategory === 'typography'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Type size={14} className="inline-block mr-1" />
          타이포그래피
        </button>
        <button
          onClick={() => setActiveCategory('colors')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            activeCategory === 'colors'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Palette size={14} className="inline-block mr-1" />
          색상
        </button>
        <button
          onClick={() => setActiveCategory('shadows')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            activeCategory === 'shadows'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Sparkles size={14} className="inline-block mr-1" />
          그림자
        </button>
        <button
          onClick={() => setActiveCategory('radius')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            activeCategory === 'radius'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Box size={14} className="inline-block mr-1" />
          모서리
        </button>
      </div>

      {/* 토큰 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* 타이포그래피 토큰 */}
        {activeCategory === 'typography' && (
          <>
            {designTokens.typography.map((token) => (
              <button
                key={token.id}
                onClick={() => handleApplyTypography(token.id)}
                disabled={!hasSelection || selectedElement?.type !== 'text'}
                className={`
                  w-full px-3 py-3 rounded-lg border-2 text-left transition-all
                  ${
                    hasSelection && selectedElement?.type === 'text'
                      ? 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {token.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {token.fontSize}px / {token.fontWeight} / {token.lineHeight}
                    </p>
                  </div>
                  <div
                    className="text-gray-400"
                    style={{
                      fontSize: Math.min(token.fontSize / 2, 24),
                      fontWeight: token.fontWeight,
                    }}
                  >
                    Aa
                  </div>
                </div>
              </button>
            ))}
          </>
        )}

        {/* 색상 토큰 */}
        {activeCategory === 'colors' && (
          <>
            {/* Primary 색상 */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase">
                Primary
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {designTokens.colors
                  .filter((c) => c.category === 'primary')
                  .map((token) => (
                    <button
                      key={token.id}
                      onClick={() => handleApplyColor(token.id)}
                      disabled={!hasSelection}
                      className={`
                        px-3 py-2 rounded-lg border-2 text-left transition-all
                        ${
                          hasSelection
                            ? 'border-gray-200 hover:border-blue-400 hover:scale-105 cursor-pointer'
                            : 'border-gray-100 cursor-not-allowed opacity-50'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: token.value }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">
                            {token.name}
                          </p>
                          <p className="text-xs text-gray-500">{token.value}</p>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Neutral 색상 */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase">
                Neutral
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {designTokens.colors
                  .filter((c) => c.category === 'neutral')
                  .map((token) => (
                    <button
                      key={token.id}
                      onClick={() => handleApplyColor(token.id)}
                      disabled={!hasSelection}
                      className={`
                        px-3 py-2 rounded-lg border-2 text-left transition-all
                        ${
                          hasSelection
                            ? 'border-gray-200 hover:border-blue-400 hover:scale-105 cursor-pointer'
                            : 'border-gray-100 cursor-not-allowed opacity-50'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: token.value }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">
                            {token.name}
                          </p>
                          <p className="text-xs text-gray-500">{token.value}</p>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Semantic 색상 */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase">
                Semantic
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {designTokens.colors
                  .filter((c) => c.category === 'semantic')
                  .map((token) => (
                    <button
                      key={token.id}
                      onClick={() => handleApplyColor(token.id)}
                      disabled={!hasSelection}
                      className={`
                        px-3 py-2 rounded-lg border-2 text-left transition-all
                        ${
                          hasSelection
                            ? 'border-gray-200 hover:border-blue-400 hover:scale-105 cursor-pointer'
                            : 'border-gray-100 cursor-not-allowed opacity-50'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: token.value }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">
                            {token.name}
                          </p>
                          <p className="text-xs text-gray-500">{token.value}</p>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Secondary & Accent 색상 */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase">
                Other
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {designTokens.colors
                  .filter((c) => c.category === 'secondary' || c.category === 'accent')
                  .map((token) => (
                    <button
                      key={token.id}
                      onClick={() => handleApplyColor(token.id)}
                      disabled={!hasSelection}
                      className={`
                        px-3 py-2 rounded-lg border-2 text-left transition-all
                        ${
                          hasSelection
                            ? 'border-gray-200 hover:border-blue-400 hover:scale-105 cursor-pointer'
                            : 'border-gray-100 cursor-not-allowed opacity-50'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: token.value }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">
                            {token.name}
                          </p>
                          <p className="text-xs text-gray-500">{token.value}</p>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </>
        )}

        {/* 그림자 토큰 */}
        {activeCategory === 'shadows' && (
          <>
            {designTokens.shadows.map((token) => (
              <button
                key={token.id}
                onClick={() => handleApplyShadow(token.id)}
                disabled={
                  !hasSelection ||
                  (selectedElement?.type !== 'shape' &&
                    selectedElement?.type !== 'text')
                }
                className={`
                  w-full px-4 py-4 rounded-lg border-2 text-left transition-all
                  ${
                    hasSelection &&
                    (selectedElement?.type === 'shape' ||
                      selectedElement?.type === 'text')
                      ? 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {token.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                      {token.value.length > 40
                        ? token.value.substring(0, 40) + '...'
                        : token.value}
                    </p>
                  </div>
                  <div
                    className="w-12 h-12 bg-white rounded"
                    style={{ boxShadow: token.value }}
                  />
                </div>
              </button>
            ))}
          </>
        )}

        {/* 모서리 토큰 */}
        {activeCategory === 'radius' && (
          <>
            {designTokens.radius.map((token) => (
              <button
                key={token.id}
                onClick={() => handleApplyRadius(token.id)}
                disabled={
                  !hasSelection ||
                  !(selectedElement?.type === 'shape' && selectedElement?.shapeType === 'rectangle')
                }
                className={`
                  w-full px-4 py-3 rounded-lg border-2 text-left transition-all
                  ${
                    hasSelection &&
                    selectedElement?.type === 'shape' &&
                    selectedElement?.shapeType === 'rectangle'
                      ? 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {token.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {token.value}px
                    </p>
                  </div>
                  <div
                    className="w-16 h-16 bg-blue-500 transition-all"
                    style={{ borderRadius: token.value }}
                  />
                </div>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
