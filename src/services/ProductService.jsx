import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

const productsCollectionRef = collection(db, "products");

export const ProductService = {
  // Obter todos os produtos
  getAllProducts: async () => {
    try {
      const querySnapshot = await getDocs(productsCollectionRef);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error;
    }
  },

  // Obter produtos em destaque
  getFeaturedProducts: async () => {
    try {
      const q = query(productsCollectionRef, where("featured", "==", true));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Erro ao buscar produtos em destaque:", error);
      throw error;
    }
  },

  // Obter um produto específico
  getProductById: async (id) => {
    try {
      const productDoc = await getDoc(doc(db, "products", id));
      if (productDoc.exists()) {
        return {
          id: productDoc.id,
          ...productDoc.data(),
        };
      } else {
        throw new Error("Produto não encontrado");
      }
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      throw error;
    }
  },

  // Adicionar um novo produto (apenas admin)
  addProduct: async (productData) => {
    try {
      const docRef = await addDoc(productsCollectionRef, {
        ...productData,
        createdAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      throw error;
    }
  },

  // Atualizar um produto (apenas admin)
  updateProduct: async (id, productData) => {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, {
        ...productData,
        updatedAt: new Date(),
      });
      return true;
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw error;
    }
  },

  // Atualizar estoque de um produto
  updateStock: async (productId, quantity) => {
    try {
      const productRef = doc(db, "products", productId);
      const productDoc = await getDoc(productRef);

      if (!productDoc.exists()) {
        throw new Error("Produto não encontrado");
      }

      const currentStock = productDoc.data().stock;
      const newStock = currentStock - quantity;

      if (newStock < 0) {
        throw new Error("Estoque insuficiente");
      }

      await updateDoc(productRef, { stock: newStock });
      return true;
    } catch (error) {
      console.error("Erro ao atualizar estoque:", error);
      throw error;
    }
  },

  // Deletar um produto (apenas admin)
  deleteProduct: async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      return true;
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      throw error;
    }
  },

  // Buscar produtos por categoria
  getProductsByCategory: async (category) => {
    try {
      const q = query(productsCollectionRef, where("category", "==", category));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Erro ao buscar produtos por categoria:", error);
      throw error;
    }
  },
};
