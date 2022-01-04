import React, { Component } from "react";
import Calculator from "../utilities/Calculator";

export default class TableProducts extends Component {
  render() {
    const { property } = this.props;
    const config = this.props.appConfig;

    var calculator = new Calculator({config});

    var productDimension = property.dim.split(' ');
    var widthHeight = productDimension[0];
    var unit = productDimension[1];

    var productDescription = config.lang === "tr" ? property.description : property.description_en;
    if (productDescription && productDescription.length) {
      productDescription = ' / ' + productDescription;
    }

    return (
      <tr>
        <td>{property.no}</td>
        <td>
          <span>{calculator.displayLength(config.lengthType, parseInt(widthHeight)) + '' + unit}</span>
          <span className="capitalize">{productDescription}</span>
        </td>
        <td>{property.type === "accessory" ? "" : calculator.displayLength(config.lengthType, property.length)}</td>
        <td className="capitalize">
          {config.lang === "tr"
            ? calculator.getSurface(property, "description", "")
            : calculator.getSurface(property, "description_en", "")}
        </td>
        <td className="capitalize">
          {config.lang === "tr"
            ? calculator.getSurface(property, "color", "")
            : calculator.getSurface(property, "color_en", "")}
        </td>
        <td>{calculator.priceCalc(property)}</td>
      </tr>
    );
  }
}
