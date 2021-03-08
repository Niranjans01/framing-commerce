import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { Layout } from "../../components/Layout";
import { Breadcrumb } from "../../components/Breadcrumb";
import { useState } from 'react'
import { useUser } from '../../contexts/AccountContext'
import { useToasts } from "react-toast-notifications";


const LostPassword = () => {
    const [ errorMessage, setErrorMessage ] = useState({});
    const [ userEmail, setUserEmail ] = useState('');
    const { sendRecoverEmail } = useUser();
    const { addToast } = useToasts();
    const [loading, setLoading] = useState(false)

    const validateEmail = (e) => {
        if (!(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(e.target.value))) {
          if (e.target.id === 'user-email') {
            setErrorMessage({
              ...errorMessage,
              userEmail: 'Invalid Email'
            })
          }
        } else {
          if (e.target.id === 'user-email') {
            setErrorMessage({
              ...errorMessage,
              userEmail: null
            })
          }
        }
      }

    const recoveryHandler = (e) => {
        e.preventDefault();
        setLoading(true)
        sendRecoverEmail(userEmail).then(e=>{
            setLoading(false)
            addToast("Successfully Sent Recovery Email", {
                appearance: "success",
                autoDismiss: true,
              });
        })
          .catch((error) => {
            setLoading(false)
            if (error) {
              setErrorMessage({
                ...errorMessage,
                RecoveryError: "No such user. Please register",
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
                pageTitle="Recover Password"
                backgroundImage="/assets/images/backgrounds/login-background.jpg">
                <ul className="breadcrumb__list">
                    <li>
                        <Link href="/" as={process.env.PUBLIC_URL + "/"}>
                            <a>Home</a>
                        </Link>
                    </li>

                    <li>Recover Password</li>
                </ul>
            </Breadcrumb>
            <div className="login-area space-mt--r130 space-mb--r130">
                <Container>
                    <Row>
                        <Col lg={6} className="mx-auto space-mb-mobile-only--50">
                            <div className="lezada-form login-form">
                                <form id='login-form' onSubmit={recoveryHandler}>
                                    <Row>
                                        <Col lg={12}>
                                            <div className="section-title--login text-center space-mb--50">
                                                <h2 className="space-mb--20">We can help you recover your account</h2>
                                                <p>Give us your Email:</p>
                                                {errorMessage.RecoveryError ?
                                                    <span className="error-message">
                                                        {errorMessage.RecoveryError}
                                                    </span>
                                                : null }
                                            </div>
                                        </Col>
                                        <Col lg={12} className="space-mb--60">
                                            <input
                                                id='user-email'
                                                type="text"
                                                placeholder="Email address"
                                                required
                                                onChange={(e) => setUserEmail(e.target.value)}
                                                value={userEmail}
                                                onBlur={validateEmail}
                                            />
                                            {errorMessage.userEmail ?
                                                <span className="error-message">{errorMessage.userEmail}</span>
                                            : null}
                                        </Col>
                                        <Col lg={12} className="space-mb--30">
                                            <button type='submit' className="lezada-button lezada-button--medium" disabled={loading}>
                                                {loading? (
                                                    'Please wait...'
                                                ) : ('Send Recovery Email')}
                                            </button>
                                        </Col>
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

export default LostPassword;