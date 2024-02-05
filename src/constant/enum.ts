// 语言类型
export enum ELanguageType {
  English = "en",
  Chinese = "cn",
  TChinese = "tc",
}

// 货币类型
export enum ECurrencyType {
  HKD = "HKD",
  CNY = "CNY",
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  JPY = "JPY",
  KRW = "KRW",
  AUD = "AUD",
  CAD = "CAD",
  SGD = "SGD",
  MYR = "MYR",
  THB = "THB",
  RUB = "RUB",
  INR = "INR",
  PHP = "PHP",
  IDR = "IDR",
  TWD = "TWD",
  AED = "AED",
  NZD = "NZD",
}

// 货币符号
export enum ECurrencySymbolType {
  HKD = "HK$",
  USD = "$",
  CNY = "CNY",
  EUR = "€",
}

export enum EMessageType {
  /**
   * 系统消息
   */
  SYSTEM = "system",
  /**
   * 客服发送
   */
  FROM = "from",
  /**
   * 客户发送
   */
  TO = "to",
}

// 航程类型
export enum EFlightType {
  ONEWAY = "ONEWAY",
  ROUNDTRIP = "ROUNDTRIP",
  MULTITRIP = "MULTITRIP",
}

// momoent格式化类型
export enum EmomentFormatType {
  Default = "YYYY-MM-DD",
  TIME = "HH:mm",
  CLOCK = "HH:mm:ss",
  RECOMMEND = "MMMM Do, dddd",
  FULLTIME = "YYYY-MM-DD HH:mm",
  NORMAL = "MMMMDo HH:mm",
  DEPART = "MMMM Do, dddd HH:mm",
  DEPART_S = "MMMM D, ddd HH:mm",
}

export enum SortType {
  PRICE = "P",
  DEPART = "D",
  ARRIVE = "A",
  DURATION = "U",
}

export enum SortOrder {
  ASC = "ASC",
  DES = "DES",
}

// 乘客类型
export enum EPassengerType {
  adult = "ADT",
  child = "CHD",
  infant = "INF",
}

export enum FilterType {
  DEPART_TIME,
  ARRIVE_TIME,
  AIRPORT_DEPART,
  AIRPORT_ARRIVE,
  AIRLINE,
  STOPS,
}

export enum StopsType {
  ANY,
  NON_STOP,
  ONE_STOP,
  MULTI_STOP,
}

export enum TimeType {
  DAWN,
  MORNING,
  AFTERNOON,
  NIGHT,
}
