import {
    SELECT_ALERT,
    ADD_ALERT,
    EDIT_ALERT
  } from "./actionTypes";

const INIT_STATE = {
    alertType: "",
    addPOisOpen: false,
    editPOisOpen: false,
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
                addPOisOpen: action.payload,
            }

        case EDIT_ALERT:
            return{
                ...state,
                editPOisOpen: action.payload
            }

        default:
            return state
    }
};

export default POAlert;