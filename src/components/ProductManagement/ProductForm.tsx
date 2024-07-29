import { Button, Form, Input, message, Cascader } from "antd";
import React, { useEffect } from "react";
import {
  useImagesStore,
  usePostDataStore,
  useRefreshDataTables,
  useStore,
} from "../../store";
import ImagesUploadSection from "./ImagesUploadSection";
import KeyFeatures from "./KeyFeatures";
import { CREATE_PRODUCT } from "../../GraphQL/Mutations";
import { useMutation } from "@apollo/client";
import Progress from "react-progress-2";
import useProductsCategoryList from "../../hooks/useProductsCategoryList";
const { TextArea } = Input;

export default function ProductForm(props) {
  const [form] = Form.useForm();
  const setImagesStore = useImagesStore((state) => state.setImagesStore);
  const setPostData = usePostDataStore((state) => state.setPostData);
  const postData = usePostDataStore((state) => state.postData);
  const imagesStore = useImagesStore((state) => state.imagesStore);
  const profileData = useStore((state) => state.profileData);
  const setRefreshDataTables = useRefreshDataTables(
    (state) => state.setRefreshDataTables
  );
  const refreshDataTables = useRefreshDataTables(
    (state) => state.refreshDataTables
  );

  const productsCategoryList = useProductsCategoryList(
    props.visible,
    profileData?.companyBranchRoles[0]?.company.category.id
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
        createProduct({
          variables: {
            ...postData,
            companyId: profileData?.companyBranchRoles[0]?.company.id,
          },
        });
      }
    });
  };

  const [createProduct] = useMutation(CREATE_PRODUCT, {
    onCompleted: (data) => {
      if (data.createProduct.__typename === "ProductCreated") {
        message.success("Product Created Successfully");
        setRefreshDataTables(!refreshDataTables);
        props.setVisible();
        Progress.hide();
      } else {
        message.error(data.createProduct.message);
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
    return function cleanup() {
      setPostData({});
      setImagesStore({
        logoUrl: "",
        bannerUrl: "",
      });
      form.resetFields();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const FillData = () => {
      // console.log(postData.productCategoryId);
      form.setFieldsValue({
        name: postData.name,
        description: postData.description,
        // productCategoryId: [
        //   "31bb2f8d-4a85-4b03-834c-5226d8b8519a",
        //   "38bb6a8a-8e32-4aa0-93c7-e4dd22ff82eb",
        //   "b8e11421-c760-4fd7-9366-ae6527b00e98",
        //   "e999c47e-2000-4810-9f27-2b3a03a95f62",
        // ],
      });
    };
    FillData();
    // eslint-disable-next-line
  }, [postData]);

  function onChangeCategoryID(value, selectedOptions) {
    setPostData({ ...postData, productCategoryId: value.at(-1) });
  }

  useEffect(() => {
    const findProductPath = (productsCategoryList, postData) => {
      let path: any = [];

      for (let category of productsCategoryList) {
        if (category.id === postData.productCategoryId) {
          // Direct match with category
          for (let product of category.products.nodes) {
            if (product.id === postData.id) {
              path = [category.name, product.name];
              break;
            }
          }
        } else {
          // Check in subcategories
          for (let subCategory of category.productCategories) {
            if (subCategory.id === postData.productCategoryId) {
              for (let product of subCategory.products.nodes) {
                if (product.id === postData.id) {
                  path = [category.name, subCategory.name, product.name];
                  break;
                }
              }
            }

            if (path.length) break;
          }
        }

        if (path.length) break;
      }

      return path;
    }

    const cascadePath = findProductPath(productsCategoryList, postData);
    if (cascadePath.length) {
      form.setFieldsValue({ productCategoryId: cascadePath });
    }
  }, [form, postData, productsCategoryList])

  return (
    <Form
      autoComplete="off"
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <p className="step_header">
        Product Details |<span>Details about the product</span>
      </p>
      <Form.Item
        name="productCategoryId"
        rules={[
          { required: true, message: "Product category cannot be empty!" },
        ]}
      >
        <Cascader
          size="large"
          fieldNames={{
            label: "name",
            value: "id",
            children: "productCategories",
          }}
          options={productsCategoryList}
          onChange={onChangeCategoryID}
          placeholder="Please select"
          // Add value prop to ensure Cascader reflects the current form state
        />
      </Form.Item>
      <Form.Item
        name="name"
        rules={[{ required: true, message: "Product name cannot be empty!" }]}
      >
        <Input
          type="text"
          size="large"
          placeholder="Product Name"
          onChange={(e) => setPostData({ ...postData, name: e.target.value })}
        />
      </Form.Item>
      <Form.Item
        name="description"
        rules={[{ required: true, message: "Description cannot be empty!" }]}
      >
        <TextArea
          size="large"
          placeholder="Description"
          onChange={(e) =>
            setPostData({ ...postData, description: e.target.value })
          }
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
      </Form.Item>
      <KeyFeatures />
      <ImagesUploadSection />
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
