import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { Layout } from "../../components/Layout";
import { Breadcrumb } from "../../components/Breadcrumb";
import { useEffect } from "react";
import { useCart } from '../../contexts/CartContext'
import {useRouter} from "next/router";

const OrderTracking = () => {

  const { resetCart } = useCart()
  const router = useRouter();

  useEffect(() => {
    resetCart()
  }, [])

  return (
    <Layout>
      {/* breadcrumb */}
      <Breadcrumb
        pageTitle="Order Confirmed"
        backgroundImage="/assets/images/backgrounds/order-confirm-background.jpg"
      >
      </Breadcrumb>
      <div className="order-tracking-area space-mt--r130 space-mb--r130">
        <Container>
          <Row>
            <Col lg={6} md={10} className="ml-auto mr-auto">
              <div className="order-tracking-box">
                <h3 className="space-mb--15">Thank you!</h3>
                <p className="info-text space-mb--20">
                  A confirmation has been sent to your email including details of your purchase.
                </p>
                <div className="single-input-item space-mt--30">
                  <button className="lezada-button lezada-button--small" onClick={() => router.push("/")}>
                    BACK TO HOMEPAGE
                  </button>
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
