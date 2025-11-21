import { useBuilderStore } from '@/store/builderStore';
import type { HeaderContent, HeroContent, ContentBlockContent, FooterContent } from '@/types';

export default function SettingsPanel() {
  const { currentPage, selectedBlockId, updateBlock } = useBuilderStore();

  const selectedBlock = currentPage?.blocks.find((b) => b.id === selectedBlockId);

  if (!selectedBlock) {
    return (
      <aside className="w-80 bg-white h-full shadow-lg overflow-y-auto flex-shrink-0 border-l scrollbar-thin">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">설정</h2>
          <p className="text-sm text-gray-500">블록을 선택하면 설정이 표시됩니다.</p>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-400">수정할 블록을 선택하세요.</p>
        </div>
      </aside>
    );
  }

  const handleContentUpdate = (field: string, value: any) => {
    updateBlock(selectedBlock.id, {
      content: {
        ...selectedBlock.content,
        [field]: value,
      },
    });
  };

  const renderSettings = () => {
    switch (selectedBlock.type) {
      case '헤더':
        return <HeaderSettings content={selectedBlock.content as HeaderContent} onChange={handleContentUpdate} />;
      case '히어로':
        return <HeroSettings content={selectedBlock.content as HeroContent} onChange={handleContentUpdate} />;
      case '콘텐츠':
        return <ContentSettings content={selectedBlock.content as ContentBlockContent} onChange={handleContentUpdate} />;
      case '푸터':
        return <FooterSettings content={selectedBlock.content as FooterContent} onChange={handleContentUpdate} />;
      default:
        return <p className="text-sm text-gray-500">이 블록은 설정 옵션이 없습니다.</p>;
    }
  };

  return (
    <aside className="w-80 bg-white h-full shadow-lg overflow-y-auto flex-shrink-0 border-l scrollbar-thin">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">설정: {selectedBlock.type}</h2>
        <p className="text-sm text-gray-500">선택한 블록의 내용을 수정합니다.</p>
      </div>
      <div className="p-4 space-y-6">{renderSettings()}</div>
    </aside>
  );
}

// 헤더 설정
function HeaderSettings({ content, onChange }: { content: HeaderContent; onChange: (field: string, value: any) => void }) {
  return (
    <>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">로고 텍스트</label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={content.logo}
            onChange={(e) => onChange('logo', e.target.value)}
            className="w-2/3 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="w-1/3 flex items-center space-x-1">
            <input
              type="number"
              value={content.logoFontSize}
              onChange={(e) => onChange('logoFontSize', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm"
            />
            <span className="text-sm text-gray-500">px</span>
          </div>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">네비게이션 링크</label>
        <div className="space-y-2">
          {content.navLinks.map((link, i) => (
            <input
              key={i}
              type="text"
              value={link.text}
              onChange={(e) => {
                const newLinks = [...content.navLinks];
                newLinks[i] = { ...link, text: e.target.value };
                onChange('navLinks', newLinks);
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder={`링크 ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}

// 히어로 설정
function HeroSettings({ content, onChange }: { content: HeroContent; onChange: (field: string, value: any) => void }) {
  return (
    <>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">배경 이미지 URL</label>
        <input
          type="text"
          value={content.backgroundImage}
          onChange={(e) => onChange('backgroundImage', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">타이틀</label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={content.title}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-2/3 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="w-1/3 flex items-center space-x-1">
            <input
              type="number"
              value={content.titleFontSize}
              onChange={(e) => onChange('titleFontSize', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm"
            />
            <span className="text-sm text-gray-500">px</span>
          </div>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">서브텍스트</label>
        <div className="flex space-x-2">
          <textarea
            value={content.subtitle}
            onChange={(e) => onChange('subtitle', e.target.value)}
            className="w-2/3 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <div className="w-1/3 flex items-center space-x-1">
            <input
              type="number"
              value={content.subtitleFontSize}
              onChange={(e) => onChange('subtitleFontSize', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm"
            />
            <span className="text-sm text-gray-500">px</span>
          </div>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">버튼 텍스트</label>
        <input
          type="text"
          value={content.buttonText}
          onChange={(e) => onChange('buttonText', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </>
  );
}

// 콘텐츠 설정
function ContentSettings({ content, onChange }: { content: ContentBlockContent; onChange: (field: string, value: any) => void }) {
  return (
    <>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">제목</label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={content.title}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-2/3 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="w-1/3 flex items-center space-x-1">
            <input
              type="number"
              value={content.titleFontSize}
              onChange={(e) => onChange('titleFontSize', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm"
            />
            <span className="text-sm text-gray-500">px</span>
          </div>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">내용</label>
        <textarea
          value={content.text}
          onChange={(e) => onChange('text', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={5}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">이미지 URL</label>
        <input
          type="text"
          value={content.imageUrl}
          onChange={(e) => onChange('imageUrl', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">이미지 위치</label>
        <select
          value={content.imagePosition}
          onChange={(e) => onChange('imagePosition', e.target.value as 'left' | 'right')}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="right">오른쪽</option>
          <option value="left">왼쪽</option>
        </select>
      </div>
    </>
  );
}

// 푸터 설정
function FooterSettings({ content, onChange }: { content: FooterContent; onChange: (field: string, value: any) => void }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-1">저작권 텍스트</label>
      <div className="flex space-x-2">
        <input
          type="text"
          value={content.text}
          onChange={(e) => onChange('text', e.target.value)}
          className="w-2/3 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="w-1/3 flex items-center space-x-1">
          <input
            type="number"
            value={content.fontSize}
            onChange={(e) => onChange('fontSize', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm"
          />
          <span className="text-sm text-gray-500">px</span>
        </div>
      </div>
    </div>
  );
}
