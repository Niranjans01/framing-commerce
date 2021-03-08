import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import AdminPage from "../../../../components/Admin/AdminPage";
import { Form, FormGroup } from "react-bootstrap";
import { useInput, useToggleInput } from "../../../../lib/utilities";

import dimensionService from "../../../../services/DimensionService";
import { createSubmitHandler } from "../../../../lib/admin-crud-utils";

export default function EditDimension(props) {
  const router = useRouter();
  const { id } = router.query;
  const isCreate = id === "new";
  const [dimension, setDimension] = useState(null);
  const [isLoading, setIsLoading] = useState(!isCreate);

  const [displayName, setDisplayName, displayNameBinds] = useInput("");
  const [width, setWidth, widthBinds] = useInput(0);
  const [height, setHeight, heightBinds] = useInput(0);
  const [isCustom, setIsCustom, customBinds] = useToggleInput(false);
  const [isDefault, setIsDefault, isDefaultBinds] = useToggleInput(false);
  const [isDeleted, setIsDeleted, isDeletedBinds] = useToggleInput(false);

  // custom dimensions
  const [minWidth, setMinWidth, minWidthBinds] = useInput(0);
  const [minHeight, setMinHeight, minHeightBinds] = useInput(0);
  const [maxWidth, setMaxWidth, maxWidthBinds] = useInput(0);
  const [maxHeight, setMaxHeight, maxHeightBinds] = useInput(0);

  useEffect(() => {
    if (!isCreate && id) {
      dimensionService.get(id).then(dimension => {
        setIsLoading(false);
        setDimension(dimension);
      });
    }
  }, [id]);

  useEffect(() => {
    if (!dimension) {
      return;
    }

    setDisplayName(dimension.displayName);
    setWidth(dimension.width);
    setHeight(dimension.height);
    setIsCustom(dimension.isCustom);
    setIsDeleted(dimension.isDeleted);

    if (dimension.isCustom) {
      setMinWidth(dimension.minimumWidth);
      setMinHeight(dimension.minimumHeight);
      setMaxWidth(dimension.maximumWidth);
      setMaxHeight(dimension.maximumHeight);
    }
    if(dimension.isDefault){
      setIsDefault(true);
    }
    else{
      setIsDefault(false);
    }
  }, [dimension]);

  const onSubmit = createSubmitHandler(
    "dimension",
    dimensionService,
    async () => {
      setIsLoading(true);
      return {
        displayName,
        height,
        width,
        minimumHeight: minHeight,
        minimumWidth: minWidth,
        maximumHeight: maxHeight,
        maximumWidth: maxWidth,
        isCustom,
        isDeleted,
        isDefault
      };
    },
    (obj) => obj.displayName,
    (obj) => `/admin/configuration/dimension/${obj.id}`,
    !isCreate ? id : null,
    isCreate,
    (e) => {
      setDimension(e);
      setIsLoading(false);
    },
  );

  return (
    <AdminPage title="Edit dimension" isLoading={isLoading}>
    <Form onSubmit={onSubmit}>
      <div className="form-row">
        <FormGroup className="col-md-12">
          <label htmlFor="displayName">Display Name</label>
          <input id="displayName" type="text" className="form-control" required { ...displayNameBinds }/>
        </FormGroup>
      </div>
      <div className="form-row">
        <FormGroup className="col-md-6">
          <label htmlFor="width">Width</label>
          <input id="width" type="text" className="form-control" required { ...widthBinds }/>
        </FormGroup>
        <FormGroup className="col-md-6">
          <label htmlFor="height">Height</label>
          <input id="height" type="text" className="form-control" required { ...heightBinds }/>
        </FormGroup>
      </div>
      <div className="form-row">
        <FormGroup className="col-md-12">
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" id="isDefault" { ...isDefaultBinds }/>
              <label className="form-check-label" htmlFor="isDefault">Default</label>
            </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" id="isCustom" { ...customBinds }/>
            <label className="form-check-label" htmlFor="isCustom">Is Custom</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" id="isDeleted" { ...isDeletedBinds }/>
            <label className="form-check-label" htmlFor="isDeleted">Hidden</label>
          </div>
        </FormGroup>
      </div>
      {isCustom && (
        <Fragment>
          <div className="form-row">
            <FormGroup className="col-md-6">
              <label htmlFor="minWidth">Minimum Width</label>
              <input id="minWidth" type="number" className="form-control" defaultValue={0} required { ...minWidthBinds }/>
            </FormGroup>
            <FormGroup className="col-md-6">
              <label htmlFor="minHeight">Minimum Height</label>
              <input id="minHeight" type="number" className="form-control" defaultValue={0} required { ...minHeightBinds }/>
            </FormGroup>
          </div>
          <div className="form-row">
            <FormGroup className="col-md-6">
              <label htmlFor="maxWidth">Maximum Width</label>
              <input id="maxWidth" type="number" className="form-control" defaultValue={0} required { ...maxWidthBinds }/>
            </FormGroup>
            <FormGroup className="col-md-6">
              <label htmlFor="maxHeight">Maximum Height</label>
              <input id="maxHeight" type="number" className="form-control" defaultValue={0} required { ...maxHeightBinds }/>
            </FormGroup>
          </div>
        </Fragment>
      )}
      <button type="submit" className="btn btn-lg btn-primary mt-3">{isCreate ? "Create" : "Save" }</button>
      <button type="button" onClick={() => router.back()} className="btn btn-lg btn-primary mt-3 ml-3">Back to Dimensions</button>
    </Form>
  </AdminPage>
  );
}
