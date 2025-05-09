import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../contexts/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>

      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-coffee-dark hover:text-coffee truncate">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-500 text-sm mt-1 h-12 overflow-hidden">
          {product.description.length > 60
            ? `${product.description.substring(0, 60)}...`
            : product.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-coffee-dark font-bold">
            R$ {product.price.toFixed(2)}
          </p>

          <button
            onClick={() => addToCart(product, 1)}
            className="text-coffee hover:text-coffee-dark transition-colors"
            aria-label="Adicionar ao carrinho"
          >
            <FiShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
