import { EyeOutlined } from "@ant-design/icons";
import { Avatar, Button, Table, Tag } from "antd";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Ticket_ICON from "../../assets/images/ticket.png";
import moment from "moment";
import { ColumnType } from "antd/lib/table";
import { useLazyQuery } from "@apollo/client";
import { TICKETS } from "GraphQL/Queries";
import { ITicket, ITicketsWithCount } from "types";
import { CircularProgress } from "@mui/material";
 
function DashBoardTicketDataTable() {
  const history = useHistory();

  const [tableDate, setTableDate] = useState<ITicketsWithCount>();
  const [filterData, setFilterData] = useState({
    page: 1,
    pageSize: 10,
    order: "DESC",
    sortBy: "CREATED_AT",
    productCategoryId: null,
    productRequestId: null,
    companyId: null,
    status: 'COMPLETED',
    fromDate: null,
    toDate: null,
  });

  const [fetchTicketsWithCount, { loading, data }] = useLazyQuery(TICKETS);

  // data load..
  useEffect(() => {
    console.log('hello')
    fetchTicketsWithCount({
      variables: {
        page: filterData.page === 0 ? filterData.page : filterData.page - 1,
        pageSize: filterData.pageSize,
        order: filterData.order,
        sortBy: filterData.sortBy,
        productCategoryId: filterData.productCategoryId,
        productRequestId: filterData.productRequestId,
        companyId: filterData.companyId,
        status: filterData.status,
        fromDate: filterData.fromDate,
        toDate: filterData.toDate,
      },
      fetchPolicy: "no-cache",
    }) 
  }, [fetchTicketsWithCount, filterData])

  // set states
  useEffect(() => {
    if(data){
      setTableDate(data.tickets);
    }
  }, [data]);

  const columns: ColumnType<ITicket>[] = [
    {
      title: "",
      align: "center", // Correct type for align
      dataIndex: "logoUrl",
      render: (logoUrl) => (
        <div className="table_av">
          <Avatar src={Ticket_ICON} />
        </div>
      ),
      width: 50,
    },
    {
      title: "Ticket",
      sorter: (a, b) =>
        a.productCategory.name.localeCompare(b.productCategory.name),
      render: (record) => record.productCategory.name,
      width: 150,
    },
    {
      title: "Ticket ID",
      dataIndex: "referenceId",
      sorter: (a, b) => a.referenceId.length - b.referenceId.length,
      sortDirections: ["descend", "ascend"],
      width: 200,
    },
    {
      title: "User",
      sorter: (a, b) => a.userDetails.name.localeCompare(b.userDetails.name),
      render: (record) =>
        record.productRequest ? record.productRequest.user.firstName : "NA",
      width: 150,
    },
    {
      title: "Created Date",
      sorter: (a, b) => a.createdAt.length - b.createdAt.length,
      render: (record) =>
        record.createdAt
          ? moment(record.createdAt).format("YYYY-MM-DD h:mm:ss a")
          : "NA",
      width: 180,
    },
    {
      title: "Closed Tickets",
      render: (record) =>
        record.productRequest
          ? moment(record.productRequest.maxUserResponseTimeExpiresAt).format(
              "YYYY-MM-DD h:mm:ss a"
            )
          : "NA",
      width: 180,
    },
    {
      title: "Request Count",
      render: (record) =>
        record.productRequest
          ? record.productRequest.tickets.nodes.length
          : "NA",
      width: 150,
    },
    // {
    //   title: "Winner",
    //   dataIndex: "winner",
    //   sorter: (a, b) => a.winner.length - b.winner.length,
    //   sortDirections: ["descend", "ascend"],
    //   width: 180,
    // },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        switch (status) {
          case "EXPIRED":
            return (
              <Tag className="tags" color="#c73b27">
                {status}
              </Tag>
            );
          case "CLOSED":
            return (
              <Tag className="tags" color="#c73b27">
                {status}
              </Tag>
            );
          case "CANCELLED":
            return (
              <Tag className="tags" color="#c73b27">
                {status}
              </Tag>
            );
          case "NO_RESPONSE":
            return (
              <Tag className="tags" color="#c73b27">
                {status}
              </Tag>
            );
          case "PENDING_COMPANY_RESPONSE":
            return (
              <Tag className="tags" color="#faad14">
                {status}
              </Tag>
            );
          case "PENDING_USER_RESPONSE":
            return (
              <Tag className="tags" color="#faad14">
                {status}
              </Tag>
            );
  
          case "PENDING_COMPANY_CONFIRMATION":
            return (
              <Tag className="tags" color="#faad14">
                {status}
              </Tag>
            );
  
          case "COMPLETED":
            return (
              <Tag className="tags" color="#0d8c63">
                {status}
              </Tag>
            );
          default:
            return (
              <Tag className="tags" color="#525252">
                {status}
              </Tag>
            );
        }
      },
      sorter: (a, b) => a.status.length - b.status.length,
      sortDirections: ["descend", "ascend"],
      width: 220,
    },
    {
      title: "Action",
      render: (text, record) => (
        <Button
          className="view_button"
          shape="circle"
          icon={<EyeOutlined />}
          onClick={() => history.push(`/ticket-management/${record.id}`)}
        />
      ),
      fixed: "right",
      width: 70,
    },
  ];
 
  if(loading || !tableDate){
    return <CircularProgress color="secondary" />
  }
  
  return (
    <Table
      columns={columns}
      dataSource={(tableDate as ITicketsWithCount).nodes}
      scroll={{ x: 1300 }}
      bordered
      pagination={{
        current: filterData.page,
        pageSize: filterData.pageSize,
        total: tableDate?.totalCount,
        onChange: (page, pageSize) => {
          setFilterData({
            ...filterData,
            page: page,
            pageSize: pageSize,
          });
        },
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} items`,
      }}
    />
  );
}

export default DashBoardTicketDataTable;
