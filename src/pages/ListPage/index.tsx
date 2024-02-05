import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { EFlightType, TFlightSearch } from "@components/searchForm";
import moment from "moment";
import { ECurrencyType, SortOrder, SortType } from "@constant/enum";
import { Horizontal, Search } from "@nutui/icons-react";
import { Image, Skeleton, Price } from "@nutui/nutui-react";
import { useAppSelector } from "@utils/hooks";
import { displayLocaleTime, getAirlineLogo } from "@utils/index";
import { useTranslation } from "react-i18next";
import CalendarList from "./Calendar";
import {
  TFlightDetailType,
  FlightGroupInfoList,
  PolicyDetailInfo,
} from "./Interface";
import "./index.less";
import ListFilter, { IListFilter } from "./ListFilter";
import ListSort, { IListSort } from "./ListSort";
import { type IFilterType, filterList, sortList } from "./filter";
import { getFlights } from "@services/flightList";

const ListPage = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useSearchParams();
  const commonSetting = useAppSelector((state) => state.commonSetting);
  const [searchForm, setSearchForm] = useState<TFlightSearch | null>(null);
  const [loading, setLoading] = useState(false);
  const [flightListAllData, setFlightListAllData] = useState<
    TFlightDetailType[]
  >([]);
  const [showData, setShowData] = useState<TFlightDetailType[]>([]);
  const [showSortPop, setShowSortPop] = useState(false);
  const [showFilterPop, setShowFilterPop] = useState(false);
  const filterRef = useRef<IListFilter>(null);
  const sortRef = useRef<IListSort>(null);
  const jumpToMiddlePage = (deeplink: string) => {
    const url = new URL(deeplink);
    url.host = window.location.host;
    url.protocol = window.location.protocol;
    url.pathname = "/bookPage";
    window.location.href = url.href;
  };

  const getFlightListResult = async () => {
    if (loading) return;
    const requestParams = {
      ...searchForm,
      currency: commonSetting.currency,
      locale: commonSetting.language,
      language: commonSetting.language,
    };
    try {
      setLoading(true);
      const res = await getFlights(requestParams);
      if (res && res.content) {
        setFlightListAllData(res.content);
        setShowData(res.content);
      }
    } catch (e) {
      // console.log(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const flightType = search.get("flightType");
    const depart = search.get("departCity");
    const arrive = search.get("arriveCity");
    const departTime = search.get("departTime");
    const data = {
      flightType,
      cabinType: search.get("cabinType"),
      passenger: JSON.parse(search.get("passenger") || "[]"),
      tripSearch:
        flightType === EFlightType.OneWay
          ? [
            {
              depart,
              arrive,
              departTime,
            },
          ]
          : [
            {
              depart,
              arrive,
              departTime,
            },
            {
              depart: arrive,
              arrive: depart,
              departTime: search.get("returnTime"),
            },
          ],
    } as TFlightSearch;
    setSearchForm(data);
  }, [search]);

  const onChangeDate = (date: any) => {
    filterRef.current?.reset();
    setFlightListAllData([]);
    setShowData([]);
    search.set("departTime", date.format("YYYY-MM-DD"));
    setSearch(search);
  };

  useEffect(() => {
    if (!searchForm) return;
    getFlightListResult();
  }, [searchForm, commonSetting.currency]);

  const onSort = (type: SortType, order: SortOrder) => {
    setShowData([...sortList(showData, type, order)]);
  };

  const onFilter = (type: IFilterType[]) => {
    const filteredData = filterList(flightListAllData, type);
    const sortType = sortRef.current?.getData();
    if (sortType) {
      const sortedData = sortList(filteredData, sortType.type, sortType.order);
      setShowData(sortedData);
    }else{
      setShowData(filteredData);
    }
    setShowFilterPop(false);
  };

  const renderList = () => {
    const listItemRender = (data: TFlightDetailType) => {
      if (!data) return null;
      const flightGroupInfoList: FlightGroupInfoList[] =
        data.flightGroupInfoList;
      const id = data.shoppingId;
      const forceFlightInfo = {
        departure: flightGroupInfoList[0].departMultCityName,
        arrive: flightGroupInfoList[0].arriveMultCityName,
        departureTime: flightGroupInfoList[0].departDateTimeFormat,
        arriveTime: flightGroupInfoList[0].arriveDateTimeFormat,
        duration: flightGroupInfoList[0].duration,
        segments: flightGroupInfoList[0].flightSegments,
        departDateTimeFormat: flightGroupInfoList[0].departDateTimeFormat,
        arriveDateTimeFormat: flightGroupInfoList[0].arriveDateTimeFormat,
      };
      const policyDetailInfo: PolicyDetailInfo = data.policyDetailInfo;
      return (
        <div
          key={id}
          className="list-item"
          onClick={() => jumpToMiddlePage(data.deeplink)}
        >
          <div className="list-left">
            <div className="row-1">
              <div className="left">
                <div className="departure">
                  <p>
                    {displayLocaleTime(
                      forceFlightInfo.departDateTimeFormat,
                      "HH:MM",
                    )}
                  </p>
                </div>
                <div className="arrow">
                  <div className="stops">
                    {forceFlightInfo.segments.length > 1 && (
                      <span>
                        {t(
                          forceFlightInfo.segments.length === 2
                            ? "1 stop"
                            : "2+ stops",
                        )}
                      </span>
                    )}
                  </div>

                  <div className="arrow-line">
                    <i className="circle"></i>
                  </div>
                  <div className="stop-cities">
                    {forceFlightInfo.segments.length > 1 && (
                      <p>{forceFlightInfo.segments[0].aCityInfo.code}</p>
                    )}
                  </div>
                </div>
                <div className="arrive">
                  <p>
                    {displayLocaleTime(
                      forceFlightInfo.arriveDateTimeFormat,
                      "HH:MM",
                    )}
                  </p>
                </div>
              </div>
              <div className="right">
                {displayLocaleTime(
                  forceFlightInfo.departDateTimeFormat,
                  "YYYY-MM-DD",
                ) !==
                  displayLocaleTime(
                    forceFlightInfo.arriveDateTimeFormat,
                    "YYYY-MM-DD",
                  ) && <i className="cross-day">+1D</i>}
              </div>
            </div>
            <div className="row row-2">
              <div className="departure">
                <p>{`${forceFlightInfo.segments[0].dPortInfo.code} ${forceFlightInfo.segments[0].dPortInfo.terminal}`}</p>
              </div>
              <div className="arrive">
                <p>{`${
                  forceFlightInfo.segments[forceFlightInfo.segments.length - 1]
                    .aPortInfo.code
                } ${
                  forceFlightInfo.segments[forceFlightInfo.segments.length - 1]
                    .aPortInfo.terminal
                }`}</p>
              </div>
            </div>
            <div className="row row-3">
              {/* <p className="cost">
                <Clock /> */}
              {/* <span >{`${flight.duration && flight.duration.h}${'h'}-${flight.duration && flight.duration.m}${'m'}`}</span> */}
              {/* <span>{`${forceFlightInfo.duration.h}h${forceFlightInfo.duration.m}m`}</span> */}
              {/* </p> */}
              {/* <i className="line"></i> */}
              <div className="company">
                <img
                  src={getAirlineLogo(forceFlightInfo.segments[0].airlineInfo)}
                  style={{
                    width: "15px",
                    objectPosition: "center center",
                    height: "15px",
                  }}
                ></img>
                <p>
                  {forceFlightInfo.segments
                    .map((item) => item.airlineInfo.name + item.flightNo)
                    .join(",")}
                </p>
              </div>
            </div>
          </div>
          <div className="list-right">
            <Price
              price={policyDetailInfo.avgPrice}
              size="normal"
              digits={0}
              symbol={ECurrencyType[commonSetting.currency]}
              thousands
            />
          </div>
        </div>
      );
    };
    if (showData && showData.length > 0) {
      return (
        <div className="list-view">
          {/* <p className="message">價格是每位乘客之價格，包括所有稅費。</p> */}
          {showData.map(listItemRender)}
        </div>
      );
    } else {
      return (
        <div className="list-no-result">
          <Image
            src="https://www.skywingtrip.com/static/image/home/search_no_result.png"
            fit="scale-down"
            height="5rem"
            position="center"
          />
          <div className="iRFzgp">{t("no-find")}</div>
          <div className="iRFzgp">{t("retry-search")}</div>
        </div>
      );
    }
  };

  const renderSkeleton = () => {
    return (
      <div className="list-div">
        <Skeleton
          rows={3}
          title
          animated
          className="list-item"
          style={{ display: "block" }}
        />
        <Skeleton
          rows={3}
          title
          animated
          className="list-item"
          style={{ display: "block" }}
        />
        <Skeleton
          rows={3}
          title
          animated
          className="list-item"
          style={{ display: "block" }}
        />
        <Skeleton
          rows={3}
          title
          animated
          className="list-item"
          style={{ display: "block" }}
        />
        <Skeleton
          rows={3}
          title
          animated
          className="list-item"
          style={{ display: "block" }}
        />
      </div>
    );
  };

  return (
    <div className="flight-list">
      <CalendarList
        value={moment(search.get("departTime"))}
        callback={(date) => {
          onChangeDate(date);
        }}
      ></CalendarList>
      {/* <NoticeBar content="Skywingtrip.com由香港白雲交通有限公司運營，是香港白雲旗下的國際品牌，致力於為廣大客戶提供便捷、安全、高效的機票購買和管理服務。" /> */}
      {loading ? renderSkeleton() : renderList()}
      {!loading && flightListAllData && flightListAllData.length > 0 && (
        <div className="function-bar">
          <div className="sort" onClick={() => setShowSortPop(true)}>
            <Horizontal />
            <span>&nbsp;&nbsp;&nbsp;{t("sort")}</span>
          </div>
          <div className="select" onClick={() => setShowFilterPop(true)}>
            <Search />
            <span>&nbsp;&nbsp;&nbsp;{t("filter")}</span>
          </div>
        </div>
      )}
      <div className="sort">
        <ListSort
          visible={showSortPop}
          onClose={() => setShowSortPop(false)}
          onSure={onSort}
          ref={sortRef}
        />
        <ListFilter
          visible={showFilterPop}
          onClose={() => setShowFilterPop(false)}
          onSure={onFilter}
          ref={filterRef}
        />
      </div>
    </div>
  );
};

export default ListPage;
