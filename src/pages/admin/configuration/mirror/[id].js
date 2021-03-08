import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminPage from "../../../../components/Admin/AdminPage";
import { Form, FormGroup } from "react-bootstrap";
import {useInput, useToggleInput} from "../../../../lib/utilities";

import PriceCodeSelect from "../../../../components/Admin/PriceCodeSelect";

import mirrorService from "../../../../services/MirrorService";
import { createSubmitHandler } from "../../../../lib/admin-crud-utils";

export default function EditMirror(props) {
  const router = useRouter();
  const { id } = router.query;
  const isCreate = id === "new";
  const [mirror, setMirror] = useState(null);

  const [displayName, setDisplayName, displayNameBinds] = useInput("");
  const [description, setDescription, descriptionBinds] = useInput("");
  const [discount, setDiscount, discountBinds] = useInput(0);
  const [priceCode, setPriceCode] = useInput(null);
  const [isNew, setIsNew, isNewBinds] = useToggleInput(true);
  const [isDeleted, setIsDeleted, isDeletedBinds] = useToggleInput(false  );

  const [isLoading, setIsLoading] = useState(!isCreate);

  useEffect(() => {
    if (!isCreate && id) {
      mirrorService.get(id).then(res => {
        setMirror(res);
        setIsLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    if (!mirror) {
      return;
    }

    setDisplayName(mirror.displayName);
    setDescription(mirror.description);
    setDiscount(mirror.discount);
    setPriceCode(mirror.priceCode);
    setIsNew(mirror.isNew);
    setIsDeleted(mirror.isDeleted);
  }, [mirror]);

  const onSubmit = createSubmitHandler(
    "mirror",
    mirrorService,
    async () => {
      setIsLoading(true);
      return {
        displayName,
        description,
        isNew,
        priceCode,
        discount,
        isDeleted,
      };
    },
    (obj) => obj.displayName,
    (obj) => `/admin/configuration/mirror/${obj.id}`,
    !isCreate ? id : null,
    isCreate,
    (e) => {
      if (e) {
        setMirror(e);
      }
      setIsLoading(false);
    },
  );

  return (
    <AdminPage title="Edit mirror" isLoading={isLoading}>
      <Form onSubmit={onSubmit}>
        <div className="form-row">
          <FormGroup className="col-md-12">
            <label htmlFor="displayName">Display Name</label>
            <input id="displayName" type="text" className="form-control" required { ...displayNameBinds }/>
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup className="col-md-6">
            <label htmlFor="priceCode">Price Code</label>
            <PriceCodeSelect id="priceCode" value={priceCode} onChange={setPriceCode}/>
          </FormGroup>
          <FormGroup className="col-md-6">
            <label htmlFor="discount">Discount (%)</label>
            <input id="discount" type="number" className="form-control" min={0} step={0.1} required { ...discountBinds }/>
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup className="col-md-12">
            <label htmlFor="description">Description</label>
            <textarea id="description" className="form-control" required { ...descriptionBinds }/>
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup className="col-md-12">
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" id="isNew" { ...isNewBinds }/>
              <label className="form-check-label" htmlFor="isNew">New product</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" id="isDeleted" { ...isDeletedBinds }/>
              <label className="form-check-label" htmlFor="isDeleted">Hidden</label>
            </div>
          </FormGroup>
        </div>
        <button type="submit" className="btn btn-lg btn-primary mt-3">{isCreate ? "Create" : "Save" }</button>
        <button type="button" onClick={() => router.back()} className="btn btn-lg btn-primary mt-3 ml-3">Back to Mirror</button>
      </Form>
    </AdminPage>
  );
}
