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

export const openEditType = (isOpenEdit, poEditID, poEditNumber, poEditDate, poEditCreator, poEditStatus, poEditTitle, poEditSupplier, poEditDescription, poEditAditionalComments) => ({
    type: EDIT_ALERT,
    payload: {
        isOpen: isOpenEdit,
        poID: poEditID,
        poNumber: poEditNumber,
        poDate: poEditDate,
        poCreator: poEditCreator,
        poStatus: poEditStatus,
        poTitle: poEditTitle,
        poSupplier: poEditSupplier,
        poDescription: poEditDescription,
        poAditionalComments: poEditAditionalComments
    }
});