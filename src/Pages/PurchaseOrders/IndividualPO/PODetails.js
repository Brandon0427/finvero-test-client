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
    Progress
} from 'reactstrap';
import './PODetails.css';

import { useParams } from 'react-router-dom';

import { useSelector } from "react-redux";

import * as XLSX from 'xlsx';
import Template from '../../../assets/documents/Excel Template PO Optioutlet.xlsx';

import qs from 'qs';
import axios from 'axios';

import env from "react-dotenv";

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

import { CSVLink } from 'react-csv';

import { sampleData } from './Data';

import { NumericFormat } from 'react-number-format';

///////// Partials Import ///////////
import DropFileZone from './Partials/DropFileZone/DropFileZone'

const MAX_PO_COST_WITH_NO_AUTHORIZATION = 100000;

let excelJson = [];
let verifiedJson = [];
let activeConfirmButton = false;
let totalCost = 0;
let mainStatus;

const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

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
        {label: "Unit Price", key: "UnitPrice"},
    ]

    useEffect( () => {
        async function fetchData(){
            const responseAPI = await axios.get(env.MONGO_DB_SERVER + '/purchase-order/' + params.id);
            setDataPurchaseOrders(responseAPI.poDetails);
            setPageNumber(responseAPI.poID)

            setTemporaryLoading(false)
            setVisibleElement(responseAPI.hasOwnProperty("poDetails"));
        }
    
        fetchData();
    }, [])

    async function getData(){
        setTemporaryLoading(true);
        const responseAPI = await axios.get(env.MONGO_DB_SERVER + '/purchase-order/' + params.id);
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
                responseAPI = await axios.get(env.MONGO_DB_SERVER + '/purchase-order/' + params.id);
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
    const [dataPOStatus, setDataPOStatus] = useState("Loading");
    const [toggleAll, setToggleAll] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showSaveButton, setShowSaveButton] = useState(false);

    let [totalArrived, setTotalArrived] = useState(0);
    let [totalMissing, setTotalMissing] = useState(0);
    let [totalExtra, setTotalExtra] = useState(0);
    let [totalQuantity, setTotalQuantity] = useState(0);

    let [arrivedProgressBar, setArrivedProgressBar] = useState(0);
    let [missingProgressBar, setMissingProgressBar] = useState(0);
    let [extraProgressBar, setExtraProgressBar] = useState(0);

    let responseAPI;

    useEffect( () => {

        async function fetchData (){
            let countTogglesBoolean = true;

            // eslint-disable-next-line react-hooks/exhaustive-deps
            responseAPI = await axios.get(env.MONGO_DB_SERVER + '/purchase-order/' + params.id);

            if(responseAPI.hasOwnProperty("poDetails")){
                responseAPI.poDetails.forEach((detail, index) => {
                    detail.checkedItem = false;
                    //If the property DeliveredQuantity doesnt yet exist, implement it on every item
                    if(!detail.hasOwnProperty("DeliveredQuantity")){
                        detail.DeliveredQuantity = 0;
                        countTogglesBoolean = false;
                    } else if (detail.DeliveredQuantity === detail.Quantity){
                        detail.checkedItem = true;
                    } 
                    
                    if(detail.DeliveredQuantity !== detail.Quantity && countTogglesBoolean){
                        countTogglesBoolean = false;
                    }

                    detail.QuantityClassName = classNameStatusQuantityFunction(parseInt(detail.DeliveredQuantity), parseInt(detail.Quantity), "ClassName");
                    detail.QuantityStatus = classNameStatusQuantityFunction(parseInt(detail.DeliveredQuantity), parseInt(detail.Quantity), "Status");

                    totalQuantity += parseInt(detail.Quantity);

                    switch(detail.QuantityStatus){
                        case "Incomplete":
                            totalArrived += parseInt(detail.DeliveredQuantity);
                            totalMissing += (parseInt(detail.Quantity) - parseInt(detail.DeliveredQuantity));
                            break;
                        
                        case "Complete":
                            totalArrived += parseInt(detail.Quantity);
                            break;

                        case "Extra":
                            totalArrived += parseInt(detail.Quantity);
                            totalExtra +=  (parseInt(detail.DeliveredQuantity) - parseInt(detail.Quantity));
                            break;

                        default:
                            break;
                    }
                })

                setDataPurchaseOrders(responseAPI.poDetails);
                setTotalPrice(responseAPI.totalCost);
                setDataPOStatus(responseAPI.poStatus);

                setQuantitiesAndProgressBar(totalQuantity, totalArrived, totalMissing, totalExtra);

                setToggleAll(countTogglesBoolean);

                if(typeof responseAPI.poDetails !== "undefined"){
                    setTemporaryLoading(false);
                }
                
            }    
            
        }

        fetchData();
    }, [])

    function setQuantitiesAndProgressBar(totalQuantity, totalArrived, totalMissing, totalExtra){
        arrivedProgressBar = (totalArrived / totalQuantity) * 100;
        missingProgressBar = (totalMissing / totalQuantity) * 100;
        extraProgressBar = (totalExtra / totalQuantity) * 100;

        setTotalQuantity(totalQuantity);
        setTotalArrived(totalArrived);
        setTotalMissing(totalMissing);
        setTotalExtra(totalExtra);

        setArrivedProgressBar(arrivedProgressBar);
        setMissingProgressBar(missingProgressBar);
        setExtraProgressBar(extraProgressBar);
    }

    function classNameStatusQuantityFunction(DeliveredQuantity, QuantityOrdered, responseSelector){
        let QuantityClassName, QuantityStatusName;
        if(DeliveredQuantity < QuantityOrdered){
            QuantityClassName = "badge badge-soft-danger text-uppercase";
            QuantityStatusName = "Incomplete";
        }
        else if (DeliveredQuantity == QuantityOrdered){
            QuantityClassName =  "badge badge-soft-primary text-uppercase";
            QuantityStatusName = "Complete";
        }
        else if (DeliveredQuantity > QuantityOrdered){
            QuantityClassName = "badge badge-soft-warning text-uppercase";
            QuantityStatusName = "Extra";
        }
        else{
            QuantityClassName =  "";
            QuantityStatusName = "Loading";
        }

        switch(responseSelector){
            case "ClassName":
                return QuantityClassName;

            case "Status":
                return QuantityStatusName;

            default:
                return "";
        }
    }

    //Funcion que determina la cantidad entregada basada en checkmarks
    async function tog_list(checklistIndex, allItems, checkValue) {
        //Si funciona esta metofologia como esta implementada, pero tarda en operar el toggle all, por eso el cambio en valor (si se lee el checkedItem)
        //se ve reflejado hasta la siguiente vez que se pulsa
        // console.log(dataPurchaseOrders);
        if(allItems){
            const newState = dataPurchaseOrders.map(obj => {
                if(checkValue){
                    setQuantitiesAndProgressBar(totalQuantity, totalQuantity, 0, 0);
                    setShowSaveButton(true);
                    return {...obj, checkedItem: checkValue, DeliveredQuantity: obj.Quantity, QuantityClassName: "badge badge-soft-primary text-uppercase", QuantityStatus: "Complete"}
                }
                else{
                    setQuantitiesAndProgressBar(totalQuantity, 0, totalQuantity, 0);
                    setShowSaveButton(true);
                    return {...obj, checkedItem: checkValue, DeliveredQuantity: 0, QuantityClassName: "badge badge-soft-danger text-uppercase", QuantityStatus: "Incomplete"}
                }
            })
            setDataPurchaseOrders(newState);
            setToggleAll(checkValue);
        }
        else{
            let countTogglesBoolean = checkValue;
            const newState = dataPurchaseOrders.map((obj, index) => {
                if (checklistIndex === index){
                    if(checkValue){
                        totalArrived = quantityChangeEvaluate(obj.Quantity, obj.DeliveredQuantity, obj.Quantity, "Arrived", totalArrived, totalMissing, totalExtra);
                        totalMissing = quantityChangeEvaluate(obj.Quantity, obj.DeliveredQuantity, obj.Quantity, "Missing", totalArrived, totalMissing, totalExtra);
                        totalExtra = quantityChangeEvaluate(obj.Quantity, obj.DeliveredQuantity, obj.Quantity, "Extra", totalArrived, totalMissing, totalExtra);
                        return {...obj, checkedItem: checkValue, DeliveredQuantity: obj.Quantity, QuantityClassName: "badge badge-soft-primary text-uppercase", QuantityStatus: "Complete"}
                    }
                    else{
                        totalArrived = quantityChangeEvaluate(obj.Quantity, obj.DeliveredQuantity, 0, "Arrived", totalArrived, totalMissing, totalExtra);
                        totalMissing = quantityChangeEvaluate(obj.Quantity, obj.DeliveredQuantity, 0, "Missing", totalArrived, totalMissing, totalExtra);
                        totalExtra = quantityChangeEvaluate(obj.Quantity, obj.DeliveredQuantity, 0, "Extra", totalArrived, totalMissing, totalExtra);
                        return {...obj, checkedItem: checkValue, DeliveredQuantity: 0, QuantityClassName: "badge badge-soft-danger text-uppercase", QuantityStatus: "Incomplete"}
                    }
                }

                if(!obj.checkedItem && countTogglesBoolean){
                    countTogglesBoolean = false;
                }

                return obj;
            })
            setDataPurchaseOrders(newState);

            setQuantitiesAndProgressBar(totalQuantity, totalArrived, totalMissing, totalExtra);
            setShowSaveButton(true);

            setToggleAll(countTogglesBoolean);
        }
    }

    const handleInputChange = (event) => {
        let justNumbersOnInput = true;
        let textValue = String(event.target.value).trim();
        const index = parseInt(event.target.name);

        if(textValue.length !== 0){
            //Checo que el input tenga una longitud > 0, de ser asi comienzo el proceso de revisar que los caracteres sean solo numericos
            for(let i = 0; i < textValue.length ; i++){
                if(justNumbersOnInput){
                    justNumbersOnInput = numbers.includes(textValue.charAt(i));
                }
            }
        }
        else {
            //De no ser asi, asigno automaticamente el valor 0
            textValue = 0;
        }
    
        if(justNumbersOnInput){
            textValue = parseInt(textValue);
            deliveredQuantityChange(index, "Input", textValue);
        }
    }

    function quantityChangeEvaluate(totalQ, previousQ, newQ, selector, totalArrived, totalMissing, totalExtra){

        totalQ = parseInt(totalQ);
        previousQ = parseInt(previousQ);
        newQ = parseInt(newQ);
        totalArrived = parseInt(totalArrived);
        totalMissing = parseInt(totalMissing);
        totalExtra = parseInt(totalExtra);

        const prevRemaining = (previousQ - totalQ);

        if(newQ < totalQ){
            if(prevRemaining > 0){
                totalArrived += newQ - totalQ;
                totalExtra += totalQ - previousQ;
                totalMissing += totalQ - newQ;
            } else if (prevRemaining < 0){
                totalArrived += newQ - previousQ;
                totalMissing += previousQ - newQ;
            } else{
                totalArrived += newQ - totalQ;
                totalMissing += previousQ - newQ;
            } 
        }

        else if (newQ == totalQ){
            if(prevRemaining > 0){
                totalExtra += totalQ - previousQ;
            } else if(prevRemaining < 0){
                totalArrived += totalQ - previousQ;
                totalMissing += prevRemaining;
            } else{
                totalMissing += prevRemaining;
            }

        }

        else{
            if(prevRemaining > 0){
                totalExtra += (totalQ - previousQ) + (newQ - totalQ);
            }
            else if (prevRemaining < 0){
                totalArrived += totalQ - previousQ;
                totalExtra += newQ - totalQ;
                totalMissing += prevRemaining;
            } else {
                totalExtra += newQ - totalQ;
                totalMissing += prevRemaining;
            }
        }

        switch(selector){
            case "Arrived":
                return totalArrived;
                
            case "Missing":
                return totalMissing;
                
            case "Extra":
                return totalExtra;
                
            default:
                return 0;
        }
    }

    async function deliveredQuantityChange(index, ButtonPressed, inputValue){
        let countTogglesBoolean = true;
        
        const newState = dataPurchaseOrders.map((obj, indexMap) => {

            if (index === indexMap){
                switch(ButtonPressed){
                    case "Plus":
                        obj.DeliveredQuantity++;
                        totalArrived = quantityChangeEvaluate(obj.Quantity, (obj.DeliveredQuantity - 1), obj.DeliveredQuantity, "Arrived", totalArrived, totalMissing, totalExtra);
                        totalMissing = quantityChangeEvaluate(obj.Quantity, (obj.DeliveredQuantity - 1), obj.DeliveredQuantity, "Missing", totalArrived, totalMissing, totalExtra);
                        totalExtra = quantityChangeEvaluate(obj.Quantity, (obj.DeliveredQuantity - 1), obj.DeliveredQuantity, "Extra", totalArrived, totalMissing, totalExtra);
                    break;

                    case "Minus":
                        if(obj.DeliveredQuantity > 0){
                            obj.DeliveredQuantity--;
                            totalArrived = quantityChangeEvaluate(obj.Quantity, (obj.DeliveredQuantity + 1), obj.DeliveredQuantity, "Arrived", totalArrived, totalMissing, totalExtra);
                            totalMissing = quantityChangeEvaluate(obj.Quantity, (obj.DeliveredQuantity + 1), obj.DeliveredQuantity, "Missing", totalArrived, totalMissing, totalExtra);
                            totalExtra = quantityChangeEvaluate(obj.Quantity, (obj.DeliveredQuantity + 1), obj.DeliveredQuantity, "Extra", totalArrived, totalMissing, totalExtra);
                        }   
                    break;

                    case "Input":
                        totalArrived = quantityChangeEvaluate(obj.Quantity, obj.DeliveredQuantity, inputValue, "Arrived", totalArrived, totalMissing, totalExtra);
                        totalMissing = quantityChangeEvaluate(obj.Quantity, obj.DeliveredQuantity, inputValue, "Missing", totalArrived, totalMissing, totalExtra);
                        totalExtra = quantityChangeEvaluate(obj.Quantity, obj.DeliveredQuantity, inputValue, "Extra", totalArrived, totalMissing, totalExtra);
                        obj.DeliveredQuantity = inputValue;
                    break;

                    default:
                    break;
                }
                obj.QuantityClassName = classNameStatusQuantityFunction(obj.DeliveredQuantity, obj.Quantity, "ClassName");
                obj.QuantityStatus = classNameStatusQuantityFunction(obj.DeliveredQuantity, obj.Quantity, "Status");
                //Check or uncheck the box if the QuantityDelivered is reached by pressing the buttons
                if(obj.QuantityStatus === "Complete"){
                    obj.checkedItem = true;
                }
                else{
                    obj.checkedItem = false;
                }
            }

            if (!obj.checkedItem && countTogglesBoolean){
                countTogglesBoolean = false;
            }
            return obj;
        
        })
    
        setDataPurchaseOrders(newState);

        setQuantitiesAndProgressBar(totalQuantity, totalArrived, totalMissing, totalExtra);
        setShowSaveButton(true);
        setToggleAll(countTogglesBoolean);
        // console.log(dataPurchaseOrders[0].Quantity);
        // console.log(dataPurchaseOrders[0].DeliveredQuantity);
    }

    async function saveQuantities(inputData){
        
        inputData.forEach((data) => {
            delete data.QuantityClassName;
            delete data.QuantityStatus;
            delete data.checkedItem;
        })

        if(totalMissing > 0){
            mainStatus = "Ordered";
        }
        else{
            mainStatus = "Delivered";
        }

        const options = {
            method: "PATCH",
            headers: {
                Accept: "*/*",
                "Content-Type": "application/x-www-form-urlencoded",
                "Access-Control-Allow-Origin": "*",
            },
            data: qs.stringify({
                poDetails: inputData,
                poStatus: mainStatus
            }),  
            url: (env.MONGO_DB_SERVER + '/purchase-order/' + params.id)
        }

        try{

            await axios.patch(
                options.url,
                options.data,
                { headers: options.headers })
                .then((response) => {
                    console.log(response);
                  });
                // toast.success("Successfully added the PO Details", {});   
        }
        catch(e){
            console.log(e);
            toast.error("PO Details could not be added, try again", {}); 
        }
        finally{
            document.location.reload();
        }
    }

    return (
        <Col>
            <Container>
                <div>
                    {(!temporaryLoading && (dataPOStatus === "Ordered" || dataPOStatus === "Delivered")) &&

                        <Progress multi>

                            {(dataPOStatus === "Ordered") ?
                                <Progress animated bar color="primary" value={arrivedProgressBar} /> :
                                <Progress bar color="primary" value={arrivedProgressBar} />
                            }

                            <Progress animated bar color="danger" value={missingProgressBar} />
                            <Progress bar color="warning" value={extraProgressBar} />

                        </Progress>

                    }
                </div>
                <div className='justify-content-center' style={{ textAlign: "center"}}>
                    {(!temporaryLoading && (dataPOStatus === "Ordered" || dataPOStatus === "Delivered")) &&
                        <Row>
                            <Col className='iconsElementsBar'>
                                <div className="avatar-xs align-self-center me-3"
                                    style={{paddingLeft: "50%"}}>
                                    <div className="avatar-title rounded-circle bg-light text-primary font-size-22">
                                        <i className="mdi mdi-eye-check"/>
                                    </div>
                                </div>

                                <p className="text-muted mb-2">Arrived: {totalArrived}/{totalQuantity}</p>
                            </Col>

                            <Col className='iconsElementsBar'>
                                <div className="avatar-xs align-self-center me-3"
                                    style={{paddingLeft: "50%"}}>
                                    <div className="avatar-title rounded-circle bg-light text-danger font-size-22">
                                        <i className="mdi mdi-eye-remove" />
                                    </div>
                                </div>
                                
                                <p className="text-muted mb-2">Missing: {totalMissing}</p>
                            </Col>

                            <Col className='iconsElementsBar'>
                                <div className="avatar-xs align-self-center me-3"
                                    style={{paddingLeft: "50%"}}>
                                    <div className="avatar-title rounded-circle bg-light text-warning font-size-22">
                                        <i className="mdi mdi-eye-circle" />
                                    </div>
                                </div>
                                
                                <p className="text-muted mb-2">Extra: {totalExtra}</p>
                            </Col>
                        </Row>
                    }
                </div>
            </Container>

            <div className="table-responsive table-card mt-3 mb-1">
                {!temporaryLoading &&
                <table className="table align-middle table-nowrap" id="customerTable">
                    <thead className="table-light">
                        <tr>

                            {(dataPOStatus === "Ordered") ?
                                <th scope="col" style={{ width: "50px" }}>
                                    <div className="form-check">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id="checkAll"
                                            onClick={() => tog_list(0, true, !toggleAll)}
                                            onChange={() => tog_list(0, true, !toggleAll)}
                                            value={toggleAll}
                                            checked={toggleAll}
                                        />
                                    </div>
                                </th> : ""
                            }

                            <th className="sort">Quantity</th>
                            <th className="sort">Line</th>
                            <th className="sort">Product</th>
                            <th className="sort">Capacity</th>
                            <th className="sort">Color</th>
                            <th className="sort">Sphere</th>
                            <th className="sort">Cylinder</th>
                            <th className="sort">Axis</th>
                            <th className="sort">Unit Price</th>
                            <th className="sort">Total</th>
                        </tr>
                    </thead>

                    <tbody className="list form-check-all">
                        {dataPurchaseOrders.map((eachProduct, index) => (
                            <tr key={index}>

                                {(dataPOStatus === "Ordered") ?
                                        <th scope="row">
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="checkbox" 
                                                    name="chk_child" 
                                                    onClick={() => tog_list(index, false, !eachProduct.checkedItem)}
                                                    onChange={() => tog_list(index, false, !eachProduct.checkedItem)}
                                                    value={eachProduct.checkedItem}
                                                    checked={eachProduct.checkedItem}
                                                />
                                            </div>
                                        </th>   
                                    : ""
                                }

                                {(dataPOStatus === "Ordered") &&

                                    <td>

                                        <InputGroup>
                                            <div
                                                className="input-group-append"
                                                onClick={() => { deliveredQuantityChange(index, "Minus") }}
                                            >
                                                <Button type="button" color="primary" className='btn-sm'>
                                                    <i className="mdi mdi-minus" />
                                                </Button>
                                            </div>

                                            <input
                                                className="form-control form-control-sm"
                                                value={eachProduct.DeliveredQuantity}
                                                name={index}
                                                onChange={handleInputChange}
                                            />
                                            <span className="input-group-append">
                                                <span className="input-group-text" style={{height: "29px", fontSize: "0.8rem"}} >/{eachProduct.Quantity}</span>
                                            </span>

                                            <div
                                                className="input-group-append"
                                                onClick={() => {
                                                    deliveredQuantityChange(index, "Plus");
                                                }}
                                            >
                                                <Button type="button" color="primary" className='btn-sm'>
                                                    <i className="mdi mdi-plus" />
                                                </Button>
                                            </div>
                                        </InputGroup>

                                        <span className={eachProduct.QuantityClassName}>
                                            {eachProduct.QuantityStatus}
                                        </span>
                                    </td>
                                }

                                {(dataPOStatus === "Delivered") && 
                                    <td style={{paddingLeft:"1.75%"}} className='pWarning'>
                                        <span className={eachProduct.QuantityClassName + ""} style={{fontSize: "0.9rem"}}>
                                            {eachProduct.DeliveredQuantity}/{eachProduct.Quantity}
                                        </span>
                                    </td>}
                                {(dataPOStatus !== "Delivered" && dataPOStatus !== "Ordered") && <td>{eachProduct.Quantity}</td>}

                                <td>{eachProduct.Line}</td>
                                <td>{eachProduct.Product}</td>
                                <td>{eachProduct.Capacity}</td>
                                <td className={String(eachProduct.Color).replaceAll(/\s+/g, '')}>
                                    {(typeof eachProduct.Color !== "undefined") &&
                                        <span className={String(eachProduct.Color).replaceAll(/\s+/g, '') + " personalizedSpan"}>{String(eachProduct.Color).toUpperCase()}</span>
                                    }
                                </td>
                                <td>{eachProduct.Sphere}</td>
                                <td>{eachProduct.Cylinder}</td>
                                <td>{eachProduct.Axis}</td>
                                <td>
                                    <NumericFormat value={Number(eachProduct.UnitPrice).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                </td>
                                <td>
                                    <NumericFormat value={Number(eachProduct.Quantity * eachProduct.UnitPrice).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                </td>
                            </tr>
                        ))}
                        <tr>
                            {/* Como la checkbox solo aparecera en ese status, si es que se tiene, el total se debe mover una columna */}
                            {(dataPOStatus === "Ordered") ?
                                <td/> : ""}
                            <td/>
                            <td/>
                            <td/>
                            <td/>
                            <td/>
                            <td/>
                            <td/>
                            <td/>
                            <td style={{fontWeight: "bold"}}>Total:</td>
                            <td style={{fontWeight: "bold"}}>
                                <NumericFormat value={Number(totalPrice).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                            </td>
                        </tr>
                    </tbody>
                </table>}
            </div>

            {showSaveButton &&
                <button type="button" className="btn btn-outline-success btn-lg" style={{marginLeft: "87.5%", marginTop:"30px"}} onClick={() => {saveQuantities(dataPurchaseOrders)}}>
                <i className="mdi mdi-content-save-all" /> Save
            </button>
            }
        </Col>

    )
}

const ConfirmChanges = () => {
    const params = useParams();
    const [confirmButton, setConfirmButton] = useState(false);
    const [activeSubmitButton, setActiveSubmitButton] = useState(false);

    async function handleSubmit (){
        console.log(mainStatus)
        if (totalCost <= MAX_PO_COST_WITH_NO_AUTHORIZATION){
            mainStatus = "Approved";
        }
        else if (totalCost > MAX_PO_COST_WITH_NO_AUTHORIZATION){
            mainStatus = "Waiting";
        }
        console.log(mainStatus)

        const options = {
            method: "PATCH",
            headers: {
                Accept: "*/*",
                "Content-Type": "application/x-www-form-urlencoded",
                "Access-Control-Allow-Origin": "*",
            },
            data: qs.stringify({
                totalCost: totalCost,
                poDetails: verifiedJson,
                poStatus: mainStatus
            }),  
            url: (env.MONGO_DB_SERVER + '/purchase-order/' + params.id)
        }

        try{

            await axios.patch(
                options.url,
                options.data,
                { headers: options.headers })
                .then((response) => {
                    console.log(response);
                  });
                // toast.success("Successfully added the PO Details", {});   
        }
        catch(e){
            console.log(e);
            toast.error("PO Details could not be added, try again", {}); 
        }
        finally{
            document.location.reload();
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
                            className="form-check-label customConfirmSwitch"
                            htmlFor="customSwitch1"
                            // style={{fontSize:0.85+"rem", width:70+"%", height:"auto"}}
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
            poIsOrdered: true,
            thereIsInitialData: true
        }
        this.fileHandler = this.fileHandler.bind(this);
        this.openFileBrowser = this.openFileBrowser.bind(this);
        this.fileInput = React.createRef();
    }

    componentDidMount(){
        //Como no se puede utilizar el metodo useParams() en una clase, utilizo Vanilla Js para obtener el url y de ahi extraigo la informacion deseada por medio de los separadores de categoria "/"
        const id = window.location.href.split('/')[6]
        axios.get(env.MONGO_DB_SERVER + '/purchase-order/' + id).then(({poStatus}) => {
            if(poStatus === "Ordered" || poStatus === "Delivered"){
                this.setState({poIsOrdered: true});
            }
            else{ 
                this.setState({poIsOrdered: false});
            }

            if(poStatus === "Requested"){
                this.setState({thereIsInitialData: false});
            }
            else{ 
                this.setState({thereIsInitialData: true});
            }
        });
    }

    fileHandler = (event) => {

        totalCost = 0;
        event.preventDefault();

        // console.log(event.target.files);
        if(event.target.files.length){
            let fileObj = event.target.files[0];
            let fileName = fileObj.name;

            ///////// Converts the data to json //////////
            const reader = new FileReader();
            reader.onload = async (event) => {
                const data = event.target.result;

                console.log(data);

                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                excelJson = XLSX.utils.sheet_to_json(worksheet);

                excelJson.forEach((data, index) => {
                    const foundObject = sampleData.find(({Product}) => Product === data.Product);

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
                                        if(!data.hasOwnProperty("UnitPrice")){
                                            data.UnitPrice = foundObject.UnitPrice;
                                        }
                                        data.totalCost = (data.Quantity * data.UnitPrice);
                                        totalCost += data.totalCost;
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
                                        if(!data.hasOwnProperty("UnitPrice")){
                                            data.UnitPrice = foundObject.UnitPrice;
                                        }
                                        data.totalCost = (data.Quantity * data.UnitPrice);
                                        totalCost += data.totalCost;
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
                                        if(!data.hasOwnProperty("UnitPrice")){
                                            data.UnitPrice = foundObject.UnitPrice;
                                        }
                                        data.totalCost = (data.Quantity * data.UnitPrice);
                                        totalCost += data.totalCost;
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
                                        if(!data.hasOwnProperty("UnitPrice")){
                                            // Como estas variantes de capacidad si afectan el precio, genere una logica que encuentra el precio acorde a su variante
                                            let foundIndex = -1;
                                            foundObject.Capacity.forEach((eachVariant, index) => {
                                                if ((foundIndex < 0) && (data.Capacity === eachVariant)){
                                                    foundIndex = index;
                                                }
                                            })
                                            data.UnitPrice = foundObject.UnitPrice[foundIndex];
                                        }
                                        data.totalCost = (data.Quantity * data.UnitPrice);
                                        totalCost += data.totalCost;
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
                                    UnitPrice: data.UnitPrice,
                                    Sphere: data.Sphere
                                }
                                break;
                            
                            case "Lente de Contacto Astigmatismo":
                                inputData = {
                                    Quantity: parseInt(data.Quantity),
                                    Line: data.Line,
                                    Product: data.Product,
                                    UnitPrice: data.UnitPrice,
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
                                    UnitPrice: data.UnitPrice,
                                    Color: data.Color,
                                    Sphere: data.Sphere
                                }
                                break;

                            case "Solución":
                                inputData = {
                                    Quantity: parseInt(data.Quantity),
                                    Line: data.Line,
                                    Product: data.Product,
                                    UnitPrice: data.UnitPrice,
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

    handleAcceptedFiles = (files) => {
        this.fileInput.current = files;
    }

    render() {
        return (
            <div>

                {this.state.poIsOrdered ? 
                    <div>
                        <DownloadDetailsButton />
                        <br/>
                    </div> :
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
                }
                


                <Card body outline color="secondary" className="restrict-card"> 
                    <CardBody>
                        <PODetailsRender /> 
                        <h5>
                            PO Details:
                        </h5>
                    </CardBody>

                    {this.state.dataLoaded &&
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
                                        <th className="sort">Unit Price</th>
                                        <th className="sort">Total</th>
                                        <th className="sort">Error</th>
                                    </tr>
                                </thead>
                                <tbody className="list form-check-all">
                                    {excelJson.map((eachProduct, index) => (
                                        <tr key={index}
                                            className={eachProduct.error ? "pError" : ""}>
                                            <td>{eachProduct.Quantity}</td>
                                            <td>{eachProduct.Line}</td>
                                            <td>{eachProduct.Product}</td>
                                            <td>{eachProduct.Capacity}</td>
                                            <td className={String(eachProduct.Color).replaceAll(/\s+/g, '')}>
                                                {(typeof eachProduct.Color !== "undefined") &&
                                                    <span className={String(eachProduct.Color).replaceAll(/\s+/g, '') + " personalizedSpan"}>{String(eachProduct.Color).toUpperCase()}</span>
                                                }
                                            </td>
                                            <td>{eachProduct.Sphere}</td>
                                            <td>{eachProduct.Cylinder}</td>
                                            <td>{eachProduct.Axis}</td>
                                            <td>
                                                <NumericFormat value={Number(eachProduct.UnitPrice).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                            </td>
                                            <td>
                                                <NumericFormat value={Number(eachProduct.totalCost).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                            </td>
                                            <td>{eachProduct.errorType}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td/>
                                        <td/>
                                        <td/>
                                        <td/>
                                        <td/>
                                        <td/>
                                        <td/>
                                        <td/>
                                        <td style={{fontWeight: "bold"}}>Total:</td>
                                        <td style={{fontWeight: "bold"}}>
                                            <NumericFormat value={Number(totalCost).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                        </td>
                                        <td/>
                                    </tr>
                                </tbody>
                            </table>
                            <ConfirmChanges />
                        </div> 
                    }
                    {!this.state.dataLoaded && 
                        <div>
                            <InitialTable/>

                            {!this.state.thereIsInitialData && 
                                <DropFileZone/>
                            }

                        </div>
                        
                    }       
                </Card>

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