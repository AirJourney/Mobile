import { useAppDispatch, useAppSelector } from "./redux";
import { changeCurrency, changeLanguage } from "../../state/commonSetting";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
/**
 * 初始化项目
 */
const useInit = () =>{
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const [language, setLanguage] = useState("cn");
  const [currency, setCurrency] = useState("CNY");
  const commonLanguage = useAppSelector((state) => state.commonSetting.language);
  const commonCurrency = useAppSelector((state) => state.commonSetting.currency);

  useEffect(() => {
    // 监听语言变化
    if (commonLanguage) {
      setLanguage(commonLanguage);
    }
    // 监听币种变化
    if (commonCurrency) {
      setCurrency(commonCurrency);
    }
  }, [commonLanguage, commonCurrency]);

  useEffect(() => {
    // 从本地获取已经保存的数据并初始化到页面上
    const localHeadData = localStorage.getItem("llt-headData");
    const defaultConfig = JSON.parse(localHeadData || "{}") ;

    const specifiedLanguage = searchParams.get("language");
    let specifiedCurrency = searchParams.get("currency");
    const sku = searchParams.get("sku");
    const skuData = new URLSearchParams(atob(sku || ""));
    if(!specifiedCurrency && skuData.size>0){
      specifiedCurrency =  skuData.get("currency");
    }
    // 初始化语言
    if(specifiedLanguage || defaultConfig.language) {
      const l = specifiedLanguage ?? defaultConfig.language;
      dispatch(changeLanguage(l));
    }
    // 初始化币种
    if(specifiedCurrency || defaultConfig.currency) {
      const c = specifiedCurrency ?? defaultConfig.currency;
      dispatch(changeCurrency(c));
    }
  },[searchParams]);
  return {
    language,
    currency,
  };
};

export default useInit;