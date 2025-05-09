import React from "react";
import toast from "react-hot-toast";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Mensagem enviada com sucesso!");
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="bg-yellow-950 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contato</h1>
          <p className="text-xl text-yellow-100">
            Estamos aqui para ajudar. Entre em contato conosco.
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-yellow-900 mb-6">
              Envie uma mensagem
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">Nome</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Assunto</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Mensagem</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-md h-32 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-yellow-900 text-white px-6 py-3 rounded-md hover:bg-yellow-800 transition-colors duration-300"
              >
                Enviar Mensagem
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-yellow-900 mb-6">
              Informações de Contato
            </h2>
            <div className="space-y-6">
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
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  Telefone
                </h3>
                <p className="text-gray-700">(11) 1234-5678</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  Email
                </h3>
                <p className="text-gray-700">contato@cafegourmet.com</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  Horário de Funcionamento
                </h3>
                <p className="text-gray-700">
                  Segunda a Sexta: 9h às 18h
                  <br />
                  Sábado: 9h às 13h
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
