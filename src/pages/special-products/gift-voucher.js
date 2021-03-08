import { useEffect, useState } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import StickyBox from "react-sticky-box";
import { Layout } from "../../components/Layout";
import { Breadcrumb } from "../../components/Breadcrumb";
import staticProducts from "../../data/static-products.json";
import { getSortedProducts } from "../../lib/product-utilities";
import { GiftVoucher } from "../../components/Product";

import {
  ImageGalleryDefault,
  ProductDescription,
  ProductDescriptionTab,
} from "../../components/ProductDetails";
import { ProductProvider } from "../../contexts/ProductContext";

const ProductBasic = () => {
  const [product, setProduct] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let p = getSortedProducts(staticProducts, "name", "gift-voucher")[0];
    setProduct(p);
  }, []);

  return (
    <Layout>
      {/* breadcrumb */}
      <Breadcrumb
        pageTitle={"Gift Vouchers"}
        backgroundImage="/assets/images/backgrounds/banner_gift_box.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link
              href="/special-products"
              as={process.env.PUBLIC_URL + "/special-products"}
            >
              <a>Special Products</a>
            </Link>
          </li>
          <li>Gift Voucher</li>
        </ul>
      </Breadcrumb>

      {/* product details */}
      {product ? (
        <ProductProvider product={product}>
          <div className="product-details space-mt--r100 space-mb--r100">
            <Container>
              <Row className="bg-grey">
                {/* image gallery bottom thumb */}
                <Col lg={6} className="space-mb-mobile-only--50 mr-top-20">
                  <StickyBox offsetTop={90} offsetBottom={90}>
                    <ImageGalleryDefault />
                  </StickyBox>
                </Col>

                <Col lg={6}  className="mr-top-20">
                  <GiftVoucher setIsError={setIsError} />
                  <ProductDescription disableAction={isError} />
                </Col>
              </Row>
              <Row>
                <Col>
                  {/* product description tab */}
                  <ProductDescriptionTab />
                </Col>
              </Row>
            </Container>
          </div>
        </ProductProvider>
      ) : (
        ""
      )}
    </Layout>
  );
};

export default ProductBasic;
