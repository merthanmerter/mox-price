import tools from "../data/tableTools.json";
import surfaces from "../data/tableSurfaces.json";
import deals from "../data/tableDeals.json";
import ext_accessories from "../data/tableExtAccessories.json";
import accessories from "../data/tableAccessories.json";
import defaultConfig from "../config.json";

var config = defaultConfig;

// ui
global.lang = config.lang;
global.currency = config.currency;

// raw material
var lme, premium, conversion, totrawusd;
lme = config.lme;
premium = config.premium;
conversion = config.conversion;
totrawusd = (lme + premium + conversion) / 1000;

// currencies
let usdtl, eurusd, gbpusd;
usdtl = config.usdtl;
eurusd = config.eurusd;
gbpusd = config.gbpusd;

//price type
var priceMultiplier, currencyMultiplier;
priceMultiplier =
  config.pricing === "wholesale"
    ? config.wholesalePriceMultiplier
    : config.pricing === "retail"
    ? config.retailPriceMultiplier
    : 1;
currencyMultiplier =
  config.currency === "usd"
    ? 1
    : config.currency === "eur"
    ? 1 / eurusd
    : config.currency === "gbp"
    ? 1 / gbpusd
    : 1;

function prepareApp(appConfig) {
  config = appConfig;
  priceMultiplier =
    config.pricing === "wholesale"
      ? config.wholesalePriceMultiplier
      : config.pricing === "retail"
        ? config.retailPriceMultiplier
        : 1;

  currencyMultiplier =
    config.currency === "usd"
      ? 1
      : config.currency === "eur"
        ? 1 / eurusd
        : config.currency === "gbp"
          ? 1 / gbpusd
          : 1;
}

//functions
function getValue(item, key, defaultVal) {
  return typeof item[key] != "undefined" ? item[key] : defaultVal;
}

function getTools(property, type, defaultVal) {
  if (property.tools && property.tools.length) {
    return property.tools
      .map((x) => {
        //- var obj = tools.find(p => p.no === x.no)
        var obj = typeof tools[x.no] != "undefined" ? tools[x.no] : false;
        return obj !== false
          ? Number(getValue(obj, type, defaultVal))
          : defaultVal;
      })
      .reduce((sum, p) => sum + p)
      .toFixed(4);
  } else return null;
}

function getSurface(property, type, defaultVal) {
  if (property.surfcode && property.surfcode.length) {
    //- var obj = surfaces.find(x => x.name === property.surfcode);
    var obj =
      typeof surfaces[property.surfcode] != "undefined"
        ? surfaces[property.surfcode]
        : false;
    return obj !== false ? getValue(obj, type, defaultVal) : defaultVal;
  } else return null;
}

function getSurface2(config, property, type, defaultVal) {
  prepareApp(config);
  if (property.surfcode && property.surfcode.length) {
    //- var obj = surfaces.find(x => x.name === property.surfcode);
    var obj =
      typeof surfaces[property.surfcode] != "undefined"
        ? surfaces[property.surfcode]
        : false;
    return obj !== false ? getValue(obj, type, defaultVal) : defaultVal;
  } else return null;
}

function getPriceSteel(property) {
  if (property.coststeel) {
    return Number(property.coststeel);
  } else return 0;
}

function getDeals(deal, type) {
  if (deal.name && deal.name.length) {
    var name = typeof deals[deal.name] != "undefined" ? deals[deal.name] : {};
    var currency = getValue(name, "currency");
    var margin =
      config.pricing === "wholesale"
        ? getValue(name, "marginwholesale")
        : config.pricing === "retail"
        ? getValue(name, "marginretail")
        : 1;
    var priceMultiplier =
      currency === "tl"
        ? 1 / usdtl
        : currency === "eur"
        ? eurusd
        : currency === "gbp"
        ? gbpusd
        : 1;
    return type === "price"
      ? Number(getValue(name, "price") * margin * priceMultiplier).toFixed(2)
      : type === "description"
      ? config.lang === "tr"
        ? getValue(name, "description", "")
        : getValue(name, "description_en", "")
      : null;
  } else return null;
}

