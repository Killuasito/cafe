import React from "react";

const About = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <div className="relative bg-yellow-950 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Nossa História
          </h1>
          <p className="text-xl text-yellow-100 max-w-2xl">
            Desde 1995, trazendo o melhor do café para sua mesa.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-yellow-900 mb-6">
              Nossa Missão
            </h2>
            <p className="text-gray-700 mb-4">
              Nossa missão é levar até você o café mais excepcional, cultivado
              com respeito ao meio ambiente e às comunidades produtoras.
            </p>
            <p className="text-gray-700">
              Trabalhamos diretamente com pequenos produtores, garantindo
              práticas sustentáveis e preços justos.
            </p>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
              alt="Café sendo preparado"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "Qualidade",
              description:
                "Selecionamos apenas os melhores grãos para nossos produtos.",
            },
            {
              title: "Sustentabilidade",
              description:
                "Comprometidos com práticas ambientalmente responsáveis.",
            },
            {
              title: "Comunidade",
              description:
                "Apoiamos e desenvolvemos as comunidades produtoras.",
            },
          ].map((value, index) => (
            <div key={index} className="bg-yellow-900 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-4">
                {value.title}
              </h3>
              <p className="text-gray-300">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-yellow-900 mb-12">
            Nossa Equipe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <div key={index} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-bold text-yellow-900">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
