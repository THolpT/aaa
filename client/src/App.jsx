import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Main from './pages/main';
import Cart from './pages/cart';
import ProductPage from './pages/productPage';

function App() {
  const handleAddProduct = (product) => {
    console.log('Добавлено в корзину:', product.title);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased">
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
    </div>
  );
}

export default App;
