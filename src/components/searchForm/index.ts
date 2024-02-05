// 单程 往返程 多程
export enum EFlightType {
  OneWay = "OW",
  Round = "RT",
  Multi = "MT",
}

// 舱等类型
export enum ECabinType {
  Economy = "E",
  Business = "B",
}

// 乘客类型
export enum EPassengerType {
  adult = "ADT",
  child = "CHD",
  infant = "INF",
}

// 乘客
export type TPassenger = {
  name: string;
  count: number;
  flag: EPassengerType;
};

// 航程
export type TTripSearch = {
  depart: string | undefined | null;
  arrive: string | undefined | null;
  departTime: string | undefined | null;
};

// 航程查询
export type TFlightSearch = {
  flightType: EFlightType;
  cabinType: ECabinType;
  passenger: TPassenger[];
  tripSearch: TTripSearch[];
};
