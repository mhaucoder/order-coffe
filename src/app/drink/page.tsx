'use client';
import { useEffect, useState } from 'react';

interface Drink {
  _id: string;
  name: string;
  price?: number;
  description?: string;
}

export default function DrinksPage() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Drink>>({});
  const [newDrink, setNewDrink] = useState<Partial<Drink>>({ name: '', price: undefined, description: '' });

  const fetchDrinks = async () => {
    const res = await fetch('/api/drink');
    setDrinks(await res.json());
  };

  useEffect(() => {
    fetchDrinks();
  }, []);

  const startEditing = (drink: Drink) => {
    setEditingId(drink._id);
    setForm({ ...drink });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
  };

  const updateDrink = async () => {
    await fetch('/api/drink', {
      method: 'PUT',
      body: JSON.stringify(form),
    });
    await fetchDrinks();
    cancelEdit();
  };

  const deleteDrink = async (id: string) => {
    await fetch('/api/drink', {
      method: 'DELETE',
      body: JSON.stringify({ _id: id }),
    });
    fetchDrinks();
  };

  const handleChange = (field: keyof Drink, value: string | number) => {
    setForm({ ...form, [field]: value });
  };

  const handleNewChange = (field: keyof Drink, value: string | number) => {
    setNewDrink({ ...newDrink, [field]: value });
  };

  const addDrink = async () => {
    if (!newDrink.name?.trim()) return alert('Tên đồ uống không được bỏ trống');
    await fetch('/api/drink', {
      method: 'POST',
      body: JSON.stringify(newDrink),
    });
    setNewDrink({ name: '', price: undefined, description: '' });
    fetchDrinks();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Quản lý đồ uống</h1>

      {/* Form thêm mới */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h2 className="font-semibold mb-2">Thêm đồ uống mới</h2>
        <div className="flex gap-2 items-center">
          <input
            className="border px-2 py-1"
            value={newDrink.name}
            onChange={(e) => handleNewChange('name', e.target.value)}
            placeholder="Tên"
          />
          <input
            type="number"
            className="border px-2 py-1 w-24"
            value={newDrink.price ?? ''}
            onChange={(e) => handleNewChange('price', Number(e.target.value))}
            placeholder="Giá"
          />
          <input
            className="border px-2 py-1 w-48"
            value={newDrink.description || ''}
            onChange={(e) => handleNewChange('description', e.target.value)}
            placeholder="Mô tả"
          />
          <button onClick={addDrink} className="bg-green-600 text-white px-3 py-1 rounded">
            Thêm
          </button>
        </div>
      </div>

      {/* Danh sách đồ uống */}
      {drinks.map((drink) => (
        <div key={drink._id} className="mb-3 border-b pb-2 flex gap-2 items-center">
          {editingId === drink._id ? (
            <>
              <input
                className="border px-2 py-1"
                value={form.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
              />
              <input
                type="number"
                className="border px-2 py-1 w-24"
                value={form.price ?? ''}
                onChange={(e) => handleChange('price', Number(e.target.value))}
              />
              <input
                className="border px-2 py-1 w-48"
                value={form.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
              />
              <button onClick={updateDrink} className="bg-blue-500 text-white px-3 py-1">Lưu</button>
              <button onClick={cancelEdit} className="text-gray-500 px-2">Hủy</button>
            </>
          ) : (
            <>
              <div className="flex-1">
                <div><strong>{drink.name}</strong> - {drink.price ?? 0}đ</div>
                <div className="text-sm text-gray-600">{drink.description}</div>
              </div>
              <button onClick={() => startEditing(drink)} className="text-blue-600 px-2">Sửa</button>
              <button onClick={() => deleteDrink(drink._id)} className="text-red-600 px-2">Xóa</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}