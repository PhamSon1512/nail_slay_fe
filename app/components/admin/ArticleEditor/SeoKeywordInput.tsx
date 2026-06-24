import { RiBarChartBoxLine, RiQuestionLine } from 'react-icons/ri';
import { cn } from '~/utils';
import { SEO_PUBLISH_MIN_SCORE } from './seoConstants';

type SeoKeywordInputProps = {
  value: string;
  onChange: (v: string) => void;
  score: number;
};

function scoreBadgeClass(score: number): string {
  if (score >= SEO_PUBLISH_MIN_SCORE) return 'bg-green-100 text-green-700 border-green-200';
  if (score >= 50) return 'bg-orange-100 text-orange-700 border-orange-200';
  return 'bg-red-100 text-red-700 border-red-200';
}

export function SeoKeywordInput({ value, onChange, score }: SeoKeywordInputProps) {
  return (
    <div className="space-y-2 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <label className="text-sm font-semibold text-[#1d2327]">Từ khóa chính</label>
          <button
            type="button"
            className="text-[#a7aaad] hover:text-[#50575e]"
            title="Từ khóa chính là cụm từ bạn muốn xếp hạng trên Google. Rank Math sẽ phân tích nội dung dựa trên từ khóa này."
            aria-label="Giúp đỡ từ khóa chính"
          >
            <RiQuestionLine size={14} />
          </button>
        </div>
        <RiBarChartBoxLine size={18} className="text-[#50575e] opacity-70" aria-hidden />
      </div>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ví dụ: Rank Math SEO"
          className="w-full rounded border border-[#8c8f94] bg-white py-2 pl-3 pr-20 text-sm text-[#2c3338] placeholder:text-[#a7aaad] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        <span
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2 rounded border px-2 py-0.5 text-xs font-semibold tabular-nums',
            scoreBadgeClass(score),
          )}
        >
          {score} / 100
        </span>
      </div>
    </div>
  );
}
