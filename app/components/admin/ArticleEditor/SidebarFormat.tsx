import { Radio, RadioGroup } from '@heroui/react';
import { EditorMetabox } from './EditorMetabox';

type SidebarFormatProps = {
  schemaType: string;
  onSchemaTypeChange: (v: string) => void;
};

const FORMATS = [
  { value: 'Article', label: 'Chuẩn' },
  { value: 'BlogPosting', label: 'Tin tức' },
  { value: 'HowTo', label: 'Hướng dẫn' },
];

export function SidebarFormat({ schemaType, onSchemaTypeChange }: SidebarFormatProps) {
  return (
    <EditorMetabox title="Định dạng">
      <RadioGroup
        value={schemaType}
        onValueChange={onSchemaTypeChange}
        size="sm"
        classNames={{ label: 'text-sm text-[#2c3338]' }}
      >
        {FORMATS.map((f) => (
          <Radio key={f.value} value={f.value} classNames={{ label: 'text-sm' }}>
            {f.label}
          </Radio>
        ))}
      </RadioGroup>
    </EditorMetabox>
  );
}
