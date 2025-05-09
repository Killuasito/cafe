import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");
      setLoading(true);
      await resetPassword(email);
      setMessage(
        "Verifique seu email para instruções de redefinição de senha."
      );
    } catch (error) {
      console.error("Erro ao enviar email de redefinição:", error);
      setError(
        "Não foi possível enviar o email de redefinição. Verifique se o endereço está correto."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="bg-yellow-950 p-6">
          <h2 className="text-2xl font-bold text-white text-center">
            Recuperação de Senha
          </h2>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
              <FiAlertCircle className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-start">
              <FiCheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}

          <p className="text-gray-600 mb-4">
            Digite seu email e enviaremos instruções para redefinir sua senha.
          </p>

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

            <div className="mb-6">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-yellow-950 text-white rounded-md hover:bg-yellow-800 transition-colors duration-300"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Enviando...
                  </div>
                ) : (
                  "Enviar Instruções"
                )}
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              <Link
                to="/login"
                className="text-yellow-950 hover:text-yellow-800 transition-colors duration-300 font-medium"
              >
                Voltar para o login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
