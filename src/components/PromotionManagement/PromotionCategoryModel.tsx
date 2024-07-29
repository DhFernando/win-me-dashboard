import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Form, Input, message, Modal, Switch } from "antd";
import React, { useEffect, useState } from "react";
import {
  CREATE_PROMOTION_CATEGORY,
  UPDATE_PROMOTION_CATEGORY,
} from "../../GraphQL/Mutations";
import { useImagesStore, usePostDataStore } from "../../store";
import ImageCategorySection from "./ImageCategorySection";
import Progress from "react-progress-2";
import client from "../../GraphQL/ApolloClient";

export default function PromotionCategoryModel({
  visible,
  setVisible,
  type,
  selectData,
}) {
  const setPostData = usePostDataStore((state) => state.setPostData);
  const postData = usePostDataStore((state) => state.postData);
  const setImagesStore = useImagesStore((state) => state.setImagesStore);
  const imagesStore = useImagesStore((state) => state.imagesStore);

  const [switchStatus, setSwitchStatus] = useState<any>(true);

  const [form] = Form.useForm();

  useEffect(() => {
    if (type === "Edit") {
      setPostData({
        ...postData,
        name: selectData.name,
        iconUrl: selectData.iconUrl,
        active: selectData.active,
        promotionCategoryId: selectData.id,
      });
      setSwitchStatus(selectData.active);
      setImagesStore({
        ...imagesStore,
        logoUrl: selectData.iconUrl,
      });
    }
    return function cleanup() {
      setPostData({});
      setImagesStore({
        logoUrl: "",
        bannerUrl: "",
      });
    };
    // eslint-disable-next-line
  }, [visible]);

  useEffect(() => {
    const FillData = () => {
      form.setFieldsValue({
        name: postData.name,
      });
    };
    FillData();
    // eslint-disable-next-line
  }, [postData]);

  const onFinish = () => {
    form.validateFields().then((values) => {
      if (type === "New") {
        createPromotionCategory({
          variables: {
            ...postData,
            active: switchStatus,
          },
        });
      } else {
        updatePromotionCategory({
          variables: {
            ...postData,
            active: switchStatus,
          },
        });
      }
    });
  };

  const [createPromotionCategory] = useMutation(CREATE_PROMOTION_CATEGORY, {
    onCompleted: (data) => {
      if (
        data.createPromotionCategory.__typename === "PromotionCategoryCreated"
      ) {
        message.success("Category created successfully");
        Progress.hide();
        client.refetchQueries({
          include: "active",
        });
        setVisible(false);
      } else {
        message.error(data.createPromotionCategory.message);
        Progress.hide();
      }
    },
    onError: (error) => {
      message.error(error.message);
      Progress.hide();
    },
    fetchPolicy: "no-cache",
  });

  const [updatePromotionCategory] = useMutation(UPDATE_PROMOTION_CATEGORY, {
    onCompleted: (data) => {
      if (
        data.updatePromotionCategory.__typename === "PromotionCategoryUpdated"
      ) {
        message.success("Category updated successfully");
        Progress.hide();
        client.refetchQueries({
          include: "active",
        });
        setVisible(false);
      } else {
        message.error(data.updatePromotionCategory.message);
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

  return (
    <Modal
      title={type === "New" ? "Add New Promotion Category" : "Edit Category"}
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
            Promotion Category Details |<span>Details about the category</span>
          </p>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Name cannot be empty!" }]}
          >
            <Input
              type="text"
              size="large"
              placeholder="Category Name"
              onChange={(e) =>
                setPostData({ ...postData, name: e.target.value })
              }
            />
          </Form.Item>
          <ImageCategorySection />
          <br />
          {type === "Edit" && (
            <div className="switch_line">
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                checked={switchStatus}
                onChange={(checked) => setSwitchStatus(checked)}
              />
              <p>Category status</p>
            </div>
          )}
          <div className="steps-action">
            <Button type="primary" htmlType="submit">
              {type === "New" ? "Add Category" : "Update Category"}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
