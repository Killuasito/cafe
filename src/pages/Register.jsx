import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação de formulário
    if (password !== confirmPassword) {
      return setError("As senhas não correspondem.");
    }

    if (password.length < 6) {
      return setError("A senha deve ter no mínimo 6 caracteres.");
    }

    try {
      setError("");
      setLoading(true);
      await signup(email, password);
      toast.success("Conta criada com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      if (error.code === "auth/email-already-in-use") {
        setError("Este email já está em uso.");
      } else {
        setError("Falha ao criar conta. Tente novamente.");
      }
      toast.error("Falha ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 pt-32">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="bg-yellow-950 p-6">
          <h2 className="text-2xl font-bold text-white text-center">
            Criar Conta
          </h2>
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
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-950 focus:border-yellow-950 transition-all duration-300"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
            </div>

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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Senha
              </label>
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
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Use pelo menos 6 caracteres.
              </p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirmar Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-950 focus:border-yellow-950 transition-all duration-300"
                  placeholder="Confirme sua senha"
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
                    Criando conta...
                  </div>
                ) : (
                  "Criar Conta"
                )}
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link
                to="/login"
                className="text-yellow-950 hover:text-yellow-800 transition-colors duration-300 font-medium"
              >
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
