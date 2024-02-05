import type { PolicyDetailInfo, PolicyInfo } from "@constant/Interface";
import type { IChangePassenger } from "../changeprice";
import type { ResponseCommon } from "../type";
import request from "@utils/request";

export interface IChangeCurrencyRequest {
  changePassenger: IChangePassenger[];
  priceId: string;
  shoppingId: string;
  currency: string;
}
export const changeCurrency = async (data: IChangeCurrencyRequest) => {
  const response = await request<ResponseCommon<IChangeCurrencyContent>>({
    url: "/website/changecurrency",
    method: "POST",
    data,
  });
  return response.data;
};

export interface IChangeCurrencyContent {
  penaltyInfoList: PolicyDetailInfo;
  priceInfo: PolicyInfo;
}
