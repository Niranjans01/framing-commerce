import { useEffect, useState } from "react";
import { useProduct } from "../../contexts/ProductContext";
import { Card, Row, Col } from "react-bootstrap";
import { round } from "../../lib/utilities";

const GiftVoucher = ({ setIsError }) => {
  const [error, setError] = useState(null);

  const {
    product,
    price,
    setPrice,
    toEmail,
    setToEmail,
    toName,
    setToName,
    fromName,
    setFromName,
    message,
    setMessage,
  } = useProduct();

  useEffect(() => {
    setPrice(product.price);
  }, [product]);

  const priceStepChange = (step) => {
    const minPrice = product["min-price"];
    let calculatedPrice;
    if (step === 1) {
      calculatedPrice = round(parseFloat(price+1),2);
    } else if (step === -1) {
      calculatedPrice =
        parseFloat(price) > parseFloat(minPrice)
          ? round(parseFloat(price-1),2)
          : round(parseFloat(minPrice),2);
    }
    setPrice(calculatedPrice);
  };

  useEffect(() => {
    setIsError(!!error);
  }, [error]);

  useEffect(() => {
    if (price < parseFloat(product["min-price"])) {
      setError(`Minimum price must be ${product["min-price"]}`);
    } else {
      setError(null);
    }
  }, [price]);

  return (
    <div className="product-details space-mb-mobile-only--50">
      <Card className="single-my-account space-mb--20">
        <Card.Header className="panel-heading">
          <h4 className="panel-title">To:</h4>
        </Card.Header>
        <Card.Body>
          <div className="product-options">
            <Row className="space-mb-mobile-only--30">
              <Col md={4} className="product-options__option-name space-mb--20">
                <span>Recipient Name</span>
              </Col>
              <Col md={8}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={toName}
                  onChange={(e) => {
                    setToName(e.target.value);
                  }}
                />
              </Col>
            </Row>
            <Row className="space-mb-mobile-only--30">
              <Col md={4} className="product-options__option-name space-mb--20">
                <span>Recipient Email</span>
              </Col>
              <Col md={8}>
                <input
                  type="email"
                  placeholder="Email"
                  value={toEmail}
                  onChange={(e) => {
                    setToEmail(e.target.value);
                  }}
                />
              </Col>
            </Row>
            <Row className="space-mb-mobile-only--30">
              <Col md={4} className="product-options__option-name space-mb--20">
                <span>Message</span>
              </Col>
              <Col md={8}>
                <textarea
                  rows={5}
                  placeholder="Your Message"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                />
              </Col>
            </Row>
          </div>
        </Card.Body>
      </Card>

      <Card className="single-my-account space-mb--20">
        <Card.Header className="panel-heading">
          <h4 className="panel-title">From:</h4>
        </Card.Header>
        <Card.Body>
          <div className="product-options">
            <Row>
              <Col md={4} className="product-options__option-name space-mb--20">
                <span>Your Name</span>
              </Col>
              <Col md={8}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fromName}
                  onChange={(e) => {
                    setFromName(e.target.value);
                  }}
                />
              </Col>
            </Row>
          </div>
        </Card.Body>
      </Card>

      <Card className="single-my-account space-mb--20">
        <Card.Header className="panel-heading">
          <h4 className="panel-title">Amount</h4>
        </Card.Header>
        <Card.Body>
          <div className="product-options">
            <Row>
              <Col md={4} className="product-options__option-name space-mb--30">
                <span>Gift Voucher Amount</span>
              </Col>
              <Col md={4}>
                <div className="product-sizing__frame-image-size">
                  <button onClick={() => priceStepChange(-1)}>-</button>
                  <input
                    id="amount"
                    type="number"
                    value={price}
                    placeholder="50"
                    onChange={(e) => {
                      const p = parseFloat(e.target.value);
                      setPrice(p);
                    }}
                  />
                  <button onClick={() => priceStepChange(1)}>+</button>
                </div>
                {error ? <span className="error-message">{error}</span> : null}
              </Col>
              <Col md={4}></Col>
            </Row>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default GiftVoucher;
