import { useState } from 'react';
import { Input } from '@heroui/react';
import { adminInputClassNames } from '~/utils/adminForm';

const SITE_ORIGIN = 'https://nailslaystudio.com';

type ArticlePermalinkProps = {
  slug: string;
  onSlugChange: (slug: string) => void;
  onSlugManualChange: (manual: boolean) => void;
};

export function ArticlePermalink({ slug, onSlugChange, onSlugManualChange }: ArticlePermalinkProps) {
  const [editing, setEditing] = useState(false);
  const displaySlug = slug || '…';
  const fullUrl = `${SITE_ORIGIN}/articles/${displaySlug}/`;

  if (editing) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-[#50575e] shrink-0">Đường dẫn:</span>
        <span className="text-[#50575e] shrink-0">{SITE_ORIGIN}/articles/</span>
        <Input
          size="sm"
          value={slug}
          onValueChange={(v) => {
            onSlugManualChange(true);
            onSlugChange(v);
          }}
          classNames={{ ...adminInputClassNames, inputWrapper: 'h-8 min-h-8', input: 'text-sm' }}
          className="max-w-xs"
          autoFocus
        />
        <span className="text-[#50575e]">/</span>
        <button
          type="button"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          onClick={() => setEditing(false)}
        >
          OK
        </button>
      </div>
    );
  }

  return (
    <p className="text-sm text-[#50575e] break-all">
      <span className="font-medium">Đường dẫn:</span>{' '}
      <a href={slug ? fullUrl : undefined} className="text-primary-600 hover:underline" target="_blank" rel="noreferrer">
        {fullUrl}
      </a>{' '}
      <button
        type="button"
        className="text-primary-600 hover:underline font-medium"
        onClick={() => setEditing(true)}
      >
        Chỉnh sửa
      </button>
    </p>
  );
}
