import {
  Button,
  Cell,
  Form,
  Input,
  Picker,
  Radio,
} from "@nutui/nutui-react";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector, useRegionSelect } from "@utils/hooks";
import { useTranslation } from "react-i18next";
import { updatePassenger } from "@state/passenger";
import { Right } from "@nutui/icons-react";
import { IPassenger } from "../../../types/type";
import DatePicker from "@components/DatePicker";

import "./index.less";
import moment from "moment";

interface PassengerDataType
  extends Omit<IPassenger, "cardType" | "travelerType"> {
  cardType?: number[];
}

const store = { current: null } as { current: PassengerDataType | null };

const PassengerEdit = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [search] = useSearchParams();
  const dispatchRedux = useAppDispatch();
  const certList = useMemo(() => [{ value: "Passport", text: t("Passport") }], [t]);
  const passenger = useAppSelector((state) =>
    state.passenger.list.find((v) => v.passengerId === search.get("id")!),
  );
  const [region, showRegionSelect] = useRegionSelect();

  useEffect(() => {
    if (store.current) {
      form.setFieldsValue(store.current);
    }else if(passenger){
      form.setFieldsValue({
        ...passenger,
        cardType: passenger.cardType ? [passenger.cardType] : undefined,
      });
    }else{
      const passportLimit = moment(location.state.departDate).add(181,"days").format("YYYY-MM-DD");
      form.setFieldsValue( {
        passengerId: "",
        givenName: "",
        surName: "",
        nationality: "",
        birthDay: "1990-01-01",
        gender: "male",
        cardType: ["Passport"],
        cardNo: "",
        passportLimit: passportLimit,
      });
    }
  },[]);

  useEffect(() => {
    if (!region || !region.phoneCode) return;
    form.setFieldsValue({ nationality: region.code });
  }, [region.phoneCode]);

  const save = (state: any) => {
    store.current = null;
    if (!state.passengerId) {
      const id = Math.random().toString(36).slice(2, 11);
      state.passengerId = id;
    }
    dispatchRedux(updatePassenger({ ...state, cardType: state.cardType[0] }));
    navigate(-1);
  };

  const saveData = () => {
    const dataList: (keyof PassengerDataType)[] = [
      "passengerId",
      "givenName",
      "surName",
      "nationality",
      "birthDay",
      "gender",
      "cardType",
      "cardNo",
      "passportLimit",
    ];
    const data = {} as PassengerDataType;
    dataList.forEach((item) => {
      data[item] = form.getFieldValue(item);
    });
    store.current = data;
  };

  const handleJumpRegion = () => {
    saveData();
    showRegionSelect();
  };

  return (
    <div className="passenger-edit">
      <Form
        form={form}
        labelPosition="top"
        initialValues={store.current ||
          (passenger && {
            ...passenger,
            cardType: passenger.cardType ? [passenger.cardType] : undefined,
          }) || {
          passengerId: "",
          givenName: "",
          surName: "",
          nationality: "",
          birthDay: "1990-1-1",
          gender: "male",
          cardType: [1],
          cardNo: "",
          passportLimit: "2030-1-1",
        }}
        footer={
          <Button
            type="primary"
            nativeType="submit"
            style={{
              width: "100%",
            }}
          >
            {t("save")}
          </Button>
        }
        onFinish={save}
        onFinishFailed={saveData}
      >
        <Form.Item
          label={t("First & middle name")}
          name="givenName"
          rules={[
            { required: true, message: t("Missing First & middle name")  },
          ]}
        >
          <Input
            placeholder={t("First & middle name")}
            formatter={(v) =>
              v.replaceAll(/^([a-zA-Z]*).*/g, (_, b) => {
                return b.toUpperCase();
              })
            }
          />
        </Form.Item>
        <Form.Item
          label={t("Last Name")}
          name="surName"
          rules={[{ required: true, message: t("Missing Last name") }]}
        >
          <Input
            placeholder={t("Last Name")}
            formatter={(v) =>
              v.replaceAll(/^([a-zA-Z]*).*/g, (_, b) => {
                return b.toUpperCase();
              })
            }
          />
        </Form.Item>
        <Form.Item
          label={t("Nationality")}
          name="nationality"
          onClick={handleJumpRegion}
          rules={[{ required: true, message: t("Missing nationality") }]}
        >
          <Input placeholder={t("Nationality")} />
        </Form.Item>

        <Form.Item
          label={t("Date of birth")}
          name="birthDay"
          rules={[
            { required: true, message: t("Missing date of birth") },
          ]}
          trigger="onConfirm"
          getValueFromEvent={(_, v) => {
            return v.join("-");
          }}
          onClick={(_, ref: any) => {
            ref.open();
          }}
          valuePropName="value"
        >
          <DatePicker
            startDate={new Date(1900, 0, 1)}
            endDate={new Date()}
          />
        </Form.Item>


        <Form.Item
          label={t("Gender") || ""}
          name="gender"
          rules={[{ required: true, message: t("Missing gender")}]}
        >
          <Radio.Group direction="horizontal">
            <Radio value="male">{t("Male")}</Radio>
            <Radio value="female">{t("Female")}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="cardType"
          label={t("Passport Type") || ""}
          trigger="onConfirm"
          getValueFromEvent={(_, v) => {
            return v;
          }}
          onClick={(_, ref: any) => {
            ref.open();
          }}
        >
          <Picker options={[certList]}>
            {(value: string[]) => (
              <Cell
                style={{
                  padding: 0,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  "--nutui-cell-divider-border-bottom": "0",
                }}
                className="nutui-cell--clickable"
                title={
                  value.length
                    ? certList.filter((po) => po.value === value[0])[0]?.text
                    : t("Passport Type")
                }
                extra={<Right />}
                align="center"
              />
            )}
          </Picker>
        </Form.Item>
        
        <Form.Item
          name="cardNo"
          label={t("Passport Document Number")}
          rules={[
            { required: true, message: t("Missing passport number") },
            // { validator: customValidator, message: "必须输入数字" },
          ]}
        >
          <Input placeholder={t("Passport Document Number")} />
        </Form.Item>
        <Form.Item
          label={t("Expiration Date")}
          name="passportLimit"
          rules={[
            { required: true, message: t("Missing passport limit") },
          ]}
          trigger="onConfirm"
          getValueFromEvent={(_, v) => {
            return v.join("-");
          }}
          onClick={(_, ref: any) => {
            ref.open();
          }}
          valuePropName="value"
        >
          <DatePicker
            startDate={moment(location.state.departDate).add(180,"days").toDate()}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default PassengerEdit;
