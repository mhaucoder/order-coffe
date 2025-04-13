"use client";

import { useState } from "react";
import { Customer } from "@/types/customer";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

interface CustomerModalProps {
  isOpen: boolean;
  Customers: Customer[];
  onSelect: (CustomerWithNote: Customer & { note?: string }) => void;
  onClose: () => void;
}

export default function CustomerModal({
  isOpen,
  Customers,
  onSelect,
  onClose,
}: CustomerModalProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    if (selectedCustomer) {
      onSelect({ ...selectedCustomer, note });
      setSelectedCustomer(null);
      setNote("");
    }
  };

  const anonymousCustomer: Customer = {
    _id: "anonymous",
    name: "",
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-20" as="div">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-5 border-b border-gray-200">
            <DialogTitle className="text-xl font-bold text-center text-gray-800">
              {selectedCustomer ? "Ghi chú" : "Chọn khách hàng"}
            </DialogTitle>
          </div>

          {/* Nội dung */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {!selectedCustomer ? (
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => setSelectedCustomer(anonymousCustomer)}
                    className="w-full flex items-center gap-3 px-4 py-3 border border-yellow-300 bg-yellow-50 rounded-lg shadow-sm hover:bg-yellow-100 transition"
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-yellow-500 text-white font-bold flex items-center justify-center">
                      🕵️‍♂️
                    </div>
                    <span className="text-yellow-800 font-semibold truncate">
                      Khách
                    </span>
                  </button>
                </li>

                {Customers.map((Customer) => (
                  <li key={Customer._id}>
                    <button
                      onClick={() => setSelectedCustomer(Customer)}
                      className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 transition"
                    >
                      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-400 text-white font-bold flex items-center justify-center">
                        {Customer.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-gray-800 font-medium truncate">
                        {Customer.name}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-700 text-sm text-center">
                  Ghi chú {" "}
                  <span className="font-semibold">{selectedCustomer.name}</span>{" "}
                  (nếu có)
                </p>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="VD: ít đá, không đường..."
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 flex justify-between gap-2">
            {selectedCustomer ? (
              <>
                <Button
                  onClick={() => {
                    setSelectedCustomer(null);
                    setNote("");
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                >
                  Quay lại
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
                >
                  Xác nhận
                </Button>
              </>
            ) : (
              <Button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              >
                Đóng
              </Button>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
