import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  Container,
  Row,
  Col,
  Accordion,
  useAccordionToggle,
  Card,
} from "react-bootstrap";
import { IoMdCash } from "react-icons/io";
import { Layout } from "../../components/Layout";
import { Breadcrumb } from "../../components/Breadcrumb";
import { useCart } from "../../contexts/CartContext";
import orderService from "../../services/OrderService";
import { useUser } from "../../contexts/AccountContext";
import { useRouter } from "next/router";
import shippingService from "../../services/ShippingService";
import { accountService } from "../../services/AccountService";
import { uploadImages, validURL } from "../../lib/utilities";

const Checkout = () => {
  const [cartTotalPrice, setCartTotalPrice] = useState(0.0);
  const { cartItems, coupon, cartTotal } = useCart();
  const router = useRouter();
  const { user } = useUser();

  const [sameBilling, setSameBilling] = useState(false);
  const [billingAddress, setBillingAddress] = useState({
    country: "Australia",
  });
  const [shippingAddress, setShippingAddress] = useState({
    country: "Australia",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [payInProgress, setPayInProgress] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [grandTotal, setGrandTotal] = useState(cartTotal);
  const [zipError, setZipError] = useState("");
  const [zipLoading, setZipLoading] = useState(false);
  const [zipBError, setBZipError] = useState("");
  const [zipBLoading, setZipBLoading] = useState(false);
  const [commentLetters, setCommentLetters] = useState(0)
  const billingRef = useRef(null);

  const [paymentOption, setPaymentOption] = useState("card");

  const CustomToggle = ({ children, eventKey }) => {
    const decoratedOnClick = useAccordionToggle(eventKey);

    return (
      <div className="single-method">
        <input
          type="checkbox"
          id="same_billing_address"
          checked={sameBilling}
          onChange={() => setSameBilling(!sameBilling)}
          onClick={decoratedOnClick}
          ref={billingRef}
        />
        <label htmlFor="same_billing_address">
          Shipping same as billing address
        </label>
        {children}
      </div>
    );
  };

  useEffect(() => {
    document.querySelector("body").classList.remove("overflow-hidden");
  });

  useEffect(() => {
    disableShippingDetails(sameBilling);
  }, [sameBilling]);

  useEffect(() => {
    if (sameBilling) {
      setShippingAddress({...billingAddress,comments:shippingAddress.comments?shippingAddress.comments:"No comments"});
    }
  }, [billingAddress]);

  useEffect(() => {
    setGrandTotal(cartTotal + shippingFee);
  }, [cartTotal, shippingFee]);

  useEffect(() => {
    if (user) {
      fetchUserInfo(user.id);
    }
  }, [user]);

  useEffect(() => {
    const productsToShip = cartItems.find((c) => c.product !== "gift-voucher");
    if (shippingAddress.zip && productsToShip) {
      setZipLoading(true)
      if(shippingAddress.zip.length===4){
        (async () => {
          try {
            setZipError(null);
            const shipping = await shippingService.getByZip(shippingAddress.zip);
            setShippingFee(shipping.fee);
          } catch (error) {
            if (error.response.status === 404) {
              setZipError("Please enter a valid post code");
            }
          }
        })();
      }
      else{
        setZipError("Please enter a valid post code");
      }
      setZipLoading(false)
    } else {
      setShippingFee(0);
    }
  }, [shippingAddress, cartTotal]);

  useEffect(() => {
    if (billingAddress.zip && billingAddress.zip.length>0) {
      setZipBLoading(true)
      if(billingAddress.zip.length===4){
        (async () => {
          try {
            setBZipError(null);
            const shipping = await shippingService.getByZip(billingAddress.zip);
          } catch (error) {
            if (error.response.status === 404) {
              setBZipError("Please enter a valid post code");
            }
          }
        })();
      }   
       else{
        setBZipError("Please enter a valid post code");
       } 
       setZipBLoading(false)  
    }
  }, [billingAddress]);

  const disableShippingDetails = (isSame) => {

    const shippingForm = document.querySelector("#shipping-form");
    if (shippingForm) {
      const elements = shippingForm.getElementsByTagName("input");

      Array.from(elements).map((element) => {
        const id = element.id;
        element.value = shippingAddress[id] ? shippingAddress[id] : "";
        element.disabled = isSame;
      });
    }
    setShippingAddress({...billingAddress,comments:shippingAddress.comments?shippingAddress.comments:"No comments"});
  };

  const textCounter = (e) =>{
    setCommentLetters(e.target.value.length)
  }

  const addToBillingAddress = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setBillingAddress({
      ...billingAddress,
      [id]: value,
    });
  };

  const addToShippingAddress = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setShippingAddress({
      ...shippingAddress,
      [id]: value,
    });
  };

  const placeOrder = async (e) => {
    try {
      setPayInProgress(true);
      e.preventDefault();
      const items = await Promise.all(
        cartItems.map(async (item) => {
          let img = item.images?.[0].id;
          if(item.displayName === "Mirrors"){
            item.configurations = item.configurations.map(e=>{
              if(e.type==="mirror_type"){
                e.type="mirror"
              }
              return e
            })
          }
          if (
            item.category === "diy-framing" ||
            item.category === "other-products"
          ) {
            if (item.images.length > 1 && !validURL(item.images[1].url)) {
                img = (await uploadImages(item.images[1].url))?.id;
            }
          }
          let variant = item.variant;
          if (variant) {
            delete variant.isDeleted;
          }
          return {
            product: item.product || item.id,
            displayName: item.displayName,
            configurations: item.configurations,
            price: item.price,
            quantity: item.quantity,
            image: img,
            variant,
          };
        })
      );
      const res = await orderService.placeOrder({
        items,
        shippingAddress,
        billingAddress,
        deliveryCharges: shippingFee,
        paymentProvider: paymentOption,
        couponCode: coupon,
      });
      setPayInProgress(false);
      // window.location.href = res.paymentUrl;
    } catch (error) {
      console.log("this is the error:::",error)
      setPayInProgress(false);
    }
  };

  const fetchUserInfo = async (id) => {
    try {
      const account = await accountService.getUser(id);
      if (account.shippingAddress.length) {
        setBillingAddress({
          ...account.shippingAddress[0],
          country: "Australia",
          firstname: account.firstName,
          lastname: account.lastName,
          email: user.email,
        });
        billingRef.current.click();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const shippingAddressComponent = (
    <div id="shipping-form" className="space-mb--40">
      <h4 className="checkout-title">Shipping Address</h4>
      <Row>
        <Col md={6} className="space-mb--20">
          <label>First Name*</label>
          <input
            required
            id="firstname"
            type="text"
            placeholder="First Name"
            onChange={addToShippingAddress}
          />
        </Col>
        <Col md={6} className="space-mb--20">
          <label>Last Name*</label>
          <input
            required
            id="lastname"
            type="text"
            placeholder="Last Name"
            onChange={addToShippingAddress}
          />
        </Col>
        <Col md={6} className="space-mb--20">
          <label>Email Address*</label>
          <input
            required
            id="email"
            type="email"
            placeholder="Email Address"
            onChange={addToShippingAddress}
          />
        </Col>
        <Col md={6} className="space-mb--20">
          <label>Phone no*</label>
          <input
            required
            id="phone"
            type="text"
            placeholder="Mobile number"
            onChange={addToShippingAddress}
          />
        </Col>
        <Col md={12} className="space-mb--20">
          <label>Company Name</label>
          <input
            id="company"
            type="text"
            placeholder="Company Name"
            onChange={addToShippingAddress}
          />
        </Col>
        <Col md={12} className="space-mb--20">
          <label>Street Address*</label>
          <input
            required
            id="street"
            type="text"
            placeholder="Street Address"
            onChange={addToShippingAddress}
          />
        </Col>
        <Col md={6} className="space-mb--20">
          <label>Country</label>
          <input id="country" type="text" value="Australia" readOnly />
        </Col>
        <Col md={6} className="space-mb--20">
          <label>Suburb/City*</label>
          <input
            required
            id="city"
            type="text"
            placeholder="Suburb/City"
            onChange={addToShippingAddress}
          />
        </Col>
        <Col md={6} className="space-mb--20">
          <label>State*</label>
          <input
            required
            id="state"
            type="text"
            placeholder="State"
            onChange={addToShippingAddress}
          />
        </Col>
        <Col md={6} className="space-mb--20">
          <label>Post Code*</label>
          <input
            required
            id="zip"
            type="text"
            placeholder="Post Code"
            onChange={addToShippingAddress}
          />
          {zipLoading && (
            <span>Validating Post code...</span>
          )}
          <span className="error-message">{!sameBilling?zipError:""}</span>
        </Col>
      </Row>
    </div>
  );

  return (
    <Layout>
      {/* breadcrumb */}
      <Breadcrumb
        pageTitle="Checkout"
        backgroundImage="/assets/images/backgrounds/checkout-background.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Checkout</li>
        </ul>
      </Breadcrumb>
      <div className="checkout-area space-mt--r130 space-mb--r130">
        <Container>
          {cartItems && cartItems.length >= 1 ? (
            <Row>
              <Col>
                <div className="lezada-form">
                  <form className="checkout-form" onSubmit={placeOrder}>
                    {!user ? (
                      <div className="guest-checkout">
                        <h4 className="guest-title">Guest Checkout.</h4>
                        <span>
                          Have an account?{" "}
                          <Link
                            href="/other/login-register"
                            as={
                              process.env.PUBLIC_URL + "/other/login-register"
                            }
                          >
                            <a className="">Click here</a>
                          </Link>{" "}
                          to log in.
                        </span>
                      </div>
                    ) : null}
                    <div className="row row-40">
                      <div className="col-lg-7 space-mb--20">
                        {/* Billing Address */}
                        <div id="billing-form" className="space-mb--40">
                          <h4 className="checkout-title">Billing Address</h4>
                          <Row>
                            <Col md={6} className="space-mb--20">
                              <label>First Name*</label>
                              <input
                                required
                                id="firstname"
                                type="text"
                                placeholder="First Name"
                                onChange={addToBillingAddress}
                                value={billingAddress.firstname}
                              />
                            </Col>
                            <Col md={6} className="space-mb--20">
                              <label>Last Name*</label>
                              <input
                                required
                                id="lastname"
                                type="text"
                                placeholder="Last Name"
                                onChange={addToBillingAddress}
                                value={billingAddress.lastname}
                              />
                            </Col>
                            <Col md={6} className="space-mb--20">
                              <label>Email Address*</label>
                              <input
                                required
                                id="email"
                                type="email"
                                placeholder="Email Address"
                                onChange={addToBillingAddress}
                                value={billingAddress.email}
                              />
                            </Col>
                            <Col md={6} className="space-mb--20">
                              <label>Phone no*</label>
                              <input
                                required
                                id="phone"
                                type="text"
                                placeholder="Phone number"
                                onChange={addToBillingAddress}
                                value={billingAddress.phone}
                              />
                            </Col>
                            <Col md={12} className="space-mb--20">
                              <label>Company Name</label>
                              <input
                                id="company"
                                type="text"
                                placeholder="Company Name"
                                onChange={addToBillingAddress}
                                value={billingAddress.company}
                              />
                            </Col>
                            <Col md={12} className="space-mb--20">
                              <label>Street Address*</label>
                              <input
                                required
                                id="street"
                                type="text"
                                placeholder="Street Address"
                                onChange={addToBillingAddress}
                                value={billingAddress.street}
                              />
                            </Col>
                            <Col md={6} className="space-mb--20">
                              <label>Country</label>
                              <input
                                id="country"
                                type="text"
                                value="Australia"
                                readOnly
                              />
                            </Col>
                            <Col md={6} className="space-mb--20">
                              <label>Suburb/City*</label>
                              <input
                                required
                                id="city"
                                type="text"
                                placeholder="Suburb/City"
                                onChange={addToBillingAddress}
                                value={billingAddress.city}
                              />
                            </Col>
                            <Col md={6} className="space-mb--20">
                              <label>State*</label>
                              <input
                                required
                                id="state"
                                type="text"
                                placeholder="State"
                                onChange={addToBillingAddress}
                                value={billingAddress.state}
                              />
                            </Col>
                            <Col md={6}>
                              <label>Post Code*</label>
                              <input
                                required
                                id="zip"
                                type="text"
                                placeholder="Post Code"
                                onChange={addToBillingAddress}
                                value={billingAddress.zip}
                              />
                              <span className="error-message">{sameBilling?zipError:""}</span>
                              <span className="error-message">{!sameBilling?zipBError:""}</span>
                              { sameBilling && zipLoading && (
                                <span>Validating Post code...</span>
                              )
                              }
                              {
                                zipBLoading && (
                                  <span>Validating Post code...</span>
                                )
                              }
                            </Col>
                            <Col md={12}>
                              <label>ORDER COMMENTS</label>
                              <textarea maxLength="75" id="comments" className="form-control mb-2" placeholder="Add your Comments here..." onChange={e=>{textCounter(e),addToShippingAddress(e)}}/>
                              <span className="mt-2">{commentLetters}/75</span>
                            </Col>
                          </Row>
                        </div>
                        <Accordion defaultActiveKey="0">
                          <Card className="single-my-account space-mb--20">
                            <Card.Header className="panel-heading">
                              <CustomToggle eventKey="0" aria-expanded="true" />
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                              <Card.Body>{shippingAddressComponent}</Card.Body>
                            </Accordion.Collapse>
                          </Card>
                        </Accordion>
                      </div>
                      <div className="col-lg-5">
                        <div className="row">
                          {/* Cart Total */}
                          <div className="col-12 space-mb--50">
                            <h4 className="checkout-title">Cart Total</h4>
                            <div className="checkout-cart-total">
                              <h4>
                                Product <span>Total</span>
                              </h4>
                              <ul>
                                {cartItems.map((product, i) => {
                                  return (
                                    <li key={i}>
                                      {product.displayName} X {product.quantity}{" "}
                                      <span>
                                        $
                                        {product.discountedPrice
                                          ? (
                                              Math.round(product.discountedPrice *
                                              product.quantity)
                                            )
                                          : (
                                              Math.round(product.price * product.quantity)
                                            )}
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                              <p>
                                Sub Total{" "}
                                {coupon ? (
                                  <span>
                                    ${cartTotal} (
                                    {coupon.displayName})
                                  </span>
                                ) : (
                                  <span>${Math.round(cartTotal)}</span>
                                )}
                              </p>
                              <p>
                                Shipping Fee{" "}
                                <span>${Math.round(shippingFee)}</span>
                              </p>
                              <h4>
                                Grand Total{" "}
                                <span>${Math.round(grandTotal)}</span>
                              </h4>
                            </div>
                          </div>
                          {/* Payment Method */}
                          <div className="col-12 space-mb--50">
                            <div className="checkout-payment-method">
                              <div className="single-method">
                                <input
                                  type="radio"
                                  id="payment-card"
                                  name="payment-method"
                                  checked={paymentOption === "card"}
                                  onChange={() => setPaymentOption("card")}
                                />
                                <label htmlFor="payment-card">
                                  Credit / Debit Card{" "}
                                  <img src="/assets/images/eway.png" />
                                </label>
                              </div>
                              <div className="single-method">
                                <input
                                  type="radio"
                                  id="payment-afterpay"
                                  name="payment-method"
                                  checked={paymentOption === "afterpay"}
                                  onChange={() => setPaymentOption("afterpay")}
                                />
                                <label htmlFor="payment-afterpay">
                                  Afterpay
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Credit / Debit Card */}
                          {paymentOption === "card" ? (
                            <div className="col-12">
                              <div className="single-method space-pl-mobile-only--15">
                                <input
                                  type="checkbox"
                                  id="accept_terms"
                                  onChange={() => {
                                    setAcceptedTerms(!acceptedTerms);
                                  }}
                                  checked={acceptedTerms}
                                />
                                <label htmlFor="accept_terms">
                                  {" "}
                                  {/* TODO: Add T&C link */}
                                  I’ve read and accept the{" "}
                                  <a href="../terms-conditions" target="_blank">
                                    <u>terms &amp; conditions</u>
                                  </a>
                                </label>
                              </div>
                              {payInProgress ? (
                                <button
                                  className="lezada-button lezada-button--medium space-mt--20 space-ml-mobile-only--15"
                                  type="button"
                                  disabled
                                >
                                  <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                  <span className="sr-only">Loading...</span>
                                </button>
                              ) : (
                                <button
                                  type="submit"
                                  className="lezada-button lezada-button--medium space-mt--20 space-ml-mobile-only--15"
                                  disabled={!acceptedTerms || zipError}
                                >
                                  Place order
                                </button>
                              )}
                            </div>
                          ) : (
                            ""
                          )}

                          {paymentOption === "afterpay" ? (
                            <div className="col-12">
                              <div className="single-method space-pl-mobile-only--15">
                                <input
                                  type="checkbox"
                                  id="accept_terms"
                                  onChange={() => {
                                    setAcceptedTerms(!acceptedTerms);
                                  }}
                                  checked={acceptedTerms}
                                />
                                <label htmlFor="accept_terms">
                                  {" "}
                                  {/* TODO: Add T&C link */}
                                  I’ve read and accept the{" "}
                                  <a href="../terms-conditions" target="_blank">
                                    <u>terms &amp; conditions</u>
                                  </a>
                                </label>
                              </div>
                              {payInProgress ? (
                                <button
                                  className="lezada-button lezada-button--medium space-mt--20 space-ml-mobile-only--15"
                                  type="button"
                                  disabled
                                >
                                  <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                  <span className="sr-only">Loading...</span>
                                </button>
                              ) : (
                                <button
                                  type="submit"
                                  className="lezada-button lezada-button--medium space-mt--20 space-ml-mobile-only--15"
                                  disabled={!acceptedTerms || zipError}
                                >
                                  Proceed with Afterpay
                                </button>
                              )}
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col>
                <div className="item-empty-area text-center">
                  <div className="item-empty-area__icon space-mb--30">
                    <IoMdCash />
                  </div>
                  <div className="item-empty-area__text">
                    <p className="space-mb--30">
                      No items found in cart to checkout
                    </p>
                    <Link
                      href="/shop/left-sidebar"
                      as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                    >
                      <a className="lezada-button lezada-button--medium">
                        Shop Now
                      </a>
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </Layout>
  );
};

export default Checkout;
