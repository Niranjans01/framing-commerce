import AdminPage from "../../../components/Admin/AdminPage";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { useEffect, useState } from "react";
import Link from "next/link";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import portfolioService from "../../../services/PortfolioService";
import { useRouter } from "next/router";

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
      return <Link href={`/admin/portfolio/${row.id}`} as={`/admin/portfolio/${row.id}`}>{row.displayName.length>1 || row.displayName!==" "?row.displayName:("No Name")}</Link>;
    },
  },
  {
    dataField: "image",
    text: "Image",
    formatter: (cell, row) => {
      if (row.image) {
        return <img src={row.image.url} width={50} height={50}/>
      }
      return "None";
    }
  },
];

const paginationOptions = {};

export default function Portfolio() {
  const [portfolios, setPortfolios] = useState([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const results = await portfolioService.find({includeDeleted: true});
      setPortfolios(results);
    })();
  }, []);

  return (
    <AdminPage title="Gallery">
      <ToolkitProvider
        keyField="id"
        data={portfolios}
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
                onClick={(e) => router.push("/admin/portfolio/new")}
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
