import { Card, CardBody } from '@heroui/react';
import type { ComponentType } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { cn } from '~/utils';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: ComponentType<{ size?: number; className?: string }>;
  change?: number;
  changeLabel?: string;
  colorClass?: string;
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  change,
  changeLabel,
  colorClass = 'bg-primary-100/70 text-[#1D1D1D] dark:bg-primary-700/30 dark:text-[#FFF3F5]',
}: StatsCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card shadow="sm" className="border-none bg-white dark:bg-[#201a1d] transition-all duration-300 hover:shadow-xl hover:shadow-primary-100/40 dark:hover:shadow-black/50 hover:-translate-y-1 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent dark:from-primary-900/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardBody className="flex flex-row items-center gap-4 p-5 relative z-10">
        {/* Icon */}
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', colorClass)}>
          <Icon size={22} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] md:text-xs text-[#8E8A8A] font-bold uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-2xl md:text-3xl font-extrabold font-sans text-[#1D1D1D] dark:text-[#FFF3F5] leading-none tracking-tight">
            {value}
          </p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-1.5">
              {isPositive ? (
                <RiArrowUpSLine size={14} className="text-emerald-500" />
              ) : (
                <RiArrowDownSLine size={14} className="text-red-400" />
              )}
              <span
                className={cn(
                  'text-[11px] font-medium',
                  isPositive ? 'text-emerald-500' : 'text-red-400',
                )}
              >
                {Math.abs(change)}%{changeLabel ? ` ${changeLabel}` : ''}
              </span>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
