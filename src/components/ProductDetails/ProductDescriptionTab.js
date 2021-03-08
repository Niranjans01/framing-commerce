import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { useProduct } from "../../contexts/ProductContext";

const ProductDescriptionTab = () => {
  const { product } = useProduct()

  return (
    <div className="product-description-tab space-pt--r100 space-mt--r100 border-top--grey">
      <Tab.Container defaultActiveKey="description">
        <Nav
          variant="pills"
          className="product-description-tab__navigation text-center justify-content-center space-mb--50"
        >
          <Nav.Item>
            <Nav.Link eventKey="description">Description</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="description">
            {product ? (
              <div className="product-description-tab__details">
                {product.description}
              </div>
            ) : ""}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default ProductDescriptionTab;
