import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMail, FiLock, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Verifica se há um redirecionamento na URL
  const queryParams = new URLSearchParams(location.search);
  const redirectTo = queryParams.get("redirect");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      toast.success("Login realizado com sucesso!");

      // Redireciona o usuário
      navigate(redirectTo ? `/${redirectTo}` : "/");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError("Email ou senha incorretos. Tente novamente.");
      toast.error("Falha ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 pt-32">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="bg-yellow-950 p-6">
          <h2 className="text-2xl font-bold text-white text-center">Login</h2>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
              <FiAlertCircle className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-950 focus:border-yellow-950 transition-all duration-300"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Senha
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-yellow-950 hover:text-yellow-800 transition-colors duration-300"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-950 focus:border-yellow-950 transition-all duration-300"
                  placeholder="********"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-yellow-950 text-white rounded-md hover:bg-yellow-800 transition-colors duration-300"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Entrando...
                  </div>
                ) : (
                  "Entrar"
                )}
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{" "}
              <Link
                to="/register"
                className="text-yellow-950 hover:text-yellow-800 transition-colors duration-300 font-medium"
              >
                Cadastre-se aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
