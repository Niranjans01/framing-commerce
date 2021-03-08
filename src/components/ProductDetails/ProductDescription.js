import { Fragment, useEffect } from "react";
import Link from "next/link";
import { getDiscountPrice } from "../../lib/product-utilities";
import { usePrice } from "../../contexts/PriceContext";
import { useProduct } from "../../contexts/ProductContext";
import { useCart } from "../../contexts/CartContext";
import { v4 as uuidv4 } from "uuid";
import { useToasts } from "react-toast-notifications";
import { round } from "../../lib/utilities";
import Card from "react-bootstrap/Card";

const ProductDescription = ({ disableAction }) => {
  const {
    product,
    dimWidth,
    dimHeight,
    frame,
    paper,
    glass,
    backing,
    topMat,
    bottomMat,
    stretch,
    edge,
    edgeWidth,
    mirrorType,
    price,
    discountedPrice,
    setDiscountedPrice,
    quantity,
    setQuantity,
    setPrice,
    toEmail,
    toName,
    fromName,
    message,
    imgCanvas,
    image,
    defaultDim,
    defaultStretch
  } = useProduct();

  const {
    setImage,
    setPreviousFrame,
    setFrame,
    setBacking,
    setPaper,
    setGlass,
    setMirrorType,
    defaultConfig,
    setDimension,
    setEdge,
    setImages,
    setEdgeWidth,
    defaultGlassType,
    setDimHeight,
    setDimWidth,
    setDimSizing,
    setDimUnit,
    setBottomMat,
    setTopMat,
    setEnableBotMat,
    setEnableTopMat,
    setStretch,
    setOrientation
  } = useProduct();

  const { addToCart } = useCart();
  const { addToast } = useToasts();

  const priceMatrix = usePrice();

  useEffect(() => {
    //runs only once
    if (product) {
      const price = computePrice();
      if (product.displayName !== "Gift Voucher") {
        setPrice(price);
        if (product.discount) {
          const discounted = round(
            getDiscountPrice(price, product.discount),
            2
          );
          setDiscountedPrice(discounted);
        }
      }
    }
  }, [product]);

  const resetAll = () => {
    // if(defaultDim){
    //   setDimension(defaultDim)
    //   setDimHeight(defaultDim.height)
    //   setDimWidth(defaultDim.width)
    // }
    // else{
    setDimHeight(60)
    setDimWidth(40)
    // }
    setImage(null)
    setImages([])
    setQuantity(1)
    setDimSizing("image-size")
    setOrientation("portrait")
    setDimUnit('cm')
    setBottomMat(null)
    setTopMat(null)
    setEnableBotMat(false)
    setEnableTopMat(false)
    setFrame(null)
    setPreviousFrame(null)
    if (defaultGlassType) {
      setGlass(defaultGlassType)
    }
    if (defaultConfig.mirrorType) {
      setMirrorType(defaultConfig.mirrorType)
    }
    if (defaultConfig.backing) {
      setBacking(defaultConfig.backing)
    }
    if (defaultConfig.paper) {
      setPaper(defaultConfig.paper)
    }
    if (defaultConfig.edge) {
      setEdge(defaultConfig.edge)
    }
    if (defaultConfig.edgeWidth) {
      setEdgeWidth(defaultConfig.edgeWidth)
    }
    if (defaultStretch) {
      setStretch(defaultStretch)
    }
  }

  useEffect(() => {
    if (product.discount) {
      setDiscountedPrice(round(getDiscountPrice(price, product.discount), 2));
    }
  }, [price]);

  useEffect(() => {
    if (product.displayName !== "Gift Voucher") {
      setPrice(computePrice());
    }
  }, [
    dimWidth,
    dimHeight,
    frame,
    paper,
    glass,
    backing,
    stretch,
    edge,
    edgeWidth,
    mirrorType,
    topMat,
    bottomMat,
  ]);

  const createCartObjectWithConfigurations = () => {
    let conf = [];

    if (dimWidth && dimHeight) {
      conf = [
        ...conf,
        {
          type: "dimension",
          value: {
            width: dimWidth,
            height: dimHeight,
          },
        },
      ];
    }

    if (frame) {
      conf = [
        ...conf,
        {
          type: "frame",
          value: frame.id,
          displayName: frame.displayName,
        },
      ];
    }

    if (edge) {
      conf = [
        ...conf,
        {
          type: "edge",
          value: edge.id,
          displayName: edge.displayName,
        },
      ];
    }

    if (edgeWidth) {
      conf = [
        ...conf,
        {
          type: "edge_width",
          value: edgeWidth.id,
          displayName: edgeWidth.displayName,
        },
      ];
    }

    if (stretch) {
      conf = [
        ...conf,
        {
          type: "stretching",
          value: stretch.id,
          displayName: stretch.displayName,
        },
      ];
    }

    if (paper) {
      conf = [
        ...conf,
        {
          type: "print",
          value: paper.id,
          displayName: paper.displayName,
        },
      ];
    }

    if (glass) {
      conf = [
        ...conf,
        {
          type: "glass",
          value: glass.id,
          displayName: glass.displayName,
        },
      ];
    }

    if (mirrorType) {
      conf = [
        ...conf,
        {
          type: "mirror_type",
          value: mirrorType.id,
          displayName: mirrorType.displayName,
        },
      ];
    }

    if (backing) {
      conf = [
        ...conf,
        {
          type: "backing",
          value: backing.id,
          displayName: backing.displayName,
        },
      ];
    }

    if (topMat) {
      conf = [
        ...conf,
        {
          type: "top_mat",
          value: topMat,
        },
      ];
    }

    if (bottomMat) {
      conf = [
        ...conf,
        {
          type: "bottom_mat",
          value: bottomMat,
        },
      ];
    }

    const c = {
      product: product.id,
      quantity,
      price: discountedPrice ? discountedPrice : price,
      configurations: conf,
    };
    return c;
  };

  const getMatWidth = () => {
    let matWidth = 0.0;
    if (topMat && topMat.left && topMat.right) {
      matWidth += topMat.left + topMat.right;
    }
    if (bottomMat && bottomMat.left && bottomMat.right) {
      matWidth += bottomMat.left + bottomMat.right;
    }

    return matWidth;
  };

  const getMatHeight = () => {
    let matHeight = 0.0;
    if (topMat && topMat.top && topMat.bottom) {
      matHeight += topMat.top + topMat.bottom;
    }
    if (bottomMat && bottomMat.top && bottomMat.bottom) {
      matHeight += bottomMat.top + bottomMat.bottom;
    }

    return matHeight;
  };

  const getFrameOverallThickness = () => {
    let thickness = 0.0;
    if (frame) {
      thickness = thickness + frame.width * 4; //all 4 sides
    }

    return thickness;
  };

  const computePriceFromPriceCode = (dimension, priceCode, discount) => {
    let price = 0;
    if (priceCode) {
      if (priceCode.multiplier) {
        price = dimension * priceCode.multiplier;
      } else {
        const priceCodePrices = priceCode.prices;
        const min = Object.keys(priceCodePrices)?.[0] || 30;
        const lookupDim =
          dimension > min
            ? dimension <= 300
              ? Math.floor(dimension / 5) * 5
              : 300
            : min;
        price = priceCodePrices[lookupDim];
      }

      if (discount) {
        price = this.discount(price, discount);
      }
    }

    return price;
  };

  const computePrice = () => {
    let computedPrice = 0.0;
    if (dimWidth && dimHeight) {
      const totalDim =
        parseFloat(dimWidth) +
        getMatWidth() +
        parseFloat(dimHeight) +
        getMatHeight() +
        getFrameOverallThickness();

      if (frame) {
        const priceCode = priceMatrix.find((i) => i.id === frame.priceCode);
        computedPrice += computePriceFromPriceCode(
          totalDim,
          priceCode,
          frame.discount
        );
      }

      if (glass && glass.priceCode) {
        const priceCode = priceMatrix.find((i) => i.id === glass.priceCode);
        computedPrice += computePriceFromPriceCode(
          totalDim,
          priceCode,
          glass.discount
        );
      }

      if (backing && backing.priceCode) {
        const priceCode = priceMatrix.find((i) => i.id === backing.priceCode);
        computedPrice += computePriceFromPriceCode(
          totalDim,
          priceCode,
          backing.discount
        );
      }

      if (paper && paper.priceCode) {
        const priceCode = priceMatrix.find((i) => i.id === paper.priceCode);
        computedPrice += computePriceFromPriceCode(
          totalDim,
          priceCode,
          paper.discount
        );
      }

      if (stretch && stretch.priceCode) {
        const priceCode = priceMatrix.find((i) => i.id === stretch.priceCode);
        computedPrice += computePriceFromPriceCode(
          totalDim,
          priceCode,
          stretch.discount
        );
      }

      if (edge && edge.priceCode) {
        const priceCode = priceMatrix.find((i) => i.id === edge.priceCode);
        computedPrice += computePriceFromPriceCode(
          totalDim,
          priceCode,
          edge.discount
        );
      }

      if (edgeWidth && edgeWidth.priceCode) {
        const priceCode = priceMatrix.find((i) => i.id === edgeWidth.priceCode);
        computedPrice += computePriceFromPriceCode(
          totalDim,
          priceCode,
          edgeWidth.discount
        );
      }

      if (mirrorType && mirrorType.priceCode) {
        const priceCode = priceMatrix.find(
          (i) => i.id === mirrorType.priceCode
        );
        computedPrice += computePriceFromPriceCode(
          totalDim,
          priceCode,
          mirrorType.discount
        );
      }

      if (topMat) {
        const priceCode = priceMatrix.find((i) => i.displayName === "Top Mat");
        computedPrice += computePriceFromPriceCode(totalDim, priceCode, null);
      }

      if (bottomMat) {
        const priceCode = priceMatrix.find(
          (i) => i.displayName === "Bottom Mat"
        );
        computedPrice += computePriceFromPriceCode(totalDim, priceCode, null);
      }

      if (product.displayName === "Clip Frames") {
        const priceCode = priceMatrix.find(
          (i) => i.displayName === "Perspex Clip Frames"
        );
        computedPrice += computePriceFromPriceCode(totalDim, priceCode, null);
      }

      if (product.displayName === "Corkboards") {
        const priceCode = priceMatrix.find(
          (i) => i.displayName === "Cork Boards"
        );
        computedPrice += computePriceFromPriceCode(totalDim, priceCode, null);
      }
    }
    return round(computedPrice, 2);
  };

  const createCartObjectForGiftVoucher = () => {
    const conf = {
      type: "gift",
      value: {
        recipientEmail: toEmail,
        recipientName: toName,
        senderName: fromName,
        message,
      },
    };
    const c = {
      product: "gift-voucher",
      quantity,
      price,
      configurations: [conf],
      displayName: "Gift Voucher",
    };
    return c;
  };

  const getFileName = (name = "") => {
    return name.toLowerCase().split(" ").join("_");
  };

  const canvasToFile = (canvas, name) => {
    return new Promise((resolve, reject) => {
      try {
        canvas.toBlob(async (blob) => {
          const file = new File([blob], `${getFileName(name)}.jpeg`, {
            type: "image/jpeg",
          });
          resolve(file);
        }, "image/jpeg");
      } catch (error) {
        reject("Canvas Failed");
      }
    });
  };

  const setAddToCart = async () => {
    if (
      product.category === "diy-framing" ||
      product.category === "other-products"
    ) {
      const item = createCartObjectWithConfigurations();
      const canvas = imgCanvas.current;
      const framed = await canvas.toDataURL("image/jpeg", 0.5);
      const images = [
        {
          url: framed,
        },
      ];
      if (image) {
        images.push({
          url: image.data_url,
        });
      }
      addToCart(
        {
          ...item,
          images,
          displayName: product.displayName,
          category: product.category,
        },
        uuidv4()
      );
      addToast("Added To Cart", { appearance: "success", autoDismiss: true });
    } else if (product.name === "gift-voucher") {
      // for gift-voucher
      const item = createCartObjectForGiftVoucher();

      addToCart(item, uuidv4());
      addToast("Added To Cart", { appearance: "success", autoDismiss: true });
    } else if (product.category === "mirror-shop") {
      //for mirror-shop
    }
  };

  return (
    <div className="product-content space-mb-mobile-only--50">
      <Card>
        <Card.Body>
        <div className="product-content__price space-mb--20">
          {product.discount && product.discount > 0 ? (
            <Fragment>
              <h4 className="main-price discounted">${price.toFixed(2)}</h4>
              <h3 className="main-price">
                Total: $ {Math.round(discountedPrice * quantity)}
              </h3>
            </Fragment>
          ) : (
              <h3 className="main-price">
                Total: $ {Math.round(price * quantity)}
              </h3>
            )}
        </div>
        {product ? (
          <div>
            {product.name === "gift-voucher" ? (
              ""
            ) : (
                <div className="product-content__quantity space-mb--40">
                  <div className="product-content__quantity__title">Quantity</div>
                  <div className="cart-plus-minus">
                    <button
                      onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                      className="qtybutton"
                    >
                      -
                  </button>
                    <input
                      className="cart-plus-minus-box"
                      type="text"
                      value={quantity}
                      readOnly
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="qtybutton"
                    >
                      +
                  </button>
                  </div>
                </div>
              )}

            <div className="space-mb--30">
              For bulk orders please contact (02) 9697 2008
            </div>

            <div className="product-content__button-wrapper d-flex align-items-center">
              <button
                onClick={setAddToCart}
                className="lezada-button lezada-button--medium product-content__cart space-mr--10"
                disabled={disableAction}
              >
                Add To Cart
              </button>
              <button
                onClick={resetAll}
                className="lezada-button lezada-button--medium product-content__cart space-mr--10"
              >
                Reset
              </button>
            </div>
          </div>
        ) : (
            ""
          )}
        </Card.Body>
      </Card>
      {product ? (
        <div className="product-content__other-info space-mt--50" style={{marginBottom: "20px"}}>
          <table>
            <tbody>
              <tr className="single-info">
                <td className="value">{product.name}</td>
              </tr>
              <tr className="single-info">
                <td className="title">Categories: </td>
                <td className="value">
                  {product.category ? (
                    <Link
                      href={`/${product.category}`}
                      as={process.env.PUBLIC_URL + `/${product.category}`}
                      key={product.category}
                    >
                      <a>{product.category}</a>
                    </Link>
                  ) : (
                      ""
                    )}
                </td>
              </tr>
              <tr className="single-info">
                <td className="title">Tags: </td>
                <td className="value">
                  {product.tag &&
                    product.tag.map((item, index, arr) => {
                      return (
                        <span key={index}>
                          {item + (index !== arr.length - 1 ? ", " : "")}
                        </span>
                      );
                    })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
          ""
        )}
    </div>
  );
};

export default ProductDescription;
