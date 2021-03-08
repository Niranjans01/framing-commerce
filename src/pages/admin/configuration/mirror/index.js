import AdminPage from "../../../../components/Admin/AdminPage";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
const { SearchBar } = Search;
import {useEffect, useState} from "react";

import mirrorService from "../../../../services/MirrorService";
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
        <Link href={`/admin/configuration/mirror/${row.id}`} as={`/admin/configuration/mirror/${row.id}`}>{row.displayName}</Link>
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

export default function Mirror(props) {
  const [mirrors, setMirrors] = useState([]);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const results = await mirrorService.find({includeDeleted: true});
      const priceCodeIds = results.map(r => r.priceCode)
        .filter(r => r !== null);

      const priceCodes = {};
      await priceCodeService.find(priceCodeIds)
        .then(pcs => pcs.forEach(pc => priceCodes[pc.id] = pc));

      results.forEach(r => {
        r.priceCode = priceCodes[r.priceCode];
      })

      setMirrors(results);
    })();
  }, []);

  return (
    <AdminPage title="Mirrors">
      <ToolkitProvider
        keyField="id"
        data={ mirrors }
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
                <div className="btn btn-primary mt-2" onClick={(e) => router.push("/admin/configuration/mirror/new")}>Create</div>
              </div>
            </div>
          )
        }

      </ToolkitProvider>
    </AdminPage>
  );
}
