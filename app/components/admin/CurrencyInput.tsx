import { Input, type InputProps } from '@heroui/react';
import { useEffect, useState } from 'react';

interface CurrencyInputProps extends Omit<InputProps, 'value' | 'onValueChange'> {
  value: string;
  onValueChange: (value: string) => void;
}

function formatVndDigits(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  const num = Number.parseInt(digits, 10);
  if (Number.isNaN(num)) return '';
  return new Intl.NumberFormat('vi-VN').format(num);
}

export function CurrencyInput({ value, onValueChange, onFocus, onBlur, ...props }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused) return;
    setDisplayValue(formatVndDigits(value));
  }, [value, isFocused]);

  const handleChange = (val: string) => {
    const rawValue = val.replace(/\D/g, '');
    setDisplayValue(rawValue);
    onValueChange(rawValue);
  };

  return (
    <Input
      {...props}
      inputMode="numeric"
      value={displayValue}
      onValueChange={handleChange}
      onFocus={(e) => {
        setIsFocused(true);
        setDisplayValue(value.replace(/\D/g, ''));
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        setDisplayValue(formatVndDigits(value));
        onBlur?.(e);
      }}
    />
  );
}
