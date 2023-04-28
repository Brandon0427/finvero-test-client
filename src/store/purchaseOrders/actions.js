import {
    SELECT_ALERT,
    ADD_ALERT,
    EDIT_ALERT
  } from "./actionTypes";

export const selectAlertType = alertType => ({
    type: SELECT_ALERT,
    payload: alertType
});

export const openAddPOType = (isOpenAdd, poNumber) => ({
    type: ADD_ALERT,
    payload: {
        isOpen: isOpenAdd,
        poNumber: poNumber
    }
});

export const openEditType = isOpenEdit => ({
    type: EDIT_ALERT,
    payload: isOpenEdit
});