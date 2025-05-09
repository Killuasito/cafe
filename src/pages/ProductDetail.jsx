import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiMinus, FiPlus, FiShoppingCart, FiArrowLeft } from "react-icons/fi";
import { ProductService } from "../services/ProductService";
import { useCart } from "../contexts/CartContext";
import toast from "react-hot-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await ProductService.getProductById(id);
        setProduct(productData);

        const products = await ProductService.getProductsByCategory(
          productData.category
        );
        setRelatedProducts(products.filter((p) => p.id !== id).slice(0, 4));
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
        toast.error("Produto não encontrado");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 pt-32 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-950"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 pt-32">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-3">
            Produto não encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            O produto que você está procurando não existe ou foi removido.
          </p>
          <button onClick={() => navigate("/products")} className="btn-primary">
            Ver todos os produtos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Add Back Button */}
        <button
          onClick={() => navigate("/products")}
          className="mb-6 flex items-center text-yellow-900 hover:text-yellow-700 transition-colors duration-300"
        >
          <FiArrowLeft className="mr-2" size={20} />
          <span className="font-medium">Voltar aos Produtos</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Product Image */}
            <div className="lg:w-1/2">
              <div className="relative h-[400px] lg:h-[600px] overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                {product.oldPrice && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {Math.round(
                      ((product.oldPrice - product.price) / product.oldPrice) *
                        100
                    )}
                    % OFF
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2 p-8 lg:p-12">
              <div className="flex flex-col h-full">
                <div>
                  <h1 className="text-3xl font-bold text-yellow-900 mb-4">
                    {product.name}
                  </h1>

                  <div className="flex items-baseline mb-6">
                    <span className="text-3xl font-bold text-yellow-900">
                      R$ {product.price.toFixed(2)}
                    </span>
                    {product.oldPrice && (
                      <span className="ml-3 text-lg text-gray-400 line-through">
                        R$ {product.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Features */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-yellow-900 mb-4">
                      Características
                    </h2>
                    <ul className="space-y-3">
                      {product.features?.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center text-gray-600"
                        >
                          <span className="w-2 h-2 bg-yellow-900 rounded-full mr-3"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Category */}
                  <div className="mb-8">
                    <span className="inline-block bg-yellow-100 text-yellow-900 px-4 py-2 rounded-full text-sm font-medium">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Section */}
                <div className="mt-auto">
                  {product.stock > 0 ? (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <span className="text-gray-700 font-medium mr-4">
                            Quantidade:
                          </span>
                          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden hover:border-yellow-500 transition-colors duration-300">
                            <button
                              onClick={() => handleQuantityChange(quantity - 1)}
                              className="px-4 py-3 text-gray-600 hover:text-yellow-900 hover:bg-yellow-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={quantity <= 1}
                            >
                              <FiMinus size={18} />
                            </button>
                            <div className="w-16 text-center font-semibold text-lg border-x border-gray-200 py-2">
                              {quantity}
                            </div>
                            <button
                              onClick={() => handleQuantityChange(quantity + 1)}
                              className="px-4 py-3 text-gray-600 hover:text-yellow-900 hover:bg-yellow-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={quantity >= product.stock}
                            >
                              <FiPlus size={18} />
                            </button>
                          </div>
                          <span className="ml-4 text-sm text-gray-500">
                            ({product.stock} disponíveis)
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={handleAddToCart}
                        className="w-full bg-gradient-to-r from-yellow-900 to-yellow-700 text-white py-4 px-6 rounded-xl flex items-center justify-center font-medium transition-all duration-300 hover:from-yellow-800 hover:to-yellow-600 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                      >
                        <FiShoppingCart className="mr-2" size={22} />
                        Adicionar ao Carrinho • R${" "}
                        {(product.price * quantity).toFixed(2)}
                      </button>
                    </>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                      <span className="text-red-600 font-medium text-lg">
                        Produto Esgotado
                      </span>
                      <p className="text-red-500 text-sm mt-1">
                        Este produto está temporariamente indisponível
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-yellow-900 mb-6">
              Produtos Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    navigate(`/products/${relatedProduct.id}`);
                    window.scrollTo(0, 0);
                  }}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={relatedProduct.imageUrl}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-yellow-950 truncate">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-yellow-950 font-bold mt-1">
                      R$ {relatedProduct.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
