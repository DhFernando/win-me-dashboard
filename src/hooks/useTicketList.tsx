import { useQuery } from "@apollo/client";
import { message } from "antd";
import { TICKETS } from "GraphQL/Queries";
import { useEffect, useState } from "react";
import Progress from "react-progress-2"; 
import { ITicketsWithCount } from "types";

function useTicketList(filterData) {
  const { loading, error, data } = useQuery(TICKETS, {
    variables: {
      page: filterData.page === 0 ? filterData.page : filterData.page - 1,
      pageSize: filterData.pageSize,
      order: filterData.order,
      sortBy: filterData.sortBy,
      productCategoryId: filterData.productCategoryId,
      productRequestId: filterData.productRequestId,
      companyId: filterData.companyId,
      status: filterData.status,
      fromDate: filterData.fromDate,
      toDate: filterData.toDate,
    },
  });
  const [state, setState] = useState<ITicketsWithCount>();

  useEffect(() => {
    const getData = () => {
      if (loading) {
        Progress.show();
      }
      if (error) {
        message.error(error.message);
      }
      if (data) {
        setState(data.tickets);
        Progress.hide();
      }
    };
    getData();
    // eslint-disable-next-line
  }, [data]);

  return state;
}

export default useTicketList;
