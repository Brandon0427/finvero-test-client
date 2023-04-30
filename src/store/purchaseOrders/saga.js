// @flow
import { all, call, fork, takeEvery} from "redux-saga/effects"

import {
    SELECT_ALERT,
    ADD_ALERT,
    EDIT_ALERT
  } from "./actionTypes";

import {
    openAddPOType as openAddPOTypeAction,
    openEditType as openEditTypeAction
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

function* openEditType({ payload: isOpenEdit, poEditID, poEditDate, poEditCreator, poEditStatus, poEditTitle, poEditSupplier, poEditDescription, poEditAditionalComments }) {
    try {
        yield call(openEditTypeAction, isOpenEdit, poEditID, poEditDate, poEditCreator, poEditStatus, poEditTitle, poEditSupplier, poEditDescription, poEditAditionalComments)
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


function* poSaga() {
    yield all([
        fork(watchSelectAlertType),
        fork(watchOpenAddPOType),
        fork(watchOpenEditType)
    ])
}
  
export default poSaga;