import {
    SELECT_ALERT,
    ADD_ALERT,
    EDIT_ALERT
  } from "./actionTypes";

const INIT_STATE = {
    alertType: "",
    addPOisOpen: false,
    addPONumber: 0,
    editPOisOpen: false,
    editPOID: "",
    editPODate: "",
    editPOCreator: "",
    editPOStatus: "",
    editPOTitle: "",
    editPOSupplier: "",
    editPODescription: "",
    editPOAditionalComments: ""
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
                editPOAditionalComments: action.payload.poAditionnalComments
            }

        default:
            return state
    }
};

export default POAlert;