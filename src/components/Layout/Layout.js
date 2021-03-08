import { Header } from "../Header";
import { Footer } from "../Footer";

const Layout = ({ children, aboutOverlay }) => {
  return (
    <div>
      <Header aboutOverlay={aboutOverlay} />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
