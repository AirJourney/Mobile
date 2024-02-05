import request from "@utils/request";

export type IChangePassenger = {
  name: "Adult" | "Children" | "Infant";
  count: number;
  flag: "ADT" | "CHD" | "INF";
};
export const changePrice = async (data: {
  changePassenger: IChangePassenger[];
  priceId: string;
}) => {
  const response = await request<IChangePriceResponse>({
    url: "/website/changeprice",
    method: "POST",
    data,
  });
  return response.data;
};

export interface IChangePriceResponse {
  status: boolean;
  msg: string;
  content: IChangePriceContent;
}
export interface IChangePriceContent {
  _id: string;
  shoppingId: string;
  priceId: string;
  adultPrice: IPriceInfo;
  childPrice: IPriceInfo;
  infantPrice: IPriceInfo;
  avgPrice: string;
  totalPrice: string;
  ticketDeadlineType: number;
  __v: number;
}

export interface IPriceInfo {
  salePrice: string;
  tax: string;
}
