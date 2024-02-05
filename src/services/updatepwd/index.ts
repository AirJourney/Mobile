import request from "@utils/request";

export const updatepwd = async (userInfo: any) => {
  const response = await request<IForgetPasswordResponse>({
    url: "/website/updatepwd",
    method: "POST",
    data: { 
      email: userInfo.email,
      newpwd: userInfo.userPassword,
      oldPwd: userInfo.userPassword,
    },
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
