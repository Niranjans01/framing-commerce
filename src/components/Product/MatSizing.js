import { Row, Col } from "react-bootstrap";
import { Fragment, useState, useEffect } from 'react'
import { useProduct } from "../../contexts/ProductContext";
import { round } from "../../lib/utilities";

const MatSizing = ({ matStyle, setMatStyle, matType, selected, enableMat }) => {
  const { dimUnit } = useProduct();

  const [top, setTop] = useState(
    dimUnit === "cm" ? 5 : parseFloat((5 / 2.54).toFixed(1))
  );
  const [bottom, setBottom] = useState(
    dimUnit === "cm" ? 5 : parseFloat((5 / 2.54).toFixed(1))
  );
  const [left, setLeft] = useState(
    dimUnit === "cm" ? 5 : parseFloat((5 / 2.54).toFixed(1))
  );
  const [right, setRight] = useState(
    dimUnit === "cm" ? 5 : parseFloat((5 / 2.54).toFixed(1))
  );

  useEffect(() => {
    if (matType === 'top-mat' && enableMat) {
      let topM = matStyle.topMat
      setMatStyle({...matStyle,
        ...topM,
        top,
        bottom,
        left,
        right,
      })
    } else if (matType === 'bottom-mat' && enableMat) {
      let botM = matStyle.bottomMat
      setMatStyle({...matStyle,
        ...botM,
        top,
        bottom,
        left,
        right,
      })
    }
  }, [top, left, bottom, right])

  const desktop = (
    <div className="show-only-on-desktop">
      <Row>
        {/* <div className="product-options__mat-options__wrapper"> */}
          <Col md={3} className="product-options__option-name">
            <span>Top</span>
          </Col>
          <Col md={3} className="product-options__option-name">
            <div className="product-options__mat-options__mat-sizing">
              <button
                className="product-options__mat-options__mat-sizing"
                onClick={() => {
                  setTop(
                    parseFloat(top) > 0.0
                      ? round(parseFloat(top) - 0.1, 1)
                      : 0.0
                  );
                }}
              >
                -
              </button>
              <input
                id="top"
                type="number"
                value={top.toFixed(1)}
                placeholder="Top"
                onChange={(e) => setTop((parseFloat(e.target.value)), 1)}
              />
              <button
                className="product-options__mat-options__mat-sizing"
                onClick={() => {
                  setTop(
                      round(parseFloat(top) + 0.1, 1)
                  );
                }}
              >
                +
              </button>
            </div>
          </Col>
          <Col md={3} className="product-options__option-name">
            <span>Bottom</span>
          </Col>
          <Col md={3} className="product-options__option-name">
            <div className="product-options__mat-options__mat-sizing">
              <button
                className="product-options__mat-options__mat-sizing"
                onClick={() => {
                  setBottom(
                    parseFloat(bottom) > 0.0
                    ? round(parseFloat(bottom) - 0.1, 1)
                    : 0.0
                  );
                }}
              >
                -
              </button>
              <input
                id="bottom"
                type="number"
                value={bottom.toFixed(1)}
                placeholder="Bottom"
                onChange={(e) => setBottom(parseFloat(e.target.value))}
              />
              <button
                className="product-options__mat-options__mat-sizing"
                onClick={() => {
                  setBottom(
                    round(parseFloat(bottom) + 0.1, 1)
                  );
                }}
              >
                +
              </button>
            </div>
          </Col>
        {/* </div> */}
      </Row>
      <Row>
        {/* <div className="product-options__mat-options__wrapper"> */}
          <Col md={3} className="product-options__option-name">
            <span>Left</span>
          </Col>
          <Col md={3} className="product-options__option-name">
            <div className="product-options__mat-options__mat-sizing">
              <button
                className="product-options__mat-options__mat-sizing"
                onClick={() => {
                  setLeft(
                    parseFloat(left) > 0.0
                    ? round(parseFloat(left) - 0.1, 1)
                    : 0.0
                  );
                }}
              >
                -
              </button>
              <input
                id="left"
                type="number"
                value={left.toFixed(1)}
                placeholder="Left"
                onChange={(e) => setLeft(parseFloat(e.target.value))}
              />
              <button
                className="product-options__mat-options__mat-sizing"
                onClick={() => {
                  setLeft(
                    round(parseFloat(left) + 0.1, 1)
                  );
                }}
              >
                +
              </button>
            </div>
          </Col>
          <Col md={3} className="product-options__option-name">
            <span>Right</span>
          </Col>
          <Col md={3} className="product-options__option-name">
            <div className="product-options__mat-options__mat-sizing">
              <button
                className="product-options__mat-options__mat-sizing"
                onClick={() => {
                  setRight(
                    parseFloat(right) > 0.0
                      ? round(parseFloat(right) - 0.1, 1)
                      : 0.0
                  );
                }}
              >
                -
              </button>
              <input
                id="right"
                type="number"
                value={right.toFixed(1)}
                placeholder="Right"
                onChange={(e) => setRight(parseFloat(e.target.value))}
              />
              <button
                className="product-options__mat-options__mat-sizing"
                onClick={() => {
                  setRight(
                    round(parseFloat(right) + 0.1, 1)
                  );
                }}
              >
                +
              </button>
            </div>
          </Col>
        {/* </div> */}
      </Row>
    </div>
  )

  const mobile = (
    <div className="show-only-on-mobile">
      <Row>
        <Col xs={4} className="product-options__option-name">
          <span>Top</span>
        </Col>
        <Col xs={8} className="product-options__option-name">
          <div className="product-options__mat-options__mat-sizing">
            <button
              className="product-options__mat-options__mat-sizing"
              onClick={() => {
                setTop(
                  parseFloat(top) > 0.0
                    ? round(parseFloat(top) - 0.1, 1)
                    : 0.0
                );
              }}
            >
              -
            </button>
            <input
              id="top"
              type="number"
              value={top.toFixed(1)}
              placeholder="Top"
              onChange={(e) => setTop(parseFloat(e.target.value))}
            />
            <button
              className="product-options__mat-options__mat-sizing"
              onClick={() => {
                setTop(
                    round(parseFloat(top) + 0.1, 1)
                );
              }}
            >
              +
            </button>
          </div>
        </Col>
      </Row>
      <Row className="space-mt-mobile-only--20">
        <Col xs={4} className="product-options__option-name">
          <span>Bottom</span>
        </Col>
        <Col xs={8} className="product-options__option-name">
          <div className="product-options__mat-options__mat-sizing">
            <button
              className="product-options__mat-options__mat-sizing"
              onClick={() => {
                setBottom(
                  parseFloat(bottom) > 0.0
                    ? round(parseFloat(bottom) - 0.1, 1)
                    : 0.0
                );
              }}
            >
              -
            </button>
            <input
              id="bottom"
              type="number"
              value={bottom.toFixed(1)}
              placeholder="Bottom"
              onChange={(e) => setBottom(parseFloat(e.target.value))}
            />
            <button
              className="product-options__mat-options__mat-sizing"
              onClick={() => {
                setBottom(
                    round(parseFloat(bottom) + 0.1, 1)
                );
              }}
            >
              +
            </button>
          </div>
        </Col>
      </Row>
      <Row className="space-mt-mobile-only--20">
        <Col xs={4} className="product-options__option-name">
          <span>Left</span>
        </Col>
        <Col xs={8} className="product-options__option-name">
          <div className="product-options__mat-options__mat-sizing">
            <button
              className="product-options__mat-options__mat-sizing"
              onClick={() => {
                setLeft(
                  parseFloat(left) > 0.0
                    ? round(parseFloat(left) - 0.1, 1)
                    : 0.0
                );
              }}
            >
              -
            </button>
            <input
              id="left"
              type="number"
              value={left.toFixed(1)}
              placeholder="Left"
              onChange={(e) => setLeft(parseFloat(e.target.value))}
            />
            <button
              className="product-options__mat-options__mat-sizing"
              onClick={() => {
                setLeft(
                    round(parseFloat(left) + 0.1, 1)
                );
              }}
            >
              +
            </button>
          </div>
        </Col>
      </Row>
      <Row className="space-mt-mobile-only--20">
        <Col xs={4} className="product-options__option-name">
          <span>Right</span>
        </Col>
        <Col xs={8} className="product-options__option-name">
          <div className="product-options__mat-options__mat-sizing">
            <button
              className="product-options__mat-options__mat-sizing"
              onClick={() => {
                setRight(
                  parseFloat(right) > 0.0
                    ? round(parseFloat(right) - 0.1, 1)
                    : 0.0
                );
              }}
            >
              -
            </button>
            <input
              id="right"
              type="number"
              value={right.toFixed(1)}
              placeholder="Right"
              onChange={(e) => setRight(parseFloat(e.target.value))}
            />
            <button
              className="product-options__mat-options__mat-sizing"
              onClick={() => {
                setRight(
                    round(parseFloat(right) + 0.1, 1)
                );
              }}
            >
              +
            </button>
          </div>
        </Col>
      </Row>
    </div>
  )

  return (
    <Fragment>
      {desktop}
      {mobile}
    </Fragment>
  )
}

export default MatSizing
