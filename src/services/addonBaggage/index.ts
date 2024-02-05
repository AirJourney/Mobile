
import { ResponseCommon } from "../type";
import request from "@utils/request";

export const getAddonBaggage = async (data: IBaggageReuquest) => {
  const response = await request<ResponseCommon<IBaggageResponse[]>>({
    url: "/experimental/addonBaggage",
    method: "POST",
    data,
  });
  return response.data;
};

export interface IBaggageReuquest {
  skuType: string;
  depart: string;
  arrive: string;
  departTime: string;
  carrier: any;
  currency: string;
}

export interface IBaggageResponse {
  depart: string;
  arrive: string;
  carrier: string;
  baggageList: IBaggage[];
}

export interface IBaggage{
  weight: string;
  piece: number;
  price: string;
  currency: string;
}
