import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ProductService } from "../services/ProductService";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await ProductService.getFeaturedProducts();
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Erro ao buscar produtos em destaque:", error);
        toast.error("Não foi possível carregar os produtos em destaque");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    toast.success("Inscrição realizada com sucesso!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-yellow-950 to-yellow-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative container mx-auto px-4 py-32 md:py-48">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Descubra o Verdadeiro
              <br />
              Sabor do Café
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Café de qualidade premium, cultivado com cuidado
              <br />e torrado à perfeição.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="px-8 py-4 bg-white text-yellow-900 rounded-full font-semibold hover:bg-yellow-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Explorar Produtos
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300"
              >
                Nossa História
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-yellow-900 mb-2">
              Produtos em Destaque
            </h2>
            <p className="text-gray-600">Descubra nossa seleção especial</p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center text-yellow-900 font-medium hover:text-yellow-700 transition-colors"
          >
            Ver todos
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-900 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-900 text-center mb-12">
            Nossas Categorias
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Café em Grãos",
                image:
                  "https://www.supremoarabica.com.br/wp-content/uploads/2019/06/2012-03-26_5a66dce4ce.jpg",
                slug: "graos",
              },
              {
                name: "Café Moído",
                image:
                  "https://minascomvoce.com.br/wp-content/uploads/2022/02/cafe-moido-grosseiramente.jpg ",
                slug: "moido",
              },
              {
                name: "Acessórios",
                image:
                  "https://images.unsplash.com/photo-1503481766315-7a586b20f66d",
                slug: "acessorios",
              },
            ].map((category) => (
              <Link
                key={category.slug}
                to={`/products?category=${category.slug}`}
                className="group relative h-80 rounded-2xl overflow-hidden shadow-lg transform transition-all duration-500 hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10"></div>
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <span className="inline-flex items-center text-white text-sm font-medium">
                    Explorar categoria
                    <svg
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Coffee Cultivation Section */}
      <div className="bg-yellow-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb"
                alt="Cultivo de Café"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-yellow-800 font-medium">Nosso Cultivo</span>
              <h2 className="text-3xl md:text-4xl font-bold text-yellow-900 mt-2 mb-6">
                A Arte do Cultivo do Café
              </h2>
              <p className="text-gray-700 mb-6">
                Nosso café é cultivado em altitudes superiores a 1.000 metros,
                onde o clima e o solo se combinam para criar as condições
                perfeitas para os grãos. Utilizamos técnicas sustentáveis e
                colheita seletiva manual.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-2xl font-bold text-yellow-800">
                    1200m
                  </div>
                  <div className="text-gray-600">Altitude média</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-800">100%</div>
                  <div className="text-gray-600">Arábica</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dairy Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <span className="text-yellow-800 font-medium">Leite Premium</span>
              <h2 className="text-3xl md:text-4xl font-bold text-yellow-900 mt-2 mb-6">
                O Melhor Leite para Seu Café
              </h2>
              <p className="text-gray-700 mb-6">
                Trabalhamos com produtores locais que compartilham nossa paixão
                por qualidade. Nosso leite vem de vacas criadas em pasto livre,
                garantindo um produto mais saudável e saboroso.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 mr-3 text-yellow-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                  Vacas criadas em pasto livre
                </li>
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 mr-3 text-yellow-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                  Produção sustentável
                </li>
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 mr-3 text-yellow-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                  Controle de qualidade rigoroso
                </li>
              </ul>
            </div>
            <div className="order-1 md:order-2 relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1594066521341-330a79387ec3"
                alt="Produção de Leite"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="relative py-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085')] bg-cover bg-fixed bg-center"></div>
        <div className="absolute inset-0 bg-yellow-950/90"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-yellow-300 font-medium">Newsletter</span>
            <h2 className="text-4xl font-bold text-white mt-2 mb-4">
              Receba Novidades e Ofertas Exclusivas
            </h2>
            <p className="text-lg text-yellow-100 mb-8">
              Inscreva-se em nossa newsletter e receba dicas de preparo,
              novidades sobre café e ofertas especiais.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
            >
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Digite seu melhor e-mail"
                  className="w-full px-6 py-4 rounded-lg text-gray-800 placeholder-gray-500 bg-white/95 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-yellow-800 text-white rounded-lg font-medium hover:bg-yellow-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                Quero Receber
              </button>
            </form>
            <p className="mt-4 text-sm text-yellow-200/80 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Fique tranquilo, também não gostamos de spam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
