import { Form, Input, Modal } from "antd";
import React, { useEffect } from "react";
import { usePostDataStore } from "../../store";
import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";

export default function RequestDetails({ visible, setVisible, formData }) {
  const setPostData = usePostDataStore((state) => state.setPostData);
  const [form] = Form.useForm();
  useEffect(() => {
    const FillData = () => {
      form.setFieldsValue({
        ticketID: formData.referenceId,
        ticketName: formData.productCategory.name,
        userName: formData.productRequest.user.firstName,
        contact: formData.productRequest.user.phone,
      });
    };
    FillData();
    return function cleanup() {
      setPostData({});
    };
    // eslint-disable-next-line
  }, [visible]);

  return (
    <Modal
      title="Request Details"
      centered
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      width={700}
    >
      <div className="model_body">
        <p className="step_header">
          Ticket Details |<span>Details about the ticket</span>
        </p>
        <Form autoComplete="off" form={form}>
          <div className="step_two_colum">
            <Form.Item className="step_input" name="ticketID">
              <Input type="text" size="large" placeholder="Ticket ID" />
            </Form.Item>

            <Form.Item className="step_input" name="ticketName">
              <Input type="text" size="large" placeholder="Ticket name" />
            </Form.Item>
          </div>
          <div className="step_two_colum">
            <Form.Item className="step_input" name="userName">
              <Input type="text" size="large" placeholder="User Name" />
            </Form.Item>

            <Form.Item className="step_input" name="contact">
              <Input type="text" size="large" placeholder="Contact No" />
            </Form.Item>
          </div>
        </Form>
        <p className="step_header">
          Request Details |<span>Details about the request</span>
        </p>
        <JsonForms
          schema={JSON.parse(
            formData.productCategory.productRequestForm.requestFormSchema
          )}
          uischema={JSON.parse(
            formData.productCategory.productRequestForm.requestFormUiSchema
          )}
          data={JSON.parse(formData.productRequest.requestData)}
          renderers={materialRenderers}
          cells={materialCells}
        />
      </div>
    </Modal>
  );
}
