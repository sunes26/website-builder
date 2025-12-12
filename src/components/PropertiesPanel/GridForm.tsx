import { useBuilderStore } from '../../store/builderStore';
import type { GridLayout } from '../../types';

interface GridFormProps {
  elementId: string;
  layout: GridLayout;
}

export default function GridForm({ elementId, layout }: GridFormProps) {
  const { setLayout } = useBuilderStore();

  const updateLayout = (updates: Partial<GridLayout>) => {
    setLayout(elementId, {
      ...layout,
      ...updates,
    });
  };

  // Grid 프리셋
  const applyPreset = (columns: string, rows: string = 'auto') => {
    updateLayout({
      gridTemplateColumns: columns,
      gridTemplateRows: rows,
    });
  };

  return (
    <div className="space-y-4">
      {/* Grid Presets */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Quick Presets
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => applyPreset('1fr 1fr')}
            className="px-3 py-2 text-xs rounded border bg-white text-gray-700 border-gray-300 hover:border-blue-300"
          >
            2 Columns
          </button>
          <button
            onClick={() => applyPreset('1fr 1fr 1fr')}
            className="px-3 py-2 text-xs rounded border bg-white text-gray-700 border-gray-300 hover:border-blue-300"
          >
            3 Columns
          </button>
          <button
            onClick={() => applyPreset('1fr 1fr 1fr 1fr')}
            className="px-3 py-2 text-xs rounded border bg-white text-gray-700 border-gray-300 hover:border-blue-300"
          >
            4 Columns
          </button>
          <button
            onClick={() => applyPreset('repeat(auto-fit, minmax(200px, 1fr))')}
            className="px-3 py-2 text-xs rounded border bg-white text-gray-700 border-gray-300 hover:border-blue-300"
          >
            Auto Fit
          </button>
        </div>
      </div>

      {/* Template Columns */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Template Columns
        </label>
        <input
          type="text"
          value={layout.gridTemplateColumns}
          onChange={(e) => updateLayout({ gridTemplateColumns: e.target.value })}
          placeholder="1fr 1fr 1fr"
          className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Examples: "1fr 1fr", "200px auto 1fr", "repeat(3, 1fr)"
        </p>
      </div>

      {/* Template Rows */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Template Rows
        </label>
        <input
          type="text"
          value={layout.gridTemplateRows}
          onChange={(e) => updateLayout({ gridTemplateRows: e.target.value })}
          placeholder="auto"
          className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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

      {/* Advanced Settings */}
      <details className="text-xs">
        <summary className="cursor-pointer text-gray-600 hover:text-gray-800 mb-2">
          Advanced Settings
        </summary>
        <div className="space-y-3 mt-2 pl-2 border-l-2 border-gray-200">
          {/* Row Gap & Column Gap */}
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

          {/* Justify Items */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Justify Items
            </label>
            <select
              value={layout.justifyItems ?? 'stretch'}
              onChange={(e) => updateLayout({ justifyItems: e.target.value as GridLayout['justifyItems'] })}
              className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="start">Start</option>
              <option value="end">End</option>
              <option value="center">Center</option>
              <option value="stretch">Stretch</option>
            </select>
          </div>

          {/* Align Items */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Align Items
            </label>
            <select
              value={layout.alignItems ?? 'stretch'}
              onChange={(e) => updateLayout({ alignItems: e.target.value as GridLayout['alignItems'] })}
              className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="start">Start</option>
              <option value="end">End</option>
              <option value="center">Center</option>
              <option value="stretch">Stretch</option>
            </select>
          </div>

          {/* Grid Auto Flow */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Auto Flow
            </label>
            <select
              value={layout.gridAutoFlow ?? 'row'}
              onChange={(e) => updateLayout({ gridAutoFlow: e.target.value as GridLayout['gridAutoFlow'] })}
              className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="row">Row</option>
              <option value="column">Column</option>
              <option value="dense">Dense</option>
              <option value="row dense">Row Dense</option>
              <option value="column dense">Column Dense</option>
            </select>
          </div>
        </div>
      </details>
    </div>
  );
}
