import { ResponseCommon } from "../type";
import { IChangePassenger } from "../changeprice";
import { IPenaltyInfo, IPolicyDetail } from "../shoppingdetail";
import request from "@utils/request";

export const check = async (data: ICheckRequest) => {
  const response = await request<ResponseCommon<ICheckResponse>>({
    url: "/website/check",
    method: "POST",
    data,
  });
  return response.data;
};

export interface ICheckRequest {
  redisSchema: string;
  redisCode: string;
  currency: string;
  shoppingId: string;
  priceId: string;
  passengerList: IChangePassenger[];
  group: string;
  IPCC: string;
}

export interface ICheckResponse {
  penalty: IPenaltyInfo[];
  priceInfo: IPolicyDetail & {
    adultPrice: string;
    childPrice: string;
    infantPrice: string;
  };
  verifyResult: number;
  redisSchema: string;
}
