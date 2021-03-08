import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Form, FormGroup } from "react-bootstrap";
import { useInput } from "../../../lib/utilities";
import Link from "next/link";

import AdminPage from "../../../components/Admin/AdminPage";
import shippingService from "../../../services/ShippingService";
import { createSubmitHandler } from "../../../lib/admin-crud-utils";

export default function EditShipping(props) {
  const router = useRouter();
  const { id } = router.query;
  const isCreate = id === "new";
  const [shipping, setShipping] = useState(null);

  const [fee, setFee, feeBinds] = useInput("");
  const [zip, setZip, zipBinds] = useInput(null);

  useEffect(() => {
    if (!isCreate && id) {
      shippingService.get(id).then(setShipping);
    }
  }, [id]);

  useEffect(() => {
    if (!shipping) {
      return;
    }

    setFee(shipping.fee);
    setZip(shipping.zip);
  }, [shipping]);

  const onSubmit = createSubmitHandler(
    "shipping",
    shippingService,
    async () => {
      return {
        fee,
        zip,
      };
    },
    (obj) => obj.zip,
    (obj) => `/admin/shipping-fee/${obj.id}`,
    !isCreate ? id : null,
    isCreate,
    setShipping
  );

  return (
    <AdminPage title="Edit Shipping">
      <Form onSubmit={onSubmit}>
        <div className="form-row">
          <FormGroup className="col-md-12">
            <label htmlFor="zip">Zip</label>
            <input
              id="zip"
              type="number"
              className="form-control"
              required
              {...zipBinds}
            />
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup className="col-md-12">
            <label htmlFor="fee">Fees</label>
            <input
              id="fee"
              type="number"
              className="form-control"
              required
              {...feeBinds}
            />
          </FormGroup>
        </div>
        <div className="d-flex flex-row">
        <button type="submit" className="btn btn-lg btn-primary mt-3 d-flex">
          {isCreate ? "Create" : "Save"}
        </button>
        <button className="btn btn-lg btn-primary mt-3 ml-3 d-flex" onClick={(e) => {e.preventDefault(),router.push("/admin/shipping-fee")}}>
        Go Back to all shipping codes
        </button>
        </div>
      </Form>
    </AdminPage>
  );
}
