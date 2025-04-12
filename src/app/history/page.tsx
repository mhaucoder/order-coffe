'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { OrderHistory } from '@/types/order';

export default function HistoryPage() {
  const [historyList, setHistoryList] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/history`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setHistoryList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi fetch lịch sử:', err);
        setLoading(false);
      });
  }, []);

  const shortName = (fullName: string) => {
    const p = fullName.trim().split(' ');
    return p.length > 1 ? `${p.at(-2)?.charAt(0)}.${p.at(-1)}` : p[0];
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-center">🧾 Lịch sử đặt hàng</h1>

      {loading ? (
        <p className="text-gray-500 text-center">Đang tải dữ liệu...</p>
      ) : historyList.length === 0 ? (
        <p className="text-gray-500 text-center">Chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-6">
          {historyList.map((history) => (
            <div
              key={history._id}
              className="rounded-2xl border border-gray-200 shadow-sm bg-white overflow-hidden"
            >
              <div className="bg-gray-100 px-4 py-2 text-sm text-gray-600 flex justify-between">
                <span>🕒 {format(new Date(history.createdAt), 'HH:mm dd/MM/yyyy')}</span>
                <span>SL: {history.orderItem.length}</span>
              </div>

              <ul className="divide-y">
                {history.orderItem.map((item, index) => (
                  <li key={index} className="px-4 py-3 flex justify-between items-start sm:items-center sm:flex-row flex-col gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.drink.name}</p>
                      <p className="text-sm text-gray-500">
                        KH: {shortName(item.customer.name)}
                        {item.note && <span> • {item.note}</span>}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-right text-gray-800 whitespace-nowrap">
                      {(item.drink.price ?? 0).toLocaleString('vi-VN')}K
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
