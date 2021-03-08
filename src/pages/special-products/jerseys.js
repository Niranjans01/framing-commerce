import { useState, useEffect } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { Layout } from "../../components/Layout";
import { Breadcrumb } from "../../components/Breadcrumb";
import { getSortedProducts } from "../../lib/product-utilities";
import { ShopProducts } from "../../components/Shop";
import staticProducts from "../../data/static-products.json";

const NoSidebar = () => {
  const [layout, setLayout] = useState("grid four-column");
  const [currentData, setCurrentData] = useState([]);

  const getLayout = (layout) => {
    setLayout(layout);
  };

  useEffect(() => {
    let p = getSortedProducts(staticProducts, "name", "memorabilias");
    setCurrentData(p);
  }, []);

  return (
    <Layout>
      {/* breadcrumb */}
      <Breadcrumb
        pageTitle="Jerseys"
        backgroundImage="/assets/images/backgrounds/jerseys.jpg"
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

          <li>Jerseys</li>
        </ul>
      </Breadcrumb>
      <div className="shop-page-content">
        {/* shop page body */}
        <div className="shop-page-content__body space-mt--r130 space-mb--r130">
          <Container>
            <Row>
              <Col>
                <span>
                  Have something you want framed? Want to immortalise that
                  special item?{" "}
                  <a href="/contact" target="_blank">
                    <u>Contact us</u>
                  </a>{" "}
                  and let's make it happen.
                </span>
                {/* shop products */}
                <div className="space-mt--50">
                  <ShopProducts
                    layout={layout}
                    products={currentData}
                    isStatic={true}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </Layout>
  );
};

export default NoSidebar;
