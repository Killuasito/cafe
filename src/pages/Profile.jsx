import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { FiUser, FiMail, FiPhone, FiEdit } from "react-icons/fi";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

function Profile() {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Carregar dados do usuário do Firestore
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFormData({
              name: userData.name || "",
              email: currentUser.email || "",
              phone: userData.phone || "",
            });
          } else {
            // Se o documento não existir, usar dados do auth
            setFormData({
              name: currentUser.displayName || "",
              email: currentUser.email || "",
              phone: "",
            });
          }
        } catch (error) {
          console.error("Erro ao carregar dados do usuário:", error);
          toast.error("Erro ao carregar seus dados");
        }
      }
    };

    loadUserData();
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Salvar no Firestore
      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          name: formData.name,
          phone: formData.phone,
          email: currentUser.email,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-yellow-900 to-yellow-800 rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-white">Meu Perfil</h1>
          <p className="text-yellow-100 mt-2">
            Gerencie suas informações pessoais
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    className="pl-10 w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                    disabled
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  O email não pode ser alterado
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-yellow-900 to-yellow-700 text-white rounded-lg hover:from-yellow-800 hover:to-yellow-600 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <FiEdit size={18} />
                <span>Atualizar Perfil</span>
              </button>
            </div>
          </form>
        </div>

        {/* Activity Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-yellow-900 mb-6">
            Informações da Conta
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Status da Conta</span>
              <span className="text-green-600 font-medium">Ativa</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Membro desde</span>
              <span className="text-gray-900">
                {new Date().toLocaleDateString("pt-BR")}
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-600">Último acesso</span>
              <span className="text-gray-900">
                {new Date().toLocaleDateString("pt-BR")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
