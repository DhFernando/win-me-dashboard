import { Button } from "antd";
import React, { useState } from "react";
import SubCategoryDataTable from "./SubCategoryDataTable";
import NewCategoryModel from "./NewCategoryModel";

function AddSubCategory(props) {
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <div className="dashboard">
      <div className="section_row">
        <div className="top_row">
          <Button
            type="primary"
            className="primary__btn"
            onClick={() => setVisible(true)}
          >
            Add Sub Category
          </Button>
          <NewCategoryModel
            visible={visible}
            setVisible={() => {
              setVisible(!visible);
            }}
            type="Sub"
            id={props.match.params.id}
          />
        </div>
        <SubCategoryDataTable {...props} />
      </div>
    </div>
  );
}

export default AddSubCategory;
