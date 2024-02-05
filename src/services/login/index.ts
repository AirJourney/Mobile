import request from "@utils/request";

export const login = async (data: { email: string; password: string }) => {
  const response = await request<ILoginResponse>({
    url: "/website/login",
    method: "POST",
    data,
  });
  return response.data;
};

export interface ILoginResponse {
  status: boolean;
  msg: string;
  data: IUserData;
}

export interface IUserData {
  email: string;
  userName: string;
  valid?: boolean;
}
