import { Input, type InputProps } from '@heroui/react';
import { useState, useEffect } from 'react';

interface CurrencyInputProps extends Omit<InputProps, 'value' | 'onValueChange'> {
  value: string;
  onValueChange: (value: string) => void;
}

export function CurrencyInput({ value, onValueChange, ...props }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (!value) {
      setDisplayValue('');
      return;
    }
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setDisplayValue(new Intl.NumberFormat('vi-VN').format(num));
    }
  }, [value]);

  const handleChange = (val: string) => {
    const rawValue = val.replace(/\D/g, '');
    onValueChange(rawValue);
  };

  return (
    <Input
      {...props}
      value={displayValue}
      onValueChange={handleChange}
    />
  );
}
