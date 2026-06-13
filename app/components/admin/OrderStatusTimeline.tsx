import { cn } from '~/utils';
import { ORDER_STATUS_LABELS, ORDER_TIMELINE, type OrderStatus } from '~/utils/orderStatus';

const STATUS_COLORS: Record<
  OrderStatus,
  { dot: string; ring: string; line: string; label: string }
> = {
  PENDING_PAYMENT: {
    dot: 'bg-amber-400 border-amber-500',
    ring: 'ring-amber-200',
    line: 'bg-amber-400',
    label: 'text-amber-700 dark:text-amber-300',
  },
  PAID: {
    dot: 'bg-[#F2A7B7] border-[#de8a9b]',
    ring: 'ring-[#FFDDE5]',
    line: 'bg-[#F2A7B7]',
    label: 'text-[#c36d80] dark:text-[#FFDDE5]',
  },
  SHIPPING: {
    dot: 'bg-indigo-400 border-indigo-500',
    ring: 'ring-indigo-200',
    line: 'bg-indigo-400',
    label: 'text-indigo-700 dark:text-indigo-300',
  },
  DELIVERED: {
    dot: 'bg-emerald-400 border-emerald-500',
    ring: 'ring-emerald-200',
    line: 'bg-emerald-400',
    label: 'text-emerald-700 dark:text-emerald-300',
  },
  RECEIVED: {
    dot: 'bg-teal-500 border-teal-600',
    ring: 'ring-teal-200',
    line: 'bg-teal-500',
    label: 'text-teal-700 dark:text-teal-300',
  },
  COMPLAINED: {
    dot: 'bg-orange-400 border-orange-500',
    ring: 'ring-orange-200',
    line: 'bg-orange-400',
    label: 'text-orange-700 dark:text-orange-300',
  },
  CANCELLED: {
    dot: 'bg-red-500 border-red-600',
    ring: 'ring-red-200',
    line: 'bg-red-500',
    label: 'text-red-600 dark:text-red-300',
  },
  RESOLVED: {
    dot: 'bg-slate-500 border-slate-600',
    ring: 'ring-slate-200',
    line: 'bg-slate-400',
    label: 'text-slate-600 dark:text-slate-300',
  },
};

function getMainTimelineIndex(status: OrderStatus): number {
  if (status === 'RECEIVED') return ORDER_TIMELINE.indexOf('RECEIVED');
  if (status === 'COMPLAINED' || status === 'RESOLVED') return ORDER_TIMELINE.indexOf('DELIVERED');
  if (status === 'CANCELLED') return -1;
  return ORDER_TIMELINE.indexOf(status);
}

type OrderStatusTimelineProps = {
  status: OrderStatus;
  className?: string;
};

export function OrderStatusTimeline({ status, className }: OrderStatusTimelineProps) {
  const activeIndex = getMainTimelineIndex(status);
  const progressPct =
    activeIndex <= 0
      ? activeIndex === 0
        ? 0
        : 0
      : (activeIndex / (ORDER_TIMELINE.length - 1)) * 100;

  const lineColor =
    status === 'CANCELLED'
      ? STATUS_COLORS.CANCELLED.line
      : activeIndex >= 0
        ? STATUS_COLORS[ORDER_TIMELINE[activeIndex]].line
        : 'bg-primary-200';

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="font-heading text-base font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">
        Tiến trình đơn hàng
      </h3>

      <div className="relative px-1 pt-1 pb-1">
        <div className="absolute left-4 right-4 top-5 h-0.5 bg-[#FFDDE5] dark:bg-[#3a3a3a]" aria-hidden />
        <div
          className={cn('absolute left-4 top-5 h-0.5 transition-all duration-300', lineColor)}
          style={{ width: `calc((100% - 2rem) * ${Math.max(progressPct, status === 'CANCELLED' ? 0 : 8) / 100})` }}
          aria-hidden
        />

        <div className="relative flex justify-between gap-1">
          {ORDER_TIMELINE.map((step, index) => {
            const colors = STATUS_COLORS[step];
            const isDone = status !== 'CANCELLED' && activeIndex > index;
            const isActive =
              status !== 'CANCELLED' &&
              ((activeIndex === index && ORDER_TIMELINE.includes(status)) || (status === 'RECEIVED' && step === 'RECEIVED'));
            const isPending = !isDone && !isActive;

            return (
              <div key={step} className="flex min-w-0 flex-1 flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-all',
                    isDone && cn(colors.dot, 'text-white shadow-sm'),
                    isActive && cn(colors.dot, 'text-white shadow-md ring-4', colors.ring, 'scale-110'),
                    isPending && 'border-[#FFDDE5] bg-white text-[#8E8A8A] dark:border-[#3a3a3a] dark:bg-[#2a2226]',
                    status === 'CANCELLED' && 'opacity-40',
                  )}
                  title={ORDER_STATUS_LABELS[step]}
                >
                  {index + 1}
                </div>
                <span
                  className={cn(
                    'mt-2 max-w-[4.5rem] text-center text-[10px] leading-tight sm:max-w-none sm:text-[11px]',
                    isDone && colors.label,
                    isActive && cn(colors.label, 'font-semibold'),
                    isPending && 'text-[#8E8A8A]',
                    status === 'CANCELLED' && 'opacity-50',
                  )}
                >
                  {ORDER_STATUS_LABELS[step]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {status === 'CANCELLED' ? (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 dark:border-red-900 dark:bg-red-950/30">
          <span className={cn('h-3 w-3 rounded-full', STATUS_COLORS.CANCELLED.dot)} />
          <span className={cn('text-sm font-medium', STATUS_COLORS.CANCELLED.label)}>
            {ORDER_STATUS_LABELS.CANCELLED}
          </span>
        </div>
      ) : null}

      {status === 'COMPLAINED' || status === 'RESOLVED' ? (
        <div className="flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-[#FFDDE5] dark:bg-[#3a3a3a]" />
          <div
            className={cn(
              'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold',
              status === 'COMPLAINED'
                ? 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/30 dark:text-orange-300'
                : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300',
            )}
          >
            <span className={cn('h-2.5 w-2.5 rounded-full', STATUS_COLORS[status].dot)} />
            {ORDER_STATUS_LABELS[status]}
          </div>
          <div className="h-px flex-1 bg-[#FFDDE5] dark:bg-[#3a3a3a]" />
        </div>
      ) : null}
    </div>
  );
}
