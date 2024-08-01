import { Input, Select, Button, message, Form, InputNumber } from "antd";
import React, { useEffect } from "react"; 
import ImagesSection from "./ImagesSection";
import useCountryList from "../../hooks/useCountryList";
import useProductsCategoryList from "../../hooks/useProductsCategoryList";
import { ValueType } from "aws-sdk/clients/textract";
import { useStore } from "store/useStore";

const { Option } = Select;

export function StepOne(props) {
  const [form] = Form.useForm();
  const setClientData = useStore((state) => state.setClientData);
  const clientData = useStore((state) => state.clientData);

  const countries = useCountryList();
  const categories = useProductsCategoryList(true, "");

  const onFinish = () => {
    form.validateFields().then((values) => {
      props.setNextStep();
    });
  };

  const onFinishFailed = () => {
    message.error("Please fill all the details");
  };

  useEffect(() => {
    const FillData = () => {
      // form.resetFields();
      form.setFieldsValue({
        companyCategoryId: clientData.companyCategoryId,
        rating: clientData.rating,
        name: clientData.name,
        countryId: clientData.countryId,
        description: clientData.description,
        address: clientData.address,
        location: clientData.location,
      });
    };
    FillData();
    // eslint-disable-next-line
  }, [clientData]);

  // Regular expression to validate map URLs (example for Google Maps)
  const mapUrlPattern =
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z]{2,6})([\/\w \-\?]*)*$/;

  return (
    <div className="step_container">
      <Form
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <div className="step_header">
          <p>
            Contact Details |<span>Contact details of the company</span>
          </p>
        </div>
        <div className="step_two_colum">
          <Form.Item
            className="step_input"
            name="companyCategoryId"
            required
            rules={[
              { required: true, message: "Client category cannot be empty!" },
            ]}
          >
            <Select
              size="large"
              placeholder="Client category"
              onSelect={(value) =>
                setClientData({ ...clientData, companyCategoryId: value })
              }
            >
              {categories
                .filter((item) => item.active)
                .map((item, index) => (
                  <Option key={index} value={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            className="step_input"
            name="rating"
            rules={[
              {
                required: false,
                type: "number",
                min: 0,
                max: 5,
                message: "Rating must be between 0 and 5",
              },
            ]}
          >
            <InputNumber
              type="text"
              size="large"
              placeholder="Rating"
              className="full_width"
              onChange={(value) =>
                setClientData({ ...clientData, rating: parseFloat(value as ValueType) })
              }
            />
          </Form.Item>
        </div>
        <div className="step_two_colum">
          <Form.Item
            className="step_input"
            name="name"
            rules={[
              { required: true, message: "Company name cannot be empty!" },
            ]}
          >
            <Input
              type="text"
              size="large"
              placeholder="Company name"
              onChange={(e) =>
                setClientData({ ...clientData, name: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item
            className="step_input"
            name="countryId"
            rules={[{ required: true, message: "Country cannot be empty!" }]}
          >
            <Select
              size="large"
              placeholder="Country"
              onSelect={(value) =>
                setClientData({ ...clientData, countryId: value })
              }
            >
              {countries.map((item, index) => (
                <Option key={index} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div>
          <Form.Item
            name="description"
            rules={[{ required: false, message: "Country cannot be empty!" }]}
          >
            <Input
              type="text"
              size="large"
              placeholder="About the company"
              onChange={(e) =>
                setClientData({ ...clientData, description: e.target.value })
              }
            />
          </Form.Item>
        </div>
        <div className="step_two_colum">
          <Form.Item
            style={{ width: "73%" }}
            name="address"
            rules={[{ required: false, message: "Address cannot be empty!" }]}
          >
            <Input
              type="text"
              size="large"
              placeholder="Address"
              onChange={(e) =>
                setClientData({ ...clientData, address: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item
            style={{ width: "25%" }}
            name="location"
            rules={[
              {
                required: false,
                message: "Map location cannot be empty!",
              },
              {
                pattern: mapUrlPattern,
                message: "Please enter a valid map URL!",
              },
            ]}
          >
            <Input
              type="text"
              size="large"
              placeholder="Map location"
              onChange={(e) =>
                setClientData({ ...clientData, location: e.target.value })
              }
            />
          </Form.Item>
        </div>
        {props.type === "new" && <ImagesSection />}
        {props.type === "new" && (
          <div className="steps-action">
            <Button type="primary" htmlType="submit">
              Next
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
}
