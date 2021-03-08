import { useState, useEffect } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { Layout } from "../Layout";
import { Breadcrumb } from "../Breadcrumb";
import { ShopHeader, ShopProducts } from "../Shop";
import Paginator from "react-hooks-paginator";
import productService from "../../services/ProductService2";

const ProductShop = ({
  title,
  category,
  banner = "/assets/images/backgrounds/breadcrumb-bg-1.png",
}) => {
  const [layout, setLayout] = useState("grid four-column");
  const [sortType, setSortType] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [currentData, setCurrentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const layoutOptions = ["grid four-column", "list"];
  const [filterSortType, setFilterSortType] = useState("");
  const [filterSortValue, setFilterSortValue] = useState("");
  const [offset, setOffset] = useState(0);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [shopTopFilterStatus, setShopTopFilterStatus] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentProducts, setCurrentProducts] = useState([]);

  const pageLimit = 20;

  const getLayout = (layout) => {
    setLayout(layout);
  };

  const getSortParams = (sortType, sortValue) => {
    setSortType(sortType);
    setSortValue(sortValue);
  };

  const getFilterSortParams = (sortType, sortValue) => {
    setFilterSortType(sortType);
    setFilterSortValue(sortValue);
  };

  const sortProductsByPrice = (products, type) => {
    const items = products.map((e) => {
      const variantPrices = e.variants.map((v) => v?.price);
      const min = Math.min(...variantPrices);
      return {
        ...e,
        min,
      };
    });
    const sortValue = type === "priceHighToLow" ? -1 : 1;
    return items.sort((a, b) => {
      return a.min > b.min ? sortValue : -1 * sortValue;
    });
  };

  useEffect(() => {
    setLoading(true);
    productService.find({ category }).then((res) => {
      setProducts(res);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setOffset(0);
    setCurrentPage(1);
    if (filterSortValue) {
      setSortedProducts(sortProductsByPrice(products, filterSortValue));
    } else {
      setSortedProducts(products);
    }
  }, [filterSortValue, products]);

  useEffect(() => {
    setCurrentProducts(sortedProducts.slice(offset, offset + pageLimit));
  }, [offset, sortedProducts]);

  return (
    <Layout>
      {/* breadcrumb */}
      <Breadcrumb pageTitle={title} backgroundImage={banner}>
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>{title}</li>
        </ul>
      </Breadcrumb>
      <div className="shop-page-content">
        {/* shop page header */}
        <ShopHeader
          getLayout={getLayout}
          getFilterSortParams={getFilterSortParams}
          productCount={products.length}
          totalCount={products.length}
          shopTopFilterStatus={shopTopFilterStatus}
          setShopTopFilterStatus={setShopTopFilterStatus}
          layoutOptions={layoutOptions}
          mirrorShop={true}
        />

        <div className="shop-page-content__body space-mt--r130 space-mb--r130">
          <Container>
            <Row>
              <Col>
                {/* shop products */}
                <ShopProducts
                  layout={layout}
                  products={currentProducts}
                  isPopup
                />

                {/* shop product pagination */}
                <div className="pro-pagination-style">
                  <Paginator
                    totalRecords={sortedProducts.length}
                    pageLimit={pageLimit}
                    pageNeighbours={2}
                    setOffset={setOffset}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    pageContainerClass="mb-0 mt-0"
                    pagePrevText="«"
                    pageNextText="»"
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </Layout>
  );
};

export default ProductShop;
