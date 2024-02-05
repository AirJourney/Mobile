import { TTripSearch } from "@components/searchForm";
import request from "@utils/request";

export const refreshCache = async (data: {tripSearch:TTripSearch[],IPCC:string}) => {
  const response = await request({
    url: "/website/refreshcache",
    method: "POST",
    data,
  });
  return response.data;
};
