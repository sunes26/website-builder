// src/components/BlockRenderer.tsx
import { useBuilderStore } from '@/store/builderStore';
import type { Block, SelectedElement, ElementType, BoxStyle, ButtonAction } from '@/types';
import {
  HeaderContent,
  HeroContent,
  ContentBlockContent,
  GalleryContent,
  FormContent,
  FooterContent,
  LinkGroupContent,
} from '@/types';

interface BlockRendererProps {
  block: Block;
  isSelected: boolean;
  onClick?: (element: SelectedElement) => void;
  onBlockClick?: (e: React.MouseEvent) => void;  // 🆕 블록 클릭 핸들러
}

export default function BlockRenderer({ 
  block, 
  isSelected, 
  onClick,
  onBlockClick  // 🆕
}: BlockRendererProps) {
  const { selectionMode } = useBuilderStore();  // 🆕 선택 모드 가져오기

  const renderBlock = () => {
    switch (block.type) {
      case '헤더':
        return <HeaderBlock content={block.content as HeaderContent} block={block} onClick={onClick} />;
      case '히어로':
        return <HeroBlock content={block.content as HeroContent} block={block} onClick={onClick} />;
      case '콘텐츠':
        return <ContentBlock content={block.content as ContentBlockContent} block={block} onClick={onClick} />;
      case '갤러리':
        return <GalleryBlock content={block.content as GalleryContent} block={block} onClick={onClick} />;
      case '폼(Form)':
        return <FormBlock content={block.content as FormContent} block={block} onClick={onClick} />;
      case '푸터':
        return <FooterBlock content={block.content as FooterContent} block={block} onClick={onClick} />;
      case '링크 그룹':
        return <LinkGroupBlock content={block.content as LinkGroupContent} block={block} onClick={onClick} />;
      default:
        return <div>Unknown block type</div>;
    }
  };

  return (
    <div
      className={`editable-block transition-all relative ${
        isSelected 
          ? 'ring-2 ring-blue-500 bg-blue-50' 
          : onClick ? 'hover:ring-1 hover:ring-gray-300' : ''
      }`}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onBlockClick}  // 🆕 블록 클릭 이벤트
    >
      {/* 🆕 체크박스 (다중 선택 모드 시) */}
      {selectionMode === 'multiple' && onClick && (
        <div className="absolute top-2 right-2 z-50">
          <div className="bg-white rounded shadow-sm p-1">
            <input
              type="checkbox"
              checked={isSelected}
              readOnly
              className="w-5 h-5 rounded border-2 border-blue-500 
                         checked:bg-blue-500 cursor-pointer pointer-events-none"
            />
          </div>
        </div>
      )}
      
      {renderBlock()}
    </div>
  );
}

// 🆕 박스 스타일을 React CSSProperties로 변환
const convertBoxStyleToCSS = (boxStyle?: BoxStyle): React.CSSProperties => {
  if (!boxStyle) return {};

  return {
    width: boxStyle.width,
    height: boxStyle.height,
    backgroundColor: boxStyle.backgroundColor,
    borderWidth: boxStyle.borderWidth ? `${boxStyle.borderWidth}px` : undefined,
    borderColor: boxStyle.borderColor,
    borderStyle: boxStyle.borderWidth ? 'solid' : undefined,
    borderRadius: boxStyle.borderRadius ? `${boxStyle.borderRadius}px` : undefined,
    paddingTop: boxStyle.paddingTop !== undefined ? `${boxStyle.paddingTop}px` : undefined,
    paddingRight: boxStyle.paddingRight !== undefined ? `${boxStyle.paddingRight}px` : undefined,
    paddingBottom: boxStyle.paddingBottom !== undefined ? `${boxStyle.paddingBottom}px` : undefined,
    paddingLeft: boxStyle.paddingLeft !== undefined ? `${boxStyle.paddingLeft}px` : undefined,
    marginTop: boxStyle.marginTop !== undefined ? `${boxStyle.marginTop}px` : undefined,
    marginBottom: boxStyle.marginBottom !== undefined ? `${boxStyle.marginBottom}px` : undefined,
  };
};

