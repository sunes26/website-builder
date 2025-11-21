// src/components/PropertiesPanel/GalleryForm.tsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Image as ImageIcon, ChevronUp, ChevronDown } from 'lucide-react';
import { useBuilderStore } from '@/store/builderStore';
import type { Block, GalleryContent } from '@/types';
import FormGroup, { ColorPickerFormGroup } from './FormGroup';
import ImageUploader from '@/components/ImageUploader';

interface GalleryFormProps {
  block: Block;
}

export default function GalleryForm({ block }: GalleryFormProps) {
  const { updateBlock } = useBuilderStore();
  const content = block.content as GalleryContent;

  const { register, watch, setValue } = useForm<GalleryContent>({
    defaultValues: content,
  });

  // 현재 편집 중인 이미지 인덱스
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // 실시간 업데이트
  useEffect(() => {
    const subscription = watch((value) => {
      updateBlock(block.id, {
        content: value as GalleryContent,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateBlock, block.id]);

  const addImage = () => {
    const currentImages = watch('images') || [];
    setValue('images', [...currentImages, '']);
    setEditingIndex(currentImages.length); // 새 이미지를 편집 모드로
  };

  const removeImage = (index: number) => {
    const currentImages = watch('images') || [];
    setValue('images', currentImages.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const updateImage = (index: number, value: string) => {
    const currentImages = watch('images') || [];
    const newImages = [...currentImages];
    newImages[index] = value;
    setValue('images', newImages);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const currentImages = watch('images') || [];
    const newImages = [...currentImages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newImages.length) return;

    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    setValue('images', newImages);

    // 편집 중인 인덱스도 이동
    if (editingIndex === index) {
      setEditingIndex(targetIndex);
    } else if (editingIndex === targetIndex) {
      setEditingIndex(index);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* 갤러리 제목 */}
      <FormGroup label="갤러리 제목" helpText="갤러리 섹션의 제목입니다">
        <input
          {...register('title')}
          type="text"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="예: 우리의 작품들"
        />
      </FormGroup>

      <ColorPickerFormGroup
        label="제목 색상"
        value={watch('titleColor')}
        onChange={(value) => setValue('titleColor', value)}
        helpText="갤러리 제목의 색상을 선택하세요"
      />

      {/* 컬럼 수 */}
      <FormGroup label="컬럼 수" helpText="한 줄에 표시할 이미지 개수입니다">
        <div className="flex gap-2">
          {[2, 3, 4, 6].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setValue('columns', num)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all
                ${watch('columns') === num
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
            >
              {num}개
            </button>
          ))}
        </div>
      </FormGroup>

      <div className="border-t border-gray-200 pt-6"></div>

      {/* 이미지 목록 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
            이미지 목록 ({(watch('images') || []).length}개)
          </label>
          <button
            type="button"
            onClick={addImage}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-3 h-3" />
            이미지 추가
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {(watch('images') || []).map((imageUrl, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-2 transition-all ${
                editingIndex === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              {/* 헤더 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-600">
                    이미지 {index + 1}
                  </span>
                  {imageUrl && (
                    <span className="text-xs text-green-600">✓</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {/* 순서 변경 버튼 */}
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="위로 이동"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'down')}
                    disabled={index === (watch('images') || []).length - 1}
                    className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="아래로 이동"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {/* 삭제 버튼 */}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors ml-1"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 편집 모드 */}
              {editingIndex === index ? (
                <div className="space-y-2">
                  <ImageUploader
                    value={imageUrl}
                    onChange={(value) => updateImage(index, value)}
                    maxSizeMB={2}
                    placeholder={`https://example.com/image-${index + 1}.jpg`}
                  />
                  <button
                    type="button"
                    onClick={() => setEditingIndex(null)}
                    className="w-full px-3 py-1.5 text-xs font-medium text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    완료
                  </button>
                </div>
              ) : (
                /* 미리보기 모드 */
                <div
                  onClick={() => setEditingIndex(index)}
                  className="cursor-pointer group"
                >
                  {imageUrl ? (
                    <div className="relative rounded overflow-hidden border border-gray-300">
                      <img
                        src={imageUrl}
                        alt={`갤러리 이미지 ${index + 1}`}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/300x300/e5e7eb/9ca3af?text=Invalid';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                        <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          클릭하여 편집
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded hover:border-blue-400 hover:bg-blue-50 transition-all">
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1 text-gray-400" />
                        <p className="text-xs text-gray-500">클릭하여 이미지 추가</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {(watch('images')?.length || 0) === 0 && (
          <div className="p-8 text-center text-sm text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="mb-2">갤러리 이미지가 없습니다.</p>
            <button
              type="button"
              onClick={addImage}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              첫 번째 이미지 추가
            </button>
          </div>
        )}
      </div>

      {/* 미리보기 */}
      {(watch('images')?.length || 0) > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
            미리보기 (상위 {Math.min(watch('columns'), (watch('images') || []).length)}개)
          </p>
          <div 
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${watch('columns')}, 1fr)` }}
          >
            {(watch('images') || [])
              .filter(url => url.length > 0)
              .slice(0, watch('columns'))
              .map((imageUrl, index) => (
                <div key={index} className="aspect-square bg-gray-200 rounded overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={`미리보기 ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/100x100/e5e7eb/9ca3af?text=?';
                    }}
                  />
                </div>
              ))}
          </div>
          {(watch('images') || []).filter(url => url.length > 0).length > watch('columns') && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              + 외 {(watch('images') || []).filter(url => url.length > 0).length - watch('columns')}개 이미지
            </p>
          )}
        </div>
      )}
    </div>
  );
}