import {
  ECurrencyType,
  ELanguageType,
  EPassengerType,
} from "../src/constant/enum";

// 语言选项
export type TLanguageType = {
  type: ELanguageType;
  name: string;
};

// 公共参数
export type THeadType = {
  locale: ELanguageType; // 语言
  currency: ECurrencyType; // 货币
  clientTime: string; // 客户端时间
  sessionId: string;
  userid: string;
};

export interface IPassenger {
  passengerId: string;
  givenName: string;
  surName: string;
  nationality: string;
  birthDay: string;
  gender: string;
  cardType: string;
  cardNo: string;
  passportLimit: string;
  travelerType: EPassengerType;
}

export interface ICommonSetting {
  language: ELanguageType;
  currency: ECurrencyType;
  sessionId?: string;
  userid?: string;
}

export interface ICommonResponse<T> {
  content: T;
  status: boolean;
  msg: string;
}
