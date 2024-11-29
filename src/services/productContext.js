import React, { createContext, useState } from 'react';

// Criando o contexto
export const ProductContext = createContext();

// Criando o provider
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  // Método para adicionar um produto
  const addProduct = (name, price, quantity, image) => {
    const newProduct = {
      id: Math.random().toString(36).substring(7), // Gera um ID único
      name,
      price,
      quantity,
      image,
    };
    setProducts([...products, newProduct]); // Atualiza a lista de produtos
  };

  return (
    <ProductContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
