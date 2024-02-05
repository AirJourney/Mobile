import { useState } from "react";

type CacheParams = any;

/**
 * 对页面的数据进行缓存（sessionStorage）
 */
const useCache = (params: CacheParams, key: string) => {
  const [cacheData, setCacheData] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem(`cacheData.${key}`) || params);
    } catch (e) {
      return sessionStorage.getItem(`cacheData.${key}`) || params;
    }
  });

  const cacheMethod = (data: any) => {
    setCacheData(data);
    if (typeof data === "object") {
      sessionStorage.setItem(`cacheData.${key}`, JSON.stringify(data));
    } else {
      sessionStorage.setItem(`cacheData.${key}`, data);
    }
  };

  return [cacheData, cacheMethod];
};

export default useCache;
