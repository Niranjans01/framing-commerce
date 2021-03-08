import { ProductGridListWrapper } from "../../components/ProductThumb";
import { Row } from "react-bootstrap";
const ShopProducts = ({
  products,
  layout,
  category,
  isStatic,
  portfolio,
  isPopup,
}) => {
  return (
    <div className="shop-products">
      <Row className={layout}>
        <ProductGridListWrapper
          products={products}
          bottomSpace="space-mb--50"
          category={category}
          isStatic={isStatic}
          portfolio={portfolio}
          isPopup={isPopup}
        />
      </Row>
    </div>
  );
};

export default ShopProducts;
