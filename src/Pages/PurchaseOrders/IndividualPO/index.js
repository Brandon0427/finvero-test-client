import React from 'react';
import { Container } from 'reactstrap';
import PODetails from "./PODetails";

import Breadcrumbs from "../../../components/Common/Breadcrumb";

import { useSelector } from "react-redux";

const IndividualPO = () => {

    const poTitle = useSelector(state => (state.POAlert.poDetailsTitle));
    const poNumber = useSelector(state => (state.POAlert.poDetailsNumber));

    document.title = "PO" + poNumber + " | Optioutlet";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Optioutlet" iconSection="Menu" breadcrumbItem={"#PO" + poNumber + " | " + poTitle} />

                    <PODetails />
                </Container>
            </div>
        </React.Fragment>
    );
};

export default IndividualPO;