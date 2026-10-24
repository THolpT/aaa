import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold tracking-tight text-gray-900 hover:text-indigo-600 transition-colors">
                    Shop
                </Link>
                <Link to="/cart" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors bg-gray-50 hover:bg-indigo-50 px-4 py-2 rounded-full">
                    Корзина
                </Link>
            </div>
        </header>
    );
}

export default Header;
