import AdminPage from "../../../../components/Admin/AdminPage";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {useEffect, useState} from "react";

import ToolkitProvider, {Search} from "react-bootstrap-table2-toolkit";
import edgeService from "../../../../services/EdgeService";
import priceCodeService from "../../../../services/PriceCodeService";
import {useRouter} from "next/router";
import {formatPriceCode} from "../../../../lib/utilities";
import Link from "next/link";

const { SearchBar } = Search;

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
        <Link href={`/admin/configuration/edge/${row.id}`} as={`/admin/configuration/edge/${row.id}`}>{row.displayName}</Link>
      );
    },
  },
  {
    dataField: "priceCode",
    text: "Price Code",
    formatter: formatPriceCode,
  },
  {
    dataField: "discount",
    text: "Discount",
  },
];

const paginationOptions = {};

export default function Edge(props) {
  const [dimensions, setDimensions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const results = await edgeService.find({ includeDeleted: true });
      const priceCodeIds = results.map(r => r.priceCode)
        .filter(r => r !== null);

      const priceCodes = {};
      await priceCodeService.find(priceCodeIds)
        .then(pcs => pcs.forEach(pc => priceCodes[pc.id] = pc));

      results.forEach(r => {
        const priceCode = priceCodes[r.priceCode];
        if (priceCode) {
          r.priceCode = priceCode;
        }
      })

      setDimensions(results);
    })();

  }, []);

  return (
    <AdminPage title="Edges">
      <ToolkitProvider
        keyField="id"
        data={ dimensions }
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
                <div className="btn btn-primary mt-2" onClick={(e) => router.push("/admin/configuration/edge/new")}>Create</div>
              </div>
            </div>
          )
        }

      </ToolkitProvider>
    </AdminPage>
  );
}
