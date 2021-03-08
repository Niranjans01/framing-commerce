import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminPage from "../../../components/Admin/AdminPage";
import { Form, FormGroup } from "react-bootstrap";
import { useInput, useToggleInput } from "../../../lib/utilities";

import { useToasts } from "react-toast-notifications";

import priceCodeService from "../../../services/PriceCodeService";
import { createSubmitHandler } from "../../../lib/admin-crud-utils";

const range = (start, stop, step = 1) =>
  Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)

export default function EditPriceCode(props) {
  const router = useRouter();
  const { id } = router.query;
  const isCreate = id === "new";
  const [priceCode, setPriceCode] = useState(null);

  const defaultPrices = {};
  range(30, 305, 5).forEach(value => {
    defaultPrices[value] = 0;
  })

  const [displayName, setDisplayName, displayNameBinds] = useInput("");
  const [isMultiplier, setIsMultiplier, isMultiplierBinds] = useToggleInput(false);
  const [multiplier, setMultiplier, multiplierBinds] = useInput(0);
  const [prices, setPrices] = useState(defaultPrices);
  const [bulkAmount, setBulkAmount] = useState(0);

  const [isLoading, setIsLoading] = useState(!isCreate);

  useEffect(() => {
    if (!isCreate && id) {
      priceCodeService.get(id).then(res => {
        setPriceCode(res);
        setIsLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    if (!priceCode) {
      return;
    }

    setDisplayName(priceCode.displayName);
    if (priceCode.multiplier) {
      setMultiplier(priceCode.multiplier);
      setIsMultiplier(true);
    }
    if (priceCode.prices) {
      setPrices(Object.assign(defaultPrices, priceCode.prices));
      setIsMultiplier(false);
    }

  }, [priceCode]);

  const onSubmit = createSubmitHandler(
    "price code",
    priceCodeService,
    async () => {
      setIsLoading(true);
      return {
        displayName,
        multiplier: isMultiplier ? multiplier : null,
        prices: !isMultiplier ? prices : null,
      };
    },
    (obj) => obj.displayName,
    (obj) => `/admin/price-code/${obj.id}`,
    !isCreate ? id : null,
    isCreate,
    (e) => {
      if (e) {
        setPriceCode(e);
      }
      setIsLoading(false);
    },
  );

  const applyBulkAmount = (op) => {
    let pricesDeepClone = JSON.parse(JSON.stringify(prices));
    Object.keys(pricesDeepClone).map(key => {
      op == 'add' && (pricesDeepClone[key] = Number(pricesDeepClone[key]) + Number(bulkAmount));
      op == 'reduce' && (pricesDeepClone[key] = Number(pricesDeepClone[key]) - Number(bulkAmount));
      pricesDeepClone[key] = pricesDeepClone[key].toFixed(1);
    });
    setPrices(pricesDeepClone);
  }

  const onbulkValChange = (val) => {
    let rationalNumber = new RegExp(/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/);
    if (!rationalNumber.test(val))  return ;
    setBulkAmount(val);
  }


  let title = isCreate ? "New price code" : "Edit price code";

  return (
    <AdminPage title={title} isLoading={isLoading}>
      <Form onSubmit={onSubmit}>
        <div className="form-row">
          <FormGroup className="col-md-12">
            <label htmlFor="displayName">Display Name</label>
            <input id="displayName" type="text" className="form-control" required {...displayNameBinds} />
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup className="col-md-12">
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" id="isMultiplier" {...isMultiplierBinds} />
              <label className="form-check-label" htmlFor="isMultiplier">Is multiplier?</label>
            </div>
          </FormGroup>
        </div>
        {isMultiplier && (
          <div className="form-row">
            <FormGroup className="col-md-12">
              <label htmlFor="multiplier">Multiplier</label>
              <input id="multiplier" type="number" className="form-control" required {...multiplierBinds} />
            </FormGroup>
          </div>
        )}
        {!isMultiplier && (
          <div>
            <h4>Prices</h4>
            <div className="d-flex flex-row" style={{ width: "100%", marginTop: "10px" }}>
              <input placeholder="Enter Value" className="form-control mr-2" style={{ width: "200px" }} onChange={e => onbulkValChange(e.target.value)} />
              <button 
                type="button" 
                className="btn btn-primary" 
                style={{ height: "38px" }} 
                onClick={() => applyBulkAmount('add')} 
                disabled={isLoading}>
                {isLoading ? "Please wait..." : "ADD"}
              </button>
              <button 
                type="button" 
                className="btn btn-primary ml-2" 
                style={{ height: "38px" }} 
                onClick={() => applyBulkAmount('reduce')} 
                disabled={isLoading}>
                {isLoading ? "Please wait..." : "Reduce"}
              </button>
            </div>
            <div className="form-row">
              {Object.keys(prices).map((lw) =>
                <div className="col-md-3 mt-3" key={lw}>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">{lw}</div>
                    </div>
                    <input type="number" className="form-control" id={`lw_${lw}`} step={0.1} value={prices[lw]} onChange={e => {
                      const copy = Object.assign({}, prices);
                      copy[lw] = e.target.value;
                      setPrices(copy);
                    }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <button type="submit" className="btn btn-lg btn-primary mt-3">{isCreate ? "Create" : "Save"}</button>
        <button type="button" onClick={() => router.back()} className="btn btn-lg btn-primary mt-3 ml-3">Back to price code</button>
      </Form>
    </AdminPage>
  );
}
