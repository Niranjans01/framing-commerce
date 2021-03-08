import AdminPage from "../../../components/Admin/AdminPage";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
const { SearchBar } = Search;
import {useEffect, useState} from "react";

import priceCodeService from "../../../services/PriceCodeService";
import {useRouter} from "next/router";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Link from "next/link";

const ArrowRender = (order,column)=>{
  if (!order) return (<><IoIosArrowUp/><IoIosArrowDown/></>);
  else if (order === 'asc') return (<IoIosArrowUp/>);
  else if (order === 'desc') return (<IoIosArrowDown/>);
  return null;
}


const frameCodeColumns = [
  {
    dataField: "id",
    text: "Id",
    hidden: true,
    searchable: false,
  },
  {
    dataField: "displayName",
    text: "Display Name ",
    formatter: (cell, row) => {
      return (
        <Link href={`/admin/price-code/${row.id}`} as={`/admin/price-code/${row.id}`}>{row.displayName}</Link>
      );
    },
    sort:true,
    sortCaret:(order, column)=>{
      return ArrowRender(order,column)
    },
    sortFunc: (a, b, order, dataField) => {
      if (order === 'asc') {
        return b - a;
      }
      return a - b; // desc
    }
  },
  {
    dataField: "multiplier",
    text: "Is Multiplier? ",
    formatter: (cell, row) => {
      if(!!row.multiplier){
        return "Yes"
      }
      else{
        return "No"
      }
    },
    searchable: false,
    sort:true,
    sortCaret:(order, column)=>{
      return ArrowRender(order,column)
    }
  },
];

const nonFrameCodeColumns = [
  {
    dataField: "id",
    text: "Id",
    hidden: true,
    searchable: false,
  },
  {
    dataField: "displayName",
    text: "Display Name ",
    formatter: (cell, row) => {
      return (
        <Link href={`/admin/price-code/${row.id}`} as={`/admin/price-code/${row.id}`}>{row.displayName}</Link>
      );
    },
    sort:true,
    sortCaret:(order, column)=>{
      return ArrowRender(order,column)
    }
  },
  {
    dataField: "multiplier",
    text: "Is Multiplier? ",
    formatter: (cell, row) => {
      if(!!row.multiplier){
        return "Yes"
      }
      else{
        return "No"
      }
    },
    searchable: false,
    sort:true,
    sortCaret:(order, column)=>{
      return ArrowRender(order,column)
    }
  },
];

const paginationOptions = {};

export default function Product(props) {
  const [priceCodes, setPriceCodes] = useState([]);
  const [frameCodes, setFrameCodes] = useState([]);
  const [nonFrameCodes, setNonFrameCodes] = useState([]);
  const [activeTab, setActiveTab] = useState('frameCode');
  const router = useRouter();

  useEffect(() => {
    priceCodeService.find(null).then(setPriceCodes);
  }, []);

  useEffect(() => {
    let positiveWholeNumber = new RegExp(/^\d+$/);
    let frameCodes = priceCodes
                      .filter(codes => positiveWholeNumber.test(codes.displayName))
                      .sort((a, b) => a.displayName - b.displayName);
    let nonFrameCodes = priceCodes.filter(codes => !positiveWholeNumber.test(codes.displayName))
    setFrameCodes(frameCodes);
    setNonFrameCodes(nonFrameCodes);  
  }, [priceCodes])

  const onTabSelect = (selected) => {
    setActiveTab(selected);
  }

  return (
    <AdminPage title="Price codes">
      <ToolkitProvider
        keyField="id"
        data={ activeTab == 'frameCode' ? frameCodes : nonFrameCodes }
        columns={ activeTab == 'frameCode' ? frameCodeColumns : nonFrameCodeColumns }
        search
      >
      {
        props => (
          <div>
            <div className="mb-2">
                <Tabs defaultActiveKey="frameCode" id="frame-code-categories" onSelect={onTabSelect}>
                  <Tab eventKey="frameCode" title="Frame Codes" key='frameCode'></Tab>
                  <Tab eventKey="nonFrameCode" title="Non Frame Codes" key='nonFrameCode'></Tab>
                </Tabs>
              </div>
            <div className="float-right">
              <SearchBar { ...props.searchProps } />
            </div>
            <BootstrapTable
              { ...props.baseProps }
              pagination={ paginationFactory(paginationOptions) }
              striped hover condensed
            />
            <div>
              <div className="btn btn-primary mt-2" onClick={(e) => router.push("/admin/price-code/new")}>Create</div>
            </div>
          </div>
        )
      }

      </ToolkitProvider>
    </AdminPage>
  );
}
