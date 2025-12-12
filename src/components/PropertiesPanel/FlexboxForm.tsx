import { useBuilderStore } from '../../store/builderStore';
import type { FlexboxLayout } from '../../types';

interface FlexboxFormProps {
  elementId: string;
  layout: FlexboxLayout;
}

export default function FlexboxForm({ elementId, layout }: FlexboxFormProps) {
  const { setLayout } = useBuilderStore();

  const updateLayout = (updates: Partial<FlexboxLayout>) => {
    setLayout(elementId, {
      ...layout,
      ...updates,
    });
  };

  return (
    <div className="space-y-4">
      {/* Flex Direction */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Direction
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['row', 'column', 'row-reverse', 'column-reverse'].map((dir) => (
            <button
              key={dir}
              onClick={() => updateLayout({ flexDirection: dir as FlexboxLayout['flexDirection'] })}
              className={`px-3 py-2 text-xs rounded border ${
                layout.flexDirection === dir
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
              }`}
            >
              {dir.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Justify Content */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Justify Content
        </label>
        <select
          value={layout.justifyContent}
          onChange={(e) => updateLayout({ justifyContent: e.target.value as FlexboxLayout['justifyContent'] })}
          className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="flex-start">Flex Start</option>
          <option value="flex-end">Flex End</option>
          <option value="center">Center</option>
          <option value="space-between">Space Between</option>
          <option value="space-around">Space Around</option>
          <option value="space-evenly">Space Evenly</option>
        </select>
      </div>

      {/* Align Items */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Align Items
        </label>
        <select
          value={layout.alignItems}
          onChange={(e) => updateLayout({ alignItems: e.target.value as FlexboxLayout['alignItems'] })}
          className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="flex-start">Flex Start</option>
          <option value="flex-end">Flex End</option>
          <option value="center">Center</option>
          <option value="baseline">Baseline</option>
          <option value="stretch">Stretch</option>
        </select>
      </div>

      {/* Flex Wrap */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Wrap
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['nowrap', 'wrap', 'wrap-reverse'].map((wrap) => (
            <button
              key={wrap}
              onClick={() => updateLayout({ flexWrap: wrap as FlexboxLayout['flexWrap'] })}
              className={`px-3 py-2 text-xs rounded border ${
                layout.flexWrap === wrap
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
              }`}
            >
              {wrap.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Gap */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Gap: {layout.gap}px
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="4"
          value={layout.gap}
          onChange={(e) => updateLayout({ gap: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Advanced: Row Gap & Column Gap */}
      <details className="text-xs">
        <summary className="cursor-pointer text-gray-600 hover:text-gray-800 mb-2">
          Advanced Gap Settings
        </summary>
        <div className="space-y-3 mt-2 pl-2 border-l-2 border-gray-200">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Row Gap: {layout.rowGap ?? layout.gap}px
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="4"
              value={layout.rowGap ?? layout.gap}
              onChange={(e) => updateLayout({ rowGap: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Column Gap: {layout.columnGap ?? layout.gap}px
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="4"
              value={layout.columnGap ?? layout.gap}
              onChange={(e) => updateLayout({ columnGap: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </details>
    </div>
  );
}
