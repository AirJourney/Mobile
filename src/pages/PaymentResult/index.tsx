import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { setUser } from "@state/user";
import { useAppDispatch } from "@utils/hooks";
import { Button } from "@nutui/nutui-react";
import "./index.less";

export function PaymentSuccess() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [userId, setUserId] = useState("");
  const [pageStatus, setPageStatus] = useState(1); // 1成功0失败
  const [pageMessage, setPageMessage] = useState(""); // 1成功0失败

  // 初次渲染
  useEffect(() => {
    if (location.pathname.indexOf("fail") >= 0) {
      setPageStatus(0);
    }
    if (location.search) {
      if (searchParams) {
        setPageMessage(decodeURIComponent(searchParams.get("res") || ""));
        setUserId(searchParams.get("userId") || "");
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      dispatch(
        setUser({
          email: userId,
          userName: userId,
          valid: false,
        }),
      );
    }
  }, [userId]);

  return (
    <div className="success-page-wrappr">
      {pageStatus ? (
        <div className="success-page">
          <div>{t("Payment succeeded!")}</div>
          {pageMessage + t(", Server takes 30-60 minutes, please wait.")}
          <Button
            className="success-page-btn"
            type="primary"
            onClick={() => {
              navigate("/detaillist");
            }}
          >
            {t("Go My Orders")}
          </Button>
        </div>
      ) : (
        <div className="success-page">
          <div>{t("Payment failed!")}</div>
          {pageMessage}
        </div>
      )}
    </div>
  );
}

export default PaymentSuccess;
