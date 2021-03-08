import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import faqService from "../services/FaqService";
import { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { Breadcrumb } from "../components/Breadcrumb";
import React from "react";
import Card from "react-bootstrap/Card";

let data = {};
const config = {
  animate: true,
  arrowIcon: "v",
  tabFocus: true,
};

const assembleFaq = async (faqs) => {
  const items = await Promise.all(
    faqs.map(async (element) => {
      return {
        title: element.displayName,
        content: element.description,
      };
    })
  );
  data = { rows: items };
  return data;
};

const Faqs = () => {
  const [faq, setFaq] = useState([]);
  const [layout, setLayout] = useState("grid four-column");
  const layoutOptions = ["grid four-column", "list"];

  const getLayout = (layout) => {
    setLayout(layout);
  };

  useEffect(() => {
    faqService.find({}).then(setFaq);
    assembleFaq(faq);
  }, []);
  return (
    <Layout>
      {/* breadcrumb */}
      <Breadcrumb
        pageTitle="F.A.Q"
        backgroundImage="/assets/images/backgrounds/faq.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>F.A.Q</li>
        </ul>
      </Breadcrumb>
      <div className="element-wrapper space-mt--r130 space-mb--r130">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="faq-wrapper">
                <div className="single-faq space-mb--r100">
                  <Accordion defaultActiveKey="0">
                    {faq.map((e, idx) => (
                      <Card
                        className="single-my-account space-mb--20"
                        key={e.id}
                      >
                        <Card.Header className="panel-heading">
                          <Accordion.Toggle
                            variant="link"
                            eventKey={idx.toString()}
                          >
                            <h4 className="panel-title">{e.displayName}</h4>
                          </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey={idx.toString()}>
                          <Card.Body>
                            <p>{e.description}</p>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    ))}
                  </Accordion>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Layout>
  );
};
export default Faqs;
