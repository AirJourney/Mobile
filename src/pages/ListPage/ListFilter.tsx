import { Button, Cell, Col, Popup, Row } from "@nutui/nutui-react";
import Checkbox from "@components/Checkbox/index";
import { forwardRef, useImperativeHandle, useState } from "react";
import { FilterType, StopsType, TimeType } from "@constant/enum";
import type { IFilterType } from "./filter";
import { useTranslation } from "react-i18next";

interface IListFilterProps {
  visible: boolean;
  onClose: () => void;
  onSure: (type: IFilterType[]) => void;
}
const ListFilter = (
  props: IListFilterProps,
  ref: React.Ref<IListFilter>,
) => {
  const { onSure, visible, onClose } = props;
  const { t } = useTranslation();
  const [stopState, setStopState] = useState<StopsType[]>([StopsType.ANY]);
  const [departTimeState, setDepartTimeState] = useState<TimeType[]>([]);
  const [arriveTimeState, setArriveTimeState] = useState<TimeType[]>([]);
  const reset = () => {
    setStopState([StopsType.ANY]);
    setDepartTimeState([]);
    setArriveTimeState([]);
  };

  const handleSure = () => {
    onSure([
      {
        type: FilterType.STOPS,
        value: stopState,
      },
      {
        type: FilterType.ARRIVE_TIME,
        value: arriveTimeState,
      },
      {
        type: FilterType.DEPART_TIME,
        value: departTimeState,
      },
    ]);
    if (visible) {
      onClose();
    }
  };

  useImperativeHandle(ref, () => ({ reset, handleSure }));

  return (
    <Popup
      round
      visible={visible}
      style={{ height: "450px" }}
      position="bottom"
      onClose={onClose}
    >
      <div className="sort-title">
        <span>{t("filter")}</span>
      </div>

      <Cell style={{ flexDirection: "column" }}>
        <p>{t("Stops")}</p>
        <Checkbox
          value={stopState}
          onChange={(v) => {
            if (v.length === 0) {
              setStopState([StopsType.ANY]);
              return;
            }
            if (v.includes(StopsType.ANY) && v.length > 1) {
              setStopState(v.filter((item) => item !== StopsType.ANY));
              return;
            }
            setStopState(v);
          }}
        >
          <Row type="flex" justify="space-around">
            <Col span="8">
              <Checkbox.Options value={StopsType.ANY}>{t("any")}</Checkbox.Options>
            </Col>
            <Col span="8">
              <Checkbox.Options value={StopsType.NON_STOP}>
                {t("non-stop")}
              </Checkbox.Options>
            </Col>
          </Row>
          <Row type="flex" justify="space-around">
            <Col span="8">
              <Checkbox.Options value={StopsType.ONE_STOP}>
                {t("1stop")}
              </Checkbox.Options>
            </Col>
            <Col span="8">
              <Checkbox.Options value={StopsType.MULTI_STOP}>
                {t("2Stops")}
              </Checkbox.Options>
            </Col>
          </Row>
        </Checkbox>
      </Cell>
      <Cell title="Time" style={{ flexDirection: "column" }}>
        <p>{t("DepartmentTime")}</p>
        <Checkbox value={departTimeState} onChange={setDepartTimeState}>
          <Row type="flex" justify="space-around">
            <Col span="8">
              <Checkbox.Options value={TimeType.DAWN}>
                00:00-06:00
              </Checkbox.Options>
            </Col>
            <Col span="8">
              <Checkbox.Options value={TimeType.MORNING}>
                06:00-12:00
              </Checkbox.Options>
            </Col>
          </Row>
          <Row type="flex" justify="space-around">
            <Col span="8">
              <Checkbox.Options value={TimeType.AFTERNOON}>
                12:00-18:00
              </Checkbox.Options>
            </Col>
            <Col span="8">
              <Checkbox.Options value={TimeType.NIGHT}>
                18:00-24:00
              </Checkbox.Options>
            </Col>
          </Row>
        </Checkbox>
        <p>{t("ArrivalTime")}</p>
        <Checkbox value={arriveTimeState} onChange={setArriveTimeState}>
          <Row type="flex" justify="space-around">
            <Col span="8">
              <Checkbox.Options value={TimeType.DAWN}>
                00:00-06:00
              </Checkbox.Options>
            </Col>
            <Col span="8">
              <Checkbox.Options value={TimeType.MORNING}>
                06:00-12:00
              </Checkbox.Options>
            </Col>
          </Row>
          <Row type="flex" justify="space-around">
            <Col span="8">
              <Checkbox.Options value={TimeType.AFTERNOON}>
                12:00-18:00
              </Checkbox.Options>
            </Col>
            <Col span="8">
              <Checkbox.Options value={TimeType.NIGHT}>
                18:00-24:00
              </Checkbox.Options>
            </Col>
          </Row>
        </Checkbox>
      </Cell>
      <Cell>
        <Row type="flex" justify="space-around">
          <Col span="10">
            <Button type="default" style={{ width: "100%" }} onClick={reset}>
              {t("Reset")}
            </Button>
          </Col>
          <Col span="10">
            <Button
              type="primary"
              style={{ width: "100%" }}
              onClick={handleSure}
            >
              {t("Sure")}
            </Button>
          </Col>
        </Row>
      </Cell>
    </Popup>
  );
};

export interface IListFilter {
  reset: () => void;
  handleSure: () => void;
}

export default forwardRef<IListFilter, IListFilterProps>(ListFilter);
