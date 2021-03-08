import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { IoIosPin, IoIosCall, IoIosClock } from "react-icons/io";
import { Layout } from "../components/Layout";
import { Breadcrumb } from "../components/Breadcrumb";
import {  SectionTitleOne, SectionTitleTwo } from "../components/SectionTitle";
import { axiosInstance } from '../lib/utilities'
import { useRef, useState, useEffect } from 'react'
import { useToasts } from "react-toast-notifications";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

const Contact = ({google}) => {

  console.log(google)

  const contactForm = useRef(null)
  const { addToast } = useToasts();

  const [ customerName, setCustomerName ] = useState('')
  const [ customerEmail, setCustomerEmail ] = useState('')
  const [ messageTitle, setMessageTitle ] = useState('')
  const [ message, setMessage ] = useState('')
  const [ successMessage, setSuccessMessage ] = useState(null)
  const [ errorMessage, setErrorMessage ] = useState(null)

  const sendInquiry = (e) => {
    e.preventDefault()

    axiosInstance.post('/contactUs', {
      first_name: customerName,
      email: customerEmail,
      subject: messageTitle,
      message: message
    }).then(res => {
      setCustomerName('')
      setCustomerEmail('')
      setMessageTitle('')
      setMessage('')
      setSuccessMessage('Successfully sent your message! We\'ll get back to you as soon as we can')
      setErrorMessage(null)
    }).catch(err => {
      setErrorMessage('Oops an error occurred. Please try again later.')
      setSuccessMessage(null)
    })
  }

  return (
    <Layout>
      {/* breadcrumb */}
      <Breadcrumb
        pageTitle="Contact Us"
        backgroundImage="/assets/images/backgrounds/contact-background.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Contact</li>
        </ul>
      </Breadcrumb>
      <div className="contact-page-content-wrapper space-mt--r130 space-mb--r130">
        <div className="contact-page-top-info space-mb--r100">
          <Container>
            <Row>
              <Col lg={12}>
                <SectionTitleTwo
                  title="We'd love to hear from you"
                />
              </Col>
            </Row>
            <Row className="space-mb-mobile-only--30 space-mb--r100">
              <Col md={4} className="space-mb-mobile-only--50">
                <div className="icon-box">
                  <div className="icon-box__icon">
                    <IoIosPin />
                  </div>
                  <div className="icon-box__content">
                    <h3 className="title">HEADQUARTERS</h3>
                    <p className="content">
                      797 Elizabeth St, Zetland, 2017
                    </p>
                  </div>
                </div>
              </Col>
              <Col md={4} className="space-mb-mobile-only--50">
                <div className="icon-box">
                  <div className="icon-box__icon">
                    <IoIosCall />
                  </div>
                  <div className="icon-box__content">
                    <h3 className="title">CONTACT</h3>
                    <p className="content">
                      <span>(Rob) 0402 405 792 / (Zac) 0414 371 222 </span>
                      <span>(02) 9697 2008</span>
                    </p>
                    <p className="content"> Email Address: <a href="mailto:framers@masterframing.com.au">framers@masterframing.com.au</a> </p>
                  </div>
                </div>
              </Col>
              <Col md={4} className="space-mb-mobile-only--50">
                <div className="icon-box">
                  <div className="icon-box__icon">
                    <IoIosClock />
                  </div>
                  <div className="icon-box__content">
                    <h3 className="title">STORE HOURS</h3>
                    <p className="content">
                      Mondays – Thursdays : 07:00 – 16:30
                      <span>Fridays : 07:00 - 14:00</span>
                      <span>Saturdays : 10:00 – 14:00</span>
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <div className="contact-page-map space-mb--r100" style={{height:"20em"}}>
                    <Map google={google}
                      style={{
                        display: 'inline-block',
                        overflow: 'hidden',
                        width: '100%',
                        height:'100%'
                      }}
                      initialCenter={{
                      lat: -33.906343061094184,
                      lng: 151.20657450735786
                      }}
                      center = {{
                        lat: -33.906343061094184,
                      lng: 151.20657450735786
                        }}
                      zoom={18}>
                        <Marker
                          title={'Master Framing'}
                          position={{lat: -33.906343061094184,
                            lng: 151.20657450735786}} />
                      </Map>
                    
                    {/* <iframe
                    title='map'
                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDz0ZGX2CYIuMjX0xchSvzKKDJ7JM_D0sQ&q=Master+Framing,+797+Elizabeth+St,+Zetland+NSW+2017"
                    allowFullScreen /> */}
                </div>
              </Col>
            </Row>
            <Row className='space-mb-mobile-only mt-5' id="locations">
              <Col lg={12}>
                <SectionTitleTwo
                  subtitle="STORE LOCATIONS"
                />
              </Col>
            </Row>
            <Row className="space-mb-mobile-only--m50">
              <Col md={3} className="space-mb-mobile-only--50">
                <div className="icon-box">
                  <div className="icon-box__content">
                    <h3 className="title">CLOVELLY Store</h3>
                    <p className="content">
                      <a href="https://goo.gl/maps/PiyC3KzKx8WgCZmy6">160 Clovelly Road Randwick 2031</a>
                    </p>
                    <p className="content">
                      <span>(02) 9399 9669</span>
                      <span>Mon - Fri : 10:00 - 17:00</span>
                      <span>Sat : 10:00 - 14:00</span>
                    </p>
                  </div>
                </div>
              </Col>
              <Col md={3} className="space-mb-mobile-only--50">
                <div className="icon-box">
                  <div className="icon-box__content">
                    <h3 className="title">DOUBLE BAY</h3>
                    <p className="content">
                      <a href="https://goo.gl/maps/MqKrVWX5aB3GKfPe7">414 New South Head Rd, 2028</a>
                    </p>
                    <p className="content">
                      <span>(02) 8068 0997</span>
                      <span>Mon - Fri : 10:00 - 17:00</span>
                      <span>Sat : 10:00 - 15:00</span>
                    </p>
                  </div>
                </div>
              </Col>
              <Col md={3} className="space-mb-mobile-only--50">
                <div className="icon-box">
                  <div className="icon-box__content">
                    <h3 className="title">NORTH BONDI</h3>
                    <p className="content">
                      <a href="https://goo.gl/maps/2x45oiyo3mg61qEk9">90 Glenayr Ave, 2026</a>
                    </p>
                    <p className="content">
                      <span>(02) 9365 4166</span>
                      <span>Mon - Fri : 10:00 - 17:00</span>
                      <span>Sat : 10:00 - 14:00</span>
                    </p>
                  </div>
                </div>
              </Col>
              <Col md={3} className="space-mb-mobile-only--50">
                <div className="icon-box">
                  <div className="icon-box__content">
                    <h3 className="title">MOSMAN</h3>
                    <p className="content">
                      <a href="https://goo.gl/maps/FvMBSztqMs33ubLY7">128 Avenue Rd, 2088</a>
                    </p>
                    <p className="content">
                      <span>(02) 8084 2427</span>
                      <span>Mon - Fri : 10:00 - 17:00</span>
                      <span>Sat - Sun : 10:00 - 14:00</span>
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="contact-page-form">
          <Container>
            <Row>
              <Col lg={12}>
                <SectionTitleOne title="Get in touch" />
              </Col>
              <Col lg={12} className="flex-center">
                {successMessage ? (<span className="success-message space-mb--30">{successMessage}</span>) : ""}
                {errorMessage ? (<span className="error-message space-mb--30">{errorMessage}</span>) : ""}
              </Col>
            </Row>
            <Row>
              <Col lg={8} className="ml-auto mr-auto">
                <div className="lezada-form contact-form">
                  <form
                    ref={contactForm}
                    onSubmit={sendInquiry}
                  >
                    <Row>
                      <Col md={6} className="space-mb--40">
                        <input
                          type="text"
                          placeholder="First Name *"
                          name="customerName"
                          id="customerName"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          required
                        />
                      </Col>
                      <Col md={6} className="space-mb--40">
                        <input
                          type="email"
                          placeholder="Email *"
                          name="customerEmail"
                          id="customerEmail"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          required
                        />
                      </Col>
                      <Col md={12} className="space-mb--40">
                        <input
                          type="text"
                          placeholder="Subject"
                          name="contactSubject"
                          id="contactSubject"
                          value={messageTitle}
                          onChange={(e) => setMessageTitle(e.target.value)}
                        />
                      </Col>
                      <Col md={12} className="space-mb--40">
                        <textarea
                          cols={30}
                          rows={10}
                          placeholder="Message"
                          name="contactMessage"
                          id="contactMessage"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                      </Col>
                      <Col md={12} className="text-center">
                        <button
                          type="submit"
                          value="submit"
                          id="submit"
                          className="lezada-button lezada-button--medium"
                        >
                          submit
                        </button>
                      </Col>
                    </Row>
                  </form>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </Layout>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyDz0ZGX2CYIuMjX0xchSvzKKDJ7JM_D0sQ"
})(Contact)
