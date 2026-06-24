import { Input, Switch, Textarea } from '@heroui/react';
import { adminInputClassNames } from '~/utils/adminForm';
import { countSeoCharacters } from './seoTextLength';

type SeoAdvancedProps = {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  noIndex: boolean;
  onMetaTitleChange: (v: string) => void;
  onMetaDescriptionChange: (v: string) => void;
  onCanonicalUrlChange: (v: string) => void;
  onNoIndexChange: (v: boolean) => void;
};

export function SeoAdvanced({
  metaTitle,
  metaDescription,
  canonicalUrl,
  noIndex,
  onMetaTitleChange,
  onMetaDescriptionChange,
  onCanonicalUrlChange,
  onNoIndexChange,
}: SeoAdvancedProps) {
  return (
    <div className="space-y-4">
      <Input
        label="Meta Title"
        value={metaTitle}
        onValueChange={onMetaTitleChange}
        description={`${countSeoCharacters(metaTitle)}/60 ký tự`}
        classNames={adminInputClassNames}
      />
      <Textarea
        label="Meta Description"
        value={metaDescription}
        onValueChange={onMetaDescriptionChange}
        description={`${countSeoCharacters(metaDescription)}/160 ký tự`}
        minRows={3}
        classNames={adminInputClassNames}
      />
      <Input
        label="Canonical URL"
        value={canonicalUrl}
        onValueChange={onCanonicalUrlChange}
        placeholder="https://nailslay.com/articles/..."
        classNames={adminInputClassNames}
      />
      <Switch isSelected={noIndex} onValueChange={onNoIndexChange}>
        Noindex — không cho Google lập chỉ mục
      </Switch>
    </div>
  );
}
