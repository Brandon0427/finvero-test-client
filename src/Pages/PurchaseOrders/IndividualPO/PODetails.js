import React, { Component, useState, useEffect } from 'react';
import { 
    Col, 
    Input, 
    InputGroup, 
    FormGroup, 
    Label, 
    Button, 
    Fade, 
    FormFeedback, 
    Card,
    CardBody,
    Row,
    Container
} from 'reactstrap';
import './PODetails.css';

import { useSelector } from "react-redux";
import { ExcelRenderer} from 'react-excel-renderer';
import * as XLSX from 'xlsx';
import Template from '../../../assets/documents/Excel Template PO Optioutlet.xlsx';

import qs from 'qs';
import axios from 'axios';

let excelJson = [];
let data = {}
let activeConfirmButton = false;

const PODetailsRender = () => {

    // const poNumber = useSelector(state => (state.POAlert.poDetailsNumber));
    const poID = useSelector(state => (state.POAlert.poDetailsID));
    const poDate = useSelector(state => (state.POAlert.poDetailsDate));
    const poCreator = useSelector(state => (state.POAlert.poDetailsCreator));
    const poStatus = useSelector(state => (state.POAlert.poDetailsStatus));
    // const poTitle = useSelector(state => (state.POAlert.poDetailsTitle));
    const poSupplier = useSelector(state => (state.POAlert.poDetailsSupplier));
    const poDescription = useSelector(state => (state.POAlert.poDetailsDescription));
    const poAC = useSelector(state => (state.POAlert.poDetailsAdditionalComments));

    const [dataPurchaseOrders, setDataPurchaseOrders] = useState({
        poDate: "",
        poCreator: "",
        supplier: "",
        poStatus: "",
        description: "",
        additionalComments: "",
    });

    useEffect( () => {
        const fetchData = async () => {

            const responseDataPurchaseOrders = await axios.get("https://mongodb-api-optidashboard.herokuapp.com/purchase-order/" + poID);
            setDataPurchaseOrders(responseDataPurchaseOrders.data);
            data = responseDataPurchaseOrders;
            excelJson = data.poDetails;

        }
        fetchData();
        
    }, [])

    return(
        <div>
            <Row>
                <Col>
                    <h5>
                        Creation Date:  
                    </h5>
                    <p>
                        {poDate}
                    </p>
                </Col>
                <Col>
                    <h5>
                        Creator:  
                    </h5>
                    <p>
                        {poCreator}
                    </p>
                </Col>
                <Col>
                    <h5>
                        Supplier:  
                    </h5>
                    <p>
                        {poSupplier}
                    </p>
                </Col>
                <Col>
                    <h5>
                        Status:  
                    </h5>

                    {(()=> {
                        switch (poStatus) {
                            case 'Requested':
                                return( 
                                        <span className="badge badge-soft-info text-uppercase">{poStatus}</span>
                                        )
                                                                
                            case 'Waiting':
                                return( 
                                        <span className="badge badge-soft-warning text-uppercase">{poStatus}</span>
                                        )

                            case 'Approved':
                                return( 
                                        <span className="badge badge-soft-primary text-uppercase">{poStatus}</span>
                                        )

                            case 'Ordered':
                                return( 
                                        <span className="badge badge-soft-primary text-uppercase">{poStatus}</span>
                                        )
                                                                
                            case 'Delivered':
                                return( 
                                        <span className="badge badge-soft-success text-uppercase">{poStatus}</span>
                                        )

                            case 'Cancelled':
                                return( 
                                        <span className="badge badge-soft-danger text-uppercase">{poStatus}</span>
                                        )
                                                                
                            default:
                                return( 
                                        <span className="badge badge-soft-dark text-uppercase">{poStatus}</span>
                                        )
                                    }
                            })
                    ()}
                </Col>
            </Row>
            <br />
            <Row>
                <Col>
                    <h5>
                        Description:  
                    </h5>
                    <p className="pWrap">
                        {poDescription}
                    </p>
                </Col>
                <Col>
                    <h5>
                        Additional Comments:
                    </h5>
                    <p className="pWrap">
                        {poAC}
                    </p>
                </Col>
            </Row>
            <br />
        </div>
    );
}

const ConfirmChanges = () => {
    
    const poID = useSelector(state => (state.POAlert.poDetailsID));
    const [confirmButton, setConfirmButton] = useState(false);
    const [activeSubmitButton, setActiveSubmitButton] = useState(false);

    async function handleSubmit (){
        const options = {
            method: "PATCH",
            headers: {
                Accept: "*/*",
                "Content-Type": "application/x-www-form-urlencoded",
                "Access-Control-Allow-Origin": "*",
            },
            data: qs.stringify({
                poDetails: excelJson
            }),  
            url: ('https://mongodb-api-optidashboard.herokuapp.com/purchase-order/' + poID)
        }

        await axios.patch(
            options.url,
            options.data,
            { headers: options.headers })
            .then((response) => {
                console.log(response);
              });
    }

    function elementClicked (element, value){
        switch(element){
            case "Confirm":
                setConfirmButton(value);
                if(!confirmButton){
                    setActiveSubmitButton(true);
                }
                else{
                    setActiveSubmitButton(false);
                }
                break;

            case "Submit":
                handleSubmit();
                activeConfirmButton = false;
                setConfirmButton(false);
                setActiveSubmitButton(false);
                break;

            default:
                break;
        }
    }

    return(
        <Container>
            <Row>
                {activeConfirmButton ?
                    <div className="form-check form-switch mb-3">
                        <label
                            className="form-check-label"
                            htmlFor="customSwitch1"
                            style={{fontSize:0.85+"rem", width:70+"%", height:"auto"}}
                        >
                            Confirm Purchase Order
                        </label>
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="customSwitch1"
                            checked={confirmButton}
                            value={confirmButton}
                            onChange={() => elementClicked("Confirm", !confirmButton)}
                        />                        
                    </div> : ""}

                {activeSubmitButton ? 
                    <div className="d-flex justify-content-end">
                        <Button type="submit" className="btn-success submitButton" color="white" onClick={() => elementClicked("Submit", "")}>
                            Submit
                        </Button> 
                    </div> : ""
                }
                                    
            </Row>
        </Container>
    );
}

