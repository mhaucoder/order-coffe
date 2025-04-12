"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import OrderItem, { OrderHistory } from "@/types/order";
import { useRouter } from "next/navigation";

interface HistoryPageProps {
  initialOrderHistory: OrderHistory[];
}

export default function HistoryPage({ initialOrderHistory }: HistoryPageProps) {
  const router = useRouter();
  const [historyList, setHistoryList] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHistoryList(initialOrderHistory || []);
    setLoading(false);
  }, [initialOrderHistory]);

  const shortName = (name: string) =>
    name?.split(" ").slice(-2).join(" ") || "Khách";

  const totalAmount = (orderItem: OrderItem[]) =>
    orderItem.reduce((sum, item) => sum + (item.drink.price ?? 0), 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 font-sans min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white shadow-md rounded-2xl px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          {/* Nút Home */}
          <button
            onClick={() => router.push("/")}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
              <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
            </svg>
          </button>

          <h1 className="text-xl font-bold text-center text-gray-800 flex-1">
            🧾 Lịch sử đặt món
          </h1>

          {/* Khoảng trắng giữ cân bằng tiêu đề giữa */}
          <div className="w-[70px]" />
        </div>
      </header>

      {/* Phần nội dung bên dưới giữ nguyên như cũ */}
      {loading ? (
        <p className="text-gray-500 text-center mt-6">Đang tải dữ liệu...</p>
      ) : historyList.length === 0 ? (
        <p className="text-gray-500 text-center mt-6">Chưa có đơn hàng nào.</p>
      ) : (
        <div className="mt-6 space-y-6">
          {historyList.map((history) => (
            <div
              key={history._id}
              className="rounded-2xl border border-gray-200 shadow bg-white overflow-hidden"
            >
              <div className="bg-gray-100 px-4 py-2 text-sm text-gray-600 flex justify-between items-center">
                <span>
                  🕒 {format(new Date(history.createdAt), "HH:mm dd/MM/yyyy")}
                </span>
                <span>
                  {history.orderItem.length} món •{" "}
                  <span className="font-semibold text-gray-800">
                    {totalAmount(history.orderItem).toLocaleString("vi-VN")}K
                  </span>
                </span>
              </div>

              <ul className="divide-y">
                {history.orderItem.map((item, index) => (
                  <li
                    key={index}
                    className="px-4 py-3 flex justify-between items-start sm:items-center sm:flex-row flex-col gap-2"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {item.drink.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        KH: {shortName(item.customer.name)}
                        {item.note && <span> • {item.note}</span>}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-right text-gray-800 whitespace-nowrap">
                      {(item.drink.price ?? 0).toLocaleString("vi-VN")}K
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
