import { Link } from 'react-router-dom';

const Card = ({ product, onDelete }) => {
  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(product);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
    >
      <div className="aspect-square w-full bg-gray-100 overflow-hidden">
        <img
          src={product.imgUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.title}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <span className="text-xl font-bold">{product.price.toLocaleString('ru-RU')} ₽</span>
          <button
            onClick={handleDeleteClick}
            className="bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium px-4 py-2 rounded-xl border border-red-100"
          >
            Удалить
          </button>
        </div>
      </div>
    </Link>
  );
};

export default Card;