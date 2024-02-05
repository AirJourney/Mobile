
import type { IPassenger } from "../../../types/type";
import type { IShoppingInfo } from "../shoppingdetail";
import request from "@utils/request";

export const getOrderDetail = async (orderId: string) => {
  const response = await request<IDetailDetailResponse>({
    url: "/website/orderdetail",
    method: "POST",
    data: { orderId },
  });
  return response.data;
};

export interface IDetailDetailResponse {
  status: boolean;
  msg: string;
  content: IOrderDetail;
}
export interface IContactInfo {
  _id: string;
  __v: number;
  contactName: string;
  email: string;
  phoneArea: string;
  mobilePhone: string;
  contactId: string;
}

export interface IFlightPassengerList extends Omit<IPassenger, "cardType"> {
  _id: string;
  __v: number;
  cardType: string;
}
export interface IOrderDetail {
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
  contactInfo: IContactInfo[];
  flightPassengerList: IFlightPassengerList[];
}
