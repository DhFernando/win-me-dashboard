import React, { useEffect } from "react";
import { Button, Popconfirm, message } from "antd";
import ProductForm from "./ProductForm";
import useProductById from "../../hooks/useProductById"; 
import { useMutation } from "@apollo/client";
import { UPDATE_PRODUCT } from "../../GraphQL/Mutations";
import { useLocation } from "react-router-dom";
import Progress from "react-progress-2";
import moment from "moment";
import { useImagesStore } from "store/imagesStore";
import { usePostDataStore } from "store/postDataStore";
import { useBreadcrumbStore } from "store/breadcrumbStore";
import { GraphQLSuccess } from "types/GraphQLTypes";

function EditProduct(props) {
  const location = useLocation();
  const ID = props.match.params.id;
  const productById = useProductById(ID);

  const setImagesStore = useImagesStore((state) => state.setImagesStore);
  const imagesStore = useImagesStore((state) => state.imagesStore);
  const setPostData = usePostDataStore((state) => state.setPostData);
  const postData = usePostDataStore((state) => state.postData);
  const setBreadcrumb = useBreadcrumbStore((state) => state.setBreadcrumb);
  const breadcrumb = useBreadcrumbStore((state) => state.breadcrumb);

  useEffect(() => {
    const setValues = () => {
      if (productById.length !== 0) {
        let flag = true;
        let breadcrumbNew: any[] = [];
        for (let x = 0; x < breadcrumb.length; x++) {
          if (breadcrumb[x].name === productById.name) {
            flag = false;
            breadcrumbNew.push(breadcrumb[x]);
            break;
          } else {
            breadcrumbNew.push(breadcrumb[x]);
          }
        }
        if (flag) {
          setBreadcrumb([
            ...breadcrumb,
            {
              name: productById.name,
              url: location.pathname,
            },
          ]);
        } else {
          setBreadcrumb(breadcrumbNew);
        }
        setPostData({
          ...postData,
          id: productById.id,
          productCategoryId: productById.category.id,
          name: productById.name,
          description: productById.description,
          iconUrl: productById.iconUrl,
          coverUrl: productById.coverUrl,
          status: productById.status,
          updatedAt: productById.updatedAt,
          keyFeatures: productById.keyFeatures,
        });
        setImagesStore({
          ...imagesStore,
          logoUrl: productById.iconUrl,
          bannerUrl: productById.coverUrl,
        });
      }
    };
    setValues();

    return function cleanup() {
      setPostData({});
      setImagesStore({
        logoUrl: "",
        bannerUrl: "",
      });
    };
    // eslint-disable-next-line
  }, [productById]);

  const ChangeStatus = () => {
    setPostData({
      ...postData,
      status: postData?.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE',
    });
  };  

  const submitForm = () => {
    Progress.show();
    updateProduct({
      variables: {
        ...postData,
      },
      awaitRefetchQueries: true,
    });
  };

  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    onCompleted: (data) => {
      if (data.updateProduct.__typename === GraphQLSuccess.ProductUpdated) {
        message.success("Product updated successfully");
        Progress.hide();
      } else {
        message.error(data.updateCompany.message);
        Progress.hide();
      }
    },
    onError: (error) => {
      message.error(error.message);
      Progress.hide();
    },
    fetchPolicy: "no-cache",
  });

  return (
    <div className="dashboard">
      <div className="section_row">
        <div className="top_row">
          <Button
            type="primary"
            onClick={() => submitForm()}
            className="primary__btn"
          >
            Save
          </Button>
        </div>
        <div className="bottom_row">
          <div className="edit_section">
            <div className="edit_container">
              <ProductForm type="Edit" />
            </div>
          </div>
          <div className="status_section">
            <div className="status_container">
              <p className="step_header">
                Change Product Status |<span>Set product status</span>
              </p>
              <Popconfirm
                title="Are you sure? You want to change the status?"
                onConfirm={ChangeStatus}
                okText="Change"
                cancelText="No"
              >
                <div
                  className={`status_bar ${postData?.status === "ACTIVE" ? "status_bar_active" : "status_bar_inactive"
                    }`}
                >
                  {postData?.status === "ACTIVE" ? "ACTIVE" : "BLOCKED"}
                </div>
              </Popconfirm>
              <p className="sm_txt">
                Last edited date:{" "}
                {moment(postData.updatedAt).format("YYYY/MM/DD")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;
