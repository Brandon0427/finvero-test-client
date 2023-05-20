import {
    SELECT_ALERT,
    ADD_ALERT,
    EDIT_ALERT,
    INDIVIDUAL_PO
  } from "./actionTypes";

const INIT_STATE = {
    alertType: "",
    //-------------------
    addPOisOpen: false,
    addPONumber: 0,
    //-------------------
    editPOisOpen: false,
    editPOID: "",
    editPONumber: 0,
    editPODate: "",
    editPOCreator: "",
    editPOStatus: "",
    editPOTitle: "",
    editPOSupplier: "",
    editPODescription: "",
    editPOAdditionalComments: "",
    //-------------------
    poDetailsID: "",
    poDetailsNumber: 0,
    poDetailsDate: "",
    poDetailsCreator: "",
    poDetailsStatus: "",
    poDetailsTitle: "",
    poDetailsSupplier: "",
    poDetailsDescription: "",
    poDetailsAdditionalComments: "",
};

const POAlert = (state = INIT_STATE, action) => {
    switch (action.type) {
        case SELECT_ALERT:
            return{
                ...state,
                alertType: action.payload
            }

        case ADD_ALERT:
            return{
                ...state,
                addPOisOpen: action.payload.isOpen,
                addPONumber: action.payload.poNumber
            }

        case EDIT_ALERT:
            return{
                ...state,
                editPOisOpen: action.payload.isOpen,
                editPOID: action.payload.poID,
                editPONumber: action.payload.poNumber,
                editPODate: action.payload.poDate,
                editPOCreator: action.payload.poCreator,
                editPOStatus: action.payload.poStatus,
                editPOTitle: action.payload.poTitle,
                editPOSupplier: action.payload.poSupplier,
                editPODescription: action.payload.poDescription,
                editPOAdditionalComments: action.payload.poAdditionalComments
            }
        
        case INDIVIDUAL_PO:
            return{
                ...state,
                poDetailsID: action.payload.poID,
                poDetailsNumber: action.payload.poNumber,
                poDetailsDate: action.payload.poDate,
                poDetailsCreator: action.payload.poCreator,
                poDetailsStatus: action.payload.poStatus,
                poDetailsTitle: action.payload.poTitle,
                poDetailsSupplier: action.payload.poSupplier,
                poDetailsDescription: action.payload.poDescription,
                poDetailsAdditionalComments: action.payload.poAdditionalComments,
            }

        default:
            return state
    }
};

export default POAlert;