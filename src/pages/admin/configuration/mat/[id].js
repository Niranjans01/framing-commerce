import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminPage from "../../../../components/Admin/AdminPage";
import { Form, FormGroup } from "react-bootstrap";
import { useInput, useToggleInput } from "../../../../lib/utilities";

import SingleImageUpload from "../../../../components/Admin/SingleImageUpload";
import matService from "../../../../services/MatService";
import { createSubmitHandler } from "../../../../lib/admin-crud-utils";
import UploadManager from "../../../../services/UploadManager";

export default function EditMat(props) {
  const router = useRouter();
  const { id } = router.query;
  const isCreate = id === "new";
  const [mat, setMat] = useState(null);
  const [isLoading, setIsLoading] = useState(!isCreate);

  const [displayName, setDisplayName, displayNameBinds] = useInput("");
  const [image, setImage] = useState([]);
  const [isDeleted, setIsDeleted, isDeletedBinds] = useToggleInput(false);

  const uploadManager = new UploadManager(() => image, false);

  useEffect(() => {
    if (!isCreate && id) {
      matService.get(id).then(res => {
        setMat(res);
        setIsLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    if (!mat) {
      return;
    }

    setDisplayName(mat.displayName);
    if (mat.image) {
      setImage([mat.image]);
    }
    setIsDeleted(mat.isDeleted);
  }, [mat]);

  const onSubmit = createSubmitHandler(
    "mat",
    matService,
    async () => {
      setIsLoading(true);
      const image = (await uploadManager.uploadAll()).result;
      return {
        displayName,
        image: image,
        isDeleted,
      };
    },
    (obj) => obj.displayName,
    (obj) => `/admin/configuration/mat/${obj.id}`,
    !isCreate ? id : null,
    isCreate,
    (e) => {
      if (e) {
        setMat(e);
      }
      setIsLoading(false);
    }
  );

  return (
    <AdminPage title="Edit mat" isLoading={isLoading}>
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
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" id="isDeleted" { ...isDeletedBinds }/>
              <label className="form-check-label" htmlFor="isDeleted">Hidden</label>
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
        <button type="button" onClick={() => router.back()} className="btn btn-lg btn-primary mt-3 ml-3">Back to Mat</button>
      </Form>
    </AdminPage>
  );
}
