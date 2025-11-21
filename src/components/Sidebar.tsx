import { Menu, Image, FileText, Grid, Edit, AlignCenter } from 'lucide-react';
import type { BlockType } from '@/types';

const blockTypes: Array<{ type: BlockType; icon: React.ReactNode; label: string; color: string }> = [
  { type: '헤더', icon: <Menu className="w-5 h-5" />, label: '헤더', color: 'text-purple-500' },
  { type: '히어로', icon: <Image className="w-5 h-5" />, label: '히어로', color: 'text-blue-500' },
  { type: '콘텐츠', icon: <FileText className="w-5 h-5" />, label: '콘텐츠', color: 'text-green-500' },
  { type: '갤러리', icon: <Grid className="w-5 h-5" />, label: '갤러리', color: 'text-yellow-500' },
  { type: '폼(Form)', icon: <Edit className="w-5 h-5" />, label: '폼', color: 'text-orange-500' },
  { type: '푸터', icon: <AlignCenter className="w-5 h-5" />, label: '푸터', color: 'text-gray-500' },
];

export default function Sidebar() {
  const handleDragStart = (e: React.DragEvent, blockType: BlockType) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('blockType', blockType);
    e.dataTransfer.setData('text/plain', blockType); // 추가 호환성
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">블록</h2>
        <p className="text-xs text-gray-500 mt-1">드래그하여 추가</p>
      </div>

      {/* 블록 목록 */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        {blockTypes.map((block) => (
          <div
            key={block.type}
            draggable
            onDragStart={(e) => handleDragStart(e, block.type)}
            className="group relative p-3 bg-white border border-gray-200 rounded-lg 
                     cursor-grab active:cursor-grabbing hover:border-blue-400 
                     hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className={`${block.color} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                {block.icon}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {block.label}
                </span>
              </div>
            </div>
            
            {/* 드래그 인디케이터 */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex flex-col gap-0.5">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 도움말 */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600 space-y-1">
          <p className="font-semibold">💡 팁</p>
          <p>블록을 클릭하여 수정하고</p>
          <p>드래그하여 순서를 변경하세요.</p>
        </div>
      </div>
    </div>
  );
}
