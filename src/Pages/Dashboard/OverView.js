import React from 'react';
import LineColumnArea from './LineColumnArea';

import {
    Card,
    CardBody,
    Col,
    Row
} from "reactstrap";

import { OverViewData } from '../../CommonData/Data/index';

import { NumericFormat } from 'react-number-format';

const OverView = ({asyncProps}) => {

    return (
        <React.Fragment>
            <Col xl={12}>
                <Card>
                    <CardBody>
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <h5 className="card-title">Overview</h5>
                            </div>
                            <div className="flex-shrink-0">
                                <div>
                                    <span className="badge bg-primary me-1">
                                        Inflow
                                    </span>
                                    <span className="badge bg-danger me-1">
                                        Outflow
                                    </span>
                                    <span className="badge bg-info me-1">
                                        Total
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <LineColumnArea asyncProps={asyncProps.total1Week}/>
                        </div>
                    </CardBody>
                    <CardBody className="border-top">
                        <div className="text-muted text-center">
                            <Row>
                                <Col md={4} className="border-end">
                                    <div>
                                        <p className="mb-2"><i className={"mdi mdi-circle font-size-12 me-1 text-" + OverViewData[0]['color']}></i>Inflow</p>
                                        <h5 className="font-size-16 mb-0"><NumericFormat value={Number(asyncProps.total.Inflows).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} /></h5>
                                    </div>
                                </Col>

                                <Col md={4} className="border-end">
                                    <div>
                                        <p className="mb-2"><i className={"mdi mdi-circle font-size-12 me-1 text-" + OverViewData[2]['color']}></i>Outflow</p>
                                        <h5 className="font-size-16 mb-0"><NumericFormat value={Number(asyncProps.total.Outflows).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} /></h5>
                                    </div>
                                </Col>

                                <Col md={4} className="border-end">
                                    <div>
                                        <p className="mb-2"><i className={"mdi mdi-circle font-size-12 me-1 text-" + OverViewData[1]['color']}></i>Total flow</p>
                                        <h5 className="font-size-16 mb-0"><NumericFormat value={Number(asyncProps.total.Expenses).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} /></h5>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default OverView;