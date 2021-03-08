import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import {ProductsContext, useProducts} from '../../../contexts/ProductsContext'

const MobileMenuNav = ({ getActiveStatus }) => {
  const [ diyFraming, setDiyFraming ] = useState([]);
  const [ otherProducts, setOtherProducts ] = useState([]);
  const {navigationProducts} = useProducts();

  useEffect(() => {
    if (navigationProducts) {
      setDiyFraming(navigationProducts.filter(p => p.category === 'diy-framing'))
      setOtherProducts(navigationProducts.filter(p => p.category === 'other-products'))
    }
  }, [navigationProducts])


  useEffect(() => {
    const offCanvasNav = document.querySelector(
      "#offcanvas-mobile-menu__navigation"
    );
    const offCanvasNavSubMenu = offCanvasNav.querySelectorAll(
      ".mobile-sub-menu"
    );
    const anchorLinks = offCanvasNav.querySelectorAll("a");

    for (let i = 0; i < offCanvasNavSubMenu.length; i++) {
      offCanvasNavSubMenu[i].insertAdjacentHTML(
        "beforebegin",
        "<span class='menu-expand'><i></i></span>"
      );
    }

    const menuExpand = offCanvasNav.querySelectorAll(".menu-expand");
    const numMenuExpand = menuExpand.length;

    for (let i = 0; i < numMenuExpand; i++) {
      menuExpand[i].addEventListener("click", (e) => {
        sideMenuExpand(e);
      });
    }

    for (let i = 0; i < anchorLinks.length; i++) {
      anchorLinks[i].addEventListener("click", () => {
        getActiveStatus(false);
      });
    }
  });

  const sideMenuExpand = (e) => {
    e.currentTarget.parentElement.classList.toggle("active");
  };
  return (
    <nav
      className="offcanvas-mobile-menu__navigation"
      id="offcanvas-mobile-menu__navigation"
    >
      <ul>
        <li className="menu-item-has-children">
          <Link href="/" as={process.env.PUBLIC_URL + "/"}>
            <a>Products</a>
          </Link>
          <ul className="mobile-sub-menu">
            <li className="menu-item-has-children">
              <Link
                href="/diy-framing"
                as={process.env.PUBLIC_URL + "/diy-framing"}
              >
                <a>DIY Framing</a>
              </Link>
              <ul className="mobile-sub-menu">
                {diyFraming.map((product) => {
                  return (
                    <li key={product.id}>
                      <Link
                        href={`/${product.category}/${product.id}`}
                        as={`${process.env.PUBLIC_URL}/${product.category}/${product.id}`}
                      >
                        <a>{product.displayName}</a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            <li className="menu-item-has-children">
              <Link href={process.env.PUBLIC_URL + "/other-products"}>
                <a>Other Products</a>
              </Link>
              <ul className="mobile-sub-menu">
                {otherProducts.map((product) => {
                  return (
                    <li key={product.id}>
                      <Link
                        href={`/${product.category}/${product.id}`}
                        as={`${process.env.PUBLIC_URL}/${product.category}/${product.id}`}
                      >
                        <a>{product.displayName}</a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            <li className="menu-item-has-children">
              <Link
                href="/special-products"
                as={process.env.PUBLIC_URL + "/special-products"}
              >
                <a>Special Products</a>
              </Link>
              <ul className="mobile-sub-menu">
                <li>
                  <Link
                    href="/special-products/jerseys"
                    as={
                      process.env.PUBLIC_URL + "/special-products/jerseys"
                    }
                  >
                    <a>Jerseys</a>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/special-products/display-boxes"
                    as={
                      process.env.PUBLIC_URL + "/special-products/display-boxes"
                    }
                  >
                    <a>Display Boxes</a>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/special-products/gift-voucher"
                    as={
                      process.env.PUBLIC_URL + "/special-products/gift-voucher"
                    }
                  >
                    <a>Gift Vouchers</a>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="menu-item-has-children">
              <a>Shops</a>
              <ul className="mobile-sub-menu">
                <li>
                  <Link
                    href="/mirror-shop"
                    as={process.env.PUBLIC_URL + "/mirror-shop"}
                  >
                    <a>Mirror Shop</a>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/certificate-shop"
                    as={process.env.PUBLIC_URL + "/certificate-shop"}
                  >
                    <a>Certificate Frame Shop</a>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </li>

        <li className="menu-item">
          <Link href="/portfolio" as={process.env.PUBLIC_URL + "/portfolio"}>
            <a>Portfolio</a>
          </Link>
        </li>

        <li className="menu-item">
          <Link href="/about" as={process.env.PUBLIC_URL + "/about"}>
            <a>About Us</a>
          </Link>
        </li>

        <li className="menu-item">
          <Link href="/contact" as={process.env.PUBLIC_URL + "/contact"}>
            <a>Contact Us</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MobileMenuNav;
