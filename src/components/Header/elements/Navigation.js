import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect, useState, useContext } from 'react'
import { ProductsContext, useProducts } from "../../../contexts/ProductsContext";
import { diyOrder, otherProductsOrder } from "./nav-order";

const Navigation = () => {

  const [ diyFraming, setDiyFraming ] = useState([]);
  const [ otherProducts, setOtherProducts ] = useState([]);
  const {navigationProducts} = useProducts();

  useEffect(() => {
    if (navigationProducts) {
      setDiyFraming(
        navigationProducts
          .filter((p) => p.category === "diy-framing")
          .sort(
            (a, b) =>
              diyOrder.indexOf(a.displayName) - diyOrder.indexOf(b.displayName)
          )
      );
      setOtherProducts(
        navigationProducts
          .filter((p) => p.category === "other-products")
          .sort(
            (a, b) =>
            otherProductsOrder.indexOf(a.displayName) -
            otherProductsOrder.indexOf(b.displayName)
          )
      );
    }
  }, [navigationProducts])

  return (
    <nav className="header-content__navigation space-pr--15 space-pl--15 d-none d-lg-block">
      <ul>
        <li>
          <Link href="/">
            <a>Products</a>
          </Link>
          <IoIosArrowDown />
          <ul className="sub-menu sub-menu--mega sub-menu--mega--column-4">
            <li className="sub-menu--mega__title">
              <Link href="/diy-framing">
                <a>DIY Framing</a>
              </Link>
              <ul className="sub-menu--mega__list">
                {diyFraming.map((product) => {
                  return (
                    <li key={product.id}>
                      <Link
                        href={{
                          pathname: `/diy-framing/[slug]`,
                          query: { slug: `${product.id}` },
                        }}
                        as={{ pathname: `/diy-framing/${product.id}` }}
                      >
                        <a>{product.displayName}</a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            <li className="sub-menu--mega__title">
              <Link href="/other-products">
                <a>Other Products</a>
              </Link>
              <ul className="sub-menu--mega__list">
                {otherProducts.map((product) => {
                  return (
                    <li key={product.id}>
                      <Link
                        href={{
                          pathname: `/other-products/[slug]`,
                          query: { slug: `${product.id}` },
                        }}
                        as={{ pathname: `/other-products/${product.id}` }}
                      >
                        <a>{product.displayName}</a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            <li className="sub-menu--mega__title">
              <Link href="/special-products">
                <a>Special Products</a>
              </Link>
              <ul className="sub-menu--mega__list">
                <li>
                  <Link href="/special-products/jerseys">
                    <a>Jerseys</a>
                  </Link>
                </li>
                <li>
                  <Link href="/special-products/display-boxes">
                    <a>Display Boxes</a>
                  </Link>
                </li>
                <li>
                  <Link href="/special-products/gift-voucher">
                    <a>Gift Vouchers</a>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="sub-menu--mega__title">
              <a>Shops</a>
              <ul className="sub-menu--mega__list">
                <li>
                  <Link href="/mirror-shop">
                    <a>Mirror Shop</a>
                  </Link>
                </li>
                <li>
                  <Link href="/certificate-shop">
                    <a>Certificate Frame Shop</a>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <Link href="/portfolio">
            <a>Gallery</a>
          </Link>
        </li>
        <li>
          <Link href="/about">
            <a>About Us</a>
          </Link>
        </li>
        <li className="position-relative">
          <Link href="/contact">
            <a>Contact Us</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
