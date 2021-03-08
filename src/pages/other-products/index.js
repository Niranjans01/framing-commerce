import { useState, useEffect } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { Layout } from "../../components/Layout";
import { Breadcrumb } from "../../components/Breadcrumb";
import { ShopProducts } from "../../components/Shop";
import productService from '../../services/ProductService2'
import { otherProductsOrder } from "../../components/Header/elements/nav-order";

const NoSidebar = () => {
  const [ products, setProducts ] = useState([])
  const [layout, setLayout] = useState("grid three-column");

  const category = 'other-products'

  const getLayout = (layout) => {
    setLayout(layout);
  };

  useEffect(() => {
    productService.find({category: "other-products"}).then((prods => {
      setProducts(prods.sort(
        (a, b) =>
          otherProductsOrder.indexOf(a.displayName) - otherProductsOrder.indexOf(b.displayName)
      ));
    }));
  }, [])

  return (
    <Layout>
      <Breadcrumb
        pageTitle="Other Products"
        backgroundImage="/assets/images/backgrounds/canvas.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Other Products</li>
        </ul>
      </Breadcrumb>
      <div className="shop-page-content">
        {/* shop page header */}

        <div className="shop-page-content__body space-mt--r130 space-mb--r130">
          <Container>
            <Row>
              <Col>
                {/* shop products */}
                <ShopProducts
                  layout={layout}
                  products={products}
                  category={category}
                />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </Layout>
  );
};

export default NoSidebar;
