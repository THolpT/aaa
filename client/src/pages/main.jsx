import { useState, useEffect, useMemo } from 'react';
import Card from '../components/card';

const PRODUCTS_URL = `/api/product`;

function Main() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', price: '', imgUrl: '' });

  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('default');

  useEffect(() => {
    fetch(PRODUCTS_URL)
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  async function handleAdd(e) {
    e.preventDefault();

    const res = await fetch(PRODUCTS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        price: Number(form.price),
        imgUrl: form.imgUrl,
      }),
    });

    const created = await res.json();
    setProducts((prev) => [...prev, created]);
    setForm({ title: '', description: '', price: '', imgUrl: '' });
  }

  async function handleDelete(product) {
    await fetch(`${PRODUCTS_URL}/${product.id}`, { method: 'DELETE' });
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
  }

  const visibleProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const min = minPrice === '' ? -Infinity : Number(minPrice);
    const max = maxPrice === '' ? Infinity : Number(maxPrice);

    let result = products.filter((p) => {
      const matchesSearch =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);
      const price = Number(p.price) || 0;
      return matchesSearch && price >= min && price <= max;
    });

    if (sort === 'asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, search, minPrice, maxPrice, sort]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <h2 className="md:col-span-2 text-lg font-semibold">Добавить товар</h2>

          <input
            type="text"
            placeholder="Название"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="border border-gray-200 rounded-xl px-4 py-2"
          />
          <input
            type="number"
            placeholder="Цена"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            min="0"
            className="border border-gray-200 rounded-xl px-4 py-2"
          />
          <input
            type="text"
            placeholder="Ссылка на картинку"
            value={form.imgUrl}
            onChange={(e) => setForm({ ...form, imgUrl: e.target.value })}
            className="border border-gray-200 rounded-xl px-4 py-2 md:col-span-2"
          />
          <textarea
            placeholder="Описание"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows="3"
            className="border border-gray-200 rounded-xl px-4 py-2 md:col-span-2 resize-none"
          />

          <button
            type="submit"
            className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-xl"
          >
            Добавить товар
          </button>
        </form>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Поиск</span>
            <input
              type="search"
              placeholder="Название или описание"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Цена от</span>
            <input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Цена до</span>
            <input
              type="number"
              placeholder="∞"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Сортировка</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2 bg-white"
            >
              <option value="default">По умолчанию</option>
              <option value="asc">Цена: по возрастанию</option>
              <option value="desc">Цена: по убыванию</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProducts.map((p) => (
            <Card key={p.id} product={p} onDelete={handleDelete} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Main;