import { useEffect } from "react";
import { createContext, useState, useContext, useRef } from "react";

export const ProductContext = createContext();

export function useProduct() {
  return useContext(ProductContext);
}

export const ProductProvider = ({ product, configurations, children }) => {
  //for ui purposes only
  const [dimension, setDimension] = useState(null);
  const [dimUnit, setDimUnit] = useState("cm");
  const [dimSizing, setDimSizing] = useState("image-size");
  const [ratio, setRatio] = useState(null);
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [orientation, setOrientation] = useState("portrait");

  //for sending to api
  const [dimWidth, setDimWidth] = useState(1); //imageWidth
  const [dimHeight, setDimHeight] = useState(1); //imageHeight
  const [image, setImage] = useState(null);
  const [frame, setFrame] = useState(null);
  const [paper, setPaper] = useState(null);
  const [glass, setGlass] = useState(null);
  const [mirrorType, setMirrorType] = useState(null);
  const [backing, setBacking] = useState(null);
  const [topMat, setTopMat] = useState(null);
  const [bottomMat, setBottomMat] = useState(null);
  const [stretch, setStretch] = useState(null);
  const [edge, setEdge] = useState(null);
  const [edgeWidth, setEdgeWidth] = useState(null);
  const [price, setPrice] = useState(0.0);
  const [quantity, setQuantity] = useState(1);
  const [toEmail, setToEmail] = useState("");
  const [toName, setToName] = useState("");
  const [fromName, setFromName] = useState("");
  const [message, setMessage] = useState("");
  const [imgHeightCM, setImgHeightCM] = useState(60);
  const [imgWidthCM, setImgWidthCM] = useState(40);
  const imgCanvas = useRef(null);
  const [previousFrame, setPreviousFrame] = useState(null);
  const [defaultGlassType, setDefaultGlassType] = useState(null);
  const [enableTopMat, setEnableTopMat] = useState(false);
  const [enableBotMat, setEnableBotMat] = useState(false);
  const [resetDim, setResetDim] = useState(false);
  const [defaultDim, setDefaultDim] = useState(null);
  const [defaultStretch, setDefaultStretch] = useState(null)

  const [defaultConfig, setDefaultConfig] = useState({});
  const [images, setImages] = useState([]);
  const [productConfig, setProductConfig] = useState();

  useEffect(() => {
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
    setProductConfig(c);
  }, [
    dimWidth,
    dimHeight,
    frame,
    edge,
    paper,
    edgeWidth,
    stretch,
    glass,
    mirrorType,
    backing,
    topMat,
    bottomMat,
  ]);

  return (
    <ProductContext.Provider
      value={{
        orientation,
        setOrientation,
        dimension,
        setDimension,
        dimUnit,
        setDimUnit,
        dimWidth,
        setDimWidth,
        dimHeight,
        dimSizing,
        setDimSizing,
        setDimHeight,
        image,
        setImage,
        frame,
        setFrame,
        previousFrame,
        setPreviousFrame,
        paper,
        setPaper,
        glass,
        setGlass,
        mirrorType,
        setMirrorType,
        backing,
        setBacking,
        topMat,
        setTopMat,
        bottomMat,
        setBottomMat,
        stretch,
        setStretch,
        edge,
        setEdge,
        edgeWidth,
        setEdgeWidth,
        ratio,
        setRatio,
        product,
        configurations,
        price,
        setPrice,
        discountedPrice,
        setDiscountedPrice,
        quantity,
        setQuantity,
        toEmail,
        setToEmail,
        toName,
        setToName,
        fromName,
        setFromName,
        message,
        setMessage,
        imgHeightCM,
        setImgHeightCM,
        imgWidthCM,
        setImgWidthCM,
        imgCanvas,
        defaultConfig,
        setDefaultConfig,
        images,
        setImages,
        defaultGlassType,
        setDefaultGlassType,
        enableTopMat,
        setEnableTopMat,
        enableBotMat,
        setEnableBotMat,
        resetDim,
        setResetDim,
        defaultDim,
        setDefaultDim,
        productConfig,
        defaultStretch,
        setDefaultStretch
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
