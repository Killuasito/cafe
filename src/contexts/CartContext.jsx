import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Carregar carrinho do localStorage ou Firestore
  useEffect(() => {
    let isMounted = true;

    async function loadCart() {
      try {
        if (currentUser) {
          const cartRef = doc(db, "carts", currentUser.uid);
          const cartDoc = await getDoc(cartRef);

          if (cartDoc.exists() && isMounted) {
            setCartItems(cartDoc.data().items || []);
          } else if (isMounted) {
            // Se não existir carrinho no Firestore, verifica localStorage
            const savedCart = localStorage.getItem("cart");
            if (savedCart) {
              const localCartItems = JSON.parse(savedCart);
              setCartItems(localCartItems);
              // Salva o carrinho local no Firestore
              await setDoc(cartRef, { items: localCartItems });
              localStorage.removeItem("cart"); // Limpa localStorage após migrar
            } else {
              setCartItems([]);
            }
          }
        } else {
          // Usuário não logado - usa localStorage
          const savedCart = localStorage.getItem("cart");
          if (savedCart && isMounted) {
            setCartItems(JSON.parse(savedCart));
          }
        }
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
        if (isMounted) {
          toast.error("Não foi possível carregar seu carrinho");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCart();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  // Salvar carrinho quando houver alterações
  useEffect(() => {
    if (loading) return;

    const saveCart = async () => {
      try {
        if (currentUser) {
          const cartRef = doc(db, "carts", currentUser.uid);
          await setDoc(cartRef, { items: cartItems }, { merge: true });
        } else {
          localStorage.setItem("cart", JSON.stringify(cartItems));
        }
      } catch (error) {
        console.error("Erro ao salvar carrinho:", error);
      }
    };

    const timeoutId = setTimeout(saveCart, 1000); // Debounce de 1 segundo
    return () => clearTimeout(timeoutId);
  }, [cartItems, currentUser, loading]);

  // Adicionar item ao carrinho
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });

    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  // Remover item do carrinho
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
    toast.success("Item removido do carrinho");
  };

  // Atualizar quantidade no carrinho
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Limpar carrinho
  const clearCart = () => {
    setCartItems([]);
    toast.success("Carrinho esvaziado");
  };

  // Calcular total do carrinho
  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    loading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
