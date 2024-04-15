import React, { useEffect, useState } from "react";
import { Button, Row, Col, CardBody, Card, Alert, Container, Input, Label, Form } from "reactstrap";
import { useNavigate } from 'react-router-dom';

// action
import { apiError } from "../../store/actions";

//redux
import { useDispatch } from "react-redux";

import { Link } from "react-router-dom";

// import images
import logolight from '../../assets/images/logo-light.png';
import logodark from '../../assets/images/logo-dark.png';

// Environment Variables
import env from "react-dotenv";

//Axios Request Library
import axios from 'axios';

const Register = props => {
    document.title = "Register | Finvero Test";
    const navigate = useNavigate();

    const [emailText, setEmailText] = useState('');
    const [firstNameText, setFirstNameText] = useState('');
    const [lastNameText, setLastNameText] = useState('');
    const [passwordText, setPasswordText] = useState('');
    const [confirmPasswordText, setConfirmPasswordText] = useState('');

    const [emailInvalid, setEmailInvalid] = useState(false);
    const [confirmPasswordInvalid, setConfirmPasswordInvalid] = useState(false);

    const [submitButtonVisibility, setSubmitButtonVisibility] = useState(false);
    const [errorAlertVisibility, setErrorAlertVisibility] = useState(false);
    const [userCreationAlertVisibility, setUserCreationAlertVisibility] = useState(false);

    const [errorAlertMessage, setErrorAlertMessage] = useState();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(apiError(""));
    }, [dispatch]);

    const handleInputChange = (event) => {
        let textValue = String(event.target.value).trim();

        function allFieldsValidation(emailInvalid, confirmPasswordInvalid){
            if(emailInvalid && confirmPasswordInvalid
                && emailText && confirmPasswordText){
                setSubmitButtonVisibility(true)
            }else{
                setSubmitButtonVisibility(false);
            }
        }

        switch(event.target.name){
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                setEmailText(textValue);
                //Setting Invalidation Field Alert
                if(emailRegex.test(textValue)){
                    setEmailInvalid(false);
                    allFieldsValidation(true, !confirmPasswordInvalid)
                }else{
                    setEmailInvalid(true);
                    setSubmitButtonVisibility(false);
                }
                break;
            case 'firstname':
                setFirstNameText(textValue);
                break;
            case 'lastname':
                setLastNameText(textValue);
                break;
            case 'password':
                setPasswordText(textValue);
                //Setting Invalidation Field Alert
                if(confirmPasswordText === textValue){
                    setConfirmPasswordInvalid(false);
                    allFieldsValidation(!emailInvalid, true)
                }else{
                    setConfirmPasswordInvalid(true);
                    setSubmitButtonVisibility(false);
                }
                break;

            case 'confirmpassword':
                setConfirmPasswordText(textValue);
                //Setting Invalidation Field Alert
                if(passwordText === textValue){
                    setConfirmPasswordInvalid(false);
                    allFieldsValidation(!emailInvalid, true)
                }else{
                    setConfirmPasswordInvalid(true);
                    setSubmitButtonVisibility(false);
                }
                break;
            default:
        }
    }

    async function handleSubmit (){
        const requestURL = env.FINVERO_TEST_SERVER + "/auth/signup";
        const data = {
            email: emailText,
            password: passwordText,
            firstName: firstNameText,
            lastName: lastNameText
        }

        //This whole process takes a while as a user is created into the Database, and belvo Bank Accounts are associated with it!
        await axios.post(requestURL, data).then((response) => {
            setUserCreationAlertVisibility(true);
            const requestforCreatingBankAccount = {
                requestURL: env.FINVERO_TEST_SERVER + "/accounts",
                data: {
                    institution: 'gringotts_mx_retail',
                    username: 'username',
                    password: 'full'
                },
                headers: {
                    'Authorization': 'Bearer ' + response.accessToken
                }
            }
            axios.post(requestforCreatingBankAccount.requestURL, requestforCreatingBankAccount.data, {headers: requestforCreatingBankAccount.headers})
                .then(async () => {
                    requestforCreatingBankAccount.data = {
                        institution: 'erebor_mx_retail',
                        username: 'username',
                        password: 'full'
                    }
                    await axios.post(requestforCreatingBankAccount.requestURL, requestforCreatingBankAccount.data, {headers: requestforCreatingBankAccount.headers})
                        .then(() => {
                            setErrorAlertVisibility(false);
                            navigate('/dashboard', { state: { accessToken: response.accessToken } })
                        })
                        .catch((error) => {
                            console.log(error);
                            setErrorAlertMessage('Erebor Account could not be created');
                            setUserCreationAlertVisibility(false);
                            setErrorAlertVisibility(true);
                        })
                })
                .catch((error) => {
                    console.log(error);
                    setErrorAlertMessage('Gringotts Account could not be created');
                    setUserCreationAlertVisibility(false);
                    setErrorAlertVisibility(true);
                })
        }).catch((error) => {
            console.log(error);
            setErrorAlertMessage('User could not be created');
            setUserCreationAlertVisibility(false);
            setErrorAlertVisibility(true);
        });
    }

    return (
        <div className="bg-pattern" style={{height:"100vh"}}>
        <div className="bg-overlay"></div>
        <div className="account-pages pt-5">
            <Container>
                <Row className="justify-content-center">
                    <Col lg={6} md={8} xl={4}>
                        <Card className='mt-5'>
                            <CardBody className="p-4">
                                <div className="text-center">
                                    <Link to="/" className="">
                                        <img src={logodark} alt="" height="24" className="auth-logo logo-dark mx-auto" />
                                        <img src={logolight} alt="" height="24" className="auth-logo logo-light mx-auto" />
                                    </Link>
                                </div>

                                <Form
                                    className="form-horizontal"
                                    onSubmit={handleSubmit}
                                    >
                                    {errorAlertVisibility ? (
                                        <Alert color="danger">
                                            {'ERROR:' + errorAlertMessage}
                                        </Alert>
                                    ) : null}

                                    {userCreationAlertVisibility ? (
                                        <Alert color="info">
                                            {'Please wait, user & bank accounts are being created...'}
                                        </Alert>
                                    ) : null}

                                    <Row>
                                        <Col md={12}>
                                            <div className="mb-4">
                                            <Label className="form-label">Email</Label>
                                                <Input
                                                name="email"
                                                type="text"
                                                placeholder="Enter your email"
                                                onChange={handleInputChange}
                                                value={emailText}
                                                invalid={emailInvalid}
                                                />
                                            </div>
                                            <div className="mb-4">
                                            <Label className="form-label">First Name</Label>
                                                <Input
                                                name="firstname"
                                                type="text"
                                                placeholder="Enter your first name"
                                                onChange={handleInputChange}
                                                value={firstNameText}
                                                />
                                            </div>
                                            <div className="mb-4">
                                            <Label className="form-label">Last Name</Label>
                                                <Input
                                                name="lastname"
                                                type="text"
                                                placeholder="Enter your last name"
                                                onChange={handleInputChange}
                                                value={lastNameText}
                                                />
                                            </div>
                                            <div className="mb-4">
                                            <Label className="form-label">Password</Label>
                                                <Input
                                                name="password"
                                                type="password"
                                                placeholder="Enter your password"
                                                onChange={handleInputChange}
                                                value={passwordText}
                                                />
                                            </div>
                                            <div className="mb-4">
                                            <Label className="form-label">Confirm Password</Label>
                                                <Input
                                                name="confirmpassword"
                                                type="password"
                                                placeholder="Enter your password"
                                                onChange={handleInputChange}
                                                value={confirmPasswordText}
                                                invalid={confirmPasswordInvalid}
                                                />
                                            </div>

                                            <Row style={{marginLeft: 'auto', marginRight: '0.5rem'}}>
                                                { submitButtonVisibility ?
                                                    <Button className="d-grid mt-4" color="success" style={{width: 'auto', margin: '0.5rem'}} onClick={() => handleSubmit()}>
                                                        Register
                                                    </Button> :
                                                    <Button className="d-grid mt-4" color='info' style={{width: 'auto', margin: '0.5rem'}}>
                                                        <Link to="/login" className="fw-medium" style={{color: '#FFFFFF'}}> Log In </Link>
                                                    </Button>
                                                     }
                                            </Row>
                                            
                                        </Col>
                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    </div>
    );
};

export default Register;
