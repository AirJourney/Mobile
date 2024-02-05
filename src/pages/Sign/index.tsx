import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Input ,Notify} from "@nutui/nutui-react";
import { login } from "@services/login";
import { forgetPassword as forgot } from "@services/forgetPassword";
import { register } from "@services/register";
import { useAppDispatch } from "@utils/hooks";
import { setUser } from "@state/user";
import "./index.less";

enum SignType {
  IN,
  UP,
}

const Sign = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [type, switchType] = useState<SignType>(SignType.IN);
  const [account, setAccount] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useAppDispatch();
  const toggleType = () => {
    switchType(type === SignType.IN ? SignType.UP : SignType.IN);
  };
  const signUpOrIn = async () => {
    if (type === SignType.IN) {
      if(!email){
        Notify.warn(t("Please enter Email or User Name"), { duration: 2000 });
        return;
      }
      if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email) ){
        Notify.warn(t("Please input the correct email format!"), { duration: 2000 });
        return;
      }
      if(!password){
        Notify.warn(t("Please input your password!"), { duration: 2000 });
        return;
      }
      // 登录
      try{
        const res = await login({
          email,
          password,
        });
        if (res.status && res.data) {
          dispatch(
            setUser({
              email: res.data.email,
              userName: res.data.userName,
              valid: res.data?.valid ?? false,
            }),
          );
          navigate(location.state?.goto || "/");
        } else {
          Notify.warn(res.msg, { duration: 2000 });
        }
      }catch(e: any){
        Notify.warn(e.response.data.msg, { duration: 2000 });
      }
    } else {
      // 注册
      if(!account){
        Notify.warn(t("Please input your user name!"), { duration: 2000 });
        return;
      }
      if(!email){
        Notify.warn(t("Please input your email!"), { duration: 2000 });
        return;
      }
      // 检查是否符合邮箱格式
      if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email) ){
        Notify.warn(t("Please input the correct email format!"), { duration: 2000 });
        return;
      }
      if(!password){
        Notify.warn(t("Please input your password!"), { duration: 2000 });
        return;
      }
      const res = await register({
        email,
        userName: account,
        password,
      });
      if (res.status) {
        Notify.text(res.msg, { duration: 2000 });
        setTimeout(() => {
          dispatch(setUser({ email, userName: account, valid: false }));
        }, 1000);
      } else {
        Notify.warn(res.msg, { duration: 2000 });
      }
    }
  };
  const forgetPassword = async () => {
    if (!email) {
      Notify.warn(t("Please enter Email or User Name")!, { duration: 2000 });
      return;
    }
    const res = await forgot(email);
    if (res.status) {
      Notify.text(res.msg, { duration: 2000 });
    }
  };
  return (
    <div className="sign-container">
      <div className="sign-title">
        {/* <Image className="logo-image" src="https://www.skywingtrip.com/static/image/home/logo2.png" /> */}
        <h1>{type === SignType.UP ? t("Register") : t("Sign In")}</h1>
      </div>
      <div className="sign-slogan">
        <span>{t("manageAndbenefits")}</span>
      </div>
      {type === SignType.IN && (
        <>
          <Input
            className="sign-input"
            name="value"
            type="span"
            // @ts-ignore
            style={{"--nutui-input-border-bottom-width": "1px"}}
            placeholder={t("Please enter Email or User Name")!}
            defaultValue={email}
            onChange={(v: string) => setEmail(v)}
            clearable
          />
          <Input
            className="sign-input"
            name="password"
            type="password"
            // @ts-ignore
            style={{"--nutui-input-border-bottom-width": "1px"}}
            placeholder={t("password")}
            defaultValue={password}
            onChange={(v: string) => setPassword(v)}
            clearable
          />
          <span className="forget-button" onClick={forgetPassword}>
            {t("Forgot Password")}
          </span>
        </>
      )}
      {type === SignType.UP && (
        <>
          <Input
            className="sign-input"
            name="account"
            type="text"
            // @ts-ignore
            style={{"--nutui-input-border-bottom-width": "1px"}}
            placeholder={t("Please input your user name!")!}
            defaultValue={account}
            onChange={(v: string) => setAccount(v)}
            clearable
          />
          <Input
            className="sign-input"
            name="email"
            type="text"
            // @ts-ignore
            style={{"--nutui-input-border-bottom-width": "1px"}}
            placeholder={t("Please input your email!")!}
            defaultValue={email}
            onChange={(v: string) => setEmail(v)}
            clearable
          />
          <Input
            className="sign-input"
            name="password"
            type="password"
            // @ts-ignore
            style={{"--nutui-input-border-bottom-width": "1px"}}
            placeholder={t("Please input your password!")!}
            defaultValue={password}
            onChange={(v: string) => setPassword(v)}
            clearable
          />
        </>
      )}

      <div className="sign-button">
        <Button className="sure-button" onClick={signUpOrIn}>
          {type === SignType.UP ? t("Register") : t("Sign In")}
        </Button>
        
      </div>
      <div className="sign-tips">
        <span className="sign-switch" onClick={toggleType}>
          {type === SignType.IN ? t("Regist Now") : t("Sign In")}&gt;
        </span>
      </div>
      {/* <span className="sign-statement">{t("loginStatement")}</span> */}
    </div>
  );
};

export default Sign;