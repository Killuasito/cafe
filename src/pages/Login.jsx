import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMail, FiLock, FiAlertCircle, FiUser } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

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

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

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
    <motion.div
      className="min-h-screen flex items-center justify-center px-4 py-20 md:py-24"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <motion.div
        className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        whileHover={{
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        <motion.div
          className="bg-yellow-950 p-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex justify-center mb-3">
            <motion.div
              className="bg-white p-3 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.3,
              }}
            >
              <FiUser className="text-yellow-950 text-2xl" />
            </motion.div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center">Login</h2>
          <p className="text-yellow-100 text-center mt-2">Bem-vindo de volta</p>
        </motion.div>

        <motion.div
          className="p-8"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <FiAlertCircle className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <motion.div className="mb-5" variants={itemVariants}>
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
                  className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-950 focus:border-yellow-950 transition-all duration-300"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </motion.div>

            <motion.div className="mb-6" variants={itemVariants}>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Senha
                </label>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/forgot-password"
                    className="text-sm text-yellow-950 hover:text-yellow-800 transition-colors duration-300"
                  >
                    Esqueceu a senha?
                  </Link>
                </motion.div>
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
                  className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-950 focus:border-yellow-950 transition-all duration-300"
                  placeholder="********"
                  required
                />
              </div>
            </motion.div>

            <motion.div className="mb-8" variants={itemVariants}>
              <motion.button
                type="submit"
                className="w-full px-6 py-4 bg-yellow-950 text-white rounded-md hover:bg-yellow-800 transition-all duration-300"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <motion.div
                      className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    Entrando...
                  </div>
                ) : (
                  "Entrar"
                )}
              </motion.button>
            </motion.div>

            <motion.div className="text-center" variants={itemVariants}>
              <p className="text-sm text-gray-600">
                Não tem uma conta?{" "}
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ display: "inline-block" }}
                >
                  <Link
                    to="/register"
                    className="text-yellow-950 hover:text-yellow-800 transition-colors duration-300 font-medium"
                  >
                    Cadastre-se aqui
                  </Link>
                </motion.span>
              </p>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
