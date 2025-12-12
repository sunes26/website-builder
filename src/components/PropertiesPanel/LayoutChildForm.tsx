import { useBuilderStore } from '../../store/builderStore';
import type { CanvasElement, FlexChildProps, GridChildProps } from '../../types';
import { isFlexContainer, isGridContainer } from '../../utils/layoutCalculator';

interface LayoutChildFormProps {
  element: CanvasElement;
}

export default function LayoutChildForm({ element }: LayoutChildFormProps) {
  const { elements } = useBuilderStore();

  // 부모 컨테이너 찾기
  const parent = elements.find((el) => {
    if (el.type === 'group' || el.type === 'component') {
      return el.childElementIds?.includes(element.id);
    }
    return false;
  });

  // 부모가 레이아웃 컨테이너가 아니면 렌더링하지 않음
  if (!parent || !parent.layout) {
    return null;
  }

  const isFlexParent = isFlexContainer(parent);
  const isGridParent = isGridContainer(parent);

  if (!isFlexParent && !isGridParent) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <h4 className="text-xs font-semibold text-gray-800 mb-3">
        Layout Child Properties
      </h4>

      {isFlexParent && (
        <FlexChildProperties element={element} />
      )}

      {isGridParent && (
        <GridChildProperties element={element} />
      )}
    </div>
  );
}

// Flex Child Properties
function FlexChildProperties({ element }: { element: CanvasElement }) {
  const { setLayoutChild } = useBuilderStore();

  const flexProps: FlexChildProps = (element.layoutChild && 'flexGrow' in element.layoutChild)
    ? element.layoutChild
    : {};

  const updateFlexChild = (updates: Partial<FlexChildProps>) => {
    setLayoutChild(element.id, {
      ...flexProps,
      ...updates,
    });
  };

  return (
    <div className="space-y-3">
      {/* Flex Grow */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Flex Grow: {flexProps.flexGrow ?? 0}
        </label>
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={flexProps.flexGrow ?? 0}
          onChange={(e) => updateFlexChild({ flexGrow: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Flex Shrink */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Flex Shrink: {flexProps.flexShrink ?? 1}
        </label>
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={flexProps.flexShrink ?? 1}
          onChange={(e) => updateFlexChild({ flexShrink: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Flex Basis */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Flex Basis
        </label>
        <input
          type="text"
          value={flexProps.flexBasis ?? 'auto'}
          onChange={(e) => updateFlexChild({ flexBasis: e.target.value })}
          placeholder="auto, 200px, 50%"
          className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Align Self */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Align Self
        </label>
        <select
          value={flexProps.alignSelf ?? 'auto'}
          onChange={(e) => updateFlexChild({ alignSelf: e.target.value as FlexChildProps['alignSelf'] })}
          className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="auto">Auto</option>
          <option value="flex-start">Flex Start</option>
          <option value="flex-end">Flex End</option>
          <option value="center">Center</option>
          <option value="baseline">Baseline</option>
          <option value="stretch">Stretch</option>
        </select>
      </div>

      {/* Order */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Order
        </label>
        <input
          type="number"
          value={flexProps.order ?? 0}
          onChange={(e) => updateFlexChild({ order: parseInt(e.target.value) })}
          className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

// Grid Child Properties
function GridChildProperties({ element }: { element: CanvasElement }) {
  const { setLayoutChild } = useBuilderStore();

  const gridProps: GridChildProps = (element.layoutChild && 'gridColumn' in element.layoutChild)
    ? element.layoutChild
    : {};

  const updateGridChild = (updates: Partial<GridChildProps>) => {
    setLayoutChild(element.id, {
      ...gridProps,
      ...updates,
    });
  };

  return (
    <div className="space-y-3">
      {/* Grid Column */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Grid Column
        </label>
        <input
          type="text"
          value={gridProps.gridColumn ?? 'auto'}
          onChange={(e) => updateGridChild({ gridColumn: e.target.value })}
          placeholder="auto, 1 / 3, span 2"
          className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Examples: "1 / 3" (column 1 to 3), "span 2" (span 2 columns)
        </p>
      </div>

      {/* Grid Row */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Grid Row
        </label>
        <input
          type="text"
          value={gridProps.gridRow ?? 'auto'}
          onChange={(e) => updateGridChild({ gridRow: e.target.value })}
          placeholder="auto, 1 / 3, span 2"
          className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Justify Self */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Justify Self
        </label>
        <select
          value={gridProps.justifySelf ?? 'stretch'}
          onChange={(e) => updateGridChild({ justifySelf: e.target.value as GridChildProps['justifySelf'] })}
          className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="start">Start</option>
          <option value="end">End</option>
          <option value="center">Center</option>
          <option value="stretch">Stretch</option>
        </select>
      </div>

      {/* Align Self */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Align Self
        </label>
        <select
          value={gridProps.alignSelf ?? 'stretch'}
          onChange={(e) => updateGridChild({ alignSelf: e.target.value as GridChildProps['alignSelf'] })}
          className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="start">Start</option>
          <option value="end">End</option>
          <option value="center">Center</option>
          <option value="stretch">Stretch</option>
        </select>
      </div>

      {/* Quick Span Buttons */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Quick Span
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((span) => (
            <button
              key={span}
              onClick={() => updateGridChild({ gridColumn: `span ${span}` })}
              className="px-2 py-1 text-xs rounded border bg-white text-gray-700 border-gray-300 hover:border-purple-300"
            >
              Span {span}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
