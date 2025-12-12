import { useBuilderStore } from '../../store/builderStore';
import type { Shape } from '../../types';
import { FormGroup, ColorInput, RangeInput, NumberInput } from './FormGroup';

interface ShapePropertiesFormProps {
  shape: Shape;
}

export default function ShapePropertiesForm({ shape }: ShapePropertiesFormProps) {
  const { updateElement } = useBuilderStore();

  const handleStyleUpdate = (styleUpdates: Partial<Shape['style']>) => {
    updateElement(shape.id, {
      style: {
        ...shape.style,
        ...styleUpdates,
      },
    });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
        도형 속성
      </h4>

      {/* Fill Color */}
      <FormGroup label="채우기 색상">
        <ColorInput
          value={shape.style.fill}
          onChange={(val) => handleStyleUpdate({ fill: val })}
        />
      </FormGroup>

      {/* Stroke Color */}
      <FormGroup label="테두리 색상">
        <ColorInput
          value={shape.style.stroke}
          onChange={(val) => handleStyleUpdate({ stroke: val })}
        />
      </FormGroup>

      {/* Stroke Width */}
      <FormGroup label="테두리 두께">
        <div className="space-y-2">
          <NumberInput
            value={shape.style.strokeWidth}
            onChange={(val) => handleStyleUpdate({ strokeWidth: val })}
            min={0}
            max={20}
            step={1}
          />
          <RangeInput
            value={shape.style.strokeWidth}
            onChange={(val) => handleStyleUpdate({ strokeWidth: val })}
            min={0}
            max={20}
            step={1}
            displayValue={`${shape.style.strokeWidth}px`}
          />
        </div>
      </FormGroup>

      {/* Border Radius - rectangle만 */}
      {shape.shapeType === 'rectangle' && (
        <FormGroup label="모서리 둥글기">
          <div className="space-y-2">
            <NumberInput
              value={shape.style.borderRadius}
              onChange={(val) => handleStyleUpdate({ borderRadius: val })}
              min={0}
              max={100}
              step={1}
            />
            <RangeInput
              value={shape.style.borderRadius}
              onChange={(val) => handleStyleUpdate({ borderRadius: val })}
              min={0}
              max={100}
              step={1}
              displayValue={`${shape.style.borderRadius}px`}
            />
          </div>
        </FormGroup>
      )}

      {/* Opacity */}
      <FormGroup label="투명도">
        <div className="space-y-2">
          <NumberInput
            value={Math.round(shape.style.opacity * 100)}
            onChange={(val) => handleStyleUpdate({ opacity: val / 100 })}
            min={0}
            max={100}
            step={1}
          />
          <RangeInput
            value={shape.style.opacity}
            onChange={(val) => handleStyleUpdate({ opacity: val })}
            min={0}
            max={1}
            step={0.01}
            displayValue={`${Math.round(shape.style.opacity * 100)}%`}
          />
        </div>
      </FormGroup>

      {/* 도형 타입 표시 */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-4">
        <p className="text-xs text-gray-600">
          <span className="font-medium">도형 타입:</span>{' '}
          {shape.shapeType === 'rectangle' && '사각형'}
          {shape.shapeType === 'circle' && '원'}
          {shape.shapeType === 'triangle' && '삼각형'}
        </p>
      </div>
    </div>
  );
}
