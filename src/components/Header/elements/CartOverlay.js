import Link from "next/link";
import { IoIosClose } from "react-icons/io";
import CustomScroll from "react-custom-scroll";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { useEffect } from "react";
import { useCart } from "../../../contexts/CartContext";
import { round } from "../../../lib/utilities";

const CartOverlay = ({ activeStatus, getActiveStatus }) => {
  let cartTotalPrice = 0;
  const { cartItems, removeFromCart } = useCart();
  const { addToast } = useToasts();

  return (
    <div className={`cart-overlay ${activeStatus ? "active" : ""}`}>
      <div
        className="cart-overlay__close"
        onClick={() => {
          getActiveStatus(false);
          document.querySelector("body").classList.remove("overflow-hidden");
        }}
      />
      <div className="cart-overlay__content">
        {/*=======  close icon  =======*/}
        <button
          className="cart-overlay__close-icon"
          onClick={() => {
            getActiveStatus(false);
            document.querySelector("body").classList.remove("overflow-hidden");
          }}
        >
          <IoIosClose />
        </button>
        {/*=======  offcanvas cart content container  =======*/}
        <div className="cart-overlay__content-container">
          <h3 className="cart-title">Cart</h3>
          {cartItems.length >= 1 ? (
            <div className="cart-product-wrapper">
              <div className="cart-product-container">
                <CustomScroll allowOuterScroll={true}>
                  {cartItems.map((cartItem) => {
                    if (cartItem.discountedPrice) {
                      cartTotalPrice +=
                        cartItem.discountedPrice * cartItem.quantity;
                    } else {
                      cartTotalPrice += cartItem.price * cartItem.quantity;
                    }
                    return (
                      <div
                        className="single-cart-product"
                        key={cartItem.cartItemId}
                      >
                        <span className="cart-close-icon">
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
                        </span>
                        <div className="image">
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
                        </div>
                        <div className="content">
                          <h5>
                            <Link
                              href={`/${cartItem.category}/${cartItem.name}`}
                              as={`${process.env.PUBLIC_URL}/${cartItem.category}/${cartItem.name}`}
                            >
                              <a>{cartItem.displayName}</a>
                            </Link>
                          </h5>
                          {cartItem.selectedProductColor &&
                          cartItem.selectedProductSize ? (
                            <div className="cart-item-variation">
                              <span>
                                Color: {cartItem.selectedProductColor}
                              </span>
                              <span>Size: {cartItem.selectedProductSize}</span>
                            </div>
                          ) : (
                            ""
                          )}
                          <p>
                            <span className="cart-count">
                              {cartItem.quantity} x{" "}
                            </span>{" "}
                            <span className="discounted-price">
                              ${" "}
                              {cartItem.discountedPrice
                                ? Math.round(cartItem.discountedPrice)
                                : Math.round(cartItem.price)}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CustomScroll>
              </div>
              {/*=======  subtotal calculation  =======*/}
              <p className="cart-subtotal">
                <span className="subtotal-title">Subtotal:</span>
                <span className="subtotal-amount">
                  $ {Math.round(cartTotalPrice)}
                </span>
              </p>
              {/*=======  cart buttons  =======*/}
              <div className="cart-buttons">
                <Link
                  href="/other/cart"
                  as={process.env.PUBLIC_URL + "/other/cart"}
                >
                  <a>view cart</a>
                </Link>
                <Link
                  href="/other/checkout"
                  as={process.env.PUBLIC_URL + "/other/checkout"}
                >
                  <a>checkout</a>
                </Link>
              </div>
            </div>
          ) : (
            "No items found in cart"
          )}
        </div>
      </div>
    </div>
  );
};

export default CartOverlay;
