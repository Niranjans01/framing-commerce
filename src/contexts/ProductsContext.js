import {createContext, useContext, useState} from 'react'

export const ProductsContext = createContext(null);
import productService from "../services/ProductService2";

export function useProducts() {
  return useContext(ProductsContext);
}

export function ProductsContextProvider(props) {
  const [navigationProducts, setNavigationProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useState(() => {
    productService.find({skipImageMinting: true}).then(setNavigationProducts);
    productService.find({featured: true}).then(setFeaturedProducts);
  }, []);

  return (
    <ProductsContext.Provider value={{navigationProducts, featuredProducts}}>
      {props.children}
    </ProductsContext.Provider>
  )
}
