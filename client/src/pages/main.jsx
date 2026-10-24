import { useState, useEffect } from 'react';
import Card from '../components/card';
import Header from '../components/header';

const PRODUCTS_URL = `${import.meta.env.VITE_API_URL}/product`;

function Main() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        const res = await fetch(PRODUCTS_URL, { signal: controller.signal });

        if (!res.ok) {
          throw new Error(`Ошибка загрузки: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.log(err)
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased">
      <main className="max-w-6xl mx-auto px-4 py-8">
        {products.length === 0 && (
          <p className="text-center text-gray-500">Товаров пока нет</p>
        )}

        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <Card key={p.id ?? p.title} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Main;