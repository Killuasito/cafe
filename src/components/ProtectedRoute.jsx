import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, isAdmin = false }) => {
  const { currentUser } = useAuth();

  // Se não estiver autenticado, redirecionar para o login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Se a rota requerer permissão de admin, verificar email
  if (isAdmin && currentUser.email !== "tififerreira@gmail.com") {
    return <Navigate to="/" replace />;
  }

  // Se estiver autenticado e tiver as permissões necessárias, renderiza o componente filho
  return children;
};

export default ProtectedRoute;
