import { type ClassValue, clsx } from 'clsx';
import { Rarity } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// 価格のフォーマット（日本円）
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(price);
}

// 日付のフォーマット
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

// ファイルサイズのフォーマット
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 希少度による色の取得
export function getRarityColor(rarity: Rarity): string {
  switch (rarity) {
    case 'legendary':
      return 'text-orange-500 border-orange-500';
    case 'epic':
      return 'text-purple-500 border-purple-500';
    case 'rare':
      return 'text-blue-500 border-blue-500';
    case 'common':
    default:
      return 'text-gray-500 border-gray-500';
  }
}

// 希少度による背景グラデーションの取得
export function getRarityGradient(rarity: Rarity): string {
  switch (rarity) {
    case 'legendary':
      return 'bg-gradient-to-r from-orange-400 to-orange-600';
    case 'epic':
      return 'bg-gradient-to-r from-purple-400 to-purple-600';
    case 'rare':
      return 'bg-gradient-to-r from-blue-400 to-blue-600';
    case 'common':
    default:
      return 'bg-gradient-to-r from-gray-400 to-gray-600';
  }
}

// 希少度の日本語表示
export function getRarityLabel(rarity: Rarity): string {
  switch (rarity) {
    case 'legendary':
      return '伝説';
    case 'epic':
      return '史詩';
    case 'rare':
      return 'レア';
    case 'common':
    default:
      return 'コモン';
  }
}

// ファイル拡張子の検証
export function isValidImageFile(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  return allowedTypes.includes(file.type);
}

// ファイルサイズの検証
export function isValidFileSize(file: File, maxSize: number = 5 * 1024 * 1024): boolean {
  return file.size <= maxSize;
}

// URLからファイル名を抽出
export function getFileNameFromUrl(url: string): string {
  return url.split('/').pop() || '';
}

// エラーメッセージの生成
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return '不明なエラーが発生しました';
}

// ランダムなIDの生成
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// 数値の安全な解析
export function safeParseNumber(value: string | number, defaultValue: number = 0): number {
  if (typeof value === 'number') return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

// URLパラメータの生成
export function buildQueryParams(params: Record<string, string | number | boolean | undefined | null>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

// 配列をページネーションで分割
export function paginateArray<T>(array: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return array.slice(start, end);
}

// デバウンス関数
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
