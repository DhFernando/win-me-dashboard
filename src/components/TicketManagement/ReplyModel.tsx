import { Modal, Typography } from "antd";
import React from "react";
import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import CountDownTimer from "../../util/CountDownTimer";
import useTicketById from "../../hooks/useTicketById";
import moment from "moment";
import ProductForm from "./ProductForm";
import { Box } from "@mui/material";

const { Title } = Typography;

export default function ReplyModel({
  visible,
  setVisible,
  ticketId,
  handleProductSubmit,
  submittedStatus,
}) {
  const ticketById = useTicketById(ticketId);

  const findReplyData = (productId) => {
    const reply = ticketById?.replies.find(
      (reply) => reply.product.id === productId
    );
    return reply ? JSON.parse(reply.replyData) : {};
  };

  const isSubmitted = (productId) => {
    return submittedStatus && submittedStatus[productId];
  };

  return (
    <Modal
      title={`Reply to ${
        ticketById ? ticketById.referenceId : ""
      }`}
      centered
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      width={700}
    >
      <div className="model_body">
        {ticketById && (
          <CountDownTimer
            targetDate={moment(
              ticketById.productRequest.maxCompanyResponseTimeExpiresAt
            )}
          />
        )}

        {ticketById?.requestedProducts?.map((requested_product, index) => {
          const initialData = findReplyData(requested_product.id);
          const isProductSubmitted = isSubmitted(requested_product.id);

          const schema = JSON.parse(
            ticketById.productCategory.productRequestForm.responseFormSchema
          );
          const fieldNames = Object.keys(schema.properties);

          const responseFields = JSON.parse(
            ticketById.productCategory.productRequestForm.responseFields
          );
          console.log("responseFields", responseFields);

          return (
            <div key={requested_product.id || index}>
              <Title level={5}>{requested_product.name}</Title>

              {ticketById.productCategory && (
                <JsonForms
                  schema={JSON.parse(
                    ticketById.productCategory.productRequestForm
                      .requestFormSchema
                  )}
                  uischema={
                    ticketById.productCategory.productRequestForm
                      .requestFormUiSchema
                      ? JSON.parse(
                          ticketById.productCategory.productRequestForm
                            .requestFormUiSchema
                        )
                      : undefined
                  }
                  data={JSON.parse(ticketById.productRequest.requestData)}
                  renderers={materialRenderers}
                  cells={materialCells}
                  readonly
                />
              )}

              {Object.entries(JSON.parse(ticketById.productRequest.requestData)).map(([key, value]) => {
                const matchingProperty = JSON.parse(ticketById.productCategory.productRequestForm.requestFormSchema).properties[key];
                if(matchingProperty && matchingProperty.format && matchingProperty.format === 'date') {
                  return (
                    <Box key={key} sx={{ color: 'gray' }}>
                      <strong>{key}:</strong> {JSON.stringify(value)}
                    </Box>
                  );
                }
              })}

              <br />
              <br />

              <p className="step_header">
                Add Your Response | <span>Details about the request</span>
              </p>

              <ProductForm
                fieldNames={fieldNames}
                handleProductSubmit={handleProductSubmit}
                index={index}
                initialData={initialData}
                isProductSubmitted={isProductSubmitted}
                requested_product={requested_product}
                responseFields={responseFields}
                ticketId={ticketId}
              />
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
