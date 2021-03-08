import { Modal, Row, Col } from "react-bootstrap";
import Swiper from "react-id-swiper";

export default function SampleModal({ show, onHide, images = [], active = 0 }) {
  const gallerySwiperParams = {
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  };

  return (
    <div>
      <Modal
        show={show}
        onHide={onHide}
        className="product-quickview sample-view"
        centered
      >
        <Modal.Body>
          <Modal.Header closeButton></Modal.Header>
          <Row>
            <Col md={12} sm={12}>
              <Swiper
                containerClass="swiper-container"
                {...gallerySwiperParams}
                activeSlideKey={active?.toString()}
              >
                {images.map((single, key) => {
                  return (
                    <div className="single-image" key={key.toString()}>
                      <img src={single.url} className="img-fluid" alt="" />
                    </div>
                  );
                })}
              </Swiper>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
}
