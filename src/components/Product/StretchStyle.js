import Card from "react-bootstrap/Card";
import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Tooltip } from "react-tippy";
import { MdInfoOutline } from "react-icons/md";
import { useProduct } from "../../contexts/ProductContext";

const StretchStyle = () => {
  const [options, setOptions] = useState([]);
  const { product, configurations, stretch, setStretch,defaultConfig, setDefaultConfig,setDefaultStretch } = useProduct();

  useEffect(() => {
    if (product) {
      const stretchOptions = configurations.stretching;

      setOptions(stretchOptions);
      setStretch(stretchOptions?.[0]);
      setDefaultStretch(stretchOptions?.[0])
    }
  }, [product, configurations]);

  return (
    <div className="product-details space-mb-mobile-only--50">
      <Card className="single-my-account space-mb--20">
        <Card.Header className="panel-heading">
          <h4 className="panel-title">Choose your stretch style</h4>
        </Card.Header>
        <Card.Body>
          {options?.length > 0 ? (
            <div className="product-options">
              <Row>
                <Col md={4} xs={4} className="product-options__option-name">
                  <span>Stretching</span>
                </Col>
                <Col md={7} xs={7}>
                  <select
                    value = {stretch.id}
                    onChange={(e) => {
                      const selected = options.find(
                        (i) => i.id === e.target.value
                      );
                      setStretch(selected);
                    }}
                  >
                    {/*TODO: OPTIONS DEPENDS ON THE PRODUCT */}
                    {options.map((i) => (
                      <option key={i.displayName} value={i.id}>
                        {i.displayName}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col md={1} xs={1} className="product-options__more-info">
                  <Tooltip
                    position="bottom"
                    trigger="mouseenter"
                    animation="shift"
                    arrow={false}
                    duration={200}
                    html={<ul>{stretch.description}</ul>}
                  >
                    <MdInfoOutline />
                  </Tooltip>
                </Col>
              </Row>
            </div>
          ) : (
            ""
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default StretchStyle;
