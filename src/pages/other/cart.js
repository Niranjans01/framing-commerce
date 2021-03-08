import { useEffect, useState } from "react";
import Link from "next/link";
import { Container, Row, Col,Modal } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import { Layout } from "../../components/Layout";
import { EditGiftVoucher } from "../../components/Product"
import { Breadcrumb } from "../../components/Breadcrumb";
import { IoIosClose, IoMdCart, IoIosArrowBack } from "react-icons/io";
import { useCart } from "../../contexts/CartContext";
import { useUser } from "../../contexts/AccountContext";
import { round } from "../../lib/utilities";
import { getDiscountPrice } from "../../lib/product-utilities";

import couponService from "../../services/CouponService";

const Cart = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [show, setShow] = useState(false);
  const [giftId, setGiftId] = useState(null)

  const { addToast } = useToasts();
  const {
    cartItems,
    addToCart,
    clearCart,
    removeFromCart,
    decreaseQuantity,
    setCoupon,
    cartTotal,
    hasAppliedCoupon,
    setHasAppliedCoupon,
    couponCode,
    setCouponCode,
    setNewCart
  } = useCart();
  const { user } = useUser();

  useEffect(()=>{
    if(cartItems){
      let new_items = cartItems.map(e=>{
        e.price = Math.round(e.price)
        if(e.discountedPrice){
          e.discountedPrice = Math.round(e.discountedPrice)
        }
        return e
    })
    setNewCart(new_items)
    }
  },[])

  useEffect(() => {
    document.querySelector("body").classList.remove("overflow-hidden");
  });

  const closeModal = () =>{
    setShow(false)
  }

  const submitCoupon = (e) => {
    e.preventDefault();

    if (hasAppliedCoupon) {
      setErrorMessage("Coupon already applied");
      return;
    }

    (async () => {
      const coupons = await couponService.find({});
      const coupon = coupons.find(
        (coupon) =>
          coupon.displayName.toLowerCase() === couponCode.toLowerCase()
      );
      const now = new Date().getTime();
      if (coupon && now < coupon.expiryDate && !coupon.isDeleted) {
        setErrorMessage(null);
        applyCoupon(coupon);
      } else {
        setErrorMessage("Invalid Coupon");
      }
    })();
  };

  const deleteCoupon = (e) => {
    e.preventDefault()
    setHasAppliedCoupon(false);
    setCouponCode("")
    addToast(`Deleted Coupon!`, {
      appearance: "success",
      autoDismiss: true,
    });
  }

  const applyCoupon = (coupon) => {
    setCoupon(coupon);
    if (coupon) {
      setHasAppliedCoupon(true);
      setCouponCode(couponCode.toUpperCase())
    }
    addToast(`Enjoy your ${coupon.discount}% off!`, {
      appearance: "success",
      autoDismiss: true,
    });
  };

  const configDisplayItem = (config) => {
    if (config.type === "dimension") {
      return <span>{`Size: ${config.value.width}x${config.value.height}`}</span>
    } else if (config.type.indexOf("mat") > -1) {
      return (
        <>
          <span>{`${config.type.split("_")[0] == 'top' ? "Top mat" : "Bottom mat"}: ${config.value.color}`}</span>
          {displayMatThickness(config)}
        </>
         
      );
    } else {
    return <span>{`${config.type}: ${config.displayName}`}</span>;
    }
  };

  const displayMatThickness = (config) => {
    let width = config.value
    if (width.bottom == width.top || width.right == width.left) {
      
      //Uniform width
      if (width.bottom == width.right) {
      return <span>{`Mat width: ${width.top}`}</span>
      }

      // Only Top and bottom same
      if (width.bottom == width.top) {
        return (
          <>
          <span>{`Top and bottom mat width: ${width.top}`}</span>
          <span>{`Right mat width: ${width.right}`}</span>
          <span>{`Left mat width: ${width.left}`}</span>
          </>
        )
      }
      //Only Sides same
      if (width.right == width.left) {
        return (
          <>
          <span>{`Top mat width: ${width.top}`}</span>
          <span>{`Bottom mat width: ${width.bottom}`}</span>
          <span>{`Sides mat width: ${width.right}`}</span>
          </>
        )
      }
      // Both sides and tops same
      return (
        <>
          <span>{`Top and bottom mat width: ${width.top}`}</span>
          <span>{`Side mat width: ${width.right}`}</span>
        </>
      )
    }
    // Non-uniform width
    return (
      <>
        <span>{`Top mat width: ${width.top}`}</span>
        <span>{`Bottom mat width: ${width.bottom}`}</span>
        <span>{`Right mat width: ${width.right}`}</span>
        <span>{`Left mat width: ${width.left}`}</span>
      </>
    )
  }
  return (
    <Layout>
      {/* breadcrumb */}
      <Breadcrumb
        pageTitle="Cart"
        backgroundImage="/assets/images/backgrounds/cart-background.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Cart</li>
        </ul>
      </Breadcrumb>

      {/* cart content */}
      <div className="cart-content space-mt--r130 space-mb--r130">
        <Container>
        <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Edit Voucher
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditGiftVoucher giftId={giftId} closeModal = {closeModal}/>
        </Modal.Body>
      </Modal>
          {cartItems && cartItems.length > 0 ? (
            <Row>
              <Col lg={12}>
                <Link href="/" as={process.env.PUBLIC_URL + "/"}>
                  <a className="continue-shopping">
                    <IoIosArrowBack /> <span>Continue Shopping</span>
                  </a>
                </Link>
                {/* cart table */}
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th className="product-name" colSpan="2">
                        Product
                      </th>
                      <th className="product-price">Price</th>
                      <th className="product-quantity">Quantity</th>
                      <th className="product-subtotal">Total</th>
                      <th className="product-remove">&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((cartItem) => {
                      return (
                        <tr key={cartItem.cartItemId}>
                          <td className="product-thumbnail">
                            <Link
                              href={`/${cartItem.category}/${cartItem.name}`}
                              as={`${process.env.PUBLIC_URL}/${cartItem.category}/${cartItem.name}`}
                            >
                              <a>
                                {cartItem.images?.length ? (
                                  <img
                                    src={cartItem.images[0].url}
                                    className="img-fluid"
                                    alt={cartItem.displayName}
                                  />
                                ) : cartItem.displayName==="Gift Voucher"?(
                                  <img
                                    src={process.env.PUBLIC_URL + "/assets/images/gift-vouchers/gift-voucher.jpg"}
                                    className="img-fluid"
                                    alt={cartItem.displayName}
                                  />
                                ):null}
                              </a>
                            </Link>
                          </td>
                          <td className="product-name">
                            <Link
                              href={`/${cartItem.category}/${cartItem.name}`}
                              as={`${process.env.PUBLIC_URL}/${cartItem.category}/${cartItem.name}`}
                            >
                              <a>{cartItem.displayName}</a>
                            </Link>
                            {cartItem.configurations ? (
                              <div className="product-variation">
                                {cartItem.product!=="gift-voucher"?cartItem.configurations.map((config) => (
                                  // <span className="config-span">
                                  //   {configDisplayItem(config)}
                                  // </span>
                                  configDisplayItem(config)
                                )):(
                                  <span className="config-span">
                                    <button className="lezada-button lezada-button--small" onClick={() => {setGiftId(cartItem.cartItemId);setShow(true)}}>Edit Voucher</button>
                                  </span>
                                )}
                              </div>
                            ) : null}
                            {cartItem.selectedProductColor &&
                            cartItem.selectedProductSize ? (
                              <div className="product-variation">
                                <span>
                                  Color: {cartItem.selectedProductColor}
                                </span>
                                <span>
                                  Size: {cartItem.selectedProductSize}
                                </span>
                              </div>
                            ) : (
                              ""
                            )}
                            {cartItem.variant ? (
                              <div className="product-variation">
                                <span>{cartItem.variant.name}</span>
                              </div>
                            ) : (
                              ""
                            )}
                          </td>

                          <td className="product-price">
                            <span className="price">
                              $
                              {cartItem.discountedPrice
                                ? (
                                    cartItem.discountedPrice * cartItem.quantity
                                  )
                                : (cartItem.price * cartItem.quantity)}
                            </span>
                          </td>

                          <td className="product-quantity">
                            <div className="cart-plus-minus">
                              <button
                                className="dec qtybutton"
                                onClick={() => {
                                  let isDecrement = decreaseQuantity(cartItem);
                                  if (isDecrement) {
                                    addToast("Item Decremented From Cart", {
                                      appearance: "warning",
                                      autoDismiss: true,
                                    });
                                  } else {
                                    addToast("Removed From Cart", {
                                      appearance: "error",
                                      autoDismiss: true,
                                    });
                                  }
                                }}
                              >
                                -
                              </button>
                              <input
                                className="cart-plus-minus-box"
                                type="text"
                                value={cartItem.quantity}
                                readOnly
                              />
                              <button
                                className="inc qtybutton"
                                onClick={() => {
                                  addToCart(cartItem, cartItem.cartItemId);
                                }}
                              >
                                +
                              </button>
                            </div>
                          </td>

                          <td className="total-price">
                            <span className="price">
                              ${" "}
                              {cartItem.discountedPrice
                                ? (
                                    cartItem.discountedPrice * cartItem.quantity
                                  )
                                : (cartItem.price * cartItem.quantity)}
                            </span>
                          </td>

                          <td className="product-remove">
                            <button
                              onClick={() => {
                                removeFromCart(cartItem);
                                addToast("Removed From Cart", {
                                  appearance: "error",
                                  autoDismiss: true,
                                });
                              }}
                            >
                              <IoIosClose />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Col>
              <Col lg={12} className="space-mb--r100">
                <div className="cart-coupon-area space-pt--30 space-pb--30">
                  <Row className="align-items-center">
                    <Col lg={7} className="space-mb-mobile-only--30">
                      <div className="lezada-form coupon-form">
                        <form onSubmit={!hasAppliedCoupon? submitCoupon : deleteCoupon}>
                          <Row>
                            <Col md={7}>
                              <input
                                type="text"
                                value={couponCode}
                                placeholder="Enter your coupon code"
                                onChange={(e) => setCouponCode(e.target.value)}
                                disabled={hasAppliedCoupon}
                              />
                              {errorMessage ? (
                                <span className="error-message">
                                  {errorMessage}
                                </span>
                              ) : (
                                ""
                              )}
                            </Col>
                            <Col md={5}>
                              <button
                                className="lezada-button lezada-button--medium"
                                onSubmit={submitCoupon}
                              >
                                {hasAppliedCoupon? "Delete coupon" : "Apply Coupon"}
                              </button>
                            </Col>
                          </Row>
                          {/* <Row>
                            <Col md={5}>
                            <button
                                className="lezada-button lezada-button--medium"
                                onClick={e=>{e.preventDefault();deleteCoupon}}
                              >
                                Reset
                              </button>
                            </Col>
                          </Row> */}
                        </form>
                      </div>
                    </Col>
                    <Col lg={5} className="text-left text-lg-right">
                      <button
                        className="lezada-button lezada-button--medium"
                        onClick={() => {
                          clearCart();
                          addToast("Removed From Cart", {
                            appearance: "error",
                            autoDismiss: true,
                          });
                        }}
                      >
                        clear cart
                      </button>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col lg={5} className="ml-auto">
                <div className="cart-calculation-area">
                  <h2 className="space-mb--40">Cart totals</h2>
                  <table className="cart-calculation-table space-mb--40">
                    <tbody>
                      <tr>
                        <th>SUBTOTAL</th>
                        <td className="total">${cartTotal}</td>
                      </tr>
                      <tr>
                        <th>SHIPPING</th>
                        <td>Computed at checkout</td>
                      </tr>
                      <tr>
                        <th>TOTAL</th>
                        <td className="total">${cartTotal}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="cart-calculation-button text-center">
                    <Link
                      href="/other/checkout"
                      as={process.env.PUBLIC_URL + "/other/checkout"}
                    >
                      <a className="lezada-button lezada-button--medium">
                        proceed to checkout
                      </a>
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col>
                <div className="item-empty-area text-center">
                  <div className="item-empty-area__icon space-mb--30">
                    <IoMdCart />
                  </div>
                  <div className="item-empty-area__text">
                    <p className="space-mb--30">No items found in cart</p>
                    <Link href="/" as={process.env.PUBLIC_URL + "/"}>
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

export default Cart;
