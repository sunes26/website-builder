// src/utils/blockTemplates.ts
import type { Block, BlockType, HeaderContent, HeroContent, ContentBlockContent, GalleryContent, FormContent, FooterContent, LinkGroupContent } from '@/types';

// 블록 템플릿 생성 함수
export const createBlockTemplate = (type: BlockType): Block => {
  const id = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  switch (type) {
    case '헤더':
      return {
        id,
        type,
        content: {
          logo: '새 로고',
          logoFontSize: 24,
          logoColor: '#1f2937',
          navLinks: [
            { 
              text: '링크 1', 
              action: { 
                type: 'none', 
                label: '링크 1' 
              } 
            },
            { 
              text: '링크 2', 
              action: { 
                type: 'none', 
                label: '링크 2' 
              } 
            },
          ],
          navLinksColor: '#4b5563',
        } as HeaderContent,
      };

    case '히어로':
      return {
        id,
        type,
        content: {
          backgroundImage: 'https://placehold.co/1200x400/dddddd/aaaaaa?text=New+Block',
          title: '새 타이틀',
          titleFontSize: 48,
          titleColor: '#1f2937',
          subtitle: '여기에 서브텍스트를 입력하세요.',
          subtitleFontSize: 20,
          subtitleColor: '#4b5563',
          buttonText: '버튼',
          buttonAction: { 
            type: 'none', 
            label: '버튼' 
          },
        } as HeroContent,
      };

    case '콘텐츠':
      return {
        id,
        type,
        content: {
          title: '제목',
          titleFontSize: 30,
          titleColor: '#1f2937',
          text: '새로운 콘텐츠 내용을 여기에 작성하세요. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.',
          textFontSize: 16,
          textColor: '#374151',
          imageUrl: 'https://placehold.co/600x400/eeeeee/aaaaaa?text=New+Image',
          imagePosition: 'right',
          // 🆕 Phase 2: 콘텐츠 링크
          links: [
            { 
              text: '더 알아보기', 
              action: { 
                type: 'none', 
                label: '더 알아보기' 
              } 
            },
          ],
          linksColor: '#3b82f6',
          showLinks: true,
        } as ContentBlockContent,
      };

    case '갤러리':
      return {
        id,
        type,
        content: {
          title: '갤러리',
          titleColor: '#1f2937',
          images: [
            'https://placehold.co/300x300/eeeeee/aaaaaa?text=Image+1',
            'https://placehold.co/300x300/eeeeee/aaaaaa?text=Image+2',
            'https://placehold.co/300x300/eeeeee/aaaaaa?text=Image+3',
            'https://placehold.co/300x300/eeeeee/aaaaaa?text=Image+4',
          ],
          columns: 4,
        } as GalleryContent,
      };

    case '폼(Form)':
      return {
        id,
        type,
        content: {
          title: '문의하기',
          titleFontSize: 24,
          titleColor: '#1f2937',
          fields: [
            { id: 'name', type: 'text', label: '이름', placeholder: '이름을 입력하세요' },
            { id: 'email', type: 'email', label: '이메일', placeholder: '이메일을 입력하세요' },
            { id: 'message', type: 'textarea', label: '메시지', placeholder: '내용을 입력하세요' },
          ],
          buttonText: '제출하기',
        } as FormContent,
      };

    case '푸터':
      return {
        id,
        type,
        content: {
          text: '© 2025 새로운 푸터.',
          fontSize: 14,
          textColor: '#9ca3af',
          // 🆕 Phase 1: 푸터 링크
          links: [
            { 
              text: '홈', 
              action: { 
                type: 'none', 
                label: '홈' 
              } 
            },
            { 
              text: '소개', 
              action: { 
                type: 'none', 
                label: '소개' 
              } 
            },
            { 
              text: '문의', 
              action: { 
                type: 'none', 
                label: '문의' 
              } 
            },
          ],
          linksColor: '#9ca3af',
          showLinks: true,
        } as FooterContent,
      };

    case '링크 그룹':
      return {
        id,
        type,
        content: {
          title: '관련 링크',
          titleFontSize: 20,
          titleColor: '#1f2937',
          showTitle: true,
          links: [
            { 
              text: '링크 1', 
              action: { 
                type: 'none', 
                label: '링크 1' 
              } 
            },
            { 
              text: '링크 2', 
              action: { 
                type: 'none', 
                label: '링크 2' 
              } 
            },
            { 
              text: '링크 3', 
              action: { 
                type: 'none', 
                label: '링크 3' 
              } 
            },
          ],
          linksColor: '#3b82f6',
          layout: 'horizontal',
          columns: 3,
          showDivider: true,
          alignment: 'center',
        } as LinkGroupContent,
      };

    default:
      throw new Error(`Unknown block type: ${type}`);
  }
};

// 블록 타입 아이콘 매핑
export const blockIcons: Record<BlockType, string> = {
  '헤더': 'menu',
  '히어로': 'image',
  '콘텐츠': 'file-text',
  '갤러리': 'grid',
  '폼(Form)': 'edit',
  '푸터': 'align-center',
  '링크 그룹': 'link',
};