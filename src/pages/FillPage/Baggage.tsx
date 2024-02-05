import { Cell, Col, Price, Row } from "@nutui/nutui-react";
import { useEffect, useState } from "react";
import Checkbox from "@components/Checkbox/index";
import { IBaggage, getAddonBaggage } from "@services/addonBaggage";
import "./Baggage.less";

interface IBaggageProps{
  skuType?: string|null;
  depart?: string|null;
  arrive?: string|null;
  departTime?: string|null;
  carrier?: any|null;
  currency?: string|null;
  onChange: (baggage: IBaggage|undefined, index: number)=>void;
}

// {
//   "weight": "23",
//   "piece": 1,
//   "price": "714",
//   "currency": "CNY"
// },

const Baggage = (props: IBaggageProps)=>{
  const {skuType,depart,arrive,departTime,carrier,currency,onChange} = props;
  const [baggageList, setBaggageList] = useState<IBaggage[]>([]);
  const [checkedData, setCheckedData] = useState<number[]>([]);
  useEffect(()=>{
    const getBaggage = async ()=>{
      if(!skuType || !depart || !arrive || !departTime || !carrier || !currency){
        return [];
      }
      const res = await getAddonBaggage({
        skuType,
        depart,
        arrive,
        departTime,
        carrier,
        currency,
      });
      setBaggageList(res.content[0].baggageList);
    };
    try{
      getBaggage();
    }catch(e){
      setBaggageList([]);
    }
  },[skuType,depart,arrive,departTime,carrier,currency]);

  const renderItem = ()=>{
    const itemsPerRow = 3;
    return baggageList.reduce<IBaggage[][]>((prev, cur, index) => {
      if (index % itemsPerRow === 0) prev.push([]);
      prev[prev.length - 1].push(cur);
      return prev;
    }, []).map((row, index) => {
      return (
        <Row type="flex" justify="space-around" key={index}>
          {
            row.map((baggage, i)=>{
              return (
                <Col span="6" key={i}>
                  <Checkbox.Options value={i}>
                    <div className="baggage-price">
                      <span>{baggage.weight}kg * {baggage.piece}</span>
                      <Price price={baggage.price} symbol={baggage.currency} size="small" />
                    </div>
                  </Checkbox.Options>
                </Col>
              );
            })
          }
        </Row>
      );
    });
  };
  if(baggageList.length === 0) return null;
  return (
    <Cell style={{ flexDirection: "column" }}>
      <Checkbox
        value={checkedData}
        max={1}
        onChange={(v) => {
          setCheckedData(v);
          if(v && v.length>0){
            onChange(baggageList[v[0]], v[0]);
          }else{
            onChange(undefined, v[0]);
          }
        }}
      >
        {renderItem()}
      </Checkbox>
    </Cell>
  );
};

export default Baggage;