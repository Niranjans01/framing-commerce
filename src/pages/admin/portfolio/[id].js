import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminPage from "../../../components/Admin/AdminPage";
import { Form, FormGroup } from "react-bootstrap";
import { useInput, useToggleInput } from "../../../lib/utilities";

import SingleImageUpload from "../../../components/Admin/SingleImageUpload";

import portfolioService from "../../../services/PortfolioService";
import { createSubmitHandler } from "../../../lib/admin-crud-utils";
import UploadManager from "../../../services/UploadManager";

export default function EditPortfolio(props) {
  const router = useRouter();
  const { id } = router.query;
  const isCreate = id === "new";
  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(!isCreate);

  const [displayName, setDisplayName, displayNameBinds] = useInput("");
  const [description, setDescription, descriptionBinds] = useInput("");
  const [category, setCategory, categoryBinds] = useInput("");
  const [image, setImage] = useState([]);
  const [isDeleted, setIsDeleted, isDeletedBinds] = useToggleInput(false);

  const uploadManager = new UploadManager(() => image, false);

  useEffect(() => {
    if (!isCreate && id) {
      portfolioService.get(id).then(res => {
        setPortfolio(res);
        setIsLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    if (!portfolio) {
      return;
    }

    setDisplayName(portfolio.displayName);

    setDescription(portfolio.description);
    if (portfolio.image) {
      setImage([portfolio.image]);
    }
    if(portfolio.category){
      setCategory(portfolio.category)
    }
    else{
      setCategory("box-frames")
    }
    setIsDeleted(portfolio.isDeleted);
  }, [portfolio]);

  const onSubmit = createSubmitHandler(
    "Gallery",
    portfolioService,
    async () => {
      setIsLoading(true);
      const image = (await uploadManager.uploadAll()).result;
      return {
        displayName,
        description,
        category,
        image: image[0],
        isDeleted,
      };
    },
    (obj) => obj.displayName,
    (obj) => `/admin/portfolio/${obj.id}`,
    !isCreate ? id : null,
    isCreate,
    (e) => {
      if (e) {
        setPortfolio(e);
      }
      setIsLoading(false);
    }
  );

  return (
    <AdminPage title="Edit Gallery" isLoading={isLoading}>
      <Form onSubmit={onSubmit}>
        <div className="form-row">
          <FormGroup className="col-md-12">
            <label htmlFor="displayName">Display Name</label>
            <input
              id="displayName"
              type="text"
              className="form-control"
              required
              {...displayNameBinds}
            />
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup className="col-md-12">
            <label htmlFor="description">Description</label>
            <input id="description" type="text" className="form-control" required { ...descriptionBinds }/>
          </FormGroup>
        </div>

        <div className="form-row">
          <FormGroup className="col-md-12">
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" id="isDeleted" {...isDeletedBinds} />
              <label className="form-check-label" htmlFor="isDeleted">Hidden</label>
            </div>
          </FormGroup>
        </div>

        <div className="form-row">
        <FormGroup className="col-md-12">
        <div className="form-check form-check-inline">
        <label className="form-check-label" htmlFor="category">Category:</label>
        <br/>
            <select {...categoryBinds} id="category" className="form-control ml-2">
                <option value="box-frames">box frames</option>
                <option value="canvas-float-frames">canvas float frames</option>
                <option value="memorabilia">memorabilia</option>
                <option value="canvas-stretches">canvas stretches</option>
                <option value="sandwich-frames">sandwich frames</option>
                <option value="acrylic-float-frames">acrylic float frames</option>
              </select>
        </div>
        </FormGroup>
        </div>

        <div className="form-row mt-3">
          <label>Image</label>
          <SingleImageUpload image={image} setImage={setImage} />
        </div>
        <button type="submit" className="btn btn-lg btn-primary mt-3">
          Save
        </button>
        <button type="button" onClick={() => router.back()} className="btn btn-lg btn-primary mt-3 ml-3">Back to Gallery</button>
      </Form>
    </AdminPage>
  );
}
