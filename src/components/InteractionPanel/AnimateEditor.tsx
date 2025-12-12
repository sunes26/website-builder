import { useState, useEffect } from 'react';
import type { AnimateAction, AnimationType, EasingFunction } from '../../types';

interface AnimateEditorProps {
  initialData?: AnimateAction;
  onChange: (data: AnimateAction) => void;
}

export default function AnimateEditor({ initialData, onChange }: AnimateEditorProps) {
  const [animationType, setAnimationType] = useState<AnimationType>(
    initialData?.animationType || 'fade-in'
  );
  const [duration, setDuration] = useState(initialData?.duration || 300);
  const [delay, setDelay] = useState(initialData?.delay || 0);
  const [easing, setEasing] = useState<EasingFunction>(
    initialData?.easing || 'ease'
  );
  const [repeat, setRepeat] = useState(initialData?.repeat || 1);

  useEffect(() => {
    onChange({
      type: 'animate',
      animationType,
      duration,
      delay,
      easing,
      repeat,
    });
  }, [animationType, duration, delay, easing, repeat, onChange]);

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          애니메이션 타입
        </label>
        <select
          value={animationType}
          onChange={(e) => setAnimationType(e.target.value as AnimationType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <optgroup label="페이드">
            <option value="fade-in">페이드 인</option>
            <option value="fade-out">페이드 아웃</option>
          </optgroup>
          <optgroup label="슬라이드">
            <option value="slide-up">위로 슬라이드</option>
            <option value="slide-down">아래로 슬라이드</option>
            <option value="slide-left">왼쪽으로 슬라이드</option>
            <option value="slide-right">오른쪽으로 슬라이드</option>
          </optgroup>
          <optgroup label="스케일">
            <option value="scale-up">확대</option>
            <option value="scale-down">축소</option>
          </optgroup>
          <optgroup label="기타">
            <option value="rotate">회전</option>
          </optgroup>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            지속 시간 (ms)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min="0"
            step="50"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            지연 시간 (ms)
          </label>
          <input
            type="number"
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            min="0"
            step="50"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          이징 함수
        </label>
        <select
          value={easing}
          onChange={(e) => setEasing(e.target.value as EasingFunction)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="linear">Linear (일정)</option>
          <option value="ease">Ease (기본)</option>
          <option value="ease-in">Ease In (가속)</option>
          <option value="ease-out">Ease Out (감속)</option>
          <option value="ease-in-out">Ease In Out (가속-감속)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          반복 횟수
        </label>
        <input
          type="number"
          value={repeat}
          onChange={(e) => setRepeat(Number(e.target.value))}
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          0 = 무한 반복
        </p>
      </div>
    </div>
  );
}
