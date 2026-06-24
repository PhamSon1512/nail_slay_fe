import { Button, Tooltip } from '@heroui/react';
import { cn } from '~/utils';

export function EditorToolbarButton({
  active,
  disabled,
  onPress,
  children,
  label,
}: {
  active?: boolean;
  disabled?: boolean;
  onPress: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <Tooltip content={label} placement="top" delay={300} isDisabled={disabled}>
      <span className="inline-flex">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          aria-label={label}
          isDisabled={disabled}
          onPress={onPress}
          className={cn(
            'min-w-[30px] min-h-[30px] h-[30px] w-[30px] rounded-sm border border-transparent',
            disabled && 'opacity-40 cursor-not-allowed',
            active
              ? 'bg-primary-200 border-primary-300 text-[#1d1d1d]'
              : 'bg-transparent text-[#50575e] hover:bg-[#e8e8e8] hover:border-[#c3c4c7]',
          )}
        >
          {children}
        </Button>
      </span>
    </Tooltip>
  );
}
