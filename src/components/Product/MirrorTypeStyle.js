import Card from "react-bootstrap/Card";
import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Tooltip } from "react-tippy";
import { MdInfoOutline } from "react-icons/md";

import { useProduct } from "../../contexts/ProductContext";

const MirrorTypeStyle = () => {
  const [mirrorTypes, setMirrorTypes] = useState([]);

  const { product, configurations, mirrorType, setMirrorType,defaultConfig, setDefaultConfig } = useProduct();

  useEffect(() => {
    if (product) {
      const mirrors = configurations.mirror;
      const plainMirror = mirrors?.find((e) => {
        return e.displayName.toLowerCase().indexOf("plain") > -1;
      }) || mirrors?.[0];
      setDefaultConfig({...defaultConfig,mirrorType:plainMirror})
      setMirrorType(plainMirror);
      setMirrorTypes(mirrors);
    }
  }, [product, configurations]);

  return (
    <div className="product-details space-mb-mobile-only--50">
      <Card className="single-my-account space-mb--20">
        <Card.Header className="panel-heading">
          <h4 className="panel-title">Choose your Mirror Type</h4>
        </Card.Header>
        <Card.Body>
          <div className="product-options">
            {mirrorTypes?.length > 0 ? (
              <Row>
                <Col md={4} xs={4} className="product-options__option-name">
                  <span>Mirror Type</span>
                </Col>
                <Col md={7} xs={7}>
                  <select
                    onChange={(e) => {
                      const selected = mirrorTypes.find(
                        (i) => i.id === e.target.value
                      );
                      setMirrorType(selected);
                    }}
                    value={mirrorType?.id}
                  >
                    {mirrorTypes.map((i) => (
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
                    html={<ul>{mirrorType.description}</ul>}
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

export default MirrorTypeStyle;
