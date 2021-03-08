import Link from "next/link";
import Tab from "react-bootstrap/Tab";
import { Container, Row, Col } from "react-bootstrap";
import { IoIosAdd } from "react-icons/io";
import { ProductGridWrapper } from "../ProductThumb";

const ProductTab = ({ featuredProducts, quickView }) => {
  return (
    <div className="product-tab product-tab--style2 space-mb--r100">
      <Container>
        <Tab.Container defaultActiveKey="popular">
          <Tab.Content>
            <Tab.Pane eventKey="popular">
              <Row>
                <ProductGridWrapper
                  column={4}
                  products={featuredProducts}
                  bottomSpace="space-mb--r50"
                  quickView={quickView}
                />
              </Row>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
        <Row>
          <Col lg={12} className="text-center">
            <Link
              href="/diy-framing/SQohA1N0Z"
              as={process.env.PUBLIC_URL + "/diy-framing/SQohA1N0Z"}
            >
              <a className="lezada-button lezada-button--medium lezada-button--icon--left">
                <IoIosAdd />
                Start Framing
              </a>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductTab;
