import { ResponseCommon } from "../type";
import { IShoppingInfo } from "../shoppingdetail";
import request from "@utils/request";

export const generateShopping = async (data: IGenerateShoppingRequest) => {
  const response = await request<ResponseCommon<IShoppingInfo>>({
    url: "/website/generateshopping",
    method: "POST",
    data,
  });
  return response.data;
};

export interface IGenerateShoppingRequest {
  campaign: string | null;
  deepLinkTokenId: string | null;
  locale: string | null;
  mktportal?: string | null;
  currency: string | null;
  tripType: string | null;
  redisCode: string | null;
  segmentSchema: string | null;
  departTime: string | null;
  returnTime: string | null;
  adult: string | null;
  children: string | null;
  infant: string | null;
  cabinType: string | null;
  depart: string | null;
  arrive: string | null;
}
