import Card from "react-bootstrap/Card";
import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Tooltip } from "react-tippy";
import { MdInfoOutline } from "react-icons/md";
import { useProduct } from "../../contexts/ProductContext";

const PrintStyle = () => {
  const { product, configurations, paper, setPaper,defaultConfig, setDefaultConfig } = useProduct();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (product) {
      const printing = configurations.print;

      setOptions(printing);
    }
  }, [product, configurations]);

  useEffect(() => {
    if (options) {
      const defaultPaper = options?.find(
        (e) => e.isDefault
      ) || options?.[0];
      setPaper(defaultPaper || options?.[0]);
      setDefaultConfig({...defaultConfig,paper:defaultPaper})
    }
  }, [options]);

  return (
    <div className="product-details space-mb-mobile-only--50">
      <Card className="single-my-account space-mb--20">
        <Card.Header className="panel-heading">
          <h4 className="panel-title">{product.displayName.toLowerCase() === 'canvas printing & stretching'?"Choose your printing canvas":"Choose your printing paper"} {(product.category === 'diy-framing' || product.displayName.toLowerCase() === 'clip frames') && product.displayName.toLowerCase() !== 'canvas printing & stretching'? "(Optional)" : ""}</h4>
        </Card.Header>
        <Card.Body>
          {options?.length > 0 ? (
            <div className="product-options">
              <Row>
                <Col md={4} xs={4} className="product-options__option-name">
                  <span>Paper</span>
                </Col>
                <Col md={7} xs={7}>
                  <select
                    onChange={(e) => {
                      const selected = options.find(
                        (i) => i.id === e.target.value
                      );
                      setPaper(selected);
                    }}
                    value={paper?.id}
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
                    html={<ul>{paper ? paper.description : null}</ul>}
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

export default PrintStyle;
