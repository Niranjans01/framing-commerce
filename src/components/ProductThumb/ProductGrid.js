import { Fragment, useState , useEffect} from "react";
import { Col } from "react-bootstrap";
import Link from "next/link";
import { IoIosSearch } from "react-icons/io";
import { Tooltip } from "react-tippy";
import ProductModal from "./ProductModal";

const ProductGrid = ({
  product,
  cartItem,
  bottomSpace,
  addToCart,
  addToast,
  column,
  quickView = true
}) => {
  const [modalShow, setModalShow] = useState(false);
  const [correctImage, setCorrectImage] = useState(null)

  let findDefault = (images,defaultImg) => {
    let correct = images.find(e=>{
      return e.id === defaultImg
    })
    return correct.url
  }
  useEffect(() => {
    if(product.images && product.defaultImg){
      let correct = product.images.find(e=>{
        return e.id === product.defaultImg
      })
      setCorrectImage(correct.url)
    }
    else{
      setCorrectImage(null)
    }
  }, []);
  return (
    <Fragment>
      <Col
        lg={column && column === 4 ? 3 : 4}
        md={6}
        className={bottomSpace ? bottomSpace : ""}
      >
        <div className="product-grid">
          {/*=======  single product image  =======*/}
          <div className="product-grid__image">
            <div className="img_container">
              <Link
                href={
                  product.category === "certificate-shop" ||
                  product.category === "mirror-shop"
                    ? `/${product.category}`
                    : product.category === "special-products"
                    ? `/${
                        product.category
                      }/${product.displayName.toLowerCase()}`
                    : `/${product.category}/${product.id}`
                }
                as={
                  process.env.PUBLIC_URL + product.category ===
                    "certificate-shop" || product.category === "mirror-shop"
                    ? `/${product.category}`
                    : product.category === "special-products"
                    ? `/${
                        product.category
                      }/${product.displayName.toLowerCase()}`
                    : `/${product.category}/${product.id}`
                }
              >
                <a className="image-wrap">
                  {product.images?.length ? (
                    <img
                      src={product.defaultImg? findDefault(product.images,product.defaultImg) : product.images[0].url}
                      className="img-fluid"
                      alt={product.displayName}
                    />
                  ) : null}
                </a>
              </Link>
            </div>
            <div className="product-grid__floating-badges">
              {product.discount && product.discount > 0 ? (
                <span className="onsale">-{product.discount}%</span>
              ) : (
                ""
              )}
              {product.new ? <span className="hot">New</span> : ""}
            </div>
            {quickView ? (
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
            ) : null}
          </div>

          {/*=======  single product content  =======*/}
          <div className="product-grid__content">
            <div className="title">
              <h3>
                <Link
                  href={
                    product.category === "certificate-shop" ||
                    product.category === "mirror-shop"
                      ? `/${product.category}`
                      : product.category === "special-products"
                      ? `/${
                          product.category
                        }/${product.displayName.toLowerCase()}`
                      : `/${product.category}/${product.id}`
                  }
                  as={
                    process.env.PUBLIC_URL + product.category ===
                      "certificate-shop" || product.category === "mirror-shop"
                      ? `/${product.category}`
                      : product.category === "special-products"
                      ? `/${
                          product.category
                        }/${product.displayName.toLowerCase()}`
                      : `/${product.category}/${product.id}`
                  }
                >
                  <a>{product.displayName}</a>
                </Link>
              </h3>
              {/* add to cart */}
              <Link
                href={
                  product.category === "certificate-shop" ||
                  product.category === "mirror-shop"
                    ? `/${product.category}`
                    : product.category === "special-products"
                    ? `/${
                        product.category
                      }/${product.displayName.toLowerCase()}`
                    : `/${product.category}/${product.id}`
                }
                as={
                  process.env.PUBLIC_URL + product.category ===
                    "certificate-shop" || product.category === "mirror-shop"
                    ? `/${product.category}`
                    : product.category === "special-products"
                    ? `/${
                        product.category
                      }/${product.displayName.toLowerCase()}`
                    : `/${product.category}/${product.id}`
                }
              >
                <a className="lezada-loadmore-button">
                  Shop {product.displayName}
                </a>
              </Link>
            </div>
          </div>
        </div>
      </Col>
      {/* product modal */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        cartitem={cartItem}
        addtocart={addToCart}
        addtoast={addToast}
      />
    </Fragment>
  );
};

export default ProductGrid;
