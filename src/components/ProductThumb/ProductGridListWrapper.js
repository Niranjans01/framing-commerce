import { Fragment } from "react";

import { useToasts } from "react-toast-notifications";
import { getDiscountPrice } from "../../lib/product-utilities";
import ProductGridList from "./ProductGridList";

const ProductGridWrapper = ({
  products,
  bottomSpace,
  addToCart,
  cartItems,
  category,
  isStatic,
  portfolio,
  isPopup,
}) => {
  const { addToast } = useToasts();
  return (
    <Fragment>
      {products &&
        products.map((product) => {
          let discountedPrice;
          if (product.price && product.discount) {
            discountedPrice = Math.round(getDiscountPrice(
              product.price,
              product.discount
            ));
          }
          let productPrice;
          if (product.price) {
            productPrice = Math.round(product.price);
          }

          return (
            <ProductGridList
              key={product.id}
              product={product}
              discountedPrice={discountedPrice}
              productPrice={productPrice}
              bottomSpace={bottomSpace}
              addToCart={addToCart}
              addToast={addToast}
              cartItems={cartItems}
              category={category}
              isStatic={isStatic}
              portfolio={portfolio}
              isPopup={isPopup}
            />
          );
        })}
    </Fragment>
  );
};

export default ProductGridWrapper;
