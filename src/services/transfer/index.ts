import request from "@utils/request";

export const transfer = async (data: string) => {
  const response = await request({
    url: "/website/transfer",
    method: "POST",
    data: { queryStr: data },
  });
  return response.data;
};
