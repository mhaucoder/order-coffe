// components/OrderApp.tsx
"use client";

import { Drink } from "@/types/drink";
import { useState } from "react";
import CartModal from "./CartModal";
import OrderItem from "@/types/order";
import { toast } from "react-toastify";
import { Customer } from "@/types/customer";
import CustomerModal from "./CustomerModal";

interface OrderAppProps {
  initialDrinks: Drink[];
  initialCustomers: Customer[];
}

export default function OrderApp({
  initialDrinks,
  initialCustomers,
}: OrderAppProps) {
  const [searchDrink, setSearchDrink] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchCustomer, setSearchCustomer] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);

  const filteredDrinks = initialDrinks.filter((drink) =>
    drink.name.toLowerCase().includes(searchDrink.toLowerCase())
  );

  const filteredCustomers = initialCustomers.filter((Customer) =>
    Customer.name.toLowerCase().includes(searchCustomer.toLowerCase())
  );

  const handleCustomerselect = (customer: Customer & { note?: string }) => {
    if (selectedDrink) {
      setOrderItems((prev) => [
        ...prev,
        { drink: selectedDrink, customer, note: customer.note },
      ]);
      toast.success("Đã thêm đơn hàng thành công!");
      setSelectedDrink(null);
      setShowCustomerModal(false);
    }
  };

  const handleOrderClick = (drink: Drink) => {
    setSelectedDrink(drink);
    setShowCustomerModal(true);
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
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 bg-white shadow-md rounded-b-2xl px-4 pt-4 pb-3">
        <h1 className="text-xl font-bold text-center text-gray-800 mb-2">
          🧋 Vy Coffee
        </h1>
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Tìm đồ uống..."
            value={searchDrink}
            onChange={(e) => setSearchDrink(e.target.value)}
            className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
        </div>
      </header>

      {/* Menu Section */}
      <section className="mt-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          📋 Danh sách đồ uống
        </h2>
        {filteredDrinks.length > 0 ? (
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

      {/* Floating Cart Button */}
      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-4 right-4 z-10 flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-xl shadow-lg hover:bg-green-600 transition"
      >
        <span className="text-lg">🧾</span>
        <span>Đơn hàng</span>
        {orderItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow min-w-[22px] text-center">
            {orderItems.length}
          </span>
        )}
      </button>

      {/* Modal giỏ hàng */}
      <CartModal
        isOpen={showCart}
        orderItems={orderItems}
        onClose={() => setShowCart(false)}
        onRemove={handleRemoveOrder}
        onSave={handleSaveOrder}
      />

      {/* Modal chọn Customer */}
      <CustomerModal
        isOpen={showCustomerModal}
        Customers={filteredCustomers}
        onSelect={handleCustomerselect}
        onClose={() => {
          setShowCustomerModal(false);
          setSelectedDrink(null);
        }}
      />
    </div>
  );
}
