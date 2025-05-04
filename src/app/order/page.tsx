"use client";

import { Drink } from "@/types/drink";
import HomeButton from "@/components/ButtonHome";
import CartModal from "@/components/CartModal";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import OrderItem from "@/types/order";
import Skeleton from "./skeleton";
import NoteModal from "@/components/NoteModal";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [searchDrink, setSearchDrink] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/drink`,
          { cache: "no-store" }
        );
        const drinksData = await res1.json();
        setDrinks(drinksData || []);

        setIsLoading(false);
      } catch (error) {
        toast.error("Không thể tải dữ liệu");
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredDrinks = drinks.filter((drink) =>
    drink.name.toLowerCase().includes(searchDrink.toLowerCase())
  );

  const handleOrderClick = (drink: Drink) => {
    setSelectedDrink(drink);
    setShowNoteModal(true);
  };

  const handleNote = ({ note }: { note?: string }) => {
    if (selectedDrink) {
      setOrderItems((prev) => [
        ...prev,
        { drink: selectedDrink, note: note },
      ]);
      toast.success("Đã thêm đơn hàng thành công!");
      setSelectedDrink(null);
      setShowNoteModal(false);
    }
  };

  const handleRemoveOrder = (indexToRemove: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSaveOrder = async () => {
    if (orderItems.length === 0) {
      toast.warn("Không có món nào để lưu");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/history`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderItem: orderItems }),
        }
      );
      if (!res.ok) {
        const error = await res.json();
        toast.error(`Lưu thất bại: ${error.message}`);
        return;
      }
      toast.success("Đơn hàng đã được lưu!");
      setOrderItems([]);
      setShowCart(false);
    } catch (error) {
      console.error("Lỗi khi lưu đơn hàng:", error);
      toast.error("Có lỗi xảy ra khi lưu đơn hàng");
    }
  };

  return (
    <div className="p-4 font-sans max-w-md mx-auto relative bg-gray-50 min-h-screen">
      <header className="sticky top-0 z-10 bg-white shadow-md rounded-xl px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-center text-gray-800 flex-1">
            🧋 Đặt món
          </h1>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Tìm đồ uống..."
            value={searchDrink}
            onChange={(e) => setSearchDrink(e.target.value)}
            className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />

          {searchDrink && (
            <button
              onClick={() => setSearchDrink("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title="Xóa tìm kiếm"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      <section className="mt-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          📋 Danh sách đồ uống
        </h2>

        {isLoading ? (
          <Skeleton />
        ) : filteredDrinks.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredDrinks.map((drink) => (
              <div
                key={drink._id}
                className="flex flex-col justify-between p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {drink.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{drink.price}K</p>
                </div>
                <button
                  onClick={() => handleOrderClick(drink)}
                  className="mt-3 w-full text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 py-2 rounded-lg transition"
                >
                  + Thêm món
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic text-center mt-6">
            Không tìm thấy đồ uống phù hợp.
          </p>
        )}
      </section>

      <HomeButton />

      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-4 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-xl shadow-lg hover:bg-green-600 transition"
      >
        <span className="text-lg">🧾</span>
        <span>Đơn hàng</span>
        {orderItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow min-w-[22px] text-center">
            {orderItems.length}
          </span>
        )}
      </button>

      <CartModal
        isOpen={showCart}
        orderItems={orderItems}
        onClose={() => setShowCart(false)}
        onRemove={handleRemoveOrder}
        onSave={handleSaveOrder}
      />

      <NoteModal
        isOpen={showNoteModal}
        onSelect={handleNote}
        onClose={() => {
          setShowNoteModal(false);
          setSelectedDrink(null);
        }}
      />
    </div>
  );
}
