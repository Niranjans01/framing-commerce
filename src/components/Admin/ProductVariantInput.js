import CreatableSelect from 'react-select/creatable';
import {useEffect, useState} from "react";
import {FormGroup} from "react-bootstrap";

const components = {
  DropdownIndicator: null,
};

const createOption = (label) => ({
  label,
  value: {
    name: label,
    price: 0,
    isDeleted: false,
  },
});


export default function ProductVariantInput({variants, setVariants}) {
  const [inputValue, setInputValue] = useState("");
  const [values, setValues] = useState([]);

  useEffect(() => {
    setValues(variants.map(variant => {
      return {label: variant.name, value: variant};
    }));
  }, [variants]);

  const handleChange = (values) => {
    setVariantValues(values || []);
  };

  const setVariantValues = (values) => {
    setVariants(values.map(value => value.value));
  };

  const handleInputChange = (inputValue) => {
    setInputValue(inputValue);
  };

  const handleKeyDown = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setInputValue("");
        setVariantValues([...(values || []), createOption(inputValue)])
        event.preventDefault();
    }
  };

  const setVariantPrice = (price, index) => {
    values[index].value.price = price;
    setVariantValues(values);
  }

  const setVariantIsDeleted = (isDeleted, index) => {
    values[index].value.isDeleted = isDeleted;
    setVariantValues(values);
  }

  return (
    <div>
      <CreatableSelect
        components={components}
        inputValue={inputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        onChange={handleChange}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type something and press enter..."
        value={values}
      />
      <div>
        { values.map((value, index) => (
          <div key={`variant-${index}`} className="col-md-12 border mt-3">
            <h5 className="mt-3">{value.label}</h5>
            <div className="row mt-3">
              <FormGroup className="col-md-6">
                <label className="pr-2">Price</label>
                <input type="number" step={0.1} value={value.value.price} onChange={e => setVariantPrice(parseFloat(e.target.value), index)}/>
              </FormGroup>
              <FormGroup className="col-md-6"  >
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="checkbox" id={`variant-isDeleted-${index}`} checked={value.value.isDeleted} onChange={e => setVariantIsDeleted(e.target.checked, index)}/>
                  <label className="form-check-label" htmlFor={`variant-isDeleted-${index}`}>Unavailable?</label>
                </div>
              </FormGroup>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
