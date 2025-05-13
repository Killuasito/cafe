import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ProductService } from "../services/ProductService";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";
import { motion, useScroll, useInView } from "framer-motion";
import { useRef } from "react";
import { FiCheck } from "react-icons/fi";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refs for scroll animations
  const cultivoRef = useRef(null);
  const separacaoRef = useRef(null);
  const featuredRef = useRef(null);
  const categoriesRef = useRef(null);
  const newsletterRef = useRef(null);

  // Check if sections are in view
  const cultivoInView = useInView(cultivoRef, { once: true, amount: 0.3 });
  const separacaoInView = useInView(separacaoRef, { once: true, amount: 0.3 });
  const featuredInView = useInView(featuredRef, { once: true, amount: 0.3 });
  const categoriesInView = useInView(categoriesRef, {
    once: true,
    amount: 0.3,
  });
  const newsletterInView = useInView(newsletterRef, {
    once: true,
    amount: 0.3,
  });

  // Add smooth scrolling to the document
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

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

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative bg-gradient-to-r from-yellow-950 to-yellow-800 text-white overflow-hidden"
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative container mx-auto px-4 py-32 md:py-48">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Descubra o Verdadeiro
              <br />
              Sabor do Café
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Café de qualidade premium, cultivado com cuidado
              <br />e torrado à perfeição.
            </p>
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
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
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Featured Products Section */}
      <div className="container mx-auto px-4 py-16" ref={featuredRef}>
        <motion.div
          initial="hidden"
          animate={featuredInView ? "visible" : "hidden"}
          variants={fadeIn}
          className="flex justify-between items-center mb-12"
        >
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
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-900 border-t-transparent"></div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            animate={featuredInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {featuredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariant}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Categories Section */}
      <div className="bg-white py-16" ref={categoriesRef}>
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-yellow-900 text-center mb-12"
            initial="hidden"
            animate={categoriesInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            Nossas Categorias
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            animate={categoriesInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
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
              <motion.div key={category.slug} variants={itemVariant}>
                <Link
                  to={`/products?category=${category.slug}`}
                  className="group relative h-80 rounded-2xl overflow-hidden shadow-lg transform transition-all duration-500 hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10"></div>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Coffee Cultivation Section */}
      <div className="bg-yellow-50 py-20" ref={cultivoRef}>
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            initial="hidden"
            animate={cultivoInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <motion.div
              className="relative h-[600px] rounded-2xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, x: -50 }}
              animate={
                cultivoInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
              }
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src="https://sdmntprwestus2.oaiusercontent.com/files/00000000-2568-61f8-b66f-458b25420b83/raw?se=2025-05-13T16%3A49%3A26Z&sp=r&sv=2024-08-04&sr=b&scid=00000000-0000-0000-0000-000000000000&skoid=30ec2761-8f41-44db-b282-7a0f8809659b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-13T02%3A50%3A21Z&ske=2025-05-14T02%3A50%3A21Z&sks=b&skv=2024-08-04&sig=XcLKUarnPkyM/IWZDn4xz/4VTQjQXJfuH7k5y2H5DwM%3D"
                alt="Cultivo de Café"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={
                cultivoInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }
              }
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="text-yellow-800 font-medium">O Cultivo</span>
              <h2 className="text-3xl md:text-4xl font-bold text-yellow-900 mt-2 mb-6">
                A Arte do Cultivo do Café
              </h2>
              <p className="text-gray-700 mb-6">
                Nosso café é cultivado em altitudes superiores a 1.000 metros,
                onde o clima e o solo se combinam para criar as condições
                perfeitas para os grãos. Utilizamos técnicas sustentáveis e
                colheita seletiva manual.
              </p>
              <motion.div
                className="grid grid-cols-2 gap-6"
                initial="hidden"
                animate={cultivoInView ? "visible" : "hidden"}
                variants={staggerContainer}
              >
                <motion.div variants={itemVariant}>
                  <div className="text-2xl font-bold text-yellow-800">
                    1200m
                  </div>
                  <div className="text-gray-600">Altitude média</div>
                </motion.div>
                <motion.div variants={itemVariant}>
                  <div className="text-2xl font-bold text-yellow-800">100%</div>
                  <div className="text-gray-600">Arábica</div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Coffee Separation Section */}
      <div className="bg-white py-20" ref={separacaoRef}>
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            initial="hidden"
            animate={separacaoInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <motion.div
              className="order-2 md:order-1"
              initial={{ opacity: 0, x: -50 }}
              animate={
                separacaoInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
              }
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="text-yellow-800 font-medium">A Separação</span>
              <h2 className="text-3xl md:text-4xl font-bold text-yellow-900 mt-2 mb-6">
                Excelência na Seleção dos Grãos
              </h2>
              <p className="text-gray-700 mb-6">
                A separação cuidadosa dos grãos é essencial para garantir a
                qualidade do café. Selecionamos manualmente cada grão,
                descartando impurezas e classificando por tamanho, densidade e
                cor para criar blends perfeitos e garantir uma experiência de
                sabor excepcional.
              </p>
              <motion.ul
                className="space-y-4"
                initial="hidden"
                animate={separacaoInView ? "visible" : "hidden"}
                variants={staggerContainer}
              >
                <motion.li
                  className="flex items-center text-gray-700"
                  variants={itemVariant}
                >
                  <FiCheck className="w-5 h-5 mr-3 text-yellow-800" />
                  Seleção manual dos melhores grãos
                </motion.li>
                <motion.li
                  className="flex items-center text-gray-700"
                  variants={itemVariant}
                >
                  <FiCheck className="w-5 h-5 mr-3 text-yellow-800" />
                  Processo rigoroso de classificação
                </motion.li>
                <motion.li
                  className="flex items-center text-gray-700"
                  variants={itemVariant}
                >
                  <FiCheck className="w-5 h-5 mr-3 text-yellow-800" />
                  Blends exclusivos cuidadosamente formulados
                </motion.li>
              </motion.ul>
            </motion.div>
            <motion.div
              className="order-1 md:order-2 relative h-[400px] rounded-2xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, x: 50 }}
              animate={
                separacaoInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }
              }
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src="https://images.unsplash.com/photo-1511537190424-bbbab1a52d2e"
                alt="Preparo de Café"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="relative py-24" ref={newsletterRef}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085')] bg-cover bg-fixed bg-center"></div>
        <div className="absolute inset-0 bg-yellow-950/90"></div>
        <div className="relative container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate={newsletterInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <span className="text-yellow-300 font-medium">Newsletter</span>
            <h2 className="text-4xl font-bold text-white mt-2 mb-4">
              Receba Novidades e Ofertas Exclusivas
            </h2>
            <p className="text-lg text-yellow-100 mb-8">
              Inscreva-se em nossa newsletter e receba dicas de preparo,
              novidades sobre café e ofertas especiais.
            </p>
            <motion.form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={
                newsletterInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Digite seu melhor e-mail"
                  className="w-full px-6 py-4 rounded-lg text-gray-800 placeholder-gray-500 bg-white/95 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                  required
                />
              </div>
              <motion.button
                type="submit"
                className="px-8 py-4 bg-yellow-800 text-white rounded-lg font-medium hover:bg-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Quero Receber
              </motion.button>
            </motion.form>
            <motion.p
              className="mt-4 text-sm text-yellow-200/80 flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={newsletterInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Fique tranquilo, também não gostamos de spam.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
