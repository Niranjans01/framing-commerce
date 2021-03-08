import { useToasts } from "react-toast-notifications";
import {useRouter} from "next/router";

export function createSubmitHandler(domainName, service, paramsProvider, nameProvider, redirectUrlProvider, id, isCreate, setter, validator) {
  const { addToast } = useToasts();
  const router = useRouter();

  function validate(params) {
    if (!validator) {
      return true;
    }

    const { valid, error } = validator(params);

    if (!valid) {
      throw error || "no error message provided.";
    }

    return valid;
  }

  return (e) => {
    e.preventDefault();
    if (e.key === "Enter") {
      return;
    }
    paramsProvider().then(params => {
      try {
        validate(params);
      } catch (err) {
        addToast(`Validation error: ${err}`, {appearance: "error", autoDismiss: true});
        setter(null, err);
        return;
      }
      if (!isCreate) {
        service.update(id, params).then(domainObject => {
          setter(domainObject);
          addToast(`Updated '${nameProvider(domainObject)}' to the ${domainName}.`, {appearance: "success", autoDismiss: true})
        }).catch(err => {
          console.log(err);
          addToast(`Failed to update ${domainName}.`, {appearance: 'error', autoDismiss: true});
          setter(null, err);
        });
      } else {
        service.create(params).then(domainObject => {
          router.push(redirectUrlProvider(domainObject));
          addToast(`Added '${nameProvider(domainObject)}' to the ${domainName} .`, {appearance: "success", autoDismiss: true})
        }).catch(err => {
          console.log(err);
          addToast(`Failed to create new ${domainName}.`, {appearance: 'error', autoDismiss: true});
          setter(null, err);
        });
      }
    });
  };
}
