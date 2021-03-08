import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import AdminPage from "../../../components/Admin/AdminPage";
import { Form, FormGroup } from "react-bootstrap";
import {useInput, useToggleInput} from "../../../lib/utilities";
import MultiImageUpload from "../../../components/Admin/MultiImageUpload";

import productService from '../../../services/ProductService2'
import ConfigurationSelect from "../../../components/Admin/ConfigurationSelect";
import ConfigurationValuesSelect from "../../../components/Admin/ConfigurationValuesSelect";

import backingService from "../../../services/BackingService";
import dimensionService from "../../../services/DimensionService";
import edgeService from "../../../services/EdgeService";
import edgeWidthService from "../../../services/EdgeWidthService";
import frameService from "../../../services/FrameService";
import matService from "../../../services/MatService";
import glassService from "../../../services/GlassService";
import mirrorService from "../../../services/MirrorService";
import printingService from "../../../services/PrintingService";
import stretchingService from "../../../services/StretchingService";
import {createSubmitHandler} from "../../../lib/admin-crud-utils";
import UploadManager from "../../../services/UploadManager";
import ProductVariantInput from "../../../components/Admin/ProductVariantInput";


const allConfigurations = [
  {
    value: "backing", label: "Backing", loader: backingService.find
  },
  {
    value: "dimension", label: "Dimension", loader: dimensionService.find
  },
  {
    value: "edge", label: "Edge", loader: edgeService.find
  },
  {
    value: "edge_width", label: "Edge Width", loader: edgeWidthService.find
  },
  {
    value: "frame", label: "Frame", loader: frameService.find
  },
  {
    value: "glass", label: "Glass", loader: glassService.find
  },
  {
    value: "mat", label: "Mat", loader: matService.find
  },
  {
    value: "mirror", label: "Mirror Type", loader: mirrorService.find
  },
  {
    value: "print", label: "Print Material", loader: printingService.find
  },
  {
    value: "stretching", label: "Stretching", loader: stretchingService.find
  },
  {
    value: "image", label: "Image", loader: async () => []
  },
];

const configurationPresenters = {};
allConfigurations.forEach(c => {
  configurationPresenters[c.value] = {
    label: c.label,
    loader: c.loader,
  };
});

