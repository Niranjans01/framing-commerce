import { Fragment } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { Header } from "../../components/Header";

const NotFound = () => {
  return (
    <Fragment>
      <Header />
      <div
        className="nothing-found-area bg-404"
        style={{
          backgroundImage: `url(${
            process.env.PUBLIC_URL + "/assets/images/backgrounds/404-background.jpg"
          })`
        }}
      >
        <Container>
          <Row>
            <Col lg={6}>
              <div className="nothing-found-content">
                <h1>Oops!</h1>
                <h1 className="space-mb--50">Are you lost?</h1>
                <p className="direction-page">
                  PLEASE GO BACK TO{" "}
                  <Link href="/" as={process.env.PUBLIC_URL + "/"}>
                    <a>home</a>
                  </Link>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
};

export default NotFound;
