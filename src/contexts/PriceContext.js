import {createContext, useContext, useEffect, useState} from 'react'
import pricingService from "../services/PricingService";

export const PriceContext = createContext(null);

export function usePrice() {
  return useContext(PriceContext);
}

export function PriceContextProvider(props) {
  const [priceCodes, setPriceCodes] = useState(null);

  useEffect(() => {
    pricingService.find().then(setPriceCodes);
  }, []);

  return (
    <PriceContext.Provider value={priceCodes}>
      { props.children }
    </PriceContext.Provider>
  );
}
