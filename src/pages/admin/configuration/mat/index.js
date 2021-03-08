import AdminPage from "../../../../components/Admin/AdminPage";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { useEffect, useState } from "react";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import matService from "../../../../services/MatService";
import { useRouter } from "next/router";
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
      return <Link href={`/admin/configuration/mat/${row.id}`} as={`/admin/configuration/mat/${row.id}`}>{row.displayName}</Link>;
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

export default function Mat() {
  const [mats, setMats] = useState([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const results = await matService.find({includeDeleted: true});
      setMats(results);
    })();
  }, []);

  return (
    <AdminPage title="Mats">
      <ToolkitProvider
        keyField="id"
        data={mats}
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
                onClick={(e) => router.push("/admin/configuration/mat/new")}
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
