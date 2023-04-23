import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

// Calendar
import calendar from "./calendar/reducer";

// Authentication
import forgetPassword from "./auth/forgetpwd/reducer";
import login from "./auth/login/reducer";
import profile from "./auth/profile/reducer";
import account from "./auth/register/reducer";

//Purchase Orders
import POAlert from "./purchaseOrders/reducer";

const rootReducer = combineReducers({
  // public
  Layout,
  calendar,
  forgetPassword,
  login,
  profile,
  account,
  POAlert
});

export default rootReducer;
