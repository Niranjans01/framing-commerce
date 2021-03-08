import Card from "react-bootstrap/Card";
import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AiFillLock } from "react-icons/ai";
import { MdInfoOutline } from "react-icons/md";
import { Tooltip } from "react-tippy";
import { round } from "../../lib/utilities";

import { useProduct } from "../../contexts/ProductContext";

const ImageSize = () => {
  const {
    product,
    configurations,
    setDimension,
    image,
    dimUnit,
    setDimUnit,
    dimSizing,
    setDimSizing,
    setDimHeight,
    setDimWidth,
    dimHeight,
    dimWidth,
    ratio,
    frame,
    imgHeightCM,
    imgWidthCM,
    setImgHeightCM,
    setImgWidthCM,
    dimension,
    previousFrame,
    setPreviousFrame,
    resetDim,
    setResetDim,
    setDefaultDim,
    orientation,
    setOrientation,
  } = useProduct();

  const [width, setWidth] = useState(dimWidth);
  const [height, setHeight] = useState(dimHeight);

  useEffect(() => {
    if (product) {
      if (configurations && configurations.dimension.length > 1) {
        const dimension = configurations.dimension;
        const defaultDimension =
          dimension?.find((e) => e.isDefault) || dimension[0];
          setResetDim(true);
          setDimWidth(dimUnit === "cm" ? 40 : 40 / 2.54);
          setDimHeight(dimUnit === "cm" ? 60 : 60 / 2.54);
        // setDimension(defaultDimension || dimension?.[0]);
        // setDefaultDim(defaultDimension);
      } else {
        setDimWidth(dimUnit === "cm" ? 40 : 40 / 2.54);
        setDimHeight(dimUnit === "cm" ? 60 : 60 / 2.54);
      }
    }
  }, [product, configurations]);

  useEffect(() => {
    if (dimUnit === "cm") {
      setWidth(dimWidth);
      setHeight(dimHeight);
      setImgHeightCM(dimHeight);
      setImgWidthCM(dimWidth);
    } else {
      setHeight(round(dimHeight / 2.54, 1)); //base is cm
      setWidth(round(dimWidth / 2.54, 1));
    }
  }, [dimWidth, dimHeight]);

  useEffect(()=>{
    let matching_dimension = configurations.dimension.find(
      (e) =>
        (e.height === height && e.width === width) ||
        (e.height === width && e.width === height)
    );
    if (matching_dimension) {
      setResetDim(false);
      setDimension(matching_dimension);
    } else {
      setResetDim(true);
    }
    if(resetDim){
      if (height > width) {
        setOrientation("portrait");
      } else {
        setOrientation("landscape");
      }
    }
  },[height,width])

  useEffect(() => {
    if (dimension) {
      if(orientation==="portrait"){
        setDimHeight(
          dimUnit === "cm"
            ? dimension?.height
            : dimension?.height / 2.54
        );
        setDimWidth(
          dimUnit === "cm"
            ? dimension?.width
            : dimension?.width / 2.54
        );
      }
      else{
        setDimWidth(
          dimUnit === "cm"
            ? dimension?.height
            : dimension?.height / 2.54
        );
        setDimHeight(
          dimUnit === "cm"
            ? dimension?.width
            : dimension?.width / 2.54
        );
      }
    }
  }, [dimension])

  useEffect(() => {
    let expectedHeight = imgHeightCM;
    let expectedWidth = imgWidthCM;
    if (frame && previousFrame !== null && previousFrame.id !== frame.id) {
      expectedHeight = dimHeight;
      expectedWidth = dimWidth;
      setPreviousFrame(frame);
    }
    if (
      dimension &&
      dimension.displayName !== "custom" &&
      dimension.displayName !== "Corks & Chalks"
    ) {
      if(orientation==="portrait"){
        expectedHeight = dimension.height;
        expectedWidth = dimension.width;
      }
      else{
        expectedHeight = dimension.width;
        expectedWidth = dimension.height;
      }
    }
    if (dimSizing === "overall-size") {
      let frameHeight,frameWidth;
      if(orientation==="portrait"){
        frameHeight = frame ? frame.height : 0;
        frameWidth = frame ? frame.width : 0;
      }
      else{
        frameHeight = frame ? frame.width : 0;
        frameWidth = frame ? frame.height : 0;
      }
      setDimHeight(
        round(
          expectedHeight - 2 * frameHeight < 0
            ? 1
            : expectedHeight - 2 * frameHeight,
          1
        )
      );
      setDimWidth(
        round(
          expectedWidth - 2 * frameWidth < 0
            ? 1
            : expectedWidth - 2 * frameWidth,
          1
        )
      );
    } else {
      setDimHeight(expectedHeight);
      setDimWidth(expectedWidth);
    }
    if (previousFrame === null && frame) {
      setPreviousFrame(frame);
    }
  }, [dimSizing, frame]);

  const setImageDimensions = (height, width) => {
    if (dimUnit === "cm") {
      setDimHeight(height);
      setDimWidth(width);
    } else {
      setDimHeight(height * 2.54);
      setDimWidth(width * 2.54);
    }
  };

  const changeWidth = (type, event) => {
    let imgWidth = dimWidth,
      imgHeight = dimHeight;
    if (dimUnit === "in") {
      imgHeight = imgHeight / 2.54;
      imgWidth = imgWidth / 2.54;
    }
    if (type === "decrease" && imgWidth>10) {
      imgWidth = round(imgWidth >= 0.0 ? imgWidth - 0.1 : 0.0, 1);
      setResetDim(true);
      if (ratio) {
        imgHeight = round((imgWidth >= 0 ? imgWidth - 0.1 : 0.0) / ratio, 1);
      }
    } else if (type === "increase" && imgWidth<101.5) {
      imgWidth = round(imgWidth + 0.1, 1);
      setResetDim(true);
      if (ratio) {
        imgHeight = round((imgWidth + 0.1) / ratio, 1);
      }
    } else if (type === "change") {
      imgWidth = parseFloat(event.target.value);
      setResetDim(true);
      if (ratio) {
        imgHeight = round(parseFloat(event.target.value) / ratio, 1);
      }
    }
      setImageDimensions(imgHeight, imgWidth);
  };

  const setSizeWithDimensions = (selected) => {
    if (selected && selected.width && selected.height) {
      setDimWidth(dimUnit === "cm" ? selected?.width : selected?.width / 2.54);
      setDimHeight(
        dimUnit === "cm" ? selected?.height : selected?.height / 2.54
      );
    }
  };

  let changeOrientation = (value) => {
    if (value && value === "portrait") {
      setDimHeight(parseFloat(Math.max(dimHeight, dimWidth)));
      setDimWidth(parseFloat(Math.min(dimHeight, dimWidth)));
      setOrientation("portrait");
    }
    if (value && value === "landscape") {
      setDimWidth(parseFloat(Math.max(dimHeight, dimWidth)));
      setDimHeight(parseFloat(Math.min(dimHeight, dimWidth)));
      setOrientation("landscape");
    }
  };

  const changeHeight = (type, event) => {
    let imgWidth = dimWidth,
      imgHeight = dimHeight;
    if (dimUnit === "in") {
      imgHeight = imgHeight / 2.54;
      imgWidth = imgWidth / 2.54;
    }
    if (type === "decrease" && imgHeight>10) {
      imgHeight = round(imgHeight >= 0.0 ? imgHeight - 0.1 : 0.0, 1);
      setResetDim(true);
      if (ratio) {
        imgWidth = round((imgHeight >= 0 ? imgHeight - 0.1 : 0.0) * ratio, 1);
      }
    } else if (type === "increase" && imgHeight<152.5) {
      imgHeight = round(imgHeight + 0.1, 1);
      setResetDim(true);
      if (ratio) {
        imgWidth = round((imgHeight + 0.1) * ratio, 1);
      }
    } else if (type === "change") {
      imgHeight = parseFloat(event.target.value);
        setResetDim(true);
      if (ratio) {
        imgWidth = round(imgHeight * ratio, 1);
      }
    }
      setImageDimensions(imgHeight, imgWidth);
  };
  return (
    <div className="product-details space-mb-mobile-only--50">
      <Card className="single-my-account space-mb--20">
        <Card.Header className="panel-heading">
          <h4 className="panel-title">Choose your dimensions</h4>
        </Card.Header>
        <Card.Body>
          <div className="product-sizing">
            <Row className="space-mt-mobile-only--20">
              <Col md={4} xs={4}>
                <span>Units</span>
              </Col>
              <Col md={4} xs={4} className="product-sizing__units-selector">
                <div>
                  <input
                    type="radio"
                    id="cm"
                    value="cm"
                    name="unit"
                    checked={dimUnit ? dimUnit === "cm" : false}
                    onChange={() => {
                      setDimUnit("cm");
                      setHeight(round(dimHeight, 1));
                      setWidth(round(dimWidth, 1));
                    }}
                  />
                  <label htmlFor="cm">cm</label>
                </div>
              </Col>
              <Col md={4} xs={4} className="product-sizing__units-selector">
                <div>
                  <input
                    type="radio"
                    id="in"
                    value="in"
                    name="unit"
                    checked={dimUnit ? dimUnit === "in" : false}
                    onChange={() => {
                      setDimUnit("in");
                      setHeight(round(dimHeight / 2.54, 1));
                      setWidth(round(dimWidth / 2.54, 1));
                    }}
                  />
                  <label htmlFor="in">inch</label>
                </div>
              </Col>
            </Row>
            <Row className="space-mt-mobile-only--20">
              <Col md={4} xs={4}>
                <span>Orientation</span>
              </Col>
              <Col md={4} xs={4} className="product-sizing__units-selector">
                <div>
                  <input
                    type="radio"
                    id="portrait"
                    checked={orientation ? orientation === "portrait" : false}
                    onChange={() => {
                      changeOrientation("portrait");
                    }}
                  />
                  <label htmlFor="portrait">Portrait</label>
                </div>
              </Col>
              <Col md={4} xs={4} className="product-sizing__units-selector">
                <div>
                  <input
                    type="radio"
                    id="landscape"
                    checked={orientation ? orientation === "landscape" : false}
                    onChange={() => {
                      changeOrientation("landscape");
                    }}
                  />
                  <label htmlFor="landscape">Landscape</label>
                </div>
              </Col>
            </Row>
            {product ? (
              product.category !== "other-products" && product.displayName != "Custom Certificate Framing" ? (
                <Row className="space-mt-mobile-only--20">
                  <Col md={4} xs={4}>
                    <span>Sizing</span>
                  </Col>
                  <Col md={4} xs={4} className="product-sizing__units-selector">
                    <div>
                      <input
                        type="radio"
                        id="image-size"
                        checked={dimSizing ? dimSizing === "image-size" : false}
                        onChange={() => {
                          setDimSizing("image-size");
                        }}
                      />
                      <label htmlFor="image-size">
                        {product.displayName.toLowerCase() === "mirrors"
                          ? "Mirror"
                          : product.displayName.toLowerCase() === "corkboards"
                          ? "Cork"
                          : product.displayName.toLowerCase() === "chalkboards"
                          ? "Chalk"
                          : product.displayName.toLowerCase() ===
                            "Custom Certificate Framing"
                          ? "Certificate"
                          : "Image"}{" "}
                        Size
                      </label>
                    </div>
                  </Col>
                  <Col md={4} xs={4} className="product-sizing__units-selector">
                    <div>
                      <input
                        type="radio"
                        id="overall-size"
                        checked={
                          dimSizing ? dimSizing === "overall-size" : false
                        }
                        onChange={() => {
                          setDimSizing("overall-size");
                        }}
                      />
                      <label htmlFor="overall-size">Overall Size</label>
                    </div>
                  </Col>
                </Row>
              ) : null
            ) : null}
            <Row className="product-sizing__units-selector mb-5">
              <Col md={4}>
                <span>
                  {product.displayName != "Custom Certificate Framing" ? "Custom Size" : "Certificate Size"}
                </span>{" "}
                <span className="info-message">
                      Min: 10 x 10 cm, <br/>Max: 101.5 x 152.5 cm
                    </span>
                {/*TODO: This must be dynamic depending on what the user selected on prev row */}
              </Col>
              <Col md={4} xs={12}>
                <div className="product-sizing__frame-image-size space-mt-mobile-only--30">
                  <button onClick={() => changeWidth("decrease")}>-</button>
                  <input
                    id="width"
                    type="number"
                    value={width}
                    placeholder="Width"
                    onChange={(e) => changeWidth("change", e)}
                  />
                  <button onClick={() => changeWidth("increase")}>+</button>
                </div>
                <div className="product-options__label">
                  <span>width</span>
                </div>
              </Col>
              <Col md={4} xs={12}>
                <div className="product-sizing__frame-image-size space-mt-mobile-only--30">
                  <button onClick={() => changeHeight("decrease")}>-</button>
                  <input
                    id="height"
                    type="number"
                    value={height}
                    placeholder="Height"
                    onChange={(e) => changeHeight("change", e)}
                  />
                  <button onClick={() => changeHeight("increase")}>+</button>
                </div>
                <div className="product-options__label">
                  <span>height</span>
                </div>
              </Col>
            </Row>
            {image ? (
              <Row>
                <Col className="product-options__option-name">
                  <div className="product-options__mat-options">
                    <span className="info-message">
                      Image ratio is locked. <AiFillLock />
                    </span>
                    {"    "}
                    <Tooltip
                      position="bottom"
                      trigger="mouseenter"
                      animation="shift"
                      arrow={false}
                      duration={200}
                      html={
                        <p>
                          To prevent image stretching on resize, we
                          automatically adjusts the height when you change the
                          width and vice versa.
                        </p>
                      }
                    >
                      <MdInfoOutline />
                    </Tooltip>
                  </div>
                </Col>
              </Row>
            ) : (
              ""
            )}
            {configurations && configurations.dimension.length > 1 ? (
              <Row className="space-mt-mobile-only--30">
                <Col md={4} xs={4}>
                  <span>Or select a standard size</span>
                </Col>
                <Col md={8} xs={8}>
                  <select
                    id="standard-size-selector"
                    value={resetDim ? "default" : dimension?.id}
                    // value="default"
                    onChange={(e) => {
                      const selected = configurations.dimension.find(
                        (i) => i.id === e.target.value
                      );
                      setResetDim(false);
                      setDimension(selected);
                      setSizeWithDimensions(selected);
                    }}
                  >
                    <option value="default">Select size</option>
                    {configurations.dimension
                      .filter((element) => element.isCustom !== true)
                      .sort((a, b) =>
                        a.displayName
                          .substring(0, 2)
                          .localeCompare(b.displayName.substring(0, 2), "en", {
                            numeric: true,
                          })
                      )
                      .map((i) => {
                        return (
                          <option key={i.displayName} value={i.id}>
                            {i.displayName}
                          </option>
                        );
                      })}
                  </select>
                </Col>
              </Row>
            ) : null}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ImageSize;
