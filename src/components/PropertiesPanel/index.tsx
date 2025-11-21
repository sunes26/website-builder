// src/components/PropertiesPanel/index.tsx
import { Settings, Trash2, Type, Box, Image, MousePointer, Layers } from 'lucide-react';
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
  const { 
    currentPage, 
    selectedElement, 
    removeBlock,
    // 🆕 다중 선택 관련
    selectedBlockIds,
    selectionMode,
    deleteSelectedBlocks,
    clearSelection,
  } = useBuilderStore();

  // 🆕 다중 선택 모드 패널
  if (selectionMode === 'multiple' && selectedBlockIds.length > 1) {
    const selectedBlocks = currentPage?.blocks.filter(b => selectedBlockIds.includes(b.id)) || [];
    
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200 bg-blue-50 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-blue-800 uppercase tracking-wide">
                다중 선택
              </h2>
            </div>
            <button
              onClick={clearSelection}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              선택 해제
            </button>
          </div>
          
          <div className="text-sm text-blue-700 font-semibold">
            {selectedBlockIds.length}개 블록 선택됨
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* 선택된 블록 목록 */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              선택된 블록
            </h3>
            <div className="space-y-2">
              {selectedBlocks.map((block) => (
                <div
                  key={block.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">
                      {block.type}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    ID: {block.id.slice(0, 8)}...
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 일괄 작업 버튼 */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              일괄 작업
            </h3>
            
            <button
              onClick={deleteSelectedBlocks}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 
                         bg-red-50 text-red-700 rounded-lg font-medium text-sm
                         hover:bg-red-100 transition-colors border border-red-200"
            >
              <Trash2 className="w-4 h-4" />
              모두 삭제
            </button>

            {/* 안내 문구 */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">
                💡 단축키 안내
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• <kbd className="px-1.5 py-0.5 bg-white rounded text-xs">Ctrl+C</kbd> 복사</li>
                <li>• <kbd className="px-1.5 py-0.5 bg-white rounded text-xs">Ctrl+V</kbd> 붙여넣기</li>
                <li>• <kbd className="px-1.5 py-0.5 bg-white rounded text-xs">Ctrl+X</kbd> 잘라내기</li>
                <li>• <kbd className="px-1.5 py-0.5 bg-white rounded text-xs">Delete</kbd> 삭제</li>
                <li>• <kbd className="px-1.5 py-0.5 bg-white rounded text-xs">Escape</kbd> 선택 해제</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 기존 단일 선택 로직
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
            
            {/* 🆕 다중 선택 안내 */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-left">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">
                💡 다중 선택 사용법
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• <kbd className="px-1.5 py-0.5 bg-white rounded text-xs">Ctrl+클릭</kbd> 여러 블록 선택</li>
                <li>• <kbd className="px-1.5 py-0.5 bg-white rounded text-xs">Shift+클릭</kbd> 범위 선택</li>
                <li>• <kbd className="px-1.5 py-0.5 bg-white rounded text-xs">Ctrl+A</kbd> 전체 선택</li>
              </ul>
            </div>
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