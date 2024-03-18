import {Col, Row, Modal, ModalHeader, ModalBody} from "reactstrap";
import React, {useState} from 'react';
import qs from 'qs';
//redux
import { useSelector, useDispatch } from "react-redux";
import { openAddPOType } from "../../store/actions";

import axios from 'axios';

import env from "react-dotenv";

const currentDate = new Date();

const year = currentDate.getFullYear();
let month=(currentDate.getMonth()+1);
let day=currentDate.getDate();

let textValue = "";

if (month < 9 ){
     month = "0" + month;
}
if (day < 10 ){
    day = "0" + (currentDate.getDate()+1);
}

const date = (year + "-" + month + "-" + day);

let confirmButton = false;

let requiredValuesFilled = [false, true, false, false, true];

const AlertAddPO = () => {
    const showAddalert = useSelector(state => (state.POAlert.addPOisOpen));
    const numberPO = useSelector(state => (state.POAlert.addPONumber));
    const dispatch = useDispatch();

    const [poCreatorInput, setPOCreatorInput] = useState("");
    const [poStatusInput, setPOStatusInput] = useState("Requested");

    const [dateInput, setDateInput] = useState(date);
    const [titleInput, setTitleInput] = useState("");
    const [supplierInput, setSupplierInput] = useState("");
    const [descriptionInput, setDescriptionInput] = useState("");
    const [additionalCommentsInput, setAdditionalCommentsInput] = useState("");

    const [activeConfirmButton, setActiveConfirmButton] = useState(false);
    const [activeSubmitButton, setActiveSubmitButton] = useState(false);

    const handleSubmit = async () => {

        const options = {
            method: "POST",
            headers: {
                Accept: "*/*",
                "Content-Type": "application/x-www-form-urlencoded",
                "Access-Control-Allow-Origin": "*",
            },
            data: qs.stringify({
                poID: numberPO,
                supplier: supplierInput.trim(),
                title: titleInput.trim(),
                description: descriptionInput.trim(),
                poCreator: poCreatorInput,
                poDate: dateInput,
                poStatus: poStatusInput,
                additionalComments: additionalCommentsInput.trim(),
                checkedItem: false,

            }),
            url: (env.MONGO_DB_SERVER + '/purchase-order')
        }

        await axios.post(
            options.url,
            options.data,
            { headers: options.headers })
            .then((response) => {
                console.log(response);
                dispatch(openAddPOType(false))

                //Reset Values
                resetPOValues();
              });

    }

    function resetPOValues(){

        //Reset Input values
        requiredValuesFilled = [false, true, false, false, true];
        setPOCreatorInput("");
        setPOStatusInput("Requested");
        setDateInput(date);
        setTitleInput("");
        setSupplierInput("");
        setDescriptionInput("");
        setAdditionalCommentsInput("");

        //Reset Submit PO
        confirmButton = false;
        setActiveConfirmButton(false);
        setActiveSubmitButton(false);

    } 

    const handleInputChange = (event) => {
        textValue = event.target.value;
        elementChanged(event.target.name, textValue);
    }

    function elementChanged(elementType, value){

        switch(elementType){
            case "PO Creator":
                setPOCreatorInput(value);
                if(textValue !== ""){
                    requiredValuesFilled[0] = true;
                }
                else{
                    requiredValuesFilled[0] = false;
                }
                break;
            
            case "PO Status":
                setPOStatusInput(value);
                if(textValue !== ""){
                    requiredValuesFilled[1] = true;
                }
                else{
                    requiredValuesFilled[1] = false;
                }
                break;

            case "Title":
                setTitleInput(value);
                if(textValue !== ""){
                    requiredValuesFilled[2] = true;
                }
                else{
                    requiredValuesFilled[2] = false;
                }
                break;
            
            case "Supplier":
                setSupplierInput(value);
                if(textValue !== ""){
                    requiredValuesFilled[3] = true;
                }
                else{
                    requiredValuesFilled[3] = false;
                }
                break;        

            case "Date":
                setDateInput(value)
                if(textValue !== ""){
                    requiredValuesFilled[4] = true;
                }
                else{
                    requiredValuesFilled[4] = false;
                }
                break;
            
            case "Description":
                setDescriptionInput(value);
                break;

            case "Additional Comments":
                setAdditionalCommentsInput(value);
                break;

            case "Confirm":
                confirmButton = value;
                setActiveSubmitButton(value);
                break;
            
            default:
                break;
        }

        let count = 0;
        for(let i=0; i < 5; i++){
            if(requiredValuesFilled[i]){
                count++;
            }
        }

        if(count === 5){
            setActiveConfirmButton(true);
        }
        else{
            confirmButton = false;
            setActiveSubmitButton(false);
            setActiveConfirmButton(false);
        }

    }

    return (
            
        <Col lg={6}>
        <Modal
            size="lg"
            isOpen={showAddalert}
            toggle={() => dispatch(openAddPOType(!showAddalert))}
        >
            <ModalHeader
                toggle={() => dispatch(openAddPOType(!showAddalert))}

                // setmodal(!modal);
                className="bg-soft-success card-header"
            >

                <div className="d-flex">
                    <div className="flex-grow-1">
                        <h5 className="font-size-16 text-success my-1">
                            Add New Purchase Order
                        </h5>
                    </div>
                    <div className="flex-shrink-0">

                    </div>
                </div>

            </ModalHeader>
            <ModalBody>
                <div className="text-center">
                    <div className="mb-6">
                        <i className="mdi mdi mdi-basket-outline display-4 text-success"></i>
                    </div>
                    <h4 className="alert-heading">Please provide the following details:</h4>
                        <br />
                        <div>
                            <Row className="mb-3">
                                    <label
                                        htmlFor="example-date-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Date *
                                    </label>
                                    <div className="col-md-10">
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="Date"
                                        defaultValue={dateInput}
                                        onChange={handleInputChange}
                                        id="example-date-input"
                                    />
                                    </div>
                                </Row>
                                <Row>

                                    <Col md={6}>
                                        <div className="form-floating mb-3">
                                            <select
                                                className="form-select"
                                                id="floatingSelectGrid"
                                                aria-label="Floating label select example"
                                                name = "PO Creator"
                                                value={poCreatorInput}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option disabled selected value="">
                                                    Select an Option
                                                </option>
                                                <option value="Iván N.">Iván N.</option>
                                                <option value="Luis N.">Luis N.</option>
                                                <option value="Blanca J.">Blanca J.</option>
                                                <option value="José L. N.">José L. N.</option>
                                                <option value="José M. H.">José M. H.</option>
                                            </select>
                                            <label htmlFor="floatingSelectGrid">
                                                PO Creator *
                                            </label>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="form-floating mb-3">
                                            <select
                                                className="form-select"
                                                id="floatingSelectGrid"
                                                aria-label="Floating label select example"
                                                name = "PO Status"
                                                value={poStatusInput}
                                                onChange={handleInputChange}
                                                required
                                            >
                                            <option value="Requested">Requested</option>
                                            {/* <option value="Approved">Approved</option>
                                            <option value="Ordered">Ordered</option>
                                            <option value="Delivered">Delivered</option>
                                            <optgroup label="Pending">
                                                <option value="Waiting">Waiting for Approval</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </optgroup> */}
                                            </select>
                                            <label htmlFor="floatingSelectGrid">
                                                PO Status *
                                            </label>
                                        </div>
                                    </Col>
                                </Row>
                                
                                <Col md={12}>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="floatingFirstnameInput"
                                            name="Title"
                                            defaultValue={titleInput}
                                            onChange={handleInputChange}
                                            // value={titleInput}
                                        />
                                        <label htmlFor="floatingFirstnameInput">
                                            Title *
                                        </label>
                                    </div>
                                </Col>
                                <Col md={12}>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="floatingLastnameInput"
                                            defaultValue={supplierInput}
                                            onChange={handleInputChange}
                                            name="Supplier"
                                        />
                                        <label htmlFor="floatingLastnameInput">
                                            Supplier *
                                        </label>
                                    </div>
                                </Col>
                                <Col md={12}>
                                    <div className="form-floating mb-3">
                                        <textarea
                                            type="text"
                                            className="form-control"
                                            id="floatingLastnameInput"
                                            name="Description"
                                            value={descriptionInput}
                                            onChange={handleInputChange}
                                            rows={10}
                                        />
                                        <label htmlFor="floatingLastnameInput">
                                            Description
                                        </label>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <p style={{fontSize: 0.75+"rem", fontStyle:"italic"}}>* Required</p>
                                    </div>
                                </Col>
                                <Col md={12}>
                                    <div className="form-floating mb-3">
                                        <textarea
                                            type="text"
                                            className="form-control"
                                            id="floatingFirstnameInput"
                                            name="Additional Comments"
                                            value={additionalCommentsInput}
                                            onChange={handleInputChange}
                                            rows={10}
                                        />
                                        <label htmlFor="floatingFirstnameInput">
                                            Additional Comments
                                        </label>
                                    </div>
                                </Col>
                                <Row>
                                    <Col>
                                        <div className="form-check form-switch mb-3">
                                            <label
                                                className="form-check-label"
                                                htmlFor="customSwitch1"
                                                style={{fontSize:0.85+"rem", width:70+"%", height:"auto"}}
                                            >
                                                Confirm Purchase Order
                                            </label>
                                            {activeConfirmButton ? 
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="customSwitch1"
                                                    checked={confirmButton}
                                                    value={confirmButton}
                                                    onChange={() => elementChanged("Confirm", !confirmButton)}
                                                /> :
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="customSwitch1"
                                                    checked = {activeSubmitButton}
                                                    disabled
                                                />
                                            }
                                            

                                        </div>
                                    </Col>

                                    {activeSubmitButton ? 
                                        <div className="d-flex justify-content-end">
                                            <div className="pagination-wrap hstack gap-2">
                                            <button type="submit" className="btn btn-primary" onClick={() => handleSubmit()}>
                                                Submit
                                            </button>   
                                            </div>
                                        </div> : ""
                                    }
                                    
                                </Row>
                                      
                        </div>
                    </div>
            </ModalBody>
        </Modal>                             
    </Col>     
    )

}

export default AlertAddPO;