import React, { useState} from 'react';
import { Link } from 'react-router-dom';

import {
    Button,
    Card,
    CardBody,
    Col,
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    ButtonDropdown,
    Row
} from "reactstrap";

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

import AlertAddPO from './POAlert.js'


const data = [
    {
        poID: 1,
        supplier: "AOHSSA",
        title: "Soflens 59",
        description: "1000 Soflens",
        poCreator: "Iván N.",
        poDate: "18 Apr. 2021",
        poStatus: "Ordered",
        checkedItem: false
    },
    {
        poID: 2,
        supplier: "AOHSSA",
        title: "Dailies",
        description: "700 Dailies",
        poCreator: "José N",
        poDate: "25 Dec. 2021",
        poStatus: "Approved",
        checkedItem: false
    },
    {
        poID: 3,
        supplier: "AOHSSA",
        title: "Freshlook Colorblends",
        description: "3000 FL",
        poCreator: "Luis N.",
        poDate: "28 Dec. 2021",
        poStatus: "Cancelled",
        checkedItem: false
    },
    {
        poID: 4,
        supplier: "AOHSSA",
        title: "Soflens Astigmatismo",
        description: "76 Soflens",
        poCreator: "Iván N.",
        poDate: "3 Jan. 2022",
        poStatus: "Requested",
        checkedItem: false
    },
    {
        poID: 5,
        supplier: "AOHSSA",
        title: "B&L Ultra",
        description: "54 Lentes",
        poCreator: "José M. H.",
        poDate: "26 Jan. 2022",
        poStatus: "Approved",
        checkedItem: false
    },
    {
        poID: 6,
        supplier: "AOHSSA",
        title: "Armazón",
        description: "25 Blanco con Negro",
        poCreator: "Blanca J.",
        poDate: "6 Feb. 2022",
        poStatus: "Waiting",
        checkedItem: false
    },
    {
        poID: 7,
        supplier: "AOHSSA",
        title: "Ocudrive",
        description: "230 Vitaminas",
        poCreator: "José N.",
        poDate: "12 Feb. 2022",
        poStatus: "Cancelled",
        checkedItem: false
    },
    {
        poID: 8,
        supplier: "AOHSSA",
        title: "Freslook Colorblends",
        description: "74 Lentes Azules",
        poCreator: "Iván N.",
        poDate: "16 Apr. 2022",
        poStatus: "Approved",
        checkedItem: false
    },
    {
        poID: 9,
        supplier: "AOHSSA",
        title: "Armazón",
        description: "76 Carey",
        poCreator: "José Manuel H.",
        poDate: "29 Jun. 2022",
        poStatus: "Delivered",
        checkedItem: false
    },
    {
        poID: 10,
        supplier: "AOHSSA",
        title: "Acuvue Oasys",
        description: "26 Acuvue",
        poCreator: "Iván N.",
        poDate: "4 Sep. 2022",
        poStatus: "Ordered",
        checkedItem: false
    },
    {
        poID: 11,
        supplier: "AOHSSA",
        title: "Air Optix",
        description: "100 Air Optix",
        poCreator: "Iván N.",
        poDate: "10 Oct. 2022",
        poStatus: "Approved",
        checkedItem: false
    }
]

let listElements = 5;
let arrayPositionStart = 0;
let nextButtonStart;
let arrayPositionEnd = data.length;
let numPODisplay = data.length;
let selectAllItems = false;
let textToastify = "";
let multipleDataSelected = [];
let anyDataSelected = false;
let anyMultipleDataSelected = [];

if(data.length > listElements){
    nextButtonStart = true;
    arrayPositionEnd = listElements;
    numPODisplay = listElements;
}
else{
    nextButtonStart = false;
}

