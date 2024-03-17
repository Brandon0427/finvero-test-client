import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, Col, Row } from "reactstrap";

const Breadcrumbs = (props) => {

  return (
    <React.Fragment>
      <Row>
        <Col xs="12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-0 font-size-18">{props.breadcrumbItem}</h4>
            <div className="page-title-right">
              <Breadcrumb listClassName="m-0">

                <BreadcrumbItem>
                  <Link to="/"><i className="ri-home-5-fill"></i></Link>
                </BreadcrumbItem>

                <BreadcrumbItem>
                  {(()=> {
                    switch (props.iconSection) {
                      case 'Menu':
                        return (
                          <Link to="/">
                            <i className="mdi mdi-menu"></i>
                          </Link>
                        )

                      case 'Pages':
                        return( 
                          <Link to="/pages-starter">
                            <i className="mdi mdi-book-open-page-variant"></i>
                          </Link>
                        )

                      case 'Components':
                        return( 
                          <Link to="/icons-materialdesign">
                            <i className="mdi mdi-toy-brick"></i>
                          </Link>
                        )
                      
                      default:
                        return( 
                          <Link to="">
                            <i className="mdi mdi-progress-question"></i>
                          </Link>
                        )
                    }
                  }) ()}
                  {/* {props.title} */}
                  {/* <i className="ri-home-5-fill"></i> */}

                </BreadcrumbItem>

                {(props.dropdownSubitem ? 
                    <BreadcrumbItem>
                      <Link to="/">{props.title}</Link>
                    </BreadcrumbItem>
                    : "")}

                <BreadcrumbItem active>
                  <Link to="#">{props.breadcrumbItem}</Link>
                </BreadcrumbItem>

              </Breadcrumb>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
}


export default Breadcrumbs;
