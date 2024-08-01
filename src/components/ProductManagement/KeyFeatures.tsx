import React, { useEffect, useState } from "react";
import { Input, Button } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"; 
import { usePostDataStore } from "store/postDataStore";

function KeyFeatures() {
  const setPostData = usePostDataStore((state) => state.setPostData);
  const postData = usePostDataStore((state) => state.postData);

  const [inputFields, setInputFields] = useState<any>([]);

  const onAdd = () => {
    inputFields.push("");
    setInputFields([...inputFields]);
  };

  const onRemove = (index) => {
    inputFields.splice(index, 1);
    setInputFields([...inputFields]);
    setPostData({ ...postData, keyFeatures: inputFields });
  };

  const onChange = (index, value) => {
    inputFields[index] = value;
    setInputFields([...inputFields]);
    setPostData({ ...postData, keyFeatures: inputFields });
  };

  useEffect(() => {
    if (postData.keyFeatures) {
      setInputFields(postData.keyFeatures);
    }
    return () => {
      setInputFields([]);
    };
    // eslint-disable-next-line
  }, [postData]);

  return (
    <>
      <div className="step_header">
        <p>
          Key Features | <span>Key features of the product</span>
        </p>
      </div>
      {inputFields.map((item, index) => (
        <div key={index} className="dy_fields">
          <Input
            size="large"
            placeholder="Feature Name"
            style={{ width: "50%" }}
            value={item}
            onChange={(e) => onChange(index, e.target.value)}
          />
          <MinusCircleOutlined
            className="dynamic-delete-button rm_btn"
            onClick={() => onRemove(index)}
          />
        </div>
      ))}
      <Button
        type="dashed"
        style={{ width: "50%", marginBottom: "10px" }}
        icon={<PlusOutlined />}
        onClick={() => onAdd()}
      >
        Add field
      </Button>
      {/* <Form.List name="keyFeatures">
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
      </Form.List> */}
    </>
  );
}

export default KeyFeatures;
