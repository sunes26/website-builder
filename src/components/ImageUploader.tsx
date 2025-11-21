// src/components/ImageUploader.tsx
import { useState, useRef, useCallback } from 'react';
import { Upload, X, Link as LinkIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import { processImage, formatFileSize, isBase64DataUrl, isHttpUrl } from '@/utils/imageUtils';
import type { ImageProcessOptions } from '@/utils/imageUtils';

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  maxSizeMB?: number;
  className?: string;
  placeholder?: string;
}

type TabType = 'upload' | 'url';

export default function ImageUploader({
  value,
  onChange,
  maxSizeMB = 2,
  className = '',
  placeholder = 'https://example.com/image.jpg',
}: ImageUploaderProps) {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [processResult, setProcessResult] = useState<{
    originalSize: number;
    compressedSize: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setIsProcessing(true);
      setProcessingProgress(0);

      try {
        const progressInterval = setInterval(() => {
          setProcessingProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        const options: ImageProcessOptions = {
          maxWidth: 1920,
          quality: 0.8,
          maxSizeMB,
        };

        const result = await processImage(file, options);

        clearInterval(progressInterval);
        setProcessingProgress(100);

        setProcessResult({
          originalSize: result.originalSize,
          compressedSize: result.compressedSize,
        });

        onChange(result.dataUrl);

        setTimeout(() => {
          setIsProcessing(false);
          setProcessingProgress(0);
        }, 1000);
      } catch (err) {
        setError(err instanceof Error ? err.message : '이미지 처리 중 오류가 발생했습니다.');
        setIsProcessing(false);
        setProcessingProgress(0);
      }
    },
    [maxSizeMB, onChange]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    } else {
      setError('이미지 파일만 업로드 가능합니다.');
    }
  };

  const handleUrlApply = () => {
    const url = urlInputRef.current?.value.trim();
    if (url) {
      if (isHttpUrl(url)) {
        onChange(url);
        setError(null);
      } else {
        setError('올바른 URL 형식이 아닙니다.');
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    setProcessResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const hasImage = value && value.length > 0;
  const isBase64 = isBase64DataUrl(value);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'upload'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Upload className="w-4 h-4 inline-block mr-1" />
          파일 업로드
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'url'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <LinkIcon className="w-4 h-4 inline-block mr-1" />
          URL 입력
        </button>
      </div>

      {activeTab === 'upload' && (
        <div>
          {!hasImage ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm text-gray-600 mb-2">
                이미지를 드래그하여 놓거나
              </p>
              <button
                type="button"
                onClick={handleButtonClick}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                파일 선택
              </button>
              <p className="text-xs text-gray-500 mt-3">
                JPG, PNG, GIF, WEBP (최대 {maxSizeMB}MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={value}
                  alt="업로드된 이미지"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/600x200/e5e7eb/9ca3af?text=Invalid+Image';
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={handleButtonClick}
                    className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
                    title="다시 선택"
                  >
                    <Upload className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
                    title="제거"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              {isBase64 && processResult && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-800">
                    ✅ 압축 완료: {formatFileSize(processResult.originalSize)} →{' '}
                    {formatFileSize(processResult.compressedSize)}
                    {' '}(
                    {Math.round(
                      ((processResult.originalSize - processResult.compressedSize) /
                        processResult.originalSize) *
                        100
                    )}
                    % 감소)
                  </p>
                </div>
              )}
            </div>
          )}

          {isProcessing && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                <span className="text-sm text-blue-800 font-medium">
                  이미지 처리 중...
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'url' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              ref={urlInputRef}
              type="url"
              defaultValue={isHttpUrl(value) ? value : ''}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleUrlApply();
                }
              }}
            />
            <button
              type="button"
              onClick={handleUrlApply}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              적용
            </button>
          </div>

          {hasImage && isHttpUrl(value) && (
            <div className="relative rounded-lg overflow-hidden border border-gray-200">
              <img
                src={value}
                alt="URL 이미지"
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/600x200/e5e7eb/9ca3af?text=Invalid+URL';
                }}
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
                title="제거"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-800">❌ {error}</p>
        </div>
      )}
    </div>
  );
}
