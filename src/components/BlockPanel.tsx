// src/components/BlockPanel.tsx
import { 
  Menu, 
  Image, 
  FileText, 
  Grid, 
  Edit, 
  AlignCenter,
  Link  // 🆕 링크 아이콘 추가
} from 'lucide-react';
import type { BlockType } from '@/types';
import { createBlockTemplate } from '@/utils/blockTemplates';
import { useBuilderStore } from '@/store/builderStore';

export default function BlockPanel() {
  const { addBlock } = useBuilderStore();

  const blocks: { type: BlockType; icon: React.ReactNode; label: string }[] = [
    { type: '헤더', icon: <Menu className="w-5 h-5" />, label: '헤더' },
    { type: '히어로', icon: <Image className="w-5 h-5" />, label: '히어로' },
    { type: '콘텐츠', icon: <FileText className="w-5 h-5" />, label: '콘텐츠' },
    { type: '갤러리', icon: <Grid className="w-5 h-5" />, label: '갤러리' },
    { type: '폼(Form)', icon: <Edit className="w-5 h-5" />, label: '폼' },
    { type: '푸터', icon: <AlignCenter className="w-5 h-5" />, label: '푸터' },
    { type: '링크 그룹', icon: <Link className="w-5 h-5" />, label: '링크 그룹' },  // 🆕 추가
  ];

  const handleBlockClick = (type: BlockType) => {
    const newBlock = createBlockTemplate(type);
    addBlock(newBlock);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1">
          블록 추가하기
        </h2>
        <p className="text-xs text-gray-500">
          블록을 클릭하거나 드래그하여 추가하세요
        </p>
      </div>

      {/* 블록 목록 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {blocks.map((block) => (
            <button
              key={block.type}
              onClick={() => handleBlockClick(block.type)}
              className="group relative p-4 border-2 border-gray-200 rounded-lg 
                       hover:border-blue-500 hover:shadow-md transition-all 
                       bg-white cursor-pointer flex flex-col items-center justify-center gap-2"
            >
              <div className="text-blue-500 group-hover:text-blue-600 transition-colors">
                {block.icon}
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                {block.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 하단 안내 */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            💡 <strong>팁:</strong> 각 블록을 클릭한 후 우측 패널에서 세부 속성을 편집할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}