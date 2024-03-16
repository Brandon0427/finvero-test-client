import React, { useState } from "react"
import {
    Row,
    Col,
    DropdownMenu,
    DropdownItem, 
    DropdownToggle,
    ButtonDropdown,
    Button
} from "reactstrap"

import './ConfigurationSettings.css';
import { useEffect } from "react";

import qs from 'qs';
import axios from 'axios';

import env from "react-dotenv";

//import { useParams } from 'react-router-dom';

let selected_store = 1;

const ConfigurationSettings = () => {
    const [dropdownStoreText, setDropdownStoreText] = useState("Optioutlet");
    const [drp_secondary_sm_store, setDrp_secondary_sm_store] = useState(false);
    let [drp_Status, setDrp_Status] = useState([]);
    let [dropdownStatusText, setDropdownStatusText] = useState([]);
    let [dropdownColor, setDropdownColor] = useState([]);

    let [dataSQLQuery, setDataSQLQuery] = useState([]);
    const [visibleConfirmChangesButton, setVisibleConfirmChangesButton] = useState(false);
    let originalDataSQLQuery, dataLength;

    let options = {
        method: "PATCH",
        headers: {
            Accept: "*/*",
            "Content-Type": "application/x-www-form-urlencoded",
            "Access-Control-Allow-Origin": "*",
        },
        url: (env.MYSQL_DB_SERVER + "/publication-status")
    }

    useEffect( () => {
        async function fetchData(){
            const requestURL = env.MYSQL_DB_SERVER + "/publication-status"
            const responseAPI = await axios.get(requestURL, {params: {store: selected_store}});
            originalDataSQLQuery = responseAPI;

            originalDataSQLQuery.forEach((data, index) => {
                if (data["Active"].includes("Sí")){
                    if(data["Active"].includes("*")){
                        dropdownStatusText[index] = "Priority";
                        dropdownColor[index] = "success";
                    }
                    else{
                        dropdownStatusText[index] = "On";
                        dropdownColor[index] = "info";
                    }
                }
                else{
                    dropdownStatusText[index] = "Off";
                    dropdownColor[index] = "danger";
                }

            });

            dataLength = originalDataSQLQuery.length;
            drp_Status = Array(dataLength).fill(false);
            setDrp_Status(drp_Status);
            setDropdownColor(dropdownColor);
            setDataSQLQuery(originalDataSQLQuery);
        }

        fetchData();
    }, []);

    async function confirmChanges(){
        let onError = false;
        options.data = qs.stringify(dataSQLQuery);
        
        await axios.patch(
            options.url,
            options.data,
            { headers: options.headers }
          )
          .then((response) => {
            // Esta funcion se ejecuta solo en el caso de que el Meli HTTP Request no haya tenido errores
            if(response === "Successfully updated the status"){
                window.location.reload(true);
            }
          })
          .catch(function(error){
              console.log(error)
              onError = true;
          });
    }

    async function StoreSelector(text, value){
        selected_store = value;
        setDropdownStoreText(text);

        const requestURL = env.MYSQL_DB_SERVER + "/publication-status"
        const responseAPI = await axios.get(requestURL, {params: {store: selected_store}});
        originalDataSQLQuery = responseAPI;

        originalDataSQLQuery.forEach((data, index) => {
            if (data["Active"].includes("Sí")){
                if(data["Active"].includes("*")){
                    dropdownStatusText[index] = "Priority";
                    dropdownColor[index] = "success";
                }
                else{
                    dropdownStatusText[index] = "On";
                    dropdownColor[index] = "info";
                }
            }
            else{
                dropdownStatusText[index] = "Off";
                dropdownColor[index] = "danger";
            }

        });

        dataLength = originalDataSQLQuery.length;
        drp_Status = Array(dataLength).fill(false);
        setDrp_Status(drp_Status);
        setDropdownColor(dropdownColor);
        setDataSQLQuery(responseAPI);
    }

    function StatusSelector(text, value, index){
        dropdownStatusText[index] = text;
        dataSQLQuery[index]["Active"] = value;
        if (value.includes("Sí")){
            if(value.includes("*")){
                dropdownColor[index] = "success";
            }
            else{
                dropdownColor[index] = "info";
            }
        }
        else{
            dropdownColor[index] = "danger";
        }

        setDropdownStatusText(dropdownStatusText);
        setDropdownColor(dropdownColor);
        setDataSQLQuery(dataSQLQuery);
        setVisibleConfirmChangesButton(true);
    }

    function toggleStatusDropdown(value, index){
        drp_Status = Array(dataLength).fill(false);
        drp_Status[index] = !value;
        setDrp_Status(drp_Status);
    }

    return (
        <div>
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

                <br/>

                {visibleConfirmChangesButton ? 
                    <div className='d-flex justify-content-end'>
                        <Button className='autoWidth' color='primary' onClick={() => confirmChanges()}>Confirm</Button>
                    </div>
                : ""}
            </Col>
            <div className="table-responsive table-card mt-3 mb-1">
                <table className="table align-middle table-nowrap" id="customerTable">
                    <thead className="table-light">
                        <tr>
                            <th className="sort">Status</th>
                            <th className="sort">Publication MLM</th>
                            <th className="sort">Title</th>
                            <th className="sort">Store</th>
                        </tr>
                    </thead>
                    <tbody className="list form-check-all">
                        {dataSQLQuery.map((eachData, index) => (
                            <tr key={index}>
                                <td>
                                    <ButtonDropdown
                                        isOpen={drp_Status[index]}
                                        toggle={() => toggleStatusDropdown(drp_Status[index], index)}
                                        className='buttonDropdown autoWidth'
                                    >
                                        <DropdownToggle
                                            caret
                                            color="white"
                                            className={("btn btn-outline-" + dropdownColor[index])}
                                        >
                                            <Row>
                                                <p className="autoHeight autoWidth">{dropdownStatusText[index] + "   "}
                                                    <i className="mdi mdi-chevron-down autoWidth"/>
                                                </p>
                                            </Row>
                                        </DropdownToggle>

                                        <DropdownMenu>
                                            <DropdownItem default onClick={() => StatusSelector("Priority", "Sí*", index)}>Priority</DropdownItem>
                                            <DropdownItem divider />
                                            <DropdownItem onClick={() => StatusSelector("On", "Sí", index)}>On</DropdownItem>
                                            <DropdownItem divider />
                                            <DropdownItem onClick={() => StatusSelector("Off", "No", index)}>Off</DropdownItem>
                                        </DropdownMenu>
                                    </ButtonDropdown>
                                </td>
                                <td>
                                    {eachData.No_Publicacion}
                                </td>
                                <td>
                                    {eachData.Titulo}
                                </td>
                                <td>
                                    {eachData.Tienda}
                                </td>
                            </tr> 
                        ))}
                    </tbody>
                </table>
            </div>

            <br/>
            
        </div>
    )
}

export default ConfigurationSettings;