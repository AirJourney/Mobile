import request from "@utils/request";

const store:any = {};
export const fetchData = async (shoppingId: string) => {
	if (store[shoppingId]) {
		return store[shoppingId] as IBookPageResponse;
	}
	const response = await request<IBookPageResponse>({
		url: "/website/shoppingdetail",
		method: "POST",
		data: { shoppingId },
	});
	if (response.status === 200) {
		store[shoppingId] = response.data;
	}
	return response.data;
};

interface ICityInfo {
  code: string;
  name: string;
}

interface IPortInfo {
  code: string;
  name: string;
  terminal: string;
}

interface IDurationInfo {
  hour: string;
  min: string;
}

interface IPriceInfo {
  salePrice: string;
  tax: string;
}

// export interface IShoppingInfo {
//   redisCode: string;
//   redisSchema: string;
//   deepLink: string;
//   sessionId: string;
//   shoppingId: string;
//   currencyRate: string;
//   currency: string;
//   policyInfo: IPolicyInfo;
//   /**
//    * 多个行程
//    */
//   flightGroupInfoList: IFlightGroupInfo[];
//   policyDetailInfo: IPolicyDetail;
// }

export interface IShoppingInfo {
  redisCode: string;
  redisSchema: string;
  shoppingId: string;
  currencyRate: string;
  currency: string;
  policyInfo: IPolicyInfo;
  /**
   * 多个行程
   */
  flightGroupInfoList: IFlightGroupInfo[];
  policyDetailInfo: IPolicyDetail;
  group: string;
  IPCC: string;
}

export interface IBookPageResponse {
  status: boolean;
  msg: string;
  content: IShoppingInfo;
}

interface IFormattedDetail {
  description: string;
  weightAndPieceDesc: string;
  weight: number;
  piece: number;
}

interface IFormatted {
  sequenceNote?: any;
  adultDetail: IFormattedDetail | null;
  childDetail: IFormattedDetail | null;
  infantDetail: IFormattedDetail | null;
}

export interface IBaggageInfo {
  checkedNote: string;
  checkedFormatted: IFormatted;
  handNote: string;
  handFormatted: IFormatted;
}

export interface ICancelChangeFormatted {
  specialText: string;
  timeText: string;
  specialType: number;
}

export interface ICancelChangeInfo {
  note: string;
  originText: {
    adult: boolean;
    child: boolean;
    infant: boolean;
  };
  notAllowed: boolean;
  firstTimeChangeFreeNote?: any;
  formatted: {
    adultList: ICancelChangeFormatted[];
    childList: ICancelChangeFormatted[];
    infantList: ICancelChangeFormatted[];
    concurrentDescription: string;
  };
}

export interface IPenaltyInfo {
  cancelInfo: ICancelChangeInfo;
  changeInfo: ICancelChangeInfo;
  endorsementNote: string;
  specialNote: string;
  flagInfoList: [];
  noShowCondition: string;
  partialUseChangeInfo?: any;
  isNoShow: boolean;
  noShow: string;
  penaltyInfo: IPenaltyDetail;
}

interface IPenaltyDetail {
  penaltyType: string;
  refundBeforePercent: number;
  refundAfterPercent: number;
  changeBeforePercent: number;
  changeAfterPercent: number;
  abandonRTPercent: any;
}

export interface IPolicyInfo {
  baggageInfoList: IBaggageInfo[];
  penaltyInfoList: IPenaltyInfo[];
}
export interface IFlightGroupInfo {
  flightId: string;
  arriveMultCityName: string;
  departMultCityName: string;
  arriveDateTimeFormat: string;
  departDateTimeFormat: string;
  duration: {
    h: string;
    m: string;
  };
  /**
   * 多个航段
   */
  flightSegments: ISegmentInfo[];
}

export interface ISegmentInfo {
  fareBasisCode: string;
  IPCC: string;
  segmentId: string;
  aDateTime: string;
  dDateTime: string;
  dCityInfo: ICityInfo;
  aCityInfo: ICityInfo;
  dPortInfo: IPortInfo;
  aPortInfo: IPortInfo;
  acrossDays: number;
  airlineInfo: {
    code: string;
    name: string;
    isLCC: boolean;
  };
  craftInfo: {
    name: string;
    minSeats?: any;
    maxSeats?: any;
    widthLevel: string;
    craftType: string;
  };
  cabinClass: string;
  subClass: string;
  durationInfo: IDurationInfo;
  transferDurationInfo: IDurationInfo | null | string;
  flightNo: string;
  segmentNo: number;
  stopInfoList: any[];
}

export interface IPolicyDetail {
  priceId: string;
  adultPrice: IPriceInfo;
  childPrice: IPriceInfo;
  infantPrice: IPriceInfo;
  avgPrice: string;
  totalPrice: string;
  ticketDeadlineType: number;
}
