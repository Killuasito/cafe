import { Link } from "react-router-dom";
import { FiHome, FiShoppingBag } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <div className="text-6xl font-bold text-coffee mb-4">404</div>
      <h1 className="text-2xl md:text-3xl font-bold text-coffee-dark mb-6">
        Página não encontrada
      </h1>
      <p className="text-gray-600 max-w-md text-center mb-8">
        Parece que você se perdeu! A página que você está procurando não existe
        ou foi movida.
      </p>
      <div className="flex flex-wrap gap-4">
        <Link to="/" className="btn-primary flex items-center">
          <FiHome className="mr-2" /> Voltar para Início
        </Link>
        <Link to="/products" className="btn-secondary flex items-center">
          <FiShoppingBag className="mr-2" /> Ver Produtos
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
