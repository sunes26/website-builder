import { useBuilderStore } from '../../store/builderStore';
import type { ImageElement } from '../../types';
import { FormGroup, TextInput } from './FormGroup';

interface ImagePropertiesFormProps {
  image: ImageElement;
}

export default function ImagePropertiesForm({ image }: ImagePropertiesFormProps) {
  const { updateElement } = useBuilderStore();

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
        이미지 속성
      </h4>

      {/* Image Preview */}
      {image.src && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
            <img
              src={image.src}
              alt={image.alt || '미리보기'}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Alt Text */}
      <FormGroup label="대체 텍스트 (Alt)">
        <TextInput
          value={image.alt}
          onChange={(val) => updateElement(image.id, { alt: val })}
          placeholder="이미지 설명"
        />
      </FormGroup>

      {/* Image Source Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-xs text-gray-700 font-medium mb-1">이미지 소스</p>
        <p className="text-xs text-gray-600 break-all">
          {image.src ? (
            <>
              Data URL (길이: {image.src.length} 문자)
              <br />
              <span className="text-gray-500">
                {image.src.substring(0, 50)}...
              </span>
            </>
          ) : (
            '(없음)'
          )}
        </p>
      </div>

      {/* 이미지 편집 안내 */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-4">
        <p className="text-xs text-purple-700 font-medium mb-1">
          🖼️ 이미지 편집 방법
        </p>
        <p className="text-xs text-purple-600">
          • 드래그: 이미지 이동
          <br />
          • 선택 박스: 크기 조절 및 회전
          <br />• 대체 텍스트는 여기서 수정 가능
        </p>
      </div>
    </div>
  );
}
