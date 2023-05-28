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
    Container,
} from 'reactstrap';
import './PODetails.css';

import { useParams } from 'react-router-dom';

import { useSelector } from "react-redux";

import * as XLSX from 'xlsx';
import Template from '../../../assets/documents/Excel Template PO Optioutlet.xlsx';

import qs from 'qs';
import axios from 'axios';

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

import { CSVLink } from 'react-csv';

import { sampleData } from './Data';

let excelJson = [];
let verifiedJson = [];
let activeConfirmButton = false;

const DownloadDetailsButton = () => {
    const params = useParams();

    const [temporaryLoading, setTemporaryLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState();
    const [visibleElement, setVisibleElement] = useState(false);
    const [dataPurchaseOrders, setDataPurchaseOrders] = useState();

    const headers = [
        {label: "Quantity", key: "Quantity"},
        {label: "Line", key: "Line"},
        {label: "Product", key: "Product"},
        {label: "Capacity", key:"Capacity"},
        {label: "Color", key: "Color"},
        {label: "Sphere", key: "Sphere"},
        {label: "Cylinder", key: "Cylinder"},
        {label: "Axis", key: "Axis"},
    ]

    useEffect( () => {
        async function fetchData(){
            const responseAPI = await axios.get("https://mongodb-api-optidashboard.herokuapp.com/purchase-order/" + params.id);
            setDataPurchaseOrders(responseAPI.poDetails);
            setPageNumber(responseAPI.poID)

            setTemporaryLoading(false)
            setVisibleElement(responseAPI.hasOwnProperty("poDetails"));
        }
    
        fetchData();
    }, [])

    async function getData(){
        setTemporaryLoading(true);
        const responseAPI = await axios.get("https://mongodb-api-optidashboard.herokuapp.com/purchase-order/" + params.id);
        setDataPurchaseOrders(responseAPI.details);
        setTemporaryLoading(false);

        //Reloads the page after downloading the document
        document.location.reload();
    }

    return(
        <div>
            {(visibleElement && !temporaryLoading) &&
            <Button color="info" className="">
                <CSVLink
                        headers={headers}
                        data={dataPurchaseOrders}
                        filename={"PO" + pageNumber + " Details | Optioutlet"}
                        style={{ "textDecoration": "none", "color": "#fff" }}
                        asyncOnClick={true}
                        onClick={() => getData()}
                >
                    <i className="mdi mdi-cloud-download"/> Current Data
                </CSVLink>
            </Button>}
        </div>
    )
}

const PODetailsRender = () => {

    const params = useParams();
    let responseAPI;

    const poNumber = useSelector(state => (state.POAlert.poDetailsNumber));
    const poDate = useSelector(state => (state.POAlert.poDetailsDate));
    const poCreator = useSelector(state => (state.POAlert.poDetailsCreator));
    const poStatus = useSelector(state => (state.POAlert.poDetailsStatus));
    const poTitle = useSelector(state => (state.POAlert.poDetailsTitle));
    const poSupplier = useSelector(state => (state.POAlert.poDetailsSupplier));
    const poDescription = useSelector(state => (state.POAlert.poDetailsDescription));
    const poAC = useSelector(state => (state.POAlert.poDetailsAdditionalComments));

    const [temporaryLoading, setTemporaryLoading] = useState(true);

    const [dataPurchaseOrders, setDataPurchaseOrders] = useState({

        title: poTitle,
        poDate: poDate,
        poCreator: poCreator,
        poStatus: poStatus,
        supplier: poSupplier,
        description: poDescription,
        additionalComments: poAC,
    
    });

    useEffect( () => {

        async function fetchData (){
            setTemporaryLoading(true);
            if (poNumber === 0){
                // eslint-disable-next-line react-hooks/exhaustive-deps
                responseAPI = await axios.get("https://mongodb-api-optidashboard.herokuapp.com/purchase-order/" + params.id);
                setDataPurchaseOrders({
                    title: responseAPI.title,
                    poDate: responseAPI.poDate,
                    poCreator: responseAPI.poCreator,
                    poStatus: responseAPI.poStatus,
                    supplier: responseAPI.supplier,
                    description: responseAPI.description,
                    additionalComments: responseAPI.additionalComments,
                });
            }
            setTemporaryLoading(false);
        }

       fetchData();
    }, [])

    return(
        <div>
            <p className="titleCard">
                {params.title}
            </p>
            <Row>
                <Col>
                    <h5>
                        Creation Date:
                    </h5>
                    <p>
                        {temporaryLoading ?
                            poDate :
                            dataPurchaseOrders.poDate
                            }
                    </p>
                </Col>
                <Col>
                    <h5>
                        Creator:
                    </h5>
                    <p>
                        {temporaryLoading ?
                            poCreator :
                            dataPurchaseOrders.poCreator
                            }
                    </p>
                </Col>
                <Col>
                    <h5>
                        Supplier:
                    </h5>
                    <p>
                        {temporaryLoading ?
                            poSupplier :
                            dataPurchaseOrders.supplier
                            }
                    </p>
                </Col>
                <Col>
                    <h5>
                        Status:
                    </h5>

                    {(()=> {
                        switch (dataPurchaseOrders.poStatus) {
                            case 'Requested':
                                return( 
                                        <span className="badge badge-soft-info text-uppercase">{dataPurchaseOrders.poStatus}</span>
                                        )
                                                                
                            case 'Waiting':
                                return( 
                                        <span className="badge badge-soft-warning text-uppercase">{dataPurchaseOrders.poStatus}</span>
                                        )

                            case 'Approved':
                                return( 
                                        <span className="badge badge-soft-primary text-uppercase">{dataPurchaseOrders.poStatus}</span>
                                        )

                            case 'Ordered':
                                return( 
                                        <span className="badge badge-soft-primary text-uppercase">{dataPurchaseOrders.poStatus}</span>
                                        )
                                                                
                            case 'Delivered':
                                return( 
                                        <span className="badge badge-soft-success text-uppercase">{dataPurchaseOrders.poStatus}</span>
                                        )

                            case 'Cancelled':
                                return( 
                                        <span className="badge badge-soft-danger text-uppercase">{dataPurchaseOrders.poStatus}</span>
                                        )
                                                                
                            default:
                                return( 
                                        <span className="badge badge-soft-dark text-uppercase">{"Loading"}</span>
                                        )
                                    }
                            })
                    ()}
                </Col>
            </Row>
            <br />
            <Row>

                {(temporaryLoading || dataPurchaseOrders.description !== "") ?
                    <Col>
                        <h5>
                            Description:
                        </h5>
                        <p className="pWrap">
                            {dataPurchaseOrders.description}
                        </p>
                    </Col> : <div />
                }

                {(temporaryLoading || dataPurchaseOrders.additionalComments !== "") ?
                    <Col>
                        <h5>
                            Additional Comments:
                        </h5>
                        <p className="pWrap">
                            {dataPurchaseOrders.additionalComments}
                        </p>
                    </Col> : <div />
                }

            </Row>
            <br />
        </div>
    );
}

const InitialTable = () => {
    const params = useParams();
    const [temporaryLoading, setTemporaryLoading] = useState(true);
    const [dataPurchaseOrders, setDataPurchaseOrders] = useState();

    useEffect( () => {

        async function fetchData (){

            // eslint-disable-next-line react-hooks/exhaustive-deps
            const responseAPI = await axios.get("https://mongodb-api-optidashboard.herokuapp.com/purchase-order/" + params.id);
            setDataPurchaseOrders(responseAPI.poDetails);

            if(typeof responseAPI.poDetails !== "undefined"){
                setTemporaryLoading(false);
            }
            
        }

       fetchData();
    }, [])

    return (
        
        <div className="table-responsive table-card mt-3 mb-1">
            {!temporaryLoading &&
                <table className="table align-middle table-nowrap" id="customerTable">
                <thead className="table-light">
                    <tr>
                        <th className="sort">Quantity</th>
                        <th className="sort">Line</th>
                        <th className="sort">Product</th>
                        <th className="sort">Capacity</th>
                        <th className="sort">Color</th>
                        <th className="sort">Sphere</th>
                        <th className="sort">Cylinder</th>
                        <th className="sort">Axis</th>
                    </tr>
                </thead>

                <tbody className="list form-check-all">
                    {dataPurchaseOrders.map((eachProduct, index) => (
                        <tr key={index}>
                            <td>{eachProduct.Quantity}</td>
                            <td>{eachProduct.Line}</td>
                            <td>{eachProduct.Product}</td>
                            <td>{eachProduct.Capacity}</td>
                            <td>{eachProduct.Color}</td>
                            <td>{eachProduct.Sphere}</td>
                            <td>{eachProduct.Cylinder}</td>
                            <td>{eachProduct.Axis}</td>
                        </tr>
                    ))}
                </tbody>
                
            </table>}
        </div> 
    )
}

const ConfirmChanges = () => {
    
    const params = useParams();
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
                poDetails: verifiedJson
            }),  
            url: ('https://mongodb-api-optidashboard.herokuapp.com/purchase-order/' + params.id)
        }

        try{
            await axios.patch(
                options.url,
                options.data,
                { headers: options.headers })
                .then((response) => {
                    console.log(response);
                  });
                toast.success("Successfully added the PO Details", {});   
        }
        catch(e){
            console.log(e);
            toast.error("PO Details could not be added, try again", {}); 
        }
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
                            onClick={() => elementClicked("Confirm", !confirmButton)}
                            //Este onChange solo lo puse para que no me marque error
                            onChange = {() => elementClicked("", confirmButton)}
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
        }
        this.fileHandler = this.fileHandler.bind(this);
        this.openFileBrowser = this.openFileBrowser.bind(this);
        this.fileInput = React.createRef();
    }

    fileHandler = (event) => {

        event.preventDefault();
        if(event.target.files.length){
            let fileObj = event.target.files[0];
            let fileName = fileObj.name;

            ///////// Converts the data to json //////////
            const reader = new FileReader();
            reader.onload = async (event) => {
                const data = event.target.result;
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                excelJson = XLSX.utils.sheet_to_json(worksheet);

                // console.log("Nueva rutina forEach")

                excelJson.forEach((data, index) => {
                    const foundObject = sampleData.find(({Product}) => Product === data.Product);
                    // console.log("-------------")
                    // console.log(foundObject)

                    //-------------- Error or no error on the input data ------------------
                    //Reviso que haya encontrado el dato y que coincida con el nombre de la marca
                    if ((typeof foundObject == "undefined") ||
                        (data.Line !== foundObject.Line)){
                            data.error = true;
                            data.errorType = "This product may not exist or is incorrectly written"
                        }
                    //Reviso que la propiedad Quantity exista y que tenga una cantidad propia escrita
                    else if((!data.hasOwnProperty("Quantity")) ||
                            (typeof data.Quantity !== "number") ||
                            (data.Quantity < 0)){
                            data.error = true;
                            data.errorType = "The property quantity is incorrectly given or not given at all"
                        }
                    else{
                        switch  (foundObject.Category){
                            case "Lente de Contacto":
                                //Sabiendo a que categoria pertenece, reviso que no se haya llenado informacion en campos que no pertenecen
                                if (data.hasOwnProperty("Capacity") ||
                                    data.hasOwnProperty("Color") ||
                                    data.hasOwnProperty("Cylinder") ||
                                    data.hasOwnProperty("Axis")){
                                        data.error = true;
                                        data.errorType = "Some of the fields given do not exist for this product"
                                    }
                                else{
                                    //Finalmente reviso que la informacion del campo exista en la base de datos
                                    if (!foundObject.Sphere.includes(data.Sphere)){
                                        data.error = true;
                                        data.errorType = "The value given on the field does not exist or is not given"
                                    }
                                    else{
                                        data.error = false;
                                    }
                                }
                                break;

                            case "Lente de Contacto Astigmatismo":
                                if (data.hasOwnProperty("Capacity") ||
                                    data.hasOwnProperty("Color")){
                                        data.error = true;
                                        data.errorType = "Some of the fields given do not exist for this product"
                                    }
                                else{
                                    if (!foundObject.Sphere.includes(data.Sphere) ||
                                        !foundObject.Cylinder.includes(data.Cylinder) ||
                                        !foundObject.Axis.includes(data.Axis)){
                                            data.error = true;
                                            data.errorType = "The value given on some fields do not exist or are not given"
                                        }
                                    else{
                                        data.error = false;
                                    }
                                }
                                break;
                            
                            case "Lente de Contacto de Color":
                                if (data.hasOwnProperty("Capacity") ||
                                    data.hasOwnProperty("Cylinder") ||
                                    data.hasOwnProperty("Axis")){
                                        data.error = true;
                                        data.errorType = "Some of the fields given do not exist for this product"
                                    }
                                else{
                                    if (!foundObject.Color.includes(data.Color) ||
                                        !foundObject.Sphere.includes(data.Sphere)){
                                            data.error = true;
                                            data.errorType = "The value given on some fields do not exist or are not given"
                                        }
                                    else{
                                        data.error = false;
                                    }
                                }
                                break;

                            case "Solución":
                                if (data.hasOwnProperty("Color") ||
                                    data.hasOwnProperty("Sphere") ||
                                    data.hasOwnProperty("Cylinder") ||
                                    data.hasOwnProperty("Axis")){
                                        data.error = true;
                                        data.errorType = "Some of the fields given do not exist for this product"
                                    }
                                else{
                                    if (!foundObject.Capacity.includes(data.Capacity)){
                                        data.error = true;
                                        data.errorType = "The value given on the field does not exist or is not givenn"
                                    }
                                    else{
                                        data.error = false;
                                    }
                                }
                                break;

                            default:
                                break;
                        }
                    }

                    //Solo guardar en la base de datos los datos que no contengan errores
                    if(!data.error){

                        let inputData;
                        switch(foundObject.Category){
                            case "Lente de Contacto":
                                inputData = {
                                    Quantity: parseInt(data.Quantity),
                                    Line: data.Line,
                                    Product: data.Product,
                                    Sphere: data.Sphere
                                }
                                break;
                            
                            case "Lente de Contacto Astigmatismo":
                                inputData = {
                                    Quantity: parseInt(data.Quantity),
                                    Line: data.Line,
                                    Product: data.Product,
                                    Sphere: data.Sphere,
                                    Cylinder: data.Cylinder,
                                    Axis: data.Axis
                                }
                                break;

                            case "Lente de Contacto de Color":
                                inputData = {
                                    Quantity: parseInt(data.Quantity),
                                    Line: data.Line,
                                    Product: data.Product,
                                    Color: data.Color,
                                    Sphere: data.Sphere
                                }
                                break;

                            case "Solución":
                                inputData = {
                                    Quantity: parseInt(data.Quantity),
                                    Line: data.Line,
                                    Product: data.Product,
                                    Capacity: data.Capacity
                                }
                                break;

                            default:
                                break;
                        }
                        verifiedJson = [...verifiedJson, inputData]
                    }


                    //Cuando termina el forEach, activo el dataLoad para poder renderear
                    if(index === (excelJson.length - 1)){
                        //check for file extension and pass only if it is .xlsx and display error message otherwise
                        if(fileName.slice(fileName.lastIndexOf('.')+1) === "xlsx"){
                            // console.log(verifiedJson);
                            activeConfirmButton = true;
                            this.setState({
                                uploadedFileName: fileName,
                                isFormInvalid: false,
                                dataLoaded: true
                            });
                        }    
                        else{
                            activeConfirmButton = false;
                            this.setState({
                                isFormInvalid: true,
                                uploadedFileName: "",
                                dataLoaded: false
                            })
                        }
                    }
                })

            };

            reader.readAsArrayBuffer(event.target.files[0]);
            
        }               
    }



    openFileBrowser = () => {
        this.fileInput.current.click();
    }

    render() {
        return (
        <div>

            <FormGroup row>
                <Label for="exampleFile" xs={6} sm={4} lg={2} size="lg">Upload Data</Label>          
                <Col xs={4} sm={8} lg={10}>                                                     
                    <InputGroup>
                        <Button className="btn-warning" color="white">
                            <a href={Template} download className='templateButton'>
                                <i className="mdi mdi-file-download" /> Template
                            </a>
                        </Button>
                        <Button className="btn-success" style={{color: "white", zIndex: 0}} onClick={this.openFileBrowser.bind(this)}><i className="mdi mdi-microsoft-excel" /> Browse</Button>
                        <input type="file" hidden onChange={this.fileHandler.bind(this)} ref={this.fileInput} onClick={(event)=> { event.target.value = null }} style={{"padding":"10px"}} />                                
                        <Input type="text" className="form-control" value={this.state.uploadedFileName || ""} readOnly invalid={this.state.isFormInvalid} />                                              
                        <FormFeedback>    
                            <Fade in={this.state.isFormInvalid} tag="h6" style={{fontStyle: "italic"}}>
                                Please select a .xlsx file only !
                            </Fade>                                                                
                        </FormFeedback>
                        
                        <DownloadDetailsButton />

                    </InputGroup>   
                </Col>
                                                                
            </FormGroup>


            <Card body outline color="secondary" className="restrict-card"> 
                <CardBody>
                    <PODetailsRender /> 
                    <h5>
                        PO Details:
                    </h5>
                </CardBody>

                {this.state.dataLoaded ?
                    <div className="table-responsive table-card mt-3 mb-1">
                        <table className="table align-middle table-nowrap" id="customerTable">
                            <thead className="table-light">
                                <tr>
                                    <th className="sort">Quantity</th>
                                    <th className="sort">Line</th>
                                    <th className="sort">Product</th>
                                    <th className="sort">Capacity</th>
                                    <th className="sort">Color</th>
                                    <th className="sort">Sphere</th>
                                    <th className="sort">Cylinder</th>
                                    <th className="sort">Axis</th>
                                    <th className="sort">Error</th>
                                </tr>
                            </thead>
                            <tbody className="list form-check-all">
                                {excelJson.map((eachProduct, index) => (
                                    <tr key={index}
                                        className={eachProduct.error && "pError"}>
                                        <td>{eachProduct.Quantity}</td>
                                        <td>{eachProduct.Line}</td>
                                        <td>{eachProduct.Product}</td>
                                        <td>{eachProduct.Capacity}</td>
                                        <td>{eachProduct.Color}</td>
                                        <td>{eachProduct.Sphere}</td>
                                        <td>{eachProduct.Cylinder}</td>
                                        <td>{eachProduct.Axis}</td>
                                        <td>{eachProduct.errorType}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div> 
                    : <InitialTable />
                }       
            </Card>

            {this.state.dataLoaded && 
                <ConfirmChanges />
            }

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
        );
    }
}

export default PODetails;