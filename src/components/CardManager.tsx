"use client";

import React, { useCallback, useEffect, useState } from "react";
import CardCreationForm from "@/components/forms/CardCreationForm";
import Card3D from "@/components/3d/Card3D";
import { CardData } from "@/types";

export default function CardManager() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cards", { cache: "no-store" });
      if (!res.ok) throw new Error("カード一覧の取得に失敗しました");
      const data = await res.json();
      setCards(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "不明なエラー");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return (
    <div className="w-full flex flex-col gap-8">
      <CardCreationForm onCreated={fetchCards} />

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">カード一覧</h2>
          <button className="text-sm underline" onClick={fetchCards}>再読み込み</button>
        </div>
        {loading && <p className="text-sm text-gray-500">読み込み中...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {cards.map((card) => (
            <div key={card.id} className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">{card.name}</h3>
              <Card3D
                frontImage={card.frontImageUrl}
                backImage={card.backImageUrl}
                cardData={card}
                interactive
                scale={1.6}
              />
              <p className="text-sm text-gray-600 mt-2">{card.description}</p>
              <div className="text-xs text-gray-500 mt-1">総発行数: {card.totalSupply} / 残り: {card.remainingSupply}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