// 🆕 요소 클릭 헬퍼 함수
const handleElementClick = (
  e: React.MouseEvent,
  block: Block,
  elementType: ElementType,
  elementPath: string,
  onClick?: (element: SelectedElement) => void
) => {
  if (!onClick) return;
  
  e.stopPropagation();
  
  const element = e.currentTarget as HTMLElement;
  const elementTag = element.tagName.toLowerCase();
  
  onClick({
    blockId: block.id,
    blockType: block.type,
    elementType,
    elementPath,
    elementTag,
  });
};

// ==================== 헤더 블록 ====================
function HeaderBlock({ content, block, onClick }: { 
  content: HeaderContent; 
  block: Block;
  onClick?: (element: SelectedElement) => void;
}) {
  const { previewMode, navigateToPageInPreview } = useBuilderStore();
  
  const handleLinkClick = (e: React.MouseEvent, action: ButtonAction) => {
    if (previewMode) {
      e.preventDefault();
      
      if (action.type === 'page' && action.pageId) {
        navigateToPageInPreview(action.pageId);
      } else if (action.type === 'external' && action.externalUrl) {
        console.log('외부 링크:', action.externalUrl);
        alert('미리보기 모드에서는 외부 링크를 열 수 없습니다.');
      }
    } else {
      e.preventDefault();
    }
  };

  const headerBoxStyle = block.boxStyles?.['header'];
  
  return (
    <header 
      className="bg-white shadow-sm cursor-pointer"
      style={convertBoxStyleToCSS(headerBoxStyle)}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'HEADER' || target.tagName === 'NAV') {
          handleElementClick(e, block, 'box', 'header', onClick);
        }
      }}
    >
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div
          className="font-bold cursor-pointer hover:opacity-80"
          style={{
            fontSize: `${content.logoFontSize}px`,
            color: content.logoColor,
          }}
          onClick={(e) => handleElementClick(e, block, 'text', 'logo', onClick)}
        >
          {content.logo}
        </div>
        
        <div 
          className="space-x-4 cursor-pointer"
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('space-x-4')) {
              handleElementClick(e, block, 'box', 'navLinks', onClick);
            }
          }}
        >
          {content.navLinks.map((link, index) => {
            const href = 
              link.action.type === 'page' 
                ? `#page-${link.action.pageId}` 
                : link.action.type === 'external'
                ? link.action.externalUrl || '#'
                : '#';

            return (
              <a
                key={index}
                href={href}
                className="hover:opacity-80 transition-opacity cursor-pointer"
                style={{
                  color: content.navLinksColor,
                }}
                onClick={(e) => {
                  if (!previewMode) {
                    e.preventDefault();
                    handleElementClick(e, block, 'link', `navLinks.${index}`, onClick);
                  } else {
                    handleLinkClick(e, link.action);
                  }
                }}
              >
                {link.text}
              </a>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

// ==================== 히어로 블록 ====================
function HeroBlock({ content, block, onClick }: { 
  content: HeroContent;
  block: Block;
  onClick?: (element: SelectedElement) => void;
}) {
  const { previewMode, navigateToPageInPreview } = useBuilderStore();
  
  const handleButtonClick = (e: React.MouseEvent) => {
    if (previewMode) {
      e.preventDefault();
      
      if (content.buttonAction.type === 'page' && content.buttonAction.pageId) {
        navigateToPageInPreview(content.buttonAction.pageId);
      } else if (content.buttonAction.type === 'external' && content.buttonAction.externalUrl) {
        console.log('외부 링크:', content.buttonAction.externalUrl);
        alert('미리보기 모드에서는 외부 링크를 열 수 없습니다.');
      }
    } else {
      e.preventDefault();
    }
  };
  
  const buttonHref = 
    content.buttonAction.type === 'page'
      ? `#page-${content.buttonAction.pageId}`
      : content.buttonAction.type === 'external'
      ? content.buttonAction.externalUrl || '#'
      : '#';

  const sectionBoxStyle = block.boxStyles?.['section'];

  return (
    <section
      className="py-20 px-6 text-center cursor-pointer"
      style={{
        backgroundImage: `url('${content.backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '400px',
        ...convertBoxStyleToCSS(sectionBoxStyle),
      }}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'SECTION') {
          handleElementClick(e, block, 'box', 'section', onClick);
        }
      }}
    >
      <h1
        className="font-bold mb-4 cursor-pointer hover:opacity-80"
        style={{
          fontSize: `${content.titleFontSize}px`,
          color: content.titleColor,
        }}
        onClick={(e) => handleElementClick(e, block, 'text', 'title', onClick)}
      >
        {content.title}
      </h1>
      
      <p
        className="mb-8 cursor-pointer hover:opacity-80"
        style={{
          fontSize: `${content.subtitleFontSize}px`,
          color: content.subtitleColor,
        }}
        onClick={(e) => handleElementClick(e, block, 'text', 'subtitle', onClick)}
      >
        {content.subtitle}
      </p>
      
      <a
        href={buttonHref}
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
        onClick={(e) => {
          if (!previewMode) {
            e.preventDefault();
            handleElementClick(e, block, 'button', 'button', onClick);
          } else {
            handleButtonClick(e);
          }
        }}
      >
        {content.buttonText}
      </a>
    </section>
  );
}

// ==================== 콘텐츠 블록 ====================
function ContentBlock({ content, block, onClick }: { 
  content: ContentBlockContent;
  block: Block;
  onClick?: (element: SelectedElement) => void;
}) {
  const { previewMode, navigateToPageInPreview } = useBuilderStore();
  
  const handleLinkClick = (e: React.MouseEvent, action: ButtonAction) => {
    if (previewMode) {
      e.preventDefault();
      
      if (action.type === 'page' && action.pageId) {
        navigateToPageInPreview(action.pageId);
      } else if (action.type === 'external' && action.externalUrl) {
        console.log('외부 링크:', action.externalUrl);
        alert('미리보기 모드에서는 외부 링크를 열 수 없습니다.');
      }
    } else {
      e.preventDefault();
    }
  };

  const sectionBoxStyle = block.boxStyles?.['section'];

  return (
    <section 
      className="container mx-auto px-6 py-16 cursor-pointer"
      style={convertBoxStyleToCSS(sectionBoxStyle)}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'SECTION' || target.classList.contains('gap-8')) {
          handleElementClick(e, block, 'box', 'section', onClick);
        }
      }}
    >
      <div
        className={`flex flex-col md:flex-row items-center gap-8 ${
          content.imagePosition === 'left' ? 'md:flex-row-reverse' : ''
        }`}
      >
        <div className="md:w-1/2">
          <h2
            className="font-bold mb-4 cursor-pointer hover:opacity-80"
            style={{
              fontSize: `${content.titleFontSize}px`,
              color: content.titleColor,
            }}
            onClick={(e) => handleElementClick(e, block, 'text', 'title', onClick)}
          >
            {content.title}
          </h2>
          
          <p
            className="leading-relaxed cursor-pointer hover:opacity-80"
            style={{
              fontSize: `${content.textFontSize}px`,
              color: content.textColor,
            }}
            onClick={(e) => handleElementClick(e, block, 'text', 'text', onClick)}
          >
            {content.text}
          </p>
          
          {content.showLinks && content.links && content.links.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-4 flex-wrap">
                {content.links.map((link, index) => {
                  const href = 
                    link.action.type === 'page' 
                      ? `#page-${link.action.pageId}` 
                      : link.action.type === 'external'
                      ? link.action.externalUrl || '#'
                      : '#';

                  return (
                    <a
                      key={index}
                      href={href}
                      onClick={(e) => {
                        if (!previewMode) {
                          e.preventDefault();
                          handleElementClick(e, block, 'link', `links.${index}`, onClick);
                        } else {
                          handleLinkClick(e, link.action);
                        }
                      }}
                      style={{ color: content.linksColor }}
                      className="text-sm font-medium hover:underline transition-all cursor-pointer"
                    >
                      {link.text} →
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        <div className="md:w-1/2">
          <img
            src={content.imageUrl}
            alt={content.title}
            className="rounded-lg shadow-md w-full cursor-pointer hover:opacity-90"
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '400px',
              minHeight: '300px',
            }}
            onClick={(e) => handleElementClick(e, block, 'image', 'image', onClick)}
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/600x400/e5e7eb/9ca3af?text=Image+Error';
            }}
          />
        </div>
      </div>
    </section>
  );
}

// ==================== 갤러리 블록 ====================
function GalleryBlock({ content, block, onClick }: { 
  content: GalleryContent;
  block: Block;
  onClick?: (element: SelectedElement) => void;
}) {
  const sectionBoxStyle = block.boxStyles?.['section'];

  return (
    <section 
      className="container mx-auto px-6 py-16 cursor-pointer"
      style={convertBoxStyleToCSS(sectionBoxStyle)}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'SECTION' || target.classList.contains('grid')) {
          handleElementClick(e, block, 'box', 'section', onClick);
        }
      }}
    >
      <h2
        className="font-bold text-center mb-8 cursor-pointer hover:opacity-80"
        style={{
          fontSize: '1.875rem',
          color: content.titleColor,
        }}
        onClick={(e) => handleElementClick(e, block, 'text', 'title', onClick)}
      >
        {content.title}
      </h2>
      
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${content.columns}, 1fr)`,
        }}
      >
        {content.images.map((imageUrl, index) => (
          <div
            key={index}
            className="rounded-lg shadow-md overflow-hidden"
            style={{
              aspectRatio: '1 / 1',
            }}
          >
            <img
              src={imageUrl}
              alt={`갤러리 이미지 ${index + 1}`}
              className="w-full h-full cursor-pointer hover:opacity-90"
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
              }}
              onClick={(e) => handleElementClick(e, block, 'image', `images.${index}`, onClick)}
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/300x300/e5e7eb/9ca3af?text=?';
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// ==================== 폼 블록 ====================
function FormBlock({ content, block, onClick }: { 
  content: FormContent;
  block: Block;
  onClick?: (element: SelectedElement) => void;
}) {
  const { previewMode } = useBuilderStore();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (previewMode) {
      alert('폼 제출 기능 (구현 예정)');
    }
  };

  const sectionBoxStyle = block.boxStyles?.['section'];
  const formBoxStyle = block.boxStyles?.['form'];
  
  return (
    <section 
      className="container mx-auto px-6 py-16 cursor-pointer"
      style={convertBoxStyleToCSS(sectionBoxStyle)}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'SECTION') {
          handleElementClick(e, block, 'box', 'section', onClick);
        }
      }}
    >
      <div 
        className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md cursor-pointer"
        style={convertBoxStyleToCSS(formBoxStyle)}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.classList.contains('max-w-lg')) {
            handleElementClick(e, block, 'box', 'form', onClick);
          }
        }}
      >
        <h2
          className="font-bold mb-6 text-center cursor-pointer hover:opacity-80"
          style={{
            fontSize: `${content.titleFontSize}px`,
            color: content.titleColor,
          }}
          onClick={(e) => handleElementClick(e, block, 'text', 'title', onClick)}
        >
          {content.title}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {content.fields.map((field, index) => (
            <div key={field.id} className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  rows={4}
                  placeholder={field.placeholder}
                  disabled={!previewMode}
                  onClick={(e) => {
                    if (!previewMode) {
                      e.preventDefault();
                      handleElementClick(e, block, 'input', `fields.${index}`, onClick);
                    }
                  }}
                />
              ) : (
                <input
                  type={field.type}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  placeholder={field.placeholder}
                  disabled={!previewMode}
                  onClick={(e) => {
                    if (!previewMode) {
                      e.preventDefault();
                      handleElementClick(e, block, 'input', `fields.${index}`, onClick);
                    }
                  }}
                />
              )}
            </div>
          ))}
          
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 cursor-pointer"
              disabled={!previewMode}
              onClick={(e) => {
                if (!previewMode) {
                  e.preventDefault();
                  handleElementClick(e, block, 'button', 'button', onClick);
                }
              }}
            >
              {content.buttonText}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

// ==================== 푸터 블록 ====================
function FooterBlock({ content, block, onClick }: { 
  content: FooterContent;
  block: Block;
  onClick?: (element: SelectedElement) => void;
}) {
  const { previewMode, navigateToPageInPreview } = useBuilderStore();
  
  const handleLinkClick = (e: React.MouseEvent, action: ButtonAction) => {
    if (previewMode) {
      e.preventDefault();
      
      if (action.type === 'page' && action.pageId) {
        navigateToPageInPreview(action.pageId);
      } else if (action.type === 'external' && action.externalUrl) {
        console.log('외부 링크:', action.externalUrl);
        alert('미리보기 모드에서는 외부 링크를 열 수 없습니다.');
      }
    } else {
      e.preventDefault();
    }
  };

  const footerBoxStyle = block.boxStyles?.['footer'];

  return (
    <footer 
      className="bg-gray-800 py-8 cursor-pointer"
      style={convertBoxStyleToCSS(footerBoxStyle)}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'FOOTER') {
          handleElementClick(e, block, 'box', 'footer', onClick);
        }
      }}
    >
      <div
        className="container mx-auto px-6 text-center cursor-pointer hover:opacity-80"
        style={{
          fontSize: `${content.fontSize}px`,
          color: content.textColor,
        }}
        onClick={(e) => handleElementClick(e, block, 'text', 'text', onClick)}
      >
        {content.text}
      </div>
      
      {content.showLinks && content.links && content.links.length > 0 && (
        <div className="container mx-auto px-6 mt-4">
          <div className="flex justify-center items-center gap-4 flex-wrap">
            {content.links.map((link, index) => {
              const href = 
                link.action.type === 'page' 
                  ? `#page-${link.action.pageId}` 
                  : link.action.type === 'external'
                  ? link.action.externalUrl || '#'
                  : '#';

              return (
                <a
                  key={index}
                  href={href}
                  onClick={(e) => {
                    if (!previewMode) {
                      e.preventDefault();
                      handleElementClick(e, block, 'link', `links.${index}`, onClick);
                    } else {
                      handleLinkClick(e, link.action);
                    }
                  }}
                  style={{ color: content.linksColor }}
                  className="text-sm hover:opacity-80 transition-opacity cursor-pointer"
                >
                  {link.text}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </footer>
  );
}

