import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { useBuilderStore } from '@/store/builderStore';
import type { Block, FormContent } from '@/types';
import FormGroup, { SliderFormGroup, ColorPickerFormGroup } from './FormGroup';

interface FormBlockFormProps {
  block: Block;
}

export default function FormBlockForm({ block }: FormBlockFormProps) {
  const { updateBlock } = useBuilderStore();
  const content = block.content as FormContent;

  const { register, watch, setValue } = useForm<FormContent>({
    defaultValues: content,
  });

  useEffect(() => {
    const subscription = watch((value) => {
      updateBlock(block.id, {
        content: value as FormContent,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateBlock, block.id]);

  const addField = () => {
    const currentFields = watch('fields') || [];
    setValue('fields', [
      ...currentFields,
      {
        id: `field-${Date.now()}`,
        type: 'text',
        label: '새 필드',
        placeholder: '입력하세요',
      },
    ]);
  };

  const removeField = (index: number) => {
    const currentFields = watch('fields') || [];
    setValue('fields', currentFields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, field: string, value: any) => {
    const currentFields = watch('fields') || [];
    const newFields = [...currentFields];
    newFields[index] = { ...newFields[index], [field]: value };
    setValue('fields', newFields);
  };

  return (
    <div className="p-4 space-y-6">
      <FormGroup label="폼 제목">
        <input
          {...register('title')}
          type="text"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </FormGroup>

      <SliderFormGroup
        label="제목 크기"
        value={watch('titleFontSize')}
        min={16}
        max={36}
        onChange={(value) => setValue('titleFontSize', value)}
      />

      <ColorPickerFormGroup
        label="제목 색상"
        value={watch('titleColor')}
        onChange={(value) => setValue('titleColor', value)}
      />

      <div className="border-t border-gray-200 pt-6"></div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
            폼 필드
          </label>
          <button
            type="button"
            onClick={addField}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus className="w-3 h-3" />
            필드 추가
          </button>
        </div>

        <div className="space-y-3">
          {(watch('fields') || []).map((field, index) => (
            <div key={field.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">필드 {index + 1}</span>
                {(watch('fields')?.length || 0) > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              <select
                value={field.type}
                onChange={(e) => updateField(index, 'type', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="text">텍스트</option>
                <option value="email">이메일</option>
                <option value="textarea">텍스트 영역</option>
              </select>

              <input
                type="text"
                value={field.label}
                onChange={(e) => updateField(index, 'label', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="필드 라벨"
              />

              <input
                type="text"
                value={field.placeholder}
                onChange={(e) => updateField(index, 'placeholder', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="플레이스홀더"
              />
            </div>
          ))}
        </div>
      </div>

      <FormGroup label="제출 버튼 텍스트">
        <input
          {...register('buttonText')}
          type="text"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </FormGroup>
    </div>
  );
}
