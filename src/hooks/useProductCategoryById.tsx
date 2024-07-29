import { useQuery } from "@apollo/client";
import { message } from "antd";
import { useEffect, useState } from "react";
import Progress from "react-progress-2";
import { PRODUCT_CATEGORY } from "../GraphQL/Queries";

function useProductCategoryById(Id, isChanged) {
  const { loading, error, data } = useQuery(PRODUCT_CATEGORY, {
    variables: {
      id: Id,
      isChanged,
    },
    fetchPolicy: "no-cache",
  });
  const [state, setState] = useState<any>([]);

  useEffect(() => {
    const getData = () => {
      if (loading) {
        Progress.show();
      }
      if (error) {
        message.error(error.message);
      }
      if (data) {
        setState(data.productCategory);
        Progress.hide();
      }
    };
    getData();
    // eslint-disable-next-line
  }, [data, isChanged]);

  return state;
}

export default useProductCategoryById;
