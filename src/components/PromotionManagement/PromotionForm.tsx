import { Button, Form, Input, message, Select, DatePicker, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { usePostDataStore } from "../../store";
import ImagesSection from "./ImagesSection";
import { CREATE_PROMOTION } from "../../GraphQL/Mutations";
import { useMutation } from "@apollo/client";
import Progress from "react-progress-2";
import Highlights from "./Highlights";
import useCompanyList from "../../hooks/useCompanyList";
import useProductsList from "../../hooks/useProductsList";
import useAllPromotionsCategoryList from "../../hooks/useAllPromotionsCategoryList";
import moment from "moment";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import client from "../../GraphQL/ApolloClient";

const { Option } = Select;

export default function PromotionForm(props) {
  const [form] = Form.useForm();
  const setPostData = usePostDataStore((state) => state.setPostData);
  const postData = usePostDataStore((state) => state.postData);
  const [switchStatus, setSwitchStatus] = useState<any>(false);

  const companies = useCompanyList({ page: 0 });
  const allPromotionsCategoryList = useAllPromotionsCategoryList({
    page: 0,
    active: true,
  });
  const productsList = useProductsList({
    page: 0,
    companyId: postData.companyId,
  }, false);

  const onFinish = () => {
    form.validateFields().then((values) => {
      Progress.show();
      console.log(values);
      createPromotion({
        variables: {
          ...postData,
          featured: switchStatus,
          active: true,
        },
        awaitRefetchQueries: true,
      });
    });
  };

  const [createPromotion] = useMutation(CREATE_PROMOTION, {
    onCompleted: (data) => {
      if (data.createPromotion.__typename === "PromotionCreated") {
        message.success("Promotion Created Successfully");
        props.setVisible();
        Progress.hide();
        client.resetStore();
      } else {
        message.error(data.createPromotion.message);
        Progress.hide();
      }
    },
    onError: (error) => {
      message.error(error.message);
      Progress.hide();
    },
    fetchPolicy: "no-cache",
  });

  const onFinishFailed = () => {
    message.error("Please fill all the details");
  };

  useEffect(() => {
    const FillData = () => {
      form.setFieldsValue({
        title: postData.title,
        description: postData.description,
        highlights: postData.highlights,
        companyId: postData.companyId,
        promotionCategoryIds: postData.promotionCategoryIds,
        productId: postData.productId,
        expiresAt: moment(postData.expiresAt),
      });
      setSwitchStatus(postData.featured);
    };
    FillData();
    // eslint-disable-next-line
  }, [postData]);
 

  return (
    <Form
      autoComplete="off"
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <p className="step_header">
        Promotion Details |<span>Details about the promo</span>
      </p>
      <div className="step_two_colum">
        <Form.Item
          className="step_input"
          name="companyId"
          rules={[{ required: true, message: "Company cannot be empty!" }]}
        >
          <Select
            size="large"
            placeholder="Company"
            onSelect={(value) => setPostData({ ...postData, companyId: value })}
          >
            {companies.length !== 0 &&
              companies.nodes.map((item, index) => (
                <Option key={index} value={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          className="step_input"
          name="productId"
          rules={[{ required: true, message: "Product cannot be empty!" }]}
        >
          <Select
            size="large"
            placeholder="Select product"
            onSelect={(value) => setPostData({ ...postData, productId: value })}
          >
            {productsList.length !== 0 &&
              productsList.nodes.map((item, index) => (
                <Option key={index} value={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
      </div>
      <Form.Item
        name="promotionCategoryIds"
        rules={[
          { required: true, message: "Promotion category cannot be empty!" },
        ]}
      >
        <Select
          size="large"
          mode="multiple"
          allowClear
          placeholder="Select Promotion categories"
          onChange={(value) =>
            setPostData({ ...postData, promotionCategoryIds: value })
          }
        >
          {allPromotionsCategoryList.length !== 0 &&
            allPromotionsCategoryList.nodes.map((item, index) => (
              <Option key={index} value={item.id}>
                {item.name}
              </Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="title"
        rules={[
          { required: true, message: "Promotion title cannot be empty!" },
        ]}
      >
        <Input
          type="text"
          size="large"
          placeholder="Promotion title"
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />
      </Form.Item>
      <Form.Item
        name="description"
        rules={[{ required: true, message: "Description cannot be empty!" }]}
      >
        <Input
          type="text"
          size="large"
          placeholder="Promotion Description"
          onChange={(e) =>
            setPostData({ ...postData, description: e.target.value })
          }
        />
      </Form.Item>

      <ImagesSection />
      <br />
      <Highlights />
      <p className="step_header">
        Promotion Duration |<span>Details about the promo duration</span>
      </p>
      <Form.Item
        name="expiresAt"
        rules={[
          {
            required: true,
            message: "Promotion will run until cannot be empty!",
          },
        ]}
      >
        <DatePicker
          format="YYYY-MM-DD"
          className="step_input"
          size="large"
          placeholder="Promotion will run until"
          onChange={(date, dateString) =>
            setPostData({ ...postData, expiresAt: moment(dateString).format() })
          }
        />
      </Form.Item>
      <div className="mg_t10">
        <div className="switch_line">
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={switchStatus}
            onChange={(checked) => setSwitchStatus(checked)}
          />
          <p>Featured promotion (front banner)</p>
        </div>
      </div>
      {props.type === "New" && (
        <div className="steps-action">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>
      )}
    </Form>
  );
}
