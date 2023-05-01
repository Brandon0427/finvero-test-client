import {Col, Row, Modal, ModalHeader, ModalBody} from "reactstrap";
import React, {useState} from 'react';
import qs from 'qs';
//redux
import { useSelector, useDispatch } from "react-redux";
import { openEditType } from "../../store/actions";

import axios from 'axios';

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

let requiredValuesFilled = [true, true, true, true, true];

const AlertEditPO = (props) => {

    const showEditAlert = useSelector(state => (state.POAlert.editPOisOpen));
    const idPO = useSelector(state => (state.POAlert.editPOID));
    const numberPO = useSelector(state => (state.POAlert.editPONumber));
    const datePO = useSelector(state => (state.POAlert.editPODate));
    const creatorPO = useSelector(state => (state.POAlert.editPOCreator));
    const statusPO = useSelector(state => (state.POAlert.editPOStatus));
    const titlePO = useSelector(state => (state.POAlert.editPOTitle));
    const supplierPO = useSelector(state => (state.POAlert.editPOSupplier));
    const descriptionPO = useSelector(state => (state.POAlert.editPODescription));
    const aditionalCommentsPO = useSelector(state => (state.POAlert.editPOAditionalComments));

    const [activeConfirmButton, setActiveConfirmButton] = useState(true);
    const [activeSubmitButton, setActiveSubmitButton] = useState(false);


    const dispatch = useDispatch();

    const handleSubmit = async () => {

        const options = {
            method: "PATCH",
            headers: {
                Accept: "*/*",
                "Content-Type": "application/x-www-form-urlencoded",
                "Access-Control-Allow-Origin": "*",
            },
            data: qs.stringify({
                supplier: supplierPO,
                title: titlePO,
                description: descriptionPO,
                poCreator: creatorPO,
                poDate: datePO,
                poStatus: statusPO,
                checkedItem: false
            }),  
            url: ('https://mongodb-api-optidashboard.herokuapp.com/purchase-order/' + idPO)
        }

        await axios.patch(
            options.url,
            options.data,
            { headers: options.headers })
            .then((response) => {
                console.log(response);
                dispatch(openEditType(false))

                //Reset Values
                resetPOValues();
              });

    }

    function resetPOValues(){

        //Reset Input values
        requiredValuesFilled = [true, true, true, true, true];
        dispatch(openEditType(!showEditAlert, "", date, "", "", '', "", "", ""));

        //Reset Submit PO
        confirmButton = false;
        setActiveConfirmButton(true);
        setActiveSubmitButton(false);

    } 

    const handleInputChange = (event) => {
        textValue = event.target.value;
        elementChanged(event.target.name, textValue);
    }

    function elementChanged(elementType, value){

        switch(elementType){
            case "PO Creator":
                // setPOCreatorInput(value);
                dispatch(openEditType(showEditAlert, idPO, numberPO, datePO, value, statusPO, titlePO, supplierPO, descriptionPO, aditionalCommentsPO));
                if(textValue !== ""){
                    requiredValuesFilled[0] = true;
                }
                else{
                    requiredValuesFilled[0] = false;
                }
                break;
            
            case "PO Status":
                // setPOStatusInput(value);
                dispatch(openEditType(showEditAlert, idPO, numberPO, datePO, creatorPO, value, titlePO, supplierPO, descriptionPO, aditionalCommentsPO));
                if(textValue !== ""){
                    requiredValuesFilled[1] = true;
                }
                else{
                    requiredValuesFilled[1] = false;
                }
                break;

            case "Title":
                dispatch(openEditType(showEditAlert, idPO, numberPO, datePO, creatorPO, statusPO, value, supplierPO, descriptionPO, aditionalCommentsPO));
                if(textValue !== ""){
                    requiredValuesFilled[2] = true;
                }
                else{
                    requiredValuesFilled[2] = false;
                }
                break;
            
            case "Supplier":
                dispatch(openEditType(showEditAlert, idPO, numberPO, datePO, creatorPO, statusPO, titlePO, value, descriptionPO, aditionalCommentsPO));
                if(textValue !== ""){
                    requiredValuesFilled[3] = true;
                }
                else{
                    requiredValuesFilled[3] = false;
                }
                break;

            case "Date":
                dispatch(openEditType(showEditAlert, idPO, numberPO, value, creatorPO, statusPO, titlePO, supplierPO, descriptionPO, aditionalCommentsPO));
                if(textValue !== ""){
                    requiredValuesFilled[4] = true;
                }
                else{
                    requiredValuesFilled[4] = false;
                }
                break;
            
            case "Description":
                dispatch(openEditType(showEditAlert, idPO, numberPO, datePO, creatorPO, statusPO, titlePO, supplierPO, value, aditionalCommentsPO));
                break;

            case "Addtional Comments":
                dispatch(openEditType(showEditAlert, idPO, numberPO, datePO, numberPO, creatorPO, statusPO, titlePO, supplierPO, descriptionPO, value));
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
            isOpen={showEditAlert}
            toggle={() => dispatch(openEditType(!showEditAlert))}
        >
            <ModalHeader
                toggle={() => dispatch(openEditType(!showEditAlert))}

                // setmodal(!modal);
                className="bg-soft-info card-header"
            >

                <div className="d-flex">
                    <div className="flex-grow-1">
                        <h5 className="font-size-16 text-info my-1">
                            {"Edit " + titlePO + "   |   #PO" + numberPO}
                        </h5>
                    </div>
                    <div className="flex-shrink-0">

                    </div>
                </div>

            </ModalHeader>
            <ModalBody>
                <div className="text-center">
                    <div className="mb-6">
                        <i className="mdi mdi mdi-basket-outline display-4 text-info"></i>
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
                                        defaultValue={datePO}
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
                                                value={creatorPO}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option disabled selected value={creatorPO}>
                                                    {creatorPO}
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
                                                value={statusPO}
                                                onChange={handleInputChange}
                                                required
                                            >
                                            <option disabled selected value={statusPO}>
                                                {statusPO}
                                            </option>
                                            <option value="Requested">Requested</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Ordered">Ordered</option>
                                            <option value="Delivered">Delivered</option>
                                            <optgroup label="Pending">
                                                <option value="Waiting">Waiting for Approval</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </optgroup>
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
                                            value = {titlePO}
                                            onChange={handleInputChange}
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
                                            value={supplierPO}
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
                                            value={descriptionPO}
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
                                            name="Aditional Comments"
                                            value={aditionalCommentsPO}
                                            onChange={handleInputChange}
                                            rows={10}
                                        />
                                        <label htmlFor="floatingFirstnameInput">
                                            Aditional Comments
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

export default AlertEditPO;