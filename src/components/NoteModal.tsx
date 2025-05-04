"use client";

import { useState } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

interface NoteModalProps {
  isOpen: boolean;
  onSelect: ({ note }: { note?: string }) => void;
  onClose: () => void;
}

export default function NoteModal({
  isOpen,
  onSelect,
  onClose,
}: NoteModalProps) {
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    onSelect({ note });
    setNote("");
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-20" as="div">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-5 border-b border-gray-200">
            <DialogTitle className="text-xl font-bold text-center text-gray-800">
              Ghi chú đơn hàng
            </DialogTitle>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="VD: ít đá, không đường..."
            />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
            <Button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
            >
              Xác nhận
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}