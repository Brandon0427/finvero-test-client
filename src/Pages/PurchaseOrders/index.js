import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";
import PurchaseOrder from "./PurchaseOrder";

import Breadcrumbs from "../../components/Common/Breadcrumb";

import logolight from "../../assets/images/logo-light.png";

import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
  } from "reactstrap";

const PurchaseOrders = () => {
    document.title = "Purchase Orders | Optioutlet";

    const [btnDropdownActions, setBtnDropdownActions] = useState(false);

    return (
        <React.Fragment>

            <header id="page-topbar">
                <div className="navbar-header" style={{backgroundColor:"#212634"}}>
                    <div className="d-flex">
                        <div className="navbar-brand-box text-center">
                            <a href="/" className="logo logo-dark">
                                <span className="logo-lg">
                                    <img src={logolight} alt="logo-dark" height="24" />
                                </span>
                            </a>
                        </div>
                    </div>
                    <Dropdown
                        isOpen={btnDropdownActions}
                        toggle={() => setBtnDropdownActions(!btnDropdownActions)}
                        className="d-inline-block d-sm-inline-block"
                        style={{paddingRight:"50px"}}
                    >
                        <DropdownToggle className="btn header-item waves-effect" tag="button">
                            <i className="mdi mdi-apps font-size-24"/>
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-end">
                            <DropdownItem
                                key="FullInventoryPlanner"
                            >
                                <Link className="dropdown-icon-item" to="/full-inventory-planner">
                                    <p>
                                        Full Inventory Planner
                                    </p>
                                </Link>
                            </DropdownItem>
                            <DropdownItem
                                key="FullInventoryPlanner"
                            >
                                <Link className="dropdown-icon-item" to="/purchase-orders">
                                    <p>
                                        Purchase Orders
                                    </p>
                                </Link>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </header>

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