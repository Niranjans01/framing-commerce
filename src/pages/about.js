import { useState } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF } from 'react-icons/fa'
import { Layout } from "../components/Layout";
import { Breadcrumb } from "../components/Breadcrumb";
import { TestimonialTwo } from "../components/Testimonial";
import { BrandLogo } from "../components/BrandLogo";
import fromTheOwner from "../data/testimonials/from-the-owner.json";
import brandLogoData from "../data/brand-logos/brand-logo-one.json";

const About = () => {
  const [modalStatus, isOpen] = useState(false);

  return (
    <Layout>
      {/* breadcrumb */}
      <Breadcrumb
        pageTitle="About"
        backgroundImage="/assets/images/backgrounds/about-background.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>About</li>
        </ul>
      </Breadcrumb>
      {/* about content */}
      <div className="about-content space-mt--r130 space-mb--r130">
        <div className="section-title-container space-mb--40">
          <Container>
            <Row>
              <Col lg={8} className="ml-auto mr-auto">
                {/* section title */}
                <div className="about-title-container text-center">
                  <p className="dark-title space-mb--35">
                    ABOUT MASTER FRAMING
                  </p>
                  <h2 className="title space-mb--15">Australia Grown</h2>
                  <p className="title-text">
                  {/* "Best price, Great Service, Creative Advice, in order to offer you everything you need in framing" */}
                    Since its inception in 2000 as a family owned and operated business, we have grown into one of the most competitive picture framers in New South Wales. We pride ourselves on having a remarkable range of Framing Solutions along with unbeatable service and expert advice. We provide a framing service that is fast, efficient and cost effective using all materials that are of the highest quality and acid free. Our ability to build and finish our own frames creates options that you may never have considered.
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        {/* about video content */}
        <div className="about-video-content space-mb--r100">
          <Container>
            <Row>
              <Col lg={10} className="ml-auto mr-auto">
                <Row>
                  <Col md={6}>
                    <div className="about-widget space-mb--35">
                      <h2 className="widget-title space-mb--25">
                        HEADQUARTERS
                      </h2>
                      <p className="widget-content">
                        797 Elizabeth St, Zetland NSW 2017
                      </p>
                    </div>
                    <div className="about-widget space-mb--35">
                      <h2 className="widget-title space-mb--25">PHONE</h2>
                      <p className="widget-content">
                        <span>Phone: (02) 9697 2008</span>
                      </p>
                    </div>
                    <div className="about-widget space-mb--35">
                      <h2 className="widget-title space-mb--25">EMAIL</h2>
                      <p className="widget-content">
                        <a href="mailto:framers@masterframing.com.au">framers@masterframing</a>
                      </p>
                    </div>
                    <div className="about-widget">
                      <h2 className="widget-title space-mb--25">SOCIAL MEDIA</h2>
                      <div className="social-widget">
                        <a href="https://www.facebook.com/MasterFramingAustralia">
                          <FaFacebookF />
                        </a>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="about-page-text">
                      <p className="space-mb--35">
                        Further to our picture framing, we also offer framing football jumpers and memoriailia, canvas stretching, acrylic photo mounting, mirrors, art mounts, white boards, cork boards, printing, display boxes. Our framing expertise has enabled us to have amongst our clients several Galleries and Art Auction businesses.
                      </p>
                      <p className="space-mb--35">
                        We have invested extensively in technology to ensure we remain one of the top framing companies in New South Wales.
                      </p>
                      <p className="space-mb--35">
                        We are available to our customers anytime, day or night
                      </p>
                      <Link
                        href="/shop/left-sidebar"
                        as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                      >
                        <a className="lezada-button lezada-button--medium lezada-button--icon--left">
                          shop now
                        </a>
                      </Link>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </div>
        {/* testimonial */}
        <TestimonialTwo
          testimonialData={fromTheOwner}
        />
        <div className="space-mb--r100"></div>
        {/* brand logo */}
        {/* <BrandLogo brandLogoData={brandLogoData} /> */}
      </div>
    </Layout>
  );
};

export default About;
