// @flow
import { all, call, fork, takeEvery} from "redux-saga/effects"

import {
    SELECT_ALERT,
    ADD_ALERT,
    EDIT_ALERT,
    INDIVIDUAL_PO
  } from "./actionTypes";

import {
    openAddPOType as openAddPOTypeAction,
    openEditType as openEditTypeAction,
    viewPODetails as viewPODetailsAction
} from "./actions";

/**
 * Acciones a tomar segun los respectivos payloads
 * @param {*} param
 */
function* selectAlertType({ payload: alertType }) {
    try {
        if (alertType === "Add"){
            yield console.log("Pressed the selectAddAlertType Redux Routine")
        }
        else{
            yield console.log("Pressed the selectEditAlertType Redux Routine")
        }
      } 
    catch (error) {
        yield console.log("The error produced on selectAlertType was: " + error)
    }
}

function* openAddPOType({ payload: isOpenAdd, numberPO }) {
    try {
        yield call(openAddPOTypeAction, isOpenAdd, numberPO)
      }
    catch (error) {
        yield console.log("The error produced on openAddPOType was: " + error)
    }
}

function* openEditType({ payload: isOpenEdit, poEditID, poEditNumber, poEditDate, poEditCreator, poEditStatus, poEditTitle, poEditSupplier, poEditDescription, poEditAdditionalComments }) {
    try {
        yield call(openEditTypeAction, isOpenEdit, poEditID, poEditNumber, poEditDate, poEditCreator, poEditStatus, poEditTitle, poEditSupplier, poEditDescription, poEditAdditionalComments)
      }
    catch (error) {
        yield console.log("The error produced on openEditType was: " + error)
    }
}

function* viewPODetails({ payload: poID, poNumber, poDate, poCreator, poStatus, poTitle, poSupplier, poDescription, poAdditionalComments }) {
    try {
        yield call(viewPODetailsAction, poID, poNumber, poDate, poCreator, poStatus, poTitle, poSupplier, poDescription, poAdditionalComments)
      }
    catch (error) {
        yield console.log("The error produced on openEditType was: " + error)
    }
}

/**
 * Watchers
 */
export function* watchSelectAlertType() {
    yield takeEvery(SELECT_ALERT, selectAlertType)
}

export function* watchOpenAddPOType() {
    yield takeEvery(ADD_ALERT, openAddPOType)
}

export function* watchOpenEditType() {
    yield takeEvery(EDIT_ALERT, openEditType)
}

export function* watchViewPODetailsType() {
    yield takeEvery(INDIVIDUAL_PO, viewPODetails)
}


function* poSaga() {
    yield all([
        fork(watchSelectAlertType),
        fork(watchOpenAddPOType),
        fork(watchOpenEditType),
        fork(watchViewPODetailsType)
    ])
}
  
export default poSaga;