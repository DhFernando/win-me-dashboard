import { Button, Form, Input, message, Modal, Switch } from "antd";
import React, { useEffect, useState } from "react";
import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import useTicketById from "../../hooks/useTicketById";
import { useMutation } from "@apollo/client";
import { MARK_TICKET_AS_COMPLETED } from "../../GraphQL/Mutations";
import Progress from "react-progress-2";
import {
  CheckCircleTwoTone,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { IProduct } from "types";

export default function SummaryTicket({
  visible,
  setVisibleSummary,
  ticketId,
}) {
  const ticketById = useTicketById(ticketId);
  const [form] = Form.useForm();
  const [switchStatus, setSwichStatus] = useState<boolean>(false);

  const closeDeal = () => {
    if (switchStatus) {
      markTicketAsCompleted({
        variables: {
          ticketId: ticketId,
        },
      });
    } else {
      message.error("Please contact the customer to close the deal");
    }
  };

  const [markTicketAsCompleted] = useMutation(MARK_TICKET_AS_COMPLETED, {
    onCompleted: (data) => {
      if (data.markTicketAsCompleted.__typename === "TicketCompleted") {
        message.success("Ticket Completed");
        setVisibleSummary(false);
        Progress.hide();
      } else {
        message.error(data.markTicketAsCompleted.message);
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
    console.log(ticketById)
    form.setFieldsValue({
      name: `${ticketById?.userDetails?.firstName} ${ticketById?.userDetails?.lastName}`,
      contact: ticketById?.userDetails?.phone,
      email: ticketById?.userDetails?.email,
    });
  }, [form, ticketById]);

  return (
    <Modal
      title={`Contact - ${ticketById ? ticketById.referenceId : ""
        }`}
      centered
      visible={visible}
      onCancel={() => setVisibleSummary(false)}
      footer={null}
      width={700}
    >
      <div className="model_body">
        <p className="step_header">
          <CheckCircleTwoTone twoToneColor="#52c41a" />
          Request Details |<span>Details about the request</span>
        </p>
        {ticketById && (
          <JsonForms
            schema={JSON.parse(
              ticketById.productCategory.productRequestForm.requestFormSchema
            )}
            uischema={JSON.parse(
              ticketById.productCategory.productRequestForm.requestFormUiSchema
            )}
            data={JSON.parse(ticketById.productRequest.requestData)}
            renderers={materialRenderers}
            cells={materialCells}
            readonly
          />
        )}
        <br />
        <br />
        <p className="step_header">
          <CheckCircleTwoTone twoToneColor="#52c41a" />
          {ticketById?.confirmedProductId ? 'Confirmed Product Response': 'Add Your Response'} |<span>Details about the response</span>
        </p>
        <p className="step_header" style={{ padding: 10 }}>
          {ticketById?.confirmedProductId && (
             <>|<span>Product Name </span> : {ticketById.requestedProducts.find((rq: IProduct) => rq.id === ticketById.confirmedProductId)?.name}</>
          )}
        </p>
        {ticketById && (
          <JsonForms
            schema={JSON.parse(ticketById.productCategory.productRequestForm.responseFormSchema)}
            uischema={JSON.parse(ticketById.productCategory.productRequestForm.responseFormUiSchema)}
            data={ticketById.replies && ticketById.replies.length > 0
              ? JSON.parse(ticketById.replies.find(reply => reply?.product?.id === ticketById?.confirmedProductId)?.replyData || '{}')
              : {}
            }
            renderers={materialRenderers}
            cells={materialCells}
            readonly
          />
        )}
        <br />
        <br />
        <p className="step_header">
          <CheckCircleTwoTone twoToneColor="#52c41a" />
          User Details |<span>Details about the user</span>
        </p>
        {ticketById && ticketById?.status === "NO_RESPONSE" ? <></> : <>
          <Form autoComplete="off" form={form}>
            <div className="step_two_colum">
              <Form.Item className="step_input" name="name">
                <Input type="text" size="large" placeholder="User Name" />
              </Form.Item>

              <Form.Item className="step_input" name="contact">
                <Input type="text" size="large" placeholder="Contact No" />
              </Form.Item>
            </div>
            <div className="step_two_colum">
              <Form.Item className="step_input" name="email">
                <Input type="text" size="large" placeholder="Email" />
              </Form.Item>

              <Form.Item className="step_input" name="address">
                <Input type="text" size="large" placeholder="Address" />
              </Form.Item>
            </div>
          </Form>
        </>}
        {ticketById?.status === "COMPLETED" || ticketById?.status === "NO_RESPONSE" ? <></> : <div className="switch_line">
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            defaultChecked={switchStatus}
            onChange={(checked) => setSwichStatus(checked)}
          />
          <p>Contacted the customer</p>
        </div>}
        {switchStatus && (
          <div className="steps-action">
            <Button
              type="primary"
              className="primary__btn"
              onClick={() => closeDeal()}
            >
              Close Deal
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
