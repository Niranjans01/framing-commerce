import AdminPage from "../../../../components/Admin/AdminPage";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

import glassService from "../../../../services/GlassService";
import priceCodeService from "../../../../services/PriceCodeService";
import {formatPriceCode} from "../../../../lib/utilities";

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
        <Link href={`/admin/configuration/glass/${row.id}`} as={`/admin/configuration/glass/${row.id}`}>{row.displayName}</Link>
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

export default function Glass(props) {
  const [glasses, setGlasses] = useState([]);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const results = await glassService.find({includeDeleted: true});
      const priceCodeIds = results
        .map((r) => r.priceCode)
        .filter((r) => r !== null);

      const priceCodes = {};
      await priceCodeService
        .find(priceCodeIds)
        .then((pcs) => pcs.forEach((pc) => (priceCodes[pc.id] = pc)));

      results.forEach((r) => {
        r.priceCode = priceCodes[r.priceCode];
      });

      setGlasses(results);
    })();
  }, []);

  return (
    <AdminPage title="Glass">
      <ToolkitProvider
        keyField="id"
        data={glasses}
        columns={columns}
        search
      >
        {(props) => (
          <div>
            <div className="float-right">
              <SearchBar {...props.searchProps} />
            </div>
            <BootstrapTable
              {...props.baseProps}
              pagination={ paginationFactory(paginationOptions) }
              striped hover condensed
              />
            <div>
              <div
                className="btn btn-primary mt-2"
                onClick={(e) => router.push("/admin/configuration/glass/new")}
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
