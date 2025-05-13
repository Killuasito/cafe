import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductService } from "../services/ProductService";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";
import { FiFilter, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);

  // Filtros
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let productList;

        if (selectedCategory) {
          productList = await ProductService.getProductsByCategory(
            selectedCategory
          );
        } else {
          productList = await ProductService.getAllProducts();
        }

        // Filtrar por preço, se necessário
        if (priceRange.min !== "" || priceRange.max !== "") {
          productList = productList.filter((product) => {
            let valid = true;
            if (priceRange.min !== "")
              valid = valid && product.price >= Number(priceRange.min);
            if (priceRange.max !== "")
              valid = valid && product.price <= Number(priceRange.max);
            return valid;
          });
        }

        // Ordenação
        switch (sortBy) {
          case "priceAsc":
            productList.sort((a, b) => a.price - b.price);
            break;
          case "priceDesc":
            productList.sort((a, b) => b.price - a.price);
            break;
          case "nameAsc":
            productList.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case "nameDesc":
            productList.sort((a, b) => b.name.localeCompare(a.name));
            break;
          default: // newest
            productList.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
        }

        setProducts(productList);

        // Extrair categorias únicas para o filtro
        const uniqueCategories = [
          ...new Set(productList.map((p) => p.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        toast.error("Não foi possível carregar os produtos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, priceRange.min, priceRange.max, sortBy]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    updateSearchParams("category", category);
  };

  const handlePriceChange = (min, max) => {
    setPriceRange({ min, max });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const updateSearchParams = (key, value) => {
    const current = Object.fromEntries(searchParams.entries());
    if (value) {
      setSearchParams({ ...current, [key]: value });
    } else {
      const newParams = { ...current };
      delete newParams[key];
      setSearchParams(newParams);
    }
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setSortBy("newest");
    setSearchParams({});
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const filterButtonVariants = {
    tap: { scale: 0.98 },
  };

  const filterItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 pt-20 md:pt-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          className="bg-gradient-to-r from-yellow-900 to-yellow-800 rounded-xl shadow-lg mb-8 p-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Nossos Produtos
          </h1>
          <p className="text-yellow-100">
            Descubra nossa seleção de cafés premium e acessórios
          </p>
        </motion.div>

        {/* Mobile Filter Button */}
        <motion.button
          onClick={() => setFilterOpen(!filterOpen)}
          className="md:hidden w-full bg-white shadow-md rounded-xl px-6 py-4 mb-4 flex items-center justify-between text-yellow-900 hover:bg-gray-50 transition-all duration-300"
          whileTap={filterButtonVariants.tap}
        >
          <span className="flex items-center gap-2">
            <FiFilter size={20} />
            <span className="font-medium">Filtros e Ordenação</span>
          </span>
          <motion.span
            animate={{ rotate: filterOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FiX size={20} />
          </motion.span>
        </motion.button>

        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            <motion.div
              className={`${
                filterOpen
                  ? "relative"
                  : "absolute -translate-y-8 opacity-0 pointer-events-none"
              } md:relative md:translate-y-0 md:opacity-100 md:pointer-events-auto md:w-1/4 transition-all`}
              animate={{
                opacity: filterOpen || window.innerWidth >= 768 ? 1 : 0,
                y: filterOpen || window.innerWidth >= 768 ? 0 : -20,
              }}
              initial={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-md p-6 sticky top-24"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold text-yellow-900">Filtros</h2>
                  <motion.button
                    onClick={clearFilters}
                    className="text-sm text-yellow-700 hover:text-yellow-900 transition-colors duration-300 flex items-center gap-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiX size={16} />
                    Limpar
                  </motion.button>
                </div>

                {/* Categories */}
                <motion.div
                  className="mb-8"
                  variants={filterItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="font-medium text-gray-900 mb-4">Categorias</h3>
                  <motion.div
                    className="space-y-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.button
                      variants={itemVariants}
                      onClick={() => handleCategoryChange("")}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                        !selectedCategory
                          ? "bg-yellow-50 text-yellow-900 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                      whileHover={{ x: 5 }}
                    >
                      Todas as categorias
                    </motion.button>
                    {categories.map((category) => (
                      <motion.button
                        key={category}
                        variants={itemVariants}
                        onClick={() => handleCategoryChange(category)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                          selectedCategory === category
                            ? "bg-yellow-50 text-yellow-900 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                        whileHover={{ x: 5 }}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Price Range */}
                <div className="mb-8">
                  <h3 className="font-medium text-gray-900 mb-4">
                    Faixa de Preço
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="text-sm text-gray-500 mb-1 block">
                          Mínimo
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            R$
                          </span>
                          <input
                            type="number"
                            value={priceRange.min}
                            onChange={(e) =>
                              handlePriceChange(e.target.value, priceRange.max)
                            }
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="0,00"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="text-sm text-gray-500 mb-1 block">
                          Máximo
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            R$
                          </span>
                          <input
                            type="number"
                            value={priceRange.max}
                            onChange={(e) =>
                              handlePriceChange(priceRange.min, e.target.value)
                            }
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="0,00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">
                    Ordenar por
                  </h3>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.75rem center",
                      backgroundSize: "1.25rem",
                    }}
                  >
                    <option value="newest">Mais recentes</option>
                    <option value="priceAsc">Menor preço</option>
                    <option value="priceDesc">Maior preço</option>
                    <option value="nameAsc">Nome (A-Z)</option>
                    <option value="nameDesc">Nome (Z-A)</option>
                  </select>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Products Grid */}
          <div className="md:w-3/4">
            {loading ? (
              <motion.div
                className="flex justify-center items-center h-64"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="h-12 w-12 border-4 border-yellow-900 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                ></motion.div>
              </motion.div>
            ) : (
              <>
                <motion.div
                  className="bg-white rounded-xl shadow-md px-6 py-4 mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-gray-600">
                    <span className="font-medium text-yellow-900">
                      {products.length}
                    </span>{" "}
                    produtos encontrados
                  </p>
                </motion.div>

                {products.length === 0 ? (
                  <motion.div
                    className="bg-white rounded-xl shadow-md p-8 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Nenhum produto encontrado
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Tente ajustar os filtros para encontrar o que está
                      procurando.
                    </p>
                    <motion.button
                      onClick={clearFilters}
                      className="px-6 py-2 bg-yellow-900 text-white rounded-lg hover:bg-yellow-800 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Limpar filtros
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {products.map((product) => (
                      <motion.div key={product.id} variants={itemVariants}>
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Products;
