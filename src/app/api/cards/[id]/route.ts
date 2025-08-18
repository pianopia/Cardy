import { NextResponse } from "next/server";
import { CardData } from "@/types";

declare global {
  var __cards: CardData[] | undefined;
}

if (!globalThis.__cards) {
  globalThis.__cards = [] as CardData[];
}
const cards: CardData[] = globalThis.__cards;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const segments = url.pathname.split('/');
  const id = segments[segments.length - 1];
  const card = cards.find((c) => c.id === id);
  if (!card) return new NextResponse("カードが見つかりません", { status: 404 });
  return NextResponse.json(card);
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const segments = url.pathname.split('/');
    const id = segments[segments.length - 1];
    const idx = cards.findIndex((c) => c.id === id);
    if (idx === -1) return new NextResponse("カードが見つかりません", { status: 404 });

    const body = (await request.json()) as Partial<CardData>;
    const updated: CardData = {
      ...cards[idx],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    cards[idx] = updated;
    return NextResponse.json(updated);
  } catch {
    return new NextResponse("更新中にエラーが発生しました", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const segments = url.pathname.split('/');
  const id = segments[segments.length - 1];
  const idx = cards.findIndex((c) => c.id === id);
  if (idx === -1) return new NextResponse("カードが見つかりません", { status: 404 });
  const [removed] = cards.splice(idx, 1);
  return NextResponse.json(removed);
}
