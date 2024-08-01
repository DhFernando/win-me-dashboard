import { EditOutlined } from "@ant-design/icons";
import { Button, Table, Tag } from "antd";
import React, { useState } from "react";
import useAllPromotionsCategoryList from "../../hooks/useAllPromotionsCategoryList";
import PromotionCategoryModel from "./PromotionCategoryModel";
import { ColumnType } from "antd/lib/table";

function PromotionCategoryDataTable() {
  const [visible, setVisible] = useState<boolean>(false);
  const [selectData, setSelectData] = useState<any>({});

  const [filterData, setFilterData] = useState<any>({
    page: 1,
    pageSize: 10,
    order: "ASC",
    sortBy: "NAME",
  });

  const allPromotionsCategoryList = useAllPromotionsCategoryList(filterData);

  const editCategory = (data) => {
    setVisible(true);
    setSelectData(data);
  };

  const columns: ColumnType<any>[] = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend", "ascend"],
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
    },
    {
      title: "Action",
      render: (text, record) => (
        <>
          <Button
            className="view_button"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => editCategory(record)}
          />
        </>
      ),
      // fixed: "right",
      width: 70,
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={allPromotionsCategoryList.nodes}
        bordered
        scroll={{ x: 1300 }}
        pagination={{
          current: filterData.page,
          pageSize: filterData.pageSize,
          total: allPromotionsCategoryList.totalCount,
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
      {visible && (
        <PromotionCategoryModel
          visible={visible}
          setVisible={() => {
            setVisible(!visible);
          }}
          type="Edit"
          selectData={selectData}
        />
      )}
    </>
  );
}

export default PromotionCategoryDataTable;
