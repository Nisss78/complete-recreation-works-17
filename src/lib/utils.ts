
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export function formatTimeAgo(dateString: string, locale = 'en'): string {
  const now = new Date();
  const past = new Date(dateString);
  const diffInDays = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60 * 24));
  
  if (locale === 'ja') {
    return `${diffInDays}日前`;
  }
  return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
}
