import { Container, Row, Col } from "react-bootstrap";
import { MdViewComfy, MdApps, MdList } from "react-icons/md";
import { setActiveLayout } from "../../lib/product-utilities";
const ShopHeader = ({
  getLayout,
  layoutClass,
  listMode,
  layoutOptions,
  getFilterSortParams,
  mirrorShop,
}) => {
  return (
    <div className="shop-header">
      <Container className={layoutClass ? layoutClass : ""}>
        <Row>
          <Col md={12}>
            <div className="shop-header__filter-icons justify-content-center justify-content-md-end">
              {mirrorShop ? (
                <div className="single-icon filter-dropdown">
                  <select
                    onChange={(e) =>
                      getFilterSortParams("filterSort", e.target.value)
                    }
                  >
                    <option value="default">Default</option>
                    <option value="priceHighToLow">Price - High to Low</option>
                    <option value="priceLowToHigh">Price - Low to High</option>
                  </select>
                </div>
              ) : (
                ""
              )}

              {false && (
                <div className="single-icon grid-icons d-none d-lg-block">
                  {layoutOptions ? (
                    layoutOptions[0] === "grid four-column" ? (
                      <button
                        className="active"
                        onClick={(e) => {
                          getLayout("grid four-column");
                          setActiveLayout(e);
                        }}
                      >
                        <MdViewComfy />
                      </button>
                    ) : (
                      <button
                        className="active"
                        onClick={(e) => {
                          getLayout("grid three-column");
                          setActiveLayout(e);
                        }}
                      >
                        <MdApps />
                      </button>
                    )
                  ) : null}
                  {listMode === false ? (
                    ""
                  ) : (
                    <button
                      onClick={(e) => {
                        getLayout("list");
                        setActiveLayout(e);
                      }}
                    >
                      <MdList />
                    </button>
                  )}
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ShopHeader;
