import { EyeOutlined } from "@ant-design/icons";
import { Avatar, Button, Table, Tag } from "antd";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import useTicketList from "../../hooks/useTicketList";
import Ticket_ICON from "../../assets/images/ticket.png";
import moment from "moment";
import { ColumnType } from "antd/es/table/interface";

// Define TypeScript interfaces for ticket and filter data
interface Ticket {
  id: string;
  referenceId: string;
  productCategory: {
    name: string;
  };
  productRequest: {
    user: {
      firstName: string;
    };
    maxUserResponseTimeExpiresAt: string;
    tickets: {
      nodes: any[];
    };
  };
  createdAt: string;
  winner: string;
  status: string;
}

interface FilterData {
  page: number;
  pageSize: number;
  order: string;
  sortBy: string;
  productCategoryId: string | null;
  productRequestId: string | null;
  companyId: string | null;
  status: string | null;
  fromDate: string | null;
  toDate: string | null;
}

function TicketDataTable() {
  const history = useHistory();

  const [tableData, setTableData] = useState<Ticket[]>([]);
  const [filterData, setFilterData] = useState<FilterData>({
    page: 1,
    pageSize: 10,
    order: "DESC",
    sortBy: "CREATED_AT",
    productCategoryId: null,
    productRequestId: null,
    companyId: null,
    status: null,
    fromDate: null,
    toDate: null,
  });

  const ticketList = useTicketList(filterData);

  useEffect(() => {
    setTableData(ticketList?.nodes || []);
  }, [ticketList]);

  const columns: ColumnType<Ticket>[] = [
    {
      title: "",
      align: "center", // Correct type for align
      dataIndex: "logoUrl",
      render: () => (
        <div className="table_av">
          <Avatar src={Ticket_ICON} />
        </div>
      ),
      width: 50,
    },
    {
      title: "Ticket",
      sorter: (a: Ticket, b: Ticket) =>
        a.productCategory.name.localeCompare(b.productCategory.name),
      render: (record: Ticket) => record.productCategory.name,
      width: 150,
    },
    {
      title: "Ticket ID",
      dataIndex: "referenceId",
      sorter: (a: Ticket, b: Ticket) => a.referenceId.localeCompare(b.referenceId),
      width: 200,
    },
    {
      title: "User",
      sorter: (a: Ticket, b: Ticket) =>
        a.productRequest.user.firstName.localeCompare(b.productRequest.user.firstName),
      render: (record: Ticket) => record.productRequest.user.firstName || "NA",
      width: 150,
    },
    {
      title: "Created Date",
      sorter: (a: Ticket, b: Ticket) =>
        moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      render: (record: Ticket) =>
        record.createdAt ? moment(record.createdAt).format("YYYY-MM-DD h:mm:ss a") : "NA",
      width: 180,
    },
    {
      title: "Closed Tickets",
      render: (record: Ticket) =>
        record.productRequest ? moment(record.productRequest.maxUserResponseTimeExpiresAt).format("YYYY-MM-DD h:mm:ss a") : "NA",
      width: 180,
    },
    {
      title: "Request Count",
      render: (record: Ticket) =>
        record.productRequest ? record.productRequest.tickets.nodes.length : "NA",
      width: 150,
    },
    {
      title: "Winner",
      dataIndex: "winner",
      sorter: (a: Ticket, b: Ticket) => a.winner.localeCompare(b.winner),
      width: 180,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        const statusColors: Record<string, string> = {
          EXPIRED: "#c73b27",
          CLOSED: "#c73b27",
          CANCELLED: "#c73b27",
          NO_RESPONSE: "#c73b27",
          PENDING_COMPANY_RESPONSE: "#faad14",
          PENDING_USER_RESPONSE: "#faad14",
          PENDING_COMPANY_CONFIRMATION: "#faad14",
          COMPLETED: "#0d8c63",
        };
        return (
          <Tag className="tags" color={statusColors[status] || "#525252"}>
            {status}
          </Tag>
        );
      },
      sorter: (a: Ticket, b: Ticket) => a.status.localeCompare(b.status),
      width: 220,
    },
    {
      title: "Action",
      render: (text: any, record: Ticket) => (
        <Button
          className="view_button"
          shape="circle"
          icon={<EyeOutlined />}
          onClick={() => history.push(`/ticket-management/${record.id}`)}
        />
      ),
      fixed: "right" as const, // Correct type for fixed
      width: 70,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      scroll={{ x: 1300 }}
      bordered
      pagination={{
        current: filterData.page,
        pageSize: filterData.pageSize,
        total: ticketList.totalCount || 0,
        onChange: (page, pageSize) => {
          setFilterData((prevFilter) => ({
            ...prevFilter,
            page,
            pageSize,
          }));
        },
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} items`,
      }}
    />
  );
}

export default TicketDataTable;
