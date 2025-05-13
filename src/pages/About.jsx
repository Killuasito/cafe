import React, { useEffect } from "react";
import { GiCoffeeBeans, GiCoffeePot } from "react-icons/gi";
import { FaHandshake, FaUsers, FaStar } from "react-icons/fa";
import { BsShieldCheck } from "react-icons/bs";
import { MdFamilyRestroom } from "react-icons/md";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const About = () => {
  const controls = useAnimation();
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
  const [missionRef, missionInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [differentialsRef, differentialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [valuesRef, valuesInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [impactRef, impactInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [teamRef, teamInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  useEffect(() => {
    if (heroInView) {
      controls.start("visible");
    }
  }, [controls, heroInView]);

  return (
    <motion.div
      className="min-h-screen pt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        className="relative bg-yellow-950 text-white py-20"
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={fadeIn}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <motion.div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511081692775-05d0f180a065')] bg-cover bg-center mix-blend-overlay"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        ></motion.div>
        <div className="container mx-auto px-4 relative">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Nossa História
          </motion.h1>
          <motion.p
            className="text-xl text-yellow-100 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Desde 1995, conectamos amantes de café com produtores excepcionais.
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          ref={missionRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16"
          initial="hidden"
          animate={missionInView ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <div>
            <motion.h2
              className="text-3xl font-bold text-yellow-900 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={missionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              Nossa Missão
            </motion.h2>
            <motion.p
              className="text-gray-700 mb-4"
              initial={{ opacity: 0 }}
              animate={missionInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Nossa missão é levar até você o café mais excepcional, cultivado
              com respeito ao meio ambiente e às comunidades produtoras.
            </motion.p>
            <motion.p
              className="text-gray-700"
              initial={{ opacity: 0 }}
              animate={missionInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Trabalhamos diretamente com pequenos produtores, garantindo
              práticas sustentáveis e preços justos. Acreditamos que o melhor
              café é resultado de uma cadeia de valor transparente e respeitosa.
            </motion.p>
          </div>
          <motion.div
            className="relative h-[400px] rounded-lg overflow-hidden shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={missionInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
          >
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
              alt="Café sendo preparado"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>

        {/* Partnerships Section */}
        <motion.div
          ref={differentialsRef}
          className="mb-16"
          initial="hidden"
          animate={differentialsInView ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <motion.h2
            className="text-3xl font-bold text-yellow-900 mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={differentialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Nossos Diferenciais
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
            variants={staggerContainer}
          >
            <motion.div
              className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-8 rounded-lg shadow-lg border border-yellow-300 hover:shadow-xl transition-all duration-300"
              variants={cardVariants}
              whileHover={{
                y: -10,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <motion.div
                className="flex justify-center mb-4"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <FaHandshake className="w-16 h-16 text-yellow-800" />
              </motion.div>
              <h3 className="text-xl font-bold mb-3 text-yellow-900 text-center">
                Parceria com a Cooxupé
              </h3>
              <p className="text-gray-700">
                Somos parceiros oficiais da Cooxupé, maior cooperativa de café
                do mundo, garantindo acesso aos melhores grãos de café
                produzidos nas principais regiões cafeeiras do Brasil, com total
                rastreabilidade e qualidade superior.
              </p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-8 rounded-lg shadow-lg border border-yellow-300 hover:shadow-xl transition-all duration-300"
              variants={cardVariants}
              whileHover={{
                y: -10,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <motion.div
                className="flex justify-center mb-4"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <BsShieldCheck className="w-16 h-16 text-yellow-800" />
              </motion.div>
              <h3 className="text-xl font-bold mb-3 text-yellow-900 text-center">
                Segurança e Confiança
              </h3>
              <p className="text-gray-700">
                Garantimos total segurança em suas compras online, com processos
                de pagamento criptografados e entrega monitorada. Nossa política
                de satisfação assegura que você receberá produtos sempre frescos
                e de alta qualidade.
              </p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-8 rounded-lg shadow-lg border border-yellow-300 hover:shadow-xl transition-all duration-300"
              variants={cardVariants}
              whileHover={{
                y: -10,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <motion.div
                className="flex justify-center mb-4"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <MdFamilyRestroom className="w-16 h-16 text-yellow-800" />
              </motion.div>
              <h3 className="text-xl font-bold mb-3 text-yellow-900 text-center">
                Tradição Familiar
              </h3>
              <p className="text-gray-700">
                Mantemos a tradição de uma empresa familiar que passou por
                gerações preservando o conhecimento artesanal de torra e
                preparação. Nossos especialistas são formados dentro de casa,
                com técnicas aprimoradas ao longo de décadas.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          ref={valuesRef}
          className="mb-16"
          initial="hidden"
          animate={valuesInView ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <motion.h2
            className="text-3xl font-bold text-yellow-900 mb-6 text-center"
            initial={{ opacity: 0 }}
            animate={valuesInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            Nossos Valores
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            {[
              {
                title: "Qualidade",
                description:
                  "Selecionamos apenas os melhores grãos para nossos produtos, passando por um rigoroso controle de qualidade. Cada lote é cuidadosamente avaliado para garantir uma experiência excepcional na xícara.",
                icon: <FaStar className="w-10 h-10 text-white mb-4" />,
              },
              {
                title: "Sustentabilidade",
                description:
                  "Comprometidos com práticas ambientalmente responsáveis em toda nossa cadeia produtiva. Incentivamos o cultivo sombreado, a conservação da água e sistemas agroflorestais que mantêm a biodiversidade e a saúde do solo.",
                icon: <GiCoffeeBeans className="w-10 h-10 text-white mb-4" />,
              },
              {
                title: "Comunidade",
                description:
                  "Apoiamos e desenvolvemos as comunidades produtoras através de programas educacionais, assistência técnica e projetos sociais. Acreditamos que o fortalecimento das comunidades é essencial para um café verdadeiramente especial.",
                icon: <FaUsers className="w-10 h-10 text-white mb-4" />,
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="bg-yellow-900 p-8 rounded-lg shadow-lg text-center"
                variants={cardVariants}
                whileHover={{
                  y: -10,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <motion.div
                  className="flex justify-center"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {value.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-200">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Impact Section */}
        <motion.div
          ref={impactRef}
          className="mb-16"
          initial="hidden"
          animate={impactInView ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <motion.h2
            className="text-3xl font-bold text-yellow-900 mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={impactInView ? { opacity: 1 } : {}}
          >
            Nosso Impacto Social
          </motion.h2>
          <motion.div
            className="bg-yellow-50 p-8 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={impactInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          >
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center"
              variants={staggerContainer}
            >
              <ImpactCounter
                number={2000}
                label="Produtores apoiados"
                prefix="+"
              />
              <ImpactCounter number={15} label="Comunidades beneficiadas" />
              <ImpactCounter
                number={30}
                label="Redução no uso de água"
                suffix="%"
              />
              <ImpactCounter
                number={100}
                label="Embalagens recicláveis"
                suffix="%"
              />
            </motion.div>
            <motion.p
              className="text-gray-700 mt-8 text-center max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={impactInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Nosso compromisso vai além do café de qualidade. Trabalhamos para
              transformar positivamente as regiões produtoras, investindo em
              educação, infraestrutura e práticas agrícolas regenerativas que
              beneficiam tanto as pessoas quanto o planeta.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          ref={teamRef}
          className="text-center"
          initial="hidden"
          animate={teamInView ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <motion.h2
            className="text-3xl font-bold text-yellow-900 mb-12"
            initial={{ opacity: 0 }}
            animate={teamInView ? { opacity: 1 } : {}}
          >
            Nossa Equipe
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            {[
              {
                name: "João Silva",
                role: "Master Roaster",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
              },
              {
                name: "Maria Santos",
                role: "Sommelier de Café",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
              },
              {
                name: "Pedro Oliveira",
                role: "Especialista em Cultivo",
                image:
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={cardVariants}
              >
                <motion.div
                  className="relative w-48 h-48 mx-auto mb-4 overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                  />
                </motion.div>
                <motion.h3
                  className="text-xl font-bold text-yellow-900"
                  initial={{ opacity: 0 }}
                  animate={teamInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {member.name}
                </motion.h3>
                <motion.p
                  className="text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={teamInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  {member.role}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Animated counter component for the Impact section
const ImpactCounter = ({ number, label, prefix = "", suffix = "" }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  return (
    <motion.div ref={ref}>
      <motion.div
        className="text-3xl font-bold text-yellow-800 mb-2"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.3 }}
      >
        {prefix}
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {inView ? <Counter from={0} to={number} duration={2} /> : number}
        </motion.span>
        {suffix}
      </motion.div>
      <p className="text-gray-700">{label}</p>
    </motion.div>
  );
};

// Counter animation
const Counter = ({ from, to, duration = 2 }) => {
  const [count, setCount] = React.useState(from);

  React.useEffect(() => {
    let start = null;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      setCount(Math.floor(progress * (to - from) + from));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    return () => {};
  }, [from, to, duration]);

  return <>{count}</>;
};

export default About;
