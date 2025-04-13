"use client";

import OrderItem, { OrderHistory } from "@/types/order";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import Skeleton from "./skeleton";
import HomeButton from "@/components/ButtonHome";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [historyList, setHistoryList] = useState<OrderHistory[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/history`,
        { cache: "no-store" }
      );
      const history: OrderHistory[] = await res.json();
      setHistoryList(history || []);
      setIsLoading(false);
    };
    fetchHistory();
  }, []);

  const shortName = (name: string) =>
    name?.split(" ").slice(-2).join(" ") || "Khách";

  const totalAmount = (orderItem: OrderItem[]) =>
    orderItem.reduce((sum, item) => sum + (item.drink.price ?? 0), 0);
  return (
    <div className="max-w-3xl mx-auto px-4 py-4 font-sans min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white shadow-md rounded-2xl px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-center text-gray-800 flex-1">
            🧾 Lịch sử đặt món
          </h1>
        </div>
      </header>

      {/* Phần nội dung bên dưới giữ nguyên như cũ */}
      {isLoading ? (
        <Skeleton />
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

      <HomeButton />
    </div>
  );
}
