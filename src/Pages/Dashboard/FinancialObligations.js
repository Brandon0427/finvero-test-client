import React from 'react';
import {
    Card,
    CardBody,
    CardTitle,
    Col,
    Row,
} from "reactstrap";

import { NumericFormat } from 'react-number-format';

const FinancialObligations = ({asyncProps}) => {
    return (
        <React.Fragment>
            <Col xl={4}>
                <Card>
                    <CardBody>
                        <CardTitle>Financial Obligation Expenses</CardTitle>
                        <div>
                            <ul className="list-unstyled">
                                {asyncProps.map((item, key) => (<li key={key} className="py-3">
                                    <div className="d-flex">
                                        <div className="avatar-xs align-self-center me-3">
                                            <div className="avatar-title rounded-circle bg-light text-danger font-size-18">
                                                <i className={item.icon}></i>
                                            </div>
                                        </div>

                                        <div className="flex-grow-1">
                                        <p className="text-muted mb-2">{item.title + ': '}<NumericFormat value={Number(item.outflows).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} /></p>
                                            <div className="progress progress-sm animated-progess">
                                                <div className={"progress-bar bg-" + item.color} role="progressbar" style={{ width: item.width + "%" }} aria-valuenow={item.width} aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    </div>
                                </li>))}
                            </ul>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    )
}

export default FinancialObligations;