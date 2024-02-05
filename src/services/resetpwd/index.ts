import request from "@utils/request";

export const resetpwd = async (userInfo: {
  userGuid: string;
  newPwd: string;
}) => {
  const response = await request<any>({
    url: "/website/resetpwd",
    method: "POST",
    data: userInfo,
  });
  return response.data;
};
