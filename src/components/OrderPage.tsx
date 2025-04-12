"use client";

import { Drink } from "@/types/drink";
import { useState } from "react";
import CartModal from "./CartModal";
import OrderItem from "@/types/order";
import { toast } from "react-toastify";
import { Customer } from "@/types/customer";
import CustomerModal from "./CustomerModal";
import { useRouter } from "next/navigation";

interface OrderPageProps {
  initialDrinks: Drink[];
  initialCustomers: Customer[];
}

export default function OrderPage({
  initialDrinks,
  initialCustomers,
}: OrderPageProps) {
  const router = useRouter();
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
      <header className="sticky top-0 z-10 bg-white shadow-md rounded-xl px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          {/* Nút quay về trang chủ */}
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
            🧋 Đặt món
          </h1>

          {/* Chiếm chỗ để canh giữa tiêu đề */}
          <div className="w-[70px]" />
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Tìm đồ uống..."
            value={searchDrink}
            onChange={(e) => setSearchDrink(e.target.value)}
            className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />

          {/* Nút clear nếu có giá trị tìm kiếm */}
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
