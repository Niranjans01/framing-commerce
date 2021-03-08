import AdminPage from "../../../components/Admin/AdminPage";
import Link from "next/link";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
const { SearchBar } = Search;
import { useEffect, useState } from "react";

import shippingService from "../../../services/ShippingService";
import { useRouter } from "next/router";

const columns = [
  {
    dataField: "id",
    text: "Id",
    hidden: true,
    searchable: false,
  },
  {
    dataField: "zip",
    text: "Post Code",
    formatter: (cell, row) => {
        console.log(row)
      return (<Link href={`/admin/shipping-fee/${row.id}`}><a>{row.zip}</a></Link>)
    },
  },
  {
    dataField: "fee",
    text: "Fees",
    formatter: (cell, row) => {
      return row.fee;
    },
    searchable: false,
  },
];

const paginationOptions = {};

export default function ShippingFee(props) {
  const [shippings, setShippings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    shippingService.find(null).then(setShippings);
  }, []);

  return (
    <AdminPage title="Shipping Fees">
      <ToolkitProvider keyField="id" data={shippings} columns={columns} search>
        {(props) => (
          <div>
            <div className="float-right">
              <SearchBar {...props.searchProps} />
            </div>
            <BootstrapTable
              {...props.baseProps}
              pagination={paginationFactory(paginationOptions)}
              striped
              hover
              condensed
            />
            <div>
              <div
                className="btn btn-primary mt-2"
                onClick={(e) => router.push("/admin/shipping-fee/new")}
              >
                Create
              </div>
            </div>
          </div>
        )}
      </ToolkitProvider>
    </AdminPage>
  );
}
