import { IChangePriceResponse } from ".";

export default {
  status: true,
  msg: "Price Changed",
  content: {
    _id: "645a358f36259525d178d188",
    shoppingId: "e67a804363864258ade66811b6eb4d38",
    priceId: "29af62f7c465497891d7d60235d153c5",
    adultPrice: {
      salePrice: "1731",
      tax: "815",
    },
    childPrice: {
      salePrice: "1709",
      tax: "499",
    },
    infantPrice: {
      salePrice: "1709",
      tax: "589",
    },
    avgPrice: "2361",
    totalPrice: "11806",
    ticketDeadlineType: 1,
    __v: 0,
  },
} as IChangePriceResponse;
