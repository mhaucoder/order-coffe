// components/OrderApp.tsx
"use client";

import { Drink } from "@/types/drink";
import { useState } from "react";
import CartModal from "./CartModal";
import { Member } from "@/types/member";
import MemberModal from "./MemberModal";
import OrderItem from "@/types/orderItem";
import { toast } from "react-toastify";

interface OrderAppProps {
  initialDrinks: Drink[];
  initialMembers: Member[];
}

export default function OrderApp({
  initialDrinks,
  initialMembers,
}: OrderAppProps) {
  const [searchDrink, setSearchDrink] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchMember, setSearchMember] = useState("");
  const [orderList, setOrderList] = useState<OrderItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);

  const filteredDrinks = initialDrinks.filter((drink) =>
    drink.name.toLowerCase().includes(searchDrink.toLowerCase())
  );

  const filteredMembers = initialMembers.filter((member) =>
    member.name.toLowerCase().includes(searchMember.toLowerCase())
  );

  const handleMemberSelect = (member: Member & { note?: string }) => {
    if (selectedDrink) {
      setOrderList((prev) => [...prev, { drink: selectedDrink, member, note: member.note}]);
      toast.success("Đã thêm đơn hàng thành công!");
      setSelectedDrink(null);
      setShowMemberModal(false);
    }
  };

  const handleOrderClick = (drink: Drink) => {
    setSelectedDrink(drink);
    setShowMemberModal(true);
  };

  const handleRemoveOrder = (indexToRemove: number) => {
    setOrderList((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="p-4 font-sans max-w-md mx-auto relative bg-gray-50 min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white shadow-md rounded-b-xl px-4 pt-4 pb-3">
        <h1 className="text-xl font-bold text-center text-gray-800 mb-2">
          🧋 Order Đồ Uống
        </h1>

        {/* Input tìm kiếm */}
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm đồ uống..."
            value={searchDrink}
            onChange={(e) => setSearchDrink(e.target.value)}
            className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
          <span className="absolute top-2.5 right-3 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Menu Section */}
      <h2 className="text-lg font-semibold text-gray-700 my-3 px-1">
        📋 Menu
      </h2>

      {filteredDrinks.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {filteredDrinks.map((drink) => (
            <div
              key={drink._id}
              className="flex flex-col justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-3">
                <h3 className="text-base font-medium text-gray-900">
                  {drink.name}
                </h3>
                {drink.price && (
                  <p className="text-sm text-gray-500 mt-1">{drink.price}K</p>
                )}
              </div>
              <button
                onClick={() => handleOrderClick(drink)}
                className="mt-auto w-full text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 py-2 rounded-lg transition"
              >
                Đặt món
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic text-center mt-6">
          Không có đồ uống nào phù hợp.
        </p>
      )}

      {/* Floating Cart Button */}
      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-4 right-4 z-10 flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-xl shadow-lg hover:bg-green-600 transition"
      >
        <span className="text-lg">🧾</span>
        <span>Đơn hàng</span>
        {orderList.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow min-w-[22px] text-center">
            {orderList.length}
          </span>
        )}
      </button>

      {/* Modal giỏ hàng */}
      <CartModal
        isOpen={showCart}
        orderList={orderList}
        onClose={() => setShowCart(false)}
        onRemove={handleRemoveOrder}
      />

      {/* Modal chọn Member */}
      <MemberModal
        isOpen={showMemberModal}
        members={filteredMembers}
        onSelect={handleMemberSelect}
        onClose={() => {
          setShowMemberModal(false);
          setSelectedDrink(null);
        }}
      />
    </div>
  );
}
