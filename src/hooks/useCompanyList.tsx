import { useQuery } from "@apollo/client";
import { message } from "antd";
import { useEffect, useState } from "react";
import Progress from "react-progress-2";
import { COMPANIES } from "../GraphQL/Queries";

function useCompanyList(filterData) {
  const { loading, error, data } = useQuery(COMPANIES, {
    variables: {
      page: filterData.page === 0 ? filterData.page : filterData.page - 1,
      pageSize: filterData.pageSize,
      order: filterData.order,
      sortBy: filterData.sortBy,
      query: filterData.query,
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
        setState(data.companies);
        Progress.hide();
      }
    };
    getData();
    // eslint-disable-next-line
  }, [data]);

  return state;
}

export default useCompanyList;
