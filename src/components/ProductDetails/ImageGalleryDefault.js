import { Fragment, useEffect, useState, useRef } from "react";
import { LightgalleryProvider } from "react-lightgallery";
import { useProduct } from "../../contexts/ProductContext";
import { imageLoad } from "../../lib/utilities";

const ImageGalleryBottomThumb = () => {
  const {
    product,
    dimHeight,
    dimWidth,
    image,
    frame,
    topMat,
    bottomMat,
    imgCanvas,
    setImage,
    mirrorType,
    price,
    quantity,
    discountedPrice
  } = useProduct();
  const [frameWidth, setFrameWidth] = useState(0);
  const [frameHeight, setFrameHeight] = useState(0);
  const productsWithCanvas = [
    "Picture Framing",
    "Chalkboards",
    "Custom Certificate Framing",
    "Corkboards",
    "Mirrors",
    "Art Mounts",
    "Canvas Printing & Stretching",
    "Acrylic Float Frames",
    "Clip Frames",
  ];
  const [canvas, setCanvas] = useState(null);
  const [canvasWidth, setCanvasWidth] = useState(1);
  const [canvasHeight, setCanvasHeight] = useState(1);
  const [first, setFirst] = useState(true);
  const frameScale = 80;
  const matScale = 100;
  const [scale, setScale] = useState({
    width: null,
    frameScale,
    matScale,
  });

  useEffect(() => {
    const showCanvas = productsWithCanvas.find((p) => p === product.name);
    if (showCanvas) {
      const canvasObj = document.getElementById("canvas");
      const ctx = canvasObj.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.fillStyle = "grey";
      ctx.fillRect(0, 0, canvasObj.width, canvasObj.height);
      setCanvas(canvasObj);
    }
    if (product.displayName === "Chalkboards") {
      setImage({
        data_url: "https://i.imgur.com/7x72WVG.jpg",
      });
    } else if (product.displayName === "Corkboards") {
      setImage({
        data_url: "https://i.imgur.com/2Y0pzdv.jpg",
      });
    }
  }, []);

  useEffect(() => {
    if (product.displayName === "Mirrors") {
      if (
        mirrorType &&
        mirrorType.displayName ===
          "Bevel (Two week turnaround - Adds extra one week to order)"
      ) {
        setImage({
          data_url: "https://i.imgur.com/8dbTjUD.jpg",
        });
      } else {
        setImage({
          data_url: "https://i.imgur.com/KFRCqzi.jpg",
        });
      }
    }
  }, [mirrorType]);

  useEffect(() => {
    const sizeratio = dimHeight / dimWidth;
    const width =
      (333*1.5 * dimWidth) / dimHeight > 500 ? 500 : ((333*1.5 * dimWidth) / dimHeight)-(dimHeight/sizeratio);
    const height =
      (500 * dimHeight) / dimWidth > 500
        ? 500
        : (500 * dimHeight) / dimWidth - dimWidth / sizeratio;
    setCanvasWidth(isNaN(width) ? 333 : width);
    setCanvasHeight(isNaN(height) ? 500 : height);
    if (!scale.width && image) {
      setScale({
        ...scale,
        width: dimWidth,
      });
    } else if (scale.width > 1) {
      if (dimWidth > 0.1) {
        setScale({
          ...scale,
          frameScale: Math.abs(
            frameScale + frameScale * ((scale.width - dimWidth) / scale.width)
          ),
          matScale: Math.abs(
            matScale + matScale * ((scale.width - dimWidth) / scale.width)
          ),
        });
      }
    }
  }, [dimWidth, dimHeight, frame]);

  const setFrameDimensions = () => {
    if (frame) {
      let fWidth = frame?.width || 1;
      let fHeight = frame?.height || 1;
      const { width, height } = getScaledDimensions(
        fWidth,
        fHeight,
        scale.frameScale
      );
      setFrameWidth(() => width);
      setFrameHeight(() => height);
      return {
        width,
        height,
      };
    } else {
      return {
        width: 0,
        height: 0,
      };
    }
  };

  function scaleToFill(img, frameWidth) {
    const {
      top: mTop,
      left: mLeft,
      right: mRight,
      bottom: mBottom,
    } = matScaling(topMat, scale.matScale);
    const {
      top: bTop,
      left: bLeft,
      right: bRight,
      bottom: bBottom,
    } = matScaling(bottomMat, scale.matScale);
    let cWidth = canvasWidth - 2 * frameWidth - mLeft - mRight - bLeft - bRight;
    let cHeight =
      canvasHeight - 2 * frameWidth - mTop - mBottom - bTop - bBottom;
    const canvas = imgCanvas.current;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.clearRect(
      frameWidth + mLeft + bLeft,
      frameWidth + mTop + bTop,
      cWidth,
      cHeight
    );
    if (img) {
      ctx.drawImage(
        img,
        frameWidth + mLeft + bLeft,
        frameWidth + mTop + bTop,
        cWidth,
        cHeight
      );
    } else {
      ctx.clearRect(
        frameWidth + mLeft + bLeft,
        frameWidth + mTop + bTop,
        cWidth,
        cHeight
      );
    }
  }

  useEffect(() => {
    const { width } = setFrameDimensions();
    if (image) {
      var img = new Image();
      img.onload = function () {
        framesSetting(img, width);
      };
      img.setAttribute("crossorigin", "anonymous");
      img.src = image?.data_url;
    } else if (frame || topMat || bottomMat) {
      framesSetting(undefined, width);
    } else {
      if (product.displayName !== "Gift Voucher") {
        const frameCanvas = imgCanvas.current;
        const context = frameCanvas?.getContext("2d");
        context?.clearRect(0, 0, canvasWidth, canvasHeight);
      }
    }
  }, [
    canvasWidth,
    canvasHeight,
    topMat,
    bottomMat,
    frame,
    image,
    first,
    frameWidth,
  ]);

  const getScaledDimensions = (width, height, scale) => {
    const maxWidth = 7.5;
    const multiplier = (width / maxWidth) * scale;
    let dWidth = multiplier;
    let dHeight = multiplier;
    return {
      height: dHeight,
      width: dWidth,
    };
  };

  const TO_RADIANS = Math.PI / 180;

  const framesSetting = (posterImg, frameWidth = 0) => {
    if (frame) {
      const frameCanvas = imgCanvas.current;
      const context = frameCanvas.getContext("2d");
      context.imageSmoothingEnabled = true;
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = frame?.horizontalBorderImage?.url;
      // img.setAttribute("crossorigin", "anonymous");
      img.onload = function () {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.save();
        context.translate(0, 0);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(canvasWidth, 0);
        context.lineTo(canvasWidth - frameWidth, frameWidth);
        context.lineTo(frameWidth, frameWidth);
        context.closePath();
        context.clip();
        context.drawImage(img, 0, 0, canvasWidth, frameWidth);
        context.restore();

        context.save();
        context.translate(canvasWidth, 0);
        context.rotate(90 * TO_RADIANS);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(canvasHeight, 0);
        context.lineTo(canvasHeight - frameWidth, frameWidth);
        context.lineTo(frameWidth, frameWidth);
        context.closePath();
        context.clip();
        context.drawImage(img, 0, 0, canvasHeight, frameWidth);
        context.restore();

        context.save();
        context.translate(canvasWidth, canvasHeight);
        context.rotate(180 * TO_RADIANS);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(canvasWidth, 0);
        context.lineTo(canvasWidth - frameWidth, frameWidth);
        context.lineTo(frameWidth, frameWidth);
        context.closePath();
        context.clip();
        context.drawImage(img, 0, 0, canvasWidth, frameWidth);
        context.restore();

        context.save();
        context.translate(0, canvasHeight);
        context.rotate(270 * TO_RADIANS);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(canvasHeight, 0);
        context.lineTo(canvasHeight - frameWidth, frameWidth);
        context.lineTo(frameWidth, frameWidth);
        context.closePath();
        context.clip();
        context.drawImage(img, 0, 0, canvasHeight, frameWidth);
        context.restore();

        if (topMat || bottomMat) {
          matSettings(posterImg, frameWidth);
        } else if (posterImg) {
          scaleToFill(posterImg, frameWidth);
        }
        if (first) {
          setFirst(false);
        }
      };
    } else {
      if (topMat || bottomMat) {
        matSettings(posterImg, frameWidth);
      }

      if (posterImg) {
        scaleToFill(posterImg, frameWidth);
      }

      if (first) {
        setFirst(false);
      }
    }
  };

  const matScaling = (mat, scale = matScale) => {
    let { top = 0, left = 0, right = 0, bottom = 0 } = mat || {};
    const max = Math.max(top, left, right, bottom);
    scale = (max * scale) / 5;
    const mTop = (top / (top + left + right + bottom || 1)) * scale;
    const mLeft = (left / (top + left + right + bottom || 1)) * scale;
    const mRight = (right / (top + left + right + bottom || 1)) * scale;
    const mBottom = (bottom / (top + left + right + bottom || 1)) * scale;
    return {
      top: mTop,
      left: mLeft,
      right: mRight,
      bottom: mBottom,
    };
  };

  const matSettings = async (posterImg, frameWidth) => {
    const frameCanvas = imgCanvas.current;
    const context = frameCanvas.getContext("2d");
    let mWidth = canvasWidth - 2 * frameWidth;
    let mHeight = canvasHeight - 2 * frameWidth;
    let x = frameWidth;
    let y = frameWidth;
    if (topMat) {
      context.clearRect(x, y, mWidth, mHeight);
      const topMatImg = await imageLoad(topMat.image);
      const ptrn = context.createPattern(topMatImg, "repeat");
      context.fillStyle = ptrn;
      context.fillRect(x, y, mWidth, mHeight);
    }

    if (bottomMat) {
      const { top, left, right, bottom } = matScaling(topMat, 100);

      mWidth = mWidth - left - right;
      mHeight = mHeight - top - bottom;
      x = frameWidth + left;
      y = frameWidth + top;
      context.clearRect(x, y, mWidth, mHeight);
      const bottomMatImg = await imageLoad(bottomMat.image);
      const ptrn = context.createPattern(bottomMatImg, "repeat");
      context.fillStyle = ptrn;
      context.fillRect(x, y, mWidth, mHeight);
    }

    if (posterImg) {
      scaleToFill(posterImg, frameWidth);
    } else {
      scaleToFill("", frameWidth);
    }
  };

  return (
    <Fragment>
      <div className="product-large-image-wrapper space-mb--30">
        {/* floating badges */}
        <div className="product-large-image-wrapper__floating-badges">
          {
            product.discount && product.discount > 0
              ?
              <span className="total-amount">${ quantity ?  (discountedPrice * quantity).toFixed(0) : discountedPrice.toFixed(0)}</span>
              :
              <span className="total-amount">${ quantity ?  (price * quantity).toFixed(0) : price.toFixed(0)}</span>
          }
          {product.discount && product.discount > 0 ? (
            <span className="onsale">-{product.discount}%</span>
          ) : (
            ""
          )}
          {product.new ? <span className="hot">New</span> : ""}
          {product.stock && product.stock === 0 ? (
            <span className="out-of-stock">out</span>
          ) : (
            ""
          )}          
        </div>

        <LightgalleryProvider>
          <div className="single-image mx-auto">
            {productsWithCanvas.find((p) => p === product.displayName) ? (
              <>
                <canvas
                  id="frame"
                  width={canvasWidth}
                  height={canvasHeight}
                  ref={imgCanvas}
                  // style={{imageRendering: "pixelated"}}
                />
              </>
            ) : (
              <img
                src={process.env.PUBLIC_URL + product.images[0].url}
                className="img-fluid mx-auto"
                alt=""
              />
            )}
          </div>
        </LightgalleryProvider>
      </div>
    </Fragment>
  );
};

export default ImageGalleryBottomThumb;
