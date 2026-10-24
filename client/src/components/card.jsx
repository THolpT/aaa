const Card = ({ product, onAdd }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
            <div className="aspect-square w-full bg-gray-100 overflow-hidden relative">
                <img 
                    src={product.imgUrl} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
                    {product.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
                    {product.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <span className="text-xl font-bold text-gray-900">
                        {product.price.toLocaleString('ru-RU')} ₽
                    </span>
                    <button 
                        onClick={() => onAdd?.(product)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-sm shadow-indigo-100"
                    >
                        В корзину
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Card;
