import { useState, useEffect } from "react";
import Link from "next/link";
import { Container, Row, Col, Tab, Tabs } from "react-bootstrap";
import { Layout } from "../components/Layout";
import { Breadcrumb } from "../components/Breadcrumb";
import { ShopProducts } from "../components/Shop";
import portfolioService  from '../services/PortfolioService'

const NoSidebar = () => {
  const [portfolio, setPortfolio] = useState([])
  const [layout, setLayout] = useState("grid four-column");
  const [product, setProduct] = useState([])
  const [key, setKey] = useState('all');
  const layoutOptions = ['grid four-column', 'list'];
  let tablist = [
                  {key:"box-frames", label:"Box Frames"},
                  {key:"canvas-float-frames", label:"Canvas Float Frames"},
                  {key:"memorabilia", label:"Memorabilia"},
                  {key:"canvas-stretches", label:"Canvas Stretches"},
                  {key:"sandwich-frames", label:"Sandwich Frames"},
                  {key:"acrylic-float-frames", label:"Acrylic Float Frames"}
                ]

  const getLayout = (layout) => {
    setLayout(layout);
  };

  useEffect(() => {
    portfolioService.getPortfolio().then(setPortfolio);
  }, [])

  useEffect(()=>{
    let notHidden = portfolio.filter(e=>!e.isDeleted)
    setProduct(notHidden)
  },[portfolio])

  let filterGallery = (key) => {
    let filteredGallery = product.filter(e=>e.category===key)
    console.log(filterGallery)
    return filteredGallery
  }

  return (
    <Layout>
      {/* breadcrumb */}
      <Breadcrumb
        pageTitle="Gallery"
        backgroundImage="/assets/images/backgrounds/gallery.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Gallery</li>
        </ul>
      </Breadcrumb>
      <div className="shop-page-content">
        <div className="shop-page-content__body space-mt--r130 space-mb--r130">
          <Container>
            <Row>
              <Col>
              <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                  >
                <Tab eventKey="all" title="All" className="mb-2">
                {
                  product.length>0 ? (
                    <ShopProducts layout={layout} products={product} portfolio={true} isPopup={true}/>
                  ):(
                    <h4 className="text-center mt-3 mb-3">Gallery is empty</h4>
                  )
                }
                </Tab>
                {
                  tablist && tablist.map(e=>{
                    let filtered = filterGallery(e.key)
                    return (
                      <Tab key={e.key} eventKey={e.key} title={e.label}>
                      {
                        filtered.length>0 ? (
                          <ShopProducts layout={layout} products={filtered} portfolio={true} isPopup={true}/>
                        ):(
                          <h4 className="text-center mt-3 mb-3">Gallery is empty</h4>
                        )
                      }
                      </Tab>
                    )
                  }
                  )
                }
              </Tabs>
                {/* shop products */}
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </Layout>
  );
};

export default NoSidebar;
