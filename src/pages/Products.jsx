import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductService } from "../services/ProductService";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";
import { FiFilter, FiX } from "react-icons/fi";

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

  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-yellow-900 to-yellow-800 rounded-xl shadow-lg mb-8 p-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Nossos Produtos
          </h1>
          <p className="text-yellow-100">
            Descubra nossa seleção de cafés premium e acessórios
          </p>
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="md:hidden w-full bg-white shadow-md rounded-xl px-6 py-4 mb-4 flex items-center justify-between text-yellow-900 hover:bg-gray-50 transition-all duration-300"
        >
          <span className="flex items-center gap-2">
            <FiFilter size={20} />
            <span className="font-medium">Filtros e Ordenação</span>
          </span>
          <span
            className={`transition-transform duration-300 ${
              filterOpen ? "rotate-180" : ""
            }`}
          >
            <FiX size={20} />
          </span>
        </button>

        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {/* Filters Sidebar */}
          <div
            className={`${
              filterOpen
                ? "relative translate-y-0 opacity-100 mb-4"
                : "absolute -translate-y-8 opacity-0 pointer-events-none"
            } md:relative md:translate-y-0 md:opacity-100 md:pointer-events-auto md:w-1/4 transition-all duration-300 ease-out`}
          >
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-yellow-900">Filtros</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-yellow-700 hover:text-yellow-900 transition-colors duration-300 flex items-center gap-1"
                >
                  <FiX size={16} />
                  Limpar
                </button>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-medium text-gray-900 mb-4">Categorias</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleCategoryChange("")}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                      !selectedCategory
                        ? "bg-yellow-50 text-yellow-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Todas as categorias
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                        selectedCategory === category
                          ? "bg-yellow-50 text-yellow-900 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

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
                <h3 className="font-medium text-gray-900 mb-4">Ordenar por</h3>
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
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-900"></div>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-xl shadow-md px-6 py-4 mb-6">
                  <p className="text-gray-600">
                    <span className="font-medium text-yellow-900">
                      {products.length}
                    </span>{" "}
                    produtos encontrados
                  </p>
                </div>

                {products.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Nenhum produto encontrado
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Tente ajustar os filtros para encontrar o que está
                      procurando.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-2 bg-yellow-900 text-white rounded-lg hover:bg-yellow-800 transition-colors duration-300"
                    >
                      Limpar filtros
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
