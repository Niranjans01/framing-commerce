import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { Layout } from "../../components/Layout";
import { Breadcrumb } from "../../components/Breadcrumb";
import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/AccountContext'
import { useToasts } from "react-toast-notifications";
import PasswordValidator from "password-validator";

const schema = new PasswordValidator()
    .is()
    .min(8)
    .is()
    .max(100)
    .digits([1])
    .letters([1])
    .has()
    .not()
    .spaces()
    .is()
    .not()
    .oneOf([
      "Passw0rd",
      "Password123",
      "abc123",
      "qwerty123",
      "1q2w3e4r",
      "password1",
      "123qwe",
    ]);


const ResetPassword = () => {
    const [ errorMessage, setErrorMessage ] = useState({});
    const [ userEmail, setUserEmail ] = useState(null);
    const { verifyResetToken, resetWithNewPassword } = useUser();
    const [newPassword, setNewPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const { addToast } = useToasts();
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [ok, setOk] = useState(false)
    const [code, setCode] = useState("")

    const getParameterByName = (name, url = window.location.href) => {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    const validateConfPassword = (e) => {
        if (newPassword !== e.target.value) {
          setErrorMessage({
            ...errorMessage,
            confPassword: "Passwords do not match",
          });
        } else {
          setErrorMessage({
            ...errorMessage,
            confPassword: null,
          });
        }
      };
    
      const validatePassword = (e) => {
        if (!schema.validate(e.target.value)) {
            setErrorMessage({
              ...errorMessage,
              newPassword: [
                "Must contain at least 8 characters",
                "Must contain alphanumeric characters",
                "Must not contain spaces",
                "Must not be a commonly used password",
              ],
            });
        } else {
            setErrorMessage({
              ...errorMessage,
              newPassword: null,
            });
        }
      };

    useEffect(() => {
        setFetching(true)
        let actionCode = getParameterByName('oobCode');
        if(actionCode && actionCode.length>1){
            verifyResetToken(actionCode).then(email=>{
                console.log(email)
            setFetching(false)
            setOk(true)
            setUserEmail(email)
            setCode(actionCode)
            }).catch(error=>{
            setFetching(false)
            setOk(false)
        })
        }
        else{
            setFetching(false)
            setOk(false)
        }
      },[])

    const passwordHandler = (e) => {
        e.preventDefault();
        setLoading(true)
        resetWithNewPassword(code,userEmail).then(e=>{
            setLoading(false)
            addToast("Successfully Changed Password, You can Login Now...", {
                appearance: "success",
                autoDismiss: true,
              });
        })
          .catch((error) => {
            setLoading(false)
            if (error) {
            addToast(error.code, {
                    appearance: "error",
                    autoDismiss: true,
                  });
              setErrorMessage({
                ...errorMessage,
                RecoveryError: error.code,
              });
            } else {
              setErrorMessage({
                ...errorMessage,
                RecoveryError: null,
              });
            }
          });
    };
    return (
        <Layout>
            <Breadcrumb
                pageTitle="Reset Password"
                backgroundImage="/assets/images/backgrounds/login-background.jpg">
                <ul className="breadcrumb__list">
                    <li>
                        <Link href="/" as={process.env.PUBLIC_URL + "/"}>
                            <a>Home</a>
                        </Link>
                    </li>

                    <li>Reset Password</li>
                </ul>
            </Breadcrumb>
            <div className="login-area space-mt--r130 space-mb--r130">
                <Container>
                    <Row>
                        <Col lg={6} className="mx-auto space-mb-mobile-only--50">
                            <div className="lezada-form login-form">
                            <form id='login-form' onSubmit={passwordHandler}>
                                    <Row>
                                        <Col lg={12}>
                                            <div className="section-title--login text-center space-mb--50">
                                                {userEmail && !fetching ?(
                                                    <>
                                                    <h2 className="space-mb--20">Welcome {userEmail}</h2>
                                                    <p>Change your Password here:</p>
                                                    </>
                                                ): !userEmail && fetching ?(
                                                    <h2 className="space-mb--20">Please Wait...</h2>)
                                                :!userEmail && !fetching ? (
                                                    <h2 className="space-mb--20">Oouchh! Something went wrong </h2>
                                                ):(
                                                    <h2 className="space-mb--20">Oouchh! Something went wrong </h2>
                                                )}
                                            </div>
                                        </Col>
                                        {ok && (
                                            <>
                                            <Row>
                                            <Col lg={12} className="space-mb--30">
                                              <div className="single-input-item">
                                                <label htmlFor="new-pwd" className="required">
                                                  New Password
                                                </label>
                                                <input
                                                  type="password"
                                                  id="new-pwd"
                                                  onChange={(e) => setNewPassword(e.target.value)}
                                                  value={newPassword}
                                                  onBlur={validatePassword}
                                                  required
                                                />
                                                {errorMessage.newPassword ? (
                                                  <span className="error-message">
                                                    <ul>
                                                      {errorMessage.newPassword.map((message) => {
                                                        return <li>{message}</li>;
                                                      })}
                                                    </ul>
                                                  </span>
                                                ) : null}
                                              </div>
                                            </Col>
                                            <Col lg={12} className="space-mb--30">
                                              <div className="single-input-item">
                                                <label htmlFor="confirm-pwd" className="required">
                                                  Confirm Password
                                                </label>
                                                <input
                                                  type="password"
                                                  id="confirm-pwd"
                                                  onChange={(e) =>
                                                    setConfPassword(e.target.value)
                                                  }
                                                  value={confPassword}
                                                  onBlur={validateConfPassword}
                                                  required
                                                />
                                                {errorMessage.confPassword ? (
                                                  <span className="error-message">
                                                    {errorMessage.confPassword}
                                                  </span>
                                                ) : null}
                                              </div>
                                            </Col>
                                          </Row>
                                          <Col lg={12} className="space-mb--30">
                                          <button type='submit' className="lezada-button lezada-button--medium" disabled={loading}>
                                              {loading? (
                                                  'Please wait...'
                                              ) : ('Reset Password Now')}
                                          </button>
                                      </Col>
                                      </>
                                        )}
                                        <Col>
                                            <Link href="/other/login-register" as={process.env.PUBLIC_URL + "/other/login-register"}>
                                                <a className="reset-pass-link">Login or Sign up?</a>
                                            </Link>
                                        </Col>
                                    </Row>
                                </form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Layout>
    )
}

export default ResetPassword;