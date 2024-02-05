import request from "@utils/request";

export const forgetPassword = async (email: string) => {
  const response = await request<IForgetPasswordResponse>({
    url: "/website/forgot",
    method: "POST",
    data: { email },
  });
  return response.data;
};

export interface IForgetPasswordResponse {
  status: boolean;
  msg: string;
  content: IForgetPasswordContent;
}

export interface IForgetPasswordContent {
  email: string;
  userName: string;
}
