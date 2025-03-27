import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertType(value: string) {
  const maps: { [index: string]: unknown } = { NaN, null: null, undefined, Infinity, '-Infinity': -Infinity };

  return value in maps ? maps[value] : value;
}
