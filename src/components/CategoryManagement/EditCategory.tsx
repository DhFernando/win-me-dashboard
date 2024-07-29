import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, message, Popconfirm, Switch, TimePicker } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import Progress from "react-progress-2";
import { useLocation } from "react-router-dom";
import {
  UPDATE_PRODUCT_CATEGORY,
  UPSERT_PRODUCT_REQUEST_FORM,
} from "../../GraphQL/Mutations";
import useProductCategoryById from "../../hooks/useProductCategoryById";
import {
  useBreadcrumbStore,
  useImagesStore,
  usePostDataStore,
  useRequestDataTableStore,
  useResponseDataTableStore,
} from "../../store";
import AddFieldsModel from "./AddFieldsModel";
import AddRequestFields from "./AddRequestFields";
import AddResponseFields from "./AddResponseFields";
import IndustryForm from "./IndustryForm";
import { Prompt } from "react-router";

const format = "HH:mm";
function EditCategory(props) {
  const location = useLocation();
  const ID = props.match.params.id;
  const productCategoryById = useProductCategoryById(ID, null);

  const setImagesStore = useImagesStore((state) => state.setImagesStore);
  const imagesStore = useImagesStore((state) => state.imagesStore);

  const setPostData = usePostDataStore((state) => state.setPostData);
  const postData = usePostDataStore((state) => state.postData);

  const setBreadcrumb = useBreadcrumbStore((state) => state.setBreadcrumb);
  const breadcrumb = useBreadcrumbStore((state) => state.breadcrumb);

  const [visible, setVisible] = useState<any>(false);
  const [isUnSaved, setIsUnSaved] = useState<any>(false);
  const [modelType, setModelType] = useState<any>("");

  // mutations
  const [upsertProductRequestForm] = useMutation(UPSERT_PRODUCT_REQUEST_FORM, {
    onCompleted: (data) => {
      if (
        data.upsertProductRequestForm.__typename ===
        "ProductRequestFormUpserted"
      ) {
        message.success("Request form updated successfully");
        Progress.hide();
      } else {
        message.error(data.upsertProductRequestForm.message);
        Progress.hide();
      }
    },
    onError: (error) => {
      message.error(error.message);
      Progress.hide();
    },
    fetchPolicy: "no-cache",
  });

  const [updateProductCategory] = useMutation(UPDATE_PRODUCT_CATEGORY, {
    onCompleted: (data) => {
      if (data.updateProductCategory.__typename === "ProductCategoryUpdated") {
        message.success("Category updated successfully");
        Progress.hide();
        // if (postData.isProductRequestForm) {
          Progress.show();
          upsertProductRequestForm({
            variables: {
              ...dynamicForm,
              status: postData.isProductRequestForm ? "ACTIVE" : "DISABLED"
            },
          });
        // }
      } else if(data.updateProductCategory.__typename === "DuplicateSlugError"){
        message.error("This slug is used in another");
      } else {
        message.error(data.updateProductCategory.message);
        Progress.hide();
      }
    },
    onError: (error) => {
      console.log(error)
      message.error(error.message);
      Progress.hide();
    },
    fetchPolicy: "no-cache",
  });

  const { requestData, setRequestDataTableStore } = useRequestDataTableStore(
    useCallback(
      (state) => ({
        requestData: state.requestData,
        setRequestDataTableStore: state.setRequestDataTableStore,
      }),
      []
    )
  );

  const { responseData, setResponseDataTableStore } = useResponseDataTableStore(
    useCallback(
      (state) => ({
        responseData: state.responseData,
        setResponseDataTableStore: state.setResponseDataTableStore,
      }),
      []
    )
  );

  const [dynamicForm, setDynamicForm] = useState<any>({
    productCategoryId: ID,
    maxCompanyResponseDurationSeconds: 0,
    time1: 0,
    time2: 0,
    maxUserResponseDurationSeconds: 0,
    status: "ACTIVE",
  });

  useEffect(() => {
    console.log('productCategoryById.productRequestForm_____', productCategoryById.productRequestForm)
    const setValues = () => {
      if (productCategoryById.length !== 0) {
        let flag = true;
        let breadcrumbNew: any = [];
        for (let x = 0; x < breadcrumb.length; x++) {
          if (breadcrumb[x].name === productCategoryById.name) {
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
              name: productCategoryById.name,
              url: location.pathname,
            },
          ]);
        } else {
          setBreadcrumb(breadcrumbNew);
        }
        setPostData({
          ...postData,
          id: productCategoryById.id,
          name: productCategoryById.name,
          description: productCategoryById.description,
          price: productCategoryById.price,
          iconUrl: productCategoryById.iconUrl,
          coverUrl: productCategoryById.coverUrl,
          canHaveProducts: productCategoryById.canHaveProducts,
          active: productCategoryById.active,
          status: productCategoryById.status,
          slug: productCategoryById.slug,
          isProductRequestForm: (productCategoryById.productRequestForm && productCategoryById.productRequestForm.status === 'ACTIVE' )
            ? true
            : false,
        });
        if (productCategoryById.productRequestForm) {
          setDynamicForm((prevState) => ({
            ...prevState,
            maxCompanyResponseDurationSeconds:
              productCategoryById.productRequestForm.maxCompanyResponseDuration,
            maxUserResponseDurationSeconds:
              productCategoryById.productRequestForm.maxUserResponseDuration,
            time1: moment
              .utc(
                productCategoryById.productRequestForm
                  .maxCompanyResponseDuration * 1000
              )
              .format("HH:mm"),
            time2: moment
              .utc(
                productCategoryById.productRequestForm.maxUserResponseDuration *
                  1000
              )
              .format("HH:mm"),
          }));
          setRequestDataTableStore(
            JSON.parse(productCategoryById.productRequestForm.requestFields)
          );
          setResponseDataTableStore(
            JSON.parse(productCategoryById.productRequestForm.responseFields)
          );
        }
        setImagesStore({
          ...imagesStore,
          logoUrl: productCategoryById.iconUrl,
          bannerUrl: productCategoryById.coverUrl,
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
      setRequestDataTableStore([]);
      setResponseDataTableStore([]);
    };
    // eslint-disable-next-line
  }, [productCategoryById]);

  const ChangeStatus = () => {
    setPostData({
      ...postData,
      status:
        postData?.status?.toUpperCase() === "ACTIVE" ? "BLOCKED" : "ACTIVE",
    });
  };

  const submitForm = () => {
    Progress.show();
    // if (postData.isProductRequestForm) {
      buildRequestFormSchema();
      buildResponseFormSchema();
    // }
    updateProductCategory({
      variables: {
        ...postData,
        status: postData.status.toUpperCase(),
      },
    });
  };

  const buildRequestFormSchema = () => {
    let requestFormSchemaObj:{
      type:string,
      properties:any,
      required: any[]
    } = {
      type: "object",
      properties: {},
      required: [],
    };
    let requestFormUiSchemaObj:{
      type:string,
      elements:any[]
    } = {
      type: "VerticalLayout",
      elements: [],
    };

    for (let x = 0; x < requestData.length; x++) {
      let field = requestData[x].schema.properties;
      for (let key in field) {
        if(field[key].type === "array"){
          requestFormSchemaObj.properties[key] = {
            type: requestData[x].schema.properties[key].type,
            description: requestData[x].schema.properties[key].description,
            format: requestData[x].schema.properties[key].format,
            uniqueItems: true,
            items: {
              type: 'string',
              enum: requestData[x].fields.keyOptions
            }
          };
        }else{
          requestFormSchemaObj.properties[key] = {
            type: requestData[x].schema.properties[key].type,
            description: requestData[x].schema.properties[key].description,
            enum: requestData[x].schema.properties[key].enum,
            format: requestData[x].schema.properties[key].format,
          };
        }
       
        if (requestData[x].fields.required) {
          requestFormSchemaObj.required.push(key);
        }
      }
      let element: any = requestData[x].uiSchema.elements;
      for (let y = 0; y < element.length; y++) {
        requestFormUiSchemaObj.elements.push(element[y]);
      }
    }

    const requestFormSchema = JSON.stringify(requestFormSchemaObj);
    const requestFormUiSchema = JSON.stringify(requestFormUiSchemaObj);
    const requestFields = JSON.stringify(requestData);
    setDynamicForm((prevState) => ({
      ...prevState,
      requestFormSchema,
      requestFormUiSchema,
      requestFields,
    }));
  };

  const buildResponseFormSchema = () => {
    let responseFormSchemaObj:{
      type:string,
      properties:any,
      required: any[]
    } = {
      type: "object",
      properties: {},
      required: [],
    };
    let responseFormUiSchemaObj:{
      type:string,
      elements: any[]
    } = {
      type: "VerticalLayout",
      elements: [],
    };
    for (let x = 0; x < responseData.length; x++) {
      let field = responseData[x].schema.properties;
      for (let key in field) {
        if (responseData[x].fields.fieldType === "date") {
          responseFormSchemaObj.properties[key] = {
            type: responseData[x].schema.properties[key].type,
            // format: "date",
          };
        } else {
          responseFormSchemaObj.properties[key] = {
            type: responseData[x].schema.properties[key].type,
            description: responseData[x].schema.properties[key].description,
            enum: responseData[x].schema.properties[key].enum,
          };
        }
        if (responseData[x].fields.required) {
          responseFormSchemaObj.required.push(key);
        }
      }
      let element: any = responseData[x].uiSchema.elements;
      for (let y = 0; y < element.length; y++) {
        responseFormUiSchemaObj.elements.push(element[y]);
      }
      // fieldsList.push(responseData[x].fields);
    }
    const responseFormSchema = JSON.stringify(responseFormSchemaObj);
    const responseFormUiSchema = JSON.stringify(responseFormUiSchemaObj);
    const responseFields = JSON.stringify(responseData);
    setDynamicForm((prevState) => ({
      ...prevState,
      responseFormSchema,
      responseFormUiSchema,
      responseFields,
    }));
  };

  const changeTime1 = (time, timeString) => {
    var hms = timeString;
    var a = hms.split(":");
    var seconds = +a[0] * 60 * 60 + +a[1] * 60;
    setDynamicForm((s) => ({
      ...s,
      maxCompanyResponseDurationSeconds: seconds,
      time1: time,
    }));
  };

  const changeTime2 = (time, timeString) => {
    var hms = timeString;
    var a = hms.split(":");
    var seconds = +a[0] * 60 * 60 + +a[1] * 60;
    setDynamicForm((s) => ({
      ...s,
      maxUserResponseDurationSeconds: seconds,
      time2: time,
    }));
  };

  const openAddFieldsModel = (type) => {
    setVisible(true);
    setModelType(type);
  };

  const TotalTicketTime = () => {
    return moment
      .utc(
        (dynamicForm.maxCompanyResponseDurationSeconds +
          dynamicForm.maxUserResponseDurationSeconds) *
          1000
      )
      .format("HH:mm");
  };

  return (
    <div className="dashboard">
      <Prompt
        when={isUnSaved}
        message="You have unsaved changes, are you sure you want to leave?"
      />
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
              <IndustryForm type="Edit" />
            </div>
          </div>
          <div className="status_section">
            <div className="status_container">
              <p className="step_header">
                Change Industry Status |<span>Set industry status</span>
              </p>
              <Popconfirm
                title="Are you sure? You want to change the status?"
                onConfirm={ChangeStatus}
                okText="Change"
                cancelText="No"
              >
                <div
                  className={`status_bar ${
                    postData?.status?.toUpperCase() === "ACTIVE"
                      ? "status_bar_active"
                      : "status_bar_inactive"
                  }`}
                >
                  {postData?.status?.toUpperCase() === "ACTIVE"
                    ? "ACTIVE"
                    : "BLOCKED"}
                </div>
              </Popconfirm>
              {/* <div className="status_dropdown">
                <button className="status_dropbtn status_bar_active">
                  {postData.active ? "Active" : "Inactive"}
                </button>
                <div className="dropdown-content">
                  <div className="sub-item" onClick={() => changeStatus('Active')}>Active</div>
                  <div className="sub-item" onClick={() => changeStatus('Inactive')}>Inactive</div>
                  <div className="sub-item" onClick={() => changeStatus('Block')}>Block</div>
                </div>
              </div> */}
              <div>
                <p className="step_header">
                  Enable form |<span>Enable forms for users</span>
                </p>
                <div className="status_row">
                  <p>Enable/disable forms</p>
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    checked={postData.isProductRequestForm}
                    onChange={() => {
                      setPostData({
                        ...postData,
                        isProductRequestForm: !postData.isProductRequestForm,
                      });
                      setIsUnSaved(true);
                    }}
                  />
                </div>
              </div>
              {/* ====== Start Enable Forms ===== */}
              {postData.isProductRequestForm && (
                <div>
                  <p className="step_header">
                    Response Time |<span>Set response time for users</span>
                  </p>
                  <div className="time_row">
                    <p>
                      Company Response time <span>(HH:mm)</span>
                    </p>
                    <TimePicker
                      bordered={false}
                      value={moment(dynamicForm.time1, format)}
                      format={format}
                      onChange={changeTime1}
                    />
                  </div>
                  <div className="time_row">
                    <p>
                      User Response time <span>(HH:mm)</span>
                    </p>
                    <TimePicker
                      bordered={false}
                      value={moment(dynamicForm.time2, format)}
                      format={format}
                      onChange={changeTime2}
                    />
                  </div>
                  <div className="total_time_row">
                    <p>Total Ticket Time</p>
                    <h2>
                      {TotalTicketTime()}
                      <span>(HH:mm)</span>
                    </h2>
                  </div>
                </div>
              )}
              {/* ====== End Enable Forms ===== */}
              <div>
                <p className="step_header">
                  End branch |<span>Mark as end of the tree</span>
                </p>
                <div className="status_row">
                  <p>Enable/disable end branch</p>
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    checked={postData.canHaveProducts}
                    onChange={() => {
                      setPostData({
                        ...postData,
                        canHaveProducts: !postData.canHaveProducts,
                      });
                      setIsUnSaved(true);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {postData.isProductRequestForm && (
          <>
            <div className="section_box">
              <p className="step_header">
                Add Request Fields |
                <span>Fields in the request form (User end)</span>
              </p>
              <div className="request_row">
                <Button
                  type="primary"
                  className="primary__btn"
                  onClick={() => openAddFieldsModel("Request")}
                >
                  Add Field
                </Button>
              </div>
              <AddRequestFields />
            </div>
            <div className="section_box">
              <p className="step_header">
                Add Response Fields |
                <span>Fields in the response form (Company end)</span>
              </p>
              <div className="request_row">
                <Button
                  type="primary"
                  className="primary__btn"
                  onClick={() => openAddFieldsModel("Response")}
                >
                  Add Field
                </Button>
              </div>
              <AddResponseFields />
            </div>
            {visible && (
              <AddFieldsModel
                visible={visible}
                setVisible={() => {
                  setVisible(!visible);
                }}
                modelType={modelType}
                type="Add"
                editData=""
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default EditCategory;
