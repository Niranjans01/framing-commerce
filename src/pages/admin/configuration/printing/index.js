import AdminPage from "../../../../components/Admin/AdminPage";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
const { SearchBar } = Search;
import {useEffect, useState} from "react";

import printingService from "../../../../services/PrintingService";
import priceCodeService from "../../../../services/PriceCodeService";
import { useRouter } from "next/router";
import {formatPriceCode} from "../../../../lib/utilities";
import Link from "next/link";

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
        <Link href={`/admin/configuration/printing/${row.id}`} as={`/admin/configuration/printing/${row.id}`}>{row.displayName}</Link>
      );
    },
  },
  {
    dataField: "priceCode",
    text: "Price Code",
    formatter: (cell, row) => {
      return formatPriceCode(row.priceCode);
    }
  },
  {
    dataField: "discount",
    text: "Discount",
  },
];

const paginationOptions = {};

export default function Printing(props) {
  const [printings, setPrintings] = useState([]);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const results = await printingService.find({includeDeleted: true});
      const priceCodeIds = results.map(r => r.priceCode)
        .filter(r => r !== null);

      const priceCodes = {};
      await priceCodeService.find(priceCodeIds)
        .then(pcs => pcs.forEach(pc => priceCodes[pc.id] = pc));

      results.forEach(r => {
        r.priceCode = priceCodes[r.priceCode];
      })

      setPrintings(results);
    })();

  }, []);

  return (
    <AdminPage title="Print Materials">
      <ToolkitProvider
        keyField="id"
        data={ printings }
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
                {...props.baseProps}
                pagination={ paginationFactory(paginationOptions) }
                striped hover condensed
              />
              <div>
                <div className="btn btn-primary mt-2" onClick={(e) => router.push("/admin/configuration/printing/new")}>Create</div>
              </div>
            </div>
          )
        }

      </ToolkitProvider>
    </AdminPage>
  );
}
