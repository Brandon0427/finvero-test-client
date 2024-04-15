import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { Button, Row, Col, CardBody, Card, Alert, Container, Form, Input, Label } from "reactstrap";

import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";

// Environment Variables
import env from "react-dotenv";

//Axios Request Library
import axios from 'axios';

const Login = props => {
  document.title = "Login | Finvero Test";
  const navigate = useNavigate();

  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');

  const [emailInvalid, setEmailInvalid] = useState(false);

  const [submitButtonVisibility, setSubmitButtonVisibility] = useState(false);
  const [errorAlertVisibility, setErrorAlertVisibility] = useState(false);

  useEffect(() => {
    document.body.className = "bg-pattern";
    // remove classname when component will unmount
    return function cleanup() {
      document.body.className = "";
    };
  });

  const handleInputChange = (event) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let textValue = String(event.target.value).trim();

    switch(event.target.name){
        case 'email':
            setEmailText(textValue);
            //Setting Invalidation Field Alert
            if(emailRegex.test(textValue)){
                setEmailInvalid(false);
                if(passwordText){
                  setSubmitButtonVisibility(true);
                }
            }else{
                setEmailInvalid(true);
                setSubmitButtonVisibility(false);
            }
            break;
        case 'password':
            setPasswordText(textValue);
            //Setting Invalidation Field Alert
            if(emailRegex.test(emailText)){
              if(textValue){
                setSubmitButtonVisibility(true);
              }
            }else{
              setSubmitButtonVisibility(false);
            }
            break;
        default:
    }
}

async function handleSubmit (){
    const requestURL = env.FINVERO_TEST_SERVER + "/auth/signin";
    const data = {
        email: emailText,
        password: passwordText,
    }
    await axios.post(requestURL, data).then((response) => {
        setErrorAlertVisibility(false);
        navigate('/dashboard', { state: { accessToken: response.accessToken } })
    }).catch((error) => {
        console.log(error);
        setErrorAlertVisibility(true);
    });
}

  return (
    <React.Fragment>
    
    <div className="bg-overlay"></div>
    <div className="account-pages my-5 pt-5">
      <Container>
        <Row className="justify-content-center">
            <Col lg={6} md={8} xl={4}>
                <Card className='mt-5'>
                    <CardBody className="p-4">

                        <Form
                            className="form-horizontal"
                            onSubmit={handleSubmit}
                            >
                            {errorAlertVisibility ? (
                                <Alert color="danger">
                                    ERROR: Could not Sign In
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
                                    <Label className="form-label">Password</Label>
                                        <Input
                                        name="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        onChange={handleInputChange}
                                        value={passwordText}
                                        />
                                    </div>

                                    <Row style={{marginLeft: 'auto', marginRight: '0.5rem'}}>
                                        { submitButtonVisibility ?
                                            <Button className="d-grid mt-4" color="info" style={{width: 'auto', margin: '0.5rem'}} onClick={() => handleSubmit()}>
                                                Log In
                                            </Button> :
                                            <Button className="d-grid mt-4" color='success' style={{width: 'auto', margin: '0.5rem'}}>
                                                <Link to="/register" className="fw-medium" style={{color: '#FFFFFF'}}> Register a New User </Link>
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
  </React.Fragment>
  );
};

export default withRouter(Login);

Login.propTypes = {
  history: PropTypes.object,
};
