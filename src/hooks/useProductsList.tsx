import { useQuery } from "@apollo/client";
import { message } from "antd";
import { useEffect, useState } from "react";
import Progress from "react-progress-2";
import { PRODUCTS } from "../GraphQL/Queries";

function useProductsList(filterData, isChanged) {
  const { loading, error, data } = useQuery(PRODUCTS, {
    variables: {
      page: filterData.page === 0 ? filterData.page : filterData.page - 1,
      pageSize: filterData.pageSize,
      order: filterData.order,
      sortBy: filterData.sortBy,
      companyId: filterData.companyId,
      productCategoryId: filterData.productCategoryId,
      query: filterData.query,
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
        setState(data.products);
        Progress.hide();
      }
    };
    getData();
    // eslint-disable-next-line
  }, [data, isChanged]);

  return state;
}

export default useProductsList;
