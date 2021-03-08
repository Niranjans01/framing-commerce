import Select from "react-select";

import priceCodeService from "../../services/PriceCodeService";
import {useEffect, useState} from "react";

export default function PriceCodeSelect({id, onChange, value}) {
  const defaultPriceCodes = [
    {
      value: null, label: "None",
    }
  ];
  const [initialValue, setInitialValue] = useState(null);
  const [priceCodes, setPriceCodes] = useState([...defaultPriceCodes]);

  useEffect(() => {
    priceCodeService.find().then(priceCodes => {
      const options = priceCodes.map(pc => {
        return { value: pc.id, label: pc.displayName };
      });

      setPriceCodes([...defaultPriceCodes, ...options]);
    })
  }, []);

  useEffect(() => {
    setInitialValue(priceCodes.find(pc => pc.value === value));
  }, [value, priceCodes]);

  return (
    <Select
      id={id}
      value={initialValue}
      onChange={e => onChange(e.value) }
      options={priceCodes}
      />
  );
}
