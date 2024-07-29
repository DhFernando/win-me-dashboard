import { Button } from "antd";
import React from "react";
import image from "../../assets/images/success_img.png";
import { useRefreshDataTables } from "../../store";

export const StepFour = (props) => {
  const setRefreshDataTables = useRefreshDataTables((state) => state.setRefreshDataTables);
  const refreshDataTables = useRefreshDataTables((state) => state.refreshDataTables);

  const next = () => {
    setRefreshDataTables(!refreshDataTables);
    props.setNextStep();
  };

  return (
    <div className="step_container">
      <div className="step_last">
        <img src={image} className='step_last_img' alt="step3_image" />
        <p>Success</p>
      </div>
      <div className="steps-action">
        <Button type="primary" onClick={() => next()}>
          Complete
        </Button>
      </div>
    </div>
  );
};
