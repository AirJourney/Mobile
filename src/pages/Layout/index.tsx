import { Routes, Route, Link } from "react-router-dom";
import Router from "@router";

import "./index.less";
import Menu from "./Menu";
import Landing from "../Landing";

const Layout = () => {
  return (
    <div className="index">
      <div className="header">
        <Link className="header-home" to="/">
          <p>LOGO</p>
          {/* <Image className="logo-image" src="https://www.skywingtrip.com/static/image/home/logo2.png" /> */}
        </Link>
        <Menu />
      </div>
      <Routes>
        <Route path="/transferad" element={<Landing />} />
        <Route path="*" element={<Router />} />
      </Routes>
    </div>
  );
};

export default Layout;