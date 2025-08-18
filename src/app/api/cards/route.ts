import { NextResponse } from "next/server";
import { CardData } from "@/types";

declare global {
  var __cards: CardData[] | undefined;
}

if (!globalThis.__cards) {
  globalThis.__cards = [] as CardData[];
}
const cards: CardData[] = globalThis.__cards;

export async function GET() {
  return NextResponse.json(cards);
}

interface CreateCardRequest {
  name: string;
  description?: string;
  frontImageUrl: string;
  backImageUrl: string;
  price: number;
  totalSupply: number;
  category?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateCardRequest;
    if (!body.name || !body.frontImageUrl || !body.backImageUrl || !body.totalSupply || body.price === undefined) {
      return new NextResponse("必須フィールドが不足しています", { status: 400 });
    }

    const now = new Date().toISOString();
    const newCard: CardData = {
      id: (Math.random().toString(36).slice(2) + Date.now().toString(36)),
      name: body.name,
      description: body.description || "",
      frontImageUrl: body.frontImageUrl,
      backImageUrl: body.backImageUrl,
      price: Number(body.price),
      totalSupply: Number(body.totalSupply),
      remainingSupply: Number(body.totalSupply),
      category: body.category || "general",
      creatorId: "demo-user", // TODO: 認証導入後に置換
      createdAt: now,
      updatedAt: now,
    };

    cards.push(newCard);
    return NextResponse.json(newCard, { status: 201 });
  } catch {
    return new NextResponse("カード作成中にエラーが発生しました", { status: 500 });
  }
}
