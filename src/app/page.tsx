import CardManager from "@/components/CardManager";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Cardy デモ</h1>
      <CardManager />
    </div>
  );
}
