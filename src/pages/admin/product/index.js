import AdminPage from "../../../components/Admin/AdminPage";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import productService from "../../../services/ProductService2";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { useRouter } from "next/router";
import moment from 'moment';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import styles from './product.module.css';
import Link from "next/link";
const { SearchBar } = Search;

function dateFormatter(cell, row) {
  const date = new Date(cell);
  return (
    <p>{moment(date).format("DD-MM-YYYY")}</p>
  );
}

const paginationOptions = {};

export default function Product(props) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsToRender, setProductsToRender] = useState([])
  const [discount, setDiscount] = useState('')
  const [fetchedDiscount, setFetchedDiscount] = useState(null)
  const [loading, setLoading] = useState(false)
  const [rloading, setRLoading] = useState(false)
  const router = useRouter();
  const { addToast } = useToasts();

  const columnLayout = [
    {
      dataField: "id",
      text: "Id",
      hidden: true,
    },
    {
      dataField: "displayName",
      text: "Product Name",
      formatter: (cell, product) => {
        return (
          <Link href={`/admin/product/${product.id}`} as={`/admin/product/${product.id}`}>{product.displayName}</Link>
        );
      },
    },
    {
      dataField: "price",
      text: "Price",
    },
    {
      dataField: "discount",
      text: "Discount",
    },
    {
      dataField: "shortDescription",
      text: "Short Description",
    },
    {
      dataField: 'createdBy',
      text: "Created By",
      formatter: (cell, row) => cell.firstName,
    },
    {
      dataField: 'createdOn',
      text: "Created on",
      formatter: dateFormatter,
    },
    {
      dataField: 'lastUpdatedBy',
      text: "Last Updated By",
      formatter: (cell, row) => cell.firstName,
    },
    {
      dataField: 'lastUpdatedOn',
      text: "Last Updated On",
      formatter: dateFormatter,
    },
  ];
  const [columns, setColumns] = useState(columnLayout)

  useEffect(() => {
    productService.find({ includeDeleted: true }).then(setProducts);
  }, []);

  useEffect(() => {
    setColumns(columnLayout)
  }, [products])

  useEffect(() => {
    setProductsToRender(products.filter(prod => prod.category == categories[0]));    
  }, [categories])

  useEffect(() => {
    let categoryArr = products.map(prod => prod.category);
    let uniqueCatArray = [...new Set(categoryArr)];
    setCategories(uniqueCatArray);
  }, [products])

  const applyDiscount = () => {
    if (discount.length && parseFloat(discount)) {
      setLoading(true)
      productService.applyDiscountToAll(discount).then(e => {
        addToast(`Discount applied successfully`, { appearance: "success", autoDismiss: true });
        let new_products = products.map(e => {
          e.discount = discount
          return e
        })
        setProducts(new_products)
        setLoading(false)
      }).catch(err => {
        addToast("Couldn't apply discount, Please try again", { appearance: "error", autoDismiss: true });
        setLoading(false)
      })
    }
    else {
      addToast('Enter a valid discount value', { appearance: "error", autoDismiss: true });
    }
  }
  const removeDiscount = () => {
    setRLoading(true)
    productService.applyDiscountToAll(0).then(e => {
      addToast(`All Discounts removed successfully`, { appearance: "success", autoDismiss: true });
      let new_products = products.map(e => {
        e.discount = 0;
        return e
      })
      setProducts(new_products)
      setRLoading(false)
    }).catch(err => {
      addToast("Couldn't remove discounts, Please try again", { appearance: "error", autoDismiss: true });
      setRLoading(false)
    })
  }

  const onTabSelect = (selected) => {
    setProductsToRender(products.filter(prod => prod.category == selected));
  }

  const catNameFormatter = (name) => {
    let nameArr = name.split('-');
    let nameArrCaptilazied = nameArr.map(name => {
      let charArr = name.split('');
      charArr[0] = charArr[0].toUpperCase();
      return charArr.join('');
    });
    return nameArrCaptilazied.join(' ');
  }

  return (
    <AdminPage title="Products">
      <ToolkitProvider
        keyField="id"
        data={productsToRender}
        columns={columns}
        search
      >
        {
          props => (
            <div className={styles.columnFlex}>
              <div className={styles.discount}>
                <div className="d-flex flex-row" style={{width:"100%"}}>
                  <input placeholder="Enter Discount Value" className="form-control mr-2" style={{width:"200px"}} onChange={e => setDiscount(e.target.value)} />
                  <button className="btn btn-primary" style={{ height: "38px"}} onClick={applyDiscount} disabled={loading}>{loading ? "Please wait..." : "Apply Discount"}</button>
                  <button className="btn btn-primary ml-2" style={{ height: "38px"}} onClick={removeDiscount} disabled={rloading}>{rloading ? "Please wait..." : "Remove All Discount"}</button>
                </div>
              </div>
              <div className={styles.categories}>
                <Tabs defaultActiveKey={categories[0]} id="product-categories" onSelect={onTabSelect}>
                  {
                    categories.map(cat =>  <Tab eventKey={cat} title={catNameFormatter(cat)} key={cat}></Tab>)
                  }
                </Tabs>
              </div>
              <div className={styles.search}>
                <SearchBar {...props.searchProps} />
              </div>
              <BootstrapTable
                {...props.baseProps}
                pagination={paginationFactory(paginationOptions)}
                striped hover condensed
              />

              <div>
                <div className="btn btn-primary mt-2" onClick={(e) => router.push("/admin/product/new")}>Create</div>
              </div>
            </div>
          )
        }

      </ToolkitProvider>
    </AdminPage>
  );
}
