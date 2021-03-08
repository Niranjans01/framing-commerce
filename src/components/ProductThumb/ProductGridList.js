import { Fragment, useState, useEffect } from "react";
import { Col } from "react-bootstrap";
import Link from "next/link";
import { IoIosSearch } from "react-icons/io";
import { Tooltip } from "react-tippy";
import ProductModal from "./ProductModal";

const ProductGridList = ({
  product,
  discountedPrice,
  productPrice,
  bottomSpace,
  category,
  isStatic,
  portfolio,
  isPopup = false,
}) => {
  const [modalShow, setModalShow] = useState(false);
  const [minPrice, setMinPrice] = useState(discountedPrice || productPrice);
  const [correctImage, setCorrectImage] = useState(null)

  useEffect(() => {
    if (product && !minPrice && product?.variants) {
      setMinPrice(Math.min(...product?.variants.map((e) => e?.price)));
    }
    if(product.images && product.defaultImg){
      let correct = product.images.find(e=>{
        return e.id === product.defaultImg
      })
      setCorrectImage(correct.url)
    }
    else{
      setCorrectImage(null)
    }
  }, [product]);

  return (
    <Fragment>
      <Col lg={3} md={6} className={bottomSpace ? bottomSpace : ""}>
        {product ? (
          <div className="product-grid">
            {/*=======  single product image  =======*/}
            <div
              className="product-grid__image"
              onClick={() => setModalShow(true)}
            >
              <div className="img_container">
                {isPopup ? (
                  <div className="image-wrap">
                    {!portfolio && product.images?.length ? (
                      <img
                        src={correctImage? correctImage: product.images[0].url}
                        className="img-fluid"
                        alt={product.displayName}
                      />
                    ) : product.image ? (
                      <img
                        src={product.image.url}
                        className="img-fluid"
                        alt={product.displayName}
                      />
                    ) : null}
                  </div>
                ) : isStatic ? (
                  product.image ? (
                    <img
                      src={product.image}
                      className="img-fluid"
                      alt={product.displayName}
                    />
                  ) : product.images?.length ? (
                    <img
                      src={correctImage? correctImage: product.images[0].url}
                      className="img-fluid"
                      alt={product.displayName}
                    />
                  ) : null
                ) : (
                  <Link
                    href={`/${category}/${product.id}`}
                    as={process.env.PUBLIC_URL + `/${category}/` + product.id}
                  >
                    <a
                      className={
                        portfolio ? "image-wrap disabled-link" : "image-wrap"
                      }
                    >
                      { product.image ? (
                          <img
                            src={product.image}
                            className="img-fluid"
                            alt={product.displayName}
                          />
                        ) : product.images?.length ? (
                        <img
                          src={correctImage? correctImage: product.images[0].url}
                          className="img-fluid"
                          alt={product.displayName}
                        />
                      ) : null}
                    </a>
                  </Link>
                )}
              </div>
              {portfolio || isStatic ? (
                ""
              ) : (
                <div>
                  <div className="product-grid__floating-badges">
                    {product.discount && product.discount > 0 ? (
                      <span className="onsale">-{product.discount}%</span>
                    ) : (
                      ""
                    )}
                    {product.new ? <span className="hot">New</span> : ""}
                  </div>
                  <div className="product-grid__floating-icons">
                    {/* quick view */}
                    <Tooltip
                      title="Quick view"
                      position="left"
                      trigger="mouseenter"
                      animation="shift"
                      arrow={true}
                      duration={200}
                    >
                      <button
                        onClick={() => setModalShow(true)}
                        className="d-none d-lg-block"
                      >
                        <IoIosSearch />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>

            {/*=======  single product content  =======*/}
            {portfolio ? (
              <div className="product-grid__content">
                <div className="title">
                  {/* <h3>
                    <a>{product.displayName}</a>
                  </h3> */}
                  <a
                    className="lezada-loadmore-button"
                    onClick={() => setModalShow(true)}
                  >
                    See More
                  </a>
                </div>
              </div>
            ) : isStatic ? (
              <div className="product-grid__content">
                <div className="title">
                  <h3>
                    <span> {product.displayName}</span>
                  </h3>
                  {product.price ? (
                    <h3 className="box-price">
                      <b> $ {product.price.toFixed(2)}</b>
                    </h3>
                  ) : null}
                  {isPopup ? (
                    <a
                      className="lezada-loadmore-button"
                      onClick={() => setModalShow(true)}
                    >
                      See More
                    </a>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ) : (
              <div className="product-grid__content">
                <div className="title">
                  <h3>
                    <Link
                      href={`/${category}/[slug]?slug=${product.id}`}
                      as={process.env.PUBLIC_URL + `/${category}/` + product.id}
                    >
                      <a>{product.displayName}</a>
                    </Link>
                  </h3>
                  {isPopup ? (
                    <a
                      className="lezada-loadmore-button"
                      onClick={() => setModalShow(true)}
                    >
                      See More
                    </a>
                  ) : (
                    <Link
                      href={`/${category}/[slug]?slug=${product.id}`}
                      as={process.env.PUBLIC_URL + `/${category}/` + product.id}
                    >
                      <a className="lezada-loadmore-button">See More</a>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          ""
        )}

        {product ? (
          <div className="product-list">
            {/*=======  single product image  =======*/}
            <div className="product-list__image mx-auto my-auto">
              <div className="img_container">
                <Link
                  href={`/${category}/${product.id}`}
                  as={process.env.PUBLIC_URL + `/${category}/` + product.id}
                >
                  <a
                    className={
                      portfolio ? "image-wrap disabled-link" : "image-wrap"
                    }
                  >
                    {product.images?.length ? (
                      <img
                        src={correctImage? correctImage: product.images[0].url}
                        className="img-fluid"
                        alt={product.displayName}
                      />
                    ) : null}
                  </a>
                </Link>
              </div>
              {portfolio || isStatic ? (
                ""
              ) : (
                <div>
                  <div className="product-list__floating-badges">
                    {product.discount && product.discount > 0 ? (
                      <span className="onsale">-{product.discount}%</span>
                    ) : (
                      ""
                    )}
                    {product.new ? <span className="hot">New</span> : ""}
                  </div>
                  <div className="product-list__floating-icons">
                    {/* quick view */}
                    <Tooltip
                      title="Quick view"
                      position="left"
                      trigger="mouseenter"
                      animation="shift"
                      arrow={true}
                      duration={200}
                    >
                      <button
                        onClick={() => setModalShow(true)}
                        className="d-none d-lg-block"
                      >
                        <IoIosSearch />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>

            {/*=======  single product content  =======*/}
            {portfolio ? (
              ""
            ) : (
              <div className="product-list__content">
                <div className="title">
                  <h3>
                    {isPopup ? (
                      <a onClick={() => setModalShow(true)}>
                        {product.displayName}
                      </a>
                    ) : (
                      <Link
                        href={`/${category}/${product.id}`}
                        as={
                          process.env.PUBLIC_URL + `/${category}/` + product.id
                        }
                      >
                        <a>{product.displayName}</a>
                      </Link>
                    )}
                  </h3>
                </div>
                {isStatic ? (
                  ""
                ) : (
                  <div className="price">
                    {product.discount > 0 ? (
                      <Fragment>
                        <span className="main-price discounted">
                          ${productPrice}
                        </span>
                        <span className="discounted-price">
                          ${discountedPrice}
                        </span>
                      </Fragment>
                    ) : (
                      <span className="main-price">
                        Starts from ${minPrice}
                      </span>
                    )}
                  </div>
                )}

                <div className="short-description">
                  {product.shortDescription}
                </div>
              </div>
            )}
          </div>
        ) : (
          ""
        )}
      </Col>
      {/* product modal */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        portfolio={portfolio}
      />
    </Fragment>
  );
};

export default ProductGridList;
