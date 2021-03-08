import { Fragment, useEffect } from "react";

import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import ProductGrid from "./ProductGrid";

const ProductGridWrapper = ({ products, bottomSpace, column, quickView }) => {
  const { addToast } = useToasts();
  return (
    <Fragment>
      {products &&
        products.map((product) => {
          return (
            <ProductGrid
              key={product?.displayName}
              product={product}
              bottomSpace={bottomSpace}
              addToast={addToast}
              column={column}
              quickView={quickView}
            />
          );
        })}
    </Fragment>
  );
};
export default ProductGridWrapper;
