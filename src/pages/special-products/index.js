import { useState, useEffect } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { Breadcrumb } from "../../components/Breadcrumb";
import { getSortedProducts } from "../../lib/product-utilities";
import { ShopProducts } from "../../components/Shop";
import staticCategories from "../../data/static-categories.json";
import { Layout } from '../../components/Layout'

const NoSidebar = () => {
  const [layout, setLayout] = useState("grid three-column");
  const [sortType, setSortType] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [currentData, setCurrentData] = useState([]);

  useEffect(() => {
    let categories = getSortedProducts(staticCategories, "category", "special-products")
    setCurrentData(categories);
  }, [staticCategories, sortType, sortValue]);

  return (
    <Layout>
      {/* breadcrumb */}
      <Breadcrumb
        pageTitle="Special Products"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-1.png"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Special Products</li>
        </ul>
      </Breadcrumb>
      <div className="shop-page-content">

        <div className="shop-page-content__body space-mt--r130 space-mb--r130">
          <Container>
            <Row>
              <Col>
                {/* shop products */}
                <ShopProducts
                  layout={layout}
                  category={"special-products"}
                  products={currentData}
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
