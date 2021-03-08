import AdminPage from "../../../components/Admin/AdminPage";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
const { SearchBar } = Search;
import Link from "next/link";

import couponService from "../../../services/CouponService";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import moment from 'moment';

function dateFormatter(cell, row) {
  const date = moment(new Date(cell)).format("DD-MM-YYYY");
  return (
    <p>{ date }</p>
  );
}

const columns = [
  {
    dataField: "id",
    text: "Id",
    hidden: true,
  },
  {
    dataField: "displayName",
    text: "Display Name",
    formatter: (cell, row) => {
      return (
        <Link href={`/admin/coupon-code/${row.id}`} as={`/admin/coupon-code/${row.id}`}>{row.displayName}</Link>
      );
    },
    searchable: true,
  },
  {
    dataField: "expiryDate",
    text: "Expiry Date",
    formatter: dateFormatter,
    searchable: false,
  },
  {
    dataField: "isDeleted",
    text: "is Active?",
    formatter: (cell, row) => (!row.isDeleted ? 'Yes' : 'No'),
    searchable: false,
  },
];

const paginationOptions = {};

export default function CouponCode(props) {
  const [couponCodes, setCouponCodes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const results = await couponService.find({});
      setCouponCodes(results)
    })()
  }, []);

  return (
    <AdminPage title="Coupon codes">
      <ToolkitProvider
        keyField="id"
        data={ couponCodes }
        columns={ columns }
        search
      >
      {
        props => (
          <div>
            <div className="float-right">
              <SearchBar { ...props.searchProps } />
            </div>
            <BootstrapTable
              { ...props.baseProps }
              pagination={ paginationFactory(paginationOptions) }
              striped hover condensed
            />
            <div>
              <div className="btn btn-primary mt-2" onClick={(e) => router.push("/admin/coupon-code/new")}>Create</div>
            </div>
          </div>
        )
      }

      </ToolkitProvider>
    </AdminPage>
  );
}
