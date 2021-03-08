import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import AdminPage from "../../../components/Admin/AdminPage";
import { Form, FormGroup } from "react-bootstrap";
import {useInput, useToggleInput} from "../../../lib/utilities";
import {DateTime} from 'luxon'

import DatePicker from 'react-datepicker'

import { useToasts } from "react-toast-notifications";

import couponService from "../../../services/CouponService";
import {createSubmitHandler} from "../../../lib/admin-crud-utils";
import moment from 'moment';
export default function EditCouponCode(props) {
  const router = useRouter();
  const { id } = router.query;
  const isCreate = id === "new";
  const [couponCode, setCouponCode] = useState(null);

  const [displayName, setDisplayName, displayNameBinds] = useInput("");
  const [description, setDescription, descriptionBinds] = useInput("");
  const [discount, setDiscount, discountBinds] = useInput(0);
  const [isDeleted, setIsDeleted, isDeletedBinds] = useToggleInput(false);
  const [expiryDate, setExpiryDate] = useState(new Date());

  const [isLoading, setIsLoading] = useState(!isCreate);

  useEffect(() => {
    if (!isCreate && id) {
      couponService.get(id).then(res => {
        setCouponCode(res)
        setIsLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    if (!couponCode) {
      return
    }

    setDisplayName(couponCode.displayName);
    setDescription(couponCode.description)
    setDiscount(couponCode.discount)
    setIsDeleted(couponCode.isDeleted)
    if(couponCode.expiryDate){
      setExpiryDate((new Date(couponCode.expiryDate)))
    }

  }, [couponCode]);

  const onSubmit = createSubmitHandler(
    "coupon code",
    couponService,
    async () => {
      setIsLoading(true);
      return {
        displayName,
        description,
        discount,
        isDeleted,
        expiryDate: expiryDate.getTime(),
      };
    },
    (obj) => obj.displayName,
    (obj) => `/admin/coupon-code/${obj.id}`,
    !isCreate ? id : null,
    isCreate,
    (e) => {
      if (e) {
        setCouponCode(e);
      }
      setIsLoading(false);
    },
  );


  let title = isCreate ? "New coupon code" : "Edit coupon code";

  return (
    <AdminPage title={ title } isLoading={isLoading}>
      <Form onSubmit={onSubmit}>
        <div className="form-row">
          <FormGroup className="col-md-12">
            <label htmlFor="displayName">Coupon code</label>
            <input id="displayName" type="text" className="form-control" required { ...displayNameBinds }/>
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup className="col-md-12">
            <label htmlFor="description">Description for the coupon code</label>
            <input id="description" type="text" className="form-control" required { ...descriptionBinds }/>
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup className="col-md-6">
            <label htmlFor="discount">Discount</label>
            <input id="discount" type="number" className="form-control" required { ...discountBinds }/>
          </FormGroup>
          <FormGroup className="col-md-6 my-auto text-center">
            <label className="mr-3" htmlFor="discount">Coupon expiry date:</label>
            <DatePicker dateFormat="dd-MM-yyyy" selected={expiryDate} onChange={date => setExpiryDate(date)}/>
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup className="col-md-12">
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" id="isDeleted" { ...isDeletedBinds }/>
              <label className="form-check-label" htmlFor="isDeleted">Is deleted?</label>
            </div>
          </FormGroup>
        </div>
        <button type="submit" className="btn btn-lg btn-primary mt-3">{isCreate ? "Create" : "Save" }</button>
        <button type="button" onClick={() => router.back()} className="btn btn-lg btn-primary mt-3 ml-3">Back to coupon code</button>
      </Form>
    </AdminPage>
  );
}
