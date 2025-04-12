// Nếu bạn dùng App Router (Next 13+ với `app/`)
"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">☕ Vy Coffee App</h1>
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/order")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow"
        >
          🧋 Đặt món
        </button>
        <button
          onClick={() => router.push("/history")}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg shadow"
        >
          📜 Lịch sử đơn
        </button>
      </div>
    </div>
  );
}
