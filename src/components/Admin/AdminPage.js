import {
  Button,
  Container,
  Navbar,
  Nav,
  NavDropdown,
  Form,
  Row,
  Col
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { useUser } from "../../contexts/AccountContext";
import { useRouter } from "next/router";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import styles from './admin.module.css';

const configurations = [
  {
    name: "Backings",
    link: "backing",
  },
  {
    name: "Dimensions",
    link: "dimension",
  },
  {
    name: "Edge",
    link: "edge",
  },
  {
    name: "Edge Width",
    link: "edgewidth",
  },
  {
    name: "Frames",
    link: "frame",
  },
  {
    name: "Glass",
    link: "glass",
  },
  {
    name: "Mat",
    link: "mat",
  },
  {
    name: "Mirror",
    link: "mirror",
  },
  {
    name: "Printing",
    link: "printing",
  },
  {
    name: "Stretching",
    link: "stretching",
  },
];

export default function AdminPage({ title, children, isLoading }) {
  const { user, signout } = useUser();
  const [allowed, setAllowed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setAllowed((user && user.isAdmin) || process.env.NODE_ENV !== "production");
  }, [user]);

  const logout = () => {
    signout();
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  if (!allowed) {
    return <p></p>;
  }

  return (
    <main style={{position:"relative",minHeight:"100vh"}}>
    <Container>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">
          <img
            src={process.env.PUBLIC_URL + "/assets/images/logo.jpg"}
            className="img-header img-fluid"
            alt=""
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <nav className="header-content__navigation space-pr--15 space-pl--15 d-none d-lg-block">
          <ul>
            <li className="mr-2">
              <Link href="/admin" as="/admin">
                <a>Home</a>
              </Link>
            </li>
            <li className="mr-2">
              <Link href="/admin/order" as="/admin/order">
                <a>Orders</a>
              </Link>
            </li>
            <li className="mr-2">
              <Link href="/admin/product" as="/admin/product">
                <a>Products</a>
              </Link>
            </li>
            <li className="mr-2">
              <Link href="/admin/price-code" as="/admin/price-code">
                <a>Price Codes</a>
              </Link>
            </li>
            <li className="mr-2">
                <Link href="">
                  <a>Configuartions</a>
                </Link>
                <IoIosArrowDown />
                <ul className={`sub-menu ${styles['custom-menu']}`}>
                <li className="sub-menu--mega__title">
                <ul className="sub-menu--mega__list">
                {configurations.map((configuration) => {
                  return (
                    <li key={configuration.name}>
                      <Link
                        href={"/admin/configuration/" + configuration.link}
                        as={"/admin/configuration/" + configuration.link}
                      >
                        <a>{configuration.name}</a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
                </li>
                </ul>
            </li>
            <li className="mr-2">
              <Link href="/admin/coupon-code" as="/admin/coupon-code">
                <a>Coupon Codes</a>
              </Link>
            </li>
            <li className="mr-2">
              <Link href="/admin/shipping-fee" as="/admin/shipping-fee">
                <a>Shipping Fee</a>
              </Link>
            </li>
            <li className="mr-2">
              <Link href="/admin/faq" as="/admin/faq">
                <a>FAQs</a>
              </Link>
            </li>
            <li className="mr-2">
              <Link href="/admin/portfolio" as="/admin/portfolio">
                <a>Gallery</a>
              </Link>
            </li>
          </ul>
          </nav>
        </Navbar.Collapse>
        <Form inline>
          <Button variant="outline-success" onClick={logout}>
            Logout
          </Button>
        </Form>
      </Navbar>
      <header className="mt-3 mb-3">
        <h2>{title}</h2>
      </header>
      <article style={{paddingBottom:"5.5rem"}}>
        {
          <div className="position-relative">
            <div>{children}</div>
            {isLoading && (
              <div className="text-center admin-loading-overlay">
                <div className="alert-info rounded">
                  <div className="m-5">
                    <div>
                      <strong>Loading, please wait ...</strong>
                    </div>
                    <div
                      className="spinner-border mt-3 text-info"
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        }
      </article>
    </Container>
    <footer className="bg-color--grey mt-5" style={{position:"absolute",width:"100%",bottom:"0",height:"3.5rem"}}>
      <Container className="wide">
        <Row>
          <Col>
            <div className="footer-single-widget__copyright mt-2 text-center">
              &copy; {new Date().getFullYear() + " "}
              <a href="https://ecdigital.com.au/ " target="_blank">
                <u>ecDigital</u>
              </a> ABN 92 642 970 527 All Rights Reserved
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
    </main>
  );
}
