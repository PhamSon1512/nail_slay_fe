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
    <Card shadow="none" className="border border-primary-100/80 dark:border-[#4a3b42] bg-white/80 dark:bg-[#2a2226] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary-200">
      <CardBody className="flex flex-row items-center gap-4 p-5">
        {/* Icon */}
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', colorClass)}>
          <Icon size={22} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[#8E8A8A] dark:text-[#FFDDE5] font-medium uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-2xl font-bold font-heading text-[#1D1D1D] dark:text-[#FFF3F5] leading-none">
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
