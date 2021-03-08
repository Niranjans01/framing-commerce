import AdminPage from "../../../../components/Admin/AdminPage";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
const { SearchBar } = Search;
import {useEffect, useState} from "react";
import Link from "next/link";

import backingService from "../../../../services/BackingService";
import priceCodeService from "../../../../services/PriceCodeService";
import {useRouter} from "next/router";
import {formatPriceCode} from "../../../../lib/utilities";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

const ArrowRender = (order,column)=>{
  if (!order) return (<><IoIosArrowUp/><IoIosArrowDown/></>);
  else if (order === 'asc') return (<IoIosArrowUp/>);
  else if (order === 'desc') return (<IoIosArrowDown/>);
  return null;
}

const columns = [
  {
    dataField: "id",
    text: "Id ",
    hidden: true,
    sort: true
  },
  {
    dataField: "displayName",
    text: "Display Name ",
    formatter: (cell, row) => {
      return (
        <Link href={`/admin/configuration/backing/${row.id}`} as={`/admin/configuration/backing/${row.id}`}>{row.displayName}</Link>
      );
    },
    sort: true,
    sortCaret:(order, column)=>{
      return ArrowRender(order,column)
    }
  },
  {
    dataField: "priceCode",
    text: "Price Code ",
    formatter: (cell, row) => {
      return formatPriceCode(row.priceCode);
    },
    sort: true,
    sortCaret:(order, column)=>{
      return ArrowRender(order,column)
    }
  },
  {
    dataField: "discount",
    text: "Discount ",
    sort: true,
    sortCaret:(order, column)=>{
      return ArrowRender(order,column)
    }
  },
];

const paginationOptions = {};

export default function Backing(props) {
  const [backings, setBackings] = useState([]);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const results = await backingService.find({ includedDeleted: true });
      const priceCodeIds = results.map(r => r.priceCode)
        .filter(r => r !== null);

      const priceCodes = {};
      await priceCodeService.find(priceCodeIds)
        .then(pcs => pcs.forEach(pc => priceCodes[pc.id] = pc));

      results.forEach(r => {
        if (r.priceCode) {
          r.priceCode = priceCodes[r.priceCode];
        }
      })

      setBackings(results);
    })();

  }, []);

  return (
    <AdminPage title="Backings">
      <ToolkitProvider
        keyField="id"
        data={ backings }
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
                <div className="btn btn-primary mt-2" onClick={(e) => router.push("/admin/configuration/backing/new")}>Create</div>
              </div>
            </div>
          )
        }

      </ToolkitProvider>
    </AdminPage>
  );
}
