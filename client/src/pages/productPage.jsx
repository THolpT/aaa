// pages/ProductPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const PRODUCTS_URL = `/api/product`;

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', price: '', imgUrl: '' });

  useEffect(() => {
    fetch(PRODUCTS_URL)
      .then((res) => res.json())
      .then((data) => setProduct(data.find((p) => String(p.id) === String(id))));
  }, [id]);

  function startEdit() {
    setForm({
      title: product.title,
      description: product.description ?? '',
      price: String(product.price),
      imgUrl: product.imgUrl ?? '',
    });
    setIsEditing(true);
  }

  async function handleSave(e) {
    e.preventDefault();

    const res = await fetch(`${PRODUCTS_URL}/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        price: Number(form.price),
        imgUrl: form.imgUrl,
      }),
    });

    const updated = await res.json();
    setProduct(updated);
    setIsEditing(false);
  }

  if (!product) {
    return <p className="text-center text-gray-500 py-12">Товар не найден</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Link to="/" className="inline-block mb-6 text-indigo-600 font-medium">
          ← Назад к товарам
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square w-full bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={isEditing ? form.imgUrl : product.imgUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold mb-1">Редактирование</h2>

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
                className="border border-gray-200 rounded-xl px-4 py-2"
              />
              <textarea
                placeholder="Описание"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows="5"
                className="border border-gray-200 rounded-xl px-4 py-2 resize-none"
              />

              <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-xl"
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2.5 rounded-xl"
                >
                  Отмена
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
              <p className="text-gray-600 mb-6">{product.description}</p>

              <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                <span className="text-3xl font-bold">
                  {Number(product.price).toLocaleString('ru-RU')} ₽
                </span>
                <button
                  onClick={startEdit}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-xl"
                >
                  Редактировать
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ProductPage;