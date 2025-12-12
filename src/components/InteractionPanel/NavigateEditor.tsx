import { useBuilderStore } from '../../store/builderStore';
import { useState, useEffect } from 'react';
import type { NavigateAction } from '../../types';

interface NavigateEditorProps {
  initialData?: NavigateAction;
  onChange: (data: NavigateAction) => void;
}

export default function NavigateEditor({ initialData, onChange }: NavigateEditorProps) {
  const { pages } = useBuilderStore();

  const [target, setTarget] = useState<NavigateAction['target']>(
    initialData?.target || 'external'
  );
  const [url, setUrl] = useState(initialData?.url || '');
  const [pageId, setPageId] = useState(initialData?.pageId || '');
  const [openInNewTab, setOpenInNewTab] = useState(initialData?.openInNewTab || false);

  // 변경사항이 있을 때마다 부모에게 전달
  useEffect(() => {
    let actionData: NavigateAction = {
      type: 'navigate',
      target,
      url: '',
    };

    if (target === 'internal') {
      if (pageId) {
        actionData.url = `#page-${pageId}`;
        actionData.pageId = pageId;
      }
    } else if (target === 'external') {
      actionData.url = url;
      actionData.openInNewTab = openInNewTab;
    } else if (target === 'mailto') {
      actionData.url = url.startsWith('mailto:') ? url : `mailto:${url}`;
    } else if (target === 'tel') {
      actionData.url = url.startsWith('tel:') ? url : `tel:${url}`;
    }

    // url이 있는 경우에만 onChange 호출
    if (actionData.url) {
      onChange(actionData);
    }
  }, [target, url, pageId, openInNewTab, onChange]);

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          이동 타입
        </label>
        <select
          value={target}
          onChange={(e) => setTarget(e.target.value as NavigateAction['target'])}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="external">외부 링크</option>
          <option value="internal">내부 페이지</option>
          <option value="mailto">이메일</option>
          <option value="tel">전화</option>
        </select>
      </div>

      {target === 'internal' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이동할 페이지
          </label>
          <select
            value={pageId}
            onChange={(e) => setPageId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">페이지 선택</option>
            {pages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            내부 페이지 이동은 전체 웹사이트 내보내기 시 동작합니다
          </p>
        </div>
      )}

      {target === 'external' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="open-new-tab"
              checked={openInNewTab}
              onChange={(e) => setOpenInNewTab(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="open-new-tab" className="text-sm text-gray-700">
              새 탭에서 열기
            </label>
          </div>
        </>
      )}

      {target === 'mailto' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이메일 주소
          </label>
          <input
            type="email"
            value={url.replace('mailto:', '')}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="example@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {target === 'tel' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            전화번호
          </label>
          <input
            type="tel"
            value={url.replace('tel:', '')}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="010-1234-5678"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}
    </div>
  );
}
