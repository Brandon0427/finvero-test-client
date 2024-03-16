import React from "react";
import { Container } from "reactstrap";
import FullInventoryPlanner from "./FullInventoryPlanner";

import Breadcrumbs from "../../components/Common/Breadcrumb";

const FullInventoryPlanners = () => {
    document.title = "Full Planner | Optioutlet";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Optioutlet" iconSection="Menu" breadcrumbItem="Full Inventory Planner" />

                    <FullInventoryPlanner />
                </Container>
            </div>
        </React.Fragment>
    );
};

export default FullInventoryPlanners;