import { Fragment } from "react";
import App from "next/app";
import Head from "next/head";
import withReduxStore from "../lib/with-redux-store";
import { Provider } from "react-redux";
import { ToastProvider } from "react-toast-notifications";
import { persistStore } from "redux-persist";
import "../assets/scss/styles.scss";
import AccountProvider from "../contexts/AccountContext";
import { ProductsContextProvider } from "../contexts/ProductsContext";
import { PriceContextProvider } from "../contexts/PriceContext";
import { CartProvider } from "../contexts/CartContext";

import "react-datepicker/dist/react-datepicker.css";
import GoogleFonts from "next-google-fonts";
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

class MyApp extends App {
  constructor(props) {
    super(props);
    this.persistor = persistStore(props.reduxStore);
    this.state = {
      ready: false,
    };
  }

  load(f, c) {
    var a = document.createElement('script');
    a.async = 1;
    a.src = f;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(a, s);
  }

  componentDidMount() {
    this.setState({ ready: true });
    const firebaseConfig = {
      apiKey: "AIzaSyDz0ZGX2CYIuMjX0xchSvzKKDJ7JM_D0sQ",
      authDomain: "masterframing-staging.firebaseapp.com",
      databaseURL: "https://masterframing-staging.firebaseio.com",
      projectId: "masterframing-staging",
      storageBucket: "masterframing-staging.appspot.com",
      messagingSenderId: "3393121351",
      appId: "1:3393121351:web:8d9fc2347cfbe781ec9562",
      measurementId: "G-WR2E7ESFCH"
    };
    this.load('https://www.gstatic.com/firebasejs/8.1.2/firebase-performance-standalone.js');
    window.addEventListener('load', function() {
    firebase.initializeApp(firebaseConfig).performance()
    });
    
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props;

    return (
      <Fragment>
        <GoogleFonts href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap" />
        <Head>
          <title>Master Framing - Picture Framing Specialists</title>
          <link
            rel="icon"
            type="image/x-icon"
            href={process.env.PUBLIC_URL + "/favicon.ico"}
          />
          <script dangerouslySetInnerHTML={{ __html: `!function(n,e){var t,o,i,c=[],f={passive:!0,capture:!0},r=new Date,a="pointerup",u="pointercancel";function p(n,c){t||(t=c,o=n,i=new Date,w(e),s())}function s(){o>=0&&o<i-r&&(c.forEach(function(n){n(o,t)}),c=[])}function l(t){if(t.cancelable){var o=(t.timeStamp>1e12?new Date:performance.now())-t.timeStamp;"pointerdown"==t.type?function(t,o){function i(){p(t,o),r()}function c(){r()}function r(){e(a,i,f),e(u,c,f)}n(a,i,f),n(u,c,f)}(o,t):p(o,t)}}function w(n){["click","mousedown","keydown","touchstart","pointerdown"].forEach(function(e){n(e,l,f)})}w(n),self.perfMetrics=self.perfMetrics||{},self.perfMetrics.onFirstInputDelay=function(n){c.push(n),s()}}(addEventListener,removeEventListener);` }} />

        </Head>
        <CartProvider>
          <ToastProvider placement="bottom-left">
            <PriceContextProvider>
              <ProductsContextProvider>
                <AccountProvider>
                  <Provider store={reduxStore}>
                    {/* <PersistGate
                      loading={<Component {...pageProps} />}
                      persistor={this.persistor}> */}
                    {this.state.ready ? <Component {...pageProps} /> : null}
                    {/* </PersistGate> */}
                  </Provider>
                </AccountProvider>
              </ProductsContextProvider>
            </PriceContextProvider>
          </ToastProvider>
        </CartProvider>
      </Fragment>
    );
  }
}

export default withReduxStore(MyApp);
