import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiPlusCircle, FiSearch } from "react-icons/fi";
import { ProductService } from "../../services/ProductService";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Verificar se o usuário é admin
  useEffect(() => {
    if (!currentUser || currentUser.email !== "tififerreira@gmail.com") {
      toast.error("Acesso não autorizado");
      navigate("/");
    }
  }, [currentUser, navigate]);

  // Carregar produtos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productList = await ProductService.getAllProducts();
        setProducts(productList);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        toast.error("Não foi possível carregar os produtos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await ProductService.deleteProduct(id);
        setProducts(products.filter((product) => product.id !== id));
        toast.success("Produto excluído com sucesso");
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        toast.error("Não foi possível excluir o produto");
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-yellow-950">
          Gerenciamento de Produtos
        </h1>
        <button
          onClick={() => navigate("/admin/products/new")}
          className="bg-yellow-950 text-white px-6 py-2 rounded-lg hover:bg-yellow-900 transition-colors duration-300 flex items-center"
        >
          <FiPlusCircle className="mr-2" /> Novo Produto
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar produtos..."
              className="input pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-950"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Imagem
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estoque
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destaque
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Nenhum produto encontrado
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="w-12 h-12 overflow-hidden rounded">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {product.category}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          R$ {product.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.stock}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div>
                          {product.featured ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Sim
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              Não
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/products/edit/${product.id}`)
                            }
                            className="text-blue-600 hover:text-blue-800"
                            aria-label="Editar"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-800"
                            aria-label="Excluir"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