// 🆕 Phase 3: 링크 그룹 블록 ====================
function LinkGroupBlock({ content, block, onClick }: { 
  content: LinkGroupContent;
  block: Block;
  onClick?: (element: SelectedElement) => void;
}) {
  const { previewMode, navigateToPageInPreview } = useBuilderStore();
  
  const handleLinkClick = (e: React.MouseEvent, action: ButtonAction) => {
    if (previewMode) {
      e.preventDefault();
      
      if (action.type === 'page' && action.pageId) {
        navigateToPageInPreview(action.pageId);
      } else if (action.type === 'external' && action.externalUrl) {
        console.log('외부 링크:', action.externalUrl);
        alert('미리보기 모드에서는 외부 링크를 열 수 없습니다.');
      }
    } else {
      e.preventDefault();
    }
  };

  const sectionBoxStyle = block.boxStyles?.['section'];
  
  const getLayoutClass = () => {
    switch (content.layout) {
      case 'horizontal':
        return 'flex flex-wrap gap-4';
      case 'vertical':
        return 'flex flex-col gap-2';
      case 'grid':
        return `grid gap-4`;
    }
  };
  
  const getAlignmentClass = () => {
    switch (content.alignment) {
      case 'left': return 'justify-start text-left';
      case 'center': return 'justify-center text-center';
      case 'right': return 'justify-end text-right';
      default: return 'justify-center text-center';
    }
  };

  const getGridStyle = () => {
    if (content.layout === 'grid') {
      return { gridTemplateColumns: `repeat(${content.columns || 3}, 1fr)` };
    }
    return {};
  };

  return (
    <section 
      className="container mx-auto px-6 py-8 cursor-pointer"
      style={convertBoxStyleToCSS(sectionBoxStyle)}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'SECTION') {
          handleElementClick(e, block, 'box', 'section', onClick);
        }
      }}
    >
      {content.showTitle && content.title && (
        <h3
          className="font-bold mb-4 cursor-pointer hover:opacity-80"
          style={{
            fontSize: `${content.titleFontSize}px`,
            color: content.titleColor,
            textAlign: content.alignment,
          }}
          onClick={(e) => handleElementClick(e, block, 'text', 'title', onClick)}
        >
          {content.title}
        </h3>
      )}
      
      {content.showDivider && (
        <hr className="mb-4 border-gray-300" />
      )}
      
      <div 
        className={`${getLayoutClass()} ${getAlignmentClass()}`}
        style={getGridStyle()}
      >
        {content.links.map((link, index) => {
          const href = 
            link.action.type === 'page' 
              ? `#page-${link.action.pageId}` 
              : link.action.type === 'external'
              ? link.action.externalUrl || '#'
              : '#';

          return (
            <a
              key={index}
              href={href}
              onClick={(e) => {
                if (!previewMode) {
                  e.preventDefault();
                  handleElementClick(e, block, 'link', `links.${index}`, onClick);
                } else {
                  handleLinkClick(e, link.action);
                }
              }}
              style={{ color: content.linksColor }}
              className="font-medium hover:underline transition-all cursor-pointer"
            >
              {link.text}
            </a>
          );
        })}
      </div>
    </section>
  );
}