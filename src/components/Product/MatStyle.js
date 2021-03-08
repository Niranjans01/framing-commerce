import Card from "react-bootstrap/Card";
import Accordion from 'react-bootstrap/Accordion'
import { Row, Col, useAccordionToggle } from "react-bootstrap";
import { MatOption } from '../Product'
import { useState, useEffect, useContext } from 'react'
import { useProduct } from "../../contexts/ProductContext";
import AccordionContext from 'react-bootstrap/AccordionContext';

const MatStyle = () => {

  const { product,
    configurations,
    topMat,
    setTopMat,
    bottomMat,
    setBottomMat,
    setEnableTopMat,
    enableTopMat,
    setEnableBotMat,
    enableBotMat,} = useProduct()

  const [ colors, setColors ] = useState([])

  useEffect(() => {
    if (product) {
      let colorOrder = [ "Blizzard", "Minuet", "Cream", "Ivory Powder", "Dove", "Daffodil", "Cornflower", "Bamboo", "Pale Green", "Ivy Green", "Newbury Moss", "Dark Green", "Light Blue", "Mild Blue", "Sky", "Royal Blue", "Imperial Blue", "Violet", "Damson", "Odessa Pink", "Peach", "Football Red", "Australian Red", "Maroon", "Raw Silk", "Mid Brown", "Mocha", "Euro Grey", "Smoke", "Dark Grey", "Black", "Silver", "Gold" ] 
      let orderedColors = [];
      colorOrder.map((color, key) => {
        if (configurations && configurations.mat && configurations.mat.length) {
          orderedColors.push(configurations.mat.find(colorConf => colorConf.displayName == color))
        }
      })
      setColors(orderedColors)
    }
  }, [product, configurations]);

  const TopCustomToggle = ({ children, eventKey }) => {
    const currentEventKey = useContext(AccordionContext);
    let isCurrentEventKey = currentEventKey === eventKey
    const decoratedOnClick = useAccordionToggle(eventKey)

    if(isCurrentEventKey&&!enableTopMat){
      decoratedOnClick()
    }

    return (
      <Row>
        <Col md={8} xs={6}>
          <h5 className="panel-title">
            Top Mat
          </h5>
        </Col>
        <Col md={4} xs={6} className="product-option__options-name">
          <div className="product-options__mat-options single-method">
            <input
              type="checkbox"
              id={'enable-mat-top-mat'}
              checked={enableTopMat}
              onChange={() => {
                setEnableTopMat(!enableTopMat)
              }}
              onClick={decoratedOnClick}
            />
            <label htmlFor={'enable-mat-top-mat'}>
              Add Top Mat
            </label>
            {children}
          </div>
        </Col>
      </Row>
    );
  }

  const BotCustomToggle = ({ children, eventKey }) => {
    const currentEventKey = useContext(AccordionContext);
    let isCurrentEventKey = currentEventKey === eventKey
    const decoratedOnClick = useAccordionToggle(eventKey)

    if(isCurrentEventKey&&!enableBotMat){
      decoratedOnClick()
    }

    return (
      <Row>
        <Col md={8} xs={6}>
          <h5 className="panel-title">
            Bottom Mat
          </h5>
        </Col>
        <Col md={4} xs={6} className="product-option__options-name">
          <div className="product-options__mat-options single-method">
            <input
              type="checkbox"
              id={'enable-mat-bottom-mat'}
              checked={enableBotMat}
              onChange={() => {
                setEnableBotMat(!enableBotMat)
              }}
              onClick={decoratedOnClick}
            />
            <label htmlFor={'enable-mat-bottom-mat'}>
              Add Bottom Mat
            </label>
            {children}
          </div>
        </Col>
      </Row>
    );
  }

  return (
    <div className="product-details space-mb-mobile-only--10">
      <Card className="single-my-account">
        <Card.Header className="panel-heading">
          <h4 className="panel-title">
            Need Mats? (Optional)
          </h4>
        </Card.Header>
        <Card.Body>
          <Accordion>
            <Card className="single-my-account mat-style-card">
              <Card.Header className="panel-heading">
                <TopCustomToggle eventKey="1" />
              </Card.Header>
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  {colors?.length > 0 ? (
                    <MatOption  matStyle={topMat} setMatStyle={setTopMat} options={colors} matType={'top-mat'} key='top-mat' enableMat={enableTopMat} />
                  ) : "" }
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <Accordion>
            <Card className="single-my-account mat-style-card">
              <Card.Header className="panel-heading">
                <BotCustomToggle eventKey="2" />
              </Card.Header>
              <Accordion.Collapse eventKey="2">
                <Card.Body>
                  {colors?.length > 0 ? (
                    <MatOption options={colors} matStyle={bottomMat} setMatStyle={setBottomMat} matType={'bottom-mat'} key='bottom-mat' enableMat={enableBotMat} />
                  ) : ""}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </Card.Body>
      </Card>
    </div>
  )
}

export default MatStyle
