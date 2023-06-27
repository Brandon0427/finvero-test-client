import React, { useState } from "react"
import {
  Row,
  Col,
  Card,
  Form,
  Container,
  Button
} from "reactstrap"

import './DropFileZone.css';

import Dropzone from "react-dropzone";

import * as XLSX from 'xlsx';

import { sampleData } from '../../Data.js';

import { NumericFormat } from 'react-number-format';

import qs from 'qs';
import axios from 'axios';

import { useParams } from 'react-router-dom';

let verifiedJson = [];
let activeConfirmButton = false;
let totalCost = 0;
let excelJson = [];

const MAX_PO_COST_WITH_NO_AUTHORIZATION = 100000;

const ConfirmChanges = () => {
    const params = useParams();
    const [confirmButton, setConfirmButton] = useState(false);
    const [activeSubmitButton, setActiveSubmitButton] = useState(false);

    let mainStatus;

    async function handleSubmit (){
        if (totalCost <= MAX_PO_COST_WITH_NO_AUTHORIZATION){
            mainStatus = "Approved";
        }
        else if (totalCost > MAX_PO_COST_WITH_NO_AUTHORIZATION){
            mainStatus = "Waiting";
        }

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
                // toast.success("Successfully added the PO Details", {});   
        }
        catch(e){
            console.log(e);
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




const DropFileZone = () => {
  const [dataFromExcelJson, setDataFromExcelJson] = useState([])
  const [dataLoaded, setDataLoaded] = useState(false);
  const [total, setTotal] = useState(0);
  const [activeSubmitButton, setActiveSubmitButton] = useState(false)

  function handleAcceptedFiles(file) {

    ExcelDataValidation(file);
  }

  function ExcelDataValidation(files){

    ///// Proceso para convertir de File a FileList /////

    let dataTransfer = new DataTransfer();

    files.forEach(function(file) {
        dataTransfer.items.add(file);
    });

    let fileList = dataTransfer.files;

    /////////////////////////////////////////////////////

    if(files.length){

        ///////// Converts the data to json //////////
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = event.target.result;
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


                // Cuando termina el forEach, activo el dataLoad para poder renderear
                if(index === (excelJson.length - 1)){
                    setDataLoaded(true);
                    setDataFromExcelJson(excelJson);
                    setTotal(totalCost);
                    activeConfirmButton = true;
                }
            })

        };

        reader.readAsArrayBuffer(fileList[0]);
        
    }

  }

  return (

    <div>
        {dataLoaded ? 
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
                        {dataFromExcelJson.map((eachProduct, index) => (
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
                                <NumericFormat value={Number(total).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                            </td>
                            <td/>
                        </tr>
                    </tbody>
                </table>
                <ConfirmChanges/>
            </div> :
            <Form className="dropzone">
                <Dropzone
                    accept = {".xlsx"}
                    maxFiles={1}
                    onDrop={acceptedFiles => {
                        handleAcceptedFiles(acceptedFiles)
                    }}
                >
                    {({ getRootProps, getInputProps }) => (
                    <div style={{textAlign:"center"}}>
                        <div
                            className="dz-message needsclick"
                            {...getRootProps()}
                        >
                        <input {...getInputProps()} />
                        <div className="mb-3">
                        <i className="display-4 text-muted mdi mdi-cloud-upload-outline"></i>
                        </div>
                            <h4>Drop <span style={{fontStyle:"italic"}}>.xlsx</span> file here to upload</h4>
                        </div>
                    </div>
                    )}
                </Dropzone>
            </Form>
        }
        
    </div>
    
  )
}

export default DropFileZone;
