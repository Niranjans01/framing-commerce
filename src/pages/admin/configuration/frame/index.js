import AdminPage from "../../../../components/Admin/AdminPage";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { useEffect, useState } from "react";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import frameService from "../../../../services/FrameService";
import { useRouter } from "next/router";
import Link from "next/link";

const { SearchBar } = Search;

// body.width, body.height, body.rebate, body.color, body.material;

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
        <Link href={`/admin/configuration/frame/${row.id}`} as={`/admin/configuration/frame/${row.id}`}>{row.displayName}</Link>
      );
    },
  },
  {
    dataField: "width",
    text: "Width",
  },
  {
    dataField: "height",
    text: "Height",
  },
  {
    dataField: "rebate",
    text: "Rebate",
  },
  {
    dataField: "color",
    text: "Color",
  },
  {
    dataField: "material",
    text: "Material",
  },
];

const paginationOptions = {};

export default function Frame(props) {
  const [frames, setFrames] = useState([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const results = await frameService.find({includeDeleted: true});
      setFrames(results);
    })();
  }, []);

  return (
    <AdminPage title="Frames">
      <ToolkitProvider
        keyField="id"
        data={frames}
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
                onClick={(e) => router.push("/admin/configuration/frame/new")}
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
