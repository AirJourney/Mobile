import poi from "@constant/data/poi.json";
import { useEffect, useState, useTransition } from "react";
import { useAppSelector } from "@utils/hooks";
import type { IAirport } from ".";
import "./SearchResult.less";

interface ISearchResultProps {
  keyWords?: string;
  onSelect: (item: IAirport, type: "city"|"airport") => void;
}

interface SearchResult extends IAirport{
  children: IAirport[];
}

const search = (keyWords?: string) => {
  if (!keyWords) return [];
  const result: SearchResult[] = [];
  let lastCityCode = "";
  for (const item of poi) {
    const isMatched = checkResult(item, keyWords);
    if (isMatched) {
      if(lastCityCode !== item.citycode){
        lastCityCode = item.citycode;
        result.push({
          ...item,
          children: [{...item}]
        });
      }else{
        result[result.length-1].children.push({...item});
      }
    }
  }
  return result;
};

const checkResult = (data: IAirport, keyWords: string) => {
  keyWords = keyWords.toUpperCase();
  if(data.citycode.indexOf(keyWords) > -1) return true;
  if(data.airportcode.indexOf(keyWords) > -1) return true;
  return false;
};

const SearchResult = ({ keyWords, onSelect }: ISearchResultProps) => {
  const [isPending, startTransition] = useTransition();
  const locale = useAppSelector((state) => state.commonSetting.language);
  const [result, setResult] = useState<SearchResult[]>([]);
  useEffect(() => {
    startTransition(() => {
      setResult(search(keyWords));
    });
  }, [keyWords]);

  if(isPending){
    return <div className="search-result-loading">loading...</div>;
  }
  return (
    <div className="search-result-container">
      {result.map((item) =>  (
        <div key={item.citycode} className="search-result-country">
          <div
            className="search-result-country-name"
            onClick={() => onSelect(item, "city")}
          >
            {item.citycode}-{item[locale].cityname}
          </div>
          {item.children.map((data) => (
            <div
              key={data.citycode + data.airportcode}
              className="search-result-airport"
              onClick={() => onSelect(data, "airport")}
            >
              {data.airportcode}-{data[locale].airportname}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SearchResult;
