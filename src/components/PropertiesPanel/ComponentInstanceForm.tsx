import { useBuilderStore } from '../../store/builderStore';
import type { ComponentInstance } from '../../types';
import { Package, Link2Off, ExternalLink } from 'lucide-react';

interface ComponentInstanceFormProps {
  instance: ComponentInstance;
}

export default function ComponentInstanceForm({ instance }: ComponentInstanceFormProps) {
  const { components, detachComponentInstance } = useBuilderStore();

  // 마스터 컴포넌트 찾기
  const masterComponent = components.find(c => c.id === instance.componentId);

  const handleDetach = () => {
    if (confirm('컴포넌트 연결을 해제하시겠습니까?\n\n연결 해제 후에는 마스터 컴포넌트의 변경사항이 더 이상 반영되지 않습니다.')) {
      detachComponentInstance(instance.id);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
        컴포넌트 인스턴스
      </h4>

      {/* 마스터 컴포넌트 정보 */}
      {masterComponent ? (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 space-y-3">
          <div className="flex items-start gap-2">
            <Package size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-purple-900">
                {masterComponent.name}
              </p>
              {masterComponent.description && (
                <p className="text-xs text-purple-700 mt-1">
                  {masterComponent.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-purple-700">
            <ExternalLink size={12} />
            <span>마스터 컴포넌트에 연결됨</span>
          </div>

          {/* 컴포넌트 정보 */}
          <div className="pt-2 border-t border-purple-200 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-purple-700">요소 수:</span>
              <span className="font-medium text-purple-900">
                {masterComponent.elements.length}개
              </span>
            </div>
            {instance.overrides && Object.keys(instance.overrides).length > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-purple-700">오버라이드:</span>
                <span className="font-medium text-purple-900">
                  {Object.keys(instance.overrides).length}개 속성
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-xs text-red-700">
            ⚠️ 마스터 컴포넌트를 찾을 수 없습니다.
            <br />
            연결을 해제하거나 컴포넌트를 복원하세요.
          </p>
        </div>
      )}

      {/* 연결 상태 */}
      {instance.isDetached ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-gray-700">
            <Link2Off size={14} />
            <span className="text-xs font-medium">연결 해제됨</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            이 인스턴스는 마스터 컴포넌트에서 분리되었습니다.
          </p>
        </div>
      ) : (
        <button
          onClick={handleDetach}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <Link2Off size={16} />
          연결 해제
        </button>
      )}

      {/* 안내 메시지 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-700">
          💡 컴포넌트 인스턴스의 위치, 크기, 회전은 자유롭게 변경할 수 있습니다.
          <br />
          <br />
          마스터 컴포넌트가 업데이트되면 모든 인스턴스에 변경사항이 반영됩니다.
        </p>
      </div>
    </div>
  );
}
