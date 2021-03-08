import { Tooltip } from "react-tippy";
import { IoIosClose } from "react-icons/io";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const AboutOverlay = ({ activeStatus, getActiveStatus }) => {
  return (
    <div className={`about-overlay ${activeStatus ? "active" : ""}`}>
      <div
        className="about-overlay__close"
        onClick={() => {
          getActiveStatus(false);
          document.querySelector("body").classList.remove("overflow-hidden");
        }}
      />
      <div className="about-overlay__content">
        <button
          className="about-overlay__close-icon"
          onClick={() => {
            getActiveStatus(false);
            document.querySelector("body").classList.remove("overflow-hidden");
          }}
        >
          <IoIosClose />
        </button>
        <div className="about-overlay__content-container d-flex flex-column justify-content-between h-100">
          <div className="about-overlay__widget-wrapper">
            <div className="about-widget">
              <h2 className="about-widget__title">About Us</h2>
              <p>
                Since its inception in 2000 as a family owned and operated business,
                we have grown into one of the most competitive picture framers in
                New South Wales.<br />
              </p>
              <h2 className='about-widget__title'>Delivery</h2>
              <p>
                We offer a pickup and delivery service in the Sydney area, and courier
                delivery nationwide.<br />
              </p>
              <h2 className='about-widget__title'>Technology</h2>
              <p>
                Master Framing has the latest technology possible to ensure that our
                product is of the highest quality. We have invested extensively in new technology,
                to ensure that we give you the best quality that you and your family deserve.
              </p>
              <p>
                All materials we use are acid free. <br /><br />
              </p>
            </div>
          </div>
          <div className="about-overlay__contact-widget">
            <p className="email">
              <a href="mailto:framers@masterframing.com.au">framers@masterframing.com.au</a>
            </p>
            <p className="phone">(02) 9697 2008</p>
            <div className="social-icons">
              <ul>
                <li>
                  <Tooltip
                    title="Facebook"
                    position="top"
                    trigger="mouseenter"
                    animation="shift"
                    arrow={true}
                    duration={200}
                  >
                    <a href="https://www.facebook.com/MasterFramingAustralia" target="_blank">
                      <FaFacebookF />
                    </a>
                  </Tooltip>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutOverlay;
