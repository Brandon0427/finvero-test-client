import './FullInventoryPlanner.css';
import axios from 'axios';
import Flatpickr from "react-flatpickr";
import classnames from "classnames";
import * as Math from 'mathjs';

import React, { useState, useEffect } from 'react';

import {
    Button,
    Card,
    CardBody,
    Col,
    FormGroup, 
    InputGroup,
    DropdownMenu,
    DropdownItem, 
    DropdownToggle,
    ButtonDropdown,
    Row,
    Progress,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
} from "reactstrap";

import { CSVLink } from 'react-csv';

import env from "react-dotenv";

///////// Partials Import ///////////
import DropFileZone from './Partials/DropFileZone/DropFileZone'
import ConfigurationSettings from './Partials/ConfigurationSettings/ConfigurationSettings';

const today = new Date();
let selected_day = {Start: today.getDate(), End: ""};
let selected_month = {Start: today.toLocaleString('default', { month: 'long' }), End: ""};
let selected_year = {Start: today.getFullYear(), End: ""};
let selected_store = 1;
let selected_just_full = 'Sí';


const FullInventoryPlanner = () => {
    //Configs
    const headers = [
        {label: "MLM", key: "No_Publicacion"},
        {label: "Barcode", key: "Meli_Barcode"},
        {label: "Title", key: "Titulo"},
        {label: "Variant", key:"Variante"},
        {label: "Stock in Full", key: "available_quantity"},
        {label: "Suggested", key: "totalQuantityForFull"}
    ]

    //Variable States Declaration
    const [dataSQLQuery, setDataSQLQuery] = useState([]);
    const [isLoading, setisLoading] =  useState(true);
    const [reloading, setReloading] = useState(false);
    const [totalQuantity, setTotalQuantity] = useState(0);
    let [selected_query, setSelectedQueryState] = useState(0);

    // Element States Declaration
    const [drp_secondary_sm, setDrp_secondary_sm] = useState(false);
    const [dropdownQueryText, setDropdownQueryText] = useState("Total Sales");
    const [drp_secondary_sm_store, setDrp_secondary_sm_store] = useState(false);
    const [dropdownPriorityPercentage, setdropdownPriorityPercentage] = useState(80);
    const [drp_priority_percentage, setDrp_priority_percentage] = useState(false)
    const [dropdownStoreText, setDropdownStoreText] = useState("Optioutlet");
    const [activeTab1, setactiveTab1] = useState("1");
    let [progressbar, setProgressBar] = useState(0);
    const [totalQuantityForFull, setTotalQuantityForFull] = useState(1000);
    const [visiblleDownloadDataButton, setVisibleDownloadDataButton] = useState(false);

    const toggle1 = (tab) => {
        if (activeTab1 !== tab) {
          setactiveTab1(tab);
        }
      };

    // Initialization
    useEffect( () => {
        async function fetchData(){
            let totalSum = 0;
            setProgressBar(100);
            const requestURL = env.MYSQL_DB_SERVER + "/data";
            const responseAPI = await axios.get(requestURL, {params: {selectionQuery: selected_query, store: selected_store, full: selected_just_full}});

            //No se puede utilizar un foreach, debido a que este no funciona con metodos asincronos 
            // let forIndex = 0;
            for(const data of responseAPI){
                
                totalSum += data.TotalVentas;

            }
            setTotalQuantity(totalSum);
            setDataSQLQuery(responseAPI);
            setisLoading(false);
            setProgressBar(0);
        }

        fetchData();
    }, [])

    function DateRangePicker(e){
        selected_day.Start = e[0].getDate();
        selected_month.Start = e[0].toLocaleString('default', { month: 'long' });
        selected_year.Start = e[0].getFullYear();

        selected_day.End = e[1].getDate();
        selected_month.End = e[1].toLocaleString('default', { month: 'long' });
        selected_year.End = e[1].getFullYear();
    }

    async function updateValues(day, month, year, selected_query, selected_store, selected_just_full){
        const months = ['January', 'February', 'March', 'April',
                        'May', 'June', 'July', 'August',
                        'September', 'October', 'November', 'December']
        
        const fullConvertion = 2.5;

        let totalSum = 0;
        let responseAPI = [];
        let responseAPIpreviousYear;
        let responseAPIrecentMonths;
        let finalMixedArray = [];
        let indexesForSplicingFinalMixedArray = [];

        setReloading(true);
        setVisibleDownloadDataButton(false);
        // Just send the necessary data for the necessary query request to the server
        if (selected_query == 0){
            const requestURL = env.MYSQL_DB_SERVER + "/data";
            responseAPI = await axios.get(requestURL, {params: {selectionQuery: selected_query, store: selected_store, full: selected_just_full}});
        }
        else if (day.End !== '' && month.End !== '' && year.End !== ''){
            // Request for previous year with no Full
            const requestURL = env.MYSQL_DB_SERVER + "/data";
            responseAPIpreviousYear = await axios.get(requestURL, {params: {selectionQuery: selected_query, store: selected_store, full: 'No', DateStart: day.Start, MonthStart: (months.indexOf(month.Start) + 1), YearStart: (year.Start - 1), DateEnd: day.End, MonthEnd: (months.indexOf(month.End) + 1), YearEnd: (year.End - 1)}});
            responseAPIpreviousYear.forEach((data) => {
                let dataInsertion = {
                    Active: data.Active,
                    Meli_Barcode: data.Meli_Barcode,
                    Titulo: data.Titulo,
                    Variante: data.Variante,
                    No_Publicacion: data.No_Publicacion,
                    previousYearSalesNotFull: (data.TotalVentas*fullConvertion),
                    previousYearSalesFull: 0,
                    recentMonthsSalesNotFull: 0,
                    recentMonthsSalesFull: 0,
                }
                finalMixedArray.push(dataInsertion);
            });

            // Request for previous year with Full
            responseAPIpreviousYear = await axios.get(requestURL, {params: {selectionQuery: selected_query, store: selected_store, full: 'Sí', DateStart: day.Start, MonthStart: (months.indexOf(month.Start) + 1), YearStart: (year.Start - 1), DateEnd: day.End, MonthEnd: (months.indexOf(month.End) + 1), YearEnd: (year.End - 1)}});            
            responseAPIpreviousYear.forEach((data) => {
                let dataInsertion = {
                    Active: data.Active,
                    Meli_Barcode: data.Meli_Barcode,
                    Titulo: data.Titulo,
                    Variante: data.Variante,
                    No_Publicacion: data.No_Publicacion,
                    previousYearSalesNotFull: 0,
                    previousYearSalesFull: data.TotalVentas,
                    recentMonthsSalesNotFull: 0,
                    recentMonthsSalesFull: 0,
                }
                // Check if the product already exists in the array to add the corresponding value
                for(let i = 0 ; i < finalMixedArray.length ; i++){
                    if(data.Meli_Barcode === finalMixedArray[i]['Meli_Barcode']){
                        finalMixedArray[i]['previousYearSalesFull'] = data.TotalVentas;
                        i = finalMixedArray.length //This acts as a controlled break of the for
                    } else if (i === (finalMixedArray.length - 1)){
                        finalMixedArray.push(dataInsertion);
                        i = finalMixedArray.length //This acts as a controlled break of the for
                    }
                }
            });

            // Request for 3 previous months
            // Como no puede mandar meses negativos checa que el request no caiga de Enero-Marzo
            let recentMonthStart = (months.indexOf(month.Start) + 1);
            let recentYearStart = year.Start;
            if(recentMonthStart == 3){
                recentMonthStart = 12;
                recentYearStart--;
            }
            else if(recentMonthStart == 2){
                recentMonthStart = 11;
                recentYearStart--;
            }
            else if(recentMonthStart == 1){
                recentMonthStart = 10;
                recentYearStart--;
            }
            else{
                recentMonthStart -= 3;
            }

            // Request for previous months with no Full
            responseAPIrecentMonths = await axios.get(requestURL, {params: {selectionQuery: selected_query, store: selected_store, full: 'No', DateStart: 1, MonthStart: recentMonthStart, YearStart: recentYearStart, DateEnd: day.Start, MonthEnd: (months.indexOf(month.Start) + 1), YearEnd: year.Start}});
            responseAPIrecentMonths.forEach((data) => {
                let dataInsertion = {
                    Active: data.Active,
                    Meli_Barcode: data.Meli_Barcode,
                    Titulo: data.Titulo,
                    Variante: data.Variante,
                    No_Publicacion: data.No_Publicacion,
                    previousYearSalesNotFull: 0,
                    previousYearSalesFull: 0,
                    recentMonthsSalesNotFull: (data.TotalVentas*fullConvertion),
                    recentMonthsSalesFull: 0,
                }
                // Check if the product already exists in the array to add the corresponding value
                for(let i = 0 ; i < finalMixedArray.length ; i++){
                    if(data.Meli_Barcode === finalMixedArray[i]['Meli_Barcode']){
                        finalMixedArray[i]['recentMonthsSalesNotFull'] = data.TotalVentas;
                        i = finalMixedArray.length //This acts as a controlled break of the for
                    } else if (i === (finalMixedArray.length - 1)){
                        finalMixedArray.push(dataInsertion);
                        i = finalMixedArray.length //This acts as a controlled break of the for
                    }
                }
            })

            // Request for previous months with Full
            responseAPIrecentMonths = await axios.get(requestURL, {params: {selectionQuery: selected_query, store: selected_store, full: 'Sí', DateStart: 1, MonthStart: recentMonthStart, YearStart: recentYearStart, DateEnd: day.Start, MonthEnd: (months.indexOf(month.Start) + 1), YearEnd: year.Start}});
            responseAPIrecentMonths.forEach((data) => {
                let dataInsertion = {
                    Active: data.Active,
                    Meli_Barcode: data.Meli_Barcode,
                    Titulo: data.Titulo,
                    Variante: data.Variante,
                    No_Publicacion: data.No_Publicacion,
                    previousYearSalesNotFull: 0,
                    previousYearSalesFull: 0,
                    recentMonthsSalesNotFull: 0,
                    recentMonthsSalesFull: data.TotalVentas,
                }
                // Check if the product already exists in the array to add the corresponding value
                for(let i = 0 ; i < finalMixedArray.length ; i++){
                    if(data.Meli_Barcode === finalMixedArray[i]['Meli_Barcode']){
                        finalMixedArray[i]['recentMonthsSalesFull'] = data.TotalVentas;
                        i = finalMixedArray.length //This acts as a controlled break of the for
                    } else if (i === (finalMixedArray.length - 1)){
                        finalMixedArray.push(dataInsertion);
                        i = finalMixedArray.length //This acts as a controlled break of the for
                    }
                }
            })

            let totalPreviousYearSales = {Priority: 0, Normal: 0}, totalRecentMonthsSales = {Priority: 0, Normal: 0};
            finalMixedArray.forEach((finalData, index) => {
                if(finalData.Active === "Sí*"){
                    totalPreviousYearSales['Priority'] += (finalData['previousYearSalesNotFull'] + finalData['previousYearSalesFull']);
                    totalRecentMonthsSales['Priority'] += (finalData['recentMonthsSalesNotFull'] + finalData['recentMonthsSalesFull']);
                }
                else{
                    totalPreviousYearSales['Normal'] += (finalData['previousYearSalesNotFull'] + finalData['previousYearSalesFull']);
                    totalRecentMonthsSales['Normal'] += (finalData['recentMonthsSalesNotFull'] + finalData['recentMonthsSalesFull']);
                }
            })

            const totalPriorityQuantityForFull = Math.round(totalQuantityForFull * (dropdownPriorityPercentage/100));
            const totalNormalQuantityForFull = totalQuantityForFull - totalPriorityQuantityForFull;
            finalMixedArray.forEach((finalData, index) => {
                if(finalData.Active === "Sí*"){
                    finalData['previousYearSalesPercentage'] = ((finalData['previousYearSalesNotFull'] + finalData['previousYearSalesFull']) / totalPreviousYearSales['Priority']) * 100;
                    finalData['recentMonthsSalesPercentage'] = ((finalData['recentMonthsSalesNotFull'] + finalData['recentMonthsSalesFull']) / totalRecentMonthsSales['Priority']) * 100;
                    finalData['totalQuantityForFull'] = Math.round((totalPriorityQuantityForFull*(0.5*finalData['previousYearSalesPercentage']/100) + totalPriorityQuantityForFull*(0.5*finalData['recentMonthsSalesPercentage']/100)));
                }
                else{
                    finalData['previousYearSalesPercentage'] = ((finalData['previousYearSalesNotFull'] + finalData['previousYearSalesFull']) / totalPreviousYearSales['Normal']) * 100;
                    finalData['recentMonthsSalesPercentage'] = ((finalData['recentMonthsSalesNotFull'] + finalData['recentMonthsSalesFull']) / totalRecentMonthsSales['Normal']) * 100;
                    finalData['totalQuantityForFull'] = Math.round((totalNormalQuantityForFull*(0.5*finalData['previousYearSalesPercentage']/100) + totalNormalQuantityForFull*(0.5*finalData['recentMonthsSalesPercentage']/100)));
                }
                
                
                if(finalData['totalQuantityForFull'] === 0){
                    indexesForSplicingFinalMixedArray.push(index) //This variable is not used
                }
            })

            //Funcion para eliminar los 0s del display final
            for(let i = 0 ; i < indexesForSplicingFinalMixedArray.length; i++){
                indexesForSplicingFinalMixedArray[i] -= i; //Le hago splice a esta posicion de index, pero primero debo recorrer los splices ya hechos previamente
                let x = finalMixedArray.splice(indexesForSplicingFinalMixedArray[i], 1);
            }

            responseAPI = finalMixedArray;
            
        }
        else{
            const requestURL = env.MYSQL_DB_SERVER + "/data";
            responseAPI = await axios.get(requestURL, {params: {selectionQuery: selected_query, store: selected_store, full: selected_just_full, DateStart: day.Start, MonthStart: month.Start, YearStart: year.Start}});
        }

        responseAPI.forEach(data => {
            switch(selected_query){
                case 1:
                    totalSum += data['totalQuantityForFull'];
                break;
                default:
                    totalSum += data.TotalVentas;
            }
        });
        setTotalQuantity(totalSum);
        // setSelectedQueryState(selected_query);
        setDataSQLQuery(responseAPI); //Setea la nueva tabla con las cantidades sugeridas

        // Metodo para sacar stock de Full en piezas
        let forIndex = 0;
        
        for(const data of responseAPI){
            
            //Si existe el campo Meli_Barcode se accedera a buscar su stock
            if(data.Meli_Barcode){
                const requestURL = env.MERCADOLIBRE_SERVER + "/inventories/" + data.Meli_Barcode + "/stock/fulfillment";
                let inventoryItem = await axios.get(requestURL);

                // Se revisa que el objeto retribuido por el servidor tenga la propiedad de disponibilidad para poder asignar, si no la tiene la consulta nuevamente (Esto se da por el time access token)
                if(inventoryItem.hasOwnProperty("available_quantity")){
                    responseAPI[forIndex].available_quantity = inventoryItem.available_quantity;
                }
                else{
                    const requestURL = env.MERCADOLIBRE_SERVER + "/inventories/" + data.Meli_Barcode + "/stock/fulfillment";
                    inventoryItem = await axios.get(requestURL);
                    responseAPI[forIndex].available_quantity = inventoryItem.available_quantity;
                }
                setDataSQLQuery(responseAPI); 
            }
            forIndex++;
            
            progressbar += (1/responseAPI.length) * 100;
            setProgressBar(progressbar);
            
        }

        setVisibleDownloadDataButton(true);
        setReloading(false);
        setProgressBar(0);
    }

    function QuerySelector(text, value){
        selected_query = value;
        setSelectedQueryState(selected_query);
        setDropdownQueryText(text);
    }

    function StoreSelector(text, value){
        selected_store = value;
        setDropdownStoreText(text);
    }

    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
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
            setTotalQuantityForFull(textValue);
        }
    }

    // Rendering
    return(
        <Card>
            <Nav pills className="nav nav-pills">
                <NavItem>
                    <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                            active: activeTab1 === "1",
                        })}
                        onClick={() => {
                            toggle1("1");
                        }}
                    >
                        <i className="mdi mdi-calendar" />
                        {" Planner"}
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                            active: activeTab1 === "2",
                        })}
                        onClick={() => {
                            toggle1("2");
                        }}
                    >
                        <i className="mdi mdi-database-plus-outline"/>
                        {" Update Sales Data"}
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                            active: activeTab1 === "3",
                        })}
                        onClick={() => {
                            toggle1("3");
                        }}
                    >
                        <i className="mdi mdi-tools"/>
                        {" Publication Settings"}
                    </NavLink>
                </NavItem>
            </Nav>

            <CardBody>
                <TabContent activeTab={activeTab1} className="p-3">

                    <TabPane tabId="1">
                        {isLoading ?
                            <div>
                                <h4>
                                    Retrieving Information...
                                </h4>
                                <Progress multi>

                                    <Progress animated bar color="primary" value={progressbar} />
                                    <Progress bar color="danger" value={100-progressbar} />

                                </Progress>
                                <h6 className='rightTextAlign'>{progressbar.toFixed(2) + "%"}</h6>
                            </div>
                            : 
                            <div>
                                <Row className='cardTitleRow'>
                                    <h4 className='cardTitle'>
                                        Product Manager
                                    </h4>
                                    {/* <i className='mdi mdi-av-timer cardTitleIcon' /> */}
                                </Row>
                                
                                <Row>
                                    <Col className='marginsOptions'>
                                        <h6 className='autoWidth'>Pick an Action: </h6>
                                        <ButtonDropdown
                                            isOpen={drp_secondary_sm}
                                            toggle={() => setDrp_secondary_sm(!drp_secondary_sm)}
                                            className='buttonDropdown autoWidth'
                                        >

                                            <DropdownToggle
                                                caret
                                                color="white"
                                                className="btn btn-outline-info"
                                            >
                                                <Row>
                                                    <p className="autoHeight autoWidth">{dropdownQueryText + "   "}
                                                        <i className="mdi mdi-chevron-down autoWidth"/>
                                                    </p>
                                                </Row>
                                            </DropdownToggle>

                                            <DropdownMenu>
                                                <DropdownItem default onClick={() => QuerySelector("Total Sales", 0)}>Total Sales</DropdownItem>
                                                <DropdownItem divider />
                                                <DropdownItem onClick={() => QuerySelector("Sales Forecasting", 1)}>Sales Forecasting</DropdownItem>
                                            </DropdownMenu>
                                        </ButtonDropdown>
                                    </Col>
                                    
                                    <Col className='marginsOptions'>
                                        <h6 className='autoWidth'>Select a Store: </h6>
                                        <ButtonDropdown
                                            isOpen={drp_secondary_sm_store}
                                            toggle={() => setDrp_secondary_sm_store(!drp_secondary_sm_store)}
                                            className='buttonDropdown autoWidth'
                                        >

                                            <DropdownToggle
                                                caret
                                                color="white"
                                                className="btn btn-outline-info"
                                            >
                                                <Row>
                                                    <p className="autoHeight autoWidth">{dropdownStoreText + "   "}
                                                        <i className="mdi mdi-chevron-down autoWidth"/>
                                                    </p>
                                                </Row>
                                            </DropdownToggle>

                                            <DropdownMenu>
                                                <DropdownItem default onClick={() => StoreSelector("Optioutlet", 1)}>Optioutlet</DropdownItem>
                                                <DropdownItem divider />
                                                <DropdownItem onClick={() => StoreSelector("Lentes de Moda", 2)}>Lentes de Moda</DropdownItem>
                                                <DropdownItem divider />
                                                <DropdownItem onClick={() => StoreSelector("Todo Para Rodar", 3)}>Todo para Rodar</DropdownItem>
                                                <DropdownItem divider />
                                                <DropdownItem onClick={() => StoreSelector("Gliz Vosley", 4)}>Gliz Vosley</DropdownItem>
                                                <DropdownItem divider />
                                                <DropdownItem onClick={() => StoreSelector("MUSA Skateboard", 5)}>MUSA Skateboard</DropdownItem>
                                                <DropdownItem divider />
                                                <DropdownItem className='italicText' onClick={() => StoreSelector("All of Above", 0)}>All of Above</DropdownItem>
                                            </DropdownMenu>
                                        </ButtonDropdown>
                                    </Col>

                                    {dropdownQueryText == "Total Sales" ? 
                                        <Col className='marginsOptions'>
                                            <h6 className='autoWidth'>Type of Sale: </h6>
                                            <div className="mt-3" onChange={(e) => (selected_just_full = e.target.value)}>
                                                <div className="form-check mb-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="typeOfSaleRadioButton"
                                                        value="Sí"
                                                        defaultChecked
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor="exampleRadios1"
                                                    >
                                                        Full
                                                    </label>
                                                </div>
                                                <div className="form-check mb-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="typeOfSaleRadioButton"
                                                        value="No"
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor="exampleRadios12"
                                                    >
                                                        Other
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="typeOfSaleRadioButton"
                                                        value="%"
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor="exampleRadios3"
                                                    >
                                                        Everything
                                                    </label>
                                                </div>
                                                
                                            </div>
                                        </Col> : 
                                        
                                        <Col className='marginsOptions'>
                                            <h6 className='autoWidth'>Quantity: </h6>
                                            <input
                                                className="form-control form-control-sm autoWidth"
                                                value={totalQuantityForFull}
                                                name="QuantityForFullInput"
                                                onChange={handleInputChange}
                                            />
                                        </Col>
                                        }

                                        {dropdownQueryText == "Total Sales" ? "" :
                                            <Col className='marginsOptions'>
                                                    <h6 className='autoWidth'>Priority Percentage: </h6>
                                                    <ButtonDropdown
                                                        isOpen={drp_priority_percentage}
                                                        toggle={() => setDrp_priority_percentage(!drp_priority_percentage)}
                                                        className='buttonDropdown autoWidth'
                                                    >

                                                        <DropdownToggle
                                                            caret
                                                            color="white"
                                                            className="btn btn-outline-info"
                                                        >
                                                            <Row>
                                                                <p className="autoHeight autoWidth">{dropdownPriorityPercentage + "%   "}
                                                                    <i className="mdi mdi-chevron-down autoWidth"/>
                                                                </p>
                                                            </Row>
                                                        </DropdownToggle>

                                                        <DropdownMenu>
                                                            <DropdownItem default onClick={() => setdropdownPriorityPercentage(10)}>10%</DropdownItem>
                                                            <DropdownItem divider />
                                                            <DropdownItem default onClick={() => setdropdownPriorityPercentage(20)}>20%</DropdownItem>
                                                            <DropdownItem divider />
                                                            <DropdownItem default onClick={() => setdropdownPriorityPercentage(30)}>30%</DropdownItem>
                                                            <DropdownItem divider />
                                                            <DropdownItem default onClick={() => setdropdownPriorityPercentage(40)}>40%</DropdownItem>
                                                            <DropdownItem divider />
                                                            <DropdownItem default onClick={() => setdropdownPriorityPercentage(50)}>50%</DropdownItem>
                                                            <DropdownItem divider />
                                                            <DropdownItem default onClick={() => setdropdownPriorityPercentage(60)}>60%</DropdownItem>
                                                            <DropdownItem divider />
                                                            <DropdownItem default onClick={() => setdropdownPriorityPercentage(70)}>70%</DropdownItem>
                                                            <DropdownItem divider />
                                                            <DropdownItem default onClick={() => setdropdownPriorityPercentage(80)}>80%</DropdownItem>
                                                            <DropdownItem divider />
                                                            <DropdownItem default onClick={() => setdropdownPriorityPercentage(90)}>90%</DropdownItem>
                                                            <DropdownItem divider />
                                                            <DropdownItem default onClick={() => setdropdownPriorityPercentage(100)}>100%</DropdownItem>
                                                            <DropdownItem divider />
                                                        </DropdownMenu>
                                                    </ButtonDropdown>
                                                </Col>}

                                    
                                </Row>

                                {(() => {
                                    switch (parseInt(selected_query)){
                                    
                                        case(1): return(
                                            <div id='Query Selector Action: 1'>
                                                <h6>Pick a Date Range: </h6>

                                                <FormGroup className="mb-4">
                                                    <InputGroup>
                                                        <Flatpickr
                                                            className="form-control d-block"
                                                            placeholder="Day, dd Month yyyy to Day, dd Month yyyy"
                                                            options={{
                                                                mode: "range",
                                                                altInput: true,
                                                                altFormat: "D, d F Y",
                                                            }}
                                                            onChange={(e) => DateRangePicker(e)}
                                                        />
                                                    </InputGroup>
                                                </FormGroup>

                                                {reloading ? 
                                                    <div>
                                                        <Progress multi>
                                                            <Progress animated bar color="primary" value={progressbar} />
                                                            <Progress bar color="danger" value={100-progressbar} />
                                                        </Progress>
                                                        <h6 className='rightTextAlign'>{progressbar.toFixed(2) + "%"}</h6> 
                                                    </div>
                                                    :
                                                    <div className='d-flex justify-content-end'>
                                                        {visiblleDownloadDataButton &&
                                                            <Button color="info" className="">
                                                                <CSVLink
                                                                    headers={headers}
                                                                    data={dataSQLQuery}
                                                                    filename={"Full Inventory Planner"}
                                                                    style={{ "textDecoration": "none", "color": "#fff" }}
                                                                    asyncOnClick={true}
                                                                >
                                                                    <i className="mdi mdi-cloud-download"/> Current Data
                                                                </CSVLink>
                                                            </Button>
                                                        }
                                                        <Button className='autoWidth' color='primary' onClick={() => updateValues(selected_day, selected_month, selected_year, selected_query, selected_store, selected_just_full)}>Confirm</Button>
                                                    </div>
                                                    
                                                }
                                                

                                                <div className="table-responsive table-card mt-3 mb-1">
                                                    <table className="table align-middle table-nowrap" id="customerTable">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th className="sort">Publication MLM</th>
                                                                <th className="sort">Meli Code</th>
                                                                <th className="sort">Title</th>
                                                                <th className="sort">Variant</th>
                                                                <th className='sort'>Stock in Full</th>
                                                                <th className="sort">Suggested</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="list form-check-all">
                                                            {dataSQLQuery.map((eachData, index) => (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {eachData.No_Publicacion}
                                                                    </td>
                                                                    <td>
                                                                        {eachData.Meli_Barcode}
                                                                    </td>
                                                                    <td>
                                                                        {eachData.Titulo}
                                                                    </td>
                                                                    <td>
                                                                        {eachData.Variante}
                                                                    </td>
                                                                    <td className='centerTextAlign'>
                                                                        {(eachData.available_quantity > 0) ? 
                                                                            <span className="badge badge-soft-info text-uppercase">{eachData.available_quantity}</span>
                                                                        :
                                                                            <span className="badge badge-soft-danger text-uppercase">{eachData.available_quantity}</span>
                                                                        }
                                                                    </td>
                                                                    <td className='rightTextAlign'>
                                                                        {eachData.totalQuantityForFull}
                                                                    </td>
                                                                </tr> 
                                                            ))}
                                                            <tr>
                                                                <td />
                                                                <td />
                                                                <td />
                                                                <td />
                                                                <td className='boldText rightTextAlign'>Total:</td>
                                                                <td className='boldText rightTextAlign'>{totalQuantity}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        );

                                        default: return(
                                            <div id='Default Selector Action'>
                                                <br/>
                                                {reloading ? 
                                                    <div>
                                                        <Progress multi>
                                                            <Progress animated bar color="primary" value={progressbar} />
                                                            <Progress bar color="danger" value={100-progressbar} />
                                                        </Progress>
                                                        <h6 className='rightTextAlign'>{progressbar.toFixed(2) + "%"}</h6> 
                                                    </div>
                                                    :
                                                    <div className='d-flex justify-content-end'>
                                                        <Button className='autoWidth' color='primary' onClick={() => updateValues(selected_day, selected_month, selected_year, selected_query, selected_store, selected_just_full)}>Confirm</Button>
                                                    </div>
                                                    
                                                }
                                                <div className="table-responsive table-card mt-3 mb-1">
                                                    <table className="table align-middle table-nowrap" id="customerTable">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th className="sort">Publication MLM</th>
                                                                <th className="sort">Meli Code</th>
                                                                <th className="sort">Title</th>
                                                                <th className="sort">Variant</th>
                                                                <th className="sort">Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="list form-check-all">
                                                            {dataSQLQuery.map((eachData, index) => (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {eachData.No_Publicacion}
                                                                    </td>
                                                                    <td>
                                                                        {eachData.Meli_Barcode}
                                                                    </td>
                                                                    <td>
                                                                        {eachData.Titulo}
                                                                    </td>
                                                                    <td>
                                                                        {eachData.Variante}
                                                                    </td>
                                                                    <td className='rightTextAlign'>
                                                                        {eachData.TotalVentas}
                                                                    </td>
                                                                </tr>
                                                                    
                                                            
                                                            ))}
                                                                
                                                            <tr>
                                                                <td />
                                                                <td />
                                                                <td />
                                                                <td className='boldText rightTextAlign'>Total:</td>
                                                                <td className='boldText rightTextAlign'>{totalQuantity}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        );
                                    };
                                }) ()}

                            </div>
                        }
                    </TabPane>

                    
                    <TabPane tabId="2">
                        <Row>
                            <DropFileZone/>
                        </Row>
                    </TabPane>

                    <TabPane tabId="3">
                        <ConfigurationSettings/>
                    </TabPane>

                </TabContent>

            </CardBody>
        </Card>
    );
};

export default FullInventoryPlanner;