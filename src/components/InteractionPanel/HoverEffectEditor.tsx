import { useState, useEffect } from 'react';
import type { HoverEffectAction, EasingFunction } from '../../types';

interface HoverEffectEditorProps {
  initialData?: HoverEffectAction;
  onChange: (data: HoverEffectAction) => void;
}

export default function HoverEffectEditor({ initialData, onChange }: HoverEffectEditorProps) {
  // 호버 스타일 상태
  const [enableFill, setEnableFill] = useState(!!initialData?.hoverStyles.fill);
  const [fill, setFill] = useState(initialData?.hoverStyles.fill || '#3b82f6');

  const [enableStroke, setEnableStroke] = useState(!!initialData?.hoverStyles.stroke);
  const [stroke, setStroke] = useState(initialData?.hoverStyles.stroke || '#1e40af');

  const [enableColor, setEnableColor] = useState(!!initialData?.hoverStyles.color);
  const [color, setColor] = useState(initialData?.hoverStyles.color || '#ffffff');

  const [enableOpacity, setEnableOpacity] = useState(
    initialData?.hoverStyles.opacity !== undefined
  );
  const [opacity, setOpacity] = useState(
    initialData?.hoverStyles.opacity !== undefined ? initialData.hoverStyles.opacity : 0.8
  );

  const [enableScale, setEnableScale] = useState(
    initialData?.hoverStyles.scale !== undefined
  );
  const [scale, setScale] = useState(
    initialData?.hoverStyles.scale !== undefined ? initialData.hoverStyles.scale : 1.05
  );

  // 트랜지션 상태
  const [duration, setDuration] = useState(initialData?.transition.duration || 200);
  const [easing, setEasing] = useState<EasingFunction>(
    initialData?.transition.easing || 'ease'
  );

  useEffect(() => {
    const hoverStyles: HoverEffectAction['hoverStyles'] = {};

    if (enableFill) hoverStyles.fill = fill;
    if (enableStroke) hoverStyles.stroke = stroke;
    if (enableColor) hoverStyles.color = color;
    if (enableOpacity) hoverStyles.opacity = opacity;
    if (enableScale) hoverStyles.scale = scale;

    onChange({
      type: 'hover-effect',
      hoverStyles,
      transition: {
        duration,
        easing,
      },
    });
  }, [enableFill, fill, enableStroke, stroke, enableColor, color, enableOpacity, opacity, enableScale, scale, duration, easing, onChange]);

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-600 mb-3">
        호버 시 변경할 스타일을 선택하세요
      </p>

      {/* Fill (배경색) */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="enable-fill"
          checked={enableFill}
          onChange={(e) => setEnableFill(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="enable-fill" className="flex-1 text-sm font-medium text-gray-700">
          배경색 변경
        </label>
        {enableFill && (
          <input
            type="color"
            value={fill}
            onChange={(e) => setFill(e.target.value)}
            className="w-12 h-8 rounded border border-gray-300"
          />
        )}
      </div>

      {/* Stroke (테두리색) */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="enable-stroke"
          checked={enableStroke}
          onChange={(e) => setEnableStroke(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="enable-stroke" className="flex-1 text-sm font-medium text-gray-700">
          테두리색 변경
        </label>
        {enableStroke && (
          <input
            type="color"
            value={stroke}
            onChange={(e) => setStroke(e.target.value)}
            className="w-12 h-8 rounded border border-gray-300"
          />
        )}
      </div>

      {/* Color (텍스트색) */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="enable-color"
          checked={enableColor}
          onChange={(e) => setEnableColor(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="enable-color" className="flex-1 text-sm font-medium text-gray-700">
          텍스트색 변경
        </label>
        {enableColor && (
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-8 rounded border border-gray-300"
          />
        )}
      </div>

      {/* Opacity */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="enable-opacity"
          checked={enableOpacity}
          onChange={(e) => setEnableOpacity(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="enable-opacity" className="flex-1 text-sm font-medium text-gray-700">
          투명도 변경
        </label>
        {enableOpacity && (
          <input
            type="number"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            min="0"
            max="1"
            step="0.1"
            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      {/* Scale */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="enable-scale"
          checked={enableScale}
          onChange={(e) => setEnableScale(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="enable-scale" className="flex-1 text-sm font-medium text-gray-700">
          크기 변경
        </label>
        {enableScale && (
          <input
            type="number"
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            min="0.1"
            max="3"
            step="0.05"
            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      {/* 트랜지션 설정 */}
      <div className="border-t border-gray-200 pt-3 mt-4">
        <p className="text-xs font-medium text-gray-700 mb-2">트랜지션 설정</p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              지속 시간 (ms)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min="0"
              step="50"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              이징 함수
            </label>
            <select
              value={easing}
              onChange={(e) => setEasing(e.target.value as EasingFunction)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="linear">Linear</option>
              <option value="ease">Ease</option>
              <option value="ease-in">Ease In</option>
              <option value="ease-out">Ease Out</option>
              <option value="ease-in-out">Ease In Out</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
