import { EyeOutlined } from "@ant-design/icons";
import { Button, Table, Tag } from "antd";
import React, { useState, useEffect, useContext, useCallback } from "react";
import useTicketList from "../../hooks/useTicketList";
import moment from "moment"; 
import ReplyModel from "./ReplyModel";
import SummaryTicket from "./SummaryTicket";
import { SocketContext } from "../../socket";
import client from "../../GraphQL/ApolloClient";
import { Socket } from "socket.io-client";
import { ColumnType } from "antd/lib/table";
import { useStore } from "store/useStore";
import { ITicket } from "types";
 
// Define types for the filter data
interface FilterData {
  page: number;
  pageSize: number;
  order: "ASC" | "DESC";
  sortBy: string;
  productCategoryId: number | null;
  productRequestId: number | null;
  companyId: number | undefined;
  status: string | null;
  fromDate: string | null;
  toDate: string | null;
}

function TicketDataTableBranch() {
  const profileData = useStore((state) => state.profileData);
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleSummary, setVisibleSummary] = useState<boolean>(false);
  const [replyTicketID, setReplyTicket] = useState<string | null>(null);
  const [submittedProducts, setSubmittedProducts] = useState<Record<string, Record<string, boolean>>>({});
  const [tableDate, setTableDate] = useState<ITicket[]>([]);
  const [filterData, setFilterData] = useState<FilterData>({
    page: 1,
    pageSize: 10,
    order: "DESC",
    sortBy: "CREATED_AT",
    productCategoryId: null,
    productRequestId: null,
    companyId: profileData?.companyBranchRoles[0]?.company.id,
    status: null,
    fromDate: null,
    toDate: null,
  });

  const socket = useContext<Socket | null>(SocketContext);

  const handleInviteAccepted = useCallback((data: any) => {
    client.refetchQueries({
      include: "active",
    });
  }, []);

  useEffect(() => {
    if (socket) {
      console.log("connected");
      socket.emit("join-room", {
        type: "company",
        data: {
          companyId: profileData?.companyBranchRoles[0]?.company.id,
        },
      });

      socket.on("notifications", handleInviteAccepted);

      return () => {
        socket.off("notifications", handleInviteAccepted);
      };
    }
  }, [socket, handleInviteAccepted, profileData]);

  const ticketList = useTicketList(filterData);

  useEffect(() => {
    if(ticketList){
      setTableDate(ticketList.nodes);
    }
    
  }, [ticketList]);

  const replyTicket = (ticketId: string) => {
    setReplyTicket(ticketId);
    setVisible(true);
  };

  const summaryTicket = (ticketId: string) => {
    setReplyTicket(ticketId);
    setVisibleSummary(true);
  };

  // Handler to update the submitted status for a product
  const handleProductSubmit = (ticketId: string, productId: string) => {
    setSubmittedProducts((prev) => ({
      ...prev,
      [ticketId]: {
        ...prev[ticketId],
        [productId]: true,
      },
    }));
  };

  // Reset submitted products for a ticket
  const resetSubmissionStatus = (ticketId: string) => {
    setSubmittedProducts((prev) => ({ ...prev, [ticketId]: {} }));
  };

  const columns: ColumnType<any>[] = [
    {
      title: "Ticket ID",
      dataIndex: "referenceId",
      sorter: (a: ITicket, b: ITicket) => a.referenceId.length - b.referenceId.length,
      sortDirections: ["descend", "ascend"],
      width: 200,
    },
    {
      title: "Request ID",
      render: (record: ITicket) =>
        record.requestedProducts ? record.productRequest?.referenceId : "NA",
      width: 200,
    },
    {
      title: "Product",
      render: (record: ITicket) =>
        record.requestedProducts ? record.requestedProducts[0].name : "NA",
      sortDirections: ["descend", "ascend"],
      width: 150,
    },
    {
      title: "Received Time",
      sorter: (a: ITicket, b: ITicket) => (a.createdAt ?? "").length - (b.createdAt ?? "").length,
      render: (record: ITicket) =>
        record.createdAt ? moment(record.createdAt).format("YYYY-MM-DD h:mm:ss a") : "NA",
      width: 180,
    },
    {
      title: "Replied Time",
      sorter: (a: ITicket, b: ITicket) => (a.repliedTime ?? "").length - (b.repliedTime ?? "").length,
      render: (record: ITicket) =>
        record.repliedTime ? moment(record.repliedTime).format("YYYY-MM-DD h:mm:ss a") : "NA",
      width: 180,
    },
    {
      title: "User Confirmed Time",
      sorter: (a: ITicket, b: ITicket) => (a.confirmedTime ?? "").length - (b.confirmedTime ?? "").length,
      render: (record: ITicket) =>
        record.confirmedTime ? moment(record.confirmedTime).format("YYYY-MM-DD h:mm:ss a") : "NA",
      width: 180,
    },
    {
      title: "Deal Closed Time",
      sorter: (a: ITicket, b: ITicket) => (a.completedTime ?? "").length - (b.completedTime ?? "").length,
      render: (record: ITicket) =>
        record.completedTime ? moment(record.completedTime).format("YYYY-MM-DD h:mm:ss a") : "NA",
      width: 180,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        const colorMap = {
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
          <Tag className="tags" color={colorMap[status] || "#525252"}>
            {status}
          </Tag>
        );
      },
      sorter: (a: ITicket, b: ITicket) => a.status.length - b.status.length,
      sortDirections: ["descend", "ascend"],
      width: 220,
    },
    {
      title: "Actions",
      render: (text: any, record: ITicket) => (
        <>
          {record.status === "PENDING_COMPANY_RESPONSE" && (
            <Button
              className="view_button"
              shape="circle"
              icon={<i className="bi bi-reply-fill" />}
              onClick={() => replyTicket(record.id)}
            />
          )}
          {(record.status === "PENDING_COMPANY_CONFIRMATION" ||
            record.status === "NO_RESPONSE" ||
            record.status === "COMPLETED") && (
            <Button
              className="view_button"
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => summaryTicket(record.id)}
            />
          )}
        </>
      ),
      fixed: "right",
      width: 100,
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={tableDate}
        scroll={{ x: 1300 }}
        bordered
        pagination={{
          current: filterData.page,
          pageSize: filterData.pageSize,
          total: ticketList?.totalCount,
          onChange: (page, pageSize) => {
            setFilterData((prev) => ({
              ...prev,
              page: page,
              pageSize: pageSize,
            }));
          },
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
      />
      {visible && (
        <ReplyModel
          visible={visible}
          setVisible={() => setVisible(!visible)}
          ticketId={replyTicketID}
          handleProductSubmit={handleProductSubmit}
          submittedStatus={submittedProducts[replyTicketID || ""] || {}}
          // resetSubmissionStatus={resetSubmissionStatus}
        />
      )}
      {visibleSummary && (
        <SummaryTicket
          visible={visibleSummary}
          setVisibleSummary={() => setVisibleSummary(!visibleSummary)}
          ticketId={replyTicketID || ""}
        />
      )}
    </>
  );
}

export default TicketDataTableBranch;
