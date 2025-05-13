import React, { useState } from "react";
import toast from "react-hot-toast";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiSend,
  FiUser,
  FiMessageSquare,
} from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Contact = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formRef, formInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [infoRef, infoInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [headerRef, headerInView] = useInView({ triggerOnce: true });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission with a delay
    setTimeout(() => {
      toast.success("Mensagem enviada com sucesso!");
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const headerVariants = {
    initial: { opacity: 0, y: -50 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen pt-16"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Header */}
      <motion.div
        ref={headerRef}
        className="relative bg-yellow-950 text-white py-20"
        variants={headerVariants}
        initial="initial"
        animate={headerInView ? "animate" : "initial"}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <motion.div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559925393-8be0ec4767c8')] bg-cover bg-center mix-blend-overlay"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        ></motion.div>
        <div className="container mx-auto px-4 relative">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Contato
          </motion.h1>
          <motion.p
            className="text-xl text-yellow-100 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Estamos aqui para ajudar. Entre em contato conosco.
          </motion.p>
        </div>
      </motion.div>

      {/* Contact Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            ref={formRef}
            variants={cardVariants}
            initial="initial"
            animate={formInView ? "animate" : "initial"}
            transition={{ delay: 0.2 }}
          >
            <motion.h2
              className="text-2xl font-bold text-yellow-900 mb-6 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <FiMessageSquare className="mr-2" /> Envie uma mensagem
            </motion.h2>
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6 bg-white p-6 rounded-lg shadow-lg"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={cardVariants}>
                <label className="block text-gray-700 mb-2 font-medium flex items-center">
                  <FiUser className="mr-2" /> Nome
                </label>
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </motion.div>
              <motion.div variants={cardVariants}>
                <label className="block text-gray-700 mb-2 font-medium flex items-center">
                  <FiMail className="mr-2" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </motion.div>
              <motion.div variants={cardVariants}>
                <label className="block text-gray-700 mb-2 font-medium flex items-center">
                  <FiMessageSquare className="mr-2" /> Assunto
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </motion.div>
              <motion.div variants={cardVariants}>
                <label className="block text-gray-700 mb-2 font-medium flex items-center">
                  <FiMessageSquare className="mr-2" /> Mensagem
                </label>
                <textarea
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md h-32 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                  required
                ></textarea>
              </motion.div>
              <motion.button
                type="submit"
                className="bg-yellow-900 text-white px-6 py-3 rounded-md hover:bg-yellow-800 transition-colors duration-300 flex items-center justify-center w-full md:w-auto"
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    Enviando...
                  </>
                ) : (
                  <>
                    <FiSend className="mr-2" /> Enviar Mensagem
                  </>
                )}
              </motion.button>
            </motion.form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            ref={infoRef}
            variants={cardVariants}
            initial="initial"
            animate={infoInView ? "animate" : "initial"}
            transition={{ delay: 0.4 }}
          >
            <motion.h2
              className="text-2xl font-bold text-yellow-900 mb-6 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <FiPhone className="mr-2" /> Informações de Contato
            </motion.h2>
            <motion.div
              className="space-y-8 bg-white p-6 rounded-lg shadow-lg"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div
                className="flex items-start space-x-4"
                variants={cardVariants}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <div className="bg-yellow-100 p-3 rounded-full text-yellow-900">
                  <FiMapPin size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                    Endereço
                  </h3>
                  <p className="text-gray-700">
                    Rua do Café, 123
                    <br />
                    Centro, São Paulo - SP
                    <br />
                    CEP: 01234-567
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start space-x-4"
                variants={cardVariants}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <div className="bg-yellow-100 p-3 rounded-full text-yellow-900">
                  <FiPhone size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                    Telefone
                  </h3>
                  <p className="text-gray-700">(11) 1234-5678</p>
                  <p className="text-gray-700 mt-1">(11) 98765-4321</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start space-x-4"
                variants={cardVariants}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <div className="bg-yellow-100 p-3 rounded-full text-yellow-900">
                  <FiMail size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                    Email
                  </h3>
                  <p className="text-gray-700">contato@vivigrano.com</p>
                  <p className="text-gray-700 mt-1">suporte@vivigrano.com</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start space-x-4"
                variants={cardVariants}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <div className="bg-yellow-100 p-3 rounded-full text-yellow-900">
                  <FiClock size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                    Horário de Funcionamento
                  </h3>
                  <p className="text-gray-700">
                    Segunda a Sexta: 9h às 18h
                    <br />
                    Sábado: 9h às 13h
                    <br />
                    Domingo: Fechado
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-8 bg-white p-6 rounded-lg shadow-lg"
              variants={cardVariants}
              initial="initial"
              animate={infoInView ? "animate" : "initial"}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-yellow-900 mb-4">
                Nossas Redes Sociais
              </h3>
              <div className="flex space-x-4">
                <motion.a
                  href="#"
                  className="bg-yellow-900 text-white p-3 rounded-full hover:bg-yellow-700 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Facebook"
                >
                  <FaFacebookF />
                </motion.a>
                <motion.a
                  href="#"
                  className="bg-yellow-900 text-white p-3 rounded-full hover:bg-yellow-700 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </motion.a>
                <motion.a
                  href="#"
                  className="bg-yellow-900 text-white p-3 rounded-full hover:bg-yellow-700 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Twitter"
                >
                  <FaTwitter />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-yellow-900 mb-6 text-center">
            Nossa Localização
          </h2>
          <div className="h-96 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0420379620274!2d-46.6496424!3d-23.5924443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5a2b2ed7f3a1%3A0xab35da2f5ca62674!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1674582442284!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa da localização da nossa loja"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contact;
