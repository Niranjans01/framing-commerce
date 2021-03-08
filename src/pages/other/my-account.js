import Link from "next/link";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import PasswordValidator from "password-validator";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaRegPlusSquare, FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { Layout } from "../../components/Layout";
import { Breadcrumb } from "../../components/Breadcrumb";
import { useUser } from "../../contexts/AccountContext";
import { useRouter } from "next/router";
import { accountService } from "../../services/AccountService";
import orderService from "../../services/OrderService";
import { useToasts } from "react-toast-notifications";
import Address from "../../components/Address";
import {DateTime} from "luxon";

import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {Search} from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import moment from 'moment';
const { SearchBar } = Search;

const MyAccount = () => {
  const router = useRouter()

  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [accountInfo, setAccountInfo] = useState(null);
  const { addToast } = useToasts();
  const [orders, setOrders] = useState([]);
  const [loading,setLoading] = useState(false)

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

  const validatePassword = (e) => {
    if (!schema.validate(e.target.value)) {
      if (e.target.id === "current-pwd") {
        setErrorMessage({
          ...errorMessage,
          currPassword: [
            "Must contain at least 8 characters",
            "Must contain alphanumeric characters",
            "Must not contain spaces",
            "Must not be a commonly used password",
          ],
        });
      } else {
        setErrorMessage({
          ...errorMessage,
          newPassword: [
            "Must contain at least 8 characters",
            "Must contain alphanumeric characters",
            "Must not contain spaces",
            "Must not be a commonly used password",
          ],
        });
      }
    } else {
      if (e.target.id === "current-pwd") {
        setErrorMessage({
          ...errorMessage,
          currPassword: null,
        });
      } else {
        setErrorMessage({
          ...errorMessage,
          newPassword: null,
        });
      }
    }
  };

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
  const { user, changePassword } = useUser();

  useEffect(() => {
    if (!user) {
      router.replace("/other/login-register");
    }

    orderService.find({}).then(setOrders);
  }, []);

  const fetchUserInfo = async (id) => {
    try {
      const user = await accountService.getUser(id);
      setAccountInfo(user);
      setFirstName(user?.firstName || "");
      setLastName(user?.lastName || "");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) fetchUserInfo(user.id);
  }, [user]);

  const saveChanges = async () => {
    try {
      setLoading(true)
      setErrorMessage({
        ...errorMessage,
        apiError: "",
      });
      await accountService.updateUser({
        id: user.id,
        firstName,
        lastName,
        shippingAddress: accountInfo.shippingAddress
      });
      const noErrors =
        Object.values(errorMessage).filter((e) => e).length === 0;
      if (currPassword && newPassword && confPassword && noErrors) {
        await changePassword(user, user.email, currPassword, newPassword);
      }
      addToast("Updated details successfully.", {
        appearance: "success",
        autoDismiss: true,
      });
      setCurrPassword("");
      setNewPassword("");
      setConfPassword("");
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
      setErrorMessage({
        ...errorMessage,
        apiError: error.message,
      });
    }
  };

  const saveAddress = async (values, isDelete) => {
    try {
      let addresses = accountInfo.shippingAddress || [];
      if (isDelete) {
        addresses.splice(values, 1);
      } else if (editIndex !== null) {
        addresses = [
          ...addresses.slice(0, editIndex),
          values,
          ...addresses.slice(editIndex + 1),
        ];
      } else {
        addresses.push(values);
      }
      await accountService.updateUser({
        id: accountInfo.id,
        shippingAddress: addresses,
      });
      setAccountInfo({
        ...accountInfo,
        shippingAddress: addresses,
      });
      addToast("Updated details successfully.", {
        appearance: "success",
        autoDismiss: true,
      });
      resetAddress();
    } catch (error) {
      console.log(error);
    }
  };

  const resetAddress = () => {
    setIsEdit(false);
    setEditIndex(null);
  };

  const editAddress = (idx) => {
    setIsEdit(true);
    setEditIndex(idx);
  };

  const columns = [
    {
      dataField: "id",
      text: "Id",
      formatter: (cell, order) => {
        return (
          order.id
        );
      },
      headerStyle: (colum, colIndex) => {
        return { width: '250px', textAlign: 'center' };
      }
    },
    {
      dataField:'date',
      text:'Date',
      formatter:(cell,order)=>{
        return (
          moment(DateTime.fromMillis(order.orderDate)).format("DD-MM-YYYY")
        )
      },
      searchable: true,
      headerStyle: (colum, colIndex) => {
        return { width: '250px', textAlign: 'center' };
      }
    },
    {
      dataField:'status',
      text:'Status',
      formatter:(cell,order)=>{
        return (
          order.trackingNumber ?  `Tracking no:  ${order.trackingNumber}` : "Not yet shipped"
        )
      },
      headerStyle: (colum, colIndex) => {
        return { width: '250px', textAlign: 'center' };
      },
      searchable: true,
    },
    {
      dataField:'total',
      text:'Total',
      formatter:(cell,order)=>{
        return (
          `$${order.orderTotal?.toFixed(2) || 0} ${ !order.isPaid ? "(requires payment)" : ""}`
        )
      },
      headerStyle: (colum, colIndex) => {
        return { width: '220px', textAlign: 'center' };
      },
      searchable: true,
    },
  ];
  const paginationOptions = {};

  const onColumnMatch = ({searchText,
    value,
    column,
    row}) =>{
      let date = DateTime.fromMillis(row.orderDate).toLocaleString()
      let total = (`$${row.orderTotal?.toFixed(2) || 0} ${ !row.isPaid ? "(requires payment)" : ""}`).toLowerCase()
      let status = (row.trackingNumber ?  `Tracking no:  ${row.trackingNumber}` : "Not yet shipped").toLowerCase()
      if(date.indexOf(searchText)>=0 || total.indexOf(searchText)>=0 || status.indexOf(searchText)>=0){
        return true
      }
      else{
        return false
      }
    }

  return (
    <Layout>
      {/* breadcrumb */}
      <Breadcrumb
        pageTitle="My Account"
        backgroundImage="/assets/images/backgrounds/account-background.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>My Account</li>
        </ul>
      </Breadcrumb>
      <div className="my-account-area space-mt--r130 space-mb--r130">
        <Container>
          <Tab.Container defaultActiveKey="dashboard">
            <Nav
              variant="pills"
              className="my-account-area__navigation space-mb--r60"
            >
              <Nav.Item>
                <Nav.Link eventKey="dashboard">Dashboard</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="orders">Order History</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="address">Shipping Addresses</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="accountDetails">Account Details</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="dashboard">
                <div className="my-account-area__content">
                  <h3>Dashboard</h3>
                  <div className="welcome space-mb--30">
                    {/* TODO: Load email/first name dynamically here */}
                    <p>
                      Hello,
                      <strong>{user ? ` ${user.email}` : ""}</strong>
                    </p>
                  </div>
                  <p>
                    From your account dashboard. you can easily check &amp; view
                    your recent orders, manage your shipping and billing
                    addresses and edit your password and account details.
                  </p>
                </div>
                {/* <div className="single-input-item text-right space-mt--30">
                  <button className="lezada-button lezada-button--small">Logout</button>
                </div> */}
              </Tab.Pane>
              <Tab.Pane eventKey="orders">
                <div className="my-account-area__content">
                  <h3>Order History</h3>{" "}
                  <div className="myaccount-table text-center">
                    { orders.length > 0 && (
                      <ToolkitProvider
                      keyField="id"
                      data={ orders }
                      columns={ columns }
                      search={ {
                        onColumnMatch
                      } }
                    >
                      {
                        props => (
                          <div>
                            <div className="float-right">
                              <SearchBar { ...props.searchProps } />
                            </div>
                            <BootstrapTable 
                              { ...props.baseProps }
                              pagination={ paginationFactory(paginationOptions) }
                              striped hover condensed
                            />
                          </div>
                        )
                      }
              
                    </ToolkitProvider>
                    )
                      // <table className="table table-bordered">
                      //   <thead className="thead-light">
                      //   <tr>
                      //     <th>Order</th>
                      //     <th>Date</th>
                      //     <th>Status</th>
                      //     <th>Total</th>
                      //   </tr>
                      //   </thead>
                      //   <tbody>
                      //   { orders.map((order, index) => (
                      //     <tr key={`order-${index}`}>
                      //       <td>{order.id}</td>
                      //       <td>{DateTime.fromMillis(order.orderDate).toLocaleString()}</td>
                      //       <td>{order.trackingNumber ?  `Tracking no:  ${order.trackingNumber}` : "Not yet shipped"}</td>
                      //       <td>${order.orderTotal?.toFixed(2) || 0} { !order.isPaid ? "(requires payment)" : ""}</td>
                      //     </tr>
                      //   )) }
                      //   </tbody>
                      // </table>
                    }
                    { orders.length === 0 && "No orders" }
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="address">
                <div className="my-account-area__content">
                  <h3>Shipping Addresses</h3>
                  {/* TODO: Load shipping details dynamically here */}
                  {isEdit ? (
                    <Address
                      onSubmit={saveAddress}
                      onReset={resetAddress}
                      editIndex={editIndex}
                      values={
                        editIndex !== null
                          ? accountInfo?.shippingAddress[editIndex]
                          : null
                      }
                    />
                  ) : (
                    <div>
                      <div className="address-list">
                        {accountInfo?.shippingAddress?.length
                          ? accountInfo.shippingAddress.map(
                              (
                                {
                                  street = "",
                                  suburb = "",
                                  city = "",
                                  state = "",
                                  zip = "",
                                  phone = "",
                                },
                                index
                              ) => (
                                <address key={index}>
                                  <p>
                                    {street}, {suburb}, {city}, {state} {zip}
                                  </p>
                                  <p>Mobile: {phone}</p>
                                  <div className="single-input-item space-mt--30">
                                    <button
                                      className="lezada-button lezada-button--small lezada-button--icon--left"
                                      onClick={() => editAddress(index)}
                                    >
                                      <FaRegEdit />
                                    </button>
                                    <button
                                      className="lezada-button lezada-button--small lezada-button--icon--left"
                                      onClick={() => saveAddress(index, true)}
                                    >
                                      <FaRegTrashAlt />
                                    </button>
                                  </div>
                                </address>
                              )
                            )
                          : null}
                      </div>
                      <div className="single-input-item space-mt--30">
                        <button
                          className="lezada-button lezada-button--small lezada-button--icon--left"
                          onClick={() => setIsEdit(!isEdit)}
                        >
                          <FaRegPlusSquare /> Add Address
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="accountDetails">
                <div className="my-account-area__content">
                  <h3>Account Details</h3>{" "}
                  {/* TODO: Load account details dynamically here */}
                  <div className="account-details-form">
                    <form onSubmit={(e) => e.preventDefault()}>
                      <Row>
                        <Col lg={6}>
                          <div className="single-input-item">
                            <label htmlFor="first-name" className="required">
                              First Name
                            </label>
                            <input
                              type="text"
                              id="first-name"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="single-input-item">
                            <label htmlFor="last-name" className="required">
                              Last Name
                            </label>
                            <input
                              type="text"
                              id="last-name"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                            />
                          </div>
                        </Col>
                      </Row>
                      <div className="single-input-item">
                        <label htmlFor="email" className="required">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={user?.email}
                          onChange={() => {}}
                          disabled
                        />
                      </div>
                      <fieldset>
                        <legend>Password change</legend>
                        <div className="single-input-item">
                          <label htmlFor="current-pwd" className="required">
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="current-pwd"
                            onChange={(e) => setCurrPassword(e.target.value)}
                            value={currPassword}
                            onBlur={validatePassword}
                          />
                          {errorMessage.currPassword ? (
                            <span className="error-message">
                              <ul>
                                {errorMessage.currPassword.map((message) => {
                                  return <li>{message}</li>;
                                })}
                              </ul>
                            </span>
                          ) : null}
                        </div>
                        <div className="row">
                          <div className="col-lg-6">
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
                          </div>
                          <div className="col-lg-6">
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
                              />
                              {errorMessage.confPassword ? (
                                <span className="error-message">
                                  {errorMessage.confPassword}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </fieldset>
                      <div className="single-input-item">
                        <button onClick={saveChanges} disabled={loading}>{loading?"Please Wait...":"Save Changes"}</button>
                      </div>
                      {errorMessage.apiError ? (
                        <span className="error-message">
                          <ul>Something went wrong!</ul>
                        </span>
                      ) : null}
                    </form>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Container>
      </div>
    </Layout>
  );
};

export default MyAccount;
