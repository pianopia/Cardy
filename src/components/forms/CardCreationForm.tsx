"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CardCreationForm } from "@/types";
import Image from "next/image";

export default function CardCreationFormComponent({ onCreated }: { onCreated?: () => void }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CardCreationForm>();
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function uploadImage(file: File): Promise<string> {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "画像アップロードに失敗しました");
    }
    const data = await res.json();
    return data.url as string;
  }

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      // Use the files captured in onChange to avoid RHF FileList typing issues
      if (!frontFile || !backFile) {
        throw new Error("画像ファイルを選択してください");
      }

      const [frontImageUrl, backImageUrl] = await Promise.all([
        uploadImage(frontFile),
        uploadImage(backFile),
      ]);

      const payload = {
        name: values.name,
        description: values.description,
        frontImageUrl,
        backImageUrl,
        price: Number(values.price),
        totalSupply: Number(values.totalSupply),
        category: values.category,
      };

      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "カード作成に失敗しました");
      }

      reset();
      setFrontPreview(null);
      setBackPreview(null);
      setFrontFile(null);
      setBackFile(null);
      onCreated?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    }
  });

  return (
    <form onSubmit={onSubmit} className="w-full max-w-xl space-y-4 border rounded-lg p-4">
      <h2 className="text-lg font-semibold">カード作成</h2>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium">名前</label>
        <input
          className="mt-1 w-full border rounded p-2"
          placeholder="カード名"
          {...register("name", { required: "必須です", minLength: 1 })}
        />
        {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">説明</label>
        <textarea
          className="mt-1 w-full border rounded p-2"
          placeholder="説明"
          rows={3}
          {...register("description")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">表面画像</label>
          <input
            type="file"
            accept="image/*"
            className="mt-1 w-full"
            {...register("frontImage", { required: "必須です" })}
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setFrontFile(file);
              if (file) setFrontPreview(URL.createObjectURL(file));
              else setFrontPreview(null);
            }}
          />
          {errors.frontImage && <p className="text-xs text-red-600">{errors.frontImage.message as string}</p>}
          {frontPreview && (
            <div className="mt-2 h-40 relative border rounded overflow-hidden">
              <Image src={frontPreview} alt="front preview" fill className="object-contain" />
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">裏面画像</label>
          <input
            type="file"
            accept="image/*"
            className="mt-1 w-full"
            {...register("backImage", { required: "必須です" })}
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setBackFile(file);
              if (file) setBackPreview(URL.createObjectURL(file));
              else setBackPreview(null);
            }}
          />
          {errors.backImage && <p className="text-xs text-red-600">{errors.backImage.message as string}</p>}
          {backPreview && (
            <div className="mt-2 h-40 relative border rounded overflow-hidden">
              <Image src={backPreview} alt="back preview" fill className="object-contain" />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">価格 (円)</label>
          <input
            type="number"
            min={0}
            step={1}
            className="mt-1 w-full border rounded p-2"
            placeholder="1000"
            {...register("price", { required: "必須です", min: 0 })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">総発行数</label>
          <input
            type="number"
            min={1}
            step={1}
            className="mt-1 w-full border rounded p-2"
            placeholder="100"
            {...register("totalSupply", { required: "必須です", min: 1 })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">カテゴリ</label>
        <input
          className="mt-1 w-full border rounded p-2"
          placeholder="例: fantasy"
          {...register("category", { required: "必須です" })}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 rounded bg-black text-white disabled:opacity-60"
      >
        {isSubmitting ? "作成中..." : "作成する"}
      </button>
    </form>
  );
}