const PurchaseOrder = () => {

    const [addNewPO, setAddNewPO] = useState(false);

    const [startPODisplay, setStartPODisplay] = useState(arrayPositionStart);
    const [prevButton, setPrevButton] = useState(false);
    const [endPODisplay, setEndPODisplay] = useState(arrayPositionEnd);
    const [nextButton, setNextButton] = useState(nextButtonStart);
    const [addDeleteButtons, setAddDeleteButtons] = useState(false);
    const [dataLength, setDataLength] = useState(data.length);
    

    const [modal_list, setmodal_list] = useState(false);
    const [drp_secondary_sm, setDrp_secondary_sm] = useState(false);

    function nextPO(){
        setPrevButton(true);

        if(data.length > arrayPositionEnd){
            if(data.length > (arrayPositionEnd + listElements)){
                arrayPositionStart = arrayPositionStart + listElements;
                arrayPositionEnd = arrayPositionEnd + listElements;
                setNextButton(true);
            }
            else{
                arrayPositionStart = arrayPositionStart + listElements;
                arrayPositionEnd = data.length;
                numPODisplay = arrayPositionEnd;
                setNextButton(false);
            }
        }
        else{
            setNextButton(false);
        }

        toggleAll(0, 0, false, true);
        numPODisplay = arrayPositionEnd;
        setStartPODisplay(arrayPositionStart);
        setEndPODisplay(arrayPositionEnd);
    }

    function prevPO(){
        setNextButton(true);

        if(arrayPositionStart > 0){
            if((arrayPositionStart - listElements) > 0){
                arrayPositionStart = arrayPositionStart - listElements;
                arrayPositionEnd = arrayPositionEnd - listElements;
                setPrevButton(true);
            }
            else{
                arrayPositionStart = 0;
                arrayPositionEnd = arrayPositionEnd - listElements;
                setPrevButton(false);
            }
            
            if((arrayPositionEnd - arrayPositionStart) < listElements){
                arrayPositionEnd = arrayPositionStart + (listElements);
                setEndPODisplay(arrayPositionEnd);
            }

        }
        else{
            setPrevButton(false);
            console.log("Cant go back to display more elements")
        }

        toggleAll(0, 0, false, true);
        numPODisplay = arrayPositionEnd;
        setStartPODisplay(arrayPositionStart);
        setEndPODisplay(arrayPositionEnd);
    }

    function numPO(numPOs) {

        arrayPositionEnd = numPOs;
        numPODisplay = arrayPositionEnd;

        if((data.length) < (arrayPositionEnd)){
            numPODisplay = data.length;
            setNextButton(false);
        }
        else{
            setNextButton(true);
        }

        listElements = numPOs;
        arrayPositionStart = 0;
        
        toggleAll(0, 0, false, true);
        setPrevButton(false);
        setStartPODisplay(arrayPositionStart);
        setEndPODisplay(arrayPositionEnd);
    }

    function toggleAll(startingPoint, endingPoint, check, reset){
        multipleDataSelected = [];

        data.forEach((currentData) => {currentData.checkedItem = false})
        if(reset){
            selectAllItems = false;  
            anyDataSelected = false; 
        }
        else{
            selectAllItems = check;
            for (let i = startingPoint; i < endingPoint; i++){
                data[i].checkedItem = check;
            }
            if(check){
                anyDataSelected = true;
            }
            else{
                anyDataSelected = false;
            }
        }
        setAddDeleteButtons(anyDataSelected);
        setmodal_list(!modal_list);
    }

    async function tog_list(checklistIndex, allItems, checkValue) {
        if (allItems){
            toggleAll(arrayPositionStart, numPODisplay, !checkValue, false);
        }
        else{
            data[checklistIndex].checkedItem = !checkValue;
            if(!checkValue){
                anyDataSelected = true;
            }
            else{
                await readAllSelected(false);
            }
            setAddDeleteButtons(anyDataSelected);
            setmodal_list(!modal_list);
        }   
    }

    async function resetValues(iterationRestart){
        if(iterationRestart){
            await setDataLength(data.length);
            if(dataLength > arrayPositionEnd){
                if(dataLength > (arrayPositionEnd + listElements)){
                    setNextButton(true);
                }
                else{
                    setNextButton(false);
                }
            }
            else{
                numPODisplay = dataLength - 1;
            }
            setDrp_secondary_sm(drp_secondary_sm);
            numPO(listElements);
        }
        else{
            console.log(data.length);
        }

    }

    async function deleteData(dataIndex){
        data.splice(dataIndex, 1);
        await resetValues(true);
    }      

    async function readAllSelected(deleteProcess){
        // anyMultipleDataSelected = [];

        for (let i=arrayPositionStart; i < numPODisplay; i++){
            if(data[i].checkedItem){
                multipleDataSelected.push(i);
            }
        }

        anyMultipleDataSelected = multipleDataSelected;

        if(deleteProcess === false){
            if(anyMultipleDataSelected.length > 0){
                anyDataSelected = true;
            }
            else{
                anyDataSelected = false;
                selectAllItems = false;
                
            }
            multipleDataSelected=[];
        }
    }

    async function notifyDelete(poIndex, deleteMultiple) {

        if(deleteMultiple){
            textToastify = ("Multiple PO deleted!")
            toast.error(textToastify, {});
            await readAllSelected(true);
            let countFor = 0;
            let copyMultipleDataSelected = multipleDataSelected;
            
            for (let i = 0; i < multipleDataSelected.length; i++){
                await deleteData(multipleDataSelected[i-countFor]);
                multipleDataSelected = copyMultipleDataSelected;
                countFor++
            }
        }
        else{
            textToastify = ("#PO" + data[poIndex].poID + " " + data[poIndex].title + " deleted!")
            toast.error(textToastify, {});
            await deleteData(poIndex);
            
            
        }
        toggleAll(0, 0, false, true);
         
    } 


    return (
                <Card>
                    <CardBody>
                        <Row style={{height: "auto", marginBottom: 10}}>
                            <h4 style={{width: "auto", marginBottom: 0, paddingTop: 2.5}}>
                                Orders Summary
                            </h4>
                            <i
                                className={"mdi mdi-currency-usd"}
                                style={{ width: "auto", height: "auto", fontSize: 20, padding: 0}}
                            ></i>
                        </Row>

                        <Row>
                            <Col lg={12}>
                            
                                    <div id="customerList">
                                        <Row className="g-4 mb-3">
                                            <Col className="col-sm-auto">
                                                <div className="d-flex gap-1">
                                                    {addDeleteButtons ?
                                                        <Button 
                                                            color="danger"
                                                            onClick={() => notifyDelete(0, true)}>
                                                            <i className="ri-delete-bin-2-line"></i>
                                                        </Button> :
                                                        <Button color="success" className="add-btn" id="create-btn" onClick={() => setAddNewPO(true)}>
                                                            <i className="ri-add-line align-bottom me-1"></i>Add
                                                        </Button>
                                                    }
                                                </div>                                            
                                            </Col>
                                            <Col className="col-sm">
                                                <div className="d-flex justify-content-sm-end">

                                                    <div className="btn-group mb-2">
                                                        <ButtonDropdown
                                                            isOpen={drp_secondary_sm}
                                                            toggle={() => setDrp_secondary_sm(!drp_secondary_sm)}
                                                            style={{height: "auto"}}
                                                        >
                                                            <DropdownToggle
                                                                caret
                                                                color="white"
                                                                className="btn btn-outline-info"
                                                            >
                                                                {dataLength > 0 ? 
                                                                    (arrayPositionStart + 1) + "-" + numPODisplay + " of " + dataLength + " POs" :
                                                                    "0-0 of 0 POs"
                                                                }
                                                                <i className="mdi mdi-chevron-down" />
                                                            </DropdownToggle>
                                                            <DropdownMenu>
                                                                <DropdownItem disabled>{"Showing up to " + listElements + " POs"}</DropdownItem>
                                                                <DropdownItem onClick={() => numPO(5)}>5</DropdownItem>
                                                                <DropdownItem divider />
                                                                <DropdownItem onClick={() => numPO(10)}>10</DropdownItem>
                                                                <DropdownItem divider />
                                                                <DropdownItem onClick={() => numPO(25)}>25</DropdownItem>
                                                                <DropdownItem divider />
                                                                <DropdownItem onClick={() => numPO(50)}>50</DropdownItem>
                                                                <DropdownItem divider />
                                                                <DropdownItem onClick={() => numPO(100)}>100</DropdownItem>
                                                            </DropdownMenu>
                                                        </ButtonDropdown>
                                                    </div>{" "}

                                                    <div className="search-box ms-2">
                                                        <input type="text" className="form-control search" placeholder="Search..." />
                                                        <i className="ri-search-line search-icon" style={{paddingBottom: 8}}></i>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>

                                        <div className="table-responsive table-card mt-3 mb-1">
                                            <table className="table align-middle table-nowrap" id="customerTable">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th scope="col" style={{ width: "50px" }}>
                                                            <div className="form-check">
                                                                <input className="form-check-input" type="checkbox" id="checkAll" onChange={() => tog_list(0, true, selectAllItems)} checked={selectAllItems}/>
                                                            </div>
                                                        </th>
                                                        <th className="sort" data-sort="id">PO ID</th>
                                                        <th className="sort" data-sort="email">Title</th>
                                                        <th className="sort" data-sort="customer_name">Supplier</th>
                                                        <th className="sort" data-sort="phone">Created By</th>
                                                        <th className="sort" data-sort="date">PO Date</th>
                                                        <th className="sort" data-sort="status">Status</th>
                                                        <th className="sort" data-sort="action">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="list form-check-all">

                                                    {data.slice(startPODisplay, endPODisplay).map((eachPO, index) => (

                                                        <tr key={index}>
                                                            <th scope="row">
                                                                <div className="form-check">
                                                                    <input className="form-check-input" type="checkbox" name="chk_child" onChange={() => tog_list((index + startPODisplay), false, eachPO.checkedItem)} checked={eachPO.checkedItem}/>
                                                                </div>
                                                            </th>
                                                            <td className="id"><Link to={"/purchase-orders/PO" + eachPO.title} className="fw-medium link-primary">{"#PO" + eachPO.poID}</Link></td>
                                                            {/* <td className="customer_name">Mary Cousar</td> */}
                                                            <td className="email">{eachPO.title}</td>
                                                            <td className="customer_name">{eachPO.supplier}</td>
                                                            <td className="phone">{eachPO.poCreator}</td>
                                                            <td className="date">{eachPO.poDate}</td>

                                                            {(()=> {
                                                                switch (eachPO.poStatus) {
                                                                case 'Requested':
                                                                    return( 
                                                                        <td className="status"><span className="badge badge-soft-info text-uppercase">{eachPO.poStatus}</span></td>
                                                                    )
                                                                
                                                                case 'Waiting':
                                                                    return( 
                                                                        <td className="status"><span className="badge badge-soft-warning text-uppercase">{eachPO.poStatus}</span></td>
                                                                    )

                                                                case 'Approved':
                                                                    return( 
                                                                        <td className="status"><span className="badge badge-soft-primary text-uppercase">{eachPO.poStatus}</span></td>
                                                                    )

                                                                case 'Ordered':
                                                                    return( 
                                                                        <td className="status"><span className="badge badge-soft-primary text-uppercase">{eachPO.poStatus}</span></td>
                                                                    )
                                                                

                                                                case 'Delivered':
                                                                    return( 
                                                                        <td className="status"><span className="badge badge-soft-success text-uppercase">{eachPO.poStatus}</span></td>
                                                                    )

                                                                case 'Cancelled':
                                                                    return( 
                                                                        <td className="status"><span className="badge badge-soft-danger text-uppercase">{eachPO.poStatus}</span></td>
                                                                    )
                                                                
                                                                default:
                                                                    return( 
                                                                        <td className="status"><span className="badge badge-soft-dark text-uppercase">{eachPO.poStatus}</span></td>
                                                                    )
                                                                }
                                                            }) ()}
                                                            
                                                            
                                                            <td>
                                                                <div className="d-flex gap-2">
                                                                    {addDeleteButtons ? "" :
                                                                        <div className="edit">
                                                                            <button className="btn btn-sm btn-success edit-item-btn"
                                                                                data-bs-toggle="modal" data-bs-target="#showModal">Edit</button>
                                                                        </div>
                                                                    }
                                                                    <div className="remove">
                                                                        <button className="btn btn-sm btn-danger remove-item-btn" data-bs-toggle="modal" data-bs-target="#deleteRecordModal" onClick={() => notifyDelete((index + startPODisplay), false)}>
                                                                            <i className="ri-delete-bin-2-line align-bottom me-1"></i>
                                                                            {" #PO" + eachPO.poID}
                                                                        </button>
                                                                            {/* <button className="btn btn-sm btn-danger remove-item-btn" data-bs-toggle="modal" data-bs-target="#deleteRecordModal" onClick={() => notifyDelete()}>Remove</button> */}
                                                                        {/* </ToastContainer> */}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>

                                                    ))}     
            
                                                </tbody>
                                            </table>
                                            {/* <div className="noresult" >
                                                <div className="text-center">
                                                    <lord-icon src="https://cdn.lordicon.com/msoeawqm.json" trigger="loop"
                                                        colors="primary:#121331,secondary:#08a88a" style={{ width: "75px", height: "75px" }}>
                                                    </lord-icon>
                                                    <h5 className="mt-2">Sorry! No Result Found</h5>
                                                    <p className="text-muted mb-0">We've searched more than 150+ Orders We did not find any
                                                        orders for you search.</p>
                                                </div>
                                            </div> */}
                                        </div>

                                        <div className="d-flex justify-content-end">
                                            <div className="pagination-wrap hstack gap-2">
                                                {prevButton ? 
                                                    <Button className="btn-outline-success"  color="white" opacity={0} onClick={() => prevPO()}>
                                                        Previous
                                                    </Button> :
                                                    ""
                                                }
                                                
                                                {/* <ul className="pagination listjs-pagination mb-0"></ul> */}

                                                {nextButton ? 
                                                    <Button className="btn-outline-success" color="white" opacity={0} onClick={() => nextPO()}>
                                                        Next
                                                    </Button> :
                                                    ""
                                                }

                                                {addNewPO ? 
                                                    <AlertAddPO /> :
                                                    ""
                                                }
                                                
                                            </div>
                                        </div>
                                    </div>

                            </Col>
                        </Row> 

                    </CardBody>
                                     
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
                </Card>

                

                
    );
};

export default PurchaseOrder;