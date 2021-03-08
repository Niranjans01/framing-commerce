import Card from "react-bootstrap/Card";
import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Tooltip } from "react-tippy";
import { MdInfoOutline } from "react-icons/md";

import { useProduct } from "../../contexts/ProductContext";

const EdgeStyle = () => {
  const [edgeOptions, setEdgeOptions] = useState([]);

  const { product, configurations, edge, setEdge,defaultConfig, setDefaultConfig } = useProduct();

  useEffect(() => {
    if (product) {
      const edges = configurations.edge;

      setEdgeOptions(edges);
      setEdge(edges?.[0]);
      setDefaultConfig({...defaultConfig,edge:edges?.[0]})
    }
  }, [product, configurations]);

  return (
    <div className="product-details space-mb-mobile-only--50">
      <Card className="single-my-account space-mb--20">
        <Card.Header className="panel-heading">
          <h4 className="panel-title">Choose your edge style</h4>
        </Card.Header>
        <Card.Body>
          <div className="product-options">
            {edgeOptions?.length > 0 ? (
              <Row>
                <Col md={4} xs={4} className="product-options__option-name">
                  <span>Edge Type</span>
                </Col>
                <Col md={7} xs={7}>
                  <select
                    onChange={(e) => {
                      const selected = edgeOptions.find(
                        (i) => i.id === e.target.value
                      );
                      setEdge(selected);
                    }}
                  >
                    {/*TODO: OPTIONS DEPENDS ON THE PRODUCT */}
                    {edgeOptions.map((i) => (
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
                    html={<ul>{edge.description}</ul>}
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

export default EdgeStyle;
