import { useState, useEffect } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { IoIosArrowRoundUp } from "react-icons/io";
import { animateScroll } from "react-scroll";
import { SubscribeEmailTwo } from "../Newsletter";
import { useUser } from "../../contexts/AccountContext";

const Footer = () => {
  const [scroll, setScroll] = useState(0);
  const [top, setTop] = useState(0);
  const { user } = useUser();

  useEffect(() => {
    setTop(100);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    animateScroll.scrollToTop();
  };

  const handleScroll = () => {
    setScroll(window.scrollY);
  };
  return (
    <footer className="bg-color--grey space-pt--100 space-pb--50">
      <Container className="wide">
        <Row>
          <Col className="footer-single-widget space-mb--50">
            {/* logo */}
            {/* <div className="logo space-mb--35">
              <img
                src={process.env.PUBLIC_URL + "/assets/images/logo.jpg"}
                className="img-fluid"
                alt=""
              />
            </div> */}

            {/*=======  copyright text  =======*/}
            <div className="footer-single-widget__copyright">
              &copy; {new Date().getFullYear() + " "}
              <a href="http://masterframing.com.au/" target="_blank">
                masterframing
              </a>
              <span>All Rights Reserved</span>
            </div>
          </Col>

          <Col className="footer-single-widget space-mb--50">
            <h5 className="footer-single-widget__title">ABOUT</h5>
            <nav className="footer-single-widget__nav">
              <ul>
                <li>
                  <Link href="/about" as={process.env.PUBLIC_URL + "/about"}>
                    <a>About Us</a>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    as={process.env.PUBLIC_URL + "/contact#locations"}
                  >
                    <a>Store Locations</a>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    as={process.env.PUBLIC_URL + "/contact"}
                  >
                    <a>Contact Us</a>
                  </Link>
                </li>
              </ul>
            </nav>
          </Col>

          <Col className="footer-single-widget space-mb--50">
            <h5 className="footer-single-widget__title">USEFUL LINKS</h5>
            <nav className="footer-single-widget__nav">
              <ul>
                <li>
                  <Link
                    href="/terms-conditions"
                    as={process.env.PUBLIC_URL + "/terms-conditions"}
                  >
                    <a>Terms & Conditions</a>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policy-terms"
                    as={process.env.PUBLIC_URL + "/policy-terms"}
                  >
                    <a>Privacy Policy</a>
                  </Link>
                </li>
                <li>
                  <Link href="/faq" as={process.env.PUBLIC_URL + "/faq"}>
                    <a>FAQ</a>
                  </Link>
                </li>
              </ul>
            </nav>
          </Col>

          <Col className="footer-single-widget space-mb--50">
            <h5 className="footer-single-widget__title">FOLLOW US ON</h5>
            <nav className="footer-single-widget__nav footer-single-widget__nav--social">
              <ul>
                {/* <li>
                  <a href="https://www.twitter.com">
                    <FaTwitter /> Twitter
                  </a>
                </li> */}
                <li>
                  <a href="https://www.facebook.com/MasterFramingAustralia">
                    <FaFacebookF /> Facebook
                  </a>
                </li>
                {/* <li>
                  <a href="https://www.instagram.com">
                    <FaInstagram /> Instagram
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com">
                    <FaYoutube /> Youtube
                  </a>
                </li> */}
              </ul>
            </nav>
          </Col>

          {user ? (
            <Col className="footer-single-widget space-mb--50">
              <div className="footer-subscribe-widget space-mb--30">
                <h2 className="footer-subscribe-widget__title">Subscribe.</h2>
                <p className="footer-subscribe-widget__subtitle">
                  Subscribe to our newsletter to receive news on update.
                </p>
                {/* email subscription */}
                <SubscribeEmailTwo mailchimpUrl="https://devitems.us11.list-manage.com/subscribe/post?u=6bbb9b6f5827bd842d9640c82&amp;id=05d85f18ef" />
              </div>
              <div className="payment-icon text-right text-md-right space-mb--30">
                <img
                  src={process.env.PUBLIC_URL + "/assets/images/icon/pay.png"}
                  className="img-fluid"
                  alt=""
                />
                <img
                  src={
                    process.env.PUBLIC_URL + "/assets/images/icon/afterpay.png"
                  }
                  className="img-fluid"
                  alt=""
                />
              </div>
            </Col>
          ) : null}
        </Row>
      </Container>
      <button
        className={`scroll-top ${scroll > top ? "show" : ""}`}
        onClick={() => scrollToTop()}
      >
        <IoIosArrowRoundUp />
      </button>
    </footer>
  );
};

export default Footer;
