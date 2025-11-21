// src/components/PropertiesPanel/ImageElementForm.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useBuilderStore } from '@/store/builderStore';
import type { Block } from '@/types';
import FormGroup, { SliderFormGroup } from './FormGroup';
import ImageUploader from '@/components/ImageUploader';

interface ImageElementFormProps {
  block: Block;
  elementPath: string;  // 예: "image", "backgroundImage", "images.0"
}

export default function ImageElementForm({ block, elementPath }: ImageElementFormProps) {
  const { updateBlock } = useBuilderStore();

  // elementPath에서 값 가져오기
  const getValue = (path: string, obj: any): any => {
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
      value = value?.[key];
    }
    return value;
  };

  // elementPath에 값 설정하기
  const setValue = (path: string, obj: any, value: any): any => {
    const keys = path.split('.');
    const newObj = JSON.parse(JSON.stringify(obj));
    
    let current = newObj;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    return newObj;
  };

  const currentImageUrl = getValue(elementPath.replace('image', 'imageUrl'), block.content) || '';

  const { register, watch, setValue: setFormValue } = useForm({
    defaultValues: {
      imageUrl: currentImageUrl,
      objectFit: 'cover' as 'cover' | 'contain' | 'fill' | 'none',
      width: 'auto',
      height: 'auto',
      borderRadius: 0,
      alt: '',
    },
  });

  // 실시간 업데이트
  useEffect(() => {
    const subscription = watch((value) => {
      if (value.imageUrl !== undefined) {
        let newContent = { ...block.content };
        
        // "image" → "imageUrl"로 변환
        const urlPath = elementPath.includes('image') 
          ? elementPath.replace('image', 'imageUrl')
          : elementPath;
        
        newContent = setValue(urlPath, newContent, value.imageUrl);
        updateBlock(block.id, { content: newContent });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, updateBlock, block.id, elementPath]);

  return (
    <div className="p-4 space-y-6">
      {/* 이미지 업로드 */}
      <FormGroup label="이미지" helpText="이미지를 업로드하거나 URL을 입력하세요">
        <ImageUploader
          value={watch('imageUrl')}
          onChange={(value) => setFormValue('imageUrl', value)}
          maxSizeMB={2}
          placeholder="https://example.com/image.jpg"
        />
      </FormGroup>

      <div className="border-t border-gray-200 pt-6"></div>

      {/* Object Fit (이미지 채우기 방식) */}
      <FormGroup label="이미지 맞춤 방식" helpText="이미지가 영역에 채워지는 방식을 선택하세요">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setFormValue('objectFit', 'cover')}
            className={`px-3 py-2 text-sm rounded-lg border-2 transition-all
              ${watch('objectFit') === 'cover'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
          >
            Cover (꽉 채우기)
          </button>
          <button
            type="button"
            onClick={() => setFormValue('objectFit', 'contain')}
            className={`px-3 py-2 text-sm rounded-lg border-2 transition-all
              ${watch('objectFit') === 'contain'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
          >
            Contain (전체 보기)
          </button>
          <button
            type="button"
            onClick={() => setFormValue('objectFit', 'fill')}
            className={`px-3 py-2 text-sm rounded-lg border-2 transition-all
              ${watch('objectFit') === 'fill'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
          >
            Fill (늘려서 채우기)
          </button>
          <button
            type="button"
            onClick={() => setFormValue('objectFit', 'none')}
            className={`px-3 py-2 text-sm rounded-lg border-2 transition-all
              ${watch('objectFit') === 'none'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
          >
            None (원본 크기)
          </button>
        </div>
      </FormGroup>

      <div className="border-t border-gray-200 pt-6"></div>

      {/* 크기 */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">크기</h3>
        
        <FormGroup label="너비">
          <div className="flex gap-2">
            <input
              {...register('width')}
              type="text"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: 100%, 600px, auto"
            />
            <button
              type="button"
              onClick={() => setFormValue('width', '100%')}
              className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            >
              100%
            </button>
          </div>
        </FormGroup>

        <FormGroup label="높이">
          <div className="flex gap-2">
            <input
              {...register('height')}
              type="text"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: 400px, auto"
            />
            <button
              type="button"
              onClick={() => setFormValue('height', 'auto')}
              className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            >
              Auto
            </button>
          </div>
        </FormGroup>
      </div>

      <div className="border-t border-gray-200 pt-6"></div>

      {/* 스타일 */}
      <SliderFormGroup
        label="모서리 둥글기"
        value={watch('borderRadius')}
        min={0}
        max={50}
        onChange={(value) => setFormValue('borderRadius', value)}
      />

      {/* Alt 텍스트 (접근성) */}
      <FormGroup label="대체 텍스트 (Alt)" helpText="이미지를 설명하는 텍스트 (접근성)">
        <input
          {...register('alt')}
          type="text"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="예: 카페 내부 사진"
        />
      </FormGroup>

      {/* 미리보기 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">미리보기</p>
        {watch('imageUrl') ? (
          <div className="flex justify-center">
            <img
              src={watch('imageUrl')}
              alt={watch('alt')}
              className="max-w-full"
              style={{
                objectFit: watch('objectFit'),
                width: watch('width'),
                height: watch('height') === 'auto' ? '200px' : watch('height'),
                borderRadius: `${watch('borderRadius')}px`,
              }}
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/400x300/e5e7eb/9ca3af?text=Error';
              }}
            />
          </div>
        ) : (
          <div className="h-40 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
            이미지 없음
          </div>
        )}
      </div>

      {/* 안내 메시지 */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 <strong>팁:</strong> 이미지를 드래그 앤 드롭하거나 URL을 입력할 수 있습니다.
        </p>
      </div>
    </div>
  );
}