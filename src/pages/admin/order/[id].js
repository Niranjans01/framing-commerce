import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import AdminPage from "../../../components/Admin/AdminPage";
import { Form, FormGroup, Modal, Button } from "react-bootstrap";
import { useInput, useToggleInput } from "../../../lib/utilities";
import { DateTime } from "luxon";

import orderService from "../../../services/OrderService";
import productService from "../../../services/ProductService2";
import { createSubmitHandler } from "../../../lib/admin-crud-utils";
import moment from 'moment'

// import { useReactToPrint } from 'react-to-print';
import ReactToPrint from 'react-to-print';

function AddressModal(props) {
  const componentRef = useRef();
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <h4 className="mt-2 mb-4">Shipping Address</h4>
        <hr/>
        <ShippingAddress address={props.address} className="mr-2 ml-2 mb-2 mt-2" ref={componentRef}/>
        <div className="mt-3 mb-3">
        <ReactToPrint
                trigger={() => { return (<button type="button" className="btn btn-sm btn-primary">Print Address</button>) }}
                content={() => componentRef.current}
              />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

class ShippingAddress extends React.PureComponent {
  constructor(props) {
    super(props)
  }
  render(){
    const {firstname,lastname,street,suburb,city,state,zip,phone} = this.props.address
    return(
      <div>
      <p><strong>{firstname} {lastname}</strong></p>
      <p>{street}, {suburb}</p>
      <p>{city}, {state}, {zip}</p>
      <p>{phone}</p>
      </div>
    )
  }
}

class ReadyToPrint extends React.PureComponent {

  constructor(props) {
    super(props)
  }
  render() {
    const { items, print, hooks } = this.props
    const { phoneNo, owner, email, couponCode, paymentProvider, street, suburb, comments, zip, city, state, orderDate, lastUpdatedBy, lastUpdatedOn, orderNumber, orderTotal, trackingNumberBinds, transactionIdBinds, isShippedBinds, isPaidBinds } = hooks
    return (
      <div>
        <div className="form-row">
          <FormGroup className="col-md-4">
            <label htmlFor="orderNumber">Order Number</label>
            <input id="orderNumber" type="text" className="form-control" value={orderNumber} readOnly={true} />
          </FormGroup>
          <FormGroup className="col-md-4">
            <label htmlFor="orderDate">Order Date</label>
            <input id="orderDate" type="text" className="form-control" value={orderDate} readOnly={true} />
          </FormGroup>
          <FormGroup className="col-md-4">
            <label htmlFor="couponCode">Coupon Code</label>
            <input id="couponCode" type="text" className="form-control" value={couponCode} readOnly={true} />
          </FormGroup>
          <FormGroup className="col-md-6">
            <label htmlFor="owner">Customer Name</label>
            <input id="owner" type="text" className="form-control" value={owner} readOnly={true} />
          </FormGroup>
          <FormGroup className="col-md-6">
            <label htmlFor="email">Customer Email</label>
            <input id="email" type="text" className="form-control" value={email} readOnly={true} />
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup className="col-md-6">
            <label htmlFor="street">Street</label>
            <input id="street" type="text" className="form-control" value={street} readOnly={true} />
          </FormGroup>
          <FormGroup className="col-md-3">
            <label htmlFor="suburb">Suburb</label>
            <input id="suburb" type="text" className="form-control" value={suburb} readOnly={true} />
          </FormGroup>
          <FormGroup className="col-md-3">
            <label htmlFor="zip">Zip Code</label>
            <input id="zip" type="text" className="form-control" value={zip} readOnly={true} />
          </FormGroup>
          <FormGroup className="col-md-6">
            <label htmlFor="city">City</label>
            <input id="city" type="text" className="form-control" value={city} readOnly={true} />
          </FormGroup>
          <FormGroup className="col-md-6">
            <label htmlFor="city">State</label>
            <input id="state" type="text" className="form-control" value={state} readOnly={true} />
          </FormGroup>
          <FormGroup className="col-md-6">
            <label htmlFor="phone">Phone</label>
            <input id="phone" type="text" className="form-control" value={phoneNo} readOnly={true} />
          </FormGroup>
          <FormGroup className="col-md-6">
            <label>Order Comments</label>
            <textarea id="comments" className="form-control mb-2" value={comments} readOnly={true} />
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup className="col-md-6">
            <label htmlFor="lastUpdatedBy">Last Updated By</label>
            <input id="lastUpdatedBy" type="text" className="form-control" value={lastUpdatedBy} readOnly={true} />
          </FormGroup>
          <FormGroup className="col-md-6">
            <label htmlFor="lastUpdatedOn">Last Updated On</label>
            <input id="lastUpdatedOn" type="text" className="form-control" value={lastUpdatedOn} readOnly={true} />
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup className="col-md-6">
            <label htmlFor="paymentProvider">Payment Provider</label>
            <input id="paymentProvider" type="text" className="form-control" value={paymentProvider} readOnly={true} />
          </FormGroup>
          <FormGroup className="col-md-6">
            <label htmlFor="transactionId">Transaction Id</label>
            <input id="transactionId" type="text" className="form-control" {...transactionIdBinds} />
          </FormGroup>
          <FormGroup className="col-md-12">
            <label htmlFor="trackingNumber">Tracking Number</label>
            <input id="trackingNumber" type="text" className="form-control" {...trackingNumberBinds} />
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup className="col-md-12">
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" id="isShipped" {...isShippedBinds} />
              <label className="form-check-label" htmlFor="isShipped">Shipped?</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" id="isPaid" {...isPaidBinds} />
              <label className="form-check-label" htmlFor="isPaid">Paid?</label>
            </div>
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup className="col-md-12">
            <label className="font-weight-bold">Order Items</label>
            <div>
              {items.map((item, index) => (
                <div key={`item-${index}`} className="border rounded p-3 mt-3 col-md-12">
                  { item.configurations && <ItemWithConfigurations item={item} print={print} />}
                  { item.variant && <ItemWithVariant item={item} />}
                </div>
              ))}
            </div>
          </FormGroup>
        </div>
      </div>
    )
  }
}

function ItemWithVariant({ item }) {
  const [product, setProduct] = useState({});
  useEffect(() => {
    if (!item) {
      return;
    }
    productService.get(item.product).then(res => {
      setProduct(res.product);
    })
  }, [item]);

  return (
    <p>
      <span className="font-weight-bold">{product.displayName} </span>
       ({item.variant.name}):
      <span className="font-italic font-weight-bold"> ${item.variant.price.toFixed(2)} AUD</span>
    </p>
  );
}

function DisplayConfiguration({ configuration }) {
  const type = configuration.type;
  switch (type) {
    case "dimension":
      return (<p>Dimensions: {configuration.value.width} cm x {configuration.value.height} cm</p>)
    case "frame":
      return (
        <p>Frame: <a className="badge badge-pill badge-light" href={`/admin/configuration/frame/${configuration.value}`}>{configuration.displayName}</a></p>
      );
    case "print":
      return (
        <p>Printing: <a className="badge badge-pill badge-light" href={`/admin/configuration/print/${configuration.value}`}>{configuration.displayName}</a></p>
      );
    case "glass":
      return (
        <p>Glass: <a className="badge badge-pill badge-light" href={`/admin/configuration/glass/${configuration.value}`}>{configuration.displayName}</a></p>
      );
    case "backing":
      return (
        <p>Backing: <a className="badge badge-pill badge-light" href={`/admin/configuration/backing/${configuration.value}`}>{configuration.displayName}</a></p>
      );
    case "edge":
      return (
        <p>Edge: <a className="badge badge-pill badge-light" href={`/admin/configuration/edge/${configuration.value}`}>{configuration.displayName}</a></p>
      );
    case "edge_width":
      return (
        <p>Edge width: <a className="badge badge-pill badge-light" href={`/admin/configuration/edgewidth/${configuration.value}`}>{configuration.displayName}</a></p>
      );
    case "mirror":
      return (
        <p>Mirror: <a className="badge badge-pill badge-light" href={`/admin/configuration/mirror/${configuration.value}`}>{configuration.displayName}</a></p>
      );
    case "stretching":
      return (
        <p>Stretching: <a className="badge badge-pill badge-light" href={`/admin/configuration/stretch/${configuration.value}`}>{configuration.displayName}</a></p>
      );
    case "top_mat":
    case "bottom_mat":
      const name = type === "top_mat" ? "Top mat" : "Bottom mat";
      const value = configuration.value;
      return (
        <>
          <div className="font-weight-bold mb-2">{name}</div>
          { Object.keys(value).filter(key => key !== "image").map((key, index) => (
            <div key={`key-${index}`}>
              <span>{key.substr(0, 1).toUpperCase() + key.substr(1)}: </span>
              <span className="font-weight-bold">{value[key]} {typeof value[key] === "number" && "cm"}</span>
            </div>
          ))}
        </>
      );

    default:
      return (<p>Unsupported configuration {type}</p>)
  }
}

function ItemWithConfigurations({ item, print }) {
  const [product, setProduct] = useState({});
  const [image, setImage] = useState(null);
  const [configurations, setConfigurations] = useState([]);

  useEffect(() => {
    if (!item) {
      return;
    }
    setImage(item.image || { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQoQOgLRs5_GkXPyYrZGYlvG7utVUc_lg1K5Q&usqp=CAU" });
    setConfigurations(item.configurations);

    productService.get(item.product).then(res => {
      setProduct(res.product);
    })
  }, [item]);

  return (
    <div className="row">
      <header className="col-md-12 font-weight-bold">{product.displayName}: <span className="font-italic">${Math.round(item.price)} AUD</span></header>
      <article>
        {product.displayName !== "Mirrors" && image &&
          <>
            {!print && (
              <div className={`col-md-12 pt-2 btn btn-link`}>
                <a href={image.url}>Image (click here to download)</a>
              </div>
            )}
            <div className="col-md-12">
              <img src={image.url} height={200} alt="image" />
            </div>
          </>
        }
        {configurations.map((configuration, index) => (
          <div key={`item-with-configuration-${index}`} className="col-md-12 py-3">
            <DisplayConfiguration configuration={configuration} />
          </div>
        ))}
      </article>
    </div>
  );
}


export default function EditOrder(props) {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);

  const [items, setItems] = useState([]);
  const [paymentProvider, setPaymentProvider] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [trackingNumber, setTrackingNumber, trackingNumberBinds] = useInput("");
  const [transactionId, setTransactionId, transactionIdBinds] = useInput("");
  const [isShipped, setIsShipped, isShippedBinds] = useToggleInput(false);
  const [isPaid, setIsPaid, isPaidBinds] = useToggleInput(false);
  const [owner, setOwner] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [street, setStreet] = useState("");
  const [suburb, setSuburb] = useState("");
  const [comments, setComments] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [lastUpdatedBy, setLastUpdatedBy] = useState("");
  const [lastUpdatedOn, setLastUpdatedOn] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [orderTotal, setOrderTotal] = useState("");
  const [modalShow, setModalShow] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [print, setPrint] = useState(false)
  const componentRef = useRef();

  useEffect(() => {
    if (!id) {
      return;
    }
    orderService.get(id).then(order => {
      setOrder(order);
      setIsLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (!order) {
      return;
    }
    setOrderNumber(order.id);
    setItems(order.items);
    setPaymentProvider(order.paymentProvider);
    setCouponCode(order.couponCode || "");
    setTrackingNumber(order.trackingNumber || "");
    setTransactionId(order.transactionId || "");
    setIsShipped(order.isShipped);
    setIsPaid(order.isPaid);
    setOrderTotal(order.orderTotal);

    if (order.shippingAddress) {
      const address = order.shippingAddress;
      setOwner(`${address.firstname} ${address.lastname}`)
      setEmail(address.email);
      setStreet(address.street);
      setSuburb(address.suburb);
      setZip(address.zip);
      setCity(address.city);
      setState(address.state);
      setPhoneNo(address.phone);
      if (address.comments && address.comments.length > 0) {
        setComments(address.comments)
      }
    }

    setOrderDate(moment(DateTime.fromMillis(order.orderDate)).format("DD-MM-YYYY"));
    if (order.lastUpdatedBy) {
      setLastUpdatedBy(order.lastUpdatedBy.firstName);
    }

    if (order.lastUpdatedOn) {
      setLastUpdatedOn(moment(DateTime.fromMillis(order.lastUpdatedOn)).format("DD-MM-YYYY"))
    }

  }, [order]);

  const onSubmit = createSubmitHandler(
    "order",
    orderService,
    async () => {
      setIsLoading(true);
      return {
        trackingNumber,
        isShipped,
        isPaid,
        transactionId
      };
    },
    (obj) => obj.id,
    (obj) => `/admin/order/${obj.id}`,
    id,
    false,
    (e) => {
      if (e) {
        setOrder(e);
      }

      setIsLoading(false);
    },
  );

  return (
    <AdminPage title="Edit order" isLoading={isLoading}>
      <Form onSubmit={onSubmit}>
        <ReadyToPrint
          ref={componentRef}
          items={items}
          print={print}
          hooks={{ phoneNo, owner, email, couponCode, paymentProvider, street, suburb, comments, zip, city, state, orderDate, lastUpdatedBy, lastUpdatedOn, orderNumber, orderTotal, trackingNumberBinds, transactionIdBinds, isShippedBinds, isPaidBinds }}
        />
        {items && items.length > 0 && (
          <div className="row">
            <div className="col-md-12">
              <ReactToPrint
                trigger={() => { return (<button type="button" className="btn btn-md btn-primary">Print Details</button>) }}
                content={() => componentRef.current}
              />
              <button type="submit" className="btn btn-md btn-primary ml-2" onClick={(e) => {e.preventDefault();setModalShow(true)}}>Print Address</button>
            </div>
          </div>
        )}
        <hr />
        {order.shippingAddress && (
          <AddressModal show={modalShow} onHide={() => setModalShow(false)} address={order.shippingAddress}/>
        )}
        <button type="submit" className="btn btn-lg btn-primary mt-3">Save</button>
        <button type="button" onClick={() => router.back()} className="btn btn-lg btn-primary mt-3 ml-3">Back to orders</button>
      </Form>
    </AdminPage>
  );
}
