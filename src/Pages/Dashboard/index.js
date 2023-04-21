import React from "react";
import UsePanel from "./UserPanel";
import OrderStatus from "./OrderStatus";
import Notifications from "./Notifications";
import SocialSource from "./SocialSource";
import OverView from "./OverView";
import RevenueByLocation from "./RevenueByLocation";
import LatestTransation from "./LatestTransation";

import { Row, Container } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const Dashboard = () => {
  document.title = "Dashboard | Optioutlet";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Optioutlet" iconSection="Menu" breadcrumbItem="Dashboard" />
          
          <Row>
            {/* Overview Chart */}
            <OverView />
            {/* Social Source Chart */}
            <SocialSource />
          </Row>

          {/* User Panel Charts */}
          <UsePanel />

          <Row>
            {/* Order Stats */}
            <OrderStatus />
            {/* Notifications */}
            <Notifications />
            {/* Revenue by Location Vector Map */}
            <RevenueByLocation />
          </Row>

          {/* Latest Transaction Table */}
          <LatestTransation />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
