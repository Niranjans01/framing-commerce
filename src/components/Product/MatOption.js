import { Row, Col, Accordion, Card, useAccordionToggle } from "react-bootstrap";
import { useState, useEffect, Fragment } from "react";
import Select from "react-select";
import { MatSizing } from "../Product";
import { useProduct } from "../../contexts/ProductContext";
import { round } from "../../lib/utilities";

const MatOption = ({ matStyle, setMatStyle, options, matType, enableMat }) => {
  const { dimUnit } = useProduct();
  let defaultSize = 5;
  if (matType === "bottom-mat") {
    defaultSize = 0.5;
  }
  const [uniformWidth, setUniformWidth] = useState(
    dimUnit === "cm" ? defaultSize : parseFloat((defaultSize / 2.54).toFixed(1))
  );
  const [isUniform, setIsUniform] = useState(true);
  const [selected, setSelected] = useState(null);
  const [color, setColor] = useState(null);
  const [selectOptions, setSelectOptions] = useState(options);

  useEffect(() => {
    setSelectOptions(
      options.map((e) => ({
        ...e,
        value: e.displayName,
        label: e.displayName,
      }))
    );
    if (!color) {
      let defaultMat;
      if (matType === "bottom-mat") {
        defaultMat = options.find((o) => o.displayName === "Blizzard");
      } else {
        defaultMat = options.find((o) => o.displayName === "Blizzard");
      }
      defaultMat = defaultMat || options[0];
      setColor({
        ...defaultMat,
        value: defaultMat.displayName,
        label: defaultMat.displayName,
      });
    }
  }, [options]);

  useEffect(() => {
    if (enableMat) {
      setMatStyle({
        top: uniformWidth,
        bottom: uniformWidth,
        left: uniformWidth,
        right: uniformWidth,
        color: color.displayName,
        image: color?.image?.url,
        id: color.id,
      });
    } else {
      setMatStyle(null);
    }
  }, [uniformWidth, color, selected, enableMat]);

  const CustomToggle = ({
    children,
    eventKey,
    uniformWidth,
    setUniformWidth,
    isUniform,
    setIsUniform,
  }) => {
    const decoratedOnClick = useAccordionToggle(eventKey);

    return (
      <Fragment>
        <Row>
          <Col md={3} xs={4} className="product-options__option-name">
            <span>Width ({dimUnit})</span>{" "}
          </Col>
          <Col md={4} xs={8} className="product-options__option-name">
            <div className="product-options__mat-options__mat-sizing">
              <button
                className="product-options__mat-options__mat-sizing"
                onClick={() => {
                  setUniformWidth(
                    uniformWidth > 0.1
                      ? round(parseFloat(uniformWidth) - 0.1, 1)
                      : 0.1
                  );
                }}
                disabled={!isUniform}
              >
                -
              </button>
              <input
                id="width"
                type="number"
                value={uniformWidth.toFixed(1)}
                placeholder="Width"
                onChange={(e) => {
                  setUniformWidth(parseFloat(e.target.value));
                }}
                disabled={!isUniform}
              />
              <button
                className="product-options__mat-options__mat-sizing"
                onClick={() => {
                  setUniformWidth(round(parseFloat(uniformWidth) + 0.1, 1));
                }}
                disabled={!isUniform}
              >
                +
              </button>
            </div>
          </Col>
          <Col md={5} xs={12} className="space-mt-mobile-only--30">
            <div className="product-options__mat-options">
              <input
                type="checkbox"
                id={`uniform-width-${matType}`}
                checked={isUniform}
                onChange={() => setIsUniform(!isUniform)}
                onClick={decoratedOnClick}
              />
              <label htmlFor={`uniform-width-${matType}`}>Uniform Width</label>
            </div>
          </Col>
          {children}
        </Row>
      </Fragment>
    );
  };

  const formatOptionLabel = (option) => {
    return (
      <div className="mat-option-item">
        <img src={option?.image?.url} />
        <span>{option?.value}</span>
      </div>
    );
  };

  return (
    <div className="product-options">
      <Fragment>
        <Row>
          <Col md={4} xs={4} className="product-options__option-name">
            <span>Color</span>
          </Col>
          <Col md={8} xs={8}>
            <Select
              value={color}
              onChange={setColor}
              options={selectOptions}
              formatOptionLabel={formatOptionLabel}
              classNamePrefix="react-select"
            />
          </Col>
        </Row>
        <Row>
          <Accordion>
            <Card className="single-my-account space-mb--20">
              <Card.Header className="panel-heading">
                <CustomToggle
                  eventKey="0"
                  uniformWidth={uniformWidth}
                  setUniformWidth={setUniformWidth}
                  isUniform={isUniform}
                  setIsUniform={setIsUniform}
                />
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <MatSizing
                    matStyle={matStyle}
                    setMatStyle={setMatStyle}
                    matType={matType}
                    selected={selected}
                    enableMat={enableMat}
                  />
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </Row>
      </Fragment>
    </div>
  );
};

export default MatOption;