class PODetails extends Component {

    constructor(props){
        super(props);
        this.state = {
            isOpen: false,
            dataLoaded: false,
            isFormInvalid: false,
            rows: null,
            cols: null
        }
        this.fileHandler = this.fileHandler.bind(this);
        this.openFileBrowser = this.openFileBrowser.bind(this);
        this.renderFile = this.renderFile.bind(this);
        this.fileInput = React.createRef();
    }

    renderFile = (fileObj) => {
        //just pass the fileObj as parameter
        ExcelRenderer(fileObj, (err, resp) => {
            if(err){
                console.log(err);            
            }
            else{
                this.setState({
                    dataLoaded: true,
                    cols: resp.cols,
                    rows: resp.rows
                });
            }
        }); 
    }

    fileHandler = (event) => {

        event.preventDefault();
        if(event.target.files.length){
            let fileObj = event.target.files[0];
            let fileName = fileObj.name;

            ///////// Converts the data to json //////////
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = event.target.result;
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                excelJson = XLSX.utils.sheet_to_json(worksheet);
                console.log(excelJson);
            };
            reader.readAsArrayBuffer(event.target.files[0]);
            activeConfirmButton = true;
            ///////////////////////////////////////////////
    
            //check for file extension and pass only if it is .xlsx and display error message otherwise
            if(fileName.slice(fileName.lastIndexOf('.')+1) === "xlsx"){
                this.setState({
                    uploadedFileName: fileName,
                    isFormInvalid: false
                });
                this.renderFile(fileObj)
            }    
            else{
                this.setState({
                    isFormInvalid: true,
                    uploadedFileName: ""
                })
            }
        }               
    }

    openFileBrowser = () => {
        this.fileInput.current.click();
    }

    render() {
        return (
        <div>
            <form>
            <FormGroup row>
                <Label for="exampleFile" xs={6} sm={4} lg={2} size="lg">Upload</Label>          
                <Col xs={4} sm={8} lg={10}>                                                     
                    <InputGroup>
                        <Button className="btn-success" color="white">
                            <a href={Template} download className='templateButton'>
                                Download Template
                            </a>
                        </Button>
                        <Button color="info" style={{color: "white", zIndex: 0}} onClick={this.openFileBrowser.bind(this)}><i className="cui-file"></i> Browse&hellip;</Button>
                        <input type="file" hidden onChange={this.fileHandler.bind(this)} ref={this.fileInput} onClick={(event)=> { event.target.value = null }} style={{"padding":"10px"}} />                                
                        <Input type="text" className="form-control" value={this.state.uploadedFileName || ""} readOnly invalid={this.state.isFormInvalid} />                                              
                        <FormFeedback>    
                            <Fade in={this.state.isFormInvalid} tag="h6" style={{fontStyle: "italic"}}>
                                Please select a .xlsx file only !
                            </Fade>                                                                
                        </FormFeedback>
                    </InputGroup>     
                </Col>                                                   
            </FormGroup>
            </form>

            <Card body outline color="secondary" className="restrict-card"> 
                <CardBody>
                    <PODetailsRender />
                    {(this.state.dataLoaded || (excelJson && excelJson.length > 0)) && 
                        <h5>
                            PO Details:
                        </h5>
                    }
                </CardBody>
                {(this.state.dataLoaded || (excelJson && excelJson.length > 0)) && 
                    <div className="table-responsive table-card mt-3 mb-1">
                        <table className="table align-middle table-nowrap" id="customerTable">
                            <thead className="table-light">
                                <tr>
                                    <th className="sort">Quantity</th>
                                    <th className="sort">Line</th>
                                    <th className="sort">Product</th>
                                    <th className="sort">Color</th>
                                    <th className="sort">Sphere</th>
                                    <th className="sort">Cylinder</th>
                                    <th className="sort">Axis</th>
                                </tr>
                            </thead>
                            <tbody className="list form-check-all">
                                {excelJson.map((eachProduct, index) => (
                                    <tr key={index}>
                                        <td>{eachProduct.Quantity}</td>
                                        <td>{eachProduct.Line}</td>
                                        <td>{eachProduct.Product}</td>
                                        <td>{eachProduct.Color}</td>
                                        <td>{eachProduct.Sphere}</td>
                                        <td>{eachProduct.Cylinder}</td>
                                        <td>{eachProduct.Axis}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }       
            </Card>
            {this.state.dataLoaded && 
                <ConfirmChanges />
            }
        </div>
        );
    }
}

export default PODetails;