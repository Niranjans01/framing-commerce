import { useState, Fragment, useEffect } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import CustomScroll from "react-custom-scroll";
import { useCart } from "../../contexts/CartContext";
import { useToasts } from "react-toast-notifications";
import { getDiscountPrice } from "../../lib/product-utilities";
import { SideBySideMagnifier } from "react-image-magnifiers";
import Link from "next/link";
import Swiper from "react-id-swiper";

const ProductModal = (props) => {
  const { product, discountedprice, productprice, portfolio } = props;

  const [price, setPrice] = useState(productprice);
  const [discountPrice, setDiscountPrice] = useState(discountedprice);

  const [variant, setVariant] = useState(
    product.variants ? product.variants[0] : {}
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    product.variation ? product.variation[0].size[0].name : ""
  );
  const [productStock, setProductStock] = useState(
    product.variation ? product.variation[0].size[0].stock : product.stock
  );
  const [quantityCount, setQuantityCount] = useState(1);
  const { addToCart } = useCart();
  const { addToast } = useToasts();

  if (product.image) {
    product.images = [{ url: product.image }];
  }

  const gallerySwiperParams = {
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  };

  const addMirrorToCart = () => {
    addToCart(
      {
        ...product,
        variant,
        quantity: 1,
        discountedPrice: discountPrice,
        price: price,
      },
      product.id + variant.name
    );

    addToast("Added To Cart", { appearance: "success", autoDismiss: true });
  };

  const onVariantChange = (v) => {
    setVariant(product.variants.find((e) => e.name === v.target.value));
  };

  useEffect(() => {
    if (variant) {
      setPrice(variant.price);
      setDiscountPrice(getDiscountPrice(variant.price, product.discount));
    }
  }, [variant]);
  // console.log('product --->', product);
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      className="product-quickview"
      centered
    >
      <Modal.Body>
        <Modal.Header closeButton></Modal.Header>
        <div className="product-quickview__image-wrapper">
          {product.images &&
          !portfolio &&
          Array.isArray(product.images) &&
          product.images.length > 1 ? (
            <Swiper containerClass="swiper-container" {...gallerySwiperParams}>
              {product.images.map((single, key) => {
                return (
                  <div className="single-image" key={key}>
                    <img src={typeof single.url == "string" ? single.url : single.url.url} className="img-fluid" alt="" />
                  </div>
                );
              })}
            </Swiper>
          ) : (
            <>
              {product.images.map((single, key) => {
                return (
                  <div className="single-image" key={key}>
                    <SideBySideMagnifier
                      className="img-fluid"
                      imageSrc={typeof single.url == "string" ? single.url : single.url.url}
                      imageAlt={product.displayName}
                    />
                  </div>
                );
              })}
            </>
          )}

          {/* {portfolio && (
            <div className="single-image">
              <SideBySideMagnifier
                className="img-fluid"
                imageSrc={product.image.url}
                imageAlt={product.displayName}
              />
            </div>
          )} */}
        </div>
        <Row>
          <Col md={7} sm={12} className="ml-auto">
            <CustomScroll allowOuterScroll={true}>
              <div className="product-quickview__content">
                <h2 className="product-quickview__title space-mb--20">
                  {product.displayName}
                </h2>
                {price && discountPrice ? (
                  <div className="product-quickview__price space-mb--20">
                    {product.discount > 0 ? (
                      <Fragment>
                        <span className="main-price discounted">${Math.round(price)}</span>
                        <span className="main-price">${Math.round(discountPrice)}</span>
                      </Fragment>
                    ) : (
                      <span className="main-price">${Math.round(price)} </span>
                    )}
                  </div>
                ) : (
                  ""
                )}
                <div className="product-quickview__description space-mb--30">
                  <p>{product.description}</p>
                </div>

                {product.slug ||
                product.category === "diy-framing" ||
                product.category === "other-products" ? (
                  <div className="product-quickview__quality">
                    <div className="product-quickview__cart btn-hover">
                      <Link
                        href={`/${product.category}/${product.id}`}
                        as={
                          process.env.PUBLIC_URL +
                          `/${product.category}/${product.id}`
                        }
                      >
                        <a>
                          <button
                            rel="noopener noreferrer"
                            target="_blank"
                            className="lezada-button lezada-button--medium"
                          >
                            See more
                          </button>
                        </a>
                      </Link>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {product.category === "mirror-shop" ||
                product.category === "display-boxes" ||
                product.category === "certificate-shop" ? (
                  <div>
                    <div className="product-quickview__size-color">
                      <div className="product-quickview__size space-mb--20">
                        <div className="product-quickview__size__title">
                          Size
                        </div>
                        <div className="product-quickview__size__content">
                          <div className="product-details__filter-icons__dropdown-wrapper modal__dropdown">
                            <select onChange={(v) => onVariantChange(v)}>
                              {product.variants?.map((v) => (
                                <option value={v.name} key={v.name}>
                                  {v.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="product-quickview__button-wrapper d-flex align-items-center">
                      <button
                        onClick={addMirrorToCart}
                        className="lezada-button lezada-button--medium product-quickview__cart space-mr--10"
                      >
                        Add To Cart
                      </button>
                    </div>
                  </div>
                ) : null}
                {/* ) : ( }
                  <Fragment>
                    <div className="product-quickview__quantity space-mb--20">
                      <div className="product-quickview__quantity__title">
                        Quantity
                      </div>
                      <div className="cart-plus-minus">
                        <button }
                          onClick={() =>
                            setQuantityCount(
                              quantityCount > 1 ? quantityCount - 1 : 1
                            )
                          }
                          className="qtybutton"
                        >
                          -
                        </button>
                        <input
                          className="cart-plus-minus-box"
                          type="text"
                          value={quantityCount}
                          readOnly
                        />
                        <button
                          onClick={() =>
                            setQuantityCount(
                              quantityCount < productStock - productCartQty
                                ? quantityCount + 1
                                : quantityCount
                            )
                          }
                          className="qtybutton"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="product-quickview__button-wrapper d-flex align-items-center">
                      {productStock && productStock > 0 ? (
                        <button
                          onClick={() =>
                            addtocart(
                              product,
                              addtoast,
                              quantityCount,
                              selectedProductColor,
                              selectedProductSize
                            )
                          }
                          disabled={productCartQty >= productStock}
                          className="lezada-button lezada-button--medium product-quickview__cart space-mr--10"
                        >
                          Add To Cart
                        </button>
                      ) : (
                        <button
                          className="lezada-button lezada-button--medium product-quickview__ofs space-mr--10"
                          disabled
                        >
                          Out of Stock
                        </button>
                      )}
                  </div>
                  </Fragment>
                )} */}
              </div>
            </CustomScroll>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ProductModal;