function getDeals2(appConfig, deal, type) {
  prepareApp(prepareApp);
  if (deal.name && deal.name.length) {
    var name = typeof deals[deal.name] != "undefined" ? deals[deal.name] : {};
    var currency = getValue(name, "currency");
    var margin =
      config.pricing === "wholesale"
        ? getValue(name, "marginwholesale")
        : config.pricing === "retail"
        ? getValue(name, "marginretail")
        : 1;
    var priceMultiplier =
      currency === "tl"
        ? 1 / usdtl
        : currency === "eur"
        ? eurusd
        : currency === "gbp"
        ? gbpusd
        : 1;
    return type === "price"
      ? Number(getValue(name, "price") * margin * priceMultiplier).toFixed(2)
      : type === "description"
      ? config.lang === "tr"
        ? getValue(name, "description", "")
        : getValue(name, "description_en", "")
      : null;
  } else return null;
}

function getExtAccessory(property) {
  if (property.ext_accessories && property.ext_accessories.length) {
    return property.ext_accessories
      .map((x) => {
        var name =
          typeof ext_accessories[x.name] != "undefined"
            ? ext_accessories[x.name]
            : {};
        var kgm = getValue(tools[getValue(name, "tool")], "kgm");
        var length = getValue(name, "length");
        var fab_usd = Number(getValue(name, "fab_usd"));
        var surf_usd = Number(getValue(name, "surf_usd"));
        return (
          (((kgm * length) / 1000) * totrawusd + fab_usd + surf_usd) * x.qty
        );
      })
      .reduce((sum, p) => sum + p);
  } else return 0;
}

function priceAccessory(property) {
  if (property.accessories && property.accessories.length) {
    return property.accessories
      .map((x) => {
        var name =
          typeof accessories[x.name] != "undefined" ? accessories[x.name] : {};
        var price = getValue(name, "price");
        var currency = getValue(name, "currency");
        var unit = getValue(name, "unit");
        var priceMultiplier =
          currency === "tl"
            ? 1 / usdtl
            : currency === "eur"
            ? eurusd
            : currency === "gbp"
            ? gbpusd
            : 1;

        var unitMultiplier =
          unit === "m"
            ?
              (property.length / 1000)
            :
              (1);

        return price * priceMultiplier * unitMultiplier * x.qty;
      })
      .reduce((sum, p) => sum + p);
  } else return 0;
}

function priceFabrication(property) {
  if (property.fabrication && property.fabrication.length) {
    return property.fabrication
      .map((x) => {
        var price = x.price;
        var currency = !(x.currency && x.currency.length) ? "usd" : x.currency;
        var priceMultiplier =
          currency === "tl"
            ? 1 / usdtl
            : currency === "eur"
            ? eurusd
            : currency === "gbp"
            ? gbpusd
            : 1;
        return price * priceMultiplier;
      })
      .reduce((sum, p) => sum + p);
  } else return 0;
}

function priceCalc(property) {
  return (
    (totrawusd * // total raw material usd/kg
      ((getTools(property, "kgm", 0) * property.length) / 1000) + // product kg/pcs
      (getSurface(property, "usdm2", 0) *
        getTools(property, "area", 0) *
        property.length) /
        1000000 + // product surface-area/pcs
      priceAccessory(property) + // get accessory price
      priceFabrication(property) + // sum all fabrication prices
      getExtAccessory(property) +
      getPriceSteel(property)) *
    priceMultiplier *
    currencyMultiplier
  ).toFixed(2);
}

function priceCalc2(config, property) {
  prepareApp(config);
  return (
    (totrawusd * // total raw material usd/kg
      ((getTools(property, "kgm", 0) * property.length) / 1000) + // product kg/pcs
      (getSurface(property, "usdm2", 0) *
        getTools(property, "area", 0) *
        property.length) /
        1000000 + // product surface-area/pcs
      priceAccessory(property) + // get accessory price
      priceFabrication(property) + // sum all fabrication prices
      getExtAccessory(property) +
      getPriceSteel(property)) *
    priceMultiplier *
    currencyMultiplier
  ).toFixed(2);
}

export {
  getValue,
  getTools,
  getSurface,
  getSurface2,
  getDeals,
  getDeals2,
  getPriceSteel,
  getExtAccessory,
  priceAccessory,
  priceFabrication,
  priceCalc,
  priceCalc2,
};
