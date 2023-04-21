import React from "react";
import { Container } from "reactstrap";
import PurchaseOrder from "./PurchaseOrder";

import Breadcrumbs from "../../components/Common/Breadcrumb";

const PurchaseOrders = () => {
    document.title = "Purchase Orders | Optioutlet";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Optioutlet" iconSection="Menu" breadcrumbItem="Purchase Orders" />

                    <PurchaseOrder />
                </Container>
            </div>
        </React.Fragment>
    );
};

export default PurchaseOrders;