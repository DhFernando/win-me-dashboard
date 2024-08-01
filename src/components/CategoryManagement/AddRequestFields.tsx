import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button, Modal, Table } from "antd";
import { useCallback, useEffect, useState } from "react"; 
import AddFieldsModel from "./AddFieldsModel";
import { ColumnType } from "antd/lib/table";
import { useRequestDataTableStore } from "store/requestDataTableStore";

const { confirm } = Modal;

function AddRequestFields() {
  const [dataList, setDataList] = useState<any>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [editData, setEditData] = useState<any>({});
  const { requestData, setRequestDataTableStore } = useRequestDataTableStore(
    useCallback(
      (state) => ({
        requestData: state.requestData,
        setRequestDataTableStore: state.setRequestDataTableStore,
      }),
      []
    )
  );
  useEffect(() => {
    setDataList(requestData);
  }, [requestData]);

  const columns: ColumnType<any>[] = [
    {
      title: "Field Name",
      dataIndex: "fields",
      key: "fields",
      render: (text: { name: string }) => <p>{text.name}</p>,
    },
    {
      title: "Description",
      dataIndex: "fields",
      key: "fields",
      render: (text: { description: string }) => <p>{text.description}</p>,
    },
    {
      title: "Type",
      dataIndex: "fields",
      key: "fields",
      render: (text: { fieldType: string }) => <p>{text.fieldType}</p>,
    },
    {
      title: "Required",
      dataIndex: "fields",
      key: "fields",
      render: (text: { required: boolean }) => <p>{text.required ? "Yes" : "No"}</p>,
    },
    {
      title: "Action",
      key: "action",
      render: (item: any, record: any, index: number) => (
        <>
          <Button
            className="edit_button"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => showEditModel(record, index)}
          />
          &nbsp;&nbsp;
          <Button
            className="delete_button"
            shape="circle"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(index)}
          />
        </>
      ),
      fixed: "right", // Fixed type should be a string literal `"left"` | `"right"`
      width: 100,
    },
  ];

  const showDeleteConfirm = (index) => {
    confirm({
      title: "Are you sure delete this Request?",
      icon: <ExclamationCircleOutlined />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        var newData = [...dataList];
        newData.splice(index, 1);
        setRequestDataTableStore(newData);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const showEditModel = (record, index) => {
    console.log(index);
    setVisible(true);
    setEditData({ record, index });
  };

  return (
    <>
      <Table columns={columns} dataSource={dataList} scroll={{ x: 800 }} />
      {visible && (
        <AddFieldsModel
          visible={visible}
          setVisible={() => {
            setVisible(!visible);
          }}
          modelType={"Request"}
          type="Edit"
          editData={editData}
        />
      )}
    </>
  );
}

export default AddRequestFields;
