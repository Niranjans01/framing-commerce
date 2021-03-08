import AdminPage from "../../../components/Admin/AdminPage";
import Link from "next/link";
import ToolkitProvider,{Search} from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable  from "react-bootstrap-table-next";
import {useEffect, useState} from "react";

import orderService from "../../../services/OrderService";
import moment from 'moment';
const { SearchBar } = Search;

function dateFormatter(cell, row) {
  if (!cell) {
    return "None";
  }
  return moment(new Date(cell)).format("DD-MM-YYYY");
}

function RemoteTable({data, columns, page, sizePerPage, totalSize, onTableChange, onSearchChange}) {
  return (
    <ToolkitProvider
      keyField="id"
      data={ data }
      columns={ columns }
      search
    >
      {
        props => (
          <div>
            <div className="float-right">
              {/* <SearchBar { ...props.searchProps } /> */}
            </div>
            <BootstrapTable
              remote
              { ...props.baseProps }
              pagination={ paginationFactory({page, sizePerPage, totalSize}) }
              onTableChange={onTableChange}
              onSearchChange={onSearchChange}
              striped hover condensed
            />
          </div>
        )
      }

    </ToolkitProvider>
  );
}

const columns = [
  {
    dataField: "id",
    text: "Order Id",
    formatter: (cell, order) => {
      return (
        <Link href={`/admin/order/${order.id}`} as={`/admin/order/${order.id}`}>{order.id}</Link>
      );
    },
  },
  {
    dataField: "owner",
    text: "Ordered By",
    formatter: (cell, row) => {
      return cell ? cell.firstName : "None";
    }
  },
  {
    dataField: "orderDate",
    text: "Ordered On",
    formatter: dateFormatter,
  },
  {
    dataField: "isShipped",
    text: "Shipped",
    formatter: (cell, order) => (order.isShipped ? 'Yes' : 'No')
  },
  {
    dataField: "isPaid",
    text: "Paid",
    formatter: (cell, order) => (order.isPaid ? 'Yes' : 'No')
  },
  {
    dataField: "paymentProvider",
    text: "Payment Provider",
  },
  {
    dataField: "transactionId",
    text: "Transaction Id",
    formatter: (cell, row) => {
      return `${row.transactionId ? row.transactionId : "None"}`;
    },
  },
  {
    dataField: "lastUpdatedBy",
    text: "Last Updated By",
    formatter: (cell, row) => {
      return cell ? cell.firstName :"None";
    }
  },
  {
    dataField: "lastUpdatedOn",
    text: "Last Updated On",
    formatter: dateFormatter,
  },
  {
    dataField: "billingAddress",
    text: "Phone No",
    formatter: (cell, order) => order.billingAddress && order.billingAddress.phone
  }
];

export default function(props) {
  const [orders, setOrders] = useState([]);
  const [totalSize, setTotalSize] =  useState(100);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);

  const computeStartOffset = (page, sizePerPage) => {
    return (page - 1) * sizePerPage;
  };

  const fetchData = async (page, sizePerPage) => {
    const start = computeStartOffset(page, sizePerPage);
    const limit = sizePerPage;
    return await orderService.find({start, limit});
  }

  useEffect(() => {
    orderService.count({}).then(setTotalSize);
  }, []);

  useEffect(() => {
    fetchData(page, sizePerPage).then(setOrders);
  }, [totalSize]);

  const onTableChange = (type, {page, sizePerPage, filters}) => {
    fetchData(page, sizePerPage).then(orders => {
      setPage(page);
      setSizePerPage(sizePerPage);
      setOrders(orders);
    });
  };
  const onSearchChange = (searchText, colInfos, multiColumnSearch)=>{
    console.log("Search enabled")
  }
  return (
    <AdminPage title="Orders">
      <RemoteTable
        data={orders}
        columns={columns}
        page={page}
        sizePerPage={sizePerPage}
        totalSize={totalSize}
        onTableChange={onTableChange}
        onSearchChange={onSearchChange}
      />
    </AdminPage>
  );
}
