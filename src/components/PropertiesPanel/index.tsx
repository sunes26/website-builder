import { useBuilderStore } from '../../store/builderStore';
import type { Shape, TextElement, ImageElement, LineElement, ArrowElement, ComponentInstance } from '../../types';
import CommonPropertiesForm from './CommonPropertiesForm';
import ShapePropertiesForm from './ShapePropertiesForm';
import TextPropertiesForm from './TextPropertiesForm';
import ImagePropertiesForm from './ImagePropertiesForm';
import LinePropertiesForm from './LinePropertiesForm';
import ComponentInstanceForm from './ComponentInstanceForm';
import InteractionPanel from '../InteractionPanel';
import ResponsivePropertiesForm from './ResponsivePropertiesForm';
import LayoutPropertiesForm from './LayoutPropertiesForm';
import LayoutChildForm from './LayoutChildForm';
import StylePropertiesForm from './StylePropertiesForm';

export default function PropertiesPanel() {
  const { selectedElementIds, elements } = useBuilderStore();

  // 선택된 요소 가져오기
  const selectedElements = elements.filter((el) =>
    selectedElementIds.includes(el.id)
  );

  // 빈 상태
  if (selectedElements.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">선택된 요소가 없습니다</p>
      </div>
    );
  }

  const isSingleSelection = selectedElements.length === 1;
  const element = selectedElements[0];

  // 타입별 다른 타입 혼합 여부
  const allSameType = selectedElements.every((el) => el.type === element.type);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-1">
          {isSingleSelection ? (
            getElementTypeName(element.type)
          ) : (
            `${selectedElements.length}개 요소 선택됨`
          )}
        </h3>
        {isSingleSelection && (
          <p className="text-xs text-gray-500">
            ID: {element.id.substring(0, 8)}...
          </p>
        )}
      </div>

      {/* 다른 타입 혼합 경고 */}
      {!isSingleSelection && !allSameType && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-yellow-700">
            서로 다른 타입의 요소가 선택되었습니다.
            <br />
            공통 속성만 편집할 수 있습니다.
          </p>
        </div>
      )}

      {/* 공통 속성 폼 - 항상 표시 */}
      <CommonPropertiesForm
        elements={selectedElements}
        isSingleSelection={isSingleSelection}
      />

      {/* 타입별 속성 폼 - 단일 선택 시만 */}
      {isSingleSelection && (
        <>
          {element.type === 'component' && (
            <ComponentInstanceForm instance={element as ComponentInstance} />
          )}
          {element.type === 'shape' && (
            <ShapePropertiesForm shape={element as Shape} />
          )}
          {element.type === 'text' && (
            <TextPropertiesForm text={element as TextElement} />
          )}
          {element.type === 'image' && (
            <ImagePropertiesForm image={element as ImageElement} />
          )}
          {(element.type === 'line' || element.type === 'arrow') && (
            <LinePropertiesForm line={element as LineElement | ArrowElement} />
          )}

          {/* Phase 15: 스타일 속성 (CSS 클래스 & 애니메이션) - 모든 요소에 표시 */}
          <StylePropertiesForm element={element} />

          {/* 인터랙션 패널 - 모든 요소에 표시 */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <InteractionPanel />
          </div>

          {/* Phase 15: 레이아웃 컨테이너 설정 - 그룹/컴포넌트만 */}
          <LayoutPropertiesForm element={element} />

          {/* Phase 15: 레이아웃 자식 속성 - 모든 요소에 표시 */}
          <LayoutChildForm element={element} />

          {/* 반응형 속성 패널 (Phase 14) - 모든 요소에 표시 */}
          <ResponsivePropertiesForm element={element} />
        </>
      )}

      {/* 다중 선택 안내 - 같은 타입이고 다중 선택일 때 */}
      {!isSingleSelection && allSameType && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-700">
            같은 타입의 {selectedElements.length}개 요소가 선택되었습니다.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            타입별 속성 편집은 단일 선택 시 가능합니다.
          </p>
        </div>
      )}
    </div>
  );
}

// 요소 타입 이름 가져오기
function getElementTypeName(type: string): string {
  const typeNames: Record<string, string> = {
    shape: '도형',
    line: '직선',
    arrow: '화살표',
    text: '텍스트',
    image: '이미지',
    group: '그룹',
    component: '컴포넌트',
  };
  return typeNames[type] || type;
}
