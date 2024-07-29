import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  message,
  Select,
  Switch,
  Form,
  DatePickerProps,
  InputRef,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import { REPLY_TICKET } from "../../GraphQL/Mutations";
import { useStore } from "../../store";
import TextArea, { TextAreaRef } from "antd/lib/input/TextArea";
import Progress from "react-progress-2";

function ProductForm({
  initialData,
  isProductSubmitted,
  fieldNames,
  responseFields,
  handleProductSubmit,
  ticketId,
  requested_product,
  index,
}) {
  const [form] = Form.useForm();
  const [data, setData] = useState({});
  const refs = useRef<Record<string, InputRef | TextAreaRef | DatePickerProps | null>>({});


  const profileData = useStore((state) => state.profileData);

  const [replyTicket] = useMutation(REPLY_TICKET, {
    onCompleted: (data) => {
      if (data.replyTicket.__typename === "TicketReplied") {
        message.success("Reply Successfully");
        Progress.hide();
      } else {
        message.error(data.replyTicket.message);
        Progress.hide();
      }
    },
    onError: (error) => {
      message.error(error.message);
      Progress.hide();
    },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  const replyForm = (requestedProductId) => {
    const processedData = processFormData(data, requestedProductId);
    handleProductSubmit(ticketId, requestedProductId);

    replyTicket({
      variables: {
        ticketId: ticketId,
        repliedBranchId: profileData?.companyBranchRoles[0]?.companyBranch.id,
        replies: [
          {
            replyData: JSON.stringify(processedData),
            productId: requestedProductId,
          },
        ],
      },
    });
  };

  const handleInputChange = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, date, dateString) => {
    setData((prev) => ({ ...prev, [name]: dateString }));
  };

  const processFormData = (formData, requestedProductId) => {
    const processedData = {};
    let hasRequestedProductSuffix = false;

    Object.keys(formData).forEach((key) => {
      if (key.includes(requestedProductId)) {
        hasRequestedProductSuffix = true;
        let newKey = key.replace(`-${requestedProductId}`, "");
        processedData[newKey] = formData[key];
      }
    });

    return hasRequestedProductSuffix ? processedData : formData;
  };

  const onFinish = (values) => {
    message.info("Form submitted");
    form.validateFields().then(() => {
      replyForm(requested_product.id);
      message.success("Form submitted successfully");
    });
  };

  const onFinishFailed = () => {
    message.error("Please fill all the details");
  };

  const Option = (fieldInfo, fieldName, uniqueName) => {
    switch (fieldInfo?.fields.fieldType) {
      case "number":
        return (
          <div>
            <p>
              {fieldName} {fieldInfo?.fields.required && "*"}
            </p>
            <Input
              key={uniqueName}
              name={uniqueName}
              value={data[uniqueName]}
              type="number"
              ref={(el) => (refs.current[uniqueName] = el)}
              onChange={(e) =>
                handleInputChange(uniqueName, Number(e.target.value))
              }
              defaultValue={initialData[fieldName]}
              disabled={isProductSubmitted}
            />
          </div>
        );
      case "string":
        return (
          <div>
            <p>
              {fieldName} {fieldInfo?.fields.required && "*"}
            </p>
            <Input
              key={uniqueName}
              name={uniqueName}
              value={data[uniqueName]}
              ref={(el) => (refs.current[uniqueName] = el)}
              onChange={(e) => handleInputChange(uniqueName, e.target.value)}
              defaultValue={initialData[fieldName]}
              disabled={isProductSubmitted}
            />
          </div>
        );
      case "date":
        return (
          <div>
            <p>
              {fieldName} {fieldInfo?.fields.required && "*"}
            </p>
            <DatePicker
              key={uniqueName}
              name={uniqueName}
              value={data[uniqueName]}
              ref={(el) => (refs.current[uniqueName] = el)}
              onChange={(date, dateString) =>
                handleDateChange(uniqueName, date, dateString)
              }
              disabled={isProductSubmitted}
            />
          </div>
        );
      case "multilineString":
        return (
          <div>
            <p>
              {fieldName} {fieldInfo?.fields.required && "*"}
            </p>
            <TextArea
              key={uniqueName}
              name={uniqueName}
              value={data[uniqueName]}
              ref={(el) => (refs.current[uniqueName] = el)}
              onChange={(e) => handleInputChange(uniqueName, e.target.value)}
              defaultValue={initialData[fieldName]}
              disabled={isProductSubmitted}
            />
          </div>
        );
      case "enum":
        const options = fieldInfo?.fields.keyOptions || [];
        return (
          <div>
            <p>
              {fieldName} {fieldInfo?.fields.required && "*"}
            </p>
            <Select
              style={{ width: "100%" }}
              key={uniqueName}
              value={data[uniqueName]}
              ref={(el) => (refs.current[uniqueName] = el)}
              onChange={(value) => handleInputChange(uniqueName, value)}
              defaultValue={initialData[fieldName]}
              disabled={isProductSubmitted}
            >
              {options.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </div>
        );
      case "boolean":
        if (
          fieldInfo.fields.keyOptions &&
          fieldInfo.fields.keyOptions.length > 1
        ) {
          return (
            <div>
              <p>
                {fieldName} {fieldInfo?.fields.required && "*"}
              </p>
              {fieldInfo.fields.keyOptions.map((option, index) => {
                const checkboxName = `${uniqueName}-option-${index}`;
                return (
                  <Checkbox
                    key={checkboxName}
                    name={checkboxName}
                    checked={data[checkboxName] || false}
                    ref={(el) => (refs.current[checkboxName] = el)}
                    onChange={(e) =>
                      handleInputChange(checkboxName, e.target.checked)
                    }
                    defaultChecked={initialData[checkboxName] === true}
                    disabled={isProductSubmitted}
                  >
                    {option}
                  </Checkbox>
                );
              })}
            </div>
          );
        } else {
          return (
            <div>
              <p>
                {fieldName} {fieldInfo?.fields.required && "*"}
              </p>
              <Checkbox
                key={uniqueName}
                name={uniqueName}
                checked={data[uniqueName] || false}
                ref={(el) => (refs.current[uniqueName] = el)}
                onChange={(e) =>
                  handleInputChange(uniqueName, e.target.checked)
                }
                defaultChecked={initialData[uniqueName] === true}
                disabled={isProductSubmitted}
              />
            </div>
          );
        }
      case "toggle":
        return (
          <div>
            <p>
              {fieldName} {fieldInfo?.fields.required && "*"}
            </p>
            <Switch
              key={uniqueName}
              ref={(el) => (refs.current[uniqueName] = el)}
              onChange={(checked) => handleInputChange(uniqueName, checked)}
              defaultChecked={initialData[uniqueName]}
              disabled={isProductSubmitted}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Form
      autoComplete="off"
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={initialData}
    >
      {fieldNames.map((fieldName) => {
        const fieldInfo = responseFields?.find(
          (field) => field.fields.name === fieldName
        );
        const uniqueName = `${fieldName}-${requested_product.id || index}`;
        return (
          <Form.Item
            key={uniqueName}
            className="response_input"
            name={uniqueName}
            rules={[
              {
                required: fieldInfo?.fields.required,
                message: `${fieldName} cannot be empty!`,
              },
            ]}
          >
            {Option(fieldInfo, fieldName, uniqueName)}
          </Form.Item>
        );
      })}

      <div className="steps-action">
        <Button
          type="primary"
          className="primary__btn"
          htmlType="submit"
          disabled={isProductSubmitted}
        >
          Submit
        </Button>
      </div>
    </Form>
  );
}

export default ProductForm;
