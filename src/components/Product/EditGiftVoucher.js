import { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useCart } from "../../contexts/CartContext";
import { round } from "../../lib/utilities";

const EditGiftVoucher = ({giftId,closeModal}) => {
  const [error, setError] = useState(null);

  const [toEmail, setToEmail] = useState("")
  const [toName, setToName] = useState("")
  const [fromName, setFromName] = useState("")
  const [message, setMessage] = useState("")
  const [price, setPrice] = useState(50)

  const {cartItems, setNewCart} = useCart();

  useEffect(()=>{

    let GiftVoucher = cartItems.find(e=>{
        return e.cartItemId===giftId
    })
    if(GiftVoucher && GiftVoucher.product==="gift-voucher"){
        setPrice(GiftVoucher.price)
        let values = GiftVoucher.configurations[0].value
        setToEmail(values.recipientEmail)
        setToName(values.recipientName)
        setFromName(values.senderName)
        setMessage(values.message)
    }

  },[cartItems])

  const priceStepChange = (step) => {
    const minPrice = 50;
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
    if (price < parseFloat(50)) {
      setError(`Minimum price must be ${50}`);
    } else {
      setError(null);
    }
  }, [price]);

  let updateValues = () => {
      let new_cart = cartItems.map(e=>{
          if(e.cartItemId === giftId){
            let values = e.configurations[0].value
            values.recipientEmail = toEmail
            values.recipientName = toName
            values.senderName = fromName
            values.message = message
            e.price = price
            e.configurations[0].value = values
          }
          return e
      })
      setNewCart(new_cart)
      closeModal(false)
  }

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
            <Row>
                <Col md={6}>
                <button className="lezada-button lezada-button--small" onClick={e=>updateValues()}>Save Changes</button>
                </Col>
            </Row>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditGiftVoucher;
