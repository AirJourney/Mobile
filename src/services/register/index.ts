import request from "@utils/request";

export const register = async (data: IRegisterParams) => {
  const response = await request<IRegisterResponse>({
    url: "/website/register",
    method: "POST",
    data: {
      userName: data.userName,
      email: data.email,
      password: data.password,
      birthday: "",
      phone: "",
      displayName: data.userName,
    },
  });
  return response.data;
};

export interface IRegisterParams {
  userName: string;
  email: string;
  password: string;
}

export interface IRegisterResponse {
  status: boolean;
  msg: string;
}
