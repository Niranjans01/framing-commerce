import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminPage from "../../../../components/Admin/AdminPage";
import { Form, FormGroup } from "react-bootstrap";
import {useInput, useToggleInput} from "../../../../lib/utilities";

import PriceCodeSelect from "../../../../components/Admin/PriceCodeSelect";

import backingService from "../../../../services/BackingService";
import { createSubmitHandler } from "../../../../lib/admin-crud-utils";

export default function EditBacking(props) {
  const router = useRouter();
  const { id } = router.query;
  const isCreate = id === "new";
  const [backing, setBacking] = useState(null);

  const [displayName, setDisplayName, displayNameBinds] = useInput("");
  const [description, setDescription, descriptionBinds] = useInput("");
  const [discount, setDiscount, discountBinds] = useInput(0);
  const [priceCode, setPriceCode] = useState(null);
  const [isNew, setIsNew, isNewBinds] = useToggleInput(true);
  const [isDefault, setIsDefault, isDefaultBinds] = useToggleInput(false);
  const [isDeleted, setIsDeleted, isDeletedBinds] = useToggleInput(false);

  const [isLoading, setIsLoading] = useState(!isCreate);

  useEffect(() => {
    if (!isCreate && id) {
      backingService.get(id).then(backing => {
        setBacking(backing);
        setIsLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    if (!backing) {
      return;
    }

    setDisplayName(backing.displayName);
    setDescription(backing.description);
    setDiscount(backing.discount);
    setPriceCode(backing.priceCode);
    setIsNew(backing.isNew);
    setIsDeleted(backing.isDeleted);
    if(backing.isDefault){
      setIsDefault(true);
    }
    else{
      setIsDefault(false);
    }
  }, [backing]);

  const onSubmit = createSubmitHandler(
    "backing",
    backingService,
    async () => {
      setIsLoading(true);
      return {
        displayName,
        description,
        isNew,
        isDefault,
        priceCode,
        discount,
        isDeleted,
      };
    },
    (obj) => obj.displayName,
    (obj) => `/admin/configuration/backing/${obj.id}`,
    !isCreate ? id : null,
    isCreate,
    (e) => {
      if (e) {
        setBacking(e);
      }
      setIsLoading(false);
    },
  );

  return (
    <AdminPage title="Edit backing" isLoading={isLoading}>
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
              <input className="form-check-input" type="checkbox" id="isDefault" { ...isDefaultBinds }/>
              <label className="form-check-label" htmlFor="isDefault">Default</label>
            </div>
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
        <button type="button" onClick={() => router.back()} className="btn btn-lg btn-primary mt-3 ml-3">Back to Backings</button>
      </Form>
    </AdminPage>
  );
}
