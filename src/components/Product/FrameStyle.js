import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Swiper from "react-id-swiper";
import { Col, Row } from "react-bootstrap";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import { useProduct } from "../../contexts/ProductContext";
import { usePrice } from "../../contexts/PriceContext";

const FrameStyle = () => {
  const {
    frame,
    product,
    configurations,
    setFrame,
    previousFrame,
    setPreviousFrame,
    defaultConfig,
    setDefaultConfig,
  } = useProduct();
  const priceMatrix = usePrice();
  const [options, setOptions] = useState([]);

  const [filter, setFilter] = useState("black");
  const [sort, setSort] = useState("smallest-first");
  const [filteredAndSorted, setFilteredAndSorted] = useState([]);
  const [hideOptionalText, setHideOptionalText] = useState(false);

  useEffect(() => {
    if (product && priceMatrix) {
      if (product.displayName == 'Mirrors' || product.displayName == "Custom Certificate Framing" || product.displayName == "Picture Framing") {
        setHideOptionalText(true);
      }
      let frames = configurations.frame;
      // console.log("these are the frames:::",frames)
      frames = frames?.map((f) => {
        const priceCode = priceMatrix.find((i) => i.id === f.priceCode);
        if (priceCode) {
          f.code = priceCode.displayName;
        }
        return f;
      });
      const defaultFrame = frames?.find(
        (e) => e.displayName === "XC20B" || e.displayName === "120BLK"
      );
      // setFrame(defaultFrame||frames[0]);
      // const defaultFrame = frames?.find(
      //   (e) => e.isDefault
      // );
      // setFrame(frames[0]);
      setOptions(frames);
      setFilteredAndSorted(frames);
    }
  }, [product, configurations, priceMatrix]);

  useEffect(() => {
    if (options) {
      applyConfigurations(sort, filter);
    }
  }, [options]);
  useEffect(()=>{
    if (product.displayName === "Custom Certificate Framing") {
      setFilter("certificate");
    }
  },[])

  const applyFrame = (selected) => {
    if (frame && selected.displayName == frame.displayName) {
      setFrame(null);
      setPreviousFrame(null);
    } else {
      setFrame(selected);
    }
  };

  const thumbnailSwiperParams = {
    spaceBetween: 30,
    slidesPerView: 4,
    loop: false,
    slideToClickedSlide: false,
    allowTouchMove: false,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    renderPrevButton: () => (
      <button
        className="swiper-button-prev ht-swiper-button-nav"
        style={{
          height: "2em",
          backgroundColor: "#7e7e7e",
          borderRadius: "100%",
        }}
      >
        <IoIosArrowBack style={{ color: "white" }} />
      </button>
    ),
    renderNextButton: () => (
      <button
        className="swiper-button-next ht-swiper-button-nav"
        style={{
          height: "2em",
          backgroundColor: "#7e7e7e",
          borderRadius: "100%",
        }}
      >
        <IoIosArrowForward style={{ color: "white" }} />
      </button>
    ),
  };

  const filterFrames = (key, items) => {
    if (key === "all") {
      return options;
    }
    if(key!=="ornate"){
      return items.filter((i) => i.color === key);
    }
    else{
      return items.filter((i) => i.isOrnate === true);
    }
  };

  const applyConfigurations = (toSort, toFilter) => {
    if (options) {
      if (toSort === "smallest-first") {
        const sorted = options.sort(function (a, b) {
          return a.width - b.width;
        });
        setFilteredAndSorted(filterFrames(toFilter, sorted));
      } else if (toSort === "largest-first") {
        const sorted = options.sort(function (a, b) {
          return b.width - a.width;
        });
        setFilteredAndSorted(filterFrames(toFilter, sorted));
      } else if (toSort === "low-to-high") {
        const sorted = options.sort(function (a, b) {
          return a.code - b.code;
        });
        setFilteredAndSorted(filterFrames(toFilter, sorted));
      } else if (toSort === "high-to-low") {
        const sorted = options.sort(function (a, b) {
          return b.code - a.code;
        });
        setFilteredAndSorted(filterFrames(toFilter, sorted));
      } else {
        if (options.length > 1) {
          setFilteredAndSorted(filterFrames(toFilter, options));
        }
      }
      setFilter(toFilter);
      setSort(toSort);
    }
  };

  return (
    <div className="product-details space-mb-mobile-only--50">
      {/* {console.log("This forms the sort:::",sort,filteredAndSorted)} */}
      <Card className="single-my-account space-mb--20">
        <Card.Header className="panel-heading">
          <h4 className="panel-title">{`Choose your frame ${hideOptionalText ? '' : '(Optional)'}`}</h4>
        </Card.Header>
        <Card.Body>
          <Row className="align-items-center space-mb--20">
            <Col
              md={6}
              className="product-details__filter-icons product-details__filter-icons__dropdown-wrapper"
            >
              <select
                onChange={(e) => applyConfigurations(sort, e.target.value)}
                value={filter}
              >
                <option value="all">All</option>
                {product.displayName === "Custom Certificate Framing" ? (
                  <option value="certificate">Certificate frames</option>
                ) : null}
                {product.displayName !== "Canvas Printing & Stretching" ? (
                  <>
                    <option value="black">Black</option>
                    <option value="white">White</option>
                    <option value="colour">Colourful</option>
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                    <option value="timber">Raw Timber</option>
                    <option value="ornate">Ornate</option>
                  </>
                ) : product.displayName === "Canvas Printing & Stretching" ? (
                  <option value="canvasFloatFrame">Canvas float frames</option>
                ) : null}
              </select>
            </Col>
            <Col
              md={6}
              className="product-details__filter-icons product-details__filter-icons__dropdown-wrapper"
            >
              <select
                onChange={(e) => applyConfigurations(e.target.value, filter)}
                value={sort}
              >
                <option value="high-to-low">Price - High to Low</option>
                <option value="low-to-high">Price - Low to High</option>
                <option value="smallest-first">Width - Smallest first</option>
                <option value="largest-first">Width - Largest first</option>
              </select>
            </Col>
          </Row>
          <Row>
            {filteredAndSorted && filteredAndSorted.length > 0 ? (
              <Col md={12}>
                <div className="product-small-image-wrapper">
                  <Swiper
                    {...thumbnailSwiperParams}
                    key={filteredAndSorted.length}
                  >
                    {filteredAndSorted.map((i) => {
                      return (
                        <div
                          className={
                            frame?.displayName === i?.displayName
                              ? "frame-border swiper-frame"
                              : "swiper-frame"
                          }
                          key={i.id}
                          value={i.displayName}
                          onClick={() => {
                            const selected = options.find(
                              (frame) => i.displayName === frame.displayName
                            );
                            applyFrame(selected);
                          }}
                        >
                          {i.verticalBorderImage ? (
                            <img
                              data-id={i.displayName}
                              src={i.verticalBorderImage.url}
                              className="img-fluid frame"
                              alt=""
                            />
                          ) : (
                            <img
                              data-id={i.displayName}
                              src={
                                process.env.PUBLIC_URL +
                                "/assets/images/product/decor/1.jpg"
                              }
                              className="img-fluid frame"
                              alt=""
                            />
                          )}
                          <div className="frame-description">
                            <div>{i.displayName}</div>
                            <div>Width: {i.width} cm</div>
                            <div className="bold">{i.info}</div>
                          </div>
                        </div>
                      );
                    })}
                  </Swiper>
                </div>
              </Col>
            ) : (
              ""
            )}
          </Row>
          {product.displayName === "Canvas Printing & Stretching" ? (
            <div className="show-canvas-frames">Canvas float frames</div>
          ) : null}
        </Card.Body>
      </Card>
    </div>
  );
};

export default FrameStyle;
