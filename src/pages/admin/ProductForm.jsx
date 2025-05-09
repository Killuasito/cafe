import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiSave,
  FiArrowLeft,
  FiImage,
  FiAlertCircle,
  FiTrash2,
} from "react-icons/fi";
import { ProductService } from "../../services/ProductService";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    category: "",
    stock: "",
    imageUrl: "",
    features: [""],
    featured: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories] = useState([
    "Grãos",
    "Moído",
    "Cápsulas",
    "Acessórios",
    "Queijo",
    "Leite",
  ]);

  useEffect(() => {
    if (!currentUser || currentUser.email !== "tififerreira@gmail.com") {
      toast.error("Acesso não autorizado");
      navigate("/");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const product = await ProductService.getProductById(id);

          if (!product.features) {
            product.features = [""];
          }

          setFormData({
            ...product,
            price: product.price.toString(),
            oldPrice: product.oldPrice ? product.oldPrice.toString() : "",
            stock: product.stock.toString(),
          });
        } catch (error) {
          console.error("Erro ao buscar produto:", error);
          toast.error("Não foi possível carregar os dados do produto");
          navigate("/admin/products");
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData({ ...formData, features: updatedFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updatedFeatures });
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Nome do produto é obrigatório";
    if (!formData.description.trim())
      return "Descrição do produto é obrigatória";
    if (!formData.price || isNaN(Number(formData.price)))
      return "Preço deve ser um número válido";
    if (formData.oldPrice && isNaN(Number(formData.oldPrice)))
      return "Preço antigo deve ser um número válido";
    if (!formData.stock || isNaN(Number(formData.stock)))
      return "Estoque deve ser um número válido";
    if (!formData.imageUrl.trim()) return "URL da imagem é obrigatória";
    if (!formData.category) return "Selecione uma categoria";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const cleanFeatures = formData.features.filter(
      (feature) => feature.trim() !== ""
    );

    const productData = {
      ...formData,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
      stock: Number(formData.stock),
      features: cleanFeatures,
    };

    try {
      setLoading(true);

      if (isEditMode) {
        await ProductService.updateProduct(id, productData);
        toast.success("Produto atualizado com sucesso!");
      } else {
        await ProductService.addProduct(productData);
        toast.success("Produto criado com sucesso!");
      }

      navigate("/admin");
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      setError("Erro ao salvar o produto. Por favor, tente novamente.");
      toast.error("Erro ao salvar o produto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-32">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-r from-yellow-900 to-yellow-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">
              {isEditMode ? "Editar Produto" : "Novo Produto"}
            </h1>
            <button
              onClick={() => navigate("/admin/products")}
              className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-300"
            >
              <FiArrowLeft size={18} className="mr-2" /> Voltar
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                <div className="flex items-center">
                  <FiAlertCircle
                    className="text-red-500 mr-3 flex-shrink-0"
                    size={24}
                  />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-yellow-900 border-b border-gray-200 pb-2">
                  Informações Básicas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Produto*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-colors duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria*
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-colors duration-200 bg-white"
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-yellow-900 border-b border-gray-200 pb-2">
                  Preços e Estoque
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preço (R$)*
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-colors duration-200"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preço Antigo (R$)
                    </label>
                    <input
                      type="number"
                      name="oldPrice"
                      value={formData.oldPrice}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-colors duration-200"
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estoque*
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-colors duration-200"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-yellow-900 border-b border-gray-200 pb-2">
                  Imagem e Descrição
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL da Imagem*
                    </label>
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiImage className="text-gray-400" size={20} />
                        </div>
                        <input
                          type="url"
                          name="imageUrl"
                          value={formData.imageUrl}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-colors duration-200 pl-10"
                          required
                        />
                      </div>
                      {formData.imageUrl && (
                        <div className="relative group w-40 h-40 rounded-lg overflow-hidden border-2 border-gray-200">
                          <img
                            src={formData.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/200x200?text=Imagem+inválida";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição*
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-colors duration-200 resize-none"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h2 className="text-xl font-semibold text-yellow-900">
                    Características
                  </h2>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="flex items-center text-yellow-900 hover:text-yellow-700 transition-colors duration-300"
                  >
                    <span className="text-xl mr-1">+</span> Adicionar
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) =>
                          handleFeatureChange(index, e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-colors duration-200"
                        placeholder={`Característica ${index + 1}`}
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors duration-300"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h2 className="text-xl font-semibold text-yellow-900">
                    Configurações Adicionais
                  </h2>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                    <input
                      type="checkbox"
                      name="featured"
                      id="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="absolute w-6 h-6 appearance-none bg-white border border-gray-300 rounded-full shadow-sm cursor-pointer transition-transform duration-200 ease-in-out peer checked:translate-x-6 checked:border-yellow-500"
                    />
                    <label
                      htmlFor="featured"
                      className="block h-full bg-gray-200 rounded-full shadow-inner peer-checked:bg-yellow-900"
                    ></label>
                  </div>
                  <label htmlFor="featured" className="text-sm text-gray-700">
                    Produto em Destaque
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  Produtos em destaque aparecem na página inicial
                </p>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-900 to-yellow-800 text-white py-3 px-6 rounded-lg hover:from-yellow-800 hover:to-yellow-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      <span>
                        {isEditMode ? "Atualizando..." : "Salvando..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <FiSave size={20} />
                      <span>
                        {isEditMode ? "Atualizar Produto" : "Salvar Produto"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
