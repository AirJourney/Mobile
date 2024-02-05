import { useEffect } from "react";
import cookie from "react-cookies";
const useAuth = () => {
  useEffect(() => {
    const userInfo =  cookie.load("userInfo") || {};
    if(!userInfo.email){
      window.location.href = "/sign";
    }
  },[]);
};

export default useAuth;