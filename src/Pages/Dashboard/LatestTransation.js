import React from 'react';

import { Row, Col, CardBody } from 'reactstrap';

import { NumericFormat } from 'react-number-format';

import { OverViewData } from '../../CommonData/Data/index';

const LatestTransation = ({asyncProps}) => {
    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title mb-4">Latest Transactions</h4>

                            <CardBody className="border-top">
                                <div className="text-muted text-center">
                                    <Row>
                                        <Col md={4} className="border-end">
                                            <div>
                                                <p className="mb-2"><i className={"mdi mdi-circle font-size-12 me-1 text-" + OverViewData[0]['color']}></i> {OverViewData[0]['title']}</p>
                                                <h5 className="font-size-16 mb-0"><NumericFormat value={Number(asyncProps.totalInflow).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} /></h5>
                                            </div>
                                        </Col>

                                        <Col md={4} className="border-end">
                                            <div>
                                                <p className="mb-2"><i className={"mdi mdi-circle font-size-12 me-1 text-" + OverViewData[1]['color']}></i> {OverViewData[1]['title']}</p>
                                                <h5 className="font-size-16 mb-0"><NumericFormat value={Number(asyncProps.totalExpenses).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} /></h5>
                                            </div>
                                        </Col>

                                        <Col md={4} className="border-end">
                                            <div>
                                                <p className="mb-2"><i className={"mdi mdi-circle font-size-12 me-1 text-" + OverViewData[2]['color']}></i> {OverViewData[2]['title']}</p>
                                                <h5 className="font-size-16 mb-0"><NumericFormat value={Number(asyncProps.totalOutflow).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} /></h5>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </CardBody>

                            <div className="table-responsive">
                                <table className="table table-centered table-nowrap mb-0">

                                    <thead>
                                        <tr>
                                            <th scope="col">Institution</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Category</th>
                                            <th scope="col">Subcategory</th>
                                            <th scope="col">Flow Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {asyncProps['transactionsArray'].map((item, key) => (<tr key={key}>
                                            <td>
                                                <p className="mb-1 font-size-12">{item.account.institution.name}</p>
                                            </td>
                                            <td>
                                                <p className="mb-1 font-size-12">{'#' + item.reference}</p>
                                                <h5 className="font-size-15 mb-0">{item.merchant.name}</h5>
                                                <p className="mb-1 font-size-12">{item.description}</p>
                                            </td>
                                            <td>{item.value_date}</td>
                                            <td>$ {item.amount}</td>
                                            <td>{item.category}</td>

                                            <td>
                                                {item.subcategory}
                                            </td>
                                            <td>
                                                <i className={"mdi mdi-checkbox-blank-circle me-1 text-" + item.color}></i> {item.type}
                                            </td>
                                        </tr>))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default LatestTransation;