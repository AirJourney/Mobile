export type ResponseCommon<T> = {
  sessionid: string;
  status: boolean;
  msg: string;
  content: T;
};
