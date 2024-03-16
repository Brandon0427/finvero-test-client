import React, { useState, useEffect } from "react"
import {
//   Row,
  Form,
//   Container,
  Button
} from "reactstrap"

import './DropFileZone.css';

import Dropzone from "react-dropzone";

import * as XLSX from 'xlsx';

import qs from 'qs';
import axios from 'axios';

// import { useParams } from 'react-router-dom';

let excelJson = [];

const optionsMeliAPI = {
    method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
    }
  }

const DropFileZone = () => {
  const [dataFromExcelJson, setDataFromExcelJson] = useState([])
  const [dataLoaded, setDataLoaded] = useState(false);
  const [date, setDate] = useState('Loading...');

  useEffect( () => {
    async function fetchData(){
        const responseAPI = await axios.get("https://optioutlet-mysql-server-4796de489d28.herokuapp.com/last-sale");
        setDate(responseAPI[0]["Year"] + "-" + responseAPI[0]["Month"] + "-" + responseAPI[0]["Day"]);
    }

    fetchData();
}, []);
//   const [activeSubmitButton, setActiveSubmitButton] = useState(false)

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

            //Data conditioning
            excelJson.forEach((data, index) => {
                const months = ['enero', 'febrero', 'marzo', 'abril',
                                'mayo', 'junio', 'julio', 'agosto',
                                'septiembre', 'octubre', 'noviembre', 'diciembre'];

                //Paso 1: Obtener el comprador y el metodo de entrega
                if(data.Comprador === " "){
                    data.Comprador = excelJson[index - 1].Comprador;
                }
                if(data['Forma de entrega'] === " "){
                    data['Forma de entrega'] = excelJson[index - 1]['Forma de entrega'];
                }

                //Paso 2: revision y validacion de status
                if(data['Estado'] !== "Entregada" && data['Estado'] !== "Entregado" && data['Estado'] !== "Venta Concretada" && data['Estado'] !== "Venta Entregada"){
                    data.Revision_Status = "*";
                }

                //Paso 3: Revision de venta a traves de Full
                if(data['Forma de entrega'] === 'Mercado Envíos Full'){
                    data.Full_Meli = "Sí";
                }
                else{
                    data.Full_Meli = "No";
                }

                //Paso 4: Acondicionamiento de Fecha
                // Quito la hora de compra
                // Uso de String literals para que me sustituya todas las coincidencias " de "
                excelJson[index]['Fecha'] = data['Fecha de venta'].slice(0, -10).replace(/ de /g, '-');
                
                // Anoto en que posicion se encuentran los '-'
                const stringDashPositions = [];
                for(let i = 0 ; i < data['Fecha'].length ; i++){
                    if (data['Fecha'].charAt(i) === '-'){
                        stringDashPositions.push(i);
                    }
                }

                // Si el primer - esta en la posicion 1, significa que el dia tiene 1 digito, por lo que se le agrega un 0
                if(stringDashPositions[0] === 1){
                    data['Fecha']= "0" + data['Fecha'];
                    stringDashPositions[0]++;
                    stringDashPositions[1]++;
                }

                // Se realiza un for con la posicion de los '-' para transformar el nombre del mes en #
                let detectedMonth = [];
                for(let i = (stringDashPositions[0] + 1) ;  i < stringDashPositions[1] ; i++){
                    detectedMonth.push(data['Fecha'].charAt(i));
                }
                detectedMonth = detectedMonth.join('');

                if((months.indexOf(detectedMonth) + 1) < 10){
                    excelJson[index]['Fecha'] = data['Fecha'].replace(detectedMonth, ("0" + (months.indexOf(detectedMonth) + 1)));
                }
                else{
                    excelJson[index]['Fecha'] = data['Fecha'].replace(detectedMonth, (months.indexOf(detectedMonth) + 1));
                }

                // Cambio el formato a yyyy-mm-dd
                excelJson[index]['Fecha'] = data['Fecha'].substring(6, 10) + "-" + data['Fecha'].substring(3, 5) + "-" + data['Fecha'].substring(0, 2);

                // Paso 5: Eliminar las ' del comprador, titulo y varainte
                data['Comprador'] = data['Comprador'].replaceAll("'", "´");
                data['Título de la publicación'] = data['Título de la publicación'].replaceAll("'", "´");
                data['Variante'] = data['Variante'].replaceAll("'", "´");

                // Cuando termina el forEach le doy reverse a mi data
                if(index === (excelJson.length - 1)){
                    excelJson = excelJson.reverse();
                }
            })


            //Data filtering
            excelJson.forEach((data, index) => {
                //Si no tiene informacion es porque es la grouping cell en el formato Meli
                if(data['Paquete de varios productos'] === " "){
                    excelJson.splice(index, 1);
                }

                // Cuando termina el forEach, activo el dataLoad para poder renderear
                if(index === (excelJson.length - 1)){
                    setDataLoaded(true);
                    setDataFromExcelJson(excelJson);
                    // activeConfirmButton = true;
                }
            })

        };

        reader.readAsArrayBuffer(fileList[0]);
        
    }

  }

  function resetButton(){
    excelJson = [];
    setDataLoaded(false);
    setDataFromExcelJson(excelJson);
  }

  async function uploadInformation(data){
    let onError = false;
    let filteredData = [];

    data.forEach((sale, index) => {
        filteredData[index] = {
            No_Venta_Meli: sale['# de venta'],
            URL: sale['URL'],
            Fecha: sale['Fecha'],
            Revision_Status: sale['Revision_Status'],
            Varios_Productos: sale['Paquete de varios productos'],
            Unidades: sale['Unidades'],
            SKU_id: sale['SKU'],
            No_Publicacion: sale['# de publicación'],
            Tienda: sale['Tienda oficial'],
            Titulo: sale['Título de la publicación'],
            Variante: sale['Variante'],
            Comprador: sale['Comprador'],
            Full_Meli: sale['Full_Meli']
        }
    })

    // This process is used in order to send correctly implmented the JSON data to the server
    filteredData = qs.stringify(filteredData);

    await axios.post(
        "https://optioutlet-mysql-server-4796de489d28.herokuapp.com/sales",
        filteredData,
        { headers: optionsMeliAPI.headers }
      )
      .then((response) => {
        // Esta funcion se ejecuta solo en el caso de que el Meli HTTP Request no haya tenido errores
        if(response === "Successfully inserted the new data!"){
            window.location.reload(true);
        }
      })
      .catch(function(error){
          console.log(error)
          onError = true;
      });
  }

  return (

    <div>
        {dataLoaded ? 
            <div>
                <div className="btn-group">
                    <Button color="success" onClick={() => uploadInformation(dataFromExcelJson)}>Confirm <i className="mdi mdi-cloud-upload-outline"/></Button>
                    <Button className="btn-info" onClick={() => resetButton()}>Reset <i className="mdi mdi-restart"/></Button>
                </div>
                
                <div className="table-responsive table-card mt-3 mb-1">
                    <table className="table align-middle table-nowrap" id="customerTable">
                        <thead className="table-light">
                            <tr>
                                <th className="sort"># de Venta</th>
                                <th className="sort">Fecha</th>
                                <th className="sort">Revisión de Status</th>
                                <th className="sort">Varios Productos</th>
                                <th className="sort">Unidades</th>
                                <th className="sort">SKU</th>
                                <th className="sort"># de Publicación</th>
                                <th className="sort">Tienda</th>
                                <th className="sort">Tìtulo</th>
                                <th className="sort">Variante</th>
                                <th className="sort">Comprador</th>
                                <th className="sort">Venta de Full</th>
                            </tr>
                        </thead>
                        <tbody className="list form-check-all">
                            {dataFromExcelJson.map((eachSale, index) => (
                                <tr key={index}>
                                    <td><a href={eachSale['URL']}>{eachSale['# de venta']}</a></td>
                                    <td>{eachSale['Fecha']}</td>
                                    <td className="centerTextAlign">{eachSale['Revision_Status']}</td>
                                    <td className="centerTextAlign">{eachSale['Paquete de varios productos']}</td>
                                    <td className="centerTextAlign">{eachSale['Unidades']}</td>
                                    <td>{eachSale['SKU']}</td>
                                    <td>{eachSale['# de publicación']}</td>
                                    <td>{eachSale['Tienda oficial']}</td>
                                    <td>{eachSale['Título de la publicación']}</td>
                                    <td>{eachSale['Variante']}</td>
                                    <td>{eachSale['Comprador']}</td>
                                    <td className="centerTextAlign">{eachSale['Full_Meli']}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div> :
            <div>
                <h4>Last updated: {date}</h4>
                <br/>
                <h5>To keep up to date...</h5>
                <h6>Please upload a maximum of 1 week of sales data at once</h6>
                <br/>
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
                                <h4>Drop Mercadolibre <span style={{fontStyle:"italic"}}>.xlsx</span> sales file here</h4>
                            </div>
                        </div>
                        )}
                    </Dropzone>
                </Form>
            </div>
            
            
        }
        
    </div>
    
  )
}

export default DropFileZone;