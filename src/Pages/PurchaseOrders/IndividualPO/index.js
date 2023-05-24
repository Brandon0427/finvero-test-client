import React from 'react';
import { Container } from 'reactstrap';
import PODetails from "./PODetails";

import Breadcrumbs from "../../../components/Common/Breadcrumb";

import { useParams } from 'react-router-dom';

const IndividualPO = () => {

    const params = useParams();
    const poNumber = params.poID;

    document.title = poNumber + " | Optioutlet";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Optioutlet" iconSection="Menu" breadcrumbItem={"#" + poNumber} />

                    <PODetails />
                </Container>
            </div>
        </React.Fragment>
    );
};

export default IndividualPO;