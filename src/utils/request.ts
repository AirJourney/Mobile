import axios from "axios";
import moment from "moment";
import cookie from "react-cookies";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 15000,
});

instance.interceptors.request.use(
  (config: any) => {
    // Do something before request is sent
    // 从cookie获取userInfo
    const userInfo =  cookie.load("userInfo") || {};
    // 从localStorage获取currency与language
    let headData = {
      currency: "HKD",
      language: "tc",
    };
    try{
      headData = JSON.parse(localStorage.getItem("llt-headData")||"{currency: 'HKD',language: 'tc'}");
    }catch(e){
      //
    }
    return {
      ...config,
      headers: {
        // userId: "123456",
        Userid: userInfo.email,
        clienttime: moment().format(),
        currency: headData.currency,
        language: headData.language,
      }
    };
  }
);

export default instance;