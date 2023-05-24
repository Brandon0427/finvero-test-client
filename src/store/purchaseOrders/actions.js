import {
    SELECT_ALERT,
    ADD_ALERT,
    EDIT_ALERT,
    INDIVIDUAL_PO
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

export const openEditType = (isOpenEdit, poEditID, poEditNumber, poEditDate, poEditCreator, poEditStatus, poEditTitle, poEditSupplier, poEditDescription, poEditAdditionalComments) => ({
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
        poAdditionalComments: poEditAdditionalComments
    }
});

export const viewPODetails = (poDetailsID, poDetailsNumber, poDetailsDate, poDetailsCreator, poDetailsStatus, poDetailsTitle, poDetailsSupplier, poDetailsDescription, poDetailsAdditionalComments, poDetails) => ({
    type: INDIVIDUAL_PO,
    payload: {
        poID: poDetailsID,
        poNumber: poDetailsNumber,
        poDate: poDetailsDate,
        poCreator: poDetailsCreator,
        poStatus: poDetailsStatus,
        poTitle: poDetailsTitle,
        poSupplier: poDetailsSupplier,
        poDescription: poDetailsDescription,
        poAdditionalComments: poDetailsAdditionalComments,
        poDetails: poDetails
    }
});