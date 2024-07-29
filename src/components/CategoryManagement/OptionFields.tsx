import React from "react";
import { Form, Input, Button } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

function OptionFields() {
  return (
    <>
      <p className="step_header">
        Product Sub Category Field Values |
        <span>Details about the sub product category field values</span>
      </p>
      <Form.List name="keyOptions">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item label={index + 1} required={false} key={field.key}>
                <Form.Item
                  {...field}
                  validateTrigger={["onChange", "onBlur"]}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message:
                        "Please input feature name or delete this field.",
                    },
                  ]}
                  noStyle
                >
                  <Input
                    size="large"
                    placeholder="Feature Name"
                    style={{ width: "50%" }}
                  />
                </Form.Item>
                <MinusCircleOutlined
                  className="dynamic-delete-button rm_btn"
                  onClick={() => remove(field.name)}
                />
              </Form.Item>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: "50%" }}
                icon={<PlusOutlined />}
              >
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );
}

export default OptionFields;
