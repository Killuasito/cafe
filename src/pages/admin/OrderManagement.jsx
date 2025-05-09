import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { db } from "../../firebase/config";
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  orderBy,
} from "firebase/firestore";

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const formatDate = (timestamp) => {
    if (!timestamp) return "Data não disponível";
    const date = timestamp.toDate();
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Verificar se o usuário é admin
  useEffect(() => {
    if (!currentUser || currentUser.email !== "tififerreira@gmail.com") {
      toast.error("Acesso não autorizado");
      navigate("/");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser?.email === "tififerreira@gmail.com") {
      fetchOrders();
    }
  }, [filter, currentUser]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersRef = collection(db, "orders");
      let q = query(ordersRef, orderBy("createdAt", "desc"));

      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((order) => {
          if (filter === "all") return true;
          return order.status === filter;
        });

      setOrders(ordersData);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      toast.error("Não foi possível carregar os pedidos");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: newStatus,
      });
      toast.success("Status do pedido atualizado");
      fetchOrders();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Falha ao atualizar status do pedido");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 pt-32">
      <h1 className="text-3xl font-bold text-yellow-950 mb-6">
        Gerenciamento de Pedidos
      </h1>

      {/* Filter Controls */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
            filter === "all"
              ? "bg-yellow-950 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          Todos os Pedidos
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
            filter === "pending"
              ? "bg-yellow-950 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          Pendentes
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
            filter === "completed"
              ? "bg-yellow-950 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          Concluídos
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-950"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No orders found</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-yellow-950 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Pedido</th>
                <th className="px-6 py-3 text-left">Cliente</th>
                <th className="px-6 py-3 text-left">Produtos</th>
                <th className="px-6 py-3 text-left">Data</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">#{order.id.slice(-6)}</td>
                  <td className="px-6 py-4">
                    {order.customerInfo?.name ||
                      order.customerName ||
                      "Cliente"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {order.items?.map((item, index) => (
                        <div key={index} className="text-sm">
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4">R$ {order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status === "pending"
                        ? "Pendente"
                        : order.status === "processing"
                        ? "Em Processamento"
                        : order.status === "completed"
                        ? "Concluído"
                        : order.status === "cancelled"
                        ? "Cancelado"
                        : order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className="input py-1 px-2 border border-gray-300 rounded"
                    >
                      <option value="pending">Pendente</option>
                      <option value="processing">Em Processamento</option>
                      <option value="completed">Concluído</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrderManagement;