export default function EditProduct(props) {
  const router = useRouter();
  const { id } = router.query;
  const isCreate = id === "new";
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(!isCreate);

  // form inputs
  const [displayName, setDisplayName, displayNameBinds] = useInput("");
  const [description, setDescription, descriptionBinds] = useInput("");
  const [category, setCategory, categoryBinds] = useInput("");
  const [tags, setTags, tagsBinds] = useInput("");
  const [discount, setDiscount, discountBinds] = useInput(0);
  const [isNew, setIsNew, isNewBinds] = useToggleInput(true);
  const [isDeleted, setIsDeleted, isDeletedBinds] = useToggleInput(false);
  const [isFeatured, setIsFeatured, isFeaturedBinds] = useToggleInput(false);
  const [configurations, setConfigurations] = useInput([]);
  const [images, setImages] = useState([]);
  const [isConfigurable, setIsConfigurable, isConfigurableBinds] = useToggleInput(true);
  const [variants, setVariants] = useState([]);

  const uploadManager = new UploadManager(
    () => images,
    false
  );

  const [confComponents, setConfComponents ] = useState(null)

  useEffect(() => {
    if (!isCreate && id) {
      productService.get(id, false).then(data => {
        setProduct(data.product);
        setIsLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    setConfComponents(
      configurations.map(item =>
        <FormGroup key={`${item.name}-label`} className="col-md-6">
          <label htmlFor={item.name}>{configurationPresenters[item.name].label}</label>
          <ConfigurationValuesSelect
            id={item.name}
            display={configurationPresenters[item.name].label}
            optionsLoader={configurationPresenters[item.name].loader}
            selectedOptions={item.values || []}
            optionValueMapper={o => {
              return {
                value: o.id,
                label: o.displayName,
              };
            }}
            setSelectedOptions={ newOptions => {
              const values = (newOptions || []).map(no => no.value);
              const copy = [...configurations]
              let configurationCopy = copy.find(c => c.name === item.name);
              if (configurationCopy) {
                configurationCopy.values = values;
              } else {
                configurationCopy = {
                  name: item.name,
                  values,
                }
                copy.push(configurationCopy);
              }

              setConfigurations(copy);
            }}
          />
        </FormGroup>
      )
    )
  }, [configurations])

  useEffect(() => {
    if (!product) {
      return;
    }
    if(product.images && product.defaultImg){
      let new_images = product.images.map(e=>{
        if(e.id===product.defaultImg){
          e.default = true
        }
        return e
      })
      product.images = new_images
    }
    setDisplayName(product.displayName);
    setDescription(product.description);
    setCategory(product.category);
    if (product.tags) {
      setTags(product.tags.join(","))
    }
    setDiscount(product.discount);
    setIsNew(product.isNew);
    setIsFeatured(product.isFeatured);
    if (product.configurations) {
      setConfigurations(product.configurations);
      setIsConfigurable(true);
    }

    if (product.variants) {
      setVariants(product.variants);
      setIsConfigurable(false);
    }

    setImages(product.images);
    setIsDeleted(product.isDeleted);
  }, [product]);

  const onSubmit = createSubmitHandler(
    "product",
    productService,
    async () => {
      let result = await uploadManager.uploadAll()
      setIsLoading(true);
      return {
        displayName,
        discount,
        isNew,
        category,
        tags: tags ? tags.split(",").map(t => t.trim()) : [],
        configurations: isConfigurable ? configurations : null,
        variants: !isConfigurable ? variants : null,
        images: result.result,
        defaultImg:result.defaultImg,
        description,
        isFeatured,
        isDeleted,
      };
    },
    (obj) => obj.displayName,
    (obj) => `/admin/product/${obj.id}`,
    !isCreate ? id : null,
    isCreate,
    (e, err) => {
      if (!err) {
        e.images = images
        setProduct(e);
      }
      setIsLoading(false);
    },
    (params) => {
      let valid = true;
      let error = null;

      if (params.variants !== null && params.variants.length < 1) {
        valid = false;
        error = "at least one variant must be provided for non-configurable products!"
      }

      return { valid, error}
    }
  );

  const title = isCreate ? "New product" : "Edit product";

  return (
    <AdminPage title={ title } isLoading={isLoading}>
      <Form onSubmit={onSubmit}>
        <div className="form-row">
          <FormGroup className="col-md-6">
            <label htmlFor="displayName">Display Name</label>
            <input id="displayName" type="text" className="form-control" required { ...displayNameBinds }/>
          </FormGroup>
          <FormGroup className="col-md-6">
            <label htmlFor="discount">Discount (%)</label>
            <input id="discount" type="number" className="form-control" step={0.1} required min={0} max={100} { ...discountBinds }/>
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup className="col-md-12">
            <label htmlFor="description">Description</label>
            <textarea id="description" className="form-control" required { ...descriptionBinds }/>
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup className="col-md-6">
            <label htmlFor="category">Category</label>
            <select id="category" className="custom-select mb-3" { ...categoryBinds}>
              <option value="diy-framing">DIY Framing</option>
              <option value="other-products">Other Products</option>
              <option value="mirror-shop">Mirror Shop</option>
              <option value="certificate-shop">Certificate Frame Shop</option>
              <option value="display-boxes">Display Boxes</option>
            </select>

          </FormGroup>
          <FormGroup className="col-md-6">
            <label htmlFor="tags">Tags</label>
            <input id="tags" type="text" className="form-control" placeholder="Comma separated tags" {...tagsBinds}/>
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup className="col-md-12">
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" id="isConfigurable" { ...isConfigurableBinds }/>
              <label className="form-check-label" htmlFor="isConfigurable">Configurable</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" id="isNew" { ...isNewBinds }/>
              <label className="form-check-label" htmlFor="isNew">New product</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" id="isFeatured" { ...isFeaturedBinds }/>
              <label className="form-check-label" htmlFor="isFeatured">Featured product</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" id="isDeleted" { ...isDeletedBinds }/>
              <label className="form-check-label" htmlFor="isDeleted">Hidden</label>
            </div>
          </FormGroup>
        </div>
        { isConfigurable &&
          <div>
            <div className="form-row">
              <FormGroup className="col-md-12">
                <label htmlFor="configurations">Configurations</label>
                <ConfigurationSelect
                  id="configurations"
                  options={allConfigurations}
                  configurations={configurations}
                  configurationValueMapper={c => {
                    return {
                      value: c.name,
                      label: configurationPresenters[c.name].label,
                    };
                  }}
                  setConfigurations={ (newValues) => {
                    const newConfigurations = (newValues || []).map(newValue => {
                      const existingConfiguration = configurations.find(c => c.name === newValue.value);
                      const existingConfigurationValues = existingConfiguration ? existingConfiguration.values : null;
                      return {
                        name: newValue.value,
                        values: existingConfigurationValues || [],
                      };
                    });
                    setConfigurations(newConfigurations);
                  }}
                />
              </FormGroup>
            </div>
            <div className="form-row">
              {confComponents}
            </div>
          </div>
        }
        {!isConfigurable &&
          <div>
            <div className="form-row">
              <FormGroup className="col-md-12">
                <label htmlFor="variants">Variants</label>
                <ProductVariantInput variants={variants} setVariants={setVariants}/>
              </FormGroup>
            </div>
          </div>
        }
        <div className="form-row mt-3">
          <label>Images</label>
          <MultiImageUpload images={images} setImages={setImages}/>
        </div>
        <button type="submit" className="btn btn-lg btn-primary mt-3">Save</button>
        <button type="button" onClick={() => router.back()} className="btn btn-lg btn-primary mt-3 ml-3">Back to products</button>
      </Form>
    </AdminPage>
  );
}
