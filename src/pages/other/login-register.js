import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { Layout } from "../../components/Layout";
import { Breadcrumb } from "../../components/Breadcrumb";
import { useState, useContext, useEffect } from 'react'
import PasswordValidator from 'password-validator'
import { useUser } from '../../contexts/AccountContext'
import { useRouter } from 'next/router'
import { accountService } from "../../services/AccountService";

const LoginRegister = () => {
  const router = useRouter()

  const [ loginEmail, setLoginEmail ] = useState('')
  const [ loginPassword, setLoginPassword ] = useState('')
  const [ signupEmail, setSignUpEmail ] = useState('')
  const [ signupPassword, setSignUpPassword ] = useState('')
  const [ confPassword, setConfPassword ] = useState('')
  const [ errorMessage, setErrorMessage ] = useState({})

  const { user, loginWithEmailAndPassword, signupWithEmailAndPassword } = useUser()

  useEffect(() => {
    if (user) {
      router.replace('/other/my-account')
    }
  }, [user])

  const schema = new PasswordValidator()
          .is().min(8)
          .is().max(100)
          .digits([1])
          .letters([1])
          .has().not().spaces()
          .is().not().oneOf([
            'Passw0rd',
            'Password123',
            'abc123',
            'qwerty123',
            '1q2w3e4r',
            'password1',
            '123qwe'
          ])

  const validateEmail = (e) => {
    if (!(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(e.target.value))) {
      if (e.target.id === 'login-email') {
        setErrorMessage({
          ...errorMessage,
          loginEmail: 'Invalid Email'
        })
      } else {
        setErrorMessage({
          ...errorMessage,
          signupEmail: 'Invalid Email'
        })
      }
    } else {
      if (e.target.id === 'login-email') {
        setErrorMessage({
          ...errorMessage,
          loginEmail: null
        })
      } else {
        setErrorMessage({
          ...errorMessage,
          signupEmail: null
        })
      }
    }
  }

  const validatePassword = (e) => {
    if (!(schema.validate(e.target.value))) {
      if (e.target.id === 'login-password') {
        setErrorMessage({
          ...errorMessage,
          loginPassword: [
            'Must contain at least 8 characters',
            'Must contain alphanumeric characters',
            'Must not contain spaces',
            'Must not be a commonly used password'
          ]
        })
      } else {
        setErrorMessage({
          ...errorMessage,
          signupPassword: [
            'Must contain at least 8 characters',
            'Must contain alphanumeric characters',
            'Must not contain spaces',
            'Must not be a commonly used password'
          ]
        })
      }
    } else {
      if (e.target.id === 'login-password') {
        setErrorMessage({
          ...errorMessage,
          loginPassword: null
        })
      } else {
        setErrorMessage({
          ...errorMessage,
          signupPassword: null
        })
      }
    }
  }

  const validateConfPassword = (e) => {
    if (signupPassword !== e.target.value) {
      setErrorMessage({
        ...errorMessage,
        confPassword: 'Passwords do not match'
      })
    } else {
      setErrorMessage({
        ...errorMessage,
        confPassword: null
      })
    }
  }


  const loginHandler = (e) => {
    e.preventDefault()

    loginWithEmailAndPassword(loginEmail, loginPassword).catch((error) => {
      if (error) {
        setErrorMessage({
          ...errorMessage,
          loginError: error.message
        })
      } else {
        setErrorMessage({
          ...errorMessage,
          loginError: null
        })
      }
    })

  }

  const signupHandler = (e) => {
    e.preventDefault();

    signupWithEmailAndPassword(signupEmail, signupPassword)
      .catch((error) => {
        if (error) {
          setErrorMessage({
            ...errorMessage,
            signupError: error.message,
          });
        } else {
          setErrorMessage({
            ...errorMessage,
            signupError: null,
          });
        }
      });
  };

  return (
    <Layout>
      {/* breadcrumb */}
      <Breadcrumb
        pageTitle="Customer Login"
        backgroundImage="/assets/images/backgrounds/login-background.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Customer Login</li>
        </ul>
      </Breadcrumb>
      <div className="login-area space-mt--r130 space-mb--r130">
        <Container>
          <Row>
            <Col lg={6} className="space-mb-mobile-only--50">
              <div className="lezada-form login-form">
                <form id='login-form' onSubmit={loginHandler}>
                  <Row>
                    <Col lg={12}>
                      <div className="section-title--login text-center space-mb--50">
                        <h4 className="space-mb--20">Login</h4>
                        <p>Great to have you back!</p>
                        {errorMessage.loginError ?
                          <span className="error-message">
                            {errorMessage.loginError}
                          </span>
                          : null }
                      </div>
                    </Col>
                    <Col lg={12} className="space-mb--60">
                      <input
                        id='login-email'
                        type="text"
                        placeholder="Username or email address"
                        required
                        onChange={(e) => setLoginEmail(e.target.value)}
                        value={loginEmail}
                        onBlur={validateEmail}
                      />
                      {errorMessage.loginEmail ?
                        <span className="error-message">{errorMessage.loginEmail}</span>
                         : null}
                    </Col>
                    <Col lg={12} className="space-mb--60">
                      <input
                        id='login-password'
                        type="password"
                        placeholder="Password"
                        required
                        onChange={(e) => setLoginPassword(e.target.value)}
                        value={loginPassword}
                        onBlur={validatePassword} />
                        {errorMessage.loginPassword ? (
                            <span className="error-message">
                              <ul>
                                {errorMessage.loginPassword.map(message => {
                                  return <li>{message}</li>
                                })}
                              </ul>
                            </span>
                          ) : null}
                    </Col>
                    <Col lg={12} className="space-mb--30">
                      <button type='submit' className="lezada-button lezada-button--medium">
                        login
                      </button>
                    </Col>
                    <Col>
                    <Link href="/other/lost-password" as={process.env.PUBLIC_URL + "/other/lost-password"}>
                      <a className="reset-pass-link">Lost your password?</a>
                    </Link>
                    </Col>
                  </Row>
                </form>
              </div>
            </Col>
            <Col lg={6}>
              <div className="lezada-form login-form--register">
                <form id='signup-form' onSubmit={signupHandler}>
                  <Row>
                    <Col lg={12}>
                      <div className="section-title--login text-center space-mb--50">
                        <h2 className="space-mb--20">Register</h2>
                        <p>If you don’t have an account, register now!</p>
                        {errorMessage.signupError ?
                        <span className="error-message">{errorMessage.signupError}</span>
                         : null}
                      </div>
                    </Col>
                    <Col lg={12} className="space-mb--30">
                      <label htmlFor="signup-email">
                        Email Address <span className="required">*</span>{" "}
                      </label>
                      <input
                        type="text"
                        id="signup-email"
                        onBlur={validateEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        value={signupEmail}
                        required />
                        {errorMessage.signupEmail ?
                          <span className="error-message">{errorMessage.signupEmail}</span>
                           : null}
                    </Col>
                    <Col lg={12} className="space-mb--50">
                      <label htmlFor="signup-password">
                        Password <span className="required">*</span>{" "}
                      </label>
                      <input
                        type="password"
                        id="signup-password"
                        required
                        value={signupPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        onBlur={validatePassword} />
                        {errorMessage.signupPassword ? (
                            <span className="error-message">
                              <ul>
                                {errorMessage.signupPassword.map(message => {
                                  return <li>{message}</li>
                                })}
                              </ul>
                            </span>
                          ) : null}
                    </Col>
                    <Col lg={12} className="space-mb--50">
                      <label htmlFor="signup-confirm-password">
                        Confirm Password <span className="required">*</span>{" "}
                      </label>
                      <input
                        type="password"
                        id="signup-confirm-password"
                        required
                        value={confPassword}
                        onChange={(e) => setConfPassword(e.target.value)}
                        onBlur={validateConfPassword} />
                        {errorMessage.confPassword ?
                          <span className="error-message">{errorMessage.confPassword}</span>
                           : null}
                    </Col>
                    <Col lg={12} className="text-center">
                      <button type='submit' className="lezada-button lezada-button--medium">
                        register
                      </button>
                    </Col>
                  </Row>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Layout>
  );
};

export default LoginRegister
