import { useBuilderStore } from '../../store/builderStore';
import type { CanvasElement, FlexboxLayout, GridLayout } from '../../types';
import FlexboxForm from './FlexboxForm';
import GridForm from './GridForm';
import { canBeLayoutContainer } from '../../utils/layoutCalculator';

interface LayoutPropertiesFormProps {
  element: CanvasElement;
}

export default function LayoutPropertiesForm({ element }: LayoutPropertiesFormProps) {
  const { setLayout } = useBuilderStore();

  // 레이아웃 컨테이너가 될 수 없으면 렌더링하지 않음
  if (!canBeLayoutContainer(element)) {
    return null;
  }

  const currentLayout = element.layout;
  const layoutType = currentLayout?.type || 'none';

  // 레이아웃 타입 변경
  const changeLayoutType = (type: 'none' | 'flex' | 'grid') => {
    if (type === 'none') {
      setLayout(element.id, null);
      return;
    }

    if (type === 'flex') {
      const flexLayout: FlexboxLayout = {
        type: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        flexWrap: 'nowrap',
        gap: 16,
      };
      setLayout(element.id, flexLayout);
    } else if (type === 'grid') {
      const gridLayout: GridLayout = {
        type: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridTemplateRows: 'auto',
        gap: 16,
      };
      setLayout(element.id, gridLayout);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <h4 className="text-xs font-semibold text-gray-800 mb-3">
        Layout Container
      </h4>

      {/* Layout Type Selector */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Layout Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => changeLayoutType('none')}
            className={`px-3 py-2 text-xs rounded border ${
              layoutType === 'none'
                ? 'bg-gray-500 text-white border-gray-500'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
            }`}
          >
            None
          </button>
          <button
            onClick={() => changeLayoutType('flex')}
            className={`px-3 py-2 text-xs rounded border ${
              layoutType === 'flex'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
            }`}
          >
            Flexbox
          </button>
          <button
            onClick={() => changeLayoutType('grid')}
            className={`px-3 py-2 text-xs rounded border ${
              layoutType === 'grid'
                ? 'bg-purple-500 text-white border-purple-500'
                : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
            }`}
          >
            Grid
          </button>
        </div>
      </div>

      {/* Layout-specific Forms */}
      {currentLayout?.type === 'flex' && (
        <FlexboxForm elementId={element.id} layout={currentLayout} />
      )}

      {currentLayout?.type === 'grid' && (
        <GridForm elementId={element.id} layout={currentLayout} />
      )}

      {/* Info message when no layout */}
      {layoutType === 'none' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-600">
            Enable Flexbox or Grid layout to automatically position child elements.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Child elements will use absolute positioning by default.
          </p>
        </div>
      )}
    </div>
  );
}
