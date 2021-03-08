import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminPage from "../../../../components/Admin/AdminPage";
import { Form, FormGroup } from "react-bootstrap";
import {useInput, useToggleInput} from "../../../../lib/utilities";

import MultiImageUpload from "../../../../components/Admin/MultiImageUpload";

import edgeService from "../../../../services/EdgeService";
import { createSubmitHandler } from "../../../../lib/admin-crud-utils";
import PriceCodeSelect from "../../../../components/Admin/PriceCodeSelect";
import UploadManager from "../../../../services/UploadManager";

export default function EditEdge(props) {
  const router = useRouter();
  const { id } = router.query;
  const isCreate = id === "new";
  const [edge, setEdge] = useState(null);
  const [isLoading, setIsLoading] = useState(!isCreate);

  const [displayName, setDisplayName, displayNameBinds] = useInput("");
  const [description, setDescription, descriptionBinds] = useInput("");
  const [discount, setDiscount, discountBinds] = useInput(0);
  const [priceCode, setPriceCode] = useState(null);
  const [isNew, setIsNew, isNewBinds] = useToggleInput(true);
  const [isDeleted, setIsDeleted, isDeletedBinds] = useToggleInput(false);
  const [images, setImages] = useState([]);

  const uploadManager = new UploadManager(
    () => images,
    false
  );

  useEffect(() => {
    if (!isCreate && id) {
      edgeService.get(id).then(res => {
        setEdge(res);
        setIsLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    if (!edge) {
      return;
    }

    setDisplayName(edge.displayName);
    setDescription(edge.description);
    setDiscount(edge.discount);
    setPriceCode(edge.priceCode);
    setIsNew(edge.isNew);
    setImages(edge.images);
    setIsDeleted(edge.isDeleted);
  }, [edge]);

  const onSubmit = createSubmitHandler(
    "edge",
    edgeService,
    async () => {
      setIsLoading(true);
      return {
        displayName,
        description,
        isNew,
        priceCode,
        discount,
        images: (await uploadManager.uploadAll()).result,
        isDeleted,
      };
    },
    (obj) => obj.displayName,
    (obj) => `/admin/configuration/edge/${obj.id}`,
    !isCreate ? id : null,
    isCreate,
    (e) => {
      if (e) {
        setEdge(e);
      }
      setIsLoading(false);
    },
  );

  return (
    <AdminPage title="Edit edge" isLoading={isLoading} >
      <Form onSubmit={onSubmit}>
        <div className="form-row">
          <FormGroup className="col-md-4">
            <label htmlFor="displayName">Display Name</label>
            <input id="displayName" type="text" className="form-control" required { ...displayNameBinds }/>
          </FormGroup>
          <FormGroup className="col-md-4">
            <label htmlFor="priceCode">Price Code</label>
            <PriceCodeSelect id="priceCode" value={priceCode} onChange={setPriceCode}/>
          </FormGroup>
          <FormGroup className="col-md-4">
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
        <div className="form-row mt-3">
          <label>Images</label>
          <MultiImageUpload images={images} setImages={setImages}/>
        </div>
        <button type="submit" className="btn btn-lg btn-primary mt-3">Save</button>
        <button type="button" onClick={() => router.back()} className="btn btn-lg btn-primary mt-3 ml-3">Back to Edge</button>
      </Form>
    </AdminPage>
  );
}
