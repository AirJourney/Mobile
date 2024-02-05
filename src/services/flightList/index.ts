import request from "@utils/request";

export const getFlights = async (data: any) => {
  const response = await request<any>({
    url: "/experimental/getFlights",
    method: "POST",
    data,
  });
  return response.data;
};


