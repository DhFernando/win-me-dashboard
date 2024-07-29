import { Modal } from "antd";
import React, { useEffect } from "react";
import { Steps } from "antd";
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { StepThree } from "./StepThree";
import { StepFour } from "./StepFour";
import { useCompanyAdmin, useImagesStore, useStore } from "../../store";

const { Step } = Steps;

function NewClientModel({ visible, setVisible }) {
  const [current, setCurrent] = React.useState<any>(0);

  const setClientData = useStore((state) => state.setClientData);
  const setCompanyAdmin = useCompanyAdmin((state) => state.setCompanyAdmin);
  const setImagesStore = useImagesStore((state) => state.setImagesStore);

  useEffect(() => {
    return function cleanup() {
      setClientData({});
      setCompanyAdmin({});
      setImagesStore({
        logoUrl: "",
        bannerUrl: "",
      });
    };
    // eslint-disable-next-line
  }, [visible]);
  
  const steps = [
    {
      title: "",
      content: (
        <StepOne
          setNextStep={() => {
            setCurrent(current + 1);
          }}
          type={"new"}
        />
      ),
    },
    {
      title: "",
      content: (
        <StepTwo
          setNextStep={() => {
            setCurrent(current + 1);
          }}
          setBackStep={() => {
            setCurrent(current - 1);
          }}
          type={"new"}
        />
      ),
    },
    {
      title: "",
      content: (
        <StepThree
          setNextStep={() => {
            setCurrent(current + 1);
          }}
          setBackStep={() => {
            setCurrent(current - 1);
          }}
          type={"new"}
        />
      ),
    },
    {
      title: "",
      content: (
        <StepFour
          setNextStep={() => {
            setCurrent(0);
            setVisible(false);
          }}
        />
      ),
    },
  ];

  return (
    <Modal
      title="Add new client"
      centered
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      width={700}
    >
      <div className="step_model_body">
        <Steps current={current} size="small">
          {steps.map((item, index) => (
            <Step key={index} title={item.title} />
          ))}
        </Steps>
      </div>
      <div className="steps-content">{steps[current].content}</div>
    </Modal>
  );
}

export default NewClientModel;
