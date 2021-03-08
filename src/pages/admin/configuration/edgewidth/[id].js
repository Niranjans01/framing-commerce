import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminPage from "../../../../components/Admin/AdminPage";
import { Form, FormGroup } from "react-bootstrap";
import {useInput, useToggleInput} from "../../../../lib/utilities";

import PriceCodeSelect from "../../../../components/Admin/PriceCodeSelect";

import edgeWidthService from "../../../../services/EdgeWidthService";
import { createSubmitHandler } from "../../../../lib/admin-crud-utils";

export default function EditEdgeWidth(props) {
  const router = useRouter();
  const { id } = router.query;
  const isCreate = id === "new";
  const [edgeWidth, setEdgeWidth] = useState(null);
  const [isLoading, setIsLoading] = useState(!isCreate);

  const [displayName, setDisplayName, displayNameBinds] = useInput("");
  const [description, setDescription, descriptionBinds] = useInput("");
  const [discount, setDiscount, discountBinds] = useInput(0);
  const [priceCode, setPriceCode] = useState(null);
  const [isNew, setIsNew, isNewBinds] = useToggleInput(true);
  const [isDeleted, setIsDeleted, isDeletedBinds] = useToggleInput(false);

  useEffect(() => {
    if (!isCreate && id) {
      edgeWidthService.get(id).then(res => {
        setEdgeWidth(res);
        setIsLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    if (!edgeWidth) {
      return;
    }

    setDisplayName(edgeWidth.displayName);
    setDescription(edgeWidth.description);
    setDiscount(edgeWidth.discount);
    setPriceCode(edgeWidth.priceCode);
    setIsNew(edgeWidth.isNew);
    setIsDeleted(edgeWidth.isDeleted);
  }, [edgeWidth]);

  const onSubmit = createSubmitHandler(
    "edge-width",
    edgeWidthService,
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
    (obj) => `/admin/configuration/edgewidth/${obj.id}`,
    !isCreate ? id : null,
    isCreate,
    (e) => {
      if (e) {
        setEdgeWidth(e);
      }
      setIsLoading(false);
    },
  );

  return (
    <AdminPage title="Edit edge width" isLoading={isLoading}>
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
        <button type="button" onClick={() => router.back()} className="btn btn-lg btn-primary mt-3 ml-3">Back to Edge Width</button>
      </Form>
    </AdminPage>
  );
}
