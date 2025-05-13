import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout realizado com sucesso!");
      navigate("/");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  const cartItemsCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  const menuVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.nav
      className="bg-white shadow-sm py-4 fixed w-full top-0 z-50 transition-all duration-300"
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/" className="transition-colors duration-300">
            <img
              src="../../Logo-ViviGrano-Marrom-Deitado-SF.png"
              alt="ViviGrano Logo"
              className="h-16"
            />
          </Link>
        </motion.div>

        {/* Menu para Mobile */}
        <motion.div
          className="md:hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-yellow-950 hover:text-yellow-800 transition-colors duration-300 focus:outline-none"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </motion.div>

        {/* Menu para Desktop */}
        <motion.div
          className="hidden md:flex items-center space-x-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            to="/"
            className="text-gray-700 hover:text-yellow-950 transition-colors duration-300 font-medium text-lg"
          >
            Início
          </Link>
          <Link
            to="/products"
            className="text-gray-700 hover:text-yellow-950 transition-colors duration-300 font-medium text-lg"
          >
            Produtos
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-yellow-950 transition-colors duration-300 font-medium text-lg"
          >
            Sobre
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-yellow-950 transition-colors duration-300 font-medium text-lg"
          >
            Contato
          </Link>
        </motion.div>

        {/* Ícones (Usuário e Carrinho) */}
        <motion.div
          className="hidden md:flex items-center space-x-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="relative group">
            <Link to="/profile" className="text-gray-700 hover:text-yellow-950">
              <FiUser size={24} />
            </Link>
            <div
              className="absolute right-0 w-48 bg-white shadow-lg rounded-md mt-2 py-2 z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"
              style={{
                transitionDelay: "0.1s",
                transform: "translateY(-10px)",
              }}
            >
              {currentUser ? (
                <>
                  <p className="px-4 py-2 text-sm text-gray-700">
                    {currentUser.email}
                  </p>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 transition-colors duration-200"
                  >
                    Perfil
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 transition-colors duration-200"
                  >
                    Meus pedidos
                  </Link>
                  {currentUser.email === "tififerreira@gmail.com" && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 transition-colors duration-200"
                    >
                      Administração
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 transition-colors duration-200"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 transition-colors duration-200"
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          </div>
          <Link
            to="/cart"
            className="relative text-gray-700 hover:text-yellow-950 transition-colors duration-300"
          >
            <FiShoppingCart size={24} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-950 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transform transition-transform duration-300 hover:scale-110">
                {cartItemsCount}
              </span>
            )}
          </Link>
        </motion.div>
      </div>

      {/* Menu Mobile Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden bg-white py-2 px-4 shadow-lg absolute w-full"
          >
            <Link
              to="/"
              className="block py-3 text-gray-700 hover:text-yellow-950 hover:bg-yellow-50 rounded-md px-4 transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              to="/products"
              className="block py-3 text-gray-700 hover:text-yellow-950 hover:bg-yellow-50 rounded-md px-4 transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Produtos
            </Link>
            <Link
              to="/about"
              className="block py-3 text-gray-700 hover:text-yellow-950 hover:bg-yellow-50 rounded-md px-4 transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              to="/contact"
              className="block py-3 text-gray-700 hover:text-yellow-950 hover:bg-yellow-50 rounded-md px-4 transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </Link>
            <div className="border-t border-gray-200 my-2"></div>
            <Link
              to="/cart"
              className="flex items-center py-3 text-gray-700 hover:text-yellow-950 hover:bg-yellow-50 rounded-md px-4 transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <FiShoppingCart size={18} className="mr-2" />
              Carrinho
              {cartItemsCount > 0 && (
                <span className="ml-1 bg-yellow-950 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            <div className="border-t border-gray-200 my-2"></div>
            {currentUser ? (
              <>
                <p className="py-2 text-sm text-gray-700">
                  {currentUser.email}
                </p>
                <Link
                  to="/profile"
                  className="block py-3 text-gray-700 hover:text-yellow-950 hover:bg-yellow-50 rounded-md px-4 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Perfil
                </Link>
                <Link
                  to="/orders"
                  className="block py-3 text-gray-700 hover:text-yellow-950 hover:bg-yellow-50 rounded-md px-4 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Meus pedidos
                </Link>
                {currentUser.email === "tififerreira@gmail.com" && (
                  <Link
                    to="/admin"
                    className="block py-3 text-gray-700 hover:text-yellow-950 hover:bg-yellow-50 rounded-md px-4 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Administração
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-3 text-gray-700 hover:text-yellow-950 hover:bg-yellow-50 rounded-md px-4 transition-all duration-300"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-3 text-gray-700 hover:text-yellow-950 hover:bg-yellow-50 rounded-md px-4 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-3 text-gray-700 hover:text-yellow-950 hover:bg-yellow-50 rounded-md px-4 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cadastrar
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
