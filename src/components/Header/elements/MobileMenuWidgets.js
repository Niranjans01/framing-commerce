import {
  IoIosPhonePortrait,
  IoMdMail,
  IoLogoTwitter,
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoPinterest,
  IoMdPerson,
} from "react-icons/io";

import Link from "next/link";
import { useUser } from "../../../contexts/AccountContext";

const MobileMenuWidgets = () => {
  const { user } = useUser();
  return (
    <div className="offcanvas-mobile-menu__widgets">
      <div className="contact-widget space-mb--30">
        <ul>
          <li>
            <IoMdPerson />
            {/*TODO: Login / Register must only show if user is logged out.
            Otherwise, show email/first name*/}
            {user?.email ? (
              <a href={`mailto:${user.email}`}>{user.email}</a>
            ) : (
              <Link
                href="/other/login-register"
                as={process.env.PUBLIC_URL + "/other/login-register"}
              >
                <a>Login / Register</a>
              </Link>
            )}
          </li>
          <li>
            <IoIosPhonePortrait />
            <a href="tel://0402405792">(0402) 405 792</a>
          </li>
          <li>
            <IoMdMail />
            <a href="mailto:framers@masterframing.com.au">
              framers@masterframing
            </a>
          </li>
        </ul>
      </div>

      <div className="social-widget">
        <a href="https://www.facebook.com/MasterFramingAustralia">
          <IoLogoFacebook />
        </a>
      </div>
    </div>
  );
};

export default MobileMenuWidgets;
