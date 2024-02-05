import request from "@utils/request";
import { IShoppingInfo } from "../shoppingdetail";

export enum OrderListTag {
  ALL = "all",
  PAYMENT = "payment",
  PROCESSING = "processing",
  DONE = "done",
}
export const getOrderList = async (tag: OrderListTag) => {
  const response = await request<IDetailListResponse>({
    url: "/website/orderlist",
    method: "POST",
    data: { tag },
  });
  return response.data;
};

export interface IDetailListResponse {
  status: boolean;
  msg: string;
  content: IDetailListItem[];
}
export interface IDetailListItem {
  _id: string;
  __v: number;
  userId: string;
  contactId: string;
  passengerIdList: string;
  shoppingId: string;
  refundId: string;
  landingPageType: string;
  ticketNumber: string;
  campaign: string;
  changeId: string;
  channel: string;
  clientTime: string;
  companyNumber: string;
  currency: string;
  locale: string;
  mktportal: string | null;
  orderId: string;
  pnr: string;
  shoppingInfo: IShoppingInfo;
  status: number;
}
