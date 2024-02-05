import { Routes, Route } from "react-router-dom";
import CityPicker from "@pages/CityPicker";
import Sign from "@pages/Sign";
import Layout from "@pages/Layout";
import "./app.less";
import useInit from "./utils/hooks/useInit";
import Landing from "@pages/Landing";
import { ConfigProvider } from "@nutui/nutui-react";
import en from "@nutui/nutui-react/dist/locales/en-US";
import tc from "@nutui/nutui-react/dist/locales/zh-TW";
import cn from "@nutui/nutui-react/dist/locales/zh-CN";
import type { BaseLang } from "@nutui/nutui-react/dist/locales/base";

const languageMap: Record<string,BaseLang> = {
  en,
  tc,
  cn,
};

const App = () => {
  const {language} = useInit();
  return (
    <ConfigProvider locale={languageMap[language]}>
      <Routes>
        <Route path="/citypicker" element={<CityPicker />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/transferad" element={<Landing />} />
        <Route path="*" element={<Layout />} />
      </Routes>
    </ConfigProvider>
    
  );
};

export default App;

