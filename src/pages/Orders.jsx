import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { db } from "../firebase/config";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const ordersRef = collection(db, "orders");
        const q = query(
          ordersRef,
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(ordersData);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        toast.error("Não foi possível carregar seus pedidos");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  const formatStatus = (status) => {
    const statusMap = {
      pending: "Pendente",
      processing: "Em Processamento",
      completed: "Concluído",
      cancelled: "Cancelado",
    };
    return statusMap[status] || status;
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-950"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 pt-32">
      <h1 className="text-3xl font-bold text-yellow-950 mb-6">Meus Pedidos</h1>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Nenhum pedido encontrado</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-lg">
            <thead className="bg-yellow-950 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Pedido</th>
                <th className="px-6 py-3 text-left">Produtos</th>
                <th className="px-6 py-3 text-left">Data</th>
                <th className="px-6 py-3 text-left">Valor</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">#{order.id.slice(-6)}</td>
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
                      {formatStatus(order.status)}
                    </span>
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

export default Orders;
