import { useQuery } from "@apollo/client";
import { message } from "antd";
import { useEffect, useState } from "react";
import Progress from "react-progress-2";
import { COMPANY_CATEGORIES } from "../GraphQL/Queries";

function useClientCategory() {
  const { loading, error, data } = useQuery(COMPANY_CATEGORIES, {
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
        setState(data.companyCategories);
        Progress.hide();
      }
    };
    getData();
    // eslint-disable-next-line
  }, [data]);

  return state;
}

export default useClientCategory;
