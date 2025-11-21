// src/utils/imageUtils.ts

/**
 * 이미지 처리 유틸리티
 * Base64 인코딩, 압축, 리사이즈 등의 기능을 제공합니다.
 */

export interface ImageProcessOptions {
  maxWidth?: number;      // 최대 너비 (기본: 1920px)
  maxHeight?: number;     // 최대 높이 (기본: 무제한)
  quality?: number;       // 압축 품질 0-1 (기본: 0.8)
  maxSizeMB?: number;     // 최대 파일 크기 (기본: 2MB)
}

export interface ImageProcessResult {
  dataUrl: string;        // Base64 데이터 URL
  originalSize: number;   // 원본 크기 (bytes)
  compressedSize: number; // 압축 후 크기 (bytes)
  width: number;          // 이미지 너비
  height: number;         // 이미지 높이
}

/**
 * 파일을 Base64로 읽기
 */
export const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('파일을 읽을 수 없습니다.'));
      }
    };
    
    reader.onerror = () => reject(new Error('파일 읽기 실패'));
    reader.readAsDataURL(file);
  });
};

/**
 * 이미지 파일 검증
 */
export const validateImageFile = (file: File, maxSizeMB: number = 2): { valid: boolean; error?: string } => {
  // 파일 타입 검증
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: '이미지 파일만 업로드 가능합니다.' };
  }

  // 지원 형식 검증
  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!supportedFormats.includes(file.type)) {
    return { valid: false, error: '지원하는 형식: JPG, PNG, GIF, WEBP' };
  }

  // 파일 크기 검증
  const maxSize = maxSizeMB * 1024 * 1024; // MB to bytes
  if (file.size > maxSize) {
    return { valid: false, error: `파일 크기는 ${maxSizeMB}MB 이하여야 합니다.` };
  }

  return { valid: true };
};

/**
 * 이미지 크기 가져오기
 */
export const getImageDimensions = (dataUrl: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => reject(new Error('이미지 로드 실패'));
    img.src = dataUrl;
  });
};

/**
 * 이미지 리사이즈 및 압축
 */
export const processImage = async (
  file: File,
  options: ImageProcessOptions = {}
): Promise<ImageProcessResult> => {
  const {
    maxWidth = 1920,
    maxHeight = Infinity,
    quality = 0.8,
    maxSizeMB = 2,
  } = options;

  // 파일 검증
  const validation = validateImageFile(file, maxSizeMB);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // 원본 파일을 Base64로 읽기
  const originalDataUrl = await readFileAsBase64(file);
  const originalSize = file.size;

  // 이미지 크기 확인
  const { width: originalWidth, height: originalHeight } = await getImageDimensions(originalDataUrl);

  // 리사이즈가 필요한지 확인
  const needsResize = originalWidth > maxWidth || originalHeight > maxHeight;

  if (!needsResize) {
    // 리사이즈 불필요 - 원본 반환
    return {
      dataUrl: originalDataUrl,
      originalSize,
      compressedSize: originalSize,
      width: originalWidth,
      height: originalHeight,
    };
  }

  // Canvas를 사용한 리사이즈 및 압축
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      // 비율 유지하며 리사이즈
      let newWidth = originalWidth;
      let newHeight = originalHeight;

      if (originalWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = (originalHeight * maxWidth) / originalWidth;
      }

      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = (originalWidth * maxHeight) / originalHeight;
      }

      // Canvas 생성
      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas를 생성할 수 없습니다.'));
        return;
      }

      // 이미지 그리기
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Base64로 변환 (압축 적용)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      
      // 압축 후 크기 계산 (Base64는 원본의 약 1.37배)
      const base64Length = compressedDataUrl.length - 'data:image/jpeg;base64,'.length;
      const compressedSize = (base64Length * 3) / 4;

      resolve({
        dataUrl: compressedDataUrl,
        originalSize,
        compressedSize: Math.round(compressedSize),
        width: Math.round(newWidth),
        height: Math.round(newHeight),
      });
    };

    img.onerror = () => reject(new Error('이미지 처리 실패'));
    img.src = originalDataUrl;
  });
};

/**
 * 파일 크기를 읽기 쉬운 형식으로 변환
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Base64 데이터 URL인지 확인
 */
export const isBase64DataUrl = (url: string): boolean => {
  return url.startsWith('data:image/');
};

/**
 * 일반 URL인지 확인
 */
export const isHttpUrl = (url: string): boolean => {
  return url.startsWith('http://') || url.startsWith('https://');
};