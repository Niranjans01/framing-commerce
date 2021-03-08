import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import { Layout } from "../components/Layout";
import { Breadcrumb } from "../components/Breadcrumb";

const terms = () => {
  return (
    <Layout>
      {/* breadcrumb */}
      <Breadcrumb
        pageTitle="MASTERFRAMING"
        backgroundImage="/assets/images/backgrounds/privacy_policy.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Privacy Policy</li>
        </ul>
      </Breadcrumb>
      <div className="element-wrapper space-mt--r130 space-mb--r130">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="single-faq space-mb--r100">
                <Card className="single-my-account space-mb--20">
                  <Card.Header className="panel-heading">
                    <h4 className="panel-title">
                      MASTER FRAMING PRIVACY POLICY
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    <p>
                    Master Framing is committed to providing quality services to you and this
                    policy outlines our obligations to you in respect of how we manage your
                    Personal Information.
                    </p>
                    <p>
                    We have adopted the Australian Privacy Principles
                    (AAPs) contained in the Privacy Act 1988 which governs the way in which we
                    collect, use, disclose, store, secure and dispose your personal information.
                    </p>
                    <p>
                    A copy of Australian Privacy Principles may be obtained from <a href="https://www.aoic.gov.au">www.aoic.gov.au</a>
                    </p>
                  </Card.Body>
                </Card>
                <Card className="space-mb--20">
                  <Card.Header className="panel-heading">
                    <h4 className="panel-title">
                      What is personal information and why do we collect it?
                    </h4>
                  </Card.Header>

                  <Card.Body>
                    <p>
                    Personal information is information or an opinion which identifies an
                    individual. Examples include names, emails, addresses and phone numbers.
                    </p>
                    <p>
                    This information is obtained in many ways including correspondence,
                    telephone, email, via our web site.
                    </p>
                    <p>We collect your personal information
                    for the primary purpose of providing our services to you. We may use your
                    personal information for secondary purposed related to our primary purpose
                    in circumstances where you would reasonably expect us to use or disclose.
                    </p>
                    <p>
                    You may unsubscribe from our mailing/marketing list at any time by
                    contacting us in writing.
                    </p>
                  </Card.Body>
                </Card>

                <Card className="space-mb--20">
                  <Card.Header className="panel-heading">
                    <h4 className="panel-title">Third Parties</h4>
                  </Card.Header>

                  <Card.Body>
                    <p>
                    In some circumstances we may be provided with your personal information
                    by third parties where it relates to the primary purpose of the service
                    being provided.
                    </p>
                  </Card.Body>
                </Card>

                <Card className="space-mb--20">
                  <Card.Header className="panel-heading">
                    <h4 className="panel-title">
                      Disclosure of personal information
                    </h4>
                  </Card.Header>

                  <Card.Body>
                    <p>
                    Your personal information may be disclosed in some circumstances including:
                    </p>
                    <ul>
                      <li>
                        Third parties where you consent to use the disclosure and
                      </li>
                      <li>
                        Where required by law
                      </li>
                    </ul>
                  </Card.Body>
                </Card>
                <Card className="space-mb--20">
                  <Card.Header className="panel-heading">
                    <h4 className="panel-title">
                      Security of personal information
                    </h4>
                  </Card.Header>

                  <Card.Body>
                    <p>
                    Your personal Information is stored in a manner that reasonably protects
                    it from misuse and loss and from unauthorized access, modification or
                    disclosure.
                    </p>
                    <p>
                    When your Personal information in no longer needed for the
                    purpose for which it was obtained, we will take reasonable steps to destroy
                    or permanently de-identify this information.
                    </p>
                    <p>However, most of the personal
                    information will be stored in our files for a minimum of 7 years.
                    </p>
                  </Card.Body>
                </Card>

                <Card className="space-mb--20">
                  <Card.Header className="panel-heading">
                    <h4 className="panel-title">
                      Access to your personal information
                    </h4>
                  </Card.Header>

                  <Card.Body>
                    <p>
                    You may access the Personal Information we hold about you and to
                    update and / or correct it. If you wish to update your personal
                    Information, please contact us in writing. We may require
                    identification from you before releasing the requested information.
                    </p>
                  </Card.Body>
                </Card>
                <Card className="space-mb--20">
                  <Card.Header className="panel-heading">
                    <h4 className="panel-title">
                      Maintaining the Quality of your Personal Information
                    </h4>
                  </Card.Header>

                  <Card.Body>
                    <p>
                    It is important to us that your Personal Information is up to date.
                    If you find that the information is inaccurate or out of date please
                    advise us as soon as possible so we can update our records.
                    </p>
                  </Card.Body>
                </Card>
                <Card className="space-mb--20">
                  <Card.Header className="panel-heading">
                    <h4 className="panel-title">
                      Policy Updates
                    </h4>
                  </Card.Header>

                  <Card.Body>
                    <p>
                    This policy may change from time to time and is available on our web site.
                    </p>
                  </Card.Body>
                </Card>
                <Card className="space-mb--20">
                  <Card.Header className="panel-heading">
                    <h4 className="panel-title">
                      Privacy Policy Complaints and Enquiries
                    </h4>
                  </Card.Header>

                  <Card.Body>
                    <p>
                    If you have any queries or complaints about our Privacy Policy, please contact us at:
                    </p>
                    <p>
                    Master Framing<br />
                    797 Elizabeth Street<br />
                    Zetland 2017
                    </p>
                    <p>
                    E: framers@masterframing.com.au<br />
                    Ph: 02 96972008
                    </p>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Layout>
  );
};

export default terms;
