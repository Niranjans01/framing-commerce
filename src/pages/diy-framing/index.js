import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { Layout } from "../../components/Layout";
import { Breadcrumb } from "../../components/Breadcrumb";
import { ShopProducts } from "../../components/Shop";
import productService from '../../services/ProductService2'
import { diyOrder } from "../../components/Header/elements/nav-order";

const NoSidebar = () => {
  const [ products, setProducts ] = useState([])
  const [layout, setLayout] = useState("grid four-column");

  const category = 'diy-framing'

  const getLayout = (layout) => {
    setLayout(layout);
  };

  useEffect(() => {
    productService.find({category: "diy-framing"}).then((prods => {
      setProducts(prods.sort(
        (a, b) =>
          diyOrder.indexOf(a.displayName) - diyOrder.indexOf(b.displayName)
      ));
    }));
  }, [])

  return (
    <Layout>
      {/* breadcrumb */}
      <Breadcrumb
        pageTitle="DIY Framing"
        backgroundImage="/assets/images/backgrounds/frames.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>DIY Framing</li>
        </ul>
      </Breadcrumb>
      <div className="shop-page-content">
        {/* shop page header */}

        <div className="shop-page-content__body space-mt--r130 space-mb--r130">
          <Container>
            <Row>
              <Col>
                {/* shop products */}
                <ShopProducts layout={layout} products={products} category={category} />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </Layout>
  );
};

export default NoSidebar;
