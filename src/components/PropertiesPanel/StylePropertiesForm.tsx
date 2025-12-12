import { useBuilderStore } from '../../store/builderStore';
import { X } from 'lucide-react';
import type { CanvasElement } from '../../types';

/**
 * 스타일 속성 폼 (Phase 15: CSS 클래스 & 애니메이션 관리)
 *
 * 요소에 적용된 CSS 클래스와 애니메이션을 관리하는 UI
 */
interface StylePropertiesFormProps {
  element: CanvasElement;
}

export default function StylePropertiesForm({ element }: StylePropertiesFormProps) {
  const {
    cssClasses,
    keyframeAnimations,
    addClassToElement,
    removeClassFromElement,
    applyAnimationToElement,
    removeAnimationFromElement,
  } = useBuilderStore();

  // 요소에 적용된 클래스들
  const appliedClasses = element.classNames || [];
  const appliedClassObjects = appliedClasses
    .map((classId) => cssClasses.find((c) => c.id === classId))
    .filter((c) => c !== undefined);

  // 요소에 적용되지 않은 클래스들
  const availableClasses = cssClasses.filter((c) => !appliedClasses.includes(c.id));

  // 요소에 적용된 애니메이션
  const appliedAnimation = element.animationName
    ? keyframeAnimations.find((a) => a.id === element.animationName)
    : null;

  // 요소에 적용되지 않은 애니메이션들
  const availableAnimations = keyframeAnimations.filter((a) => a.id !== element.animationName);

  const handleAddClass = (classId: string) => {
    addClassToElement(element.id, classId);
  };

  const handleRemoveClass = (classId: string) => {
    removeClassFromElement(element.id, classId);
  };

  const handleApplyAnimation = (animationId: string) => {
    applyAnimationToElement(element.id, animationId);
  };

  const handleRemoveAnimation = () => {
    removeAnimationFromElement(element.id);
  };

  return (
    <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
      <h4 className="text-sm font-semibold text-gray-800">스타일</h4>

      {/* CSS 클래스 섹션 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-700">CSS 클래스</label>
          {cssClasses.length === 0 && (
            <span className="text-xs text-gray-400">클래스 탭에서 생성</span>
          )}
        </div>

        {/* 적용된 클래스 */}
        {appliedClassObjects.length > 0 && (
          <div className="space-y-1 mb-2">
            {appliedClassObjects.map((cls) => (
              <div
                key={cls.id}
                className="flex items-center justify-between px-2 py-1.5 bg-blue-50 border border-blue-200 rounded text-xs"
              >
                <span className="font-medium text-blue-800">{cls.name}</span>
                <button
                  onClick={() => handleRemoveClass(cls.id)}
                  className="p-0.5 hover:bg-blue-100 rounded text-blue-600"
                  title="제거"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 클래스 추가 드롭다운 */}
        {availableClasses.length > 0 ? (
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) {
                handleAddClass(e.target.value);
              }
            }}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">클래스 추가...</option>
            {availableClasses.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        ) : appliedClassObjects.length === 0 ? (
          <div className="text-xs text-gray-500 text-center py-2 bg-gray-50 rounded border border-gray-200">
            사용 가능한 클래스가 없습니다
          </div>
        ) : null}
      </div>

      {/* 애니메이션 섹션 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-700">애니메이션</label>
          {keyframeAnimations.length === 0 && (
            <span className="text-xs text-gray-400">애니메이션 탭에서 생성</span>
          )}
        </div>

        {/* 적용된 애니메이션 */}
        {appliedAnimation ? (
          <div className="mb-2">
            <div className="flex items-center justify-between px-2 py-1.5 bg-purple-50 border border-purple-200 rounded text-xs">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-purple-800">{appliedAnimation.name}</div>
                <div className="text-purple-600 text-[10px] mt-0.5">
                  {appliedAnimation.duration}ms · {appliedAnimation.iterationCount === 'infinite' ? '무한' : `${appliedAnimation.iterationCount}회`}
                </div>
              </div>
              <button
                onClick={handleRemoveAnimation}
                className="p-0.5 hover:bg-purple-100 rounded text-purple-600"
                title="제거"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ) : null}

        {/* 애니메이션 추가 드롭다운 */}
        {!appliedAnimation && availableAnimations.length > 0 ? (
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) {
                handleApplyAnimation(e.target.value);
              }
            }}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">애니메이션 추가...</option>
            {availableAnimations.map((anim) => (
              <option key={anim.id} value={anim.id}>
                {anim.name} ({anim.duration}ms)
              </option>
            ))}
          </select>
        ) : !appliedAnimation && keyframeAnimations.length === 0 ? (
          <div className="text-xs text-gray-500 text-center py-2 bg-gray-50 rounded border border-gray-200">
            사용 가능한 애니메이션이 없습니다
          </div>
        ) : null}
      </div>
    </div>
  );
}
