// カードデータの型定義
export interface CardData {
  id: string;
  name: string;
  description: string;
  frontImageUrl: string;
  backImageUrl: string;
  price: number;
  totalSupply: number;
  remainingSupply: number;
  category: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

// カード作成フォームの型定義
export interface CardCreationForm {
  name: string;
  description: string;
  frontImage: File;
  backImage: File;
  price: number;
  totalSupply: number;
  category: string;
}

// カードセットの型定義
export interface CardSet {
  id: string;
  name: string;
  description: string;
  cards: CardData[];
  price: number;
  totalSupply: number;
  remainingSupply: number;
  soldCount: number;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

// セット作成フォームの型定義
export interface SetCreationForm {
  name: string;
  description: string;
  cardIds: string[];
  price: number;
  totalSupply: number;
}

// ユーザーの型定義
export interface User {
  id: string;
  email: string;
  username: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// 所有権の型定義
export interface CardOwnership {
  id: string;
  userId: string;
  cardId: string;
  purchasePrice: number;
  purchasedAt: string;
}

export interface SetOwnership {
  id: string;
  userId: string;
  setId: string;
  purchasePrice: number;
  purchasedAt: string;
}

// コレクションレスポンスの型定義
export interface CollectionResponse {
  ownedCards: (CardOwnership & { card: CardData })[];
  ownedSets: (SetOwnership & { set: CardSet })[];
  totalValue: number;
}

// 取引の型定義
export interface Transaction {
  id: string;
  buyerId: string;
  sellerId: string;
  itemType: 'card' | 'set';
  itemId: string;
  amount: number;
  stripePaymentIntentId?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
}

// 購入リクエストの型定義
export interface PurchaseRequest {
  paymentMethodId: string;
}

// APIエラーの型定義
export interface APIError {
  code: string;
  message: string;
  details?: unknown;
}

// エラーコードの定義
export enum ErrorCodes {
  CARD_NOT_FOUND = 'CARD_NOT_FOUND',
  SET_NOT_FOUND = 'SET_NOT_FOUND',
  INSUFFICIENT_SUPPLY = 'INSUFFICIENT_SUPPLY',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR',
  DUPLICATE_PURCHASE = 'DUPLICATE_PURCHASE'
}

// 3Dカードコンポーネントのプロパティ
export interface Card3DProps {
  frontImage: string;
  backImage: string;
  cardData: CardData;
  interactive?: boolean;
  onCardClick?: (cardId: string) => void;
  scale?: number;
  autoRotate?: boolean;
}

// 希少度の定義
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

// 希少度の計算（総発行数による）
export function calculateRarity(totalSupply: number): Rarity {
  if (totalSupply <= 10) return 'legendary';
  if (totalSupply <= 50) return 'epic';
  if (totalSupply <= 200) return 'rare';
  return 'common';
}

