import { useState } from "react";
import moment from "moment";
import "./index.less";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

function CalendarList({ callback, value }:{callback: (value: moment.Moment) => void, value: moment.Moment}) {
  const {t} = useTranslation();
  const days: string[] = [];
  for (let i = 1; i <= 14; i++) {
    days.push(moment().add(i, "days").format("YYYY-MM-DD"));
  }
  const [selectedDate, setSelectedDate] = useState(() => {
    return days.findIndex((day) => day === value.format("YYYY-MM-DD"));
  });

  // 渲染每个月的日历
  function renderMonth() {
    return (
      <>
        {days.map((day, index) => {
          const displayDay = moment(day).format("YYYY-MM-DD");
          return (
            <div
              key={displayDay}
              className={ classNames("calendar-day",selectedDate === index && "calendar-day-selected")}
              onClick={() => {
                setSelectedDate(index);
                callback(moment(day));
              }}
            >
              <span style={{ whiteSpace: "nowrap" }}>
                {displayDay}
              </span>
              <span>{t("view")}</span>
            </div>
          );
        })}
      </>
    );
  }

  // 渲染所有月份的日历列表
  // function renderCalendarList() {
  //   const currentYear = new Date().getFullYear();
  //   const currentMonth = new Date().getMonth();

  //   const months: JSX.Element[] = [];
  //   months.push(renderMonth());
  //   return months;
  // }

  return (
    <div className="calendar-list">
      {renderMonth()}
    </div>
  );
}

export default CalendarList;
