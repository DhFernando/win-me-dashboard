import {
  AppstoreAddOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Input, Modal, Space, Table, Tag, message } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useBreadcrumbStore, useRefreshDataTables } from "../../store";
import { useLocation } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { UPDATE_PRODUCT_CATEGORY } from "../../GraphQL/Mutations";
import Highlighter from "react-highlight-words";
import useProductCategoryById from "../../hooks/useProductCategoryById";
import Progress from "react-progress-2";
import Logo from "../../assets/images/logo.png";
import { ColumnType } from "antd/lib/table";
import { FilterDropdownProps } from "antd/lib/table/interface";

const { confirm } = Modal;

function SubCategoryDataTable(props) {
  const location = useLocation();

  const refreshDataTables = useRefreshDataTables(
    (state) => state.refreshDataTables
  );
  const history = useHistory();
  const ID = props.match.params.id;
  const productCategoryById = useProductCategoryById(ID, refreshDataTables);

  const [tableDate, setTableDate] = useState<any>([]);

  useEffect(() => {
    setTableDate(productCategoryById?.productCategories);
  }, [productCategoryById]);

  const setBreadcrumb = useBreadcrumbStore((state) => state.setBreadcrumb);
  const breadcrumb = useBreadcrumbStore((state) => state.breadcrumb);

  useEffect(() => {
    const setValues = () => {
      if (productCategoryById.length !== 0) {
        let flag = true;
        let breadcrumbNew: any[] = [];
        for (let x = 0; x < breadcrumb.length; x++) {
          if (breadcrumb[x].name === productCategoryById.name) {
            flag = false;
            breadcrumbNew.push(breadcrumb[x]);
            break;
          } else {
            breadcrumbNew.push(breadcrumb[x]);
          }
        }
        if (flag) {
          setBreadcrumb([
            ...breadcrumb,
            {
              name: productCategoryById.name,
              url: location.pathname,
            },
          ]);
        } else {
          setBreadcrumb(breadcrumbNew);
        }
      }
    };
    setValues();
    // eslint-disable-next-line
  }, [productCategoryById]);

  const [state, setState] = useState<any>({
    searchText: "",
    searchedColumn: "",
  });

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: FilterDropdownProps) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0] as string}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),

    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        // setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
      state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setState({ searchText: "" });
  };

  const columns:ColumnType<any>[] = [
    {
      title: "",
      align: "center",
      dataIndex: "iconUrl",
      render: (iconUrl) => (
        <div className="table_av">
          <Avatar src={iconUrl || Logo} />
        </div>
      ),
      width: 50,
    },
    {
      title: "Category Name",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ...getColumnSearchProps("description"),
      sorter: (a, b) => a.description.length - b.description.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Product Categories",
      dataIndex: "productCategories",
      render: (record) => (
        <div>
          {record.length > 0 ? (
            record
              .filter((item) => item.active)
              .map((item) => (
                <Tag color="#40a9ff" key={item.id}>
                  {item.name}
                </Tag>
              ))
          ) : (
            <Tag color="#6a6a6a">NO</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag
          className="status"
          color={status === "active" ? "#0d8c63" : "#bd0000"}
          key={status}
        >
          {status === "active" ? "Active" : "Blocked"}
        </Tag>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
      sortDirections: ["descend", "ascend"],
      width: 100,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button
            className="edit_button"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() =>
              history.push(`/category-management/edit-industry/${record.id}`)
            }
          />
          &nbsp;&nbsp;
          <Button
            className="delete_button"
            shape="circle"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record)}
          />
          &nbsp;&nbsp;
          {!record.canHaveProducts && (
            <Button
              className="add_button"
              shape="circle"
              danger
              icon={<AppstoreAddOutlined />}
              onClick={() =>
                history.push(`/category-management/add-product/${record.id}`)
              }
            />
          )}
        </>
      ),
      fixed: "right",
      width: 130,
    },
  ];

  const [updateProduct] = useMutation(UPDATE_PRODUCT_CATEGORY, {
    onCompleted: (data) => {
      if (data.updateProductCategory.__typename === "ProductCategoryUpdated") {
        message.success("Category deleted successfully");
        Progress.hide();
      } else {
        message.error(data.updateCompany.message);
        Progress.hide();
      }
    },
    onError: (error) => {
      message.error(error.message);
      Progress.hide();
    },
    fetchPolicy: "no-cache",
  });

  const showDeleteConfirm = (record) => {
    confirm({
      title: "Are you sure delete this sub-category?",
      icon: <ExclamationCircleOutlined />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        const fullRecord = productCategoryById?.productCategories.find(
          (item) => item.id === record.id
        );

        updateProduct({
          variables: {
            productCategoryId: fullRecord.productCategoryId, // or a default value if null
            id: fullRecord.id,
            name: fullRecord.name,
            description: fullRecord.description,
            iconUrl: fullRecord.iconUrl || "",
            coverUrl: fullRecord.coverUrl || "",
            keyFeatures: fullRecord.keyFeatures || [], // set a default if null,
            status: fullRecord.status.toUpperCase() || "ACTIVE",
            active: false,
          },
        })
          .then(() => {
            setTableDate((prev) =>
              prev.map((item) =>
                item.id === record.id ? { ...item, active: false } : item
              )
            );
          })
          .catch((error) => {
            console.error("Error updating product category", error);
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <Table
      columns={columns}
      dataSource={tableDate?.filter((item) => item.active)}
      scroll={{ x: 800 }}
      pagination={{
        current: 1,
        pageSize: 10,
        total:
          productCategoryById.length !== 0
            ? productCategoryById.productCategories.length
            : 0,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} items`,
      }}
    />
  );
}

export default SubCategoryDataTable;
