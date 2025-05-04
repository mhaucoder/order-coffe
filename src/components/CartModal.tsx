"use client";

import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import OrderItem from "@/types/order";
import { toast } from "react-toastify";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItem[];
  onRemove: (index: number) => void;
  onSave: () => void;
}

export default function CartModal({
  isOpen,
  onClose,
  orderItems,
  onRemove,
  onSave,
}: CartModalProps) {
  return (
    <Dialog open={isOpen} as="div" className="relative z-10" onClose={onClose}>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md max-h-[90vh] bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
          {/* Tiêu đề */}
          <div className="p-4 border-b border-gray-100">
            <DialogTitle className="text-xl font-semibold text-gray-800 text-center">
              🧾 Danh sách đơn hàng
            </DialogTitle>
          </div>

          {/* Danh sách đơn hàng */}
          <div className="flex-1 overflow-y-auto p-4 text-sm text-gray-700">
            {orderItems.length > 0 ? (
              <ul className="space-y-3">
                {orderItems.map((orderItem, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 text-xs bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                        <span className="font-medium truncate max-w-[180px]">
                          {orderItem.drink.name}
                        </span>
                      </div>

                      {orderItem.note && (
                        <span className="ml-8 text-xs text-gray-500 italic truncate max-w-[180px]">
                          📝 {orderItem.note}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onRemove(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Xóa đơn"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-8"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-sm text-gray-500 py-6">
                Đơn hàng của bạn trống.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => {
                if (orderItems.length > 0) {
                  // Tạo key theo tên + note để tách riêng
                  const drinkCountMap = new Map<string, number>();

                  orderItems.forEach((item) => {
                    const name = item.drink.name;
                    const note = item.note?.trim();
                    const key = note ? `${name} (${note})` : name;

                    drinkCountMap.set(key, (drinkCountMap.get(key) || 0) + 1);
                  });

                  const text = Array.from(drinkCountMap.entries())
                    .map(([key, count]) => `${key} - Số lượng:${count}`)
                    .join("\n");

                  navigator.clipboard
                    .writeText(text)
                    .then(() => {
                      toast.success(
                        "📋 Đơn hàng đã được sao chép vào clipboard!"
                      );
                    })
                    .catch(() => {
                      toast.error("Không thể sao chép đơn hàng.");
                    });
                }

                onClose();
              }}
              className="w-full sm:w-1/2 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-500 transition"
            >
              📋 Copy
            </Button>

            <Button
              onClick={onSave}
              className="w-full sm:w-1/2 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-gray-400 transition"
            >
              💾 Lưu
            </Button>
            <Button
              onClick={onClose}
              className="w-full sm:w-1/2 py-2 bg-gray-300 text-gray-800 rounded-lg text-sm font-semibold hover:bg-gray-400 transition"
            >
              Đóng
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
