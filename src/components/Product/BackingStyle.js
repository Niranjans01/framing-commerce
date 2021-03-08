import Card from "react-bootstrap/Card";
import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Tooltip } from "react-tippy";
import { MdInfoOutline } from "react-icons/md";
import { useProduct } from "../../contexts/ProductContext";

const BackingStyle = () => {
  const [options, setOptions] = useState([]);

  const { product, configurations, backing, setBacking, defaultConfig, setDefaultConfig } = useProduct();

  useEffect(() => {
    if (product) {
      const backingOptions = configurations.backing;
      setOptions(backingOptions);
      const defaultBacking = backingOptions?.find(
        (e) => e.isDefault
      )||backingOptions?.[0];
      setBacking(defaultBacking);
      setDefaultConfig({...defaultConfig,backing:defaultBacking})
    }
  }, [product, configurations]);

  return (
    <div className="product-details space-mb-mobile-only--50">
      <Card className="single-my-account space-mb--20">
        <Card.Header className="panel-heading">
          <h4 className="panel-title">Choose your backing</h4>
        </Card.Header>
        <Card.Body>
          {options?.length > 0 ? (
            <div className="product-options">
              <Row>
                <Col md={4} xs={4} className="product-options__option-name">
                  <span>Backing</span>
                </Col>
                <Col md={7} xs={7}>
                  <select
                    value={backing.id}
                    onChange={(e) => {
                      const selected = options.find(
                        (i) => i.id === e.target.value
                      );
                      setBacking(selected);
                    }}
                  >
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
                    html={<ul>{backing.description}</ul>}
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

export default BackingStyle;
