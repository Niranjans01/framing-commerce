import {
  UploadZone,
  FrameStyle,
  ImageSize,
  PrintStyle,
  GlassStyle,
  MatStyle,
  BackingStyle,
  MirrorTypeStyle,
  StretchStyle,
  EdgeStyle,
  EdgeWidthStyle,
} from "../../components/Product";
import Swiper from "react-id-swiper";
import {
  ImageGalleryDefault,
  ProductDescription,
  ProductDescriptionTab,
} from "../../components/ProductDetails";
import { Container, Row, Col } from "react-bootstrap";
import StickyBox from "react-sticky-box";
import { useProduct } from "../../contexts/ProductContext";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useEffect, useState } from "react";
import SampleModal from "../ProductThumb/SampleModal";

const Configurations = () => {
  const { product, productConfig } = useProduct();

  const [swiperImages, setSwiperImages] = useState([]);
  const [sampleId, setSampleId] = useState(null);

  useEffect(() => {
    setSwiperImages(product.images.slice(1));
  }, [product]);

  const configDisplayItem = (config) => {
    if (config.type === "dimension") {
      return `Image size: ${config.value.width}x${config.value.height}`;
    } else if (config.type.indexOf("mat") > -1) {
      return `${config.type.split("_").join(" ")}: ${config.value.color}`;
    } else {
      return `${config.type}: ${config.displayName}`;
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

  return (
    <Container>
      <Row className="bg-grey">
        {/* image gallery bottom thumb */}
        <Col lg={6} className="space-mb-mobile-only--50 mr-top-20">
          <StickyBox offsetTop={90} offsetBottom={90}>
            <ImageGalleryDefault />
          </StickyBox>
        </Col>

        <Col lg={6} className="mr-top-20">
          {product.configurations.find((i) => i.name === "image") ? (
            <UploadZone />
          ) : null}
          {product.configurations.find((i) => i.name === "dimension") ? (
            <ImageSize />
          ) : null}
          {product.configurations.find((i) => i.name === "print") ? (
            <PrintStyle />
          ) : null}
          {product.configurations.find((i) => i.name === "stretching") ? (
            <StretchStyle />
          ) : null}
          {product.configurations.find((i) => i.name === "edge") ? (
            <EdgeStyle />
          ) : null}
          {product.configurations.find((i) => i.name === "edge_width") ? (
            <EdgeWidthStyle />
          ) : null}
          {product.configurations.find((i) => i.name === "mirror") ? (
            <MirrorTypeStyle />
          ) : null}
          {product.configurations.find((i) => i.name === "mat") ? (
            <MatStyle />
          ) : null}
          {product.configurations.find((i) => i.name === "frame") ? (
            <FrameStyle />
          ) : null}
          {product.configurations.find((i) => i.name === "glass") ? (
            <GlassStyle />
          ) : null}
          {product.configurations.find((i) => i.name === "backing") ? (
            <BackingStyle />
          ) : null}

          <ProductDescription />
        </Col>
      </Row>
      <Row>
        <Col>
          {productConfig ? (
            <div className="product-variation product-config">
              {productConfig.configurations.map((config) => (
                <div className="config-type">
                  <span className="config-span">
                    {configDisplayItem(config)}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="product-small-image-wrapper sample-wrapper">
            <Swiper {...thumbnailSwiperParams} key={swiperImages}>
              {swiperImages.map((i, idx) => {
                return (
                  <div
                    className="swiper-frame"
                    key={i.id}
                    onClick={() => setSampleId(idx)}
                  >
                    <img
                      src={i.url}
                      className="img-fluid frame sample-image"
                      alt=""
                    />
                  </div>
                );
              })}
            </Swiper>
            <SampleModal
              show={sampleId !== null}
              onHide={() => {
                setSampleId(null);
              }}
              active={sampleId}
              images={swiperImages}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          {/* product description tab */}
          <ProductDescriptionTab />
        </Col>
      </Row>
    </Container>
  );
};

export default Configurations;
