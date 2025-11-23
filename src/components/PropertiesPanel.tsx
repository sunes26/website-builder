import { useBuilderStore } from '../store/builderStore';

export default function PropertiesPanel() {
  const { selectedElementIds, elements } = useBuilderStore();

  // 선택된 요소 가져오기
  const selectedElements = elements.filter((el) =>
    selectedElementIds.includes(el.id)
  );

  if (selectedElements.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">선택된 요소가 없습니다</p>
      </div>
    );
  }

  const element = selectedElements[0];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-1">
          {getElementTypeName(element.type)}
        </h3>
        <p className="text-xs text-gray-500">
          ID: {element.id.substring(0, 8)}...
        </p>
      </div>

      {/* Phase 7에서 속성 폼이 여기에 추가됩니다 */}
      <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
        <p className="text-sm text-gray-500 mb-2">
          속성 편집 패널
        </p>
        <p className="text-xs text-gray-400">
          Phase 7에서 구현될 예정입니다
        </p>
        <div className="mt-4 space-y-2 text-left">
          <div className="text-xs text-gray-600">
            <span className="font-medium">타입:</span>{' '}
            <span className="text-gray-500">{element.type}</span>
          </div>
          <div className="text-xs text-gray-600">
            <span className="font-medium">위치:</span>{' '}
            <span className="text-gray-500">
              X: {element.position.x}, Y: {element.position.y}
            </span>
          </div>
          <div className="text-xs text-gray-600">
            <span className="font-medium">회전:</span>{' '}
            <span className="text-gray-500">{element.rotation}°</span>
          </div>
          <div className="text-xs text-gray-600">
            <span className="font-medium">Z-Index:</span>{' '}
            <span className="text-gray-500">{element.zIndex}</span>
          </div>
        </div>
      </div>

      {/* 다중 선택 안내 */}
      {selectedElements.length > 1 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-700">
            {selectedElements.length}개의 요소가 선택되었습니다
          </p>
          <p className="text-xs text-blue-600 mt-1">
            공통 속성 편집은 Phase 7에서 지원됩니다
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
    line: '선',
    text: '텍스트',
    image: '이미지',
  };
  return typeNames[type] || type;
}