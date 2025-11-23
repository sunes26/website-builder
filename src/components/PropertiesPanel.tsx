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

      {/* 속성 표시 */}
      <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
        <p className="text-sm text-gray-500 mb-2">
          속성 편집 패널
        </p>
        <p className="text-xs text-gray-400 mb-4">
          Phase 7에서 구현될 예정입니다
        </p>
        
        <div className="mt-4 space-y-2 text-left">
          <div className="text-xs text-gray-600">
            <span className="font-medium">타입:</span>{' '}
            <span className="text-gray-500">{element.type}</span>
          </div>
          
          {/* 도형/텍스트/이미지 속성 */}
          {(element.type === 'shape' || element.type === 'text' || element.type === 'image') && (
            <>
              <div className="text-xs text-gray-600">
                <span className="font-medium">위치:</span>{' '}
                <span className="text-gray-500">
                  X: {Math.round(element.position.x)}, Y: {Math.round(element.position.y)}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium">크기:</span>{' '}
                <span className="text-gray-500">
                  W: {Math.round(element.size.width)}, H: {Math.round(element.size.height)}
                </span>
              </div>
            </>
          )}
          
          {/* 텍스트 전용 속성 */}
          {element.type === 'text' && (
            <>
              <div className="text-xs text-gray-600">
                <span className="font-medium">내용:</span>{' '}
                <span className="text-gray-500">
                  {element.content || '(비어있음)'}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium">폰트 크기:</span>{' '}
                <span className="text-gray-500">{element.fontSize}px</span>
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium">폰트:</span>{' '}
                <span className="text-gray-500">{element.fontFamily}</span>
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium">색상:</span>{' '}
                <span className="text-gray-500">{element.color}</span>
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium">정렬:</span>{' '}
                <span className="text-gray-500">{element.textAlign}</span>
              </div>
            </>
          )}
          
          {/* 이미지 전용 속성 */}
          {element.type === 'image' && (
            <>
              <div className="text-xs text-gray-600">
                <span className="font-medium">소스:</span>{' '}
                <span className="text-gray-500 truncate block max-w-full">
                  {element.src ? (element.src.length > 50 ? element.src.substring(0, 50) + '...' : element.src) : '(없음)'}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium">대체 텍스트:</span>{' '}
                <span className="text-gray-500">{element.alt || '(없음)'}</span>
              </div>
              {element.src && (
                <div className="mt-3">
                  <div className="w-full aspect-video bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    <img 
                      src={element.src} 
                      alt={element.alt || '미리보기'} 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* 선/화살표 속성 */}
          {(element.type === 'line' || element.type === 'arrow') && (
            <>
              <div className="text-xs text-gray-600">
                <span className="font-medium">시작점:</span>{' '}
                <span className="text-gray-500">
                  X: {Math.round(element.startPoint.x)}, Y: {Math.round(element.startPoint.y)}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium">끝점:</span>{' '}
                <span className="text-gray-500">
                  X: {Math.round(element.endPoint.x)}, Y: {Math.round(element.endPoint.y)}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium">색상:</span>{' '}
                <span className="text-gray-500">{element.strokeColor}</span>
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium">두께:</span>{' '}
                <span className="text-gray-500">{element.strokeWidth}px</span>
              </div>
              {element.type === 'arrow' && (
                <div className="text-xs text-gray-600">
                  <span className="font-medium">화살표 크기:</span>{' '}
                  <span className="text-gray-500">{element.arrowHeadSize}</span>
                </div>
              )}
            </>
          )}
          
          {/* 공통 속성 */}
          <div className="text-xs text-gray-600">
            <span className="font-medium">회전:</span>{' '}
            <span className="text-gray-500">{element.rotation}°</span>
          </div>
          <div className="text-xs text-gray-600">
            <span className="font-medium">Z-Index:</span>{' '}
            <span className="text-gray-500">{element.zIndex}</span>
          </div>
          <div className="text-xs text-gray-600">
            <span className="font-medium">잠금:</span>{' '}
            <span className="text-gray-500">{element.locked ? '예' : '아니오'}</span>
          </div>
          <div className="text-xs text-gray-600">
            <span className="font-medium">표시:</span>{' '}
            <span className="text-gray-500">{element.visible ? '예' : '아니오'}</span>
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

      {/* 텍스트 편집 안내 */}
      {element.type === 'text' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-xs text-green-700 font-medium mb-1">
            ✨ 텍스트 편집 방법
          </p>
          <p className="text-xs text-green-600">
            • 더블클릭: 텍스트 편집 시작<br/>
            • Enter: 줄바꿈<br/>
            • ESC: 편집 종료
          </p>
        </div>
      )}

      {/* 이미지 편집 안내 */}
      {element.type === 'image' && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <p className="text-xs text-purple-700 font-medium mb-1">
            🖼️ 이미지 편집 방법
          </p>
          <p className="text-xs text-purple-600">
            • 드래그: 이미지 이동<br/>
            • 선택 박스: 크기 조절 및 회전<br/>
            • 속성 편집: Phase 7 예정
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
  };
  return typeNames[type] || type;
}