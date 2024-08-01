import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Table, Tag, Modal, message } from "antd";
import { ColumnType, SortOrder } from "antd/es/table/interface"; // Import SortOrder type
import moment from "moment";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { DELETE_PROMOTION } from "../../GraphQL/Mutations";
import useAllPromotionsList from "../../hooks/useAllPromotionsList";
import Progress from "react-progress-2";
import client from "../../GraphQL/ApolloClient";
import ViewPromotionModel from "./ViewPromotionModel";
import { GraphQLSuccess } from "types/GraphQLTypes";

const { confirm } = Modal;

function PromotionDataTable() {
  const history = useHistory();
  const [viewModel, setViewModel] = useState<boolean>(false);
  const [selectedID, setSelectedID] = useState<boolean>(false);
  const [filterData, setFilterData] = useState({
    page: 1,
    pageSize: 10,
    order: "DESC",
    sortBy: "CREATED_AT",
    companyId: null,
    promotionCategoryId: null,
  });

  const allPromotionsList = useAllPromotionsList(filterData);

  const columns: ColumnType<any>[] = [
    {
      title: "Promotion title",
      dataIndex: "title",
      sorter: (a, b) => a.title.length - b.title.length,
      sortDirections: ["descend", "ascend"] as SortOrder[], // Use SortOrder type
      width: 180,
    },
    {
      title: "Company Name",
      sorter: (a, b) => a.company.name.localeCompare(b.company.name),
      render: (record) => record.company.name,
      width: 150,
    },
    {
      title: "Product Name",
      sorter: (a, b) => a.product.name.localeCompare(b.product.name),
      render: (record) => record.product.name,
      width: 150,
    },
    {
      title: "Expiry Date",
      sorter: (a, b) => a.expiresAt.length - b.expiresAt.length,
      sortDirections: ["descend", "ascend"] as SortOrder[], // Use SortOrder type
      render: (record) =>
        record.expiresAt
          ? moment(record.expiresAt).format("YYYY-MM-DD h:mm:ss a")
          : "",
      width: 180,
    },
    {
      title: "Status",
      dataIndex: "active",
      render: (active) => (
        <>
          {
            <Tag className="tags" color={active ? "#0d8c63" : "#bd0000"}>
              {active ? "Active" : "Inactive"}
            </Tag>
          }
        </>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
      sortDirections: ["descend", "ascend"] as SortOrder[], // Use SortOrder type
      width: 100,
    },
    {
      title: "Action",
      render: (text, record) => (
        <>
          <Button
            className="view_button"
            shape="circle"
            icon={<EyeOutlined />}
            onClick={() => viewPromotion(record.id)}
          />
          &nbsp;&nbsp;
          <Button
            className="view_button"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() =>
              history.push(`/promotion-management/edit/${record.id}`)
            }
          />
          &nbsp;&nbsp;
          <Button
            className="delete_button"
            shape="circle"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.id)}
          />
        </>
      ),
      fixed: "right",
      width: 100,
    },
  ];

  const viewPromotion = (id) => {
    if (id) {
      setViewModel(true);
      setSelectedID(id);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure delete this Promotion?",
      icon: <ExclamationCircleOutlined />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deletePromotion({
          variables: {
            promotionId: id,
          },
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const [deletePromotion] = useMutation(DELETE_PROMOTION, {
    onCompleted: (data) => {
      if (data.deletePromotion.__typename === GraphQLSuccess.PromotionDeleted) {
        message.success("Promotion deleted successfully");
        Progress.hide();
        client.resetStore();
      } else {
        message.error(data.deletePromotion.message);
        Progress.hide();
      }
    },
    onError: (error) => {
      message.error(error.message);
      Progress.hide();
    },
    fetchPolicy: "no-cache",
  });

  return (
    <>
      <Table
        columns={columns}
        dataSource={allPromotionsList.nodes}
        scroll={{ x: 1300 }}
        bordered
        pagination={{
          current: filterData.page,
          pageSize: filterData.pageSize,
          total: allPromotionsList.totalCount,
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
      {viewModel && (
        <ViewPromotionModel
          viewModel={viewModel}
          setViewModel={() => {
            setViewModel(!viewModel);
          }}
          selectedID={selectedID}
        />
      )}
    </>
  );
}

export default PromotionDataTable;
