import React, { useEffect, useState } from "react";
import OverView from "./OverView";
import PersonalExpenses from "./PersonalExpenses";
import FinancialTransactions from "./FinancialTransactions";
import FinancialObligations from "./FinancialObligations";
import LatestTransation from "./LatestTransation";

import { Row, Container } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useLocation } from 'react-router-dom';

// Environment Variables
import env from "react-dotenv";

//Axios Request Library
import axios from 'axios';

const Dashboard = () => {
  document.title = "Dashboard | Finvero Test";

  //Rertieval of Navigation Vars from previous steps
  const {state} = useLocation();
  const { accessToken } = state;
  const validToken = 'Bearer ' + accessToken;
  const headers = {
      'Authorization': validToken
  }

  const[userNameTitle, setUserNameTitle] = useState('')

  const [asyncDataForOverview, setAsyncDataForOverview] = useState({
    total: { Inflows: 0, Expenses: 0, Outflows: 0 }, 
    total1Week: { Inflows: 0, Expenses: 0, Outflows: 0 }
  });

  const [asyncDataForLatestTransaction, setAsyncDataForLatestTransaction] = useState({
    totalExpenses: 0, totalInflow: 0, totalOutflow: 0,
    transactionsArray: [{
      account: {
        institution: {
          name: '' 
        }},
      merchant: { 
        name: '' 
      }, 
      value_date: '', amount: 0, category: '', subcategory: '', color: '', type: '', reference: ''
    }]
  });

  let [asyncDataForPersonalExpenses, setAsyncDataForPersonalExpenses] = useState([
    { id: 1, title: "Food & Groceries", icon: "bx bx-cookie", color: "info", width: 0, outflows: 0, total: 0 },
    { id: 2, title: "Home & Life", icon: "bx bx-home-smile", color: "info", width: 0, outflows: 0, total: 0 },
    { id: 3, title: "Online Platforms & Leisure", icon: "mdi mdi-wifi", color: "info", width: 0, outflows: 0, total: 0 },
    { id: 4, title: "Personal Shopping", icon: "bx bxs-t-shirt", color: "info", width: 0, outflows: 0, total: 0 },
    { id: 5, title: "Transport & Travel", icon: "mdi mdi-car", color: "info", width: 0, outflows: 0, total: 0 }
  ])

  let [asyncDataForFinancialTransactions, setAsyncDataForFinancialTransactions] = useState([
    { id: 1, title: "Deposits", icon: "mdi mdi-account-arrow-left", color: "success", width: 0, outflows: 0, total: 0 },
    { id: 2, title: "Income & Payments", icon: "fas fa-money-check-alt", color: "success", width: 0, outflows: 0, total: 0 },
    { id: 3, title: "Investments & Savings", icon: "mdi mdi-finance", color: "success", width: 0, outflows: 0, total: 0 },
    { id: 4, title: "Transfers", icon: "mdi mdi-swap-horizontal", color: "success", width: 0, outflows: 0, total: 0 },
    { id: 5, title: "Withdrawal & ATM", icon: "bx bx-money", color: "success", width: 0, outflows: 0, total: 0 },
  ])

  let [asyncDataForFinancialObligations, setAsyncDataForFinancialObligations] = useState([
    { id: 1, title: "Bills & Utilities", icon: "mdi mdi-file-document-multiple-outline", color: "danger", width: 0, outflows: 0, total: 0 },
    { id: 2, title: "Credits & Loans", icon: "bx bx-credit-card", color: "danger", width: 0, outflows: 0, total: 0 },
    { id: 3, title: "Fees & Charges", icon: "dripicons-tag", color: "danger", width: 0, outflows: 0, total: 0 },
    { id: 4, title: "Taxes", icon: "bx bx-wallet", color: "danger", width: 0, outflows: 0, total: 0 },
    { id: 5, title: "Other", icon: "bx bx-outline", color: "danger", width: 0, outflows: 0, total: 0},
  ])


  let totalExpenses = 0;
  let totalInflow = 0;
  let totalOutflow = 0;

  let totalExpenses1Week = 0;
  let totalInflows1Week = 0;
  let totalOutflows1Week = 0;
  let totalExpenses1WeekPerDay = [0, 0, 0, 0, 0, 0, 0];
  let totalInflows1WeekPerDay = [0, 0, 0, 0, 0, 0, 0];
  let totalOutflows1WeekPerDay = [0, 0, 0, 0, 0, 0, 0];
  
  useEffect(() => {
    const userNameRequestURL = env.FINVERO_TEST_SERVER + "/users/me";
    const fistRequestURL = env.FINVERO_TEST_SERVER + "/accounts";
    const allTransactionsPerAccount = [];
    const allTransactions = [];

    //Retriving the Data of all transactions per account link for active User.
    async function fetchData(){
      //Get user name
        await axios.get(userNameRequestURL, {headers})
          .then((response) => {
            setUserNameTitle(response.firstName + ' ' + response.lastName);
          })
          .catch((error) => {
            console.log(error);
          });

      //Get and process data information for dashboard
        await axios.get(fistRequestURL, {headers})
            .then(async (accounts) => {
                await accounts.forEach(async (account) => {
                    const secondRequestURL = env.FINVERO_TEST_SERVER + "/accounts/" + account.id + '/transactions';
                    //accountLinks.push(account.id);
                    const transactions = await axios.get(secondRequestURL, {headers});
                    //console.log(allTransactionsPerAccount);
                    await transactions.responseAPI.results.forEach((transaction) => {
                        //Total Expenses, Inflows and Outflows from 2024-3-9 to 2024-3-13
                        const transactionDate = new Date(transaction.accounting_date);
                        const transactionCalendarDate = transactionDate.getFullYear() + '-' + transactionDate.getMonth() + '-' + transactionDate.getDate();
                        
                        //Total Expenses, Inflows and Outflows Calculation
                        if(transaction.type === 'INFLOW'){
                            totalInflow += transaction.amount;
                            totalExpenses += transaction.amount;
                            transaction.color = 'success'

                        } else if(transaction.type === 'OUTFLOW'){
                            totalOutflow += transaction.amount;
                            totalExpenses -= transaction.amount;
                            transaction.color = 'danger'
                        }

                        allTransactions.push(transaction);

                        //Latest Transactions Component
                        const dataForLatestTransaction = {
                            totalExpenses,
                            totalInflow,
                            totalOutflow,
                            transactionsArray: allTransactions
                          }

                        switch(transactionCalendarDate){
                          case '2024-3-7':
                            totalExpenses1WeekPerDay[0] += transaction.amount;
                            (transaction.type === 'INFLOW' ? totalInflows1WeekPerDay[0] += transaction.amount : totalOutflows1WeekPerDay[0] += transaction.amount)
                            totalExpenses1Week += transaction.amount;
                            (transaction.type === 'INFLOW' ? totalInflows1Week += transaction.amount : totalOutflows1Week += transaction.amount);
                            break;
                          case '2024-3-8':
                            totalExpenses1WeekPerDay[1] += transaction.amount;
                            (transaction.type === 'INFLOW' ? totalInflows1WeekPerDay[1] += transaction.amount : totalOutflows1WeekPerDay[1] += transaction.amount)
                            totalExpenses1Week += transaction.amount;
                            (transaction.type === 'INFLOW' ? totalInflows1Week += transaction.amount : totalOutflows1Week += transaction.amount);
                            break;
                          case '2024-3-9':
                            totalExpenses1WeekPerDay[2] += transaction.amount;
                            (transaction.type === 'INFLOW' ? totalInflows1WeekPerDay[2] += transaction.amount : totalOutflows1WeekPerDay[2] += transaction.amount)
                            totalExpenses1Week += transaction.amount;
                            (transaction.type === 'INFLOW' ? totalInflows1Week += transaction.amount : totalOutflows1Week += transaction.amount);
                            break;
                          case '2024-3-10':
                            totalExpenses1WeekPerDay[3] += transaction.amount;
                            (transaction.type === 'INFLOW' ? totalInflows1WeekPerDay[3] += transaction.amount : totalOutflows1WeekPerDay[3] += transaction.amount)
                            totalExpenses1Week += transaction.amount;
                            (transaction.type === 'INFLOW' ? totalInflows1Week += transaction.amount : totalOutflows1Week += transaction.amount);
                            break;
                          case '2024-3-11':
                            totalExpenses1WeekPerDay[4] += transaction.amount;
                            (transaction.type === 'INFLOW' ? totalInflows1WeekPerDay[4] += transaction.amount : totalOutflows1WeekPerDay[4] += transaction.amount)
                            totalExpenses1Week += transaction.amount;
                            (transaction.type === 'INFLOW' ? totalInflows1Week += transaction.amount : totalOutflows1Week += transaction.amount);
                            break;
                          case '2024-3-12':
                            totalExpenses1WeekPerDay[5] += transaction.amount;
                            (transaction.type === 'INFLOW' ? totalInflows1WeekPerDay[5] += transaction.amount : totalOutflows1WeekPerDay[5] += transaction.amount)
                            totalExpenses1Week += transaction.amount;
                            (transaction.type === 'INFLOW' ? totalInflows1Week += transaction.amount : totalOutflows1Week += transaction.amount);
                            break;
                          case '2024-3-13':
                            totalExpenses1WeekPerDay[6] += transaction.amount;
                            (transaction.type === 'INFLOW' ? totalInflows1WeekPerDay[6] += transaction.amount : totalOutflows1WeekPerDay[6] += transaction.amount)
                            totalExpenses1Week += transaction.amount;
                            (transaction.type === 'INFLOW' ? totalInflows1Week += transaction.amount : totalOutflows1Week += transaction.amount);
                            break;
                          default:
                        }

                        //Category Expenses
                        switch(transaction.category){
                          //Personal Expenses
                          case 'Food & Groceries':
                            asyncDataForPersonalExpenses[0]['total'] += transaction.amount;
                            (transaction.type === 'INFLOW' ? asyncDataForPersonalExpenses[0]['outflows'] += 0 : asyncDataForPersonalExpenses[0]['outflows'] += transaction.amount);
                            asyncDataForPersonalExpenses[0]['width'] = (asyncDataForPersonalExpenses[0]['outflows'] / asyncDataForPersonalExpenses[0]['total']) * 100;
                            break;
                          case 'Home & Life':
                            asyncDataForPersonalExpenses[1]['total'] += transaction.amount;
                            (transaction.type === 'INFLOW' ? asyncDataForPersonalExpenses[1]['outflows'] += 0 : asyncDataForPersonalExpenses[1]['outflows'] += transaction.amount);
                            asyncDataForPersonalExpenses[1]['width'] = (asyncDataForPersonalExpenses[1]['outflows'] / asyncDataForPersonalExpenses[1]['total']) * 100;
                            break;
                          case 'Online Platforms & Leisure':
                            asyncDataForPersonalExpenses[2]['total'] += transaction.amount;
                            (transaction.type === 'INFLOW' ? asyncDataForPersonalExpenses[2]['outflows'] += 0 : asyncDataForPersonalExpenses[2]['outflows'] += transaction.amount);
                            asyncDataForPersonalExpenses[2]['width'] = (asyncDataForPersonalExpenses[2]['outflows'] / asyncDataForPersonalExpenses[2]['total']) * 100;
                            break;
                          case 'Personal Shopping':
                            asyncDataForPersonalExpenses[3]['total'] += transaction.amount;
                            (transaction.type === 'INFLOW' ? asyncDataForPersonalExpenses[3]['outflows'] += 0 : asyncDataForPersonalExpenses[3]['outflows'] += transaction.amount);
                            asyncDataForPersonalExpenses[3]['width'] = (asyncDataForPersonalExpenses[3]['outflows'] / asyncDataForPersonalExpenses[3]['total']) * 100;
                            break;
                          case 'Transport & Travel':
                            asyncDataForPersonalExpenses[4]['total'] += transaction.amount;
                            (transaction.type === 'INFLOW' ? asyncDataForPersonalExpenses[4]['outflows'] += 0 : asyncDataForPersonalExpenses[4]['outflows'] += transaction.amount);
                            asyncDataForPersonalExpenses[4]['width'] = (asyncDataForPersonalExpenses[4]['outflows'] / asyncDataForPersonalExpenses[4]['total']) * 100;
                            break;

                          //Financial Transactions
                          case 'Deposits':
                            asyncDataForFinancialTransactions[0]['total'] += transaction.amount;
                            (transaction.type === 'INFLOW' ? asyncDataForFinancialTransactions[0]['outflows'] += 0 : asyncDataForFinancialTransactions[0]['outflows'] += transaction.amount);
                            asyncDataForFinancialTransactions[0]['width'] = (asyncDataForFinancialTransactions[0]['outflows'] / asyncDataForFinancialTransactions[0]['total']) * 100;
                            break;
                          case 'Income & Payments':
                            asyncDataForFinancialTransactions[1]['total'] += transaction.amount;
                            (transaction.type === 'INFLOW' ? asyncDataForFinancialTransactions[1]['outflows'] += 0 : asyncDataForFinancialTransactions[1]['outflows'] += transaction.amount);
                            asyncDataForFinancialTransactions[1]['width'] = (asyncDataForFinancialTransactions[1]['outflows'] / asyncDataForFinancialTransactions[1]['total']) * 100;
                            break;
                          case 'Investments & Savings':
                            asyncDataForFinancialTransactions[2]['total'] += transaction.amount;
                            (transaction.type === 'INFLOW' ? asyncDataForFinancialTransactions[2]['outflows'] += 0 : asyncDataForFinancialTransactions[2]['outflows'] += transaction.amount);
                            asyncDataForFinancialTransactions[2]['width'] = (asyncDataForFinancialTransactions[2]['outflows'] / asyncDataForFinancialTransactions[2]['total']) * 100;
                            break;
                          case 'Transfers':
                            asyncDataForFinancialTransactions[3]['total'] += transaction.amount;
                            (transaction.type === 'INFLOW' ? asyncDataForFinancialTransactions[3]['outflows'] += 0 : asyncDataForFinancialTransactions[3]['outflows'] += transaction.amount);
                            asyncDataForFinancialTransactions[3]['width'] = (asyncDataForFinancialTransactions[3]['outflows'] / asyncDataForFinancialTransactions[3]['total']) * 100;
                            break;
                          case 'Withdrawal & ATM':
                            asyncDataForFinancialTransactions[4]['total'] += transaction.amount;
                            (transaction.type === 'INFLOW' ? asyncDataForFinancialTransactions[4]['outflows'] += 0 : asyncDataForFinancialTransactions[4]['outflows'] += transaction.amount);
                            asyncDataForFinancialTransactions[4]['width'] = (asyncDataForFinancialTransactions[4]['outflows'] / asyncDataForFinancialTransactions[4]['total']) * 100;
                            break;

                          //Financial Obligations
                          case 'Bills & Utilities':
                            asyncDataForFinancialObligations[0]['total'] += transaction.amount;
                            (transaction.type === 'INFLOW' ? asyncDataForFinancialObligations[0]['outflows'] += 0 : asyncDataForFinancialObligations[0]['outflows'] += transaction.amount);
                            asyncDataForFinancialObligations[0]['width'] = (asyncDataForFinancialObligations[0]['outflows'] / asyncDataForFinancialObligations[0]['total']) * 100;
                            break;
                          case 'Credits & Loans':
                            asyncDataForFinancialObligations[1]['total'] += transaction.amount;
                            (transaction.type === 'INFLOW' ? asyncDataForFinancialObligations[1]['outflows'] += 0 : asyncDataForFinancialObligations[1]['outflows'] += transaction.amount);
                            asyncDataForFinancialObligations[1]['width'] = (asyncDataForFinancialObligations[1]['outflows'] / asyncDataForFinancialObligations[1]['total']) * 100;
                            break;
                          case 'Fees & Charges':
                            asyncDataForFinancialObligations[2]['total'] += transaction.amount;
                            (transaction.type === 'INFLOW' ? asyncDataForFinancialObligations[2]['outflows'] += 0 : asyncDataForFinancialObligations[2]['outflows'] += transaction.amount);
                            asyncDataForFinancialObligations[2]['width'] = (asyncDataForFinancialObligations[2]['outflows'] / asyncDataForFinancialObligations[2]['total']) * 100;
                            break;
                          case 'Taxes':
                            asyncDataForFinancialObligations[3]['total'] += transaction.amount;
                            (transaction.type === 'INFLOW' ? asyncDataForFinancialObligations[3]['outflows'] += 0 : asyncDataForFinancialObligations[3]['outflows'] += transaction.amount);
                            asyncDataForFinancialObligations[3]['width'] = (asyncDataForFinancialObligations[3]['outflows'] / asyncDataForFinancialObligations[3]['total']) * 100;
                            break;
                          case null:
                            asyncDataForFinancialObligations[4]['total'] += transaction.amount;
                            (transaction.type === 'INFLOW' ? asyncDataForFinancialObligations[4]['outflows'] += 0:  asyncDataForFinancialObligations[4]['outflows'] += transaction.amount);
                            asyncDataForFinancialObligations[4]['width'] = (asyncDataForFinancialObligations[4]['outflows'] / asyncDataForFinancialObligations[4]['total']) * 100;
                        }

                        //Overview Component
                        const dataForOverview = {

                          total: {
                            Expenses: totalExpenses1Week,
                            Inflows: totalInflows1Week,
                            Outflows: totalOutflows1Week
                          },
                          total1Week: [
                              {
                                name: 'Inflows',
                                type: 'column',
                                data: totalInflows1WeekPerDay
                              },
                              {
                                name: 'Outflows',
                                type: 'line',
                                data: totalOutflows1WeekPerDay
                              },
                              {
                                name: 'Total flow',
                                type: 'area',
                                data: totalExpenses1WeekPerDay
                              },
                            ]
                          }

                        setAsyncDataForOverview(dataForOverview);

                        setAsyncDataForPersonalExpenses(asyncDataForPersonalExpenses);
                        setAsyncDataForFinancialTransactions(asyncDataForFinancialTransactions);
                        setAsyncDataForFinancialObligations(asyncDataForFinancialObligations);

                        setAsyncDataForLatestTransaction(dataForLatestTransaction);
                    })
                    allTransactionsPerAccount.push(transactions.responseAPI.results);
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    fetchData();
    }, [])

  return (
    <React.Fragment>

      <header id="page-topbar">
        <div className="navbar-header" style={{backgroundColor:"#212634", paddingLeft: '25px'}}>
            <h3 style={{color:"#F9F9F9"}}>
              {'Welcome ' + userNameTitle + ' !'}
            </h3>
        </div>
      </header>

      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Optioutlet" iconSection="Menu" breadcrumbItem="Dashboard" />
          
          <Row>
            <OverView asyncProps={asyncDataForOverview}/>
          </Row>

          <Row>
            <PersonalExpenses asyncProps={asyncDataForPersonalExpenses}/>
            <FinancialTransactions asyncProps={asyncDataForFinancialTransactions}/>
            <FinancialObligations asyncProps={asyncDataForFinancialObligations}/>
          </Row>

          <LatestTransation asyncProps={asyncDataForLatestTransaction}/>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
