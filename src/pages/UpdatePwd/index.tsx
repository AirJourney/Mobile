import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Dialog, Form, Input ,Notify} from "@nutui/nutui-react";
import { resetpwd } from "@services/resetpwd";


const UpdatePwd = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search] = useSearchParams();

  async function reset(userInfo: any) {
    if (userInfo.reUserPassword !== userInfo.userPassword) {
      Notify.warn( t("The passwords entered twice are inconsistent"), { duration: 2000 });
      return;
    }
    try{
      const res = await resetpwd({
        userGuid: search.get("userid")||"",
        newPwd: userInfo.userPassword,
      });
      if (res.status) {
        Dialog.alert({
          title: t("Password Changed Successfully"),
          closeOnOverlayClick: false,
          hideCancelButton: true,
          onConfirm: () => {
            if(search.get("orderid")){
              navigate("/sign", {state: {goto: `/detailpage?orderid=${search.get("orderid")}`}});
              return;
            }
            navigate("/sign");
          },
        });
      }else{
        Dialog.alert({
          title: res.msg,
          closeOnOverlayClick: false,
          hideCancelButton: true,
        });
      }
    }catch(e: any){
      Dialog.alert({
        title: e.message,
        closeOnOverlayClick: false,
        hideCancelButton: true,
      });
    }
  }
  
  return (
    <div className="sign-container">
      <Form
        labelPosition="top"
        onFinish={reset}
        footer={
          <Button
            type="primary"
            nativeType="submit"
            style={{
              width: "100%",
            }}
          >
            {t("Sure")}
          </Button>
        }
      >

        <Form.Item
          label={t("New Password")}
          name="userPassword"
          rules={[
            { required: true, message: "" },
            {pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, message:  t("The password must consist of more than 8 English letters and numbers") },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t("Re enter the password")}
          name="reUserPassword"
          rules={[
            { required: true, message: "" },
            {
              pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
              message: t("The password must consist of more than 8 English letters and numbers"),
            }
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdatePwd;