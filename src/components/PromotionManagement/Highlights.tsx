import React, { useEffect, useState } from "react";
import { Input, Button } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { usePostDataStore } from "../../store";

function Highlights() {
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
    setPostData({ ...postData, highlights: inputFields });
  };

  const onChange = (index, value) => {
    inputFields[index] = value;
    setInputFields([...inputFields]);
    setPostData({ ...postData, highlights: inputFields });
  };

  useEffect(() => {
    if (postData.highlights) {
      setInputFields(postData.highlights);
    }
    return () => {
      setInputFields([]);
    };
    // eslint-disable-next-line
  }, [postData]);

  return (
    <>
      <p className="step_header">
        Promotion highlights |<span>Add promotion highlights</span>
      </p>
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
    </>
  );
}

export default Highlights;
