import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const fileEntry = formData.get("file");

    // Validate existence and ensure it's not a string (which would indicate a text field)
    if (!fileEntry || typeof fileEntry === "string") {
      return new NextResponse("ファイルが見つかりません", { status: 400 });
    }

    const blob = fileEntry as Blob & { name?: string };
    const originalName = typeof (blob as { name?: unknown }).name === "string" ? (blob as { name?: unknown }).name as string : undefined;
    const lowerName = originalName?.toLowerCase();
    const extFromName = lowerName?.slice(lowerName.lastIndexOf(".")) || undefined;

    // Prefer provided MIME, fallback to sniffing from filename, finally default
    let mime = blob.type || "";
    if (!mime && extFromName) {
      const map: Record<string, string> = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".heic": "image/heic",
        ".heif": "image/heif",
        ".avif": "image/avif",
        ".gif": "image/gif",
      };
      mime = map[extFromName] || "";
    }
    if (!mime) mime = "application/octet-stream";

    // Allow common image types including iPhone HEIC/HEIF and AVIF
    const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "image/avif", "image/gif"]);
    if (!allowed.has(mime)) {
      return new NextResponse(`対応していないファイル形式です: ${mime}`, { status: 400 });
    }

    const bytes = await blob.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const ext =
      mime === "image/png"
        ? ".png"
        : mime === "image/webp"
        ? ".webp"
        : mime === "image/heic"
        ? ".heic"
        : mime === "image/heif"
        ? ".heif"
        : mime === "image/avif"
        ? ".avif"
        : mime === "image/gif"
        ? ".gif"
        : ".jpg"; // default for image/jpeg
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    await fs.writeFile(filePath, buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ url });
  } catch {
    return new NextResponse("アップロード中にエラーが発生しました", { status: 500 });
  }
}
