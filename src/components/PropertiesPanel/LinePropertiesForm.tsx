import { useBuilderStore } from '../../store/builderStore';
import type { LineElement, ArrowElement } from '../../types';
import { FormGroup, ColorInput, RangeInput, NumberInput } from './FormGroup';

interface LinePropertiesFormProps {
  line: LineElement | ArrowElement;
}

export default function LinePropertiesForm({ line }: LinePropertiesFormProps) {
  const { updateElement } = useBuilderStore();

  const isArrow = line.type === 'arrow';

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
        {isArrow ? '화살표' : '선'} 속성
      </h4>

      {/* Start/End Points - 읽기 전용 */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-xs text-gray-700 font-medium mb-2">시작점 / 끝점</p>
        <div className="space-y-1 text-xs text-gray-600">
          <div>
            <span className="font-medium">시작:</span> X: {Math.round(line.startPoint.x)}, Y:{' '}
            {Math.round(line.startPoint.y)}
          </div>
          <div>
            <span className="font-medium">끝:</span> X: {Math.round(line.endPoint.x)}, Y:{' '}
            {Math.round(line.endPoint.y)}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 캔버스에서 드래그하여 조절 가능
        </p>
      </div>

      {/* Stroke Color */}
      <FormGroup label="선 색상">
        <ColorInput
          value={line.strokeColor}
          onChange={(val) => updateElement(line.id, { strokeColor: val })}
        />
      </FormGroup>

      {/* Stroke Width */}
      <FormGroup label="선 두께">
        <div className="space-y-2">
          <NumberInput
            value={line.strokeWidth}
            onChange={(val) => updateElement(line.id, { strokeWidth: val })}
            min={1}
            max={20}
            step={1}
          />
          <RangeInput
            value={line.strokeWidth}
            onChange={(val) => updateElement(line.id, { strokeWidth: val })}
            min={1}
            max={20}
            step={1}
            displayValue={`${line.strokeWidth}px`}
          />
        </div>
      </FormGroup>

      {/* Opacity */}
      <FormGroup label="투명도">
        <div className="space-y-2">
          <NumberInput
            value={Math.round(line.opacity * 100)}
            onChange={(val) => updateElement(line.id, { opacity: val / 100 })}
            min={0}
            max={100}
            step={1}
          />
          <RangeInput
            value={line.opacity}
            onChange={(val) => updateElement(line.id, { opacity: val })}
            min={0}
            max={1}
            step={0.01}
            displayValue={`${Math.round(line.opacity * 100)}%`}
          />
        </div>
      </FormGroup>

      {/* Arrow Head Size - 화살표만 */}
      {isArrow && (
        <FormGroup label="화살표 머리 크기">
          <div className="space-y-2">
            <NumberInput
              value={(line as ArrowElement).arrowHeadSize}
              onChange={(val) => updateElement(line.id, { arrowHeadSize: val })}
              min={5}
              max={50}
              step={1}
            />
            <RangeInput
              value={(line as ArrowElement).arrowHeadSize}
              onChange={(val) => updateElement(line.id, { arrowHeadSize: val })}
              min={5}
              max={50}
              step={1}
              displayValue={`${(line as ArrowElement).arrowHeadSize}px`}
            />
          </div>
        </FormGroup>
      )}
    </div>
  );
}
