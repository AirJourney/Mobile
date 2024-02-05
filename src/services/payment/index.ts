import request from "@utils/request";


export const allpayxCreateOrder = async (orderId: string) => {
  const response = await request({
    url: "/website/payment/allpayx/create",
    method: "POST",
    data: {
      orderId,
    },
  });
  return response.data;
};

export const huipayCreateOrder = async (orderId: string) => {
  const response = await request({
    url: "/website/payment/huipay/create",
    method: "POST",
    data: {
      orderId,
    },
  });
  return response.data;
};

export const checkOrderStatus = async (orderId: string) => {
  const response = await request({
    url: "/website/payment/order_status_check",
    method: "POST",
    data: {
      orderId,
    },
  });
  return response.data;
};
