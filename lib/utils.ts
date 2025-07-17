import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (Math.abs(num) >= 1_000_000_000) {
    return "$" + (num / 1_000_000_000).toFixed(2) + "B"
  }
  if (Math.abs(num) >= 1_000_000) {
    return "$" + (num / 1_000_000).toFixed(2) + "M"
  }
  if (Math.abs(num) >= 1_000) {
    return "$" + (num / 1_000).toFixed(1) + "K"
  }
  return "$" + num.toLocaleString()
}
