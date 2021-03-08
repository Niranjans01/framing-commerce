import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import AdminPage from "../../../components/Admin/AdminPage";
import { Form, FormGroup } from "react-bootstrap";
import {useInput, useToggleInput} from "../../../lib/utilities";

import { useToasts } from "react-toast-notifications";

import faqService from "../../../services/FaqService";
import {createSubmitHandler} from "../../../lib/admin-crud-utils";

export default function EditFaq(props) {
  const router = useRouter();
  const { id } = router.query;
  const isCreate = id === "new";
  const [faq, setFaq] = useState(null);

  const [displayName, setDisplayName, displayNameBinds] = useInput("");
  const [description, setDescription, descriptionBinds] = useInput("");
  const [isDeleted, setIsDeleted, isDeletedBinds] = useToggleInput(false);

  const [isLoading, setIsLoading] = useState(!isCreate);

  useEffect(() => {
    if (!isCreate && id) {
      faqService.get(id).then(res => {
        setFaq(res)
        setIsLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    if (!faq) {
      return
    }

    setDisplayName(faq.displayName);
    setDescription(faq.description);
    setIsDeleted(faq.isDeleted);

  }, [faq]);

  const onSubmit = createSubmitHandler(
    "faq",
    faqService,
    async () => {
      setIsLoading(true);
      return {
        displayName,
        description,
        isDeleted
      };
    },
    (obj) => obj.displayName,
    (obj) => `/admin/faq/${obj.id}`,
    !isCreate ? id : null,
    isCreate,
    (e) => {
      if (e) {
        setFaq(e);
      }
      setIsLoading(false);
    },
  );


  let title = isCreate ? "New faq" : "Edit faq";

  return (
    <AdminPage title={ title } isLoading={isLoading}>
      <Form onSubmit={onSubmit}>
        <div className="form-row">
          <FormGroup className="col-md-12">
            <label htmlFor="displayName">Frequently Asked Question</label>
            <input id="displayName" type="text" className="form-control" required { ...displayNameBinds }/>
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup className="col-md-12">
            <label htmlFor="description">Answer</label>
            <input id="description" type="text" className="form-control" required { ...descriptionBinds }/>
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup className="col-md-12">
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" id="isDeleted" { ...isDeletedBinds }/>
              <label className="form-check-label" htmlFor="isDeleted">Is hidden?</label>
            </div>
          </FormGroup>
        </div>
        <button type="submit" className="btn btn-lg btn-primary mt-3">{isCreate ? "Create" : "Save" }</button>
        <button type="button" onClick={() => router.back()} className="btn btn-lg btn-primary mt-3 ml-3">Back to Faq</button>
      </Form>
    </AdminPage>
  );
}
