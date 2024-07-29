import { EyeOutlined } from "@ant-design/icons";
import { Button, Table, Tag } from "antd";
import moment from "moment";
import React, { useState } from "react";
import useAllPromotionsCompanyList from "../../hooks/useAllPromotionsCompanyList";
import { useStore } from "../../store";
import ViewPromotionModel from "./ViewPromotionModel";
import { ColumnType } from "antd/lib/table";

function PromotionDataTableBranch() {
  const profileData = useStore((state) => state.profileData);
  const [viewModel, setViewModel] = useState<any>(false);
  const [selectedID, setSelectedID] = useState<any>(false);
  const [filterData, setFilterData] = useState<any>({
    page: 1,
    pageSize: 10,
    order: "DESC",
    sortBy: "CREATED_AT",
    companyId: profileData?.companyBranchRoles[0]?.company.id,
  });

  const allPromotionsList = useAllPromotionsCompanyList(filterData);

  const columns:ColumnType<any>[] = [
    {
      title: "Promotion title",
      dataIndex: "title",
      sorter: (a, b) => a.title.length - b.title.length,
      sortDirections: ["descend", "ascend"],
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
      sortDirections: ["descend", "ascend"],
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
      sortDirections: ["descend", "ascend"],
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
        </>
      ),
      fixed: "right",
      width: 50,
    },
  ];

  const viewPromotion = (id) => {
    if (id) {
      setViewModel(true);
      setSelectedID(id);
    }
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={allPromotionsList.nodes}
        bordered
        scroll={{ x: 1300 }}
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

export default PromotionDataTableBranch;
