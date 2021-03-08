import { useState, useEffect, Fragment } from "react";
import { Container } from "react-bootstrap";
import Link from "next/link";
import {
  IoIosSearch,
  IoMdPerson,
  IoIosCart,
  IoIosMenu,
  IoIosArrowDown
} from "react-icons/io";
import Navigation from "./elements/Navigation";
import AboutOverlay from "./elements/AboutOverlay";
import SearchOverlay from "./elements/SearchOverlay";
import CartOverlay from "./elements/CartOverlay";
import MobileMenu from "./elements/MobileMenu";
import { useUser } from '../../contexts/AccountContext'
import { useRouter } from 'next/router'
import { useCart } from '../../contexts/CartContext'

const Header = ({ aboutOverlay,isErrorPage }) => {
  const router = useRouter()
  const [scroll, setScroll] = useState(0);
  const [headerTop, setHeaderTop] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [offCanvasAboutActive, setOffCanvasAboutActive] = useState(false);
  const [offCanvasSearchActive, setOffCanvasSearchActive] = useState(false);
  const [offCanvasCartActive, setOffCanvasCartActive] = useState(false);
  const [offCanvasMobileMenuActive, setOffCanvasMobileMenuActive] = useState(
    false
  );

  const { user, signout } = useUser()
  const { cartItems } = useCart()

  useEffect(() => {
    const header = document.querySelector("header");
    setHeaderTop(header.offsetTop);
    setHeaderHeight(header.offsetHeight);
    window.addEventListener("scroll", handleScroll);
    scroll > headerTop
      ? (document.body.style.paddingTop = `${headerHeight}px`)
      : (document.body.style.paddingTop = 0);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    setScroll(window.scrollY);
  };

  const logoutHandler = (e) => {
    signout().then(() => {
      router.replace('/')
    })
  }

  return (
    <Fragment>
      <header
        className={`topbar-shadow ${(scroll > headerTop && !isErrorPage) ? "is-sticky" : ""}`}
      >
        <Container className="wide">
          <div className="header-content d-flex align-items-center justify-content-between position-relative space-py-mobile-only--30">
            {/* logo */}
            <div className="header-content__logo d-flex align-items-center space-pr--15">
              <button
                onClick={() => {
                  setOffCanvasAboutActive(true);
                  document
                    .querySelector("body")
                    .classList.add("overflow-hidden");
                }}
                className={`${
                  aboutOverlay === false
                    ? "d-none"
                    : "about-overlay-trigger d-none d-lg-block"
                }`}
              >
                <IoIosMenu />
              </button>
              <Link href="/" as={process.env.PUBLIC_URL + "/"}>
                <a>
                  <img
                    src={process.env.PUBLIC_URL + "/assets/images/logo.jpg"}
                    className="img-header img-fluid"
                    alt=""
                  />
                </a>
              </Link>
            </div>

            {/* navigation */}
            <Navigation />

            {/* icons */}
            <div className="header-content__icons space-pl--15 header-content__navigation__simple">
              <ul className="d-none d-lg-block">
                <li>
                  <a
                    onClick={() => {
                      setOffCanvasSearchActive(true);
                      document
                        .querySelector("body")
                        .classList.add("overflow-hidden");
                    }}
                  >
                    {/* <IoIosSearch /> */}
                  </a>
                </li>
                <li>
                  <Link
                    href="/other/login-register"
                    as={process.env.PUBLIC_URL + "/other/login-register"}
                  >
                    <button>
                      <IoMdPerson />
                    </button>
                  </Link>
                  {user ? (
                    <Fragment>
                      <IoIosArrowDown />
                      <ul className='sub-menu sub-menu--single'>
                        <li className="sub-menu--mega__title">
                          <ul className="sub-menu--mega__list account-selection">
                            <li>
                              <Link
                                href="/other/my-account"
                                as={process.env.PUBLIC_URL + "/other/my-account"}
                              >
                                <a>My Account</a>
                              </Link>
                            </li>
                            {user.isAdmin ? (
                              <li>
                                <Link
                                  href="/admin"
                                  as={process.env.PUBLIC_URL + "/admin"}
                                >
                                  <a>Admin</a>
                                </Link>
                            </li>
                            ) : ""}
                            <li>
                              <Link
                                href="/"
                                as={process.env.PUBLIC_URL + "/"}
                              >
                                <a onClick={logoutHandler}>Log out</a>
                              </Link>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </Fragment>
                  ) : null}
                </li>
                <li>
                  <button
                    onClick={() => {
                      setOffCanvasCartActive(true);
                      document
                        .querySelector("body")
                        .classList.add("overflow-hidden");
                    }}
                  >
                    <IoIosCart />
                    {cartItems.length >= 1 ? (
                      <span className="count">
                        {cartItems.length ? cartItems.length : ""}
                      </span>
                    ) : (
                      ""
                    )}
                  </button>
                </li>
              </ul>

              <ul className="d-block d-lg-none">
                <li>
                  <Link
                    href="/other/cart"
                    as={process.env.PUBLIC_URL + "/other/cart"}
                  >
                    <a>
                      <IoIosCart />
                      {cartItems.length >= 1 ? (
                        <span className="count">
                          {cartItems.length ? cartItems.length : ""}
                        </span>
                      ) : (
                        ""
                      )}
                    </a>
                  </Link>
                </li>
                <li>
                  <button onClick={() => setOffCanvasMobileMenuActive(true)}>
                    <IoIosMenu />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </header>

      {/* about overlay */}
      {aboutOverlay === false ? (
        ""
      ) : (
        <AboutOverlay
          activeStatus={offCanvasAboutActive}
          getActiveStatus={setOffCanvasAboutActive}
        />
      )}
      {/* search overlay */}
      {/* <SearchOverlay
        activeStatus={offCanvasSearchActive}
        getActiveStatus={setOffCanvasSearchActive}
      /> */}

      {/* cart overlay */}
      <CartOverlay
        activeStatus={offCanvasCartActive}
        getActiveStatus={setOffCanvasCartActive}
      />

      {/* Mobile Menu */}
      <MobileMenu
        activeStatus={offCanvasMobileMenuActive}
        getActiveStatus={setOffCanvasMobileMenuActive}
      />
    </Fragment>
  );
};

export default Header;
