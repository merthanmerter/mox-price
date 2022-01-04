import {Component} from "react";
import deals from "../data/tableDeals.json";
import tools from "../data/tableTools.json";
import surfaces from "../data/tableSurfaces.json";
import ext_accessories from "../data/tableExtAccessories.json";
import accessories from "../data/tableAccessories.json";

export default class Calculator extends Component {
  getPriceMultiplier() {
    return parseFloat(this.props.config.pricing === "wholesale"
      ? this.props.config.wholesalePriceMultiplier
      : this.props.config.pricing === "retail"
        ? this.props.config.retailPriceMultiplier
        : 1);
  }

  getCurrencyMultiplier() {
    return parseFloat(this.props.config.currency === "usd"
      ? 1
      : this.props.config.currency === "eur"
        ? 1 / this.props.config.eurusd
        : this.props.config.currency === "gbp"
          ? 1 / this.props.config.gbpusd
          : 1);
  }

  getProductCurrencyMultiplier(currency) {
    return parseFloat(currency === "tl"
      ? 1 / this.props.config.usdtl
      : currency === "eur"
        ? this.props.config.eurusd
        : currency === "gbp"
          ? this.props.config.gbpusd
          : 1);
  }

  getLme() {
    return this.props.config.lme;
  }

  getPremium () {
    return this.props.config.premium;
  }

  getConversion () {
    return this.props.config.conversion;
  }

  getTotrawusd () {
    return parseFloat((this.getLme() + this.getPremium() + this.getConversion()) / 1000);
  }

  getValue(item, key, defaultVal) {
    return typeof item[key] != "undefined" ? item[key] : defaultVal;
  }

  getDeals(deal, type) {
    if (deal.name && deal.name.length) {
      var name = typeof deals[deal.name] != "undefined" ? deals[deal.name] : {};
      var productCurrency = this.getValue(name, 'currency');
      var margin =
        this.props.config.pricing === "wholesale"
          ? this.getValue(name, "marginwholesale")
          : this.props.config.pricing === "retail"
            ? this.getValue(name, "marginretail")
            : 1;
      var price = this.getValue(name, "price");
      price = price * this.getProductCurrencyMultiplier(productCurrency);
      return type === "price"
        ? Number(price * margin * this.getCurrencyMultiplier()).toFixed(2)
        : type === "description"
          ? this.props.config.lang === "tr"
            ? this.getValue(name, "description", "")
            : this.getValue(name, "description_en", "")
          : null;
    } else return null;
  }

  getTools(property, type, defaultVal) {
    if (property.tools && property.tools.length) {
      var result = property.tools
        .map((x) => {
          //- var obj = tools.find(p => p.no === x.no)
          var obj = typeof tools[x.no] != "undefined" ? tools[x.no] : false;
          return obj !== false
            ? Number(this.getValue(obj, type, defaultVal))
            : defaultVal;
        })
        .reduce((sum, p) => sum + p);
      return parseFloat(result.toFixed(4));
    } else return null;
  }

  getSurface(property, type, defaultVal) {
    if (property.surfcode && property.surfcode.length) {
      //- var obj = surfaces.find(x => x.name === property.surfcode);
      var obj =
        typeof surfaces[property.surfcode] != "undefined"
          ? surfaces[property.surfcode]
          : false;
      return obj !== false ? this.getValue(obj, type, defaultVal) : defaultVal;
    } else return null;
  }

  getPriceSteel(property) {
    if (property.coststeel) {
      return Number(property.coststeel);
    } else return 0;
  }

  getExtAccessory(property) {
    if (property.ext_accessories && property.ext_accessories.length) {
      return property.ext_accessories
        .map((x) => {
          var name =
            typeof ext_accessories[x.name] != "undefined"
              ? ext_accessories[x.name]
              : {};
          var kgm = this.getValue(tools[this.getValue(name, "tool")], "kgm");
          var length = this.getValue(name, "length");
          var fab_usd = Number(this.getValue(name, "fab_usd"));
          var surf_usd = Number(this.getValue(name, "surf_usd"));
          return (
            (((kgm * length) / 1000) * this.getTotrawusd() + fab_usd + surf_usd) * x.qty
          );
        })
        .reduce((sum, p) => sum + p);
    } else return 0;
  }

  convertMmToInches(mm) {
    var din = mm / 25.4;
    var dft = din / 12;
    var feet = Math.floor(dft);
    var inch = Math.floor(din -feet * 12);
    var dec = din - Math.floor(din);
    var fraction = Math.round(dec * 16);
    var fractionAA = Math.floor(fraction / 16);
    var fractionText = fraction + '/16';
    if (fractionAA === 1) {
      inch++;
      fractionText = '';
    }
    var gcd = this.gcd_two_numbers(fraction, 16);
    if (gcd > 1) {
      fractionText = fraction/gcd + '/' + 16/gcd;
    }
    if (inch === 12) {
      inch = 0;
      feet++;
    }
    var feetText = feet > 0 ? feet + "' " : '';
    return feetText + inch + ' ' + fractionText + '"';
  }

  gcd_two_numbers(x, y) {
    if ((typeof x !== 'number') || (typeof y !== 'number'))
      return false;
    x = Math.abs(x);
    y = Math.abs(y);
    while(y) {
      var t = y;
      y = x % y;
      x = t;
    }
    return x;
  }

  displayLength(type, length) {
    return type === 'metric' ? length : this.convertMmToInches(length);
  }

  priceAccessory(property) {
    if (property.accessories && property.accessories.length) {
      return property.accessories
        .map((x) => {
          var name =
            typeof accessories[x.name] != "undefined" ? accessories[x.name] : {};
          var price = this.getValue(name, "price");
          var currency = this.getValue(name, "currency");
          var unit = this.getValue(name, "unit");
          var unitMultiplier =
            unit === "m"
              ?
              property.length / 1000
              :
              1;
          return price * this.getProductCurrencyMultiplier(currency) * unitMultiplier * x.qty;
        })
        .reduce((sum, p) => sum + p);
    } else return 0;
  }

  priceFabrication(property) {
    if (property.fabrication && property.fabrication.length) {
      return property.fabrication
        .map((x) => {
          var price = x.price;
          var currency = !(x.currency && x.currency.length) ? "usd" : x.currency;
          return price * this.getProductCurrencyMultiplier(currency);
        })
        .reduce((sum, p) => sum + p);
    } else return 0;
  }

  priceCalc(property) {
    return (
      (
        (this.getTotrawusd()) * // total raw material usd/kg
        ((this.getTools(property, "kgm", 0) * property.length) / 1000) + // product kg/pcs
        ((this.getSurface(property, "usdm2", 0) *
            this.getTools(property, "area", 0) *
            property.length) /
          1000000) + // product surface-area/pcs
        this.priceAccessory(property) + // get accessory price
        this.priceFabrication(property) + // sum all fabrication prices
        this.getExtAccessory(property) +
        this.getPriceSteel(property)) *
      this.getPriceMultiplier() *
      this.getCurrencyMultiplier()
    ).toFixed(2);
  }
};
