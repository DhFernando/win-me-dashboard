import { useQuery } from "@apollo/client";
import { message } from "antd";
import { useEffect, useState } from "react";
import Progress from "react-progress-2";
import { ALL_PROMOTIONS } from "../GraphQL/Queries";

function useAllPromotionsList(filterData) {
  const { loading, error, data } = useQuery(ALL_PROMOTIONS, {
    variables: {
      page: filterData.page === 0 ? filterData.page : filterData.page - 1,
      pageSize: filterData.pageSize,
      order: filterData.order,
      sortBy: filterData.sortBy,
      featured: filterData.featured,
      active: filterData.active,
      companyId: filterData.companyId,
      promotionCategoryId: filterData.promotionCategoryId,
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
        setState(data.allPromotions);
        Progress.hide();
      }
    };
    getData();
    // eslint-disable-next-line
  }, [data]);

  return state;
}

export default useAllPromotionsList;
