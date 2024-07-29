import { useQuery } from "@apollo/client";
import { message } from "antd";
import { useEffect, useState } from "react";
import { DASHBOARD } from "../GraphQL/Queries";
import Progress from "react-progress-2";

export default function useDashBoard(companyId) {
  const { loading, error, data } = useQuery(DASHBOARD, {
    variables: {
      page: 0,
      companyId: companyId ? companyId : "",
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
        setState(data);
        Progress.hide();
      }
    };
    getData();
    // eslint-disable-next-line
  }, [data]);

  return state;
}
