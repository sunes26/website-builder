// src/components/PropertiesPanel/index.tsx
import { Settings, Trash2, Type, Box, Image, MousePointer } from 'lucide-react';
import { useBuilderStore } from '@/store/builderStore';
import HeaderForm from './HeaderForm';
import HeroForm from './HeroForm';
import ContentForm from './ContentForm';
import FooterForm from './FooterForm';
import GalleryForm from './GalleryForm';
import FormBlockForm from './FormBlockForm';
import LinkGroupForm from './LinkGroupForm';
import TextElementForm from './TextElementForm';
import BoxElementForm from './BoxElementForm';
import ImageElementForm from './ImageElementForm';
import ButtonElementForm from './ButtonElementForm';
import LinkElementForm from './LinkElementForm';

export default function PropertiesPanel() {
  const { currentPage, selectedElement, removeBlock } = useBuilderStore();

  if (!selectedElement) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-600" />
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">속성</h2>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Settings className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">요소를 선택하세요</p>
            <p className="text-xs text-gray-500">
              캔버스에서 텍스트, 이미지, 버튼 등을<br />
              클릭하면 속성을 편집할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const selectedBlock = currentPage?.blocks.find((b) => b.id === selectedElement.blockId);

  if (!selectedBlock) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <p className="text-sm text-red-500">선택한 블록을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const handleDeleteBlock = () => {
    if (confirm('이 블록을 삭제하시겠습니까?')) {
      removeBlock(selectedBlock.id);
    }
  };

  const getElementIcon = () => {
    switch (selectedElement.elementType) {
      case 'text':
        return <Type className="w-4 h-4 text-blue-600" />;
      case 'box':
        return <Box className="w-4 h-4 text-purple-600" />;
      case 'image':
        return <Image className="w-4 h-4 text-green-600" />;
      case 'button':
      case 'link':
        return <MousePointer className="w-4 h-4 text-orange-600" />;
      default:
        return <Settings className="w-4 h-4 text-gray-600" />;
    }
  };

  const getElementLabel = () => {
    switch (selectedElement.elementType) {
      case 'text':
        return '텍스트';
      case 'box':
        return '박스/컨테이너';
      case 'image':
        return '이미지';
      case 'button':
        return '버튼';
      case 'link':
        return '링크';
      case 'input':
        return '입력 필드';
      case 'block':
        return '블록 전체';
      default:
        return '요소';
    }
  };

  const renderElementForm = () => {
    switch (selectedElement.elementType) {
      case 'text':
        return <TextElementForm key={selectedElement.blockId} block={selectedBlock} elementPath={selectedElement.elementPath} />;
      
      case 'box':
        return <BoxElementForm key={selectedElement.blockId} block={selectedBlock} elementPath={selectedElement.elementPath} />;
      
      case 'image':
        return <ImageElementForm key={selectedElement.blockId} block={selectedBlock} elementPath={selectedElement.elementPath} />;
      
      case 'button':
        return <ButtonElementForm key={selectedElement.blockId} block={selectedBlock} elementPath={selectedElement.elementPath} />;
      
      case 'link':
        // 🆕 헤더, 푸터, 콘텐츠, 링크 그룹 블록의 링크 모두 지원
        if (
          selectedBlock.type === '헤더' || 
          selectedBlock.type === '푸터' || 
          selectedBlock.type === '콘텐츠' ||
          selectedBlock.type === '링크 그룹'
        ) {
          return <LinkElementForm key={selectedElement.blockId} block={selectedBlock} elementPath={selectedElement.elementPath} />;
        }
        return renderBlockForm();
      
      case 'block':
      default:
        return renderBlockForm();
    }
  };

  const renderBlockForm = () => {
    switch (selectedBlock.type) {
      case '헤더':
        return <HeaderForm key={selectedBlock.id} block={selectedBlock} />;
      case '히어로':
        return <HeroForm key={selectedBlock.id} block={selectedBlock} />;
      case '콘텐츠':
        return <ContentForm key={selectedBlock.id} block={selectedBlock} />;
      case '갤러리':
        return <GalleryForm key={selectedBlock.id} block={selectedBlock} />;
      case '폼(Form)':
        return <FormBlockForm key={selectedBlock.id} block={selectedBlock} />;
      case '푸터':
        return <FooterForm key={selectedBlock.id} block={selectedBlock} />;
      case '링크 그룹':
        return <LinkGroupForm key={selectedBlock.id} block={selectedBlock} />;
      default:
        return (
          <div className="p-4">
            <p className="text-sm text-gray-500">이 블록은 설정 옵션이 없습니다.</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {getElementIcon()}
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
              {getElementLabel()}
            </h2>
          </div>
          <button
            onClick={handleDeleteBlock}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="블록 삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="font-semibold text-blue-600">{selectedBlock.type}</span>
          {selectedElement.elementPath !== 'block' && (
            <>
              <span className="text-gray-400">›</span>
              <span className="text-gray-700">{selectedElement.elementPath}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {renderElementForm()}
      </div>
    </div>
  );
}