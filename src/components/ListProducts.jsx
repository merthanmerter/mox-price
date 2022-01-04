import { Container, Row, Col, CardImg, Table } from "react-bootstrap";
import React  from "react";
import ProductData from "../data/tableProducts.json";
import TableProducts from "./TableProducts";
import Calculator from "../utilities/Calculator";

export default function ListProducts ({appConfig}) {
  const config = appConfig;

  var calculator = new Calculator({config});

  var techDrawSuffix = config.lengthType === 'imp' ? '-imp' : '';

  return (
    <>
      {ProductData.map((obj, index) => {
        const drw = `https://www.mox.com.tr/assets/products/technical-drawings/drw-${obj.name.toLowerCase()}${techDrawSuffix}.png`;
        const img = `https://www.mox.com.tr/assets/products/product-page-lg-images/product-${obj.name.toLowerCase()}-s1.jpg`;
        return (
          <React.Fragment key={index}>
            <Container className="mt-5">
              <Row>
                <Col xs={6}>
                  <h4 className="capitalize">{obj.name}</h4>
                  <h6 className="capitalize">
                    {config.lang === "tr" ? obj.type : obj.type_en}
                  </h6>
                  <p className="content">
                    {config.lang === "tr"
                      ? obj.description
                      : obj.description_en}
                  </p>
                </Col>
                <Col xs={3}>
                  <CardImg
                    className="cover"
                    src={drw}
                    alt={obj.name}
                  >{}</CardImg>
                </Col>
                <Col xs={3}>
                  <CardImg
                    className="cover"
                    src={img}
                    alt={obj.name}
                  >{}</CardImg>
                </Col>
              </Row>
            </Container>
            <Container>
              <Table responsive striped className="mt-5">
                <thead className="table-dark">
                <tr>
                  <th scope="col">
                    {config.lang === "tr" ? "Ürün No" : "Product No"}
                  </th>
                  <th scope="col">
                    {config.lang === "tr"
                      ? "DIM (" + config.lengthTitle + ") / Tanım"
                      : "DIM (" + config.lengthTitle + ") / Description"}
                  </th>
                  <th scope="col">
                    {config.lang === "tr" ? "Boy (" + config.lengthTitle + ")" : "Length (" + config.lengthTitle + ")"}
                  </th>
                  <th scope="col">
                    {config.lang === "tr" ? "Yüzey" : "Surface"}{" "}
                  </th>
                  <th scope="col">
                    {config.lang === "tr" ? "Renk" : "Color"}
                  </th>
                  <th scope="col">
                    <span className="uppercase">{config.currency}</span>
                    <span>{config.lang === "tr" ? "/ad" : "/pcs"}</span>
                  </th>
                </tr>
                </thead>
                <tbody>
                {obj.properties.map((property, index) => {
                  return (
                    <TableProducts
                      appConfig={appConfig}
                      property={property}
                      key={`property-key ${index}`}
                    />
                  );
                })}
                {/* Deals loop 'product[].deals[]' */}
                {obj.deals && obj.deals.length
                  ? obj.deals.map((deal, index) => {
                    return (
                      <tr data-deal={deal} key={`deal-key ${index}`}>
                        <td>{deal.name}</td>
                        <td className="capitalize">
                          {calculator.getDeals(deal, "description")}
                        </td>
                        <td>{/* Empty Cell */}</td>
                        <td>{/* Empty Cell */}</td>
                        <td>{/* Empty Cell */}</td>
                        <td>{calculator.getDeals(deal, "price")}</td>
                      </tr>
                    );
                  })
                  : null}
                {/* End of deals loop */}
                </tbody>
              </Table>
            </Container>
            <div className="pagebreak">{}</div>
          </React.Fragment>
        );
      })}
    </>
  );
}
