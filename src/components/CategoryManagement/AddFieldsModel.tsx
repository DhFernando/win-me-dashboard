import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Select, Switch } from "antd";
import React, { useEffect } from "react";
import {
  useRequestDataTableStore,
  useResponseDataTableStore,
} from "../../store";
import OptionFields from "./OptionFields";

const { Option } = Select;

function AddFieldsModel({ visible, setVisible, modelType, type, editData }) {
  const [form] = Form.useForm();
  const setRequestDataTableStore = useRequestDataTableStore(
    (state) => state.setRequestDataTableStore
  );
  const requestData = useRequestDataTableStore((state) => state.requestData);

  const setResponseDataTableStore = useResponseDataTableStore(
    (state) => state.setResponseDataTableStore
  );
  const responseData = useResponseDataTableStore((state) => state.responseData);

  useEffect(() => {
    return function cleanup() {
      form.resetFields();
    };
    // eslint-disable-next-line
  }, [visible]);
  const onFinish = () => {
    form.validateFields().then((values) => {
      onSchemaData();
    });
  };

  const onSchemaData = () => {
    let schema = {
      properties: {},
    };
    let uiSchema: {
      elements: any[]
    } = {
      elements: [],
    };
    let fields = form.getFieldsValue();

    for (let key in fields) {
      if (key === "name") {
        if (fields.fieldType === "date") {
          schema.properties[fields[key]] = {
            type: "string",
            format: "date",
          };
        } else if (fields.fieldType === "enum") {
          schema.properties[fields[key]] = {
            type: "string",
            enum: fields.keyOptions,
          };
        } else if (fields.fieldType === "number") {
          schema.properties[fields[key]] = {
            type: "integer",
            description: fields.description,
          };
        } else if (
          fields.fieldType === "boolean" ||
          fields.fieldType === "toggle"
        ) {
          schema.properties[fields[key]] = {
            type: "boolean",
            description: fields.description,
          };
        } else if (fields.fieldType === "multilineString") {
          schema.properties[fields[key]] = {
            type: "string",
            description: fields.description,
          };
        } else {
          schema.properties[fields[key]] = {
            type: fields.fieldType,
            description: fields.description,
          };
        }
        if (fields.fieldType === "multilineString") {
          uiSchema.elements.push({
            type: "Control",
            scope: `#/properties/${fields[key]}`,
            options: {
              multi: true,
            },
          });
        } else if (fields.fieldType === "toggle") {
          uiSchema.elements.push({
            type: "Control",
            scope: `#/properties/${fields[key]}`,
            label: fields.description,
            options: {
              toggle: true,
            },
          });
        } else {
          uiSchema.elements.push({
            type: "Control",
            scope: `#/properties/${fields[key]}`,
          });
        }
      }
    }

    if (modelType === "Request") {
      if (type === "Add") {
        setRequestDataTableStore([
          ...requestData,
          { schema: schema, fields: fields, uiSchema: uiSchema },
        ]);
      } else {
        let index = editData.index;
        let newData = [...requestData];
        newData[index] = { schema: schema, fields: fields, uiSchema: uiSchema };
        setRequestDataTableStore(newData);
      }
    } else {
      if (type === "Add") {
        setResponseDataTableStore([
          ...responseData,
          { schema: schema, fields: fields, uiSchema: uiSchema },
        ]);
      } else {
        let index = editData.index;
        let newData = [...responseData];
        newData[index] = { schema: schema, fields: fields, uiSchema: uiSchema };
        // console.log(newData);
        setResponseDataTableStore(newData);
      }
    }
    setVisible();
  };

  const onFinishFailed = () => {
    message.error("Please fill all the details");
  };

  useEffect(() => {
    const FillData = () => {
      //
      form.setFieldsValue({
        fieldType: type === "Edit" ? editData.record.fields.fieldType : "",
        name: type === "Edit" ? editData.record.fields.name : "",
        description: type === "Edit" ? editData.record.fields.description : "",
        required: type === "Edit" ? editData.record.fields.required : false,
        keyOptions: type === "Edit" ? editData.record.fields.keyOptions : [],
      });
    };
    if (type === "Edit") {
      FillData();
    }
    return function cleanup() {
      form.resetFields();
    };
    // eslint-disable-next-line
  }, [visible]);

  return (
    <Modal
      title={type === "Edit" ? "Edit Field" : "Add Field"}
      centered
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      width={700}
    >
      <div className="model_body">
        <Form
          autoComplete="off"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <p className="step_header">
            Product Sub Category Details |
            <span>Details about the sub product category</span>
          </p>
          <Form.Item
            name="fieldType"
            rules={[{ required: true, message: "Field Type cannot be empty!" }]}
          >
            <Select size="large" placeholder="Select Field Type">
              <Option value="">Select Field Type</Option>
              <Option value="string">Text</Option>
              <Option value="number">Number</Option>
              <Option value="date">Date</Option>
              <Option value="enum">Dropdown</Option>
              <Option value="array">Checkbox</Option>
              <Option value="multilineString">Multiline Inputs</Option>
              <Option value="toggle">Toggle</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Name cannot be empty!" }]}
          >
            <Input type="text" size="large" placeholder="Field Name" />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[
              { required: true, message: "Description cannot be empty!" },
            ]}
          >
            <Input type="text" size="large" placeholder="Field Description" />
          </Form.Item>
          <Form.Item name="required" label="Required" valuePropName="checked">
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
            />
          </Form.Item>
          <OptionFields />
          <div className="steps-action">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

export default AddFieldsModel;
