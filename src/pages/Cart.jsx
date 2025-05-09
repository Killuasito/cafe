import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiShoppingBag,
} from "react-icons/fi";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { QRCodeSVG } from "qrcode.react"; // Replace the previous QRCode import
import { processPayment } from "../services/stripe";
import { fetchAddressByCep } from "../services/cepService";
import { ProductService } from "../services/ProductService";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } =
    useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: currentUser?.displayName || "",
    phone: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [currentStep, setCurrentStep] = useState("delivery"); // 'delivery', 'payment', 'confirmation'
  const [selectedPayment, setSelectedPayment] = useState("");
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    pixEmail: "",
  });

  const formatCep = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substr(0, 9);
  };

  const handleCepChange = async (e) => {
    const formattedCep = formatCep(e.target.value);
    setCustomerInfo((prev) => ({ ...prev, zipCode: formattedCep }));

    if (formattedCep.length === 9) {
      try {
        const address = await fetchAddressByCep(formattedCep);
        setCustomerInfo((prev) => ({
          ...prev,
          street: address.street,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
        }));
        toast.success("Endereço preenchido automaticamente");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentChange = (method) => {
    setSelectedPayment(method);
  };

  const handlePaymentInfoChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateDeliveryInfo = () => {
    const requiredFields = [
      "name",
      "phone",
      "street",
      "number",
      "neighborhood",
      "city",
      "state",
      "zipCode",
    ];
    return !requiredFields.some((field) => !customerInfo[field]);
  };

  const handleContinueToPayment = () => {
    if (validateDeliveryInfo()) {
      setCurrentStep("payment");
      window.scrollTo(0, 0);
    } else {
      toast.error("Por favor, preencha todos os campos obrigatórios");
    }
  };

  const handleBackToDelivery = () => {
    setCurrentStep("delivery");
    window.scrollTo(0, 0);
  };

  const handleCheckout = async () => {
    if (!currentUser) {
      toast.error("Faça login para continuar com a compra");
      navigate("/login?redirect=cart");
      return;
    }

    if (!selectedPayment) {
      toast.error("Por favor, selecione um método de pagamento");
      return;
    }

    setIsProcessing(true);

    try {
      // Verificar estoque antes de processar
      for (const item of cartItems) {
        const product = await ProductService.getProductById(item.id);
        if (product.stock < item.quantity) {
          toast.error(`Estoque insuficiente para ${item.name}`);
          return;
        }
      }

      let paymentResult;

      if (selectedPayment === "credit") {
        // Processa pagamento com cartão via Stripe
        paymentResult = await processPayment(paymentInfo, getCartTotal());
      }

      const orderData = {
        userId: currentUser.uid,
        customerInfo,
        paymentInfo:
          selectedPayment === "credit"
            ? {
                last4: paymentInfo.cardNumber.slice(-4),
                brand: paymentResult.card.brand,
              }
            : {
                type: "pix",
              },
        paymentMethod: selectedPayment,
        items: cartItems,
        total: getCartTotal(),
        status: "pending",
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);

      if (docRef.id) {
        // Atualizar estoque de cada item
        await Promise.all(
          cartItems.map(async (item) => {
            await ProductService.updateStock(item.id, item.quantity);
          })
        );

        toast.success("Pedido realizado com sucesso!");
        clearCart();
        navigate("/orders");
      }
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      toast.error(
        error.message || "Erro ao processar pedido. Tente novamente."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentMethods = () => (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
      <h2 className="text-xl font-semibold text-yellow-900 mb-6">
        Método de Pagamento
      </h2>

      <div className="space-y-4">
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => handlePaymentChange("credit")}
            className={`p-4 border rounded-lg flex items-center ${
              selectedPayment === "credit"
                ? "border-yellow-900 bg-yellow-50"
                : "border-gray-200"
            }`}
          >
            <div className="w-6 h-6 border-2 rounded-full mr-3 flex items-center justify-center">
              {selectedPayment === "credit" && (
                <div className="w-3 h-3 bg-yellow-900 rounded-full" />
              )}
            </div>
            <span>Cartão de Crédito</span>
          </button>

          <button
            onClick={() => handlePaymentChange("pix")}
            className={`p-4 border rounded-lg flex items-center ${
              selectedPayment === "pix"
                ? "border-yellow-900 bg-yellow-50"
                : "border-gray-200"
            }`}
          >
            <div className="w-6 h-6 border-2 rounded-full mr-3 flex items-center justify-center">
              {selectedPayment === "pix" && (
                <div className="w-3 h-3 bg-yellow-900 rounded-full" />
              )}
            </div>
            <span>PIX</span>
          </button>
        </div>

        {selectedPayment === "credit" && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número do Cartão*
              </label>
              <input
                type="text"
                name="cardNumber"
                value={paymentInfo.cardNumber}
                onChange={handlePaymentInfoChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="0000 0000 0000 0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome no Cartão*
              </label>
              <input
                type="text"
                name="cardName"
                value={paymentInfo.cardName}
                onChange={handlePaymentInfoChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Validade*
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={paymentInfo.expiryDate}
                  onChange={handlePaymentInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="MM/AA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV*
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={paymentInfo.cvv}
                  onChange={handlePaymentInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="123"
                />
              </div>
            </div>
          </div>
        )}

        {selectedPayment === "pix" && (
          <div className="mt-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Pague com PIX
              </h3>
              <p className="text-gray-600 mb-4">
                Escaneie o QR Code ou use o email para pagar
              </p>
              <div className="flex flex-col items-center space-y-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <QRCodeSVG
                    value="tififerreira@gmail.com"
                    size={200}
                    level="H"
                    className="mx-auto"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Ou envie para o email:
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="font-medium text-yellow-900">
                      tififerreira@gmail.com
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("tififerreira@gmail.com");
                        toast.success("Email copiado!");
                      }}
                      className="text-yellow-900 hover:text-yellow-700 text-sm underline"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg w-full text-center">
                  <p className="text-yellow-900 font-medium mb-2">
                    Valor a pagar:
                  </p>
                  <p className="text-2xl font-bold text-yellow-900">
                    R$ {getCartTotal().toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={handleBackToDelivery}
          className="px-6 py-2 border border-yellow-900 text-yellow-900 rounded-lg hover:bg-yellow-50"
        >
          Voltar
        </button>
        <button
          onClick={handleCheckout}
          className="px-6 py-2 bg-yellow-900 text-white rounded-lg hover:bg-yellow-800"
          disabled={!selectedPayment || isProcessing}
        >
          Finalizar Compra
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (currentStep === "payment") {
      return <>{renderPaymentMethods()}</>;
    }
    return (
      <>
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <h2 className="text-xl font-semibold text-yellow-900 mb-4">
            Informações de Entrega
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo*
              </label>
              <input
                type="text"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone*
              </label>
              <input
                type="tel"
                name="phone"
                value={customerInfo.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rua*
              </label>
              <input
                type="text"
                name="street"
                value={customerInfo.street}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número*
              </label>
              <input
                type="text"
                name="number"
                value={customerInfo.number}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Complemento
              </label>
              <input
                type="text"
                name="complement"
                value={customerInfo.complement}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bairro*
              </label>
              <input
                type="text"
                name="neighborhood"
                value={customerInfo.neighborhood}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CEP*
              </label>
              <input
                type="text"
                name="zipCode"
                value={customerInfo.zipCode}
                onChange={handleCepChange}
                maxLength={9}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="00000-000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade*
              </label>
              <input
                type="text"
                name="city"
                value={customerInfo.city}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado*
              </label>
              <input
                type="text"
                name="state"
                value={customerInfo.state}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleContinueToPayment}
              className="px-6 py-2 bg-yellow-900 text-white rounded-lg hover:bg-yellow-800"
            >
              Continuar para Pagamento
            </button>
          </div>
        </div>
      </>
    );
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 pt-32">
        <h1 className="text-2xl md:text-3xl font-bold text-yellow-900 mb-8">
          Seu Carrinho
        </h1>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex flex-col items-center">
            <FiShoppingBag size={64} className="text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-600 mb-6">
              Parece que você ainda não adicionou nenhum item ao seu carrinho.
            </p>
            <Link to="/products" className="btn-primary">
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-yellow-900 mb-4 md:mb-8">
          {currentStep === "payment" ? "Pagamento" : "Seu Carrinho"}
        </h1>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
          <div className="lg:w-2/3 space-y-4 md:space-y-6">
            {currentStep === "delivery" && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-3 md:p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-base md:text-lg font-semibold text-yellow-900">
                      Itens do Carrinho (
                      {cartItems.reduce(
                        (count, item) => count + item.quantity,
                        0
                      )}
                      )
                    </h2>
                    <button
                      onClick={clearCart}
                      className="text-xs md:text-sm text-gray-500 hover:text-yellow-900 transition-colors"
                    >
                      Limpar carrinho
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 md:p-4 flex flex-col sm:flex-row items-center border-b border-gray-200 last:border-b-0"
                    >
                      <div className="w-20 sm:w-24 h-20 sm:h-24 mr-0 sm:mr-4 mb-3 sm:mb-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>

                      <div className="flex-grow text-center sm:text-left mb-3 sm:mb-0">
                        <Link
                          to={`/products/${item.id}`}
                          className="text-sm md:text-base font-semibold text-yellow-900 hover:text-yellow-700"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs md:text-sm text-gray-600 mt-1">
                          R$ {item.price.toFixed(2)} / unidade
                        </p>
                      </div>

                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="text-gray-500 hover:text-yellow-900 p-1"
                            disabled={item.quantity <= 1}
                          >
                            <FiMinus size={14} className="md:w-4 md:h-4" />
                          </button>
                          <span className="mx-2 md:mx-3 w-6 md:w-8 text-center text-sm md:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="text-gray-500 hover:text-yellow-900 p-1"
                          >
                            <FiPlus size={14} className="md:w-4 md:h-4" />
                          </button>
                        </div>

                        <div className="text-center min-w-[80px]">
                          <p className="text-sm md:text-base font-semibold text-yellow-900">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                          aria-label="Remover item"
                        >
                          <FiTrash2
                            size={16}
                            className="md:w-[18px] md:h-[18px]"
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 md:p-4 border-t border-gray-200">
                  <Link
                    to="/products"
                    className="inline-flex items-center text-sm md:text-base text-yellow-900 hover:text-yellow-700 transition-colors"
                  >
                    <FiArrowLeft size={14} className="mr-2 md:w-4 md:h-4" />
                    Continuar Comprando
                  </Link>
                </div>
              </div>
            )}
            {renderContent()}
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-4 md:p-6 sticky top-20 md:top-24">
              <h2 className="text-lg font-semibold text-yellow-900 mb-4">
                Resumo do Pedido
              </h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>R$ {getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frete:</span>
                  <span>Grátis</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between font-semibold text-lg text-yellow-900">
                  <span>Total:</span>
                  <span>R$ {getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Pagamentos seguros e processados com criptografia</p>
                <div className="flex justify-center mt-2 space-x-2">
                  <span className="px-2 py-1 bg-gray-100 rounded">Visa</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    Mastercard
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded">Pix</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
