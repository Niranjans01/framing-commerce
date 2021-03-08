import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminPage from "../../../../components/Admin/AdminPage";
import { Form, FormGroup } from "react-bootstrap";
import { useInput, useToggleInput } from "../../../../lib/utilities";

import MultiImageUpload from "../../../../components/Admin/MultiImageUpload";

import frameService from "../../../../services/FrameService";
import { createSubmitHandler } from "../../../../lib/admin-crud-utils";
import UploadManager from "../../../../services/UploadManager";
import PriceCodeSelect from "../../../../components/Admin/PriceCodeSelect";

export default function EditFrame() {
  const router = useRouter();
  const { id } = router.query;
  const isCreate = id === "new";
  const [frame, setFrame] = useState(null);

  const [isLoading, setIsLoading] = useState(!isCreate);

  const [displayName, setDisplayName, displayNameBinds] = useInput("");
  const [priceCode, setPriceCode] = useState(null);
  const [width, setWidth, widthBinds] = useInput(0);
  const [height, setHeight, heightBinds] = useInput(0);
  const [rebate, setRebate, rebateBinds] = useInput(0);
  const [color, setColor, colorBinds] = useInput("");
  const [info, setInfo, infoBinds] = useInput("");
  const [material, setMaterial, materialBinds] = useInput("");
  const [verticalBorderImages, setVerticalBorderImages] = useState([]);
  const [horizontalBorderImages, setHorizontalBorderImages] = useState([]);
  const [isDefault, setIsDefault, isDefaultBinds] = useToggleInput(false);
  const [isOrnate, setIsOrnate, isOrnateBinds] = useToggleInput(false);
  const [isDeleted, setIsDeleted, isDeletedBinds] = useToggleInput(false);

  const verticalBorderImageUploadManager = new UploadManager(
    () => verticalBorderImages,

    false
  );
  const horizontalBorderImagesUploadManager = new UploadManager(
    () => horizontalBorderImages,

    false
  );

  useEffect(() => {
    if (!isCreate && id) {
      frameService.get(id).then((res) => {
        setFrame(res);
        setIsLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    if (!frame) {
      return;
    }
    const {
      displayName,
      priceCode,
      width,
      height,
      rebate,
      color,
      material,
      verticalBorderImage,
      horizontalBorderImage,
      isDeleted,
      info
    } = frame;
    setDisplayName(displayName);
    setPriceCode(priceCode);
    setWidth(width);
    setHeight(height);
    setRebate(rebate);
    setColor(color);
    setMaterial(material);
    setInfo(info)
    if(frame.isDefault){
      setIsDefault(true);
    }
    else{
      setIsDefault(false);
    }
    if(frame.isOrnate){
      setIsOrnate(true);
    }
    else{
      setIsOrnate(false);
    }
    if (verticalBorderImage) {
      setVerticalBorderImages([verticalBorderImage]);
    }
    if (horizontalBorderImage) {
      setHorizontalBorderImages([horizontalBorderImage]);
    }
    setIsDeleted(isDeleted);
  }, [frame]);

  const onSubmit = createSubmitHandler(
    "frame",
    frameService,
    async () => {
      setIsLoading(true);
      const verticalBorderImages = (await verticalBorderImageUploadManager.uploadAll()).result;
      const horizontalBorderImages = (await horizontalBorderImagesUploadManager.uploadAll()).result;
      return {
        displayName,
        priceCode: priceCode,
        width: parseFloat(width),
        height: parseFloat(height),
        rebate,
        color,
        material,
        isDefault,
        isOrnate,
        info,
        verticalBorderImage:
          verticalBorderImages.length > 0 ? verticalBorderImages[0] : undefined,
        horizontalBorderImage:
          horizontalBorderImages.length > 0
            ? horizontalBorderImages[0]
            : undefined,
        isDeleted,
      };
    },
    (obj) => obj.displayName,
    (obj) => `/admin/configuration/frame/${obj.id}`,
    !isCreate ? id : null,
    isCreate,
    (e) => {
      if (e) {
        setFrame(e);
      }
      setIsLoading(false);
    }
  );

  return (
    <AdminPage title="Edit Frame" isLoading={isLoading}>
      <Form onSubmit={onSubmit}>
        <div className="form-row">
          <FormGroup className="col-md-3">
            <label htmlFor="displayName">Display Name</label>
            <input
              id="displayName"
              type="text"
              className="form-control"
              required
              {...displayNameBinds}
            />
          </FormGroup>
          <FormGroup className="col-md-3">
            <label htmlFor="priceCode">Price Code</label>
            <PriceCodeSelect
              id="priceCode"
              value={priceCode}
              onChange={setPriceCode}
            />
          </FormGroup>
          <FormGroup className="col-md-3">
            <label htmlFor="color">Color</label>
            <input
              id="color"
              type="text"
              className="form-control"
              required
              {...colorBinds}
            />
          </FormGroup>
          <FormGroup className="col-md-3">
            <label htmlFor="color">Info</label>
            <input
              id="info"
              type="text"
              className="form-control"
              required
              {...infoBinds}
            />
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup className="col-md-3">
            <label htmlFor="displayName">Width</label>
            <input
              id="width"
              type="number"
              className="form-control"
              min={0}
              step={0.1}
              required
              {...widthBinds}
            />
          </FormGroup>
          <FormGroup className="col-md-3">
            <label htmlFor="height">Height</label>
            <input
              id="height"
              type="number"
              className="form-control"
              min={0}
              step={0.1}
              required
              {...heightBinds}
            />
          </FormGroup>
          <FormGroup className="col-md-3">
            <label htmlFor="rebate">Rebate</label>
            <input
              id="rebate"
              type="number"
              min={0}
              step={0.1}
              className="form-control"
              required
              {...rebateBinds}
            />
          </FormGroup>
          <FormGroup className="col-md-3">
            <label htmlFor="material">Material</label>
            <input
              id="material"
              type="text"
              className="form-control"
              required
              {...materialBinds}
            />
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup className="col-md-12">
          <div className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" id="isDefault" { ...isDefaultBinds }/>
              <label className="form-check-label" htmlFor="isDefault">Default</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                id="isDeleted"
                {...isDeletedBinds}
              />
              <label className="form-check-label" htmlFor="isDeleted">
                Hidden
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" id="isOrnate" { ...isOrnateBinds }/>
              <label className="form-check-label" htmlFor="isOrnate">Ornated</label>
            </div>
          </FormGroup>
        </div>
        <div className="form-row mt-3">
          <label>Horizontal Border Image</label>
          <MultiImageUpload
            images={horizontalBorderImages}
            setImages={setHorizontalBorderImages}
          />
        </div>
        <div className="form-row mt-3">
          <label>Vertical Border Image</label>
          <MultiImageUpload
            images={verticalBorderImages}
            setImages={setVerticalBorderImages}
          />
        </div>
        <button type="submit" className="btn btn-lg btn-primary mt-3">
          Save
        </button>
        <button type="button" onClick={() => router.back()} className="btn btn-lg btn-primary mt-3 ml-3">Back to Frame</button>
      </Form>
    </AdminPage>
  );
}
