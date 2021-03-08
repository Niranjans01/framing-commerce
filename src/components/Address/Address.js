import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import shippingService from "../../services/ShippingService";

export default function Address({ onSubmit, onReset, values }) {
  const [address, setAddress] = useState(
    values || {
      street: "",
      suburb: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
    }
  );
  const [phnerr,setPhnError] = useState(false)
  const [ziperr, setZipError] = useState(false)
  const { addToast } = useToasts();

  const handleChange = (evt) => {
    const value = evt.target.value;
    setAddress({
      ...address,
      [evt.target.name]: value,
    });
  };

  const validateZip = async (evt) => {
    if(evt.target.value){
      try {
        const shipping = await shippingService.getByZip(evt.target.value);
        setZipError(false);
      } catch (error) {
        if (error.response.status === 404) {
          setZipError(true);
        }
      }
    }
  }

  const save = (e) => {
    e.preventDefault();
    if(phnerr){
      addToast("Enter a valid phone number", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    else{
      onSubmit(address);
    }
  };

  const validatePhone = (e) => {
    const value = e.target.value;
    let phoneno = /^\d{9,10}$/;
    if(phoneno.test(value)){
      setPhnError(false)
    }
    else{
      setPhnError(true)
    }
  }

  return (
    <div className="lezada-form user-address-form">
      <form className="checkout-form" onSubmit={save} onReset={onReset}>
        <div className="row row-40">
          <div className="col-lg-12">
            <div id="billing-form" className="space-mt--20">
              <Row>
                <Col md={12} className="space-mb--20">
                  <label>Address*</label>
                  <input
                    required
                    id="address-1"
                    name="street"
                    type="text"
                    placeholder="Address line 1"
                    value={address.street}
                    onChange={handleChange}
                  />
                  <input
                    id="address-2"
                    name="suburb"
                    type="text"
                    placeholder="Address line 2"
                    onChange={handleChange}
                    value={address.suburb}
                  />
                </Col>
                <Col md={6} className="space-mb--20">
                  <label>Country</label>
                  <input id="country" type="text" value="Australia" readOnly />
                </Col>
                <Col md={6} className="space-mb--20">
                  <label>Town/City*</label>
                  <input
                    required
                    id="town-city"
                    name="city"
                    type="text"
                    placeholder="Town/City"
                    onChange={handleChange}
                    value={address.city}
                  />
                </Col>
                <Col md={4} className="space-mb--20">
                  <label>State*</label>
                  <input
                    required
                    id="state"
                    name="state"
                    type="text"
                    placeholder="State"
                    onChange={handleChange}
                    value={address.state}
                  />
                </Col>
                <Col md={4}>
                  <label>Post Code*</label>
                  <input
                    required
                    id="zip-code"
                    name="zip"
                    type="text"
                    placeholder="Post Code"
                    onChange={handleChange}
                    onBlur={validateZip}
                    value={address.zip}
                  />
                  {ziperr && (
                    <span className="error-message">Please enter a valid post code</span>
                  )}
                </Col>
                <Col md={4}>
                  <label>Phone*</label>
                  <input
                    required
                    id="phone"
                    name="phone"
                    type="text"
                    placeholder="Phone"
                    pattern="^\d{9,10}$"
                    onChange={handleChange}
                    onBlur={validatePhone}
                    onInvalid={e=>{e.target.setCustomValidity("Please enter a 9 or 10 digit number");}}
                    value={address.phone}
                  />
                  {phnerr && (
                    <span className="error-message">Please enter a valid Phone number</span>
                  )}
                </Col>
                <div className="single-input-item">
                  <button type="submit" disabled={phnerr&&ziperr}>Save Changes</button>
                  <button type="reset" className="reset">
                    Reset
                  </button>
                </div>
              </Row>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
