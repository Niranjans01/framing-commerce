import AdminPage from "../../../components/Admin/AdminPage";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import Link from "next/link";
const { SearchBar } = Search;

import faqService from "../../../services/FaqService";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function dateFormatter(cell, row) {
  const date = new Date(cell);
  return (
    <p>{ date.toDateString() }</p>
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
        <Link href={`/admin/faq/${row.id}`} as={`/admin/faq/${row.id}`}>{row.displayName}</Link>
      );
    },
    searchable: false,
  },

  {
    dataField: "isDeleted",
    text: "is Shown?",
    formatter: (cell, row) => (!row.isDeleted ? 'Yes' : 'No'),
    searchable: false,
  },
];

const paginationOptions = {};

export default function Faqs(props) {
  const [faqs, setFaqs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const results = await faqService.find({});
      setFaqs(results)
    })()
  }, []);

  return (
    <AdminPage title="Faqs">
      <ToolkitProvider
        keyField="id"
        data={ faqs }
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
              <div className="btn btn-primary mt-2" onClick={(e) => router.push("/admin/faq/new")}>Create</div>
            </div>
          </div>
        )
      }

      </ToolkitProvider>
    </AdminPage>
  );
}
