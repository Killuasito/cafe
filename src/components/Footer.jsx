import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import { motion } from "framer-motion";

const Footer = () => {
  const year = new Date().getFullYear();

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const SocialButton = ({ href, icon: Icon }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-yellow-900 hover:bg-yellow-800 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
    >
      <Icon size={20} />
    </a>
  );

  return (
    <motion.footer
      className="relative"
      initial="hidden"
      animate="visible"
      variants={footerVariants}
    >
      {/* Decorative top border */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-900 via-yellow-800 to-yellow-900"
        variants={itemVariants}
      ></motion.div>

      <div className="bg-gradient-to-b from-yellow-950 to-yellow-900">
        {/* Main Footer Content */}
        <motion.div
          className="container mx-auto px-4 py-16"
          variants={itemVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <motion.div className="space-y-6" variants={itemVariants}>
              <Link to="/" className="block">
                <h2 className="text-2xl font-bold text-white">Café Gourmet</h2>
              </Link>
              <p className="text-yellow-100/80 leading-relaxed">
                Oferecemos os melhores grãos de café, selecionados
                cuidadosamente das melhores regiões produtoras do Brasil e do
                mundo.
              </p>
              <div className="flex space-x-4">
                <SocialButton href="https://facebook.com" icon={FiFacebook} />
                <SocialButton href="https://instagram.com" icon={FiInstagram} />
                <SocialButton href="https://twitter.com" icon={FiTwitter} />
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-white font-semibold mb-6 text-lg">
                Links Rápidos
              </h3>
              <ul className="space-y-4">
                {["Início", "Produtos", "Sobre Nós", "Contato"].map((item) => (
                  <li key={item}>
                    <Link
                      to={
                        item === "Início"
                          ? "/"
                          : `/${item.toLowerCase().replace(" ", "-")}`
                      }
                      className="text-yellow-100/80 hover:text-white transition-colors duration-300 flex items-center"
                    >
                      <span className="w-2 h-2 bg-yellow-800 rounded-full mr-3"></span>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <h3 className="text-white font-semibold mb-6 text-lg">Contato</h3>
              <div className="space-y-4">
                <div className="flex items-start text-yellow-100/80">
                  <FiMapPin className="mt-1 mr-3 flex-shrink-0" />
                  <p>
                    Rua do Café, 123
                    <br />
                    São Paulo - SP
                    <br />
                    CEP: 01234-567
                  </p>
                </div>
                <div className="flex items-center text-yellow-100/80">
                  <FiPhone className="mr-3" />
                  <p>(11) 9999-9999</p>
                </div>
                <div className="flex items-center text-yellow-100/80">
                  <FiMail className="mr-3" />
                  <a
                    href="mailto:contato@cafegourmet.com"
                    className="hover:text-white transition-colors duration-300"
                  >
                    contato@cafegourmet.com
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Business Hours */}
            <motion.div variants={itemVariants}>
              <h3 className="text-white font-semibold mb-6 text-lg">
                Horário de Funcionamento
              </h3>
              <ul className="space-y-3">
                <li className="text-yellow-100/80">
                  <span className="text-yellow-100">Segunda - Sexta:</span>
                  <br />
                  08:00 - 18:00
                </li>
                <li className="text-yellow-100/80">
                  <span className="text-yellow-100">Sábado:</span>
                  <br />
                  09:00 - 16:00
                </li>
                <li className="text-yellow-100/80">
                  <span className="text-yellow-100">Domingo:</span>
                  <br />
                  Fechado
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-yellow-800/30"
          variants={itemVariants}
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-yellow-100/60 text-sm">
                &copy; {year} Café Gourmet. Todos os direitos reservados.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link
                  to="/privacy"
                  className="text-yellow-100/60 hover:text-white text-sm transition-colors duration-300"
                >
                  Política de Privacidade
                </Link>
                <Link
                  to="/terms"
                  className="text-yellow-100/60 hover:text-white text-sm transition-colors duration-300"
                >
                  Termos de Uso
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
