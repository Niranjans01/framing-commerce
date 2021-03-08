import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { Layout } from "../../components/Layout";
import { Breadcrumb } from "../../components/Breadcrumb";

const OrderTracking = () => {
  return (
    <Layout>
      <Breadcrumb
        pageTitle="Payment Failed."
        backgroundImage="/assets/images/backgrounds/order-confirm-background.jpg"
      ></Breadcrumb>
      <div className="order-tracking-area space-mt--r130 space-mb--r130">
        <Container>
          <Row>
            <Col lg={6} md={10} className="ml-auto mr-auto">
              <div className="order-tracking-box">
                <h3 className="space-mb--15">Payment Failed.</h3>
                <p className="info-text space-mb--20">
                  There was some problem with payment. Please try again.
                </p>
                <div className="single-input-item space-mt--30">
                  <Link href="/other/checkout">
                    <a>
                      <button className="lezada-button lezada-button--small">
                        BACK TO CHECKOUT
                      </button>
                    </a>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Layout>
  );
};

export default OrderTracking;
