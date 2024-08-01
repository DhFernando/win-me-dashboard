import { Button, Form, Input, message } from "antd";
import React, { useEffect } from "react"; 
import ImagesProductSection from "./ImagesProductSection";
import { CREATE_PRODUCT_CATEGORY } from "../../GraphQL/Mutations";
import { useMutation } from "@apollo/client";
import Progress from "react-progress-2";
import { usePostDataStore } from "store/postDataStore";
import { useImagesStore } from "store/imagesStore";
import { useRefreshDataTables } from "store/refreshDataTables";
import { GraphQLError, GraphQLSuccess } from "types/GraphQLTypes";

export default function IndustryForm(props) {
  const ID = props.type === "New" ? null : props.id;

  const [form] = Form.useForm();
  const setPostData = usePostDataStore((state) => state.setPostData);
  const postData = usePostDataStore((state) => state.postData);
  const imagesStore = useImagesStore((state) => state.imagesStore);
  const setRefreshDataTables = useRefreshDataTables(
    (state) => state.setRefreshDataTables
  );
  const refreshDataTables = useRefreshDataTables(
    (state) => state.refreshDataTables
  );

  const onFinish = () => {
    form.validateFields().then((values) => {
      if (
        imagesStore.logoUrl === undefined ||
        imagesStore.bannerUrl === undefined
      ) {
        message.error("Please upload a logo");
        return;
      } else {
        Progress.show();
        createProductCategory({
          variables: {
            ...postData,
            parentId: ID,
            canHaveProducts: false,
          },
          awaitRefetchQueries: true,
        });
      }
    });
  };

  const [createProductCategory] = useMutation(CREATE_PRODUCT_CATEGORY, {
    onCompleted: (data) => {
      if (data.createProductCategory.__typename === GraphQLSuccess.ProductCategoryCreated) {
        message.success("Category created successfully");
        setRefreshDataTables(!refreshDataTables);
        props.setVisible();
        Progress.hide();
      } else if (data.createProductCategory.__typename === GraphQLError.DuplicateSlugError) {
        message.error('This slug is already used!');
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
        name: postData.name,
        description: postData.description,
        slug: postData.slug,
      });
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
        Industry Details |<span>Details about the industry</span>
      </p>
      <Form.Item
        name="name"
        rules={[{ required: true, message: "Name cannot be empty!" }]}
      >
        <Input
          type="text"
          size="large"
          placeholder="Name"
          onChange={(e) => setPostData({ ...postData, name: e.target.value })}
        />
      </Form.Item>
      <Form.Item
        name="description"
        rules={[{ required: true, message: "Description cannot be empty!" }]}
      >
        <Input
          type="text"
          size="large"
          placeholder="Description"
          onChange={(e) =>
            setPostData({ ...postData, description: e.target.value })
          }
        />
      </Form.Item>
      <Form.Item
        name="slug"
        rules={[{ required: true, message: "Slug cannot be empty! and muct be unique" }]}
      >
        <Input
          type="text"
          size="large"
          placeholder="Slug"
          onChange={(e) =>
            setPostData({ ...postData, slug: e.target.value })
          }
        />
      </Form.Item>
      <ImagesProductSection />
      {props.typeBtn === "New" && (
        <div className="steps-action">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>
      )}
    </Form>
  );
}
