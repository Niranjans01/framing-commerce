import Card from "react-bootstrap/Card";
import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Tooltip } from "react-tippy";
import { MdInfoOutline } from "react-icons/md";

import { useProduct } from "../../contexts/ProductContext";

const EdgeWidthStyle = () => {
  const [edgeWidths, setEdgeWidths] = useState([]);

  const {
    product,
    configurations,
    edgeWidth,
    setEdgeWidth,
    defaultConfig,
    setDefaultConfig,
  } = useProduct();

  useEffect(() => {
    if (product) {
      const edgeWidths = configurations["edge_width"];

      setEdgeWidth(edgeWidths?.[0]);
      setEdgeWidths(edgeWidths);
      setDefaultConfig({ ...defaultConfig, edgeWidth: edgeWidths?.[0] });
    }
  }, [product, configurations]);

  return (
    <div className="product-details space-mb-mobile-only--50">
      <Card className="single-my-account space-mb--20">
        <Card.Header className="panel-heading">
          <h4 className="panel-title">Choose your edge width</h4>
        </Card.Header>
        <Card.Body>
          <div className="product-options">
            {edgeWidths?.length > 0 ? (
              <Row>
                <Col md={4} xs={4} className="product-options__option-name">
                  <span>Edge Width</span>
                </Col>
                <Col md={7} xs={7}>
                  <select
                    onChange={(e) => {
                      const selected = edgeWidths.find(
                        (i) => i.id === e.target.value
                      );
                      setEdgeWidth(selected);
                    }}
                  >
                    {edgeWidths.map((i) => (
                      <option key={i.id} value={i.id}>
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
                    html={<ul>{edgeWidth.description}</ul>}
                  >
                    <MdInfoOutline />
                  </Tooltip>
                </Col>
              </Row>
            ) : (
              ""
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EdgeWidthStyle;
