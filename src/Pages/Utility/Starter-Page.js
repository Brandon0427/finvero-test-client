import React from 'react';

import { Container } from 'reactstrap';

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";


const StarterPage = () => {
    document.title = "Starter | Optioutlet";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Utility" iconSection="Pages" breadcrumbItem="Starter Page" dropdownSubitem = {true}/>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default StarterPage;