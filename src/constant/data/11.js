import fs  from "fs";
import path from "path";

// const data = fs.readFileSync(path.join("/Users/leijiang/code/personal/LLTrip-Mobile/src/constant/data", "airports.json"), "utf-8");
// const poi = JSON.parse(data);

// const newData = poi.filter(i=>i.iata).sort((a,b) => {
//   if(a.iata < b.iata) return -1;
//   if(a.iata > b.iata) return 1;
//   return 0;
// }).map((item) => ({
//   code: item.iata,
//   cityname: item.city,
//   airportname: item.name,
//   countryname: item.country,
// }));

// const newData = poi.map((item) => {
//   return `${item.countryname},${item.cityname},${item.airportname}`;
// }).join("\n");

// fs.writeFileSync(path.join("/Users/leijiang/code/personal/LLTrip-Mobile/src/constant/data", "airports.json"), JSON.stringify(newData, null, 2),"utf-8");


const data1 = fs.readFileSync(path.join("/Users/leijiang/code/personal/LLTrip-Mobile/src/constant/data", "nnn.json"), "utf-8");
const poi1 = JSON.parse(data1);


const data2 = fs.readFileSync(path.join("/Users/leijiang/code/personal/LLTrip-Mobile/src/constant/data", "poiname.txt"), "utf-8");
data2.split("\n").forEach((item, index) => {
  const [countryname, cityname, airportname] = item.split(",");
  poi1[index].tc = {
    countryname,
    cityname,
    airportname,
  };
});

// const data = [];
// let i = 0;
// let j = 0;
// while(i < poi1.length && j < poi2.length) {

//   if(poi1[i].airportcode > poi2[j].code) {
//     console.log(poi1[i].airportcode, poi2[j].code);
//     j++;
//     continue;
//   }
//   if(poi1[i].airportcode < poi2[j].code) {
//     console.log(poi1[i].airportcode, poi2[j].code);
//     i++;
//     continue;
//   }

//   if(poi1[i].airportcode === poi2[j].code) {
//     data.push({
//       "airportcode": poi1[i].airportcode,
//       "citycode": poi1[i].citycode,
//       "countrycode": poi1[i].countrycode,
//       "cn":{
//         "airportname": poi1[i].airportname,
//         "cityname": poi1[i].cityname,
//         "countryname": poi1[i].countryname,
//       },
//       "en":{
//         "airportname": poi2[j].airportname,
//         "cityname": poi2[j].cityname,
//         "countryname": poi2[j].countryname,
//       },
//     });
//     i++;
//     j++;
//   }
// }

fs.writeFileSync(path.join("/Users/leijiang/code/personal/LLTrip-Mobile/src/constant/data", "poi2.json"), JSON.stringify(poi1,null,2),"utf-8");
