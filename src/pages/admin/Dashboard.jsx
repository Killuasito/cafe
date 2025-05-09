import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { db } from "../../firebase/config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Verificar se o usuário é admin
  useEffect(() => {
    if (!currentUser || currentUser.email !== "tififerreira@gmail.com") {
      toast.error("Acesso não autorizado");
      navigate("/");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Buscar produtos
        const productsSnap = await getDocs(collection(db, "products"));
        const totalProducts = productsSnap.size;

        // Buscar pedidos
        const ordersSnap = await getDocs(collection(db, "orders"));
        const totalOrders = ordersSnap.size;

        // Calcular receita total e pegar pedidos recentes
        let totalRevenue = 0;
        const allOrders = [];

        ordersSnap.forEach((doc) => {
          const orderData = { id: doc.id, ...doc.data() };
          if (orderData.total) {
            totalRevenue += orderData.total;
          }
          allOrders.push(orderData);
        });

        // Pegar os 5 pedidos mais recentes e garantir que todos os campos necessários existam
        const recentOrders = allOrders
          .sort(
            (a, b) =>
              (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)
          )
          .slice(0, 5)
          .map((order) => ({
            id: order.id,
            customerName: order.customerName || "Cliente",
            total: order.total || 0,
            status: order.status || "pending",
          }));

        setStats({
          totalOrders,
          totalProducts,
          totalRevenue,
          recentOrders,
        });
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
        toast.error("Não foi possível carregar as estatísticas do dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.email === "tififerreira@gmail.com") {
      fetchStats();
    }
  }, [currentUser]);

  const fetchProducts = async () => {
    try {
      const productsSnap = await getDocs(collection(db, "products"));
      const productsData = productsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast.error("Não foi possível carregar os produtos");
    }
  };

  useEffect(() => {
    if (currentUser?.email === "tififerreira@gmail.com") {
      fetchProducts();
    }
  }, [currentUser]);

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deleteDoc(doc(db, "products", productId));
        toast.success("Produto excluído com sucesso");
        fetchProducts(); // Refresh products list
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        toast.error("Erro ao excluir produto");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-950"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-yellow-900 to-yellow-800 rounded-lg shadow-lg mb-8 p-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Painel Administrativo
          </h1>
          <p className="text-yellow-100">
            Gerencie seus produtos e acompanhe seus pedidos
          </p>
        </div>

        {/* Stats Cards with Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-yellow-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total de Pedidos</p>
                <h3 className="text-3xl font-bold text-yellow-900">
                  {stats.totalOrders}
                </h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg
                  className="w-8 h-8 text-yellow-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total de Produtos</p>
                <h3 className="text-3xl font-bold text-green-900">
                  {stats.totalProducts}
                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg
                  className="w-8 h-8 text-green-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Receita Total</p>
                <h3 className="text-3xl font-bold text-blue-900">
                  R$ {stats.totalRevenue?.toFixed(2)}
                </h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg
                  className="w-8 h-8 text-blue-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/admin/products/new"
            className="bg-gradient-to-r from-yellow-900 to-yellow-800 text-white px-6 py-4 rounded-lg hover:from-yellow-800 hover:to-yellow-700 transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Adicionar Novo Produto
          </Link>
          <Link
            to="/admin/orders"
            className="bg-white text-yellow-900 px-6 py-4 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-xl border border-yellow-200 flex items-center justify-center gap-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Ver Todos os Pedidos
          </Link>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-yellow-900">
                Pedidos Recentes
              </h2>
              <Link
                to="/admin/orders"
                className="flex items-center text-yellow-700 hover:text-yellow-800 font-medium transition-colors duration-300"
              >
                Ver todos
                <svg
                  className="w-5 h-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID do Pedido
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-yellow-900">
                      R$ {order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status === "pending"
                          ? "Pendente"
                          : order.status === "completed"
                          ? "Concluído"
                          : order.status === "cancelled"
                          ? "Cancelado"
                          : order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Products Management Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-yellow-900">
                Gerenciamento de Produtos
              </h2>
              <Link
                to="/admin/products/new"
                className="inline-flex items-center px-4 py-2 bg-yellow-900 text-white rounded-lg hover:bg-yellow-800 transition-colors duration-300"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Adicionar Produto
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Imagem
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/150?text=Sem+Imagem";
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: #{product.id.slice(-6)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-yellow-900">
                        R$ {product.price.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="inline-flex items-center px-3 py-1.5 bg-yellow-900 text-white rounded hover:bg-yellow-800 transition-colors duration-200"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
