import { useBuilderStore } from '../../store/builderStore';
import type { CanvasElement } from '../../types';
import { FormGroup, NumberInput, RangeInput, CheckboxInput } from './FormGroup';

interface CommonPropertiesFormProps {
  elements: CanvasElement[];
  isSingleSelection: boolean;
}

export default function CommonPropertiesForm({
  elements,
  isSingleSelection,
}: CommonPropertiesFormProps) {
  const { updateElement, selectedElementIds, currentBreakpoint, setResponsiveOverride, getResolvedProperties } = useBuilderStore();

  if (elements.length === 0) return null;

  const element = elements[0];

  // Phase 14: 현재 브레이크포인트의 해결된 속성 사용
  const resolvedElement = getResolvedProperties(element, currentBreakpoint);

  // 다중 선택 시 공통 값 추출
  const getCommonValue = <K extends keyof CanvasElement>(key: K): CanvasElement[K] | 'mixed' => {
    const firstValue = elements[0][key];
    const allSame = elements.every((el) => el[key] === firstValue);
    return allSame ? firstValue : ('mixed' as any);
  };

  // 중첩된 객체의 공통 값 추출
  const getNestedCommonValue = (path: string): any => {
    const getValue = (el: any, p: string) => {
      const keys = p.split('.');
      let value = el;
      for (const k of keys) {
        value = value?.[k];
      }
      return value;
    };

    const firstValue = getValue(elements[0], path);
    const allSame = elements.every((el) => getValue(el, path) === firstValue);
    return allSame ? firstValue : 'mixed';
  };

  // 일괄 업데이트 함수 (Phase 14: 반응형 오버라이드 지원)
  const handleBatchUpdate = (updates: Partial<CanvasElement>) => {
    selectedElementIds.forEach((id) => {
      if (currentBreakpoint === 'desktop') {
        // Desktop: 기본 속성 업데이트
        updateElement(id, updates);
      } else {
        // Tablet/Mobile: 반응형 오버라이드 생성
        setResponsiveOverride(id, currentBreakpoint, updates);
      }
    });
  };

  // 속성이 오버라이드되었는지 확인 (단일 선택 시만)
  const isOverridden = (property: string): boolean => {
    if (!isSingleSelection || currentBreakpoint === 'desktop') return false;
    return Boolean(element.responsiveOverrides?.[currentBreakpoint]?.[property as keyof CanvasElement]);
  };

  // Position 값 (Phase 14: 해결된 속성 사용)
  const posX = isSingleSelection ? resolvedElement.position.x : getNestedCommonValue('position.x');
  const posY = isSingleSelection ? resolvedElement.position.y : getNestedCommonValue('position.y');

  // Size 값 (Line/Arrow는 size가 없음)
  const hasSize = element.type !== 'line' && element.type !== 'arrow';
  const sizeWidth = hasSize
    ? (isSingleSelection ? resolvedElement.size.width : getNestedCommonValue('size.width'))
    : null;
  const sizeHeight = hasSize
    ? (isSingleSelection ? resolvedElement.size.height : getNestedCommonValue('size.height'))
    : null;

  // Rotation 값
  const rotation = isSingleSelection ? resolvedElement.rotation : getCommonValue('rotation');

  // State 값
  const locked = getCommonValue('locked');
  const visible = getCommonValue('visible');

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
        공통 속성
      </h4>

      {/* Position */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center gap-2">
          위치
          {isOverridden('position') && <OverrideBadge />}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <FormGroup label="X">
            <NumberInput
              value={posX === 'mixed' ? '' : posX}
              onChange={(val) => {
                handleBatchUpdate({
                  position: {
                    x: val,
                    y: typeof posY === 'number' ? posY : elements[0].position.y,
                  },
                });
              }}
              placeholder={posX === 'mixed' ? '혼합' : undefined}
              step={1}
            />
          </FormGroup>
          <FormGroup label="Y">
            <NumberInput
              value={posY === 'mixed' ? '' : posY}
              onChange={(val) => {
                handleBatchUpdate({
                  position: {
                    x: typeof posX === 'number' ? posX : elements[0].position.x,
                    y: val,
                  },
                });
              }}
              placeholder={posY === 'mixed' ? '혼합' : undefined}
              step={1}
            />
          </FormGroup>
        </div>
      </div>

      {/* Size - Line/Arrow 제외 */}
      {hasSize && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center gap-2">
            크기
            {isOverridden('size') && <OverrideBadge />}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <FormGroup label="W">
              <NumberInput
                value={sizeWidth === 'mixed' ? '' : sizeWidth}
                onChange={(val) => {
                  handleBatchUpdate({
                    size: {
                      width: val,
                      height: typeof sizeHeight === 'number' ? sizeHeight : (elements[0] as any).size.height,
                    },
                  });
                }}
                placeholder={sizeWidth === 'mixed' ? '혼합' : undefined}
                min={1}
                step={1}
              />
            </FormGroup>
            <FormGroup label="H">
              <NumberInput
                value={sizeHeight === 'mixed' ? '' : sizeHeight}
                onChange={(val) => {
                  handleBatchUpdate({
                    size: {
                      width: typeof sizeWidth === 'number' ? sizeWidth : (elements[0] as any).size.width,
                      height: val,
                    },
                  });
                }}
                placeholder={sizeHeight === 'mixed' ? '혼합' : undefined}
                min={1}
                step={1}
              />
            </FormGroup>
          </div>
        </div>
      )}

      {/* Rotation */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center gap-2">
          회전 (도)
          {isOverridden('rotation') && <OverrideBadge />}
        </label>
        <div className="space-y-2">
          <NumberInput
            value={rotation === 'mixed' ? '' : rotation}
            onChange={(val) => {
              handleBatchUpdate({ rotation: val });
            }}
            placeholder={rotation === 'mixed' ? '혼합' : undefined}
            min={0}
            max={360}
            step={1}
          />
          {rotation !== 'mixed' && (
            <RangeInput
              value={typeof rotation === 'number' ? rotation : 0}
              onChange={(val) => {
                handleBatchUpdate({ rotation: val });
              }}
              min={0}
              max={360}
              step={1}
              displayValue={`${rotation}°`}
            />
          )}
        </div>
      </div>

      {/* State - Locked & Visible */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          상태
        </label>
        <div className="space-y-2">
          <CheckboxInput
            checked={locked === true}
            onChange={(val) => {
              handleBatchUpdate({ locked: val });
            }}
            label={locked === 'mixed' ? '잠금 (혼합)' : '잠금'}
          />
          <CheckboxInput
            checked={visible === true}
            onChange={(val) => {
              handleBatchUpdate({ visible: val });
            }}
            label={visible === 'mixed' ? '표시 (혼합)' : '표시'}
          />
        </div>
      </div>

      {/* 다중 선택 안내 */}
      {!isSingleSelection && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
          <p className="text-xs text-blue-700">
            {elements.length}개 요소 선택됨
          </p>
          <p className="text-xs text-blue-600 mt-1">
            공통 속성을 편집할 수 있습니다
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Override Badge - 반응형 오버라이드 시각적 표시 (Phase 14)
 */
function OverrideBadge() {
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
      title="이 속성은 현재 뷰포트에서 오버라이드되었습니다"
    >
      반응형
    </span>
  );
}
