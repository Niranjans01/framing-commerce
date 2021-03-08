import AdminPage from "../../../../components/Admin/AdminPage";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
const { SearchBar } = Search;
import {useEffect, useState} from "react";

import dimensionService from "../../../../services/DimensionService";
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
        <Link href={`/admin/configuration/dimension/${row.id}`} as={`/admin/configuration/dimension/${row.id}`}>{row.displayName}</Link>
      );
    },
  },
  {
    dataField: "width",
    text: "Width",
    formatter: (cell, row) => {
      if (row.name === "custom") {
        return `${row.width} (${row.minWidth} - ${row.maxWidth})`
      } else {
        return row.width;
      }
    },
  },
  {
    dataField: "height",
    text: "Height",
    formatter: (cell, row) => {
      if (row.name === "custom") {
        return `${row.height} (${row.minHeight} - ${row.maxHeight})`
      } else {
        return row.height;
      }
    },
  },
  {
    dataField: "minimumWidth",
    text: "Minimum Width",
  },
  {
    dataField: "minimumHeight",
    text: "Minimum Height",
  },
  {
    dataField: "maximumWidth",
    text: "Maximum Width",
  },
  {
    dataField: "maximumHeight",
    text: "Maximum Height",
  },
  {
    dataField: "isCustom",
    text: "Is Custom",
    formatter: (cell, row) => {
      return row.isCustom;
    },
  },
];

const paginationOptions = {};

export default function Dimension(props) {
  const [dimensions, setDimensions] = useState([]);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const results = await dimensionService.find({ includeDeleted: true });
      setDimensions(results);
    })();
  }, []);

  return (
    <AdminPage title="Dimensions">
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
                <div className="btn btn-primary mt-2" onClick={(e) => router.push("/admin/configuration/dimension/new")}>Create</div>
              </div>
            </div>
          )
        }

      </ToolkitProvider>
    </AdminPage>
  );
}
