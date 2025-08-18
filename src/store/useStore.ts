import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { CardData, CardSet, User, CollectionResponse } from '@/types';

// ユーザー状態の管理
interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'user-store',
    }
  )
);

// カード関連の状態管理
interface CardState {
  cards: CardData[];
  selectedCard: CardData | null;
  isLoading: boolean;
  error: string | null;
  setCards: (cards: CardData[]) => void;
  setSelectedCard: (card: CardData | null) => void;
  addCard: (card: CardData) => void;
  updateCard: (id: string, updates: Partial<CardData>) => void;
  removeCard: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCardStore = create<CardState>()(
  devtools(
    (set, get) => ({
      cards: [],
      selectedCard: null,
      isLoading: false,
      error: null,
      setCards: (cards) => set({ cards }),
      setSelectedCard: (selectedCard) => set({ selectedCard }),
      addCard: (card) => set({ cards: [...get().cards, card] }),
      updateCard: (id, updates) =>
        set({
          cards: get().cards.map((card) =>
            card.id === id ? { ...card, ...updates } : card
          ),
        }),
      removeCard: (id) =>
        set({
          cards: get().cards.filter((card) => card.id !== id),
        }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'card-store',
    }
  )
);

// セット関連の状態管理
interface SetState {
  sets: CardSet[];
  selectedSet: CardSet | null;
  isLoading: boolean;
  error: string | null;
  setSets: (sets: CardSet[]) => void;
  setSelectedSet: (set: CardSet | null) => void;
  addSet: (set: CardSet) => void;
  updateSet: (id: string, updates: Partial<CardSet>) => void;
  removeSet: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSetStore = create<SetState>()(
  devtools(
    (set, get) => ({
      sets: [],
      selectedSet: null,
      isLoading: false,
      error: null,
      setSets: (sets) => set({ sets }),
      setSelectedSet: (selectedSet) => set({ selectedSet }),
      addSet: (cardSet) => set({ sets: [...get().sets, cardSet] }),
      updateSet: (id, updates) =>
        set({
          sets: get().sets.map((cardSet) =>
            cardSet.id === id ? { ...cardSet, ...updates } : cardSet
          ),
        }),
      removeSet: (id) =>
        set({
          sets: get().sets.filter((cardSet) => cardSet.id !== id),
        }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'set-store',
    }
  )
);

// コレクション関連の状態管理
interface CollectionState {
  collection: CollectionResponse | null;
  isLoading: boolean;
  error: string | null;
  setCollection: (collection: CollectionResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshCollection: () => Promise<void>;
}

export const useCollectionStore = create<CollectionState>()(
  devtools(
    (set, get) => ({
      collection: null,
      isLoading: false,
      error: null,
      setCollection: (collection) => set({ collection }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      refreshCollection: async () => {
        const { setLoading, setError, setCollection } = get();
        setLoading(true);
        setError(null);
        
        try {
          const response = await fetch('/api/collection');
          if (!response.ok) {
            throw new Error('コレクションの取得に失敗しました');
          }
          const collection = await response.json();
          setCollection(collection);
        } catch (error) {
          setError(error instanceof Error ? error.message : '不明なエラーが発生しました');
        } finally {
          setLoading(false);
        }
      },
    }),
    {
      name: 'collection-store',
    }
  )
);

// UI状態の管理
interface UIState {
  sidebarOpen: boolean;
  modalOpen: boolean;
  modalType: 'card-creation' | 'set-creation' | 'purchase' | null;
  setSidebarOpen: (open: boolean) => void;
  setModalOpen: (open: boolean) => void;
  setModalType: (type: 'card-creation' | 'set-creation' | 'purchase' | null) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      sidebarOpen: false,
      modalOpen: false,
      modalType: null,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setModalOpen: (modalOpen) => set({ modalOpen }),
      setModalType: (modalType) => set({ modalType }),
    }),
    {
      name: 'ui-store',
    }
  )
);

