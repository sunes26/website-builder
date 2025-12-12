import { useCallback, useRef } from 'react';
import { nanoid } from 'nanoid';
import { useBuilderStore } from '../store/builderStore';
import { loadImageDimensions } from '../utils/imageUtils';
import type { ImageElement, Position } from '../types';

interface UseImageUploadReturn {
  createImageAtPosition: (position: Position) => void;
  handleImageUpload: (file: File, position: Position) => Promise<void>;
}

export function useImageUpload(): UseImageUploadReturn {
  const { addElement, elements } = useBuilderStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pendingPositionRef = useRef<Position | null>(null);

  /**
   * 이미지 파일을 업로드하고 캔버스에 추가
   */
  const handleImageUpload = useCallback(
    async (file: File, position: Position) => {
      // 이미지 파일인지 확인
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        return;
      }

      try {
        // 파일을 Data URL로 변환
        const reader = new FileReader();
        
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = (e) => {
            if (e.target?.result && typeof e.target.result === 'string') {
              resolve(e.target.result);
            } else {
              reject(new Error('Failed to read file'));
            }
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });

        // 이미지 크기 가져오기
        const dimensions = await loadImageDimensions(dataUrl);
        
        // 최대 크기 제한 (캔버스 크기의 50%)
        const maxWidth = 960; // 1920의 50%
        const maxHeight = 540; // 1080의 50%
        
        let width = dimensions.width;
        let height = dimensions.height;
        
        // 비율 유지하면서 크기 조절
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        // 최대 zIndex 계산
        const maxZIndex = elements.length > 0
          ? Math.max(...elements.map((el) => el.zIndex))
          : 0;

        // 새 이미지 요소 생성
        const newImage: ImageElement = {
          id: nanoid(),
          type: 'image',
          position,
          size: { width, height },
          rotation: 0,
          zIndex: maxZIndex + 1,
          locked: false,
          visible: true,
          src: dataUrl,
          alt: file.name,
        };

        // 스토어에 추가
        addElement(newImage);
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        alert('이미지 업로드에 실패했습니다.');
      }
    },
    [elements, addElement]
  );

  /**
   * 특정 위치에서 이미지 업로드 시작 (파일 선택 대화상자 열기)
   */
  const createImageAtPosition = useCallback(
    (position: Position) => {
      pendingPositionRef.current = position;

      // 기존 input이 없으면 생성
      if (!fileInputRef.current) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';
        
        input.addEventListener('change', async (e) => {
          const target = e.target as HTMLInputElement;
          const file = target.files?.[0];
          
          if (file && pendingPositionRef.current) {
            await handleImageUpload(file, pendingPositionRef.current);
            pendingPositionRef.current = null;
          }
          
          // input 값 리셋 (같은 파일 다시 선택 가능하도록)
          target.value = '';
        });
        
        document.body.appendChild(input);
        fileInputRef.current = input;
      }

      // 파일 선택 대화상자 열기
      fileInputRef.current.click();
    },
    [handleImageUpload]
  );

  return {
    createImageAtPosition,
    handleImageUpload,
  };
}