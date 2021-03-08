import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { Layout } from "../components/Layout";
import { Breadcrumb } from "../components/Breadcrumb";

const terms = () => {
  return (
    <Layout>
      {/* breadcrumb */}
      <Breadcrumb
        pageTitle="MASTERFRAMING"
        backgroundImage="/assets/images/backgrounds/terms_and_conditions.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Terms & Conditions</li>

        </ul>
      </Breadcrumb>
      <div className="element-wrapper space-mt--r130 space-mb--r130">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="faq-wrapper">
                <div className="single-faq space-mb--r100">
                  <div className="about-title-container text-center">
                    <h2 className="faq-title space-mb--20">
                      Welcome to MasterFraming
                    </h2>
                  </div>
                  <Card className="single-my-account space-mb--20">
                    <Card.Header className="panel-heading"></Card.Header>
                    <Card.Body>
                      <p className="single-my-account space-mb--20">
                        These terms of service outline the rules and regulations
                        for the use of MasterFraming's Website.
                      </p>
                    </Card.Body>
                  </Card>

                  <Card className="single-my-account space-mb--20">
                    <Card.Header className="panel-heading">
                      <h4 className="panel-title">
                        MasterFraming is located at:
                      </h4>
                    </Card.Header>

                    <Card.Body>
                      <p className="single-my-account space-mb--20">
                        797 Elizabeth St. Zetland, Sydney
                      </p>
                      <p className="single-my-account space-mb--20">
                        2017 - NSW , Australia
                      </p>
                    </Card.Body>
                  </Card>

                  <Card className="single-my-account space-mb--20">
                    <Card.Header className="panel-heading">
                      <h4 className="panel-title">Introduction</h4>
                    </Card.Header>
                      <Card.Body>
                        <p className="single-my-account space-mb--20">
                          Master Framings secure website enables users to upload images, select mounts and frame combinations which our framers will build to your specifications. Your personal details will be kept strictly private and will not be passed onto 3rd parties.
                        </p>
                        <p className="single-my-account space-mb--20">
                          All orders use SSL technology and payment is accepted over 128bit SSL Technology.
                        </p>
                      </Card.Body>
                  </Card>
                  <Card className="single-my-account space-mb--20">
                    <Card.Header className="panel-heading">
                      <h4 className="panel-title">Service & Payment</h4>
                    </Card.Header>
                    <Card.Body>
                      <p className="single-my-account space-mb--20">
                        Master Framing prints your images and custom makes the frame you specify. The job is assembled with maximum care, thoroughly inspected and wrapped ready for pickup by the courier.
                      </p>
                      <p className="single-my-account space-mb--20">
                        Payment is required before goods are dispatched. The customer is responsible for postage costs.
                      </p>
                    </Card.Body>
                  </Card>

                  <Card className="single-my-account space-mb--20">
                    <Card.Header className="panel-heading">
                      <h4 className="panel-title">Warranty, Returns, & Refunds</h4>
                    </Card.Header>
                    <Card.Body>
                      <p className="single-my-account space-mb--20">
                        If you are not completely satisfied with the product you purchased you must notify Master Framing within 7 days from delivery date.
                      </p>
                      <p className="single-my-account space-mb--20">
                        If you have made a wrong choice or changed your mind, please contact us to negotiate a satisfactory solution. All expenses associated with the return are the customers responsibility.
                      </p>
                      <p className="single-my-account space-mb--20">
                        We do our best to match the colours of the frames and mats you order but cannot be responsible for minor variations in colour due to manufacturing and minor grain variation in timber frames.
                      </p>
                    </Card.Body>
                  </Card>

                  <Card className="single-my-account space-mb--20">
                    <Card.Header className="panel-heading">
                        <h4 className="panel-title">
                          Shipping
                        </h4>
                    </Card.Header>
                    <Card.Body>
                      <p className="single-my-account space-mb--20">
                        We use experienced and professional couriers and your order is packed by us using all reasonable care. Delivery timing is the responsibility of the courier. Shipping is determined by postcode in checkout.
                      </p>
                    </Card.Body>
                  </Card>
                  <Card className="single-my-account space-mb--20">
                    <Card.Header className="panel-heading">
                      <h4 className="panel-title">Copyright</h4>
                    </Card.Header>
                    <Card.Body>
                      <p className="single-my-account space-mb--20">
                        When using this website, you agree:
                        <ul>
                          <li>
                            <span>
                              Not upload or submit any content that contains viruses or programmes that may limit the website function
                            </span>
                          </li>
                          <li>
                            <span>
                              You are responsible for content uploaded in that it will not be pornographic, obscene, indecent, threatening, libellous, abusive or racist.
                            </span>
                          </li>
                          <li>
                            <span>
                              To ensure that all texts and images presented to Master Framing for inclusion in their artwork will not infringe on copyright, trademark, registered design of any other third party
                            </span>
                          </li>
                        </ul>
                      </p>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Layout>
  );
};

export default terms;
