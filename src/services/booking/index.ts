import type { IBaggage } from "@services/addonBaggage";
import type { ICommonResponse } from "../../../types/type";
import request from "@utils/request";

export const booking = async (data: ICreateOrderRequestType) => {
  const response = await request<
    ICommonResponse<ICreateOrderResponseType>
  >({
    url: "/experimental/booking",
    method: "POST",
    data,
  });
  return response.data;
};

// 下单 (createOrder)
export interface ICreateOrderRequestType {
  /**
   * 联系人信息
   */
  contactInfo?: {
    /**
     * 全名
     */
    contactName: string | null;
    /**
     * 邮箱
     */
    email: string | null;
    /**
     * 电话地区编号
     */
    phoneArea: string | null;
    /**
     * 联系电话
     */
    contactTel: string | null;
    /**
     * 手机号码
     */
    mobilePhone: string | null;
  };
  /**
   * 乘机人信息
   */
  flightPassengerList: {
    /**
     * 乘机人ID
     */
    passengerId?: string | null;
    /**
     * 乘机人名
     */
    givenName: string | null;
    /**
     * 乘机人姓
     */
    surName: string | null;
    /**
     * 生日
     */
    birthDay: string | null;
    /**
     * 证件号
     */
    cardNo?: string | null;
    /**
     * 乘客类型 ADT/CHD/INF
     */
    travelerType: string | null;
    /**
     * 证件类型ID
     */
    cardType?: string | null;
    /**
     * 性别
     */
    gender: string | null;
    /**
     * 国家编号
     */
    nationality: string | null;
    /**
     * 证件有效期
     */
    passportLimit?: string | null;
  }[];
  shoppingId: string | null;
  mktportal: string | null;
  remark: string | null;
  locale: string | null;
  language: string | null;
  channel: string;
  revenueId: string | null;
  profitId: string | null;
  IPCC: string | null;
  group: string | null;
  skuType: string | null;
  baggageInfo?: IBaggage;
}

// 下单后返回参数(createOrder)
export interface ICreateOrderResponseType {
  /**
   * 订单基本信息
   */
  orderInfo: {
    orderId: string;
  };
  /**
   * 新支付流程下发支付信息节点
   */
  payInfo: {
    payToken?: string | null;
    /**
     * 支付时限 单位秒
     */
    payExpiryTime?: number | null;
  };
}
