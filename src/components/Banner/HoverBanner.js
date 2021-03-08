import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";

const HoverBanner = ({ spaceBottomClass }) => {
  return (
    <div
      className={`hover-banner-area ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <Container className="wide">
        <Row>
          <Col lg={6} className="space-mb-mobile-only--30">
            <div className="single-banner single-banner--hoverborder">
              <Link
                href="/diy-framing"
                as={process.env.PUBLIC_URL + "/diy-framing"}
              >
                <a className="banner-link" />
              </Link>
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/assets/images/banners/banner-online.jpg"
                }
                className="img-fluid"
                alt=""
              />
              <div className="banner-content banner-content--middle-white banner-content--middle-dark">
                <p>
                  <span className="bold-white">25%</span> off when you
                  <span className="d-block">order online</span>
                </p>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="single-banner single-banner--hoverborder">
              <Link
                href="/special-products/gift-voucher"
                as={process.env.PUBLIC_URL + "/special-products/gift-voucher"}
              >
                <a className="banner-link" />
              </Link>
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/assets/images/banners/banner-delivery.jpg"
                }
                className="img-fluid"
                alt=""
              />
              <div className="banner-content banner-content--black-left">
                <p>
                  <span className="big-text">Gift Vouchers</span>
                  <span className="small-text d-block">
                    Share the convenience of customized framing
                  </span>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HoverBanner;
