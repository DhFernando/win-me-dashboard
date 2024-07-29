import { useQuery } from "@apollo/client";
import { message } from "antd";
import { useEffect, useState } from "react";
import Progress from "react-progress-2";
import { PRODUCT } from "../GraphQL/Queries";

function useProductById(Id) {
  const { loading, error, data } = useQuery(PRODUCT, {
    variables: {
      id: Id,
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
        setState(data.product);
        Progress.hide();
      }
    };
    getData();
    // eslint-disable-next-line
  }, [data]);

  return state;
}

export default useProductById;
