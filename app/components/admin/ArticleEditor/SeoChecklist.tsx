import { Accordion, AccordionItem } from '@heroui/react';
import { RiCheckboxCircleFill, RiCloseCircleFill, RiQuestionLine } from 'react-icons/ri';
import type { SeoCheck } from './useSeoAnalysis';
import { cn } from '~/utils';

function CheckRow({ check }: { check: SeoCheck }) {
  return (
    <div className="flex items-start gap-2 py-1.5">
      {check.passed ? (
        <RiCheckboxCircleFill className="mt-0.5 shrink-0 text-green-500" size={18} />
      ) : (
        <RiCloseCircleFill className="mt-0.5 shrink-0 text-red-500" size={18} />
      )}
      <span className={cn('flex-1 text-sm', check.passed ? 'text-[#2D2A2A]' : 'text-[#5C5858]')}>{check.label}</span>
      <button
        type="button"
        className="shrink-0 rounded-full p-0.5 text-[#9E9A9A] hover:bg-[#F0ECEC]"
        title={check.tooltip}
        aria-label="Giải thích"
      >
        <RiQuestionLine size={16} />
      </button>
    </div>
  );
}

function sectionBadge(checks: SeoCheck[]) {
  const failed = checks.filter((c) => !c.passed).length;
  if (failed === 0) return { text: 'Tất cả đều tốt', color: 'success' as const };
  return { text: `${failed} lỗi`, color: 'danger' as const };
}

type SeoChecklistProps = {
  basicChecks: SeoCheck[];
  additionalChecks: SeoCheck[];
  titleReadability: SeoCheck[];
  contentReadability: SeoCheck[];
};

export function SeoChecklist({
  basicChecks,
  additionalChecks,
  titleReadability,
  contentReadability,
}: SeoChecklistProps) {
  const basicBadge = sectionBadge(basicChecks);
  const additionalBadge = sectionBadge(additionalChecks);
  const titleBadge = sectionBadge(titleReadability);
  const contentBadge = sectionBadge(contentReadability);

  return (
    <Accordion selectionMode="multiple" defaultExpandedKeys={['basic', 'additional', 'title', 'content']}>
      <AccordionItem
        key="basic"
        title="SEO cơ bản"
        subtitle={
          <span className={basicBadge.color === 'success' ? 'text-green-600' : 'text-red-600 font-[Montserrat]'}>{basicBadge.text}</span>
        }
      >
        <div className="divide-y divide-[#F0ECEC]">
          {basicChecks.map((c) => (
            <CheckRow key={c.id} check={c} />
          ))}
        </div>
      </AccordionItem>
      <AccordionItem
        key="additional"
        title="Bổ sung"
        subtitle={
          <span className={additionalBadge.color === 'success' ? 'text-green-600' : 'text-red-600 font-[Montserrat]'}>
            {additionalBadge.text}
          </span>
        }
      >
        <div className="divide-y divide-[#F0ECEC]">
          {additionalChecks.map((c) => (
            <CheckRow key={c.id} check={c} />
          ))}
        </div>
      </AccordionItem>
      <AccordionItem
        key="title"
        title="Khả năng đọc tiêu đề"
        subtitle={
          <span className={titleBadge.color === 'success' ? 'text-green-600' : 'text-red-600 font-[Montserrat]'}>{titleBadge.text}</span>
        }
      >
        <div className="divide-y divide-[#F0ECEC]">
          {titleReadability.map((c) => (
            <CheckRow key={c.id} check={c} />
          ))}
        </div>
      </AccordionItem>
      <AccordionItem
        key="content"
        title="Khả năng đọc nội dung"
        subtitle={
          <span className={contentBadge.color === 'success' ? 'text-green-600' : 'text-red-600 font-[Montserrat]'}>{contentBadge.text}</span>
        }
      >
        <div className="divide-y divide-[#F0ECEC]">
          {contentReadability.map((c) => (
            <CheckRow key={c.id} check={c} />
          ))}
        </div>
      </AccordionItem>
    </Accordion>
  );
}
