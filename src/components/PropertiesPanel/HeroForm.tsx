// src/components/PropertiesPanel/HeroForm.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useBuilderStore } from '@/store/builderStore';
import type { Block, HeroContent } from '@/types';
import FormGroup, { SliderFormGroup, ColorPickerFormGroup, SelectFormGroup } from './FormGroup';
import ImageUploader from '@/components/ImageUploader';

interface HeroFormProps {
  block: Block;
}

export default function HeroForm({ block }: HeroFormProps) {
  const { updateBlock, project, syncButtonActionToEdge } = useBuilderStore();
  const content = block.content as HeroContent;

  const { register, watch, setValue } = useForm<HeroContent>({
    defaultValues: content,
  });

  // 실시간 업데이트
  useEffect(() => {
    const subscription = watch((value) => {
      updateBlock(block.id, {
        content: value as HeroContent,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateBlock, block.id]);

  return (
    <div className="p-4 space-y-6">
      {/* 배경 이미지 - ImageUploader 사용 */}
      <FormGroup 
        label="배경 이미지" 
        helpText="히어로 섹션의 배경 이미지를 업로드하거나 URL을 입력하세요"
      >
        <ImageUploader
          value={watch('backgroundImage')}
          onChange={(value) => setValue('backgroundImage', value)}
          maxSizeMB={2}
          placeholder="https://example.com/hero-background.jpg"
        />
      </FormGroup>

      <div className="border-t border-gray-200 pt-6"></div>

      {/* 메인 제목 */}
      <FormGroup label="메인 제목" helpText="히어로 섹션의 주요 헤드라인입니다">
        <input
          {...register('title')}
          type="text"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="예: 신선한 원두, 특별한 하루"
        />
      </FormGroup>

      <SliderFormGroup
        label="제목 크기"
        value={watch('titleFontSize')}
        min={24}
        max={72}
        onChange={(value) => setValue('titleFontSize', value)}
      />

      <ColorPickerFormGroup
        label="제목 색상"
        value={watch('titleColor')}
        onChange={(value) => setValue('titleColor', value)}
        helpText="메인 제목의 색상을 선택하세요"
      />

      <div className="border-t border-gray-200 pt-6"></div>

      {/* 부제목 */}
      <FormGroup label="부제목" helpText="제목 아래에 표시되는 설명입니다">
        <textarea
          {...register('subtitle')}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          placeholder="예: 매일 아침 직접 로스팅한 커피를 만나보세요"
        />
      </FormGroup>

      <SliderFormGroup
        label="부제목 크기"
        value={watch('subtitleFontSize')}
        min={12}
        max={32}
        onChange={(value) => setValue('subtitleFontSize', value)}
      />

      <ColorPickerFormGroup
        label="부제목 색상"
        value={watch('subtitleColor')}
        onChange={(value) => setValue('subtitleColor', value)}
        helpText="부제목의 색상을 선택하세요"
      />

      <div className="border-t border-gray-200 pt-6"></div>

      {/* 버튼 액션 설정 */}
      <div className="space-y-4">
        <FormGroup label="버튼 텍스트">
          <input
            {...register('buttonText')}
            type="text"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="예: 메뉴 보기"
            onChange={(e) => {
              // 버튼 텍스트가 변경되면 label도 업데이트
              setValue('buttonAction.label', e.target.value);
            }}
          />
        </FormGroup>

        <SelectFormGroup
          label="버튼 동작"
          value={watch('buttonAction.type')}
          options={[
            { value: 'none', label: '동작 없음' },
            { value: 'page', label: '페이지 이동' },
            { value: 'external', label: '외부 링크' },
          ]}
          onChange={(value) => {
            setValue('buttonAction.type', value as 'page' | 'external' | 'none');
            
            // 동작 타입 변경 시 관련 필드 초기화
            if (value === 'none') {
              setValue('buttonAction.pageId', undefined);
              setValue('buttonAction.externalUrl', undefined);
              
              // Edge 삭제 (동작 없음으로 변경)
              syncButtonActionToEdge(block.id, {
                type: 'none',
                label: watch('buttonText'),
              }, 0);
            } else if (value === 'page') {
              setValue('buttonAction.externalUrl', undefined);
            } else if (value === 'external') {
              setValue('buttonAction.pageId', undefined);
              
              // Edge 삭제 (외부 링크로 변경)
              syncButtonActionToEdge(block.id, {
                type: 'external',
                label: watch('buttonText'),
              }, 0);
            }
          }}
          helpText="버튼 클릭 시 실행할 동작을 선택하세요"
        />

        {/* 페이지 선택 (type이 'page'일 때) */}
        {watch('buttonAction.type') === 'page' && (
          <SelectFormGroup
            label="이동할 페이지"
            value={watch('buttonAction.pageId') || ''}
            options={
              project?.pages.map((page) => ({
                value: page.id,
                label: page.name,
              })) || []
            }
            onChange={(pageId) => {
              setValue('buttonAction.pageId', pageId);
              // 마인드맵 Edge 자동 생성/업데이트
              syncButtonActionToEdge(block.id, {
                type: 'page',
                pageId,
                label: watch('buttonText'),
              }, 0);
            }}
            helpText="버튼 클릭 시 이동할 페이지를 선택하세요"
            placeholder="페이지를 선택하세요"
          />
        )}

        {/* 외부 URL 입력 (type이 'external'일 때) */}
        {watch('buttonAction.type') === 'external' && (
          <FormGroup label="외부 URL" helpText="https://로 시작하는 완전한 URL을 입력하세요">
            <input
              {...register('buttonAction.externalUrl')}
              type="url"
              placeholder="https://example.com"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormGroup>
        )}
      </div>

      {/* 미리보기 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">미리보기</p>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-500">제목:</span>{' '}
            <span className="font-semibold" style={{ 
              fontSize: `${watch('titleFontSize') / 3}px`,
              color: watch('titleColor')
            }}>
              {watch('title') || '(제목 없음)'}
            </span>
          </div>
          <div>
            <span className="text-gray-500">부제목:</span>{' '}
            <span style={{ 
              fontSize: `${watch('subtitleFontSize') / 3}px`,
              color: watch('subtitleColor')
            }}>
              {watch('subtitle') || '(부제목 없음)'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white text-xs rounded-lg">
              {watch('buttonText') || '버튼'}
            </button>
            <span className="text-xs text-gray-500">
              {watch('buttonAction.type') === 'page' && watch('buttonAction.pageId') && (
                <>→ {project?.pages.find(p => p.id === watch('buttonAction.pageId'))?.name}</>
              )}
              {watch('buttonAction.type') === 'external' && watch('buttonAction.externalUrl') && (
                <>→ 외부 링크</>
              )}
              {watch('buttonAction.type') === 'none' && (
                <>(동작 없음)</>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}